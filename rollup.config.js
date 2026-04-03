import typescript from "@rollup/plugin-typescript";

export default {
  input: "./packages/vue/src/index.ts",
  output: [
    {
      format: "cjs",
      file: "./packages/vue/dist/lite-core.cjs.js",
      sourcemap: true,
    },
    {
      format: "es",
      file: "./packages/vue/dist/lite-core.esm.js",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      declarationDir: "./packages/vue/dist",
    }),
  ],
};
