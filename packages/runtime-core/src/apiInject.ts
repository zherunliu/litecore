import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    let { providers } = currentInstance;
    const parentProviders = currentInstance.parent.providers;
    if (providers === parentProviders) {
      // use prototype to avoid mutation
      providers = currentInstance.providers = Object.create(parentProviders);
    }
    providers[key] = value;
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const parentProviders = currentInstance.parent.providers;
    if (key in parentProviders) {
      return parentProviders[key];
    } else if (defaultValue) {
      if (typeof defaultValue === "function") {
        return defaultValue();
      }
      return defaultValue;
    }
  }
}
