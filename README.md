# busy-indicators

`busy-indicators` is a lightweight, framework-agnostic package for managing and tracking busy states across different tasks. Ideal for tracking async operations, background tasks, or other processes.

**Note for React Users:** This package will not trigger re-renders on state updates, so be sure to understand how it works in a React project to manage states effectively.

## Installation

Install the package via npm:

```bash
npm install busy-indicators
```

## Usage

### Basic Example (Vanilla JS)

```tsx
import { isBusy } from "busy-indicators";

// Set the task as busy (implicitly registers the key if enforceRegistration is not enabled)
isBusy.set("myTask", true);

// Check if the task is busy
console.log(isBusy.check("myTask")); // Output: true

// Set the task as not busy
isBusy.set("myTask", false);

// Check again
console.log(isBusy.check("myTask")); // Output: false
```

### More of a Rearl-World Example (React)

```tsx
import { isBusy } from "busy-indicators";

// OPTIONAL: Initialize the busy state manager. You can provide a custom type
// that will enforce the shape of the busy state object. It must be an object
// with enum or string keys.
isBusy.init<Record<string, any>>({
  enforceRegistration: true,
});

// Register a key to enforce its usage if `enforceRegistration` is enabled.
// You can also register a key with an initial value to enforce a specific type.
isBusy.register("fetchingData");

const MyComponent = () => {
  // Optionally register and remove it within the component lifecycle
  useEffect(() => {
    isBusy.register("fetchingData");
    return () => isBusy.remove("fetchingData");
  }, []);

  const fetchData = async () => {
    if (isBusy.check("fetchingData")) return; // Check if already busy
    isBusy.set("fetchingData"); // Sets busy state to `true` by default

    try {
      // Simulate a task
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      isBusy.set("fetchingData", false); // Mark as no longer busy
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <p>Fetching Data: {isBusy.check("fetchingData") ? "Loading..." : "Complete"}</p>
    </div>
  );
};

export default MyComponent;
```

## Example with Multiple Busy States (React)

This package can track multiple tasks simultaneously by using unique keys.

```tsx
import { isBusy } from "busy-indicators";

const MyComponent = () => {
  // Register multiple keys and remove them when the component unmounts
  useEffect(() => {
    isBusy.register("processA");
    isBusy.register("processB");
    return () => {
      isBusy.remove("processA");
      isBusy.remove("processB");
    };
  }, []);

  const startProcessA = () => isBusy.set("processA", true);
  const startProcessB = () => isBusy.set("processB", true);

  const stopProcessA = () => isBusy.set("processA", false);
  const stopProcessB = () => isBusy.set("processB", false);

  return (
    <div>
      <p>Process A: {isBusy.check("processA") ? "Running" : "Idle"}</p>
      <p>Process B: {isBusy.check("processB") ? "Running" : "Idle"}</p>
      <button onClick={startProcessA}>Start Process A</button>
      <button onClick={stopProcessA}>Stop Process A</button>
      <button onClick={startProcessB}>Start Process B</button>
      <button onClick={stopProcessB}>Stop Process B</button>
    </div>
  );
};
```

## API

The `isBusy` singleton provides methods to optionally provide the instance with configuration options, as well as `add`, `get`, `set`, and `remove` busy states.

### `init`

`init(options?: InitOptions<T>)`

- `enforceRegistration`: If true, requires keys to be registered before use.
- `initialStates`: Initializes the entire state object with a predefined set of keys and values.

```ts
isBusy.init({
  enforceRegistration: true,
  initialStates: { myTask: false },
});
```

### `add`

`add(key: string, initialState: any = false)`: Adds a new key with an optional initial state.

```ts
isBusy.add("myTask", false);
```

### `remove`

`remove(key: string)`: Removes a key and its associated state.

```ts
isBusy.remove("myTask");
```

### `set`

`set(key: string, value: any = true)`: Updates the state for a given key, defaulting to true.

```ts
isBusy.set("myTask", true);
```

### `get`

`get(key: string): any`: Returns the state for the specified key or false if the key doesn’t exist.

```ts
const isTaskBusy = isBusy.check("myTask");
```

## Why Use This Package?

- Particularly useful in performance-sensitive applications.
- Lightweight: Simple and minimal, it works across different frameworks, including React.
- TypeScript Support: Fully typed for seamless integration into TypeScript projects.

## Installation Requirements

This package is framework-agnostic and compatible with essentially all JavaScript/TypeScript applications.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open issues for bug reports or feature requests.

## Author

Created by Angus Ryer [https://ryer.io](https://ryer.io)
