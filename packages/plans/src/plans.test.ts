import { describe, expect, it } from 'vitest';
import {
  ANNUAL_MONTHS_CHARGED,
  EXTRA_HOURS_PACK,
  FEATURES,
  FEATURE_IDS,
  PLANS,
  PLAN_IDS,
  annualPriceCents,
  getLimits,
  hasFeature,
} from './plans.js';

describe('prices (PLAN 4.1)', () => {
  it('monthly prices', () => {
    expect(PLAN_IDS.map((p) => PLANS[p].monthlyPriceCents / 100)).toEqual([15, 24, 45, 79]);
  });
  it('annual = 10 monthly: 150/240/450/790', () => {
    expect(ANNUAL_MONTHS_CHARGED).toBe(10);
    expect(PLAN_IDS.map((p) => annualPriceCents(p) / 100)).toEqual([150, 240, 450, 790]);
  });
  it('extra pack is 15 h for $10 (not below $10: Paddle fee)', () => {
    expect(EXTRA_HOURS_PACK).toEqual({ hours: 15, priceCents: 1000 });
  });
});

describe('limits (PLAN 4.2)', () => {
  it('hours and devices', () => {
    expect(PLAN_IDS.map((p) => getLimits(p).liveHours)).toEqual([30, 100, 150, 150]);
    expect(PLAN_IDS.map((p) => getLimits(p).premiumHours)).toEqual([0, 0, 30, 30]);
    expect(PLAN_IDS.map((p) => getLimits(p).devices)).toEqual([1, 3, 5, 5]);
  });
  it('Ultra-only quotas', () => {
    expect(getLimits('ultra').assistantRequests).toBe(1500);
    expect(getLimits('ultra').agentTasks).toBe(75);
    for (const p of ['solo', 'pro', 'max'] as const) {
      expect(getLimits(p).assistantRequests).toBeNull();
      expect(getLimits(p).agentTasks).toBeNull();
    }
  });
  it('premium hours are a subset of live hours', () => {
    for (const p of PLAN_IDS)
      expect(getLimits(p).premiumHours).toBeLessThanOrEqual(getLimits(p).liveHours);
  });
});

describe('feature matrix (PLAN 4.3)', () => {
  it('lists every feature id exactly once', () => {
    expect(FEATURES.map((f) => f.id).sort()).toEqual([...FEATURE_IDS].sort());
  });
  it('Solo lacks pre-call brief and full transcript', () => {
    expect(hasFeature('solo', 'precall_brief')).toBe(false);
    expect(hasFeature('solo', 'full_transcript')).toBe(false);
    expect(hasFeature('pro', 'precall_brief')).toBe(true);
    expect(hasFeature('pro', 'full_transcript')).toBe(true);
  });
  it('premium STT from Max', () => {
    expect(PLAN_IDS.map((p) => hasFeature(p, 'premium_stt'))).toEqual([false, false, true, true]);
  });
  it('Ultra-only features', () => {
    for (const id of [
      'assistant_mode',
      'step_verification',
      'do_for_you',
      'background_agents',
      'workflow_recording',
      'learning_mode',
      'knowledge_packs',
    ] as const) {
      expect(PLAN_IDS.map((p) => hasFeature(p, id))).toEqual([false, false, false, true]);
    }
  });
  it('call cursor is available on every plan', () => {
    for (const p of PLAN_IDS) expect(hasFeature(p, 'call_cursor')).toBe(true);
  });
  it('display values derive from limits', () => {
    const v = (id: (typeof FEATURE_IDS)[number], p: (typeof PLAN_IDS)[number]) =>
      FEATURES.find((f) => f.id === id)!.access[p].value;
    expect(v('live_hours', 'max')).toBe('150 h (30 premium)');
    expect(v('summary_retention', 'solo')).toBe('30 days');
    expect(v('summary_retention', 'ultra')).toBe('12 months');
    expect(v('integrations', 'solo')).toBe('1');
  });
});
