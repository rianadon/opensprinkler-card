/**
 * Dialog styles from the Home Assistant frontend.
 * These are copied verbatim, but just put into their own file.
 */

import { css } from "lit";

export const haStyleDialog = css`
  /* prevent clipping of positioned elements */
  paper-dialog-scrollable {
    --paper-dialog-scrollable: {
      -webkit-overflow-scrolling: auto;
    }
  }

  /* force smooth scrolling for iOS 10 */
  paper-dialog-scrollable.can-scroll {
    --paper-dialog-scrollable: {
      -webkit-overflow-scrolling: touch;
    }
  }

  .paper-dialog-buttons {
    align-items: flex-end;
    padding: 8px;
    padding-bottom: max(env(safe-area-inset-bottom), 8px);
  }

  @media all and (min-width: 450px) and (min-height: 500px) {
    ha-paper-dialog {
      min-width: 400px;
    }
  }

  @media all and (max-width: 450px), all and (max-height: 500px) {
    paper-dialog,
    ha-paper-dialog {
      margin: 0;
      width: calc(
        100% - env(safe-area-inset-right) - env(safe-area-inset-left)
      ) !important;
      min-width: calc(
        100% - env(safe-area-inset-right) - env(safe-area-inset-left)
      ) !important;
      max-width: calc(
        100% - env(safe-area-inset-right) - env(safe-area-inset-left)
      ) !important;
      max-height: calc(100% - var(--header-height));

      position: fixed !important;
      bottom: 0px;
      left: env(safe-area-inset-left);
      right: env(safe-area-inset-right);
      overflow: scroll;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }

  /* mwc-dialog (ha-dialog) styles */
  ha-dialog {
    --mdc-dialog-min-width: 400px;
    --mdc-dialog-max-width: 600px;
    --mdc-dialog-heading-ink-color: var(--primary-text-color);
    --mdc-dialog-content-ink-color: var(--primary-text-color);
    --justify-action-buttons: space-between;
  }

  ha-dialog .form {
    padding-bottom: 24px;
    color: var(--primary-text-color);
  }

  a {
    color: var(--primary-color);
  }

  /* make dialog fullscreen on small screens */
  @media all and (max-width: 450px), all and (max-height: 500px) {
    ha-dialog {
      --mdc-dialog-min-width: calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );
      --mdc-dialog-max-width: calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );
      --mdc-dialog-min-height: 100%;
      --mdc-dialog-max-height: 100%;
      --mdc-shape-medium: 0px;
      --vertial-align-dialog: flex-end;
    }
  }
  mwc-button.warning {
    --mdc-theme-primary: var(--error-color);
  }
  .error {
    color: var(--error-color);
  }
`;

export const haStyleMoreInfo = css`
  ha-dialog {
    --dialog-surface-position: static;
    --dialog-content-position: static;
  }

  ha-header-bar {
    --mdc-theme-on-primary: var(--primary-text-color);
    --mdc-theme-primary: var(--mdc-theme-surface);
    flex-shrink: 0;
    display: block;
  }

  @media all and (max-width: 450px), all and (max-height: 500px) {
    ha-header-bar {
      --mdc-theme-primary: var(--app-header-background-color);
      --mdc-theme-on-primary: var(--app-header-text-color, white);
      border-bottom: none;
    }
  }

  .heading {
    border-bottom: 1px solid
      var(--mdc-dialog-scroll-divider-color, rgba(0, 0, 0, 0.12));
  }

  @media all and (min-width: 451px) and (min-height: 501px) {
    ha-dialog {
      --mdc-dialog-max-width: 90vw;
    }

    .content {
      width: 352px;
    }

    ha-header-bar {
      width: 400px;
    }

    .main-title {
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
    }

    :host([large]) .content {
      width: calc(90vw - 48px);
    }

    :host([large]) ha-dialog[data-domain="camera"] .content,
    :host([large]) ha-header-bar {
      width: 90vw;
    }
  }

  state-card-content,
  ha-more-info-history,
  ha-more-info-logbook:not(:last-child) {
    display: block;
    margin-bottom: 16px;
  }
`;
