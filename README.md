# @superinstance/bayesian-multi-armed-bandits

> **Bayesian multi-armed bandit algorithms for intelligent A/B testing and optimization**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@superinstance/bayesian-multi-armed-bandits.svg)](https://www.npmjs.com/package/@superinstance/bayesian-multi-armed-bandits)

A powerful TypeScript library for A/B testing and optimization using multi-armed bandit algorithms with Bayesian statistical analysis. Automatically balances exploration and exploitation to maximize rewards while minimizing regret.

## ✨ Features

- 🎰 **4 Bandit Algorithms** - Epsilon-Greedy, UCB1, Thompson Sampling, Adaptive
- 📊 **Bayesian Analysis** - Posterior distributions, credible intervals, probability of being best
- 🎯 **Adaptive Allocation** - Dynamically optimize traffic allocation based on performance
- 🚀 **Production Ready** - Zero dependencies, fully typed, battle-tested
- 📈 **Algorithm Comparison** - Built-in tools to compare algorithms
- 🔧 **Highly Configurable** - Exploration rates, confidence levels, temperature parameters

## 🚀 Quick Start

### Installation

```bash
npm install @superinstance/bayesian-multi-armed-bandits
```

### Basic Usage

```typescript
import { MultiArmedBandit } from '@superinstance/bayesian-multi-armed-bandits';

// Define your variants
const variants = [
  { id: 'control', name: 'Control', weight: 1, config: {}, isControl: true },
  { id: 'variant_a', name: 'Variant A', weight: 1, config: {} },
  { id: 'variant_b', name: 'Variant B', weight: 1, config: {} },
];

// Create bandit with Thompson Sampling (recommended)
const bandit = new MultiArmedBandit({
  algorithm: 'thompson-sampling',
  minPullsPerVariant: 10,
});

// Run experiment
for (let i = 0; i < 1000; i++) {
  // Select variant
  const selection = bandit.selectVariant(variants);
  console.log(`Selected: ${selection.variantId}`);

  // Show variant to user and get reward
  const reward = await showVariantAndGetReward(selection.variantId);
  // Reward: 0-1 for binary (success/failure), or any continuous value

  // Update bandit
  bandit.updateReward(selection.variantId, reward);
}

// Get best variant
const bestVariant = bandit.getBestVariant();
console.log(`Best variant: ${bestVariant}`);

// Check convergence
if (bandit.hasConverged()) {
  console.log('Experiment converged!');
}

// Get statistics
const stats = bandit.getArmStatistics();
console.log('Statistics:', stats);
```

## 📖 Algorithms

### 1. Epsilon-Greedy

Simple exploration vs exploitation strategy:
- With probability ε: explore (random variant)
- With probability 1-ε: exploit (best variant)

**Best for:** Low-traffic experiments, simple use cases

```typescript
const bandit = new MultiArmedBandit({
  algorithm: 'epsilon-greedy',
  epsilon: 0.1, // 10% exploration
  decayExploration: true, // Decay exploration over time
  decayRate: 0.995,
});
```

### 2. UCB1 (Upper Confidence Bound)

Optimism in the face of uncertainty:
- Selects variant with highest upper confidence bound
- Balances exploration/exploitation automatically
- Uses confidence intervals for uncertainty estimation

**Best for:** High-traffic experiments with many variants

```typescript
const bandit = new MultiArmedBandit({
  algorithm: 'ucb1',
  confidenceLevel: 2.0, // Confidence level for UCB
});
```

### 3. Thompson Sampling (Recommended)

Bayesian probability matching:
- Samples from posterior distribution of each variant
- Naturally balances exploration and exploitation
- Best overall performance in most scenarios

**Best for:** General use, high-variance rewards

```typescript
const bandit = new MultiArmedBandit({
  algorithm: 'thompson-sampling',
  minPullsPerVariant: 10,
});
```

### 4. Adaptive Allocation

Gradient-based optimization with softmax:
- Uses gradient descent to adapt allocation probabilities
- Temperature parameter controls exploration/exploitation
- Good for dynamic environments

**Best for:** Non-stationary environments, changing reward distributions

```typescript
const bandit = new MultiArmedBandit({
  algorithm: 'adaptive',
  temperature: 1.0, // Higher = more exploration
  learningRate: 0.1,
});
```

## 📊 API Reference

### `MultiArmedBandit`

#### Constructor

```typescript
new MultiArmedBandit(config: BanditConfig)
```

**Config Options:**
- `algorithm`: Which algorithm to use
- `epsilon`: Exploration rate (epsilon-greedy, default: 0.1)
- `confidenceLevel`: Confidence level (UCB1, default: 2.0)
- `learningRate`: Learning rate (adaptive, default: 0.1)
- `minPullsPerVariant`: Minimum pulls before trusting bandit (default: 10)
- `temperature`: Softmax temperature (adaptive, default: 1.0)
- `decayExploration`: Decay exploration over time (default: false)
- `decayRate`: Exploration decay rate (default: 0.995)

#### Methods

**`selectVariant(variants: Variant[]): BanditSelection`**
- Select a variant using the configured algorithm
- Returns selected variant ID and metadata

**`updateReward(variantId: string, reward: number): void`**
- Update bandit with reward signal (0-1 for binary, any number for continuous)

**`getBestVariant(): string | null`**
- Get the best performing variant ID
- Returns null if not enough data

**`hasConverged(threshold?: number): boolean`**
- Check if bandit has converged
- Default threshold: 0.01

**`getArmStatistics(): Record<string, BanditArm>`**
- Get current statistics for all arms

**`reset(): void`**
- Reset bandit state

**`exportState(): BanditState`**
- Export bandit state for persistence

### Utility Functions

**`recommendBanditAlgorithm(numVariants, expectedVolume, rewardVariance)`**
- Get algorithm recommendation based on experiment characteristics

```typescript
import { recommendBanditAlgorithm } from '@superinstance/bayesian-multi-armed-bandits';

const algorithm = recommendBanditAlgorithm(
  3, // numVariants
  10000, // expectedVolume
  'high' // rewardVariance: 'low' | 'medium' | 'high'
);
console.log(`Recommended: ${algorithm}`); // 'thompson-sampling'
```

**`compareBanditAlgorithms(variants, rewards, rounds)`**
- Simulate and compare all algorithms

```typescript
import { compareBanditAlgorithms } from '@superinstance/bayesian-multi-armed-bandits';

const results = compareBanditAlgorithms(
  variants,
  {
    'control': [0, 0, 1, 0, 1], // Reward distributions
    'variant_a': [1, 1, 1, 0, 1],
    'variant_b': [0, 1, 1, 1, 1],
  },
  1000 // rounds
);

console.log(results);
// {
//   'epsilon-greedy': { totalReward: 650, finalVariant: 'variant_a' },
//   'ucb1': { totalReward: 720, finalVariant: 'variant_a' },
//   'thompson-sampling': { totalReward: 780, finalVariant: 'variant_a' },
//   'adaptive': { totalReward: 700, finalVariant: 'variant_a' }
// }
```

## 🎯 Use Cases

### 1. Conversion Rate Optimization

```typescript
const bandit = new MultiArmedBandit({ algorithm: 'thompson-sampling' });

// Test different checkout button colors
const variants = [
  { id: 'blue', name: 'Blue Button', weight: 1, config: { color: 'blue' } },
  { id: 'green', name: 'Green Button', weight: 1, config: { color: 'green' } },
  { id: 'red', name: 'Red Button', weight: 1, config: { color: 'red' } },
];

// Select button color
const selection = bandit.selectVariant(variants);
showButtonColor(selection.variantId);

// Track conversion
const converted = userCompletedCheckout() ? 1 : 0;
bandit.updateReward(selection.variantId, converted);
```

### 2. Dynamic Pricing

```typescript
const bandit = new MultiArmedBandit({ algorithm: 'ucb1' });

const priceVariants = [
  { id: 'low', name: 'Low Price', weight: 1, config: { price: 9.99 } },
  { id: 'medium', name: 'Medium Price', weight: 1, config: { price: 14.99 } },
  { id: 'high', name: 'High Price', weight: 1, config: { price: 19.99 } },
];

const selection = bandit.selectVariant(priceVariants);
showPrice(selection.variantId);

// Reward = profit
const profit = calculateProfit();
bandit.updateReward(selection.variantId, profit);
```

### 3. Content Optimization

```typescript
const bandit = new MultiArmedBandit({ algorithm: 'thompson-sampling' });

const headlines = [
  { id: 'h1', name: 'Headline 1', weight: 1, config: { text: 'Buy Now!' } },
  { id: 'h2', name: 'Headline 2', weight: 1, config: { text: 'Limited Offer!' } },
  { id: 'h3', name: 'Headline 3', weight: 1, config: { text: 'Best Deal!' } },
];

const selection = bandit.selectVariant(headlines);
showHeadline(selection.variantId);

// Track engagement (click-through rate)
const clicked = userClicked() ? 1 : 0;
bandit.updateReward(selection.variantId, clicked);
```

## 🧪 Testing

```typescript
import { MultiArmedBandit } from '@superinstance/bayesian-multi-armed-bandits';

describe('Bandit Tests', () => {
  test('selects best variant over time', () => {
    const bandit = new MultiArmedBandit({ algorithm: 'thompson-sampling' });

    const variants = [
      { id: 'good', name: 'Good', weight: 1, config: {} },
      { id: 'bad', name: 'Bad', weight: 1, config: {} },
    ];

    // Run 100 rounds
    for (let i = 0; i < 100; i++) {
      const selection = bandit.selectVariant(variants);

      // Good variant gives reward 0.8, bad gives 0.2
      const reward = selection.variantId === 'good' ? 0.8 : 0.2;
      bandit.updateReward(selection.variantId, reward);
    }

    const best = bandit.getBestVariant();
    expect(best).toBe('good');
  });

  test('converges over time', () => {
    const bandit = new MultiArmedBandit({ algorithm: 'thompson-sampling' });

    // Run experiment...
    // After enough rounds:
    expect(bandit.hasConverged()).toBe(true);
  });
});
```

## 📈 Performance Tips

1. **Use Thompson Sampling** for most scenarios (best overall performance)
2. **Set appropriate `minPullsPerVariant`** (default: 10 is good for most cases)
3. **Enable exploration decay** for long-running experiments
4. **Monitor convergence** to stop experiments early when clear winner emerges
5. **Use algorithm comparison** to test different strategies before deployment

## 🔬 Advanced Usage

### Custom Reward Functions

```typescript
// Binary reward (conversion)
const reward = userConverted() ? 1 : 0;

// Continuous reward (revenue)
const reward = orderValue;

// Normalized reward (engagement score)
const reward = calculateEngagementScore(); // 0-1

// Composite reward
const reward = 0.7 * conversionRate + 0.3 * averageOrderValue;
```

### State Persistence

```typescript
// Export state
const state = bandit.exportState();
localStorage.setItem('bandit-state', JSON.stringify(state));

// Import state
const saved = JSON.parse(localStorage.getItem('bandit-state')!);
// Use saved state to restore bandit (implementation depends on your needs)
```

### Multi-Metric Optimization

```typescript
// Track multiple metrics and combine rewards
const clickReward = userClicked() ? 1 : 0;
const timeReward = normalizeTimeOnPage(timeOnPage);
const conversionReward = userConverted() ? 1 : 0;

// Weighted composite reward
const compositeReward =
  0.3 * clickReward +
  0.3 * timeReward +
  0.4 * conversionReward;

bandit.updateReward(variantId, compositeReward);
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [SuperInstance](https://github.com/SuperInstance)

## 🙚 Acknowledgments

Built with inspiration from:
- [Thompson Sampling (1933)](https://en.wikipedia.org/wiki/Thompson_sampling) - Bayesian approach
- [UCB1 Algorithm (2002)](https://en.wikipedia.org/wiki/Upper_confidence_bound) - Optimism in uncertainty
- [Epsilon-Greedy (1950s)](https://en.wikipedia.org/wiki/Reinforcement_learning#Explore-exploit_dilemma) - Simple exploration
- [Multi-Armed Bandits](https://en.wikipedia.org/wiki/Multi-armed_bandit) - Classic problem

## 🔗 Related Packages

- [@superinstance/hardware-aware-flagging](https://github.com/SuperInstance/Hardware-Aware-Flagging) - Feature flagging with hardware detection
- [@superinstance/privacy-first-analytics](https://github.com/SuperInstance/Privacy-First-Analytics) - Privacy-focused analytics

---

Made with ❤️ by the SuperInstance team
