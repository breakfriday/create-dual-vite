# @break_happy/create-dual-vite

Create a React application that can run as a deployed web site or as a local file/Electron renderer.

```bash
pnpm create @break_happy/dual-vite my-app
```

## Commands in a generated project

```bash
pnpm dev
pnpm build:web
pnpm build:filelocal
pnpm lint
```

Web builds use browser history and a configurable base path. File-local builds use relative assets and hash routing, loaded by Electron with `loadFile()`.
