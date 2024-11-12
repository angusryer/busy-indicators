import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { isBusy } from "./BusyIndicatorManager";

describe("BusyIndicatorManager", () => {
  beforeEach(() => {
    isBusy.init(); // Reset the manager before each test
  });

  test("should set and get values without enforcing registration", () => {
    isBusy.set("task1", true);
    expect(isBusy.get("task1")).toBe(true);

    isBusy.set("task1", false);
    expect(isBusy.get("task1")).toBe(false);
  });

  test("should default to `true` when setting without value", () => {
    isBusy.set("task2");
    expect(isBusy.get("task2")).toBe(true);
  });

  test("should return `false` for unregistered keys without enforced registration", () => {
    expect(isBusy.get("unknownKey")).toBe(false);
  });

  test("should add keys with an initial value", () => {
    isBusy.add("task3", "inProgress");
    expect(isBusy.get("task3")).toBe("inProgress");
    expect(isBusy.get("task3")).not.toBe(true);
  });

  test("should default to `false` when adding keys without an initial value", () => {
    isBusy.add("task4");
    expect(isBusy.get("task4")).toBe(false);
  });

  test("should remove a key", () => {
    isBusy.set("task5", true);
    isBusy.remove("task5");
    expect(isBusy.get("task5")).toBe(false);
  });

  describe("with enforced registration", () => {
    beforeEach(() => {
      isBusy.init({ enforceRegistration: true });
    });

    test("should not set value for unregistered key with enforced registration", () => {
      console.warn = jest.fn();
      isBusy.set("unregisteredTask", true);
      expect(console.warn).toHaveBeenCalledWith(
        `Key "unregisteredTask" is not registered. Use "register" to register it first.`
      );
      expect(isBusy.get("unregisteredTask")).toBe(false);
    });

    test("should allow setting and getting values for registered keys", () => {
      isBusy.add("registeredTask", false);
      isBusy.set("registeredTask", true);
      expect(isBusy.get("registeredTask")).toBe(true);
    });

    test("should warn and return false when getting an unregistered key with enforced registration", () => {
      console.warn = jest.fn();
      expect(isBusy.get("unregisteredTask")).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(`Key "unregisteredTask" is not registered.`);
    });
  });

  test("should initialize with custom initial states", () => {
    isBusy.init({ initialStates: { preloadedTask: "initial" } });
    expect(isBusy.get("preloadedTask")).toBe("initial");
  });
});
