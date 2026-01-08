/**
 * Bayesian Multi-Armed Bandits
 *
 * A comprehensive library for A/B testing and optimization using multi-armed bandit algorithms.
 * Provides 4 bandit algorithms with Bayesian statistical analysis for intelligent experimentation.
 *
 * @example
 * ```typescript
 * import { MultiArmedBandit } from '@superinstance/bayesian-multi-armed-bandits';
 *
 * const bandit = new MultiArmedBandit({ algorithm: 'thompson-sampling' });
 *
 * const variants = [
 *   { id: 'A', name: 'Control', weight: 1, config: {}, isControl: true },
 *   { id: 'B', name: 'Variant B', weight: 1, config: {} },
 * ];
 *
 * // Select variant
 * const selection = bandit.selectVariant(variants);
 *
 * // Update with reward (0-1 for binary, any number for continuous)
 * bandit.updateReward(selection.variantId, reward);
 *
 * // Get best performing variant
 * const best = bandit.getBestVariant();
 * ```
 */

// Export all types
export * from './types/index.js';

// Export bandit algorithms
export {
  MultiArmedBandit,
  compareBanditAlgorithms,
  recommendBanditAlgorithm,
} from './algorithms/multi-armed-bandit.js';
