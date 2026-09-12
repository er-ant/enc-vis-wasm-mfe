# Encryption Visualisation with WASM and Microfrontends
App allows to add new visualisation cards with microfrontends and see how encryption algorithms (implemented with WASM) work.

Idea of this project I got many years ago, but technologies (Microfrontend monorepo and WASM) were raw back then. Now I decided time has come to implement this and check if technologies became mature. (spoiler: no, they didn't)

Architecture consists of Shell app made with Angular (best choice, provides routing, state with DI and many more by default) and microfrontends (Angular & React).

## WASM
[Check here for info](https://github.com/er-ant/enc-vis-wasm-mfe/blob/master/assets/wasm/README.md)

## Summary Microfrontends
Heterogeneous apps are still painful to integrate:
1. Builders still generate different outputs with different formats: Webpack - `remoteEntry.js`, ESBuild - `remoteEntry.json`, Vite - `mf-manifest.json` (Module Federation 2.0). Need more adapters or unification between builders.
2. Webpack is not favourite between developers, but it is the only tool can be used to match everything together.
3. Instead of all these fancy solutions I advice to use some old-fashioned CI/CD tools with scripts and patch build proccess and results. You can inject apps as Web Components, through iFrame or even build them, patch and put inside the app as sources.
4. React builders have their own implementation of React core features. For example Vite uses own jsxDev runtime and internal modules with `__vite__` prefixes, while Webpack expects `__webpack__` modules.
5. Angular still breaks build process every new major version, forces to set proper Angular version with double check. Still same as in 2016.
6. If you still wanna use NX or same for heterogeneous app: prepare yourself for a loooong journey full of pain and suffer :)

## More detailed

### Shell (Webpack) + Angular-mfe (Webpack) + React-mfe (Vite)
Vite doesn't provide `remoteEntry.js` in dev mode and returns HTML with app instead, need to build React app first and serve via `preview`.
```
nx build react-mfe
nx preview react-mfe
```
HMR for React-MFE doesn't work in shell, but works in standalone serve. Sometimes it strikes with `jsxDev` errors due to Vite's specific.

### Shell (ESBuild) + Angular-mfe (ESBuild) + React-mfe (Webpack)
Here I had a lot of hope, but it didn't work.

For ESBuild you can use only `native-federation-esbuild`, but it provides and expects `remoteEntry.json` which is deep linked with Angular. Thus you cannot plug React-mfe into Angular-mfe.

Same with Vite. Vite generates `mf-manifest.json` (Module Federation 2.0), while Native Federation expects `remoteEntry.json`.

### ### Shell (Webpack) + Angular-mfe (Webpack) + React-mfe (Webpack)
Everything is quite smooth, but Webpack provided `remoteEntry.js` for React is not compatible with Angular shell (provided `var` in bundle instead of `ESM`), helped:
```
webpack.config.js
  library: {
    type: 'module',
  },
```
