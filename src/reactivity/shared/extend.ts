export const extend = Object.assign;

export const isObject = (val) => {
  return typeof val === "object" && val !== null;
};

export const hasChanged = (newValue, oldValue) => {
  return !Object.is(newValue, oldValue);
};
