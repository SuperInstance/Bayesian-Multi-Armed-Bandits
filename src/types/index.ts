/**
 * Bayesian Multi-Armed Bandits - Type Definitions
 *
 * Complete type system for A/B testing with multi-armed bandit optimization
 */

/**
 * Bandit algorithm types
 */
export type BanditAlgorithm = 'epsilon-greedy' | 'ucb1' | 'thompson-sampling' | 'adaptive';

/**
 * Experiment status
 */
export type ExperimentStatus =
  | 'draft'       // Experiment created but not started
  | 'running'     // Experiment is active and collecting data
  | 'paused'      // Experiment temporarily paused
  | 'completed'   // Experiment finished with winner determined
  | 'archived';   // Experiment archived for reference

/**
 * Experiment type categories
 */
export type ExperimentType =
  | 'ui'           // UI/UX experiments (layouts, colors, placement)
  | 'performance'  // Performance experiments (batching, caching, thresholds)
  | 'ai'          // AI/ML experiments (temperature, prompts, models)
  | 'algorithm'   // Algorithm experiments (sorting, searching, ranking)
  | 'content';    // Content experiments (copy, media, formatting)

/**
 * Metric types
 */
export type MetricType =
  | 'binary'       // 0 or 1 (success/failure)
  | 'count'        // Non-negative integers (clicks, views)
  | 'duration'     // Time in milliseconds
  | 'ratio'        // 0-1 range (engagement rate)
  | 'numeric';     // Any numeric value

/**
 * Goal direction for metrics
 */
export type GoalDirection = 'minimize' | 'maximize';

/**
 * Primary objective for experiment
 */
export type PrimaryObjective =
  | 'conversion'     // Maximize conversion rate
  | 'engagement'     // Maximize user engagement
  | 'retention'      // Maximize user retention
  | 'satisfaction'   // Maximize user satisfaction
  | 'performance'    // Minimize load time/latency
  | 'revenue';       // Maximize revenue

/**
 * Variant definition
 */
export interface Variant {
  /** Unique variant identifier */
  id: string;

  /** Display name */
  name: string;

  /** Variant description */
  description?: string;

  /** Traffic weight (relative, will be normalized) */
  weight: number;

  /** Configuration for this variant */
  config: Record<string, unknown>;

  /** Whether this is the control variant */
  isControl?: boolean;

  /** Custom parameters for rendering */
  parameters?: Record<string, unknown>;
}

/**
 * Metric definition
 */
export interface Metric {
  /** Unique metric identifier */
  id: string;

  /** Display name */
  name: string;

  /** Metric type */
  type: MetricType;

  /** Goal direction */
  direction: GoalDirection;

  /** Whether this is the primary metric for winner selection */
  primary: boolean;

  /** Description of what this metric measures */
  description?: string;

  /** Minimum sample size needed for significance */
  minSampleSize?: number;

  /** Statistical power (1 - beta) for sample size calculation */
  statisticalPower?: number;

  /** Minimum detectable effect (practical significance threshold) */
  minDetectableEffect?: number;
}

/**
 * Bayesian posterior parameters
 */
export interface PosteriorParameters {
  /** Alpha parameter (for Beta distribution) */
  alpha: number;

  /** Beta parameter (for Beta distribution) */
  beta: number;

  /** Mean of posterior */
  mean: number;

  /** Variance of posterior */
  variance: number;

  /** Standard deviation */
  stdDev: number;
}

/**
 * Bandit arm statistics
 */
export interface BanditArm {
  /** Variant ID */
  variantId: string;

  /** Number of pulls (assignments) */
  pulls: number;

  /** Cumulative reward */
  reward: number;

  /** Average reward */
  averageReward: number;

  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * Bandit selection result
 */
export interface BanditSelection {
  /** Selected variant ID */
  variantId: string;

  /** Algorithm used */
  algorithm: BanditAlgorithm;

  /** Selection score (for debugging) */
  score: number;

  /** Exploration vs exploitation decision */
  explored: boolean;

  /** All arm scores (for debugging) */
  allScores: Record<string, number>;
}

/**
 * Bandit configuration
 */
export interface BanditConfig {
  /** Algorithm to use */
  algorithm: BanditAlgorithm;

  /** Exploration rate (for epsilon-greedy) */
  epsilon?: number;

  /** Confidence level (for UCB1) */
  confidenceLevel?: number;

  /** Learning rate (for adaptive) */
  learningRate?: number;

  /** Minimum pulls before trusting bandit */
  minPullsPerVariant?: number;

  /** Temperature for softmax (adaptive) */
  temperature?: number;

  /** Whether to decay exploration over time */
  decayExploration?: boolean;

  /** Exploration decay rate */
  decayRate?: number;
}

/**
 * Multi-armed bandit state
 */
export interface BanditState {
  /** Experiment ID */
  experimentId: string;

  /** Counts per variant (number of pulls) */
  counts: Record<string, number>;

  /** Rewards per variant (cumulative) */
  rewards: Record<string, number>;

  /** Posterior parameters for each variant */
  posteriors: Record<string, PosteriorParameters>;

  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * Variant statistics
 */
export interface VariantStats {
  /** Variant ID */
  variantId: string;

  /** Total users assigned */
  totalUsers: number;

  /** Total users exposed */
  exposedUsers: number;

  /** Metric values by metric ID */
  metrics: Record<string, MetricStatistics>;

  /** Bayesian probability of being best (0-1) */
  probabilityOfBeingBest?: number;

  /** Expected improvement over baseline */
  expectedImprovement?: number;

  /** Credible interval (95%) */
  credibleInterval?: [number, number];

  /** Risk (potential loss if chosen) */
  risk?: number;
}

/**
 * Metric statistics for a variant
 */
export interface MetricStatistics {
  /** Metric ID */
  metricId: string;

  /** Sample size */
  sampleSize: number;

  /** Mean value */
  mean: number;

  /** Standard deviation */
  stdDev: number;

  /** Standard error */
  stdErr: number;

  /** Variance */
  variance: number;

  /** Min value */
  min: number;

  /** Max value */
  max: number;

  /** For binary metrics: success rate */
  successRate?: number;

  /** For count/ratio metrics: total sum */
  sum?: number;

  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * Experiment results
 */
export interface ExperimentResults {
  /** Experiment ID */
  experimentId: string;

  /** Experiment status */
  status: ExperimentStatus;

  /** Variant statistics by variant ID */
  variants: Record<string, VariantStats>;

  /** Winning variant (if determined) */
  winner?: {
    /** Variant ID */
    variantId: string;

    /** Probability of being best */
    probability: number;

    /** Expected lift over control */
    lift: number;

    /** Lift percentage */
    liftPercentage: string;

    /** Confidence level */
    confidence: string;
  };

  /** Whether experiment has significant results */
  hasSignificantResults: boolean;

  /** Total sample size across all variants */
  totalSampleSize: number;

  /** Recommended action */
  recommendation?: 'keep_winner' | 'keep_control' | 'continue_testing' | 'inconclusive';

  /** Analysis timestamp */
  analyzedAt: number;

  /** Confidence in results (0-1) */
  overallConfidence: number;
}
