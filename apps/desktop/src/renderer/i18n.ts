// All user-facing strings go through t(); English is the source (ru/ro added later, fall back to en).
const en = {
  'app.title': 'AudioPhantom',
  'panel.placeholder': 'Assistant panel (P0 skeleton).',
} as const;

export type StringKey = keyof typeof en;

export function t(key: StringKey): string {
  return en[key];
}
