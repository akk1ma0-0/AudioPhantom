import { describe, expect, it } from 'vitest';
import { FEATURES, FEATURE_IDS } from './plans.js';
import { FEATURES_INFO_EN, featureInfoKey, getFeatureInfo } from './features-info.js';

describe('(i) info texts (PLAN 4.4 rule 5)', () => {
  it('every feature has a non-empty English info', () => {
    for (const f of FEATURES) {
      expect(FEATURES_INFO_EN[f.id]?.trim().length, `missing info for ${f.id}`).toBeGreaterThan(40);
    }
  });
  it('has no info for unknown features', () => {
    expect(Object.keys(FEATURES_INFO_EN).sort()).toEqual([...FEATURE_IDS].sort());
  });
  it('ru/ro fall back to en while untranslated', () => {
    for (const id of FEATURE_IDS) {
      expect(getFeatureInfo(id, 'ru')).toBe(FEATURES_INFO_EN[id]);
      expect(getFeatureInfo(id, 'ro')).toBe(FEATURES_INFO_EN[id]);
    }
  });
  it('i18n keys follow feature.<id>.info', () => {
    expect(featureInfoKey('live_hours')).toBe('feature.live_hours.info');
  });
});
