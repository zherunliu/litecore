import { createRenderer } from "../../lib/lite-core.esm.js";
import { App } from "./App.js";

const game = new PIXI.Application();

await game.init({
  width: 500,
  height: 500,
});

document.body.append(game.canvas);

const render = createRenderer({
  createElement(type) {
    if (type === "rect") {
      const rect = new PIXI.Graphics();
      rect.rect(0, 0, 100, 100);
      rect.fill(0xff0000);
      return rect;
    }
  },
  patchProp(el, key, val) {
    el[key] = val;
  },
  insert(el, container) {
    container.addChild(el);
  },
});

render.createApp(App).mount(game.stage);
