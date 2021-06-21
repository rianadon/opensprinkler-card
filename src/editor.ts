/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult,
  CSSResult,
  css,
  internalProperty,
} from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor, ActionConfig } from 'custom-card-helpers';

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
  @internalProperty() private _config?: OpensprinklerCardConfig;
  @internalProperty() private _toggle?: boolean;
  @internalProperty() private _helpers?: any;
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

  get _name(): string {
    return this._config?.name || '';
  }

  get _device(): string | undefined {
    return this._config?.device;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    const selector = { device: { integration: 'opensprinkler' } };

    return html`
      <div class="card-config">
        <div class="option" .option=${'required'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.required.icon}`}></ha-icon>
            <div class="title">${options.required.name}</div>
          </div>
          <div class="secondary">${options.required.secondary}</div>
        </div>
        <div class="values">
          <ha-selector-device
            label="Device (Required)"
            .value=${this._device}
            @value-changed=${this._valueChanged}
            .selector=${selector}
            .hass=${this.hass}
            .configValue=${'device'}
          ></ha-selector-device>
          <paper-input
            label="Name (Optional)"
            .value=${this._name}
            .configValue=${'name'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
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
    if (!this._config || !this.hass) return;

    const target = ev.target as any;
    const value = ev.detail?.value ?? target.value;

    if (this[`_${target.configValue}`] === value) return;

    if (target.configValue) {
      if (value === '') {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResult {
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
