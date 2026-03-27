/**
 * Core operation type for envelope data flow.
 */
export type EnvelopeType = 'PERSIST' | 'SYNC' | 'EVENT';

/**
 * Generic data envelope used for persistence, synchronization, and event transport.
 */
export interface DataEnvelope<T> {
  /** Source plugin identifier. */
  pluginId: string;
  /** Data schema version for future migrations. */
  version: string;
  /** Unix timestamp (milliseconds) when the record is created/saved. */
  timestamp: number;
  /** Operation category of the envelope. */
  type: EnvelopeType;
  /** Actual business payload. */
  payload: T;
}

/**
 * Host-provided storage proxy abstraction.
 */
export interface IStorageProxy {
  /** Read value by key. Returns null when key does not exist. */
  get<T>(key: string): Promise<T | null>;
  /** Save value by key with optional schema version. */
  save<T>(key: string, data: T, version?: string): Promise<void>;
}

/**
 * Host-provided event bus abstraction for plugin communication.
 */
export interface IEventBus {
  /** Emit an event with payload. */
  emit(event: string, payload: any): void;
  /** Subscribe to an event. */
  on(event: string, callback: (payload: any) => void): void;
  /** Unsubscribe from an event. */
  off(event: string, callback: (payload: any) => void): void;
}

/**
 * App context injected by host into each plugin.
 */
export interface IAppContext {
  /** Persistent storage service provided by host. */
  storage: IStorageProxy;
  /** Event bus service provided by host. */
  eventBus: IEventBus;
  /** Current host theme mode. */
  theme: 'light' | 'dark';
  /** Runtime configuration object from host. */
  runtimeConfig: Record<string, any>;
}

/**
 * Standard contract that every plugin must implement.
 */
export interface IPlugin {
  /** Unique plugin identifier (for example: plugin-trello). */
  id: string;
  /** Display name shown in host UI. */
  name: string;
  /** Plugin semantic version string. */
  version: string;
  /** Mount plugin UI into container with injected host context. */
  mount(container: HTMLElement, context: IAppContext): void | Promise<void>;
  /** Unmount plugin UI from container and perform cleanup. */
  unmount(container: HTMLElement): void | Promise<void>;
}
