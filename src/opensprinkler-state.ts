import { EntityConfig, HomeAssistant } from "custom-card-helpers";

const ELEMENTS = {
  'switch': 'hui-toggle-entity-row',
  'sensor': 'hui-sensor-entity-row',
  'binary_sensor': 'hui-text-entity-row',
}

export class OpensprinklerState extends HTMLElement {
  private element?: any;

  private _config?: EntityConfig;
  private _hass?: HomeAssistant;

  connectedCallback() {
    const domain = this.getAttribute('domain')!;
    this.element = document.createElement(ELEMENTS[domain]);
    this.element.hass = this._hass;
    this.element.setConfig(this._config);
    this.appendChild(this.element);
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this.element) this.element.hass = hass;
  }

  set config(config: EntityConfig) {
    this._config = config;
    if (this.element) this.element.setConfig(config);
  }
}

window.customElements.define('opensprinkler-state', OpensprinklerState);
