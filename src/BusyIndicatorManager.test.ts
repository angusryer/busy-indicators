import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { isBusy } from "./BusyIndicatorManager";

describe("BusyIndicatorManager", () => {
  beforeEach(() => {
    isBusy.init(); // Reset the manager before each test
  });

  test("should set and get values without strict mode", () => {
    isBusy.set("task1", true);
    expect(isBusy.get("task1")).toBe(true);

    isBusy.set("task1", false);
    expect(isBusy.get("task1")).toBe(false);
  });

  test("should default to `true` when setting without value", () => {
    isBusy.set("task2");
    expect(isBusy.get("task2")).toBe(true);
  });

  test("should return `false` for unregistered keys when strict is disabled", () => {
    expect(isBusy.get("unknownKey")).toBe(false);
  });

  test("should add keys with an initial value", () => {
    isBusy.add("task3", "inProgress");
    expect(isBusy.get("task3")).toBe("inProgress");
  });

  test("should warn if a key is already registered", () => {
    console.warn = jest.fn();
    isBusy.add("task4", "initial");
    isBusy.add("task4", "duplicate"); // Should trigger warning
    expect(console.warn).toHaveBeenCalledWith(
      `Key "task4" is already registered and has value "initial".`
    );
  });

  test("should default to `false` when adding keys without an initial value", () => {
    isBusy.add("task5");
    expect(isBusy.get("task5")).toBe(false);
  });

  test("should remove a key", () => {
    isBusy.set("task6", true);
    isBusy.remove("task6");
    expect(isBusy.get("task6")).toBe(false);
  });

  describe("with strict mode enabled", () => {
    beforeEach(() => {
      isBusy.init({ strict: true, createOnGet: false });
    });

    test("should throw an error when setting an unregistered key in strict mode", () => {
      console.warn = jest.fn();
      expect(() => isBusy.set("unregisteredTask", true)).toThrow(
        `Key "unregisteredTask" is not registered. Use "add" to register it first.`
      );
    });

    test("should allow setting and getting values for registered keys in strict mode", () => {
      isBusy.add("registeredTask", false);
      isBusy.set("registeredTask", true);
      expect(isBusy.get("registeredTask")).toBe(true);
    });

    test("should throw an error when getting an unregistered key in strict mode", () => {
      console.warn = jest.fn();
      expect(() => isBusy.get("unregisteredTask")).toThrow(
        `Key "unregisteredTask" is not registered.`
      );
    });
  });

  describe("with createOnGet enabled", () => {
    beforeEach(() => {
      isBusy.init({ createOnGet: true, strict: true });
    });

    test("should create a key with fallback value on get if not registered", () => {
      console.warn = jest.fn();
      expect(isBusy.get("newTask", "newState")).toBe("newState");
      expect(console.warn).toHaveBeenCalledWith(
        `Key "newTask" is not registered. Registered with fallback value: newState`
      );
      expect(isBusy.get("newTask")).toBe("newState");
    });

    test("should create a key with default `false` if fallback is not provided", () => {
      console.warn = jest.fn();
      expect(isBusy.get("anotherNewTask")).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        `Key "anotherNewTask" is not registered. Registered with fallback value: false`
      );
      expect(isBusy.get("anotherNewTask")).toBe(false);
    });
  });

  describe("initialStates option in init", () => {
    test("should initialize with custom initial states", () => {
      isBusy.init({ initialStates: { preloadedTask: "initial" } });
      expect(isBusy.get("preloadedTask")).toBe("initial");
    });
  });

  test("should throw an error when removing an unregistered key in strict mode", () => {
    isBusy.init({ strict: true });
    console.warn = jest.fn();
    expect(() => isBusy.remove("nonexistentTask")).toThrow(
      `Key "nonexistentTask" is not registered. Use "add" to register it first.`
    );
  });
});
