// types/jasmine-core.d.ts
declare module 'jasmine-core' {
  /** The jasmineRequire object exported by jasmine-core's boot file. */
  interface JasmineRequire {
    version: string | (() => string);
    [key: string]: unknown;
  }

  const jasmineRequire: JasmineRequire;

  export default jasmineRequire;
}
