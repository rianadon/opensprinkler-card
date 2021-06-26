import { ControlType, HassEntity } from "./types";

export type EntitiesFunc = (predicate: (entity: HassEntity) => boolean) => HassEntity[];

const MANUAL_ID = 99;
const RUN_ONCE_ID = 254;

const WAITING_STATES = ['waiting'];
const ACTIVE_STATES = ['program', 'once_program', 'manual', 'on'];
const STOPPABLE_STATES = [...ACTIVE_STATES, ...WAITING_STATES]

export const isStation    = (entity: HassEntity) =>
    entity.attributes?.opensprinkler_type === ControlType.Station &&
    entity.entity_id.startsWith('sensor.') &&
    entity.entity_id.endsWith('_status');
export const isProgram    = (entity: HassEntity) =>
    entity.attributes?.opensprinkler_type === ControlType.Program &&
    entity.entity_id.startsWith('binary_sensor.') &&
    entity.entity_id.endsWith('_program_running');
export const isController = (entity: HassEntity) =>
    entity.attributes?.opensprinkler_type === ControlType.Controller &&
    entity.entity_id.startsWith('switch.') &&
    entity.entity_id.endsWith('_enabled');
export const isRunOnce = (entity: HassEntity) => entity.entity_id === 'run_once';
export const isState = (entity: HassEntity) => !entity.attributes?.opensprinkler_type;
export const isStationProgEnable = (entity: HassEntity) =>
    entity.entity_id.startsWith('switch.') && entity.entity_id.endsWith('_enabled');

export const getControlType = (entity: HassEntity) => {
    switch (true) {
        case isController(entity): return ControlType.Controller;
        case isStation(entity): return ControlType.Station;
        case isProgram(entity): return ControlType.Program;
        case isRunOnce(entity): return ControlType.RunOnce;
        default: return ControlType.State;
    }
}

export function hasRunOnce(entities: EntitiesFunc) {
    return entities(isStation).some(e => e.attributes.running_program_id === RUN_ONCE_ID);
}
export function hasManual(entities: EntitiesFunc) {
    return entities(isStation).some(e => e.attributes.running_program_id === MANUAL_ID);
}

export const stateWaiting   = (entity: HassEntity) => WAITING_STATES.includes(entity.state);
export const stateStoppable = (entity: HassEntity) => STOPPABLE_STATES.includes(entity.state);
export const stateActivated = (entity: HassEntity) => ACTIVE_STATES.includes(entity.state)

export function osName(entity: HassEntity){
    return entity.attributes.name || entity.attributes.friendly_name
        .replace(/ Station Status$/, '').replace(/ Program Running$/, '').replace(/^OpenSprinkler /, '');
}

export function isEnabled(entity: HassEntity, func: EntitiesFunc) {
    return func(isStationProgEnable).find(e => (
      e.attributes.index == entity.attributes.index &&
      e.attributes.opensprinkler_type == entity.attributes.opensprinkler_type
    ))?.state === 'on';
}
