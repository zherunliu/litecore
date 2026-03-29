import { ReactiveEffect } from "../reactivity/effect";
import { queuePreFlushCb } from "./scheduler";

export function watchEffect(fn) {
  // 组件渲染之前执行
  function job() {
    effect.run();
  }

  let cleanup;
  const onCleanup = function (cleanupFn) {
    cleanup = effect.onStop = cleanupFn;
  };
  function getter() {
    if (cleanup) {
      cleanup();
    }
    fn(onCleanup);
  }

  const effect = new ReactiveEffect(getter, () => {
    queuePreFlushCb(job);
  });

  effect.run();

  return () => {
    effect.stop();
  };
}
