import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { z } from 'zod';
import JSZip from 'jszip';
import type {
  DataEnvelope as IDataEnvelope,
  IAppContext,
  IPlugin,
} from '@toolbox/sdk';
import prefixedStyles from './styles.css?inline';

const PLUGIN_NAME = 'Davinvi';
const PLUGIN_ID = 'davinci';
const PLUGIN_VERSION = '1';
const STORAGE_KEY = 'tasks';
const TASK_COUNT_CHANGED = 'TASK_COUNT_CHANGED';
const IMPORT_TASKS_EVENT = 'DAVINVI_IMPORT_TASKS';
const PLUGIN_CONTAINER_ID = `plugin-${PLUGIN_ID}`;

const ModifierSchema = z.enum(['none', 'alt', 'ctrl', 'shift', 'copy', 'paste', 'enter']);

const TaskStepSchema = z.object({
  modifier: ModifierSchema,
  key: z.string().min(1),
  delayAfterMs: z.number().int().nonnegative(),
  isRawSendKeys: z.boolean().optional().default(false),
});

const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  steps: z.array(TaskStepSchema).min(1),
  requireInput: z.boolean(),
  inputMode: z.enum(['manual', 'list']),
  manualValue: z.string(),
  listValues: z.array(z.string()),
});

const LegacyTaskSchema = z.object({
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
type TaskStep = z.infer<typeof TaskStepSchema>;

type RestoreResult = {
  tasks: Task[];
  extractedPath: string;
  source: string;
  preview: string;
};

type TaskFormState = {
  title: string;
  stepModifier: z.infer<typeof ModifierSchema>;
  stepKey: string;
  stepDelayAfterMs: number;
  steps: TaskStep[];
  requireInput: boolean;
  inputMode: 'manual' | 'list';
  manualValue: string;
  listText: string;
};

const MODIFIER_OPTIONS: Array<{ label: string; value: z.infer<typeof ModifierSchema> }> = [
  { label: '空白', value: 'none' },
  { label: 'Alt', value: 'alt' },
  { label: 'Ctrl', value: 'ctrl' },
  { label: 'Shift', value: 'shift' },
  { label: '複製 (Ctrl+C)', value: 'copy' },
  { label: '貼上 (Ctrl+V)', value: 'paste' },
  { label: 'Enter', value: 'enter' },
];

const MODIFIER_LABEL: Record<z.infer<typeof ModifierSchema>, string> = {
  none: 'None',
  alt: 'Alt',
  ctrl: 'Ctrl',
  shift: 'Shift',
  copy: 'Copy',
  paste: 'Paste',
  enter: 'Enter',
};

const SPECIAL_SENDKEY_MAP: Record<string, string> = {
  enter: 'ENTER',
  tab: 'TAB',
  esc: 'ESC',
  escape: 'ESC',
  space: 'SPACE',
  backspace: 'BACKSPACE',
  delete: 'DELETE',
  del: 'DELETE',
  insert: 'INSERT',
  home: 'HOME',
  end: 'END',
  pgup: 'PGUP',
  pageup: 'PGUP',
  pgdn: 'PGDN',
  pagedown: 'PGDN',
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
};

const MODIFIER_PREFIX: Record<z.infer<typeof ModifierSchema>, string> = {
  none: '',
  alt: '%',
  ctrl: '^',
  shift: '+',
  copy: '',
  paste: '',
  enter: '',
};

const initialForm: TaskFormState = {
  title: '',
  stepModifier: 'none',
  stepKey: '',
  stepDelayAfterMs: 1000,
  steps: [],
  requireInput: true,
  inputMode: 'manual',
  manualValue: '',
  listText: '',
};

function normalizeStepKeyToken(rawKey: string): string {
  const trimmed = rawKey.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  const mapped = SPECIAL_SENDKEY_MAP[lower];
  if (mapped) {
    return `{${mapped}}`;
  }

  if (/^f\d{1,2}$/i.test(trimmed)) {
    return `{${trimmed.toUpperCase()}}`;
  }

  if (trimmed.length === 1) {
    return trimmed;
  }

  return `{${trimmed.toUpperCase()}}`;
}

function stepToSendKeys(step: TaskStep): string {
  if (step.isRawSendKeys) {
    return step.key;
  }

  // Special action modifiers (copy/paste/enter) map to fixed send sequences
  if (step.modifier === 'copy') {
    return '^c';
  }

  if (step.modifier === 'paste') {
    return '^v';
  }

  if (step.modifier === 'enter') {
    return '{ENTER}';
  }

  const keyToken = normalizeStepKeyToken(step.key);
  return `${MODIFIER_PREFIX[step.modifier]}${keyToken}`;
}

function stepToLabel(step: TaskStep): string {
  if (step.isRawSendKeys) {
    return `Raw: ${step.key}`;
  }

  if (step.modifier === 'copy' || step.modifier === 'paste' || step.modifier === 'enter') {
    return `${MODIFIER_LABEL[step.modifier]}`;
  }

  return `${MODIFIER_LABEL[step.modifier]} + ${step.key}`;
}

function convertLegacyTask(legacyTask: z.infer<typeof LegacyTaskSchema>): Task {
  return {
    id: legacyTask.id,
    title: legacyTask.title,
    steps: [
      {
        modifier: 'none',
        key: legacyTask.hotkey,
        delayAfterMs: legacyTask.delayMs,
        isRawSendKeys: true,
      },
    ],
    requireInput: legacyTask.requireInput,
    inputMode: legacyTask.inputMode,
    manualValue: legacyTask.manualValue,
    listValues: legacyTask.listValues,
  };
}

function parseTaskList(input: unknown): Task[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const parsed: Task[] = [];
  for (const item of input) {
    const taskResult = TaskSchema.safeParse(item);
    if (taskResult.success) {
      parsed.push(taskResult.data);
      continue;
    }

    const legacyResult = LegacyTaskSchema.safeParse(item);
    if (legacyResult.success) {
      parsed.push(convertLegacyTask(legacyResult.data));
    }
  }

  return parsed;
}
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
  const parsedTasks = parseTaskList(candidate.value);

  return {
    tasks: parsedTasks,
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

function buildPs1Content(tasks: Task[], initialDelayMs: number, repeatCount: number): string {
  const taskObjects = tasks
    .map((task) => {
      const stepLines = task.steps
        .map((step) => {
          return [
            '@{',
            `  sendKeys='${psEscape(stepToSendKeys(step))}'`,
            `  delayAfterMs=${Math.max(0, Math.floor(step.delayAfterMs || 0))}`,
            '}',
          ].join('\n');
        })
        .join(',\n');
      const listLines = task.listValues.map((item) => `'${psEscape(item)}'`).join(', ');
      return [
        '@{',
        `  id='${psEscape(task.id)}'`,
        `  title='${psEscape(task.title)}'`,
        '  steps=@(',
        stepLines,
        '  )',
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
    (repeatCount === 0 ? 'while ($true) {' : `for ($r = 0; $r -lt ${Math.max(0, repeatCount)}; $r++) {`),
    '  foreach ($task in $tasks) {',
    '    if ($task.inputMode -eq "list") {',
    '      foreach ($item in $task.listValues) {',
    '        if ($task.requireInput) {',
    '          Set-Clipboard -Value $item',
    '          Start-Sleep -Milliseconds 200',
    '        }',
    '        foreach ($action in $task.steps) {',
    '          $wshell.SendKeys($action.sendKeys)',
    '          Start-Sleep -Milliseconds $action.delayAfterMs',
    '        }',
    '      }',
    '    } else {',
    '      if ($task.requireInput) {',
    '        Set-Clipboard -Value $task.manualValue',
    '        Start-Sleep -Milliseconds 200',
    '      }',
    '      foreach ($action in $task.steps) {',
    '        $wshell.SendKeys($action.sendKeys)',
    '        Start-Sleep -Milliseconds $action.delayAfterMs',
    '      }',
    '    }',
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

// downloadFile removed (packaging now uses TAR creation)
// downloadFile removed; export now creates a single uncompressed tar archive

// helper removed (no TAR creation)
// Use JSZip to create zip archives in-browser

type PluginAppProps = {
  context: IAppContext;
};

function PluginApp({ context }: PluginAppProps): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [initialDelayMs, setInitialDelayMs] = useState(5000);
  const [repeatCount, setRepeatCount] = useState<number>(1); // 0 = infinite
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

  const normalizedStepPreview = useMemo(() => {
    // show fixed preview for special actions
    if (form.stepModifier === 'copy') {
      return '^c';
    }

    if (form.stepModifier === 'paste') {
      return '^v';
    }

    if (form.stepModifier === 'enter') {
      return '{ENTER}';
    }

    const keyToken = normalizeStepKeyToken(form.stepKey);
    if (!keyToken) {
      return '';
    }

    return `${MODIFIER_PREFIX[form.stepModifier]}${keyToken}`;
  }, [form.stepKey, form.stepModifier]);

  const addStep = () => {
    const trimmedKey = form.stepKey.trim();
    const isSpecial = form.stepModifier === 'copy' || form.stepModifier === 'paste' || form.stepModifier === 'enter';
    if (!trimmedKey && !isSpecial) {
      return;
    }

    const keyValue = trimmedKey || form.stepModifier; // use modifier token for special actions to satisfy schema

    const nextStep: TaskStep = {
      modifier: form.stepModifier,
      key: keyValue,
      delayAfterMs: Math.max(0, Math.floor(form.stepDelayAfterMs || 0)),
      isRawSendKeys: false,
    };

    const validation = TaskStepSchema.safeParse(nextStep);
    if (!validation.success) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      steps: [...previous.steps, validation.data],
      stepKey: '',
    }));
  };

  const removeStep = (index: number) => {
    setForm((previous) => ({
      ...previous,
      steps: previous.steps.filter((_, stepIndex) => stepIndex !== index),
    }));
  };

  const addTask = () => {
    if (!form.title.trim() || form.steps.length === 0) {
      return;
    }

    const listValues = form.inputMode === 'list' ? splitListText(form.listText) : [];
    const nextTask: Task = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      steps: form.steps,
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
      steps: [],
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

    // Create a single uncompressed tar archive containing each task in its own folder.
    const zip = new JSZip();
    for (const task of valid.data) {
      const safeName = task.title.replace(/[^a-zA-Z0-9_\-\. ]/g, '_') || `task_${task.id.slice(0, 6)}`;
      const folder = zip.folder(safeName)!;
      const ps1File = `${safeName}.ps1`;
      const ps1Content = buildPs1Content([task], initialDelayMs, repeatCount);
      const batContent = buildBatContent(ps1File);
      folder.file(ps1File, ps1Content);
      folder.file('Click to Start.bat', batContent);
    }

    const archiveName = valid.data.length === 1 ? `${valid.data[0].title.replace(/[^a-zA-Z0-9_\-\. ]/g, '_') || 'task'}.zip` : 'davinvi_tasks.zip';
    void zip.generateAsync({ type: 'blob' }).then((contentBlob) => {
      const url = URL.createObjectURL(contentBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = archiveName;
      a.click();
      URL.revokeObjectURL(url);
    });
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
                  placeholder="例如：登入後送出"
                />
              </label>

              <div style={{ display: 'grid', gap: 8 }}>
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

                <label className="plugin-label">
                  重複次數（0 = 無限）
                  <input
                    className="plugin-input"
                    type="number"
                    min={0}
                    value={repeatCount}
                    onChange={(event) => setRepeatCount(Number(event.target.value || 0))}
                  />
                </label>
              </div>
            </div>

            <div className="plugin-step-builder">
              <div className="plugin-row plugin-row-3">
                <label className="plugin-label">
                  修飾鍵（x）
                  <select
                    className="plugin-select"
                    value={form.stepModifier}
                    onChange={(event) =>
                      updateForm('stepModifier', event.target.value as z.infer<typeof ModifierSchema>)
                    }
                  >
                    {MODIFIER_OPTIONS.map((item) => (
                      <option value={item.value} key={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="plugin-label">
                  按鍵（input）
                  <input
                    className="plugin-input"
                    value={form.stepKey}
                    onChange={(event) => updateForm('stepKey', event.target.value)}
                    placeholder="例如：a、Enter、Tab、F6"
                  />
                </label>

                <label className="plugin-label">
                  該步驟後等待（ms）
                  <input
                    className="plugin-input"
                    type="number"
                    min={0}
                    value={form.stepDelayAfterMs}
                    onChange={(event) =>
                      updateForm('stepDelayAfterMs', Number(event.target.value || 0))
                    }
                  />
                </label>
              </div>

              <div className="plugin-actions">
                <button type="button" className="plugin-btn plugin-btn-alt" onClick={addStep}>
                  新增步驟
                </button>
              </div>

              <p className="plugin-muted">SendKeys 預覽：{normalizedStepPreview || '(尚未輸入按鍵)'}</p>

              {form.steps.length === 0 ? (
                <div className="plugin-empty">尚未加入任何步驟，請先設定 x + input 後按「新增步驟」。</div>
              ) : (
                <div className="plugin-step-list">
                  {form.steps.map((step, index) => (
                    <div className="plugin-step-item" key={`${step.modifier}-${step.key}-${index}`}>
                      <p className="plugin-step-text">
                        {index + 1}. {stepToLabel(step)} | wait={step.delayAfterMs}ms | sendKeys=
                        {stepToSendKeys(step)}
                      </p>
                      <button
                        type="button"
                        className="plugin-btn plugin-btn-danger"
                        onClick={() => removeStep(index)}
                      >
                        移除步驟
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                此任務需要先把資料複製到剪貼簿
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
                        steps={task.steps.length} ({task.steps
                          .map((step, index) => `${index + 1}:${stepToLabel(step)}@${step.delayAfterMs}ms`)
                          .join(' -> ')}) | inputMode={task.inputMode} | requireInput=
                        {String(task.requireInput)}
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

function findDirectChildContainer(hostContainer: HTMLElement): HTMLElement | null {
  for (const node of hostContainer.children) {
    if (node instanceof HTMLElement && node.id === PLUGIN_CONTAINER_ID) {
      return node;
    }
  }

  return null;
}

function ensurePluginContainer(hostContainer: HTMLElement): HTMLElement {
  const existing = findDirectChildContainer(hostContainer);
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

    const isolated = findDirectChildContainer(container);
    if (isolated) {
      isolated.innerHTML = '';
    }

    unmountStyles();
    pluginContainerEl = null;
  },
};

export default plugin;

