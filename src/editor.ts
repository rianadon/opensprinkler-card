/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { LitElement, html, TemplateResult, CSSResultGroup, css } from 'lit';
import { customElement, state, property } from "lit/decorators";
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { OpensprinklerCardConfig } from './types';

const options = {
  required: {
    icon: 'tune',
    name: 'Required',
    secondary: 'Required options for this card to function',
  }
};

@customElement('opensprinkler-card-editor')
export class BoilerplateCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: OpensprinklerCardConfig;
  @state() private _helpers?: any;
  private _initialized = false;

  public setConfig(config: OpensprinklerCardConfig): void {
    this._config = config;

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  private _computeLabel(schema: any) {
    if (schema.name == 'device') return 'Device (Required)';
    if (schema.name == 'name') return 'Name (Optional)';
    return '';
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    const schema = [
      { name: 'device', selector: { device: { integration: 'opensprinkler', manufacturer: 'OpenSprinkler' } } },
      { name: 'name', selector: { text: {} } },
    ];

    return html`
      <div class="card-config">
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${schema}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
      </div>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, 'config-changed', { config: ev.detail.value });

  }

  static get styles(): CSSResultGroup {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
        display: grid;
      }
      ha-formfield {
        padding-bottom: 8px;
      }
    `;
  }
}
