import { LovelaceCardConfig } from 'custom-card-helpers';
import { TimerBarConfig } from 'lovelace-timer-bar-card/src/types';

export enum ControlType {
  Station = "station",
  Program = "program",
  RunOnce = "run-once"
};

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
export interface OpensprinklerCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  device?: string;
  bars?: TimerBarConfig;
  card_stations?: string[];
}
