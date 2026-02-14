export const extend = Object.assign;

export const isObject = (val) => {
  return typeof val === "object" && val !== null;
};

export const hasChanged = (newValue, oldValue) => {
  return !Object.is(newValue, oldValue);
};

export const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj, key);

export const camelize = (str) =>
  str.replace(/-(\w)/g, (_, c: string) => (c ? c.toUpperCase() : ""));

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const toHandlerKey = (str) => (str ? `on${capitalize(str)}` : "");
