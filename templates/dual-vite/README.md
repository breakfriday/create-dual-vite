# __APP_NAME__

## Development

```bash
pnpm install
pnpm dev
```

## Build targets

| Command | Output | Routing | Asset paths |
| --- | --- | --- | --- |
| `pnpm build:web` | `dist/` | Browser History | `VITE_APP_BASE` from `.env.web` |
| `pnpm build:filelocal` | `dist-filelocal/` | Hash History | Relative (`./`) |

For Electron, load `dist-filelocal/index.html` with `hash: "/"`. Configure an absolute `VITE_API_BASE_URL` in `.env.filelocal`, because a `file://` page cannot use the web server's relative `/api` endpoint.

## Application conventions

- Add endpoint paths to `src/shared/api/config.ts`.
- Use `apiClient` from `src/shared/api/http.ts`; it injects the Zustand auth token and clears it after a 401.
- Put global UI state in `src/shared/store/app.store.ts` and auth state in `src/shared/store/auth.store.ts`.
- Add domain code to `src/features/`; do not put business code in the shared layer.
