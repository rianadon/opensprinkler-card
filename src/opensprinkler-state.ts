import { html } from "lit";
import { EntityConfig, HomeAssistant } from "custom-card-helpers";
import { osName } from "./helpers";

export class OpensprinklerState extends HTMLElement {
  private element?: any;

  private _config?: EntityConfig;
  private _hass?: HomeAssistant;

  async connectedCallback() {
    const helpers = await (window as any).loadCardHelpers();
    this.element = helpers.createRowElement(this._config);

    this.element.hass = this._hass;
    this.appendChild(this.element);
  }

  disconnectedCallback() {
    this.removeChild(this.element);
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

export function renderState(entity: string|EntityConfig, hass: HomeAssistant, moreInfo?: any) {
  let config: EntityConfig;

  if (typeof entity === 'string') {
    const state = hass.states[entity];
    config = { entity, name: osName(state) };
  } else {
    config = entity;
  }

  if (!entity) return html`<hui-warning>Entity not found</hui-warning>`;

  return html`<opensprinkler-state .config=${config} .hass=${hass} @hass-more-info=${moreInfo}></opensprinkler-state>`;
}
