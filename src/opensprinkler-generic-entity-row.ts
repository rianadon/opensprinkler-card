/**
 * This is a modified version of hui-generic-entity-row from Home Assistant.
 * A more info button is added, and the code has been simplified for the limitted
 * needs of the OpenSprinkler card.
 */

import { mdiDotsVertical } from "@mdi/js";
import { css, CSSResultGroup, html, LitElement,
         PropertyValues, TemplateResult } from "lit";
import { property } from "lit/decorators";
import { classMap } from "lit/directives/class-map";
import { fireEvent, HomeAssistant, computeRTL } from "custom-card-helpers";

class OpensprinklerGenericEntityRow extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property() public stateObj?: any;

  @property() public config?: any;

  @property() public secondaryText?: string;

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }
    const hasSecondary = this.secondaryText || this.config.secondary_info;
    const spanStyle = this.config.title ? "font-size: 1.1em" : "";

    return html`
      <state-badge
        .hass=${this.hass}
        .overrideIcon=${this.config.icon}
        .overrideImage=${this.config.image}
        .stateColor=${this.config.state_color}
        .stateObj=${this.stateObj}
        @click=${this._handleClick}
      ></state-badge>
      <div
        class="info ${classMap({
          "text-content": !hasSecondary,
        })}"
      >
        <span style=${spanStyle}>${this.config.name}</span>
        ${hasSecondary
          ? html`<div class="secondary">${this.secondaryText}</div>`
          : ""}
      </div>
      <slot></slot>
      <mwc-icon-button
        class="more-info"
        label="Open more info"
        @click=${this._handleClick}
        tabindex="0"
        style="margin-inline-end: -8px"
      >
        <ha-svg-icon .path=${mdiDotsVertical}></ha-svg-icon>
      </mwc-icon-button>
    `;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has("hass")) {
      this.toggleAttribute("rtl", computeRTL(this.hass!));
    }
  }

  private _handleClick() {
    fireEvent(this, 'hass-more-info', { entityId: this.config.entity });
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        align-items: center;
        flex-direction: row;
        --mdc-icon-button-size: 40px;
      }
      .info {
        margin-left: 16px;
        margin-right: 8px;
        flex: 1 1 30%;
      }
      .info,
      .info > * {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .flex ::slotted(*) {
        margin-left: 8px;
        min-width: 0;
      }
      .flex ::slotted([slot="secondary"]) {
        margin-left: 0;
      }
      .secondary,
      ha-relative-time {
        color: var(--secondary-text-color);
      }
      state-badge {
        flex: 0 0 40px;
      }
      :host([rtl]) .flex {
        margin-left: 0;
        margin-right: 16px;
      }
      :host([rtl]) .flex ::slotted(*) {
        margin-left: 0;
        margin-right: 8px;
      }
      .more-info {
        color: var(--secondary-text-color);
      }
    `;
  }
}
customElements.define("opensprinkler-generic-entity-row", OpensprinklerGenericEntityRow);
