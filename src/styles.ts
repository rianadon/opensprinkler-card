import { css } from 'lit';

export const styles = css`
  opensprinkler-timer-bar-entity-row {
    height: var(--opensprinkler-timer-height);
  }

  opensprinkler-state {
    height: var(--opensprinkler-line-height);
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
`;
