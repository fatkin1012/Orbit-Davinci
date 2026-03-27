import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { z } from 'zod';
import type {
  DataEnvelope as IDataEnvelope,
  IAppContext,
  IPlugin,
} from '@toolbox/sdk';
import prefixedStyles from './styles.css?inline';

const PLUGIN_NAME = 'Davinvi';
const PLUGIN_ID = 'davinci';
const PLUGIN_VERSION = '1.0.0';
const STORAGE_KEY = 'tasks';
const TASK_COUNT_CHANGED = 'TASK_COUNT_CHANGED';
const IMPORT_TASKS_EVENT = 'DAVINVI_IMPORT_TASKS';
const PLUGIN_CONTAINER_ID = `plugin-${PLUGIN_ID}`;

const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  hotkey: z.string().min(1),
  delayMs: z.number().int().nonnegative(),
  requireInput: z.boolean(),
  inputMode: z.enum(['manual', 'list']),
  manualValue: z.string(),
  listValues: z.array(z.string()),
});

const TaskListSchema = z.array(TaskSchema);

type Task = z.infer<typeof TaskSchema>;

type RestoreResult = {
  tasks: Task[];
  extractedPath: string;
  source: string;
  preview: string;
};

type TaskFormState = {
  title: string;
  hotkey: string;
  customHotkey: string;
  delayMs: number;
  requireInput: boolean;
  inputMode: 'manual' | 'list';
  manualValue: string;
  listText: string;
};

const HOTKEY_PRESETS = [
  { label: 'Ctrl + V', value: '^v' },
  { label: 'Shift + F6', value: '+{F6}' },
  { label: 'Ctrl + S', value: '^s' },
  { label: 'Enter', value: '{ENTER}' },
  { label: 'Alt + Tab', value: '%{TAB}' },
  { label: 'Custom (SendKeys syntax)', value: '__CUSTOM__' },
];

const initialForm: TaskFormState = {
  title: '',
  hotkey: '^v',
  customHotkey: '',
  delayMs: 1000,
  requireInput: true,
  inputMode: 'manual',
  manualValue: '',
  listText: '',
};

function previewPayload(value: unknown): string {
  if (typeof value === 'string') {
    return value.slice(0, 220);
  }

  try {
    return JSON.stringify(value).slice(0, 220);
  } catch {
    return String(value).slice(0, 220);
  }
}

function parseMaybeJson(value: unknown): { value: unknown; source: string } {
  let current = value;
  let source = typeof value === 'string' ? 'json-string' : 'object';

  for (let i = 0; i < 3; i += 1) {
    if (typeof current !== 'string') {
      break;
    }

    const trimmed = current.trim();
    if (!trimmed) {
      break;
    }

    try {
      current = JSON.parse(trimmed);
      source = 'json-string';
    } catch {
      break;
    }
  }

  return { value: current, source };
}

function extractArrayCandidate(
  input: unknown,
): { extractedPath: string; value: unknown; source: string } {
  const parsed = parseMaybeJson(input);
  const root = parsed.value;

  if (Array.isArray(root)) {
    return { extractedPath: 'root', value: root, source: parsed.source };
  }

  if (root && typeof root === 'object') {
    const asRecord = root as Record<string, unknown>;
    const priorityKeys = ['data', 'value', 'payload', 'tasks'];

    for (const key of priorityKeys) {
      if (!(key in asRecord)) {
        continue;
      }

      const nestedParsed = parseMaybeJson(asRecord[key]);
      if (Array.isArray(nestedParsed.value)) {
        return {
          extractedPath: `root.${key}`,
          value: nestedParsed.value,
          source: nestedParsed.source,
        };
      }
    }
  }

  return { extractedPath: 'fallback-empty', value: [], source: parsed.source };
}

function sanitizeTasks(input: unknown): RestoreResult {
  const preview = previewPayload(input);
  const candidate = extractArrayCandidate(input);
  const validation = TaskListSchema.safeParse(candidate.value);

  if (!validation.success) {
    return {
      tasks: [],
      extractedPath: candidate.extractedPath,
      source: candidate.source,
      preview,
    };
  }

  return {
    tasks: validation.data,
    extractedPath: candidate.extractedPath,
    source: candidate.source,
    preview,
  };
}

function splitListText(listText: string): string[] {
  return listText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function psEscape(value: string): string {
  return value.replace(/'/g, "''");
}

function buildPs1Content(tasks: Task[], initialDelayMs: number): string {
  const taskObjects = tasks
    .map((task) => {
      const listLines = task.listValues.map((item) => `'${psEscape(item)}'`).join(', ');
      return [
        '@{',
        `  id='${psEscape(task.id)}'`,
        `  title='${psEscape(task.title)}'`,
        `  hotkey='${psEscape(task.hotkey)}'`,
        `  delayMs=${task.delayMs}`,
        `  requireInput=$${task.requireInput ? 'true' : 'false'}`,
        `  inputMode='${task.inputMode}'`,
        `  manualValue='${psEscape(task.manualValue)}'`,
        `  listValues=@(${listLines})`,
        '}',
      ].join('\n');
    })
    .join(',\n');

  return [
    '# Davinvi generated script',
    '# Auto-run action sequence based on configured tasks',
    '',
    '$ErrorActionPreference = "Stop"',
    `$initialDelayMs = ${Math.max(0, initialDelayMs)}`,
    '$tasks = @(',
    taskObjects,
    ')',
    '',
    'if ($tasks.Count -eq 0) {',
    '  Write-Error "No tasks configured."',
    '  exit 1',
    '}',
    '',
    'Write-Host "Starting in $($initialDelayMs / 1000) seconds..."',
    'Write-Host "Focus the target app/window now."',
    'Start-Sleep -Milliseconds $initialDelayMs',
    '',
    '$wshell = New-Object -ComObject WScript.Shell',
    '',
    'foreach ($task in $tasks) {',
    '  if ($task.inputMode -eq "list") {',
    '    foreach ($item in $task.listValues) {',
    '      if ($task.requireInput) {',
    '        Set-Clipboard -Value $item',
    '        Start-Sleep -Milliseconds 200',
    '      }',
    '      $wshell.SendKeys($task.hotkey)',
    '      Start-Sleep -Milliseconds $task.delayMs',
    '    }',
    '  } else {',
    '    if ($task.requireInput) {',
    '      Set-Clipboard -Value $task.manualValue',
    '      Start-Sleep -Milliseconds 200',
    '    }',
    '    $wshell.SendKeys($task.hotkey)',
    '    Start-Sleep -Milliseconds $task.delayMs',
    '  }',
    '}',
    '',
    'Write-Host "Done."',
    '',
  ].join('\n');
}

function buildBatContent(ps1FileName: string): string {
  return [
    '@echo off',
    'setlocal',
    '',
    'set "SCRIPT_DIR=%~dp0"',
    `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%${ps1FileName}" %*`,
    '',
    'endlocal',
    '',
  ].join('\n');
}

function downloadFile(fileName: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

type PluginAppProps = {
  context: IAppContext;
};

function PluginApp({ context }: PluginAppProps): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [initialDelayMs, setInitialDelayMs] = useState(5000);
  const [form, setForm] = useState<TaskFormState>(initialForm);
  const firstPersistRef = useRef(true);

  useEffect(() => {
    let alive = true;

    const restore = async () => {
      console.info('[task-board] restore start');

      try {
        const raw = (await context.storage.get<unknown>(STORAGE_KEY)) as
          | unknown
          | IDataEnvelope<unknown>
          | null;

        const restored = sanitizeTasks(raw);
        console.info('[task-board] restore payload', {
          preview: restored.preview,
          extractedPath: restored.extractedPath,
        });

        if (!alive) {
          return;
        }

        setTasks(restored.tasks);
        console.info('[task-board] restore success', {
          count: restored.tasks.length,
          source: restored.source,
        });
      } catch (error) {
        console.error('[task-board] restore failed', error);
        if (alive) {
          setTasks([]);
        }
      } finally {
        if (alive) {
          setHydrated(true);
        }
      }
    };

    void restore();

    return () => {
      alive = false;
    };
  }, [context]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (firstPersistRef.current) {
      firstPersistRef.current = false;
      return;
    }

    const persist = async () => {
      try {
        const valid = TaskListSchema.parse(tasks);
        const envelope: IDataEnvelope<Task[]> = {
          pluginId: PLUGIN_ID,
          version: PLUGIN_VERSION,
          timestamp: Date.now(),
          type: 'PERSIST',
          payload: valid,
        };

        console.info('[task-board] save triggered', { count: valid.length });
        await context.storage.save(STORAGE_KEY, envelope, PLUGIN_VERSION);
        context.eventBus.emit(TASK_COUNT_CHANGED, {
          pluginId: PLUGIN_ID,
          count: valid.length,
          updatedAt: Date.now(),
        });
      } catch (error) {
        console.error('[task-board] save failed', error);
      }
    };

    void persist();
  }, [context, hydrated, tasks]);

  useEffect(() => {
    const onImportTasks = (payload: unknown) => {
      const restored = sanitizeTasks(payload);
      setTasks(restored.tasks);
    };

    context.eventBus.on(IMPORT_TASKS_EVENT, onImportTasks);

    return () => {
      context.eventBus.off(IMPORT_TASKS_EVENT, onImportTasks);
    };
  }, [context]);

  const resolvedHotkey = useMemo(() => {
    if (form.hotkey === '__CUSTOM__') {
      return form.customHotkey.trim();
    }

    return form.hotkey.trim();
  }, [form.customHotkey, form.hotkey]);

  const addTask = () => {
    const hotkey = resolvedHotkey;
    if (!form.title.trim() || !hotkey) {
      return;
    }

    const listValues = form.inputMode === 'list' ? splitListText(form.listText) : [];
    const nextTask: Task = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      hotkey,
      delayMs: Math.max(0, Math.floor(form.delayMs || 0)),
      requireInput: form.requireInput,
      inputMode: form.inputMode,
      manualValue: form.manualValue,
      listValues,
    };

    const validation = TaskSchema.safeParse(nextTask);
    if (!validation.success) {
      return;
    }

    setTasks((previous) => [...previous, validation.data]);
    setForm((previous) => ({
      ...previous,
      title: '',
      manualValue: '',
      listText: '',
    }));
  };

  const removeTask = (id: string) => {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const exportScripts = () => {
    const valid = TaskListSchema.safeParse(tasks);
    if (!valid.success || valid.data.length === 0) {
      return;
    }

    const ps1Name = 'davinvi_tasks.ps1';
    const batName = 'run_davinvi_tasks.bat';
    const ps1 = buildPs1Content(valid.data, initialDelayMs);
    const bat = buildBatContent(ps1Name);

    downloadFile(ps1Name, ps1, 'text/plain;charset=utf-8');
    downloadFile(batName, bat, 'text/plain;charset=utf-8');
  };

  const updateForm = <K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <section className="plugin-shell" aria-label="Davinvi Task Builder">
      <div className="plugin-grid">
        <article className="plugin-card">
          <h1 className="plugin-heading">Davinvi Script Builder</h1>
          <p className="plugin-subtitle">
            設定按鍵組合、每步間隔、是否貼上輸入值，完成後一鍵下載 PowerShell 和 BAT。
          </p>

          <div className="plugin-form">
            <div className="plugin-row plugin-row-2">
              <label className="plugin-label">
                任務名稱
                <input
                  className="plugin-input"
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  placeholder="例如：貼上客戶編號"
                />
              </label>

              <label className="plugin-label">
                每個動作間隔（ms）
                <input
                  className="plugin-input"
                  type="number"
                  min={0}
                  value={form.delayMs}
                  onChange={(event) => updateForm('delayMs', Number(event.target.value || 0))}
                />
              </label>
            </div>

            <div className="plugin-row plugin-row-2">
              <label className="plugin-label">
                按鈕 / 組合鍵
                <select
                  className="plugin-select"
                  value={form.hotkey}
                  onChange={(event) => updateForm('hotkey', event.target.value)}
                >
                  {HOTKEY_PRESETS.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="plugin-label">
                啟動前延遲（ms）
                <input
                  className="plugin-input"
                  type="number"
                  min={0}
                  value={initialDelayMs}
                  onChange={(event) => setInitialDelayMs(Number(event.target.value || 0))}
                />
              </label>
            </div>

            {form.hotkey === '__CUSTOM__' && (
              <label className="plugin-label">
                自訂 SendKeys
                <input
                  className="plugin-input"
                  value={form.customHotkey}
                  onChange={(event) => updateForm('customHotkey', event.target.value)}
                  placeholder="例如：^+{F10}"
                />
              </label>
            )}

            <div className="plugin-row plugin-row-2">
              <label className="plugin-label">
                輸入來源
                <select
                  className="plugin-select"
                  value={form.inputMode}
                  onChange={(event) => updateForm('inputMode', event.target.value as 'manual' | 'list')}
                >
                  <option value="manual">單筆輸入</option>
                  <option value="list">清單逐筆執行</option>
                </select>
              </label>

              <label className="plugin-check">
                <input
                  type="checkbox"
                  checked={form.requireInput}
                  onChange={(event) => updateForm('requireInput', event.target.checked)}
                />
                此動作需要先把資料複製到剪貼簿
              </label>
            </div>

            {form.inputMode === 'manual' ? (
              <label className="plugin-label">
                輸入值
                <textarea
                  className="plugin-textarea"
                  value={form.manualValue}
                  onChange={(event) => updateForm('manualValue', event.target.value)}
                  placeholder="例如：A-10021"
                />
              </label>
            ) : (
              <label className="plugin-label">
                清單資料（每行一筆）
                <textarea
                  className="plugin-textarea"
                  value={form.listText}
                  onChange={(event) => updateForm('listText', event.target.value)}
                  placeholder={'001\n002\n003'}
                />
              </label>
            )}

            <div className="plugin-actions">
              <button type="button" className="plugin-btn plugin-btn-primary" onClick={addTask}>
                新增任務
              </button>
              <button type="button" className="plugin-btn plugin-btn-alt" onClick={exportScripts}>
                下載 PS1 + BAT
              </button>
              <button type="button" className="plugin-btn plugin-btn-danger" onClick={clearTasks}>
                清空任務
              </button>
            </div>

            <p className="plugin-muted">
              可透過 eventBus 送出 <strong>{IMPORT_TASKS_EVENT}</strong> 事件匯入任務，儲存時會 emit
              <strong> {TASK_COUNT_CHANGED}</strong>。
            </p>
          </div>
        </article>

        <article className="plugin-card">
          <h2 className="plugin-heading">已建立任務 ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="plugin-empty">目前沒有任務，先在左側新增一筆。</div>
          ) : (
            <div className="plugin-list">
              {tasks.map((task) => (
                <div className="plugin-task" key={task.id}>
                  <div className="plugin-task-head">
                    <div>
                      <h3 className="plugin-task-title">{task.title}</h3>
                      <p className="plugin-task-meta">
                        hotkey={task.hotkey} | delay={task.delayMs}ms | inputMode={task.inputMode} |
                        requireInput={String(task.requireInput)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="plugin-btn plugin-btn-danger"
                      onClick={() => removeTask(task.id)}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

let root: Root | null = null;
let pluginContainerEl: HTMLElement | null = null;
let styleEl: HTMLStyleElement | null = null;

function ensurePluginContainer(hostContainer: HTMLElement): HTMLElement {
  const existing = hostContainer.querySelector<HTMLElement>(`#${PLUGIN_CONTAINER_ID}`);
  if (existing) {
    existing.innerHTML = '';
    return existing;
  }

  const container = document.createElement('div');
  container.id = PLUGIN_CONTAINER_ID;
  hostContainer.appendChild(container);
  return container;
}

function mountStyles(): void {
  if (styleEl) {
    return;
  }

  styleEl = document.createElement('style');
  styleEl.setAttribute('data-plugin-style', PLUGIN_CONTAINER_ID);
  styleEl.textContent = prefixedStyles;
  document.head.appendChild(styleEl);
}

function unmountStyles(): void {
  styleEl?.remove();
  styleEl = null;
}

const plugin: IPlugin = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  mount(container, context) {
    pluginContainerEl = ensurePluginContainer(container);
    mountStyles();
    root = createRoot(pluginContainerEl);
    root.render(<PluginApp context={context} />);
  },
  unmount(container) {
    root?.unmount();
    root = null;

    const isolated = container.querySelector<HTMLElement>(`#${PLUGIN_CONTAINER_ID}`);
    if (isolated) {
      isolated.innerHTML = '';
    }

    unmountStyles();
    pluginContainerEl = null;
  },
};

export default plugin;
