# Orbit-Davinci / Davinvi Plugin

A small plugin that builds SendKeys-style task scripts (PowerShell + BAT) from a sequence of steps. This repository contains the Davinvi plugin used by the Orbit-Davinci toolbox.

## Features
- Visual task builder for composing key/send sequences and per-step delays
- Export tasks as a ZIP containing `.ps1` and `.bat` launchers
- Import tasks via event bus and persist to plugin storage
- Mount/unmount friendly React plugin implementing the `IPlugin` interface

## Prerequisites
- Node.js (18+ recommended)
- npm, yarn or pnpm

## Quick start (development)
1. Clone the repo

```bash
git clone <repo-url>
cd Orbit-Davinci
```

2. Install dependencies

```bash
npm install
# or `yarn` / `pnpm install`
```

3. Run the dev server

```bash
npm run dev
# open http://localhost:5173
```

4. Build for production

```bash
npm run build
npm run preview
```

## Using the plugin

The plugin is exported as the default `IPlugin` object from `src/plugin.tsx`. It exposes `mount(container, context)` and `unmount(container)` methods and will inject its styles automatically when mounted.

Basic mounting example (host application):

```ts
import plugin from './src/plugin';

// `container` is an HTMLElement the plugin can render into
// `context` should match the host `IAppContext` contract the toolbox provides
const container = document.getElementById('plugin-host');
if (container) {
  plugin.mount(container, appContext);
}

// When the host is being torn down
// plugin.unmount(container);
```

Notes:
- The plugin will create its own child element with id `plugin-davinci` inside the provided container.
- Styles are injected at runtime; there is no separate stylesheet to include.

## Events and integration

- Import tasks programmatically by emitting the `DAVINVI_IMPORT_TASKS` event on the host `eventBus`:

```ts
// `payload` can be an array of tasks or an envelope with nested arrays (the plugin will attempt to locate arrays in common keys)
appContext.eventBus.emit('DAVINVI_IMPORT_TASKS', payload);
```

- The plugin emits a `TASK_COUNT_CHANGED` event when tasks are saved to storage. Listen for it to react to changes:

```ts
appContext.eventBus.on('TASK_COUNT_CHANGED', (meta) => {
  // meta = { pluginId, count, updatedAt }
});
```

## Storage & keys
- The plugin persists tasks using the storage API exposed by the host under the key `tasks` and saves with plugin id `davinci`.

## Exported artifacts
- When you click "下載 PS1 + BAT" the plugin will generate a ZIP archive containing:
  - One `.ps1` PowerShell script per task
  - A `Click to Start.bat` wrapper that launches the generated `.ps1`

Windows note: if PowerShell execution policy prevents running the `.ps1` directly, run the provided `.bat` (it calls PowerShell with `-ExecutionPolicy Bypass`).

## Quick examples

- Example: import a simple task list

```js
const tasks = [
  { id: '1', title: 'Send A', steps: [{ modifier: 'none', key: 'a', delayAfterMs: 500 }], requireInput: false, inputMode: 'manual', manualValue: '', listValues: [] }
];
appContext.eventBus.emit('DAVINVI_IMPORT_TASKS', tasks);
```

## Troubleshooting
- If styles don't appear, ensure your bundler supports the `?inline` import used for styles. The plugin injects styles at mount time using an inline string.
- If you see stale cached bundles in development, unregister service workers and clear the browser cache.

## Contributing
- Open issues or PRs against this repository. Keep changes small and focused.

## License
This project follows the license in the repository root.

## Demo GIF

A short demo GIF showing creating a task and exporting the PS1+BAT can be added to `assets/demo.gif` and referenced below:

![Demo](assets/demo.gif)

If you want to produce the GIF locally, here are quick options:

- Windows (ffmpeg - record a window by title, convert to GIF):

```powershell
ffmpeg -f gdigrab -framerate 30 -i title="Davinvi - localhost:5173" -c:v libx264 -preset veryfast -crf 18 output.mp4
ffmpeg -i output.mp4 -vf "fps=15,scale=800:-1:flags=lanczos" -loop 0 demo.gif
```

- Higher-quality conversion using `gifski` (recommended):

```powershell
ffmpeg -i output.mp4 -vf fps=15,scale=800:-1:flags=lanczos -f image2pipe -vcodec ppm - | gifski --fps 15 -o assets/demo.gif
```

- Quick alternatives: use ShareX or ScreenToGif (Windows GUI) or OBS (cross-platform) to record then export to GIF.

After creating `assets/demo.gif`, add it to the repo and commit — the README will display the demo.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
