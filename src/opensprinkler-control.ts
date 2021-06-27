import { mdiPlay, mdiStop } from "@mdi/js";
import { LitElement, css, html, TemplateResult, PropertyValues } from 'lit';
import { customElement, state, property } from "lit/decorators";
import { HomeAssistant } from 'custom-card-helpers';

import { localize } from 'lovelace-timer-bar-card/src/timer-bar-entity-row';

import {
  EntitiesFunc, isController, isEnabled, isProgram, isRunOnce, isStation,
  osName, stateActivated, stateStoppable } from './helpers';
import { HassEntity, OpensprinklerCardConfig } from './types';

@customElement('opensprinkler-control')
export class OpensprinklerControl extends LitElement {

  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entities!: EntitiesFunc;
  @property() public controller!: string;
  @property() public entity!: HassEntity;
  @property() public config!: OpensprinklerCardConfig;

  @state() private _loading = false;
  @state() private _stopping = false;

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (changedProps.has("hass")) {
      this._loading = false;
      // Only mark a stop operation as complete when all stations have turned off
      if (this.entities(isStation).every(s => s.state === 'idle'))
        this._stopping = false;
    }
  }

  protected render(): TemplateResult | void {
    if (!this.entity) return html`<hui-warning>Entity not found</hui-warning>`;

    const loading = this._loading || this._stopping;
    const enabled = this._enabled();
    if (typeof enabled === 'undefined') return html`<hui-warning>Enable switch for entity not found</hui-warning>`;

    const config = {
      entity: this.entity.entity_id, name: osName(this.entity),
      icon: this._icon(enabled),
      hide_dots: this.config.hide_dots,
    };

    return html`<opensprinkler-generic-entity-row .config=${config} .hass=${this.hass} .stateObj=${this.entity}>
      ${this._state(enabled)}
      ${loading ? html`<mwc-circular-progress indeterminate density="-4"></mwc-circular-progress>`
      : html`<mwc-icon-button label="Run station" class="button" @click=${() => this._toggleEntity(this.entity)} .disabled=${!enabled}>
        <ha-svg-icon .path=${this._toggleIcon()}></ha-svg-icon>
      </mwc-icon-button>`}
    </opensprinkler-generic-entity-row>`;
  }

  private _state(enabled: boolean) {
    if (isRunOnce(this.entity)) return 'Running';
    if (isStation(this.entity)) {
      if (this.entity.state === 'idle' && !enabled) return 'Disabled';
      if (this.entity.state === 'once_program') return 'Once Program';
      return localize(this.hass, this.entity.state, this.entity);
    }
    if (isProgram(this.entity)) {
      if (status === 'off' && !enabled) return 'Disabled';
      return status === 'on' ? 'Running' : 'Off';
    }
    return;
  }

  private _icon(enabled: boolean) {
    if (isRunOnce(this.entity)) return 'mdi:auto-fix';
    if (isStation(this.entity)) {
      let base = enabled ? 'mdi:water' : 'mdi:water-off';
      if (stateActivated(this.entity))
        return base;
      return base + '-outline';
    }
    if (isProgram(this.entity)) {
      let base = enabled ? 'mdi:timer' : 'mdi:timer-off';
      if (this.entity.state === 'on')
        return base;
      return base + '-outline';
    }
    return;
  }

  private _toggleIcon() {
    return stateStoppable(this.entity) ? mdiStop : mdiPlay;
  }

  private _enabled(): boolean | undefined {
    if (isRunOnce(this.entity)) return true;
    return isEnabled(this.entity, this.entities);
  }

  private _toggleEntity(entity: HassEntity) {
    const service = stateStoppable(entity) ? 'stop' : 'run';
    let entity_id = entity.entity_id;

    const isStoppingProgram = service === 'stop' && isProgram(entity);

    if (entity_id === 'run_once' || isStoppingProgram) {
      this._stopping = true;
      entity_id = this.entities(isController)[0].entity_id;
    } else {
      this._loading = true;
    }

    if (service === 'stop' && isStation(entity))
      this.hass.callService('opensprinkler', service, { entity_id });
    else
      this.hass.callService('opensprinkler', service, { entity_id, run_seconds: this._runtime() });
  }

  private _runtime() {
    if (!this.config.input_number?.entity) return undefined;
    const entity = this.hass.states[this.config.input_number.entity];
    if (!entity) return;

    return Number(entity.state) * 60;
  }

  static get styles() {
    return css`
      opensprinkler-generic-entity-row { height: var(--opensprinkler-line-height); }

      .button {
        color: var(--secondary-text-color);
        --mdc-icon-button-size: 40px;
        margin-inline-end: -8px;
        margin-inline-start: 4px;
      }

      mwc-circular-progress {
        margin-inline-start: 8px;
        margin-inline-end: -4px;
      }
    `;
  }
}
