import { mdiClose, mdiPlay, mdiStop } from "@mdi/js";
import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators";
import { computeDomain, fireEvent, HomeAssistant } from "custom-card-helpers";
import { OpensprinklerCardConfig, HassEntity } from "./types";
import "./opensprinkler-state";
import { OpensprinklerCard } from "./opensprinkler-card";
import { haStyleDialog, haStyleMoreInfo } from "./ha_style";
import { EntitiesFunc, hasRunOnce, isController, isProgram,
         isStation, isStationProgEnable, stateStoppable } from "./helpers";

export interface MoreInfoDialogParams {
  entityId: string | null;
}

@customElement("opensprinkler-more-info-dialog")
export class MoreInfoDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entities!: EntitiesFunc;
  @property({ attribute: false }) public parent!: OpensprinklerCard;

  @property({ type: Boolean, reflect: true }) public large = false;

  @property() public config!: OpensprinklerCardConfig;

  @state() private _entityId?: string | null;

  @state() private _loading?: string;
  @state() private _stopping?: string;

  public showDialog(params: MoreInfoDialogParams) {
    this._entityId = params.entityId;
    if (!this._entityId) {
      this.closeDialog();
      return;
    }
    this.large = false;
  }

  public closeDialog() {
    this._entityId = undefined;
    // fireEvent(this, "dialog-closed", { dialog: this.localName });
  }

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (changedProps.has("hass")) {
      this._loading = undefined;
      // Only mark a stop operation as complete when all stations have turned off
      if (this.entities(isStation).every(s => s.state === 'idle'))
        this._stopping = undefined;
    }
  }

  protected render() {
    if (!this._entityId) {
      return html``;
    }
    const entityId = 'binary_sensor.updater';
    const stateObj = this.hass.states[entityId];
    const domain = computeDomain(entityId);

    if (!stateObj) {
      return html``;
    }

    return html`
      <ha-dialog
        open
        @closed=${this.closeDialog}
        .heading=${true}
        hideActions
        data-domain=${domain}
      >
        <div slot="heading" class="heading">
          <ha-header-bar>
            <mwc-icon-button
              slot="navigationIcon"
              dialogAction="cancel"
              .label=${this.hass.localize(
                "ui.dialogs.more_info_control.dismiss"
              )}
            >
              <ha-svg-icon .path=${mdiClose}></ha-svg-icon>
            </mwc-icon-button>
            <div slot="title" class="main-title" @click=${this._enlarge}>
              ${this.config.name}
            </div>
          </ha-header-bar>
        </div>
        <div class="content">
          <!--<state-card-content in-dialog .stateObj=${stateObj} .hass=${this.hass}></state-card-content>-->
          ${this._renderStates()}
          <more-info-content
            .stateObj=${stateObj}
            .hass=${this.hass}
          ></more-info-content>
          ${stateObj.attributes.restored
            ? html`
                <p>
                  ${this.hass.localize(
                    "ui.dialogs.more_info_control.restored.not_provided"
                  )}
                </p>
                <p>
                  ${this.hass.localize(
                    "ui.dialogs.more_info_control.restored.remove_intro"
                  )}
                </p>
              `
            : ""}
        </div>
      </ha-dialog>
    `;
  }

  private _renderHeading(title: string) {
    return html`<div role="heading" class="header">${title}</div>`;
  }

  private _renderState(domain: string, suffix: string) {
    const entity = this.entities(id => id.startsWith(domain+'.') && id.endsWith(suffix))[0];
    if (!entity) return html`<hui-warning>Entity not found</hui-warning>`;
    const config = { entity: entity.entity_id, name: entity.attributes.friendly_name.replace('OpenSprinkler ', '') };
    return html`<opensprinkler-state domain=${domain} .config=${config} .hass=${this.hass} @hass-more-info=${this._moreInfo}></opensprinkler-state>`;
  }

  private _renderControl(entity: HassEntity, enabled: boolean | undefined, config: any) {
    const loading = entity.entity_id === this._loading || entity.entity_id === this._stopping;
    if (typeof enabled === 'undefined') return html`<hui-warning>Enable switch for entity not found</hui-warning>`;

    return html`<opensprinkler-generic-entity-row .config=${config} .hass=${this.hass} @hass-more-info=${this._moreInfo} style="height: 32px">
      ${config.state}
      ${loading ? html`<mwc-circular-progress indeterminate density="-4"></mwc-circular-progress>`
      : html`<mwc-icon-button label="Run station" class="button" @click=${() => this._toggleEntity(entity)} .disabled=${!enabled}>
        <ha-svg-icon .path=${_toggleIcon(entity)}></ha-svg-icon>
      </mwc-icon-button>`}
    </opensprinkler-generic-entity-row>`;
  }

  private _renderStation(entity: HassEntity) {
    const enabled = this._enabled(entity);
    return this._renderControl(entity, enabled, {
      entity: entity.entity_id, name: entity.attributes.name,
      icon: this._stationIcon(entity),
      state: _stationStatus(entity.state, enabled!),
    });
  }

  private _renderProgram(entity: HassEntity) {
    const enabled = this._enabled(entity);
    return this._renderControl(entity, enabled, {
      entity: entity.entity_id, name: entity.attributes.name,
      icon: this._programIcon(entity),
      state: _programStatus(entity.state, enabled!),
    });
  }

  private _renderRunOnce() {
    const entity = { entity_id: 'run_once', state: 'on' } as HassEntity;
    return this._renderControl(entity, true, {
      name: 'Run Once Program',
      icon: 'mdi:auto-fix',
      state: 'Running'
    });
  }

  private _renderStates() {
    return [
      this._renderState('switch', 'opensprinkler_enabled'),
      this._renderState('sensor', 'flow_rate'),
      this._renderState('binary_sensor', 'rain_delay_active'),
      this._renderState('sensor', 'rain_delay_stop_time'),
      this._renderState('sensor', 'water_level'),
      this._renderState('binary_sensor', 'sensor_1_active'),
      this._renderState('binary_sensor', 'sensor_2_active'),
      this._renderHeading('Stations'),
    ]
    .concat(this.entities(isStation).map(s => {
      return this._renderStation(s);
    }))
    .concat([
      this._renderHeading('Programs'),
      hasRunOnce(this.entities) ? this._renderRunOnce() : html``,
    ])
    .concat(this.entities(isProgram).map(s => {
      return this._renderProgram(s);
    }));
  }

  private _enlarge() {
    this.large = !this.large;
  }

  private _moreInfo(e: CustomEvent) {
    this.closeDialog();
    fireEvent(this.parent, "hass-more-info", e.detail);
  }

  private _toggleEntity(entity: HassEntity) {
    const service = stateStoppable(entity) ? 'stop' : 'run';
    let entity_id = entity.entity_id;

    const isStoppingProgram = service === 'stop' && entity.entity_id.endsWith('_program_running');

    if (entity_id === 'run_once' || isStoppingProgram) {
      this._stopping = entity_id;
      entity_id = this.entities(isController)[0].entity_id;
    } else {
      this._loading = entity_id;
    }

    this.hass.callService('opensprinkler', service, { entity_id });
  }

  static get styles() {
    return [
      haStyleDialog,
      haStyleMoreInfo,
      css`
        opensprinkler-state, opensprinkler-generic-entity-row {
          height: 32px;
        }

        .button {
          color: var(--secondary-text-color);
          --mdc-icon-button-size: 40px;
          margin-right: -8px;
          margin-left: 4px;
        }

        mwc-circular-progress {
          margin-left: 8px;
          margin-right: -4px;
        }

        opensprinkler-state {
          color: var(--primary-text-color);
          display: flex;
          justify-content: center;
          flex-direction: column;
        }

        .header {
          margin-left: 56px;
          margin-top: 16px;
          color: var(--secondary-text-color);
        }
      `,
    ];
  }

  private _enabled(entity: HassEntity): boolean | undefined {
    const switches = this.entities(isStationProgEnable);
    return switches.find(e => (
      e.attributes.index == entity.attributes.index &&
      e.attributes.opensprinkler_type == entity.attributes.opensprinkler_type
    ))?.state === 'on';
  }

  private _stationIcon(entity: HassEntity) {
    let base = this._enabled(entity) ? 'mdi:water' : 'mdi:water-off';
    if (entity.state === 'program' || entity.state === 'manual' || entity.state === 'once_program')
      return base;
    return base + '-outline';
  }

  private _programIcon(entity: HassEntity) {
    let base = this._enabled(entity) ? 'mdi:timer' : 'mdi:timer-off';
    if (entity.state === 'on')
      return base;
    return base + '-outline';
  }
}

function _toggleIcon(entity: HassEntity) {
  return stateStoppable(entity) ? mdiStop : mdiPlay;
}

function _stationStatus(status: string, enabled: boolean) {
  if (status === 'idle' && !enabled) return 'Disabled';
  if (status === 'once_program') return 'Once Program';
  return _capitalize(status);
}

function _programStatus(status: string, enabled: boolean) {
  if (status === 'off' && !enabled) return 'Disabled';
  return status === 'on' ? 'Running' : 'Off';
}

function _capitalize(word: string) {
  return word[0].toUpperCase() + word.substring(1);
}
