import { EntityConfig } from 'custom-card-helpers';
import { TimerBarConfig } from 'lovelace-timer-bar-card/src/types';

export declare type HassEntity = {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    user_id: string | null;
  };
  attributes: {
    [key: string]: any;
  };
};


// TODO Add your configuration elements here for type-checking
export interface OpensprinklerCardConfig {
  type: string;
  name?: string;
  icon?: string;
  device?: string;
  bars?: TimerBarConfig;
  extra_entities?: string[];
  input_number?: EntityConfig;
  hide_disabled?: boolean;
}
