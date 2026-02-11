import { createApp } from "../../lib/lite-core.esm.js";
import { App } from "../helloworld/App.js";

const rootComponent = document.querySelector("#app");
createApp(App).mount(rootComponent);
