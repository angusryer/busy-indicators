export type BusyState = Record<string, any>;

export interface InitOptions<T = BusyState> {
  enforceRegistration?: boolean;
  initialStates?: T;
}

class BusyIndicatorManager<T extends Record<string, any> = BusyState> {
  private states: T;
  private enforceRegistration: boolean;

  constructor() {
    this.states = {} as T; // Initialize with an empty object of type T
    this.enforceRegistration = false;
  }

  // Optional init method
  init(options?: InitOptions<T>): void {
    this.states = (options?.initialStates || {}) as T;
    this.enforceRegistration = options?.enforceRegistration || false;
  }

  // Register a key with an optional initial state (defaults to false if no initialState is provided)
  add<K extends keyof T>(key: K, initialState: T[K] = false as T[K]): void {
    if (!(key in this.states)) {
      this.states[key] = initialState;
    }
  }

  // Remove a key from the states
  remove<K extends keyof T>(key: K): void {
    delete this.states[key];
  }

  // Set the state for a specific key, defaulting to true if no value is provided
  set<K extends keyof T>(key: K, value: T[K] = true as T[K]): void {
    if (this.enforceRegistration && !(key in this.states)) {
      console.warn(`Key "${String(key)}" is not registered. Use "register" to register it first.`);
      return;
    }
    this.states[key] = value;
  }

  // Check the state for a specific key, returning false if the key is not found
  get<K extends keyof T>(key: K): T[K] | false {
    if (this.enforceRegistration && !(key in this.states)) {
      console.warn(`Key "${String(key)}" is not registered.`);
      return false;
    }
    return this.states[key] ?? false;
  }
}

const isBusy = new BusyIndicatorManager();
export { isBusy };
export default isBusy;
