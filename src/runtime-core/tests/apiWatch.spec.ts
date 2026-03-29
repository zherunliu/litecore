import { reactive } from "../../reactivity/reactive";
import { nextTick } from "../scheduler";
import { watchEffect } from "../apiWatch";

describe("api: watch", () => {
  test("effect", async () => {
    const state = reactive({
      count: 0,
    });

    let dummy;
    watchEffect(() => {
      dummy = state.count;
    });

    expect(dummy).toBe(0);
    state.count++;
    await nextTick();
    expect(dummy).toBe(1);
  });

  test("stop the effect", async () => {
    const state = reactive({
      count: 0,
    });

    let dummy;
    const stop = watchEffect(() => {
      dummy = state.count;
    });

    expect(dummy).toBe(0);
    state.count++;
    await nextTick();
    expect(dummy).toBe(1);

    stop();
    state.count++;
    await nextTick();
    expect(dummy).toBe(1);
  });

  test("cleanup effect", async () => {
    const state = reactive({
      count: 0,
    });

    let dummy;
    const cleanup = jest.fn();

    const stop = watchEffect((onCleanup) => {
      dummy = state.count;
      onCleanup(cleanup);
    });

    expect(dummy).toBe(0);

    state.count++;
    await nextTick();
    expect(dummy).toBe(1);
    expect(cleanup).toHaveBeenCalledTimes(1);

    stop();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});
