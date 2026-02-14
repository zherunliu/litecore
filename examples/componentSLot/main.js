import { createApp } from "../../lib/lite-core.esm.js";
import { App } from "../componentSlot/App.js";

const rootComponent = document.querySelector("#app");
createApp(App).mount(rootComponent);
