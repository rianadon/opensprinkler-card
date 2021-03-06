/**
 * This file is adapted from the Home Assistant frontend.
 * See src/data/entity_registry.ts in the frontend repository.
 *
 * It has been modified to use public libraries rather than
 * the internal Home Assistant ones. Some stuff has also been removed.
*/

import { Connection, createCollection } from "home-assistant-js-websocket";
import { debounce, HomeAssistant } from "custom-card-helpers";

export interface EntityRegistryEntry {
  entity_id: string;
  name: string | null;
  icon: string | null;
  platform: string;
  config_entry_id: string | null;
  device_id: string | null;
  area_id: string | null;
  disabled_by: string | null;
}

export interface ExtEntityRegistryEntry extends EntityRegistryEntry {
  unique_id: string;
  capabilities: Record<string, unknown>;
  original_name?: string;
  original_icon?: string;
}

export interface UpdateEntityRegistryEntryResult {
  entity_entry: ExtEntityRegistryEntry;
  reload_delay?: number;
  require_restart?: boolean;
}

export interface EntityRegistryEntryUpdateParams {
  name?: string | null;
  icon?: string | null;
  area_id?: string | null;
  disabled_by?: string | null;
  new_entity_id?: string;
}

export const findBatteryEntity = (
  hass: HomeAssistant,
  entities: EntityRegistryEntry[]
): EntityRegistryEntry | undefined =>
  entities.find(
    (entity) =>
      hass.states[entity.entity_id] &&
      hass.states[entity.entity_id].attributes.device_class === "battery"
  );

export const findBatteryChargingEntity = (
  hass: HomeAssistant,
  entities: EntityRegistryEntry[]
): EntityRegistryEntry | undefined =>
  entities.find(
    (entity) =>
      hass.states[entity.entity_id] &&
      hass.states[entity.entity_id].attributes.device_class ===
        "battery_charging"
  );

export const getExtendedEntityRegistryEntry = (
  hass: HomeAssistant,
  entityId: string
): Promise<ExtEntityRegistryEntry> =>
  hass.callWS({
    type: "config/entity_registry/get",
    entity_id: entityId,
  });

export const updateEntityRegistryEntry = (
  hass: HomeAssistant,
  entityId: string,
  updates: Partial<EntityRegistryEntryUpdateParams>
): Promise<UpdateEntityRegistryEntryResult> =>
  hass.callWS({
    type: "config/entity_registry/update",
    entity_id: entityId,
    ...updates,
  });

export const removeEntityRegistryEntry = (
  hass: HomeAssistant,
  entityId: string
): Promise<void> =>
  hass.callWS({
    type: "config/entity_registry/remove",
    entity_id: entityId,
  });

export const fetchEntityRegistry = (conn) =>
  conn.sendMessagePromise({
    type: "config/entity_registry/list",
  });

const subscribeEntityRegistryUpdates = (conn, store) =>
  conn.subscribeEvents(
    debounce(
      () =>
        fetchEntityRegistry(conn).then((entities) =>
          store.setState(entities, true)
        ),
      500,
      true
    ),
    "entity_registry_updated"
  );

export const subscribeEntityRegistry = (
  conn: Connection,
  onChange: (entities: EntityRegistryEntry[]) => void
) =>
  createCollection<EntityRegistryEntry[]>(
    "_entityRegistry",
    fetchEntityRegistry,
    subscribeEntityRegistryUpdates,
    conn,
    onChange
  );
