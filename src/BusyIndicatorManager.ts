export type BusyState = Record<string, any>;

export interface InitOptions<T = BusyState> {
  /**
   * If true, will throw an error for any operation that attempts to access a state
   * that has not been registered with the `add` method.
   */
  strict?: boolean;
  /**
   * If true, will create a state with a fallback value when trying to get a state
   * that has not been registered with the `add` method.
   * @note This option effectively overrides `strict` for the `get` method,
   * allowing unregistered keys to be created with a default or provided value.
   * @default true
   */
  createOnGet?: boolean;
  /**
   * An optional initial set of states to preload into the manager.
   */
  initialStates?: T;
}

class BusyIndicatorManager<T extends Record<string, any> = BusyState> {
  private states: T;
  private strict: boolean;
  private createOnGet: boolean;

  constructor() {
    this.states = {} as T;
    this.strict = false;
    this.createOnGet = true;
  }

  /**
   * Initialize the manager with optional settings.
   * @param options Configuration options.
   */
  init(options?: InitOptions<T>): void {
    this.states = (options?.initialStates || {}) as T;
    this.strict = options?.strict || false;
    this.createOnGet = options?.createOnGet ?? true;
  }

  /**
   * Register a new state key with an optional initial value.
   * @param key The key to register.
   * @param initialState The initial value to set (defaults to `false` if not provided).
   */
  add<K extends keyof T>(key: K, initialState: T[K] = false as T[K]): void {
    if (!(key in this.states)) {
      this.states[key] = initialState;
    } else {
      console.warn(
        `Key "${String(key)}" is already registered and has value "${this.states[key]}".`
      );
    }
  }

  /**
   * Remove a state key.
   * @param key The key to remove.
   * @throws Will throw an error if `strict` mode is enabled and the key does not exist.
   */
  remove<K extends keyof T>(key: K): void {
    if (this.strict && !(key in this.states)) {
      const error = `Key "${String(key)}" is not registered. Use "add" to register it first.`;
      console.warn(error);
      throw new Error(error);
    }
    if (key in this.states) {
      delete this.states[key];
    }
  }

  /**
   * Set the state for a specific key.
   * @param key The key to set.
   * @param value The value to set (defaults to `true` if not provided).
   * @throws Will throw an error if `strict` mode is enabled and the key does not exist.
   */
  set<K extends keyof T>(key: K, value: T[K] = true as T[K]): void {
    if (this.strict && !(key in this.states)) {
      const error = `Key "${String(key)}" is not registered. Use "add" to register it first.`;
      console.warn(error);
      throw new Error(error);
    }
    this.states[key] = value;
  }

  /**
   * Retrieve the state for a specific key.
   * @param key The key to retrieve.
   * @param fallbackValue The fallback value to register if `createOnGet` is enabled
   * and the key does not exist. Defaults to `false`.
   * @returns The value of the key, or `false` if not found.
   * @throws Will throw an error if `strict` mode is enabled and `createOnGet` is `false`
   * when the key does not exist.
   */
  get<K extends keyof T>(key: K, fallbackValue: T[K] = false as T[K]): T[K] | false {
    if (this.strict && !(key in this.states)) {
      if (this.createOnGet) {
        this.add(key, fallbackValue);
        console.warn(
          `Key "${String(key)}" is not registered. Registered with fallback value: ${String(
            fallbackValue
          )}`
        );
        return fallbackValue;
      } else {
        const error = `Key "${String(key)}" is not registered.`;
        console.warn(error);
        throw new Error(error);
      }
    }
    return this.states[key] ?? false;
  }
}

const isBusy = new BusyIndicatorManager();
export { isBusy };
export default isBusy;
