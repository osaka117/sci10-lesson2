import { TopicInfo, DifficultyInfo, TopicId, DifficultyLevel } from '../types/physics';

export const TOPICS: TopicInfo[] = [
  {
    id: 'momentum',
    name: 'Momentum (p = mv)',
    code: 'TOPIC-A',
    description: 'Definition, mass & velocity relationship, vector nature, SI units (kg·m/s), and magnitude comparisons.',
    iconName: 'Gauge',
  },
  {
    id: 'impulse',
    name: 'Impulse (J = FΔt)',
    code: 'TOPIC-B',
    description: 'Definition, force & contact duration, product of force and time interval, and SI units (N·s).',
    iconName: 'Zap',
  },
  {
    id: 'impulse_momentum',
    name: 'Impulse-Momentum Theorem',
    code: 'TOPIC-C',
    description: 'Relationship J = Δp, initial & final momentum, change in momentum, finding final velocity, kicking & catching.',
    iconName: 'Repeat',
  },
  {
    id: 'conservation',
    name: 'Conservation of Momentum',
    code: 'TOPIC-D',
    description: 'Isolated systems, same and opposite direction 1D collisions, and objects coupling/sticking together.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'real_life',
    name: 'Real-Life Applications',
    code: 'TOPIC-E',
    description: 'Airbags, crumple zones, catching follow-through, bouncing vs stopping impact forces, time-force trade-off.',
    iconName: 'Activity',
  },
];

export const DIFFICULTY_LEVELS: DifficultyInfo[] = [
  {
    level: 1,
    name: 'Level 1: Basic',
    descriptor: 'Definitions, formulas, standard SI units, and basic 1-step concept recognition.',
    color: '#00e5ff',
  },
  {
    level: 2,
    name: 'Level 2: Easy',
    descriptor: 'Direct substitution into p = mv or J = FΔt; identifying initial and final momentum.',
    color: '#00e676',
  },
  {
    level: 3,
    name: 'Level 3: Intermediate',
    descriptor: 'Calculating Δp, applying J = Δp, solving for an unknown variable (mass, velocity, force, or time).',
    color: '#ffb703',
  },
  {
    level: 4,
    name: 'Level 4: Challenging',
    descriptor: 'Combining two formulas, simple 1D conservation of momentum, sign conventions (+/- directions).',
    color: '#fb8500',
  },
  {
    level: 5,
    name: 'Level 5: Difficult',
    descriptor: 'Multi-step Grade 10 scenarios, rearranging formulas, inelastic sticking collisions, bouncing impacts.',
    color: '#ff5252',
  },
];

export const getTopicName = (id: TopicId): string => {
  return TOPICS.find((t) => t.id === id)?.name || id;
};

export const getDifficultyInfo = (level: DifficultyLevel): DifficultyInfo => {
  return (
    DIFFICULTY_LEVELS.find((d) => d.level === level) || {
      level,
      name: `Level ${level}`,
      descriptor: '',
      color: '#00e5ff',
    }
  );
};
