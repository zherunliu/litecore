import { createApp } from "../../lib/lite-core.esm.js";
import { App } from "../currentInstance/App.js";

const rootComponent = document.querySelector("#app");
createApp(App).mount(rootComponent);
