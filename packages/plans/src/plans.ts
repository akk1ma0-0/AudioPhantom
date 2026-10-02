/**
 * Single source of truth for plans, prices, limits and per-plan feature access
 * (docs/PLAN.md sections 4.1-4.3). Do not duplicate numbers elsewhere: the pricing
 * page, in-app plan picker, entitlement checks and docs/TARIFFS.md derive from here.
 */

export const PLAN_IDS = ['solo', 'pro', 'max', 'ultra'] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export const FEATURE_IDS = [
  'live_hours',
  'devices',
  'continuous_listening',
  'call_cursor',
  'local_docs_search',
  'glossary',
  'app_prompt_sets',
  'app_memory',
  'integrations',
  'post_call_summary',
  'summary_retention',
  'export',
  'promise_tracker',
  'precall_brief',
  'full_transcript',
  'premium_stt',
  'assistant_mode',
  'step_verification',
  'do_for_you',
  'background_agents',
  'workflow_recording',
  'learning_mode',
  'knowledge_packs',
  'extra_hours_pack',
  'trial',
  'annual_billing',
  'privacy_controls',
] as const;
export type FeatureId = (typeof FEATURE_IDS)[number];

export interface PlanLimits {
  /** Monthly live-help hours (includes premium hours). */
  liveHours: number;
  /** Premium (low-latency streaming STT) hours, a subset of liveHours. */
  premiumHours: number;
  devices: number;
  /** Cloud retention of summaries / transcripts. */
  retentionDays: number;
  /** Connected integrations; 'all' = unlimited. */
  integrations: number | 'all';
  /** Own MCP connectors allowed. */
  customMcp: boolean;
  /** Assistant requests per month; null = not available. */
  assistantRequests: number | null;
  /** Background-agent tasks per month; null = not available. */
  agentTasks: number | null;
}

export interface Plan {
  id: PlanId;
  name: string;
  /** Monthly price in USD cents, excluding VAT. */
  monthlyPriceCents: number;
  limits: PlanLimits;
}

export const PLANS: Record<PlanId, Plan> = {
  solo: {
    id: 'solo',
    name: 'Solo',
    monthlyPriceCents: 1500,
    limits: {
      liveHours: 30,
      premiumHours: 0,
      devices: 1,
      retentionDays: 30,
      integrations: 1,
      customMcp: false,
      assistantRequests: null,
      agentTasks: null,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyPriceCents: 2400,
    limits: {
      liveHours: 100,
      premiumHours: 0,
      devices: 3,
      retentionDays: 90,
      integrations: 'all',
      customMcp: false,
      assistantRequests: null,
      agentTasks: null,
    },
  },
  max: {
    id: 'max',
    name: 'Max',
    monthlyPriceCents: 4500,
    limits: {
      liveHours: 150,
      premiumHours: 30,
      devices: 5,
      retentionDays: 365,
      integrations: 'all',
      customMcp: true,
      assistantRequests: null,
      agentTasks: null,
    },
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra',
    monthlyPriceCents: 7900,
    limits: {
      liveHours: 150,
      premiumHours: 30,
      devices: 5,
      retentionDays: 365,
      integrations: 'all',
      customMcp: true,
      assistantRequests: 1500,
      agentTasks: 75,
    },
  },
};

/** Annual billing = 10 monthly payments ("2 months free"). */
export const ANNUAL_MONTHS_CHARGED = 10;

export function annualPriceCents(plan: PlanId): number {
  return PLANS[plan].monthlyPriceCents * ANNUAL_MONTHS_CHARGED;
}

/** Extra-hours pack. Price is deliberately >= $10 (Paddle charges 10% below $10). */
export const EXTRA_HOURS_PACK = { hours: 15, priceCents: 1000 } as const;

/** Trial: card required, Pro features, auto-subscribes to the plan chosen at sign-up. */
export const TRIAL = { hours: 3, days: 7, featuresOfPlan: 'pro' as PlanId } as const;

/**
 * Per-plan access to a feature. `included` drives entitlements; `value` is the
 * English display value shown next to the feature (derived from limits where numeric).
 */
export interface FeatureAccess {
  included: boolean;
  value?: string;
}

export interface FeatureDef {
  id: FeatureId;
  /** English display name (i18n source string). */
  name: string;
  access: Record<PlanId, FeatureAccess>;
}

const yes: FeatureAccess = { included: true };
const no: FeatureAccess = { included: false };
const all = (a: FeatureAccess): Record<PlanId, FeatureAccess> => ({
  solo: a,
  pro: a,
  max: a,
  ultra: a,
});
const byPlan = (f: (p: Plan) => FeatureAccess): Record<PlanId, FeatureAccess> => ({
  solo: f(PLANS.solo),
  pro: f(PLANS.pro),
  max: f(PLANS.max),
  ultra: f(PLANS.ultra),
});
/** Included only on the given plans. */
const only = (...plans: PlanId[]) => byPlan((p) => (plans.includes(p.id) ? yes : no));

function formatRetention(days: number): string {
  return days >= 365 ? `${Math.round(days / 30.4)} months` : `${days} days`;
}

export const FEATURES: readonly FeatureDef[] = [
  {
    id: 'live_hours',
    name: 'Live help hours per month',
    access: byPlan((p) => ({
      included: true,
      value:
        p.limits.premiumHours > 0
          ? `${p.limits.liveHours} h (${p.limits.premiumHours} premium)`
          : `${p.limits.liveHours} h`,
    })),
  },
  {
    id: 'devices',
    name: 'Devices',
    access: byPlan((p) => ({ included: true, value: String(p.limits.devices) })),
  },
  {
    id: 'continuous_listening',
    name: 'Continuous listening, 3 reaction levels, Quiet/Normal/Active modes',
    access: all(yes),
  },
  {
    id: 'call_cursor',
    name: 'Cursor during calls + "help with the last thing" hotkey (no limit)',
    access: all(yes),
  },
  { id: 'local_docs_search', name: 'Local documents search', access: all(yes) },
  { id: 'glossary', name: 'Live glossary', access: all(yes) },
  { id: 'app_prompt_sets', name: 'App prompt sets (Figma, Excel, Jira…)', access: all(yes) },
  { id: 'app_memory', name: 'Per-app memory (visible and editable)', access: all(yes) },
  {
    id: 'integrations',
    name: 'Integrations',
    access: byPlan((p) => ({
      included: true,
      value:
        p.limits.integrations === 'all'
          ? p.limits.customMcp
            ? 'all + custom MCP connectors'
            : 'all'
          : String(p.limits.integrations),
    })),
  },
  { id: 'post_call_summary', name: 'Post-call summary', access: all(yes) },
  {
    id: 'summary_retention',
    name: 'Summary retention',
    access: byPlan((p) => ({ included: true, value: formatRetention(p.limits.retentionDays) })),
  },
  { id: 'export', name: 'Download summaries and transcripts', access: all(yes) },
  {
    id: 'promise_tracker',
    name: 'Promise tracker',
    access: {
      solo: { included: true, value: 'in the summary only' },
      pro: { included: true, value: '+ export to tasks' },
      max: yes,
      ultra: yes,
    },
  },
  { id: 'precall_brief', name: 'Pre-call brief', access: only('pro', 'max', 'ultra') },
  {
    id: 'full_transcript',
    name: 'Full cloud transcript and history search',
    access: only('pro', 'max', 'ultra'),
  },
  {
    id: 'premium_stt',
    name: 'Premium speech recognition',
    access: byPlan((p) =>
      p.limits.premiumHours > 0 ? { included: true, value: `${p.limits.premiumHours} h` } : no,
    ),
  },
  {
    id: 'assistant_mode',
    name: 'Assistant mode',
    access: byPlan((p) =>
      p.limits.assistantRequests !== null
        ? { included: true, value: `${p.limits.assistantRequests} requests/month` }
        : no,
    ),
  },
  {
    id: 'step_verification',
    name: 'Step verification + "Wrong one?" button',
    access: only('ultra'),
  },
  { id: 'do_for_you', name: '"Do it for me" with per-action confirmation', access: only('ultra') },
  {
    id: 'background_agents',
    name: 'Background agents',
    access: byPlan((p) =>
      p.limits.agentTasks !== null
        ? { included: true, value: `${p.limits.agentTasks} tasks/month` }
        : no,
    ),
  },
  { id: 'workflow_recording', name: 'Workflow recording and replay', access: only('ultra') },
  { id: 'learning_mode', name: 'Learning mode with mini-quizzes', access: only('ultra') },
  {
    id: 'knowledge_packs',
    name: 'Knowledge packs',
    access: byPlan((p) =>
      p.id === 'ultra'
        ? { included: true, value: 'create (colleagues on any paid plan can read)' }
        : no,
    ),
  },
  {
    id: 'extra_hours_pack',
    name: `Extra hours pack (${EXTRA_HOURS_PACK.hours} h for $${EXTRA_HOURS_PACK.priceCents / 100})`,
    access: all(yes),
  },
  { id: 'trial', name: 'Trial period', access: all(yes) },
  { id: 'annual_billing', name: 'Annual billing', access: all(yes) },
  {
    id: 'privacy_controls',
    name: 'Privacy controls: "don\'t save this call", delete everything',
    access: all(yes),
  },
];

const FEATURE_BY_ID: ReadonlyMap<FeatureId, FeatureDef> = new Map(FEATURES.map((f) => [f.id, f]));

export function getFeature(id: FeatureId): FeatureDef {
  const f = FEATURE_BY_ID.get(id);
  if (!f) throw new Error(`Unknown feature: ${id}`);
  return f;
}

/** Entitlement check: does the plan include the feature? */
export function hasFeature(plan: PlanId, feature: FeatureId): boolean {
  return getFeature(feature).access[plan].included;
}

export function getLimits(plan: PlanId): PlanLimits {
  return PLANS[plan].limits;
}

export function formatUsd(cents: number): string {
  return `$${cents % 100 === 0 ? cents / 100 : (cents / 100).toFixed(2)}`;
}
