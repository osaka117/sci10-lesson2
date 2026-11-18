import { Question, QuestionOption, TopicId, DifficultyLevel } from '../types/physics';

// Helper utilities for generator
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function roundDec(val: number, dec: number = 1): number {
  const factor = Math.pow(10, dec);
  return Math.round(val * factor) / factor;
}

function makeOptions(
  correctVal: string,
  distractors: string[]
): { options: QuestionOption[]; correctAnswerId: string } {
  // Filter out any distractors identical to correctVal
  const uniqueDistractors = Array.from(new Set(distractors.filter((d) => d !== correctVal)));
  
  // Fill up to 3 distractors if needed
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`$${randomInt(5, 50)}\\text{ units}$`);
  }

  const allTexts = [correctVal, uniqueDistractors[0], uniqueDistractors[1], uniqueDistractors[2]];
  const shuffledTexts = shuffle(allTexts);

  const letters = ['A', 'B', 'C', 'D'];
  const options: QuestionOption[] = shuffledTexts.map((text, idx) => ({
    id: letters[idx],
    text,
  }));

  const correctIdx = shuffledTexts.indexOf(correctVal);
  const correctAnswerId = letters[correctIdx];

  return { options, correctAnswerId };
}

export interface QuestionTemplate {
  topicId: TopicId;
  difficulty: DifficultyLevel;
  generator: () => Question;
}

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  // ==========================================
  // TOPIC A: MOMENTUM
  // ==========================================

  // Level 1: Momentum - Definition / SI unit
  {
    topicId: 'momentum',
    difficulty: 1,
    generator: () => {
      const isSIUnit = Math.random() > 0.5;
      if (isSIUnit) {
        const correct = '$\\text{kg}\\cdot\\text{m/s}$';
        const { options, correctAnswerId } = makeOptions(correct, [
          '$\\text{N}\\cdot\\text{m}$ (Joules)',
          '$\\text{kg}\\cdot\\text{m/s}^2$ (Newtons)',
          '$\\text{m/s}^2$',
        ]);
        return {
          id: `mom-l1-unit-${Date.now()}-${Math.random()}`,
          topicId: 'momentum',
          difficulty: 1,
          title: 'SI Unit of Linear Momentum',
          problemStatement: 'What is the standard International System of Units (SI unit) for linear momentum ($p$)?',
          options,
          correctAnswerId,
          formulaUsed: 'p = mv',
          formulaReason: 'Because momentum is the product of mass (measured in $\\text{kg}$) and velocity (measured in $\\text{m/s}$).',
          givenValues: [
            { symbol: 'm', value: 'mass', unit: 'kg' },
            { symbol: 'v', value: 'velocity', unit: 'm/s' },
          ],
          steps: [
            {
              label: 'Step 1: Inspect the Momentum Formula',
              detail: 'Recall the definition formula: $p = mv$.',
            },
            {
              label: 'Step 2: Multiply Base SI Units',
              detail: 'Units of mass = $\\text{kg}$; Units of velocity = $\\text{m/s}$. Multiplying gives $\\text{kg}\\cdot\\text{m/s}$. (Equivalent to $\\text{N}\\cdot\\text{s}$).',
            },
          ],
          gufsa: {
            given: [
              'Mass ($m$) is measured in kilograms ($\\text{kg}$)',
              'Velocity ($v$) is measured in meters per second ($\\text{m/s}$)',
            ],
            unknown: 'Standard SI unit of linear momentum ($p$)',
            formula: '$p = mv$',
            solution: [
              'Substitute the SI units of mass and velocity: $\\text{unit of } p = (\\text{kg}) \\times (\\text{m/s})$',
              'Multiply the units together: $\\text{kg}\\cdot\\text{m/s}$',
            ],
            answer: '$\\text{kg}\\cdot\\text{m/s}$',
          },
          takeaway: 'Momentum is measured in kilograms times meters per second ($\\text{kg}\\cdot\\text{m/s}$). It has identical dimensions to impulse ($\\text{N}\\cdot\\text{s}$).',
          isConceptual: true,
        };
      } else {
        const correct = 'Momentum is a vector quantity having both magnitude and direction.';
        const { options, correctAnswerId } = makeOptions(correct, [
          'Momentum is a scalar quantity with only magnitude and no direction.',
          'Momentum depends solely on an object’s mass, regardless of speed.',
          'Momentum is always positive, even if an object moves backwards.',
        ]);
        return {
          id: `mom-l1-def-${Date.now()}-${Math.random()}`,
          topicId: 'momentum',
          difficulty: 1,
          title: 'Nature of Momentum: Vector vs. Scalar',
          problemStatement: 'Which statement accurately describes linear momentum in Grade 10 physics?',
          options,
          correctAnswerId,
          formulaUsed: '\\vec{p} = m\\vec{v}',
          formulaReason: 'Velocity is a vector quantity (magnitude and direction), so multiplying by scalar mass makes momentum a vector pointing in the same direction.',
          givenValues: [],
          steps: [
            {
              label: 'Step 1: Recall Vector Definitions',
              detail: 'A vector quantity has both magnitude (size) and direction. A scalar has only magnitude.',
            },
            {
              label: 'Step 2: Connect to Velocity',
              detail: 'Since velocity specifies direction (e.g. forward vs backward, east vs west), momentum $\\vec{p}$ shares that exact direction.',
            },
          ],
          gufsa: {
            given: [
              'Mass ($m$) is a scalar quantity (magnitude only)',
              'Velocity ($\\vec{v}$) is a vector quantity (magnitude and direction)',
            ],
            unknown: 'Whether linear momentum ($\\vec{p}$) is a vector or scalar quantity',
            formula: '$\\vec{p} = m\\vec{v}$',
            solution: [
              'Multiplying a scalar ($m$) by a vector ($\\vec{v}$) yields a vector pointing in the same direction as $\\vec{v}$.',
              'Therefore, momentum depends on both mass and velocity, and carries both magnitude and direction.',
            ],
            answer: 'Momentum is a vector quantity having both magnitude and direction.',
          },
          takeaway: 'Because velocity is a vector, momentum is also a vector! Moving in reverse means negative momentum.',
          isConceptual: true,
        };
      }
    },
  },

  // Level 1: Momentum - Basic 1-step calculation
  {
    topicId: 'momentum',
    difficulty: 1,
    generator: () => {
      const mass = randomChoice([2, 3, 4, 5, 10]);
      const velocity = randomChoice([2, 4, 5, 10, 15]);
      const p = mass * velocity;
      const correct = `$${p}\\text{ kg}\\cdot\\text{m/s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${mass + velocity}\\text{ kg}\\cdot\\text{m/s}$`,
        `$${roundDec(velocity / mass, 1)}\\text{ kg}\\cdot\\text{m/s}$`,
        `$${mass * velocity * 2}\\text{ kg}\\cdot\\text{m/s}$`,
      ]);

      return {
        id: `mom-l1-calc-${Date.now()}-${Math.random()}`,
        topicId: 'momentum',
        difficulty: 1,
        title: 'Basic Momentum Calculation',
        problemStatement: `A toy cart has a mass of $${mass}\\text{ kg}$ and travels at a constant velocity of $${velocity}\\text{ m/s}$. What is the magnitude of its momentum?`,
        options,
        correctAnswerId,
        formulaUsed: 'p = mv',
        formulaReason: 'Linear momentum is defined directly as the product of mass and velocity.',
        givenValues: [
          { symbol: 'm', value: `${mass}`, unit: 'kg' },
          { symbol: 'v', value: `${velocity}`, unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Write Down the Formula',
            detail: '$p = mv$',
          },
          {
            label: 'Step 2: Substitute Known Values',
            detail: `$p = (${mass}\\text{ kg}) \\times (${velocity}\\text{ m/s})$`,
          },
          {
            label: 'Step 3: Calculate the Result',
            detail: `$p = ${p}\\text{ kg}\\cdot\\text{m/s}$`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${mass}\\text{ kg}$`,
            `$v = ${velocity}\\text{ m/s}$`,
          ],
          unknown: '$p = ?\\text{ (kg}\\cdot\\text{m/s)}$',
          formula: '$p = mv$',
          solution: [
            `$p = (${mass}\\text{ kg})(${velocity}\\text{ m/s})$`,
            `$p = ${p}\\text{ kg}\\cdot\\text{m/s}$`,
          ],
          answer: `$p = ${p}\\text{ kg}\\cdot\\text{m/s}$`,
        },
        takeaway: 'Always verify standard units: mass in kilograms (kg) and velocity in meters per second (m/s).',
        isConceptual: false,
      };
    },
  },

  // Level 2: Momentum - Easy substitution with realistic objects
  {
    topicId: 'momentum',
    difficulty: 2,
    generator: () => {
      const objects = [
        { name: 'bowling ball', mass: 6, velocity: 4 },
        { name: 'sprinter', mass: 70, velocity: 8 },
        { name: 'motorcycle', mass: 200, velocity: 15 },
        { name: 'dog', mass: 25, velocity: 6 },
      ];
      const obj = randomChoice(objects);
      const p = obj.mass * obj.velocity;
      const correct = `$${p}\\text{ kg}\\cdot\\text{m/s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${obj.mass + obj.velocity}\\text{ kg}\\cdot\\text{m/s}$`,
        `$${roundDec(p / 2, 1)}\\text{ kg}\\cdot\\text{m/s}$`,
        `$${roundDec(obj.mass / obj.velocity, 1)}\\text{ kg}\\cdot\\text{m/s}$`,
      ]);

      return {
        id: `mom-l2-obj-${Date.now()}-${Math.random()}`,
        topicId: 'momentum',
        difficulty: 2,
        title: `Momentum of a ${obj.name}`,
        problemStatement: `A $${obj.mass}\\text{ kg}$ ${obj.name} moves forward with a velocity of $${obj.velocity}\\text{ m/s}$. Calculate its momentum.`,
        options,
        correctAnswerId,
        formulaUsed: 'p = mv',
        formulaReason: 'Use the standard momentum formula by substituting the mass and velocity of the moving body.',
        givenValues: [
          { symbol: 'm', value: `${obj.mass}`, unit: 'kg' },
          { symbol: 'v', value: `${obj.velocity}`, unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: State Known Quantities',
            detail: `Mass $m = ${obj.mass}\\text{ kg}$, Velocity $v = ${obj.velocity}\\text{ m/s}$.`,
          },
          {
            label: 'Step 2: Apply $p = mv$',
            detail: `$p = (${obj.mass}\\text{ kg})(${obj.velocity}\\text{ m/s}) = ${p}\\text{ kg}\\cdot\\text{m/s}$.`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${obj.mass}\\text{ kg}$`,
            `$v = ${obj.velocity}\\text{ m/s}$`,
          ],
          unknown: '$p = ?\\text{ (kg}\\cdot\\text{m/s)}$',
          formula: '$p = mv$',
          solution: [
            `$p = (${obj.mass}\\text{ kg})(${obj.velocity}\\text{ m/s})$`,
            `$p = ${p}\\text{ kg}\\cdot\\text{m/s}$`,
          ],
          answer: `$p = ${p}\\text{ kg}\\cdot\\text{m/s}$`,
        },
        takeaway: 'Even moderate speeds yield substantial momentum when the mass is large.',
        isConceptual: false,
      };
    },
  },

  // Level 2: Momentum - Compare two objects
  {
    topicId: 'momentum',
    difficulty: 2,
    generator: () => {
      // Compare light fast object vs heavy slow object
      const mass1 = 0.5; // ball
      const v1 = 20; // fast
      const p1 = mass1 * v1; // 10

      const mass2 = 10; // heavy crate
      const v2 = 1; // slow
      const p2 = mass2 * v2; // 10

      const correct = 'Both objects possess the exact same momentum magnitude ($10\\text{ kg}\\cdot\\text{m/s}$).';
      const { options, correctAnswerId } = makeOptions(correct, [
        'Object B has greater momentum because it has much greater mass.',
        'Object A has greater momentum because speed matters more than mass in momentum.',
        'Neither object has momentum because their velocities are under $50\\text{ m/s}$.',
      ]);

      return {
        id: `mom-l2-compare-${Date.now()}-${Math.random()}`,
        topicId: 'momentum',
        difficulty: 2,
        title: 'Comparing Momentum of Two Objects',
        problemStatement: `Object A has a mass of $0.5\\text{ kg}$ moving at $20\\text{ m/s}$. Object B has a mass of $10\\text{ kg}$ moving at $1.0\\text{ m/s}$. How do their momentums compare?`,
        options,
        correctAnswerId,
        formulaUsed: 'p = mv',
        formulaReason: 'Calculate $p_A = m_A v_A$ and $p_B = m_B v_B$ and directly compare the products.',
        givenValues: [
          { symbol: 'm_A', value: '0.5', unit: 'kg' },
          { symbol: 'v_A', value: '20', unit: 'm/s' },
          { symbol: 'm_B', value: '10', unit: 'kg' },
          { symbol: 'v_B', value: '1.0', unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Calculate Momentum of Object A',
            detail: '$p_A = (0.5\\text{ kg})(20\\text{ m/s}) = 10\\text{ kg}\\cdot\\text{m/s}$',
          },
          {
            label: 'Step 2: Calculate Momentum of Object B',
            detail: '$p_B = (10\\text{ kg})(1.0\\text{ m/s}) = 10\\text{ kg}\\cdot\\text{m/s}$',
          },
          {
            label: 'Step 3: Compare Results',
            detail: 'Since $10 = 10$, both objects have equal momentum magnitude.',
          },
        ],
        gufsa: {
          given: [
            'Object A: $m_A = 0.5\\text{ kg}$, $v_A = 20\\text{ m/s}$',
            'Object B: $m_B = 10\\text{ kg}$, $v_B = 1.0\\text{ m/s}$',
          ],
          unknown: 'Comparison between $p_A$ and $p_B$',
          formula: '$p = mv$',
          solution: [
            '$p_A = (0.5\\text{ kg})(20\\text{ m/s}) = 10\\text{ kg}\\cdot\\text{m/s}$',
            '$p_B = (10\\text{ kg})(1.0\\text{ m/s}) = 10\\text{ kg}\\cdot\\text{m/s}$',
            'Compare: $10\\text{ kg}\\cdot\\text{m/s} = 10\\text{ kg}\\cdot\\text{m/s}$',
          ],
          answer: 'Both objects possess the exact same momentum magnitude ($10\\text{ kg}\\cdot\\text{m/s}$).',
        },
        takeaway: 'A heavier object does not automatically have greater momentum; high speed can compensate for small mass!',
        isConceptual: true,
      };
    },
  },

  // Level 3: Momentum - Rearrange formula to find mass or velocity
  {
    topicId: 'momentum',
    difficulty: 3,
    generator: () => {
      const v = randomChoice([5, 8, 12, 15, 20]);
      const p = randomChoice([60, 120, 180, 240, 300]);
      const m = roundDec(p / v, 1);
      const correct = `$${m}\\text{ kg}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${p * v}\\text{ kg}$`,
        `$${roundDec(v / p, 2)}\\text{ kg}$`,
        `$${p - v}\\text{ kg}$`,
      ]);

      return {
        id: `mom-l3-rearrange-${Date.now()}-${Math.random()}`,
        topicId: 'momentum',
        difficulty: 3,
        title: 'Rearranging the Momentum Formula',
        problemStatement: `A moving object has a momentum of $${p}\\text{ kg}\\cdot\\text{m/s}$ while traveling at a velocity of $${v}\\text{ m/s}$. What is the mass of the object?`,
        options,
        correctAnswerId,
        formulaUsed: 'm = \\frac{p}{v}',
        formulaReason: 'Start with $p = mv$ and isolate mass $m$ by dividing both sides by velocity $v$.',
        givenValues: [
          { symbol: 'p', value: `${p}`, unit: 'kg·m/s' },
          { symbol: 'v', value: `${v}`, unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Rearrange $p = mv$',
            detail: 'Divide both sides by $v$: $m = \\frac{p}{v}$.',
          },
          {
            label: 'Step 2: Substitute Given Values',
            detail: `$m = \\frac{${p}\\text{ kg}\\cdot\\text{m/s}}{${v}\\text{ m/s}}$`,
          },
          {
            label: 'Step 3: Calculate Mass',
            detail: `$m = ${m}\\text{ kg}$`,
          },
        ],
        gufsa: {
          given: [
            `$p = ${p}\\text{ kg}\\cdot\\text{m/s}$`,
            `$v = ${v}\\text{ m/s}$`,
          ],
          unknown: '$m = ?\\text{ (kg)}$',
          formula: '$p = mv \\implies m = \\frac{p}{v}$',
          solution: [
            `$m = \\frac{${p}\\text{ kg}\\cdot\\text{m/s}}{${v}\\text{ m/s}}$`,
            `$m = ${m}\\text{ kg}$`,
          ],
          answer: `$m = ${m}\\text{ kg}$`,
        },
        takeaway: 'Formula manipulation is a vital Grade 10 skill: $m = \\frac{p}{v}$ and $v = \\frac{p}{m}$.',
        isConceptual: false,
      };
    },
  },

  // ==========================================
  // TOPIC B: IMPULSE
  // ==========================================

  // Level 1: Impulse - Definition & SI unit
  {
    topicId: 'impulse',
    difficulty: 1,
    generator: () => {
      const correct = '$\\text{N}\\cdot\\text{s}$ (Newton-seconds)';
      const { options, correctAnswerId } = makeOptions(correct, [
        '$\\text{N/s}$ (Newtons per second)',
        '$\\text{kg}\\cdot\\text{m/s}^2$ (Newtons)',
        '$\\text{Watts}$ (Joules per second)',
      ]);
      return {
        id: `imp-l1-def-${Date.now()}-${Math.random()}`,
        topicId: 'impulse',
        difficulty: 1,
        title: 'Definition and SI Unit of Impulse',
        problemStatement: 'Impulse is defined as the product of force and the time duration over which it acts. What is the standard SI unit of impulse ($J$)?',
        options,
        correctAnswerId,
        formulaUsed: 'J = F\\Delta t',
        formulaReason: 'Force is measured in Newtons (N) and time interval in seconds (s), producing $N\\cdot s$.',
        givenValues: [
          { symbol: 'F', value: 'Force', unit: 'N' },
          { symbol: '\\Delta t', value: 'Time interval', unit: 's' },
        ],
        steps: [
          {
            label: 'Step 1: Formula for Impulse',
            detail: '$J = F\\Delta t$',
          },
          {
            label: 'Step 2: Multiply Units',
            detail: 'Units of force (N) $\\times$ Units of time (s) = $\\text{N}\\cdot\\text{s}$. (Note: $1\\text{ N}\\cdot\\text{s} = 1\\text{ kg}\\cdot\\text{m/s}$).',
          },
        ],
        gufsa: {
          given: [
            'Force ($F$) is measured in Newtons ($\\text{N}$)',
            'Time interval ($\\Delta t$) is measured in seconds ($\\text{s}$)',
          ],
          unknown: 'Standard SI unit of impulse ($J$)',
          formula: '$J = F\\Delta t$',
          solution: [
            'Substitute SI units: $\\text{unit of } J = (\\text{N}) \\times (\\text{s})$',
            'Multiply the units together: $\\text{N}\\cdot\\text{s}$',
          ],
          answer: '$\\text{N}\\cdot\\text{s}$ (Newton-seconds)',
        },
        takeaway: 'Impulse is measured in Newton-seconds ($\\text{N}\\cdot\\text{s}$), which is physically equivalent to $\\text{kg}\\cdot\\text{m/s}$.',
        isConceptual: true,
      };
    },
  },

  // Level 2: Impulse - Direct calculation
  {
    topicId: 'impulse',
    difficulty: 2,
    generator: () => {
      const force = randomChoice([50, 100, 200, 350, 500]);
      const time = randomChoice([0.1, 0.2, 0.5, 0.8, 1.2]);
      const J = roundDec(force * time, 1);
      const correct = `$${J}\\text{ N}\\cdot\\text{s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${roundDec(force / time, 1)}\\text{ N}\\cdot\\text{s}$`,
        `$${roundDec(force + time, 1)}\\text{ N}\\cdot\\text{s}$`,
        `$${roundDec(J * 2, 1)}\\text{ N}\\cdot\\text{s}$`,
      ]);

      return {
        id: `imp-l2-calc-${Date.now()}-${Math.random()}`,
        topicId: 'impulse',
        difficulty: 2,
        title: 'Impulse Delivered by Constant Force',
        problemStatement: `An athlete applies an average horizontal force of $${force}\\text{ N}$ to a sled for a duration of $${time}\\text{ s}$. How much impulse is imparted?`,
        options,
        correctAnswerId,
        formulaUsed: 'J = F\\Delta t',
        formulaReason: 'Use the impulse formula directly by multiplying average force and contact duration.',
        givenValues: [
          { symbol: 'F', value: `${force}`, unit: 'N' },
          { symbol: '\\Delta t', value: `${time}`, unit: 's' },
        ],
        steps: [
          {
            label: 'Step 1: Recall the Formula',
            detail: '$J = F\\Delta t$',
          },
          {
            label: 'Step 2: Substitute Knowns',
            detail: `$J = (${force}\\text{ N})(${time}\\text{ s})$`,
          },
          {
            label: 'Step 3: Compute Result',
            detail: `$J = ${J}\\text{ N}\\cdot\\text{s}$`,
          },
        ],
        gufsa: {
          given: [
            `$F = ${force}\\text{ N}$`,
            `$\\Delta t = ${time}\\text{ s}$`,
          ],
          unknown: '$J = ?\\text{ (N}\\cdot\\text{s)}$',
          formula: '$J = F\\Delta t$',
          solution: [
            `$J = (${force}\\text{ N})(${time}\\text{ s})$`,
            `$J = ${J}\\text{ N}\\cdot\\text{s}$`,
          ],
          answer: `$J = ${J}\\text{ N}\\cdot\\text{s}$`,
        },
        takeaway: 'Impulse measures the cumulative effect of a force exerted over a given duration.',
        isConceptual: false,
      };
    },
  },

  // Level 3: Impulse - Solve for unknown Force or Contact Time
  {
    topicId: 'impulse',
    difficulty: 3,
    generator: () => {
      const impulse = randomChoice([20, 40, 60, 80, 120]);
      const time = randomChoice([0.02, 0.04, 0.05, 0.1]);
      const force = Math.round(impulse / time);
      const correct = `$${force}\\text{ N}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${roundDec(impulse * time, 2)}\\text{ N}$`,
        `$${Math.round(force / 2)}\\text{ N}$`,
        `$${force + 150}\\text{ N}$`,
      ]);

      return {
        id: `imp-l3-find-force-${Date.now()}-${Math.random()}`,
        topicId: 'impulse',
        difficulty: 3,
        title: 'Determining Average Force from Impulse',
        problemStatement: `A tennis racket exerts an impulse of $${impulse}\\text{ N}\\cdot\\text{s}$ on a ball during a brief contact time of $${time}\\text{ s}$. What is the average force exerted on the ball?`,
        options,
        correctAnswerId,
        formulaUsed: 'F = \\frac{J}{\\Delta t}',
        formulaReason: 'Rearrange $J = F\\Delta t$ to isolate force: $F = \\frac{J}{\\Delta t}$.',
        givenValues: [
          { symbol: 'J', value: `${impulse}`, unit: 'N·s' },
          { symbol: '\\Delta t', value: `${time}`, unit: 's' },
        ],
        steps: [
          {
            label: 'Step 1: Rearrange $J = F\\Delta t$',
            detail: '$F = \\frac{J}{\\Delta t}$',
          },
          {
            label: 'Step 2: Substitute Known Values',
            detail: `$F = \\frac{${impulse}\\text{ N}\\cdot\\text{s}}{${time}\\text{ s}}$`,
          },
          {
            label: 'Step 3: Calculate the Force',
            detail: `$F = ${force}\\text{ N}$`,
          },
        ],
        gufsa: {
          given: [
            `$J = ${impulse}\\text{ N}\\cdot\\text{s}$`,
            `$\\Delta t = ${time}\\text{ s}$`,
          ],
          unknown: '$F = ?\\text{ (N)}$',
          formula: '$J = F\\Delta t \\implies F = \\frac{J}{\\Delta t}$',
          solution: [
            `$F = \\frac{${impulse}\\text{ N}\\cdot\\text{s}}{${time}\\text{ s}}$`,
            `$F = ${force}\\text{ N}$`,
          ],
          answer: `$F = ${force}\\text{ N}$`,
        },
        takeaway: 'Notice how small contact times (like $0.05\\text{ s}$) produce enormous impact forces for the same impulse!',
        isConceptual: false,
      };
    },
  },

  // ==========================================
  // TOPIC C: IMPULSE-MOMENTUM THEOREM
  // ==========================================

  // Level 2: Change in momentum (same direction speed change)
  {
    topicId: 'impulse_momentum',
    difficulty: 2,
    generator: () => {
      const mass = randomChoice([2, 3, 5, 8]);
      const vi = randomChoice([4, 6, 8]);
      const vf = vi + randomChoice([5, 8, 10]);
      const deltaP = mass * (vf - vi);
      const correct = `$${deltaP}\\text{ kg}\\cdot\\text{m/s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${mass * vf}\\text{ kg}\\cdot\\text{m/s}$`,
        `$${mass * vi}\\text{ kg}\\cdot\\text{m/s}$`,
        `$${vf - vi}\\text{ kg}\\cdot\\text{m/s}$`,
      ]);

      return {
        id: `im-l2-deltap-${Date.now()}-${Math.random()}`,
        topicId: 'impulse_momentum',
        difficulty: 2,
        title: 'Calculating Change in Momentum',
        problemStatement: `A $${mass}\\text{ kg}$ cart accelerates along a straight track from an initial velocity of $${vi}\\text{ m/s}$ to a final velocity of $${vf}\\text{ m/s}$. What is its change in momentum ($\\Delta p$)?`,
        options,
        correctAnswerId,
        formulaUsed: '\\Delta p = m(v_f - v_i)',
        formulaReason: 'Change in momentum is final momentum minus initial momentum: $\\Delta p = p_f - p_i = m(v_f - v_i)$.',
        givenValues: [
          { symbol: 'm', value: `${mass}`, unit: 'kg' },
          { symbol: 'v_i', value: `${vi}`, unit: 'm/s' },
          { symbol: 'v_f', value: `${vf}`, unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Write Formula',
            detail: '$\\Delta p = m v_f - m v_i = m(v_f - v_i)$',
          },
          {
            label: 'Step 2: Substitute Given Values',
            detail: `$\\Delta p = ${mass}(${vf} - ${vi}) = ${mass}(${vf - vi})$`,
          },
          {
            label: 'Step 3: Solve',
            detail: `$\\Delta p = ${deltaP}\\text{ kg}\\cdot\\text{m/s}$`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${mass}\\text{ kg}$`,
            `$v_i = ${vi}\\text{ m/s}$`,
            `$v_f = ${vf}\\text{ m/s}$`,
          ],
          unknown: '$\\Delta p = ?\\text{ (kg}\\cdot\\text{m/s)}$',
          formula: '$\\Delta p = p_f - p_i = m(v_f - v_i)$',
          solution: [
            `$\\Delta p = (${mass}\\text{ kg})(${vf}\\text{ m/s} - ${vi}\\text{ m/s})$`,
            `$\\Delta p = (${mass}\\text{ kg})(${vf - vi}\\text{ m/s}) = ${deltaP}\\text{ kg}\\cdot\\text{m/s}$`,
          ],
          answer: `$\\Delta p = ${deltaP}\\text{ kg}\\cdot\\text{m/s}$`,
        },
        takeaway: '$\\Delta p$ is positive when an object speeds up in the forward direction.',
        isConceptual: false,
      };
    },
  },

  // Level 3: Impulse equals change in momentum (J = Δp)
  {
    topicId: 'impulse_momentum',
    difficulty: 3,
    generator: () => {
      const mass = randomChoice([0.2, 0.4, 0.5]);
      const vi = 0; // kicked from rest
      const vf = randomChoice([20, 25, 30, 40]);
      const deltaP = roundDec(mass * vf, 1);
      const correct = `$${deltaP}\\text{ N}\\cdot\\text{s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${vf}\\text{ N}\\cdot\\text{s}$`,
        `$${roundDec(vf / mass, 1)}\\text{ N}\\cdot\\text{s}$`,
        `$${roundDec(deltaP * 2, 1)}\\text{ N}\\cdot\\text{s}$`,
      ]);

      return {
        id: `im-l3-kick-${Date.now()}-${Math.random()}`,
        topicId: 'impulse_momentum',
        difficulty: 3,
        title: 'Impulse Delivered to a Kicked Ball',
        problemStatement: `A soccer ball with mass $${mass}\\text{ kg}$ is initially at rest ($v_i = 0$). A player kicks it, giving it a velocity of $${vf}\\text{ m/s}$. According to the Impulse-Momentum Theorem, what impulse was applied to the ball?`,
        options,
        correctAnswerId,
        formulaUsed: 'J = \\Delta p = m(v_f - v_i)',
        formulaReason: 'By the Impulse-Momentum Theorem, the impulse delivered to an object equals its change in momentum ($J = \\Delta p$).',
        givenValues: [
          { symbol: 'm', value: `${mass}`, unit: 'kg' },
          { symbol: 'v_i', value: '0', unit: 'm/s' },
          { symbol: 'v_f', value: `${vf}`, unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: State Impulse-Momentum Theorem',
            detail: '$J = \\Delta p = m v_f - m v_i$',
          },
          {
            label: 'Step 2: Substitute Given Values',
            detail: `$J = (${mass}\\text{ kg})(${vf}\\text{ m/s}) - 0 = ${deltaP}\\text{ kg}\\cdot\\text{m/s}$`,
          },
          {
            label: 'Step 3: Convert Units',
            detail: `$1\\text{ kg}\\cdot\\text{m/s} = 1\\text{ N}\\cdot\\text{s}$, so $J = ${deltaP}\\text{ N}\\cdot\\text{s}$.`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${mass}\\text{ kg}$`,
            '$v_i = 0\\text{ m/s}$ (at rest)',
            `$v_f = ${vf}\\text{ m/s}$`,
          ],
          unknown: '$J = ?\\text{ (N}\\cdot\\text{s)}$',
          formula: '$J = \\Delta p = m(v_f - v_i)$',
          solution: [
            `$J = (${mass}\\text{ kg})(${vf}\\text{ m/s} - 0\\text{ m/s})$`,
            `$J = ${deltaP}\\text{ kg}\\cdot\\text{m/s} = ${deltaP}\\text{ N}\\cdot\\text{s}$`,
          ],
          answer: `$J = ${deltaP}\\text{ N}\\cdot\\text{s}$`,
        },
        takeaway: 'Impulse and change in momentum are numerically identical and share equivalent physical units!',
        isConceptual: false,
      };
    },
  },

  // Level 3: Finding final velocity using impulse (vf = vi + J/m)
  {
    topicId: 'impulse_momentum',
    difficulty: 3,
    generator: () => {
      const mass = randomChoice([2, 4, 5]);
      const vi = randomChoice([3, 5, 8]);
      const impulse = randomChoice([16, 20, 24, 30, 40]);
      const vf = vi + impulse / mass;
      const correct = `$${roundDec(vf, 1)}\\text{ m/s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${roundDec(impulse / mass, 1)}\\text{ m/s}$`,
        `$${roundDec(vi + impulse, 1)}\\text{ m/s}$`,
        `$${roundDec(vi * 2, 1)}\\text{ m/s}$`,
      ]);

      return {
        id: `im-l3-find-vf-${Date.now()}-${Math.random()}`,
        topicId: 'impulse_momentum',
        difficulty: 3,
        title: 'Determining Final Velocity from Impulse',
        problemStatement: `A $${mass}\\text{ kg}$ cart is already traveling forward at $${vi}\\text{ m/s}$. A booster rocket exerts a forward impulse of $${impulse}\\text{ N}\\cdot\\text{s}$. What is the cart's final velocity?`,
        options,
        correctAnswerId,
        formulaUsed: 'v_f = v_i + \\frac{J}{m}',
        formulaReason: 'From $J = m(v_f - v_i)$, rearrange to find final velocity: $v_f = v_i + \\frac{J}{m}$.',
        givenValues: [
          { symbol: 'm', value: `${mass}`, unit: 'kg' },
          { symbol: 'v_i', value: `${vi}`, unit: 'm/s' },
          { symbol: 'J', value: `${impulse}`, unit: 'N·s' },
        ],
        steps: [
          {
            label: 'Step 1: Set Up Impulse-Momentum Theorem',
            detail: '$J = m v_f - m v_i$',
          },
          {
            label: 'Step 2: Solve for $v_f$',
            detail: '$v_f = v_i + \\frac{J}{m}$',
          },
          {
            label: 'Step 3: Substitute and Calculate',
            detail: `$v_f = ${vi} + \\frac{${impulse}}{${mass}} = ${vi} + ${impulse / mass} = ${roundDec(vf, 1)}\\text{ m/s}$`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${mass}\\text{ kg}$`,
            `$v_i = ${vi}\\text{ m/s}$`,
            `$J = ${impulse}\\text{ N}\\cdot\\text{s}$`,
          ],
          unknown: '$v_f = ?\\text{ (m/s)}$',
          formula: '$J = m(v_f - v_i) \\implies v_f = v_i + \\frac{J}{m}$',
          solution: [
            `$v_f = ${vi}\\text{ m/s} + \\frac{${impulse}\\text{ N}\\cdot\\text{s}}{${mass}\\text{ kg}}$`,
            `$v_f = ${vi} + ${impulse / mass} = ${roundDec(vf, 1)}\\text{ m/s}$`,
          ],
          answer: `$v_f = ${roundDec(vf, 1)}\\text{ m/s}$`,
        },
        takeaway: 'Impulse divided by mass gives the change in velocity ($\\Delta v = \\frac{J}{m}$). Add that to initial velocity!',
        isConceptual: false,
      };
    },
  },

  // Level 4: Impulse with Direction Reversal (Crucial Grade 10 sign convention!)
  {
    topicId: 'impulse_momentum',
    difficulty: 4,
    generator: () => {
      const mass = 0.5; // basketball or ball
      const speed = randomChoice([6, 8, 10, 12]);
      // Bounces back at same speed in opposite direction: vi = +speed, vf = -speed
      // Delta p = m(-speed - speed) = -2 * m * speed
      const deltaP = -2 * mass * speed;
      const magDeltaP = Math.abs(deltaP);
      const correct = `$${magDeltaP}\\text{ N}\\cdot\\text{s}$ opposite to incoming direction`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$0\\text{ N}\\cdot\\text{s}$ (momentum was cancelled out)`,
        `$${roundDec(mass * speed, 1)}\\text{ N}\\cdot\\text{s}$`,
        `$${roundDec(speed * 2, 1)}\\text{ N}\\cdot\\text{s}$`,
      ]);

      return {
        id: `im-l4-reversal-${Date.now()}-${Math.random()}`,
        topicId: 'impulse_momentum',
        difficulty: 4,
        title: 'Impulse During a Bouncing Reversal',
        problemStatement: `A $${mass}\\text{ kg}$ rubber ball hits a solid wall horizontally at $+${speed}\\text{ m/s}$ and bounces straight back at $-${speed}\\text{ m/s}$. What is the magnitude of the impulse delivered by the wall?`,
        options,
        correctAnswerId,
        formulaUsed: 'J = \\Delta p = m(v_f - v_i)',
        formulaReason: `Because momentum is a vector, reversing direction requires accounting for the negative sign in final velocity ($v_f = -${speed}\\text{ m/s}$).`,
        givenValues: [
          { symbol: 'm', value: `${mass}`, unit: 'kg' },
          { symbol: 'v_i', value: `+${speed}`, unit: 'm/s' },
          { symbol: 'v_f', value: `-${speed}`, unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Assign Direction Signs',
            detail: `Incoming velocity $v_i = +${speed}\\text{ m/s}$, Rebound velocity $v_f = -${speed}\\text{ m/s}$.`,
          },
          {
            label: 'Step 2: Calculate $\\Delta p = m(v_f - v_i)$',
            detail: `$\\Delta p = ${mass}((-${speed}) - (+${speed})) = ${mass}(-${speed * 2}) = -${magDeltaP}\\text{ kg}\\cdot\\text{m/s}$.`,
          },
          {
            label: 'Step 3: State Impulse Magnitude',
            detail: `Magnitude of impulse is $|J| = ${magDeltaP}\\text{ N}\\cdot\\text{s}$ directed away from the wall.`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${mass}\\text{ kg}$`,
            `$v_i = +${speed}\\text{ m/s}$ (toward wall)`,
            `$v_f = -${speed}\\text{ m/s}$ (rebounding back)`,
          ],
          unknown: '$|J| = ?\\text{ (N}\\cdot\\text{s and direction)}$',
          formula: '$J = \\Delta p = m(v_f - v_i)$',
          solution: [
            `$J = (${mass}\\text{ kg})((-${speed}\\text{ m/s}) - (+${speed}\\text{ m/s}))$`,
            `$J = (${mass})(-${speed * 2}) = -${magDeltaP}\\text{ N}\\cdot\\text{s}$`,
            `$|J| = ${magDeltaP}\\text{ N}\\cdot\\text{s}$ opposite to incoming direction`,
          ],
          answer: `$${magDeltaP}\\text{ N}\\cdot\\text{s}$ opposite to incoming direction`,
        },
        takeaway: 'Common trap: Students often think $\\Delta p = 0$. Reversing direction doubles the momentum change compared to simply stopping!',
        isConceptual: false,
      };
    },
  },

  // Level 5: Difficult Multi-step (Stopping force of braking vehicle)
  {
    topicId: 'impulse_momentum',
    difficulty: 5,
    generator: () => {
      const mass = randomChoice([1000, 1200, 1500]);
      const vi = randomChoice([15, 20, 25]); // m/s
      const time = randomChoice([2.5, 3.0, 4.0]);
      const deltaP = -mass * vi;
      const force = Math.round(deltaP / time);
      const magForce = Math.abs(force);
      const correct = `$${magForce}\\text{ N}$ backward`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${Math.round(mass * vi)}\\text{ N}$`,
        `$${Math.round(magForce / 2)}\\text{ N}$`,
        `$${roundDec(vi / time, 1)}\\text{ N}$`,
      ]);

      return {
        id: `im-l5-braking-${Date.now()}-${Math.random()}`,
        topicId: 'impulse_momentum',
        difficulty: 5,
        title: 'Emergency Braking Force Calculation',
        problemStatement: `A $${mass}\\text{ kg}$ automobile traveling forward at $${vi}\\text{ m/s}$ brakes to a complete halt ($v_f = 0$) in $${time}\\text{ s}$. What average net braking force was exerted on the vehicle?`,
        options,
        correctAnswerId,
        formulaUsed: 'F = \\frac{m(v_f - v_i)}{\\Delta t}',
        formulaReason: 'Combine the Impulse-Momentum Theorem $F\\Delta t = \\Delta p$ and solve for force $F = \\frac{\\Delta p}{\\Delta t}$.',
        givenValues: [
          { symbol: 'm', value: `${mass}`, unit: 'kg' },
          { symbol: 'v_i', value: `${vi}`, unit: 'm/s' },
          { symbol: 'v_f', value: '0', unit: 'm/s' },
          { symbol: '\\Delta t', value: `${time}`, unit: 's' },
        ],
        steps: [
          {
            label: 'Step 1: Calculate Total Change in Momentum',
            detail: `$\\Delta p = m(v_f - v_i) = ${mass}(0 - ${vi}) = -${mass * vi}\\text{ kg}\\cdot\\text{m/s}$.`,
          },
          {
            label: 'Step 2: Apply $F = \\frac{\\Delta p}{\\Delta t}$',
            detail: `$F = \\frac{-${mass * vi}\\text{ N}\\cdot\\text{s}}{${time}\\text{ s}} = ${force}\\text{ N}$.`,
          },
          {
            label: 'Step 3: Interpret Sign and Direction',
            detail: `The negative sign confirms the force opposes motion (backward). Magnitude is $${magForce}\\text{ N}$.`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${mass}\\text{ kg}$`,
            `$v_i = ${vi}\\text{ m/s}$`,
            '$v_f = 0\\text{ m/s}$ (complete halt)',
            `$\\Delta t = ${time}\\text{ s}$`,
          ],
          unknown: '$F = ?\\text{ (N and direction)}$',
          formula: '$F\\Delta t = m(v_f - v_i) \\implies F = \\frac{m(v_f - v_i)}{\\Delta t}$',
          solution: [
            `$F = \\frac{(${mass}\\text{ kg})(0 - ${vi}\\text{ m/s})}{${time}\\text{ s}}$`,
            `$F = \\frac{-${mass * vi}\\text{ kg}\\cdot\\text{m/s}}{${time}\\text{ s}} = ${force}\\text{ N}$`,
            'The negative sign shows the braking force acts backward.',
          ],
          answer: `$${magForce}\\text{ N}$ backward`,
        },
        takeaway: 'Stopping a fast, massive object in a short duration requires massive braking force.',
        isConceptual: false,
      };
    },
  },

  // ==========================================
  // TOPIC D: CONSERVATION OF MOMENTUM
  // ==========================================

  // Level 1: Conservation - Concept of isolated system
  {
    topicId: 'conservation',
    difficulty: 1,
    generator: () => {
      const correct = 'Total momentum remains constant if no net external forces act on the system.';
      const { options, correctAnswerId } = makeOptions(correct, [
        'Total momentum is always conserved only when the collision is completely frictionless and speed never changes.',
        'Total momentum increases whenever kinetic energy is lost.',
        'Momentum is conserved only if both interacting objects have identical masses.',
      ]);

      return {
        id: `con-l1-def-${Date.now()}-${Math.random()}`,
        topicId: 'conservation',
        difficulty: 1,
        title: 'Law of Conservation of Momentum',
        problemStatement: 'Under what physical condition is the total linear momentum of a system conserved?',
        options,
        correctAnswerId,
        formulaUsed: '\\sum p_{\\text{initial}} = \\sum p_{\\text{final}}',
        formulaReason: 'According to Newton\'s Third Law and the conservation principle, internal forces cancel in pairs, leaving total momentum constant in an isolated system.',
        givenValues: [],
        steps: [
          {
            label: 'Step 1: Define an "Isolated System"',
            detail: 'An isolated system has a net external force of zero ($\\sum F_{\\text{ext}} = 0$).',
          },
          {
            label: 'Step 2: Internal Forces and Newton\'s Third Law',
            detail: 'Forces between interacting objects are action-reaction pairs ($F_{12} = -F_{21}$), imparting equal and opposite impulses that cancel.',
          },
        ],
        gufsa: {
          given: [
            'A system of interacting objects (e.g., two colliding carts)',
            'Net external force acting on the system is zero ($\\sum F_{\\text{ext}} = 0$)',
          ],
          unknown: 'Condition required for total linear momentum to remain conserved',
          formula: '$\\sum p_{\\text{initial}} = \\sum p_{\\text{final}}$',
          solution: [
            'During an interaction, internal forces occur in equal and opposite pairs ($F_{12} = -F_{21}$).',
            'With no net external force ($J_{\\text{ext}} = 0$), total system momentum cannot change.',
          ],
          answer: 'Total momentum remains constant if no net external forces act on the system.',
        },
        takeaway: 'In any closed, isolated system with zero net external force, total momentum before = total momentum after.',
        isConceptual: true,
      };
    },
  },

  // Level 3: Conservation - 2 Objects Sticking Together (Inelastic Collision)
  {
    topicId: 'conservation',
    difficulty: 3,
    generator: () => {
      const m1 = randomChoice([2, 3, 4]);
      const u1 = randomChoice([6, 8, 10]);
      const m2 = randomChoice([2, 3, 4]);
      const u2 = 0; // stationary
      const totalP = m1 * u1;
      const totalM = m1 + m2;
      const vf = roundDec(totalP / totalM, 2);
      const correct = `$${vf}\\text{ m/s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${roundDec(u1 / 2, 2)}\\text{ m/s}$`,
        `$${roundDec(totalP / m1, 2)}\\text{ m/s}$`,
        `$${roundDec((u1 + totalM) / 2, 2)}\\text{ m/s}$`,
      ]);

      return {
        id: `con-l3-stick-${Date.now()}-${Math.random()}`,
        topicId: 'conservation',
        difficulty: 3,
        title: 'Collision: Two Objects Sticking Together',
        problemStatement: `Cart 1 ($m_1 = ${m1}\\text{ kg}$) rolls east at $${u1}\\text{ m/s}$ and collides with stationary Cart 2 ($m_2 = ${m2}\\text{ kg}$, $u_2 = 0$). They lock together upon impact. What is their combined velocity ($v_f$)?`,
        options,
        correctAnswerId,
        formulaUsed: 'm_1 u_1 + m_2 u_2 = (m_1 + m_2)v_f',
        formulaReason: 'Because the objects stick together, they share a single common final velocity $v_f$. Total momentum is conserved.',
        givenValues: [
          { symbol: 'm_1', value: `${m1}`, unit: 'kg' },
          { symbol: 'u_1', value: `${u1}`, unit: 'm/s' },
          { symbol: 'm_2', value: `${m2}`, unit: 'kg' },
          { symbol: 'u_2', value: '0', unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Calculate Total Initial Momentum',
            detail: `$p_{\\text{initial}} = m_1 u_1 + m_2 u_2 = (${m1})(${u1}) + (${m2})(0) = ${totalP}\\text{ kg}\\cdot\\text{m/s}$.`,
          },
          {
            label: 'Step 2: Express Final Momentum',
            detail: `$p_{\\text{final}} = (m_1 + m_2) v_f = (${m1} + ${m2}) v_f = ${totalM} v_f$.`,
          },
          {
            label: 'Step 3: Equate and Solve for $v_f$',
            detail: `${totalM} v_f = ${totalP} \\implies v_f = \\frac{${totalP}}{${totalM}} = ${vf}\\text{ m/s}$.`,
          },
        ],
        gufsa: {
          given: [
            `$m_1 = ${m1}\\text{ kg}$, $u_1 = ${u1}\\text{ m/s}$`,
            `$m_2 = ${m2}\\text{ kg}$, $u_2 = 0\\text{ m/s}$ (stationary)`,
          ],
          unknown: '$v_f = ?\\text{ (m/s)}$ (combined velocity)',
          formula: '$m_1 u_1 + m_2 u_2 = (m_1 + m_2)v_f \\implies v_f = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}$',
          solution: [
            `$v_f = \\frac{(${m1}\\text{ kg})(${u1}\\text{ m/s}) + (${m2}\\text{ kg})(0\\text{ m/s})}{${m1}\\text{ kg} + ${m2}\\text{ kg}}$`,
            `$v_f = \\frac{${totalP}}{${totalM}} = ${vf}\\text{ m/s}$`,
          ],
          answer: `$v_f = ${vf}\\text{ m/s}$`,
        },
        takeaway: 'When objects couple together, total mass increases, so common velocity is less than the initial moving cart\'s speed.',
        isConceptual: false,
      };
    },
  },

  // Level 4: Conservation - Opposite Directions (Sign Convention)
  {
    topicId: 'conservation',
    difficulty: 4,
    generator: () => {
      // m1 = 4 kg moving east at +3 m/s, m2 = 2 kg moving west at -2 m/s
      // Stick together
      const m1 = randomChoice([3, 4, 5]);
      const u1 = randomChoice([3, 4, 5]); // east (+)
      const m2 = randomChoice([2, 3]);
      const u2_mag = randomChoice([1, 2, 3]);
      const u2 = -u2_mag; // west (-)

      const p1 = m1 * u1;
      const p2 = m2 * u2;
      const totalP = p1 + p2;
      const totalM = m1 + m2;
      const vf = roundDec(totalP / totalM, 2);
      const dir = vf >= 0 ? 'east' : 'west';
      const magVf = Math.abs(vf);

      const correct = `$${magVf}\\text{ m/s}$ ${dir}`;
      const wrongNoSign = roundDec((p1 + m2 * u2_mag) / totalM, 2);
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${wrongNoSign}\\text{ m/s}$ east (forgetting west is negative)`,
        `$${roundDec(Math.abs(u1 - u2_mag), 2)}\\text{ m/s}$ east`,
        `$0\\text{ m/s}$ (both carts stop completely)`,
      ]);

      return {
        id: `con-l4-opposite-${Date.now()}-${Math.random()}`,
        topicId: 'conservation',
        difficulty: 4,
        title: 'Collision in Opposite Directions',
        problemStatement: `Glider A ($${m1}\\text{ kg}$) moves east at $+${u1}\\text{ m/s}$. Glider B ($${m2}\\text{ kg}$) moves west at $-${u2_mag}\\text{ m/s}$. They collide and couple together. What is their final velocity?`,
        options,
        correctAnswerId,
        formulaUsed: 'm_1 u_1 + m_2 u_2 = (m_1 + m_2)v_f',
        formulaReason: 'Directions matter: assign positive to east and negative to west before adding initial momentums.',
        givenValues: [
          { symbol: 'm_1', value: `${m1}`, unit: 'kg' },
          { symbol: 'u_1', value: `+${u1}`, unit: 'm/s (east)' },
          { symbol: 'm_2', value: `${m2}`, unit: 'kg' },
          { symbol: 'u_2', value: `-${u2_mag}`, unit: 'm/s (west)' },
        ],
        steps: [
          {
            label: 'Step 1: Compute Individual Initial Momentums',
            detail: `$p_1 = (${m1})(+${u1}) = +${p1}\\text{ kg}\\cdot\\text{m/s}$ and $p_2 = (${m2})(-${u2_mag}) = ${p2}\\text{ kg}\\cdot\\text{m/s}$.`,
          },
          {
            label: 'Step 2: Total Initial Momentum',
            detail: `$p_{\\text{total}} = ${p1} + (${p2}) = ${totalP}\\text{ kg}\\cdot\\text{m/s}$.`,
          },
          {
            label: 'Step 3: Solve for Combined Velocity',
            detail: `$v_f = \\frac{p_{\\text{total}}}{m_1 + m_2} = \\frac{${totalP}}{${totalM}} = ${vf}\\text{ m/s}$ (${dir}).`,
          },
        ],
        gufsa: {
          given: [
            `$m_1 = ${m1}\\text{ kg}$, $u_1 = +${u1}\\text{ m/s}$ (east)`,
            `$m_2 = ${m2}\\text{ kg}$, $u_2 = -${u2_mag}\\text{ m/s}$ (west)`,
          ],
          unknown: '$v_f = ?\\text{ (m/s and direction)}$',
          formula: '$m_1 u_1 + m_2 u_2 = (m_1 + m_2)v_f \\implies v_f = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}$',
          solution: [
            `$p_{\\text{total}} = (${m1})(+${u1}) + (${m2})(-${u2_mag}) = ${p1} + (${p2}) = ${totalP}\\text{ kg}\\cdot\\text{m/s}$`,
            `$v_f = \\frac{${totalP}\\text{ kg}\\cdot\\text{m/s}}{${m1}\\text{ kg} + ${m2}\\text{ kg}} = \\frac{${totalP}}{${totalM}} = ${vf}\\text{ m/s}$ (${dir})`,
          ],
          answer: `$${magVf}\\text{ m/s}$ ${dir}`,
        },
        takeaway: 'Always assign signs to directions! West, left, and backward are negative.',
        isConceptual: false,
      };
    },
  },

  // Level 5: Difficult Conservation - Find unknown individual velocity after bounce
  {
    topicId: 'conservation',
    difficulty: 5,
    generator: () => {
      // 2 balls collide elastically on a track:
      // m1 = 2 kg, u1 = 5 m/s
      // m2 = 3 kg, u2 = 0 m/s
      // After collision, m1 bounces back at v1 = -1 m/s. Find v2!
      const m1 = 2;
      const u1 = 5;
      const m2 = 3;
      const u2 = 0;
      const v1 = -1; // rebounds
      // m1*u1 + m2*u2 = m1*v1 + m2*v2
      // 2(5) + 0 = 2(-1) + 3(v2)
      // 10 = -2 + 3*v2 => 12 = 3*v2 => v2 = 4 m/s
      const v2 = 4;
      const correct = `$${v2}\\text{ m/s}$ forward`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$2.67\\text{ m/s}$ (if rebound sign is ignored: $(10 - 2)/3$)`,
        `$1.5\\text{ m/s}$ forward`,
        `$5.0\\text{ m/s}$ forward`,
      ]);

      return {
        id: `con-l5-rebound-unknown-${Date.now()}-${Math.random()}`,
        topicId: 'conservation',
        difficulty: 5,
        title: 'Two-Object Collision with Rebounding Body',
        problemStatement: `Ball A ($2\\text{ kg}$) rolls forward at $+5\\text{ m/s}$ into stationary Ball B ($3\\text{ kg}$). After the collision, Ball A rebounds backward at $-1\\text{ m/s}$. Assuming an isolated system, what is the final velocity of Ball B?`,
        options,
        correctAnswerId,
        formulaUsed: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2',
        formulaReason: 'Total momentum before equals total momentum after. Isolate $v_2 = \\frac{m_1 u_1 + m_2 u_2 - m_1 v_1}{m_2}$.',
        givenValues: [
          { symbol: 'm_1', value: '2', unit: 'kg' },
          { symbol: 'u_1', value: '+5', unit: 'm/s' },
          { symbol: 'm_2', value: '3', unit: 'kg' },
          { symbol: 'u_2', value: '0', unit: 'm/s' },
          { symbol: 'v_1', value: '-1', unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Compute Total Initial Momentum',
            detail: '$p_{\\text{initial}} = (2)(+5) + (3)(0) = +10\\text{ kg}\\cdot\\text{m/s}$',
          },
          {
            label: 'Step 2: Set Up Final Momentum Equation',
            detail: '$p_{\\text{final}} = m_1 v_1 + m_2 v_2 = (2)(-1) + 3 v_2 = -2 + 3 v_2$',
          },
          {
            label: 'Step 3: Solve for $v_2$',
            detail: '$10 = -2 + 3 v_2 \\implies 12 = 3 v_2 \\implies v_2 = +4\\text{ m/s}$.',
          },
        ],
        gufsa: {
          given: [
            '$m_1 = 2\\text{ kg}$, $u_1 = +5\\text{ m/s}$, $v_1 = -1\\text{ m/s}$',
            '$m_2 = 3\\text{ kg}$, $u_2 = 0\\text{ m/s}$',
          ],
          unknown: '$v_2 = ?\\text{ (m/s)}$ (final velocity of Ball B)',
          formula: '$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$',
          solution: [
            '$(2\\text{ kg})(+5\\text{ m/s}) + (3\\text{ kg})(0\\text{ m/s}) = (2\\text{ kg})(-1\\text{ m/s}) + (3\\text{ kg})v_2$',
            '$10 = -2 + 3 v_2 \\implies 12 = 3 v_2$',
            '$v_2 = \\frac{12}{3} = +4\\text{ m/s}$',
          ],
          answer: '$4\\text{ m/s}$ forward',
        },
        takeaway: 'Notice how Ball A rebounding backward transfers even more forward momentum to Ball B than if Ball A had simply stopped!',
        isConceptual: false,
      };
    },
  },

  // ==========================================
  // TOPIC E: REAL-LIFE APPLICATIONS
  // ==========================================

  // Level 1: Real-life - Airbags concept
  {
    topicId: 'real_life',
    difficulty: 1,
    generator: () => {
      const correct = 'They extend the stopping time ($\\Delta t$), thereby reducing the average impact force ($F$).';
      const { options, correctAnswerId } = makeOptions(correct, [
        'They decrease the stopping time, halting the passenger instantaneously.',
        'They eliminate the passenger\'s change in momentum completely.',
        'They increase the total impulse delivered to the passenger.',
      ]);

      return {
        id: `rl-l1-airbag-${Date.now()}-${Math.random()}`,
        topicId: 'real_life',
        difficulty: 1,
        title: 'Safety Physics: Why Airbags Save Lives',
        problemStatement: 'In the context of the Impulse-Momentum Theorem ($F\\Delta t = \\Delta p$), why do automotive airbags and crumple zones reduce serious injuries during collisions?',
        options,
        correctAnswerId,
        formulaUsed: 'F = \\frac{\\Delta p}{\\Delta t}',
        formulaReason: 'For a given crash speed, $\\Delta p$ is fixed. Increasing duration $\\Delta t$ proportionally reduces the impact force $F$.',
        givenValues: [],
        steps: [
          {
            label: 'Step 1: Identify Fixed Quantity',
            detail: 'The driver has a specific initial momentum $mv_i$ that must reach 0. Thus, $\\Delta p$ is fixed.',
          },
          {
            label: 'Step 2: Examine $F = \\frac{\\Delta p}{\\Delta t}$',
            detail: 'An airbag cushions the driver, prolonging deceleration from milliseconds to tenths of a second (higher $\\Delta t$).',
          },
          {
            label: 'Step 3: Conclusion',
            detail: 'A larger denominator $\\Delta t$ creates a drastically smaller average force $F$ on the body.',
          },
        ],
        gufsa: {
          given: [
            'During a collision, the passenger\'s change in momentum $\\Delta p = m(0 - v_i)$ is fixed',
            'Airbags and crumple zones increase the stopping time interval ($\\Delta t$)',
          ],
          unknown: 'How increasing $\\Delta t$ affects the average impact force ($F$)',
          formula: '$F\\Delta t = \\Delta p \\implies F = \\frac{\\Delta p}{\\Delta t}$',
          solution: [
            'Since $\\Delta p$ is constant for a given crash speed, $F$ is inversely proportional to $\\Delta t$.',
            'A larger stopping time $\\Delta t$ in the denominator produces a much smaller average force $F$.',
          ],
          answer: 'They extend the stopping time ($\\Delta t$), thereby reducing the average impact force ($F$).',
        },
        takeaway: 'Lengthening contact time is the fundamental principle of seatbelts, airbags, gymnastics mats, and catching mitts!',
        isConceptual: true,
      };
    },
  },

  // Level 2: Real-life - Catching a ball (hands moving backward)
  {
    topicId: 'real_life',
    difficulty: 2,
    generator: () => {
      const correct = 'Pulling hands backward lengthens contact time ($\\Delta t$), diminishing the stinging force on the palms.';
      const { options, correctAnswerId } = makeOptions(correct, [
        'Pulling hands backward increases the ball\'s change in momentum.',
        'Pulling hands backward stops the ball with zero impulse.',
        'Holding hands completely rigid minimizes the force felt by the catcher.',
      ]);

      return {
        id: `rl-l2-catch-${Date.now()}-${Math.random()}`,
        topicId: 'real_life',
        difficulty: 2,
        title: 'Physics of Catching a Fast Ball',
        problemStatement: 'Why do baseball catchers and cricket fielders "give" and pull their hands backward in the direction of the ball when catching a fast ball?',
        options,
        correctAnswerId,
        formulaUsed: 'F\\Delta t = \\Delta p \\implies F = \\frac{\\Delta p}{\\Delta t}',
        formulaReason: 'The ball\'s momentum change $\\Delta p$ is identical whether stopped abruptly or gently. Moving hands backward maximizes $\\Delta t$.',
        givenValues: [],
        steps: [
          {
            label: 'Step 1: Compare Impulse Requirements',
            detail: 'To stop the ball, the impulse $J = \\Delta p$ must equal $m(0 - v_i)$.',
          },
          {
            label: 'Step 2: Relate Force to Time',
            detail: 'Since $F = \\frac{J}{\\Delta t}$, extending $\\Delta t$ by "giving" with the hands makes average force $F$ smaller.',
          },
        ],
        gufsa: {
          given: [
            'The ball has a fixed momentum change $\\Delta p = m(0 - v_i)$ when brought to rest',
            'Pulling hands backward increases the contact time ($\\Delta t$)',
          ],
          unknown: 'Why pulling hands backward reduces the impact force on the palms',
          formula: '$F\\Delta t = \\Delta p \\implies F = \\frac{\\Delta p}{\\Delta t}$',
          solution: [
            'The total impulse $J = \\Delta p$ needed to stop the ball stays the same.',
            'Dividing that fixed $\\Delta p$ by a larger contact time $\\Delta t$ reduces the average force $F$.',
          ],
          answer: 'Pulling hands backward lengthens contact time ($\\Delta t$), diminishing the stinging force on the palms.',
        },
        takeaway: '"Soft hands" increase contact time $\\Delta t$, protecting the fielder from painful high impact forces.',
        isConceptual: true,
      };
    },
  },

  // Level 3: Real-life - Bouncing vs. Stopping impact comparison
  {
    topicId: 'real_life',
    difficulty: 3,
    generator: () => {
      const correct = 'Flowerpot B (which bounces), because reversing direction creates double the momentum change ($|\\Delta p| = 2mv$).';
      const { options, correctAnswerId } = makeOptions(correct, [
        'Flowerpot A (which shatters and stops), because breaking glass releases more force.',
        'Both exert identical force because they have the same mass and speed.',
        'Neither flowerpot exerts any impulse on the car roof.',
      ]);

      return {
        id: `rl-l3-bounce-vs-stop-${Date.now()}-${Math.random()}`,
        topicId: 'real_life',
        difficulty: 3,
        title: 'Bouncing vs. Stopping: Which Delivers Greater Impulse?',
        problemStatement: 'Two identical flowerpots of mass $m$ drop from a balcony at speed $v$. Flowerpot A hits a car roof and shatters, stopping completely. Flowerpot B hits an elastic rack and bounces back upward with speed $v$. Which object imparted a greater impulse to the car?',
        options,
        correctAnswerId,
        formulaUsed: 'J = \\Delta p = m(v_f - v_i)',
        formulaReason: 'Calculate $\\Delta p$: Stopping yields $|\\Delta p| = mv$. Rebounding with equal speed yields $|\\Delta p| = m(v - (-v)) = 2mv$.',
        givenValues: [
          { symbol: 'm', value: 'm', unit: 'kg' },
          { symbol: 'v_A', value: 'stops (vf = 0)', unit: 'm/s' },
          { symbol: 'v_B', value: 'bounces (vf = -v)', unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Impulse on Stopping Object A',
            detail: '$J_A = |m(0 - v)| = mv$',
          },
          {
            label: 'Step 2: Impulse on Bouncing Object B',
            detail: '$J_B = |m(-v - v)| = |-2mv| = 2mv$',
          },
          {
            label: 'Step 3: Compare Impulses',
            detail: 'Since $2mv > mv$, the bouncing object experiences and delivers twice as much impulse!',
          },
        ],
        gufsa: {
          given: [
            'Flowerpot A (stops): mass $m$, $v_i = v$, $v_f = 0$',
            'Flowerpot B (bounces): mass $m$, $v_i = v$, $v_f = -v$',
          ],
          unknown: 'Which flowerpot imparts a greater impulse ($|J_A|$ vs $|J_B|$)',
          formula: '$J = \\Delta p = m(v_f - v_i)$',
          solution: [
            'Flowerpot A: $|J_A| = |m(0 - v)| = mv$',
            'Flowerpot B: $|J_B| = |m(-v - v)| = |-2mv| = 2mv$',
            'Compare: $2mv > mv$',
          ],
          answer: 'Flowerpot B (which bounces), because reversing direction creates double the momentum change ($|\\Delta p| = 2mv$).',
        },
        takeaway: 'Bouncing causes a much larger impulse than simply coming to a stop. This is why water wheel Pelton turbines use curved cups to reverse water flow!',
        isConceptual: true,
      };
    },
  },

  // Level 4: Real-life - Kicking follow-through
  {
    topicId: 'real_life',
    difficulty: 4,
    generator: () => {
      const correct = 'Following through increases the contact time ($\\Delta t$), maximizing total impulse and ball launch speed.';
      const { options, correctAnswerId } = makeOptions(correct, [
        'Following through reduces the ball\'s mass during flight.',
        'Following through minimizes the impulse imparted to the ball.',
        'Following through causes the ball to violate conservation of momentum.',
      ]);

      return {
        id: `rl-l4-kick-follow-${Date.now()}-${Math.random()}`,
        topicId: 'real_life',
        difficulty: 4,
        title: 'Physics of Follow-Through in Sports',
        problemStatement: 'In sports like football, tennis, and golf, coaches strongly emphasize "following through" on kicks and swings. From an impulse perspective ($J = F\\Delta t$), why is this beneficial?',
        options,
        correctAnswerId,
        formulaUsed: 'J = F\\Delta t = m\\Delta v',
        formulaReason: 'By following through, the player keeps the foot/racket in contact with the ball for the longest possible duration $\\Delta t$.',
        givenValues: [],
        steps: [
          {
            label: 'Step 1: Inspect Impulse Formula',
            detail: '$J = F\\Delta t$',
          },
          {
            label: 'Step 2: Effect of Contact Duration',
            detail: 'Even if the maximum force $F$ is limited by leg strength, increasing contact time $\\Delta t$ yields greater total impulse $J$.',
          },
          {
            label: 'Step 3: Relate to Exit Speed',
            detail: 'Since $J = m v_f$, a greater impulse directly increases final ball velocity.',
          },
        ],
        gufsa: {
          given: [
            'Player exerts force $F$ on a ball of mass $m$',
            'Following through increases the contact time interval ($\\Delta t$)',
          ],
          unknown: 'Why following through increases impulse ($J$) and launch speed ($v_f$)',
          formula: '$J = F\\Delta t = m(v_f - v_i)$',
          solution: [
            'Increasing $\\Delta t$ directly increases the product $J = F\\Delta t$.',
            'Because $J = \\Delta p = m\\Delta v$, a larger impulse produces a higher final launch speed $v_f$.',
          ],
          answer: 'Following through increases the contact time ($\\Delta t$), maximizing total impulse and ball launch speed.',
        },
        takeaway: 'Follow-through maximizes the time interval $\\Delta t$, transferring maximum momentum to the ball.',
        isConceptual: true,
      };
    },
  },

  // Level 5: Real-life - Numerical comparison of hard wall vs cushioned barrier
  {
    topicId: 'real_life',
    difficulty: 5,
    generator: () => {
      const mass = 1200; // car
      const speed = 15; // m/s (approx 54 km/h)
      // Barrier A: rigid wall, stop in 0.05 s
      // Barrier B: water barrels / crumple zone, stop in 0.6 s
      const deltaP = mass * speed; // 18000 kg*m/s
      const forceA = Math.round(deltaP / 0.05); // 360,000 N
      const forceB = Math.round(deltaP / 0.6); // 30,000 N
      const factor = roundDec(forceA / forceB, 0);

      const correct = `The cushioned barrier reduces average impact force by a factor of $${factor}$ (from $360\\text{ kN}$ down to $30\\text{ kN}$).`;
      const { options, correctAnswerId } = makeOptions(correct, [
        'The cushioned barrier reduces the total impulse by 12 times.',
        'The rigid wall produces less force because the stop occurs much quicker.',
        'Both barriers exert the exact same force of $18\\text{ kN}$.',
      ]);

      return {
        id: `rl-l5-barrier-calc-${Date.now()}-${Math.random()}`,
        topicId: 'real_life',
        difficulty: 5,
        title: 'Highway Crash Attenuator: Force Comparison',
        problemStatement: `A $1200\\text{ kg}$ car traveling at $15\\text{ m/s}$ stops. Hitting a rigid concrete wall stops it in $0.05\\text{ s}$. Hitting an impact attenuator (water barrels) cushions the crash to $0.60\\text{ s}$. Compare the average forces in both crashes.`,
        options,
        correctAnswerId,
        formulaUsed: 'F = \\frac{\\Delta p}{\\Delta t}',
        formulaReason: 'In both crashes, $\\Delta p = 1200 \\times 15 = 18000\\text{ kg}\\cdot\\text{m/s}$. Compute $F_{\\text{wall}} = \\frac{18000}{0.05}$ and $F_{\\text{barrel}} = \\frac{18000}{0.60}$.',
        givenValues: [
          { symbol: 'm', value: '1200', unit: 'kg' },
          { symbol: 'v_i', value: '15', unit: 'm/s' },
          { symbol: '\\Delta t_1', value: '0.05', unit: 's (rigid wall)' },
          { symbol: '\\Delta t_2', value: '0.60', unit: 's (cushioned)' },
        ],
        steps: [
          {
            label: 'Step 1: Calculate $\\Delta p$',
            detail: '$\\Delta p = (1200\\text{ kg})(15\\text{ m/s}) = 18000\\text{ kg}\\cdot\\text{m/s}$ in both cases.',
          },
          {
            label: 'Step 2: Force for Rigid Wall ($0.05\\text{ s}$)',
            detail: '$F_1 = \\frac{18000}{0.05} = 360000\\text{ N} = 360\\text{ kN}$.',
          },
          {
            label: 'Step 3: Force for Cushioned Attenuator ($0.60\\text{ s}$)',
            detail: '$F_2 = \\frac{18000}{0.60} = 30000\\text{ N} = 30\\text{ kN}$.',
          },
          {
            label: 'Step 4: Ratio of Forces',
            detail: '$\\frac{360000}{30000} = 12$. The impact force is cut to $\\frac{1}{12}$th of the lethal wall crash!',
          },
        ],
        gufsa: {
          given: [
            '$m = 1200\\text{ kg}$, $v_i = 15\\text{ m/s}$, $v_f = 0\\text{ m/s}$',
            'Rigid wall: $\\Delta t_1 = 0.05\\text{ s}$; Cushioned barrier: $\\Delta t_2 = 0.60\\text{ s}$',
          ],
          unknown: 'Average impact forces $F_1$ and $F_2$ and how they compare',
          formula: '$F = \\frac{\\Delta p}{\\Delta t} = \\frac{m(v_f - v_i)}{\\Delta t}$',
          solution: [
            '$|\\Delta p| = (1200\\text{ kg})(15\\text{ m/s}) = 18000\\text{ kg}\\cdot\\text{m/s}$',
            '$F_1 = \\frac{18000\\text{ N}\\cdot\\text{s}}{0.05\\text{ s}} = 360000\\text{ N} = 360\\text{ kN}$',
            '$F_2 = \\frac{18000\\text{ N}\\cdot\\text{s}}{0.60\\text{ s}} = 30000\\text{ N} = 30\\text{ kN}$',
            'Ratio: $\\frac{360\\text{ kN}}{30\\text{ kN}} = 12$',
          ],
          answer: `The cushioned barrier reduces average impact force by a factor of $${factor}$ (from $360\\text{ kN}$ down to $30\\text{ kN}$).`,
        },
        takeaway: 'Impulse is the same in both crashes, but increasing time by a factor of 12 reduces destructive force by a factor of 12.',
        isConceptual: false,
      };
    },
  },

  // Level 1: Impulse-Momentum Theorem - Formula Identification
  {
    topicId: 'impulse_momentum',
    difficulty: 1,
    generator: () => {
      const correct = '$F\\Delta t = mv_f - mv_i$ (or $J = \\Delta p$)';
      const { options, correctAnswerId } = makeOptions(correct, [
        '$F = m(v_f + v_i)$',
        '$J = \\frac{m}{\\Delta t}$',
        '$\\Delta p = F + \\Delta t$',
      ]);

      return {
        id: `im-l1-formula-${Date.now()}-${Math.random()}`,
        topicId: 'impulse_momentum',
        difficulty: 1,
        title: 'Impulse-Momentum Theorem Equation',
        problemStatement: 'Which equation correctly expresses the Impulse-Momentum Theorem for an object with constant mass $m$?',
        options,
        correctAnswerId,
        formulaUsed: 'J = \\Delta p \\implies F\\Delta t = mv_f - mv_i',
        formulaReason: 'Derived directly from Newton\'s Second Law: $F = m\\frac{\\Delta v}{\\Delta t} \\implies F\\Delta t = m\\Delta v$.',
        givenValues: [],
        steps: [
          {
            label: 'Step 1: Start with Newton\'s Second Law',
            detail: '$F = ma = m\\left(\\frac{v_f - v_i}{\\Delta t}\\right)$',
          },
          {
            label: 'Step 2: Multiply by $\\Delta t$',
            detail: '$F\\Delta t = m(v_f - v_i) = mv_f - mv_i$',
          },
          {
            label: 'Step 3: Relate to Impulse and Momentum',
            detail: 'Since $J = F\\Delta t$ and $\\Delta p = mv_f - mv_i$, we obtain $J = \\Delta p$.',
          },
        ],
        gufsa: {
          given: [
            'Newton\'s Second Law: $F = ma$',
            'Definition of acceleration: $a = \\frac{v_f - v_i}{\\Delta t}$',
          ],
          unknown: 'Equation expressing the Impulse-Momentum Theorem',
          formula: '$F = m\\left(\\frac{v_f - v_i}{\\Delta t}\\right)$',
          solution: [
            'Multiply both sides by $\\Delta t$: $F\\Delta t = m(v_f - v_i)$',
            'Distribute $m$: $F\\Delta t = mv_f - mv_i$, which is $J = \\Delta p$',
          ],
          answer: '$F\\Delta t = mv_f - mv_i$ (or $J = \\Delta p$)',
        },
        takeaway: 'Impulse applied to an object always equals the resulting change in that object\'s momentum.',
        isConceptual: true,
      };
    },
  },

  // Level 2: Conservation - Recoil (Jumping off skateboard or firing cannon)
  {
    topicId: 'conservation',
    difficulty: 2,
    generator: () => {
      const massPerson = randomChoice([50, 60]);
      const massBoard = randomChoice([3, 5]);
      const vPerson = randomChoice([2, 3]);
      // (massPerson + massBoard) * 0 = massPerson * vPerson + massBoard * vBoard
      // vBoard = - (massPerson * vPerson) / massBoard
      const vBoard = roundDec((massPerson * vPerson) / massBoard, 1);
      const correct = `$${vBoard}\\text{ m/s}$ backward`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${vPerson}\\text{ m/s}$ forward`,
        `$${roundDec(massPerson / massBoard, 1)}\\text{ m/s}$ forward`,
        `$0\\text{ m/s}$ (board stays in place)`,
      ]);

      return {
        id: `con-l2-recoil-${Date.now()}-${Math.random()}`,
        topicId: 'conservation',
        difficulty: 2,
        title: 'Recoil: Skateboarder Jumping Forward',
        problemStatement: `A $${massPerson}\\text{ kg}$ student stands on a stationary $${massBoard}\\text{ kg}$ skateboard. The student jumps forward at $+${vPerson}\\text{ m/s}$. Neglecting friction, what is the recoil velocity of the skateboard?`,
        options,
        correctAnswerId,
        formulaUsed: 'm_1 v_1 + m_2 v_2 = 0',
        formulaReason: 'Because the system starts at rest, initial total momentum is zero. Total final momentum must also be zero.',
        givenValues: [
          { symbol: 'm_{\\text{student}}', value: `${massPerson}`, unit: 'kg' },
          { symbol: 'm_{\\text{board}}', value: `${massBoard}`, unit: 'kg' },
          { symbol: 'v_{\\text{student}}', value: `+${vPerson}`, unit: 'm/s (forward)' },
          { symbol: 'p_{\\text{initial}}', value: '0', unit: 'kg·m/s' },
        ],
        steps: [
          {
            label: 'Step 1: Conservation of Total Momentum',
            detail: '$p_{\\text{initial}} = p_{\\text{final}} \\implies 0 = m_1 v_1 + m_2 v_2$',
          },
          {
            label: 'Step 2: Substitute Knowns',
            detail: `$0 = (${massPerson})(+${vPerson}) + (${massBoard})(v_{\\text{board}}) = ${massPerson * vPerson} + ${massBoard} v_{\\text{board}}$`,
          },
          {
            label: 'Step 3: Solve for $v_{\\text{board}}$',
            detail: `$v_{\\text{board}} = -\\frac{${massPerson * vPerson}}{${massBoard}} = -${vBoard}\\text{ m/s}$ (directed backward).`,
          },
        ],
        gufsa: {
          given: [
            `$m_1 = ${massPerson}\\text{ kg}$ (student), $v_1 = +${vPerson}\\text{ m/s}$ (forward)`,
            `$m_2 = ${massBoard}\\text{ kg}$ (skateboard), $p_{\\text{initial}} = 0\\text{ kg}\\cdot\\text{m/s}$`,
          ],
          unknown: '$v_2 = ?\\text{ (m/s and direction)}$ (skateboard recoil velocity)',
          formula: '$m_1 v_1 + m_2 v_2 = 0 \\implies v_2 = -\\frac{m_1 v_1}{m_2}$',
          solution: [
            `$v_2 = -\\frac{(${massPerson}\\text{ kg})(+${vPerson}\\text{ m/s})}{${massBoard}\\text{ kg}}$`,
            `$v_2 = -\\frac{${massPerson * vPerson}}{${massBoard}} = -${vBoard}\\text{ m/s}$`,
            'The negative sign shows the skateboard recoils backward.',
          ],
          answer: `$${vBoard}\\text{ m/s}$ backward`,
        },
        takeaway: 'Because the skateboard has much less mass than the human, it recoils backward with a significantly higher speed to conserve total momentum!',
        isConceptual: false,
      };
    },
  },

  // Level 4: Impulse - Area under Force vs Time graph
  {
    topicId: 'impulse',
    difficulty: 4,
    generator: () => {
      const correct = 'The area under the Force vs. Time ($F\\text{ vs }t$) graph represents impulse.';
      const { options, correctAnswerId } = makeOptions(correct, [
        'The slope of the Force vs. Time graph represents impulse.',
        'The maximum peak height of the Force curve represents impulse.',
        'The y-intercept represents the total impulse delivered.',
      ]);

      return {
        id: `imp-l4-graph-${Date.now()}-${Math.random()}`,
        topicId: 'impulse',
        difficulty: 4,
        title: 'Force vs. Time Graphical Representation',
        problemStatement: 'In physics laboratory experiments, force sensors plot applied force against time. What geometric property of a Force vs. Time ($F\\text{-}t$) graph represents the total impulse delivered?',
        options,
        correctAnswerId,
        formulaUsed: 'J = \\text{Area under } F\\text{-}t \\text{ curve}',
        formulaReason: 'Since impulse is the product of force (y-axis) and time (x-axis), multiplying height $\\times$ width corresponds to graphical area.',
        givenValues: [],
        steps: [
          {
            label: 'Step 1: Examine Graph Dimensions',
            detail: 'Vertical axis = Force (N); Horizontal axis = Time (s).',
          },
          {
            label: 'Step 2: Dimensional Product',
            detail: 'Area of rectangle = $\\text{height} \\times \\text{width} = F \\times \\Delta t = J$. For varying forces, area beneath curve gives the total impulse.',
          },
        ],
        gufsa: {
          given: [
            'Vertical axis (y-axis) represents Force ($F$) in Newtons',
            'Horizontal axis (x-axis) represents Time ($t$) in seconds',
          ],
          unknown: 'Geometric property of the $F\\text{-}t$ graph equal to impulse ($J$)',
          formula: '$J = F\\Delta t$',
          solution: [
            'Multiplying height ($F$) by width ($\\Delta t$) gives the area under the graph.',
            'Therefore, the area beneath a Force vs. Time curve equals the total impulse.',
          ],
          answer: 'The area under the Force vs. Time ($F\\text{ vs }t$) graph represents impulse.',
        },
        takeaway: 'Area under an $F\\text{-}t$ curve gives impulse $J$. For a triangle-shaped pulse, $\\text{Area} = \\frac{1}{2} F_{\\text{peak}} \\Delta t$.',
        isConceptual: true,
      };
    },
  },
  // Level 4: Momentum - Opposite-direction velocity calculation (sign convention)
  {
    topicId: 'momentum',
    difficulty: 4,
    generator: () => {
      const m = randomChoice([4, 5, 8, 10]);
      const speed = randomChoice([3, 4, 6, 7]);
      const pMag = m * speed;
      const correct = `$-${speed}\\text{ m/s}$ (or $${speed}\\text{ m/s}$ west)`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$+${speed}\\text{ m/s}$ east`,
        `$-${pMag * m}\\text{ m/s}$`,
        `$-${roundDec(m / pMag, 2)}\\text{ m/s}$`,
      ]);

      return {
        id: `mom-l4-neg-vel-${Date.now()}-${Math.random()}`,
        topicId: 'momentum',
        difficulty: 4,
        title: 'Velocity & Sign Convention from Momentum',
        problemStatement: `Taking east as the positive direction, a $${m}\\text{ kg}$ cart has a momentum of $-${pMag}\\text{ kg}\\cdot\\text{m/s}$. What is the velocity of the cart?`,
        options,
        correctAnswerId,
        formulaUsed: 'v = \\frac{p}{m}',
        formulaReason: 'Momentum is a vector ($p = mv$). Rearrange to $v = \\frac{p}{m}$ and keep the negative sign to indicate westward motion.',
        givenValues: [
          { symbol: 'm', value: `${m}`, unit: 'kg' },
          { symbol: 'p', value: `-${pMag}`, unit: 'kg·m/s' },
        ],
        steps: [
          {
            label: 'Step 1: Rearrange $p = mv$',
            detail: '$v = \\frac{p}{m}$',
          },
          {
            label: 'Step 2: Substitute Given Values with Sign',
            detail: `$v = \\frac{-${pMag}\\text{ kg}\\cdot\\text{m/s}}{${m}\\text{ kg}} = -${speed}\\text{ m/s}$`,
          },
          {
            label: 'Step 3: Interpret Direction',
            detail: `Since east is positive, $-${speed}\\text{ m/s}$ means $${speed}\\text{ m/s}$ west.`,
          },
        ],
        gufsa: {
          given: [
            `$m = ${m}\\text{ kg}$`,
            `$p = -${pMag}\\text{ kg}\\cdot\\text{m/s}$ (east is positive)`,
          ],
          unknown: '$v = ?\\text{ (m/s and direction)}$',
          formula: '$p = mv \\implies v = \\frac{p}{m}$',
          solution: [
            `$v = \\frac{-${pMag}\\text{ kg}\\cdot\\text{m/s}}{${m}\\text{ kg}}$`,
            `$v = -${speed}\\text{ m/s}$ (west)`,
          ],
          answer: `$-${speed}\\text{ m/s}$ (or $${speed}\\text{ m/s}$ west)`,
        },
        takeaway: 'A negative momentum simply indicates motion in the opposite (westward/backward) direction.',
        isConceptual: false,
      };
    },
  },

  // Level 5: Momentum - Total momentum of a two-object system moving in opposite directions
  {
    topicId: 'momentum',
    difficulty: 5,
    generator: () => {
      const m1 = randomChoice([4, 6]);
      const v1 = randomChoice([5, 6]);
      const m2 = randomChoice([3, 5]);
      const v2Mag = randomChoice([2, 4]);
      const p1 = m1 * v1;
      const p2 = -m2 * v2Mag;
      const pTotal = p1 + p2;
      const dir = pTotal >= 0 ? 'east' : 'west';
      const correct = `$${Math.abs(pTotal)}\\text{ kg}\\cdot\\text{m/s}$ ${dir}`;
      const wrongSum = p1 + m2 * v2Mag;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${wrongSum}\\text{ kg}\\cdot\\text{m/s}$ east`,
        `$${Math.abs(v1 - v2Mag) * (m1 + m2)}\\text{ kg}\\cdot\\text{m/s}$ east`,
        `$${Math.abs(p1)}\\text{ kg}\\cdot\\text{m/s}$ west`,
      ]);

      return {
        id: `mom-l5-system-${Date.now()}-${Math.random()}`,
        topicId: 'momentum',
        difficulty: 5,
        title: 'Total Momentum of Opposing Objects',
        problemStatement: `Object A ($${m1}\\text{ kg}$) moves east at $+${v1}\\text{ m/s}$, while Object B ($${m2}\\text{ kg}$) moves west at $-${v2Mag}\\text{ m/s}$. What is the total momentum of the two-object system?`,
        options,
        correctAnswerId,
        formulaUsed: 'p_{\\text{total}} = m_1 v_1 + m_2 v_2',
        formulaReason: 'Momentum is a vector quantity, so calculate each object\'s momentum with its proper direction sign (+ east, - west) before adding.',
        givenValues: [
          { symbol: 'm_1', value: `${m1}`, unit: 'kg' },
          { symbol: 'v_1', value: `+${v1}`, unit: 'm/s' },
          { symbol: 'm_2', value: `${m2}`, unit: 'kg' },
          { symbol: 'v_2', value: `-${v2Mag}`, unit: 'm/s' },
        ],
        steps: [
          {
            label: 'Step 1: Momentum of Object A',
            detail: `$p_1 = (${m1}\\text{ kg})(+${v1}\\text{ m/s}) = +${p1}\\text{ kg}\\cdot\\text{m/s}$`,
          },
          {
            label: 'Step 2: Momentum of Object B',
            detail: `$p_2 = (${m2}\\text{ kg})(-${v2Mag}\\text{ m/s}) = ${p2}\\text{ kg}\\cdot\\text{m/s}$`,
          },
          {
            label: 'Step 3: Add Vector Momentums',
            detail: `$p_{\\text{total}} = ${p1} + (${p2}) = ${pTotal}\\text{ kg}\\cdot\\text{m/s}$ (${dir})`,
          },
        ],
        gufsa: {
          given: [
            `$m_1 = ${m1}\\text{ kg}$, $v_1 = +${v1}\\text{ m/s}$ (east)`,
            `$m_2 = ${m2}\\text{ kg}$, $v_2 = -${v2Mag}\\text{ m/s}$ (west)`,
          ],
          unknown: '$p_{\\text{total}} = ?\\text{ (kg}\\cdot\\text{m/s and direction)}$',
          formula: '$p_{\\text{total}} = m_1 v_1 + m_2 v_2$',
          solution: [
            `$p_1 = (${m1})(+${v1}) = +${p1}\\text{ kg}\\cdot\\text{m/s}$`,
            `$p_2 = (${m2})(-${v2Mag}) = ${p2}\\text{ kg}\\cdot\\text{m/s}$`,
            `$p_{\\text{total}} = ${p1} + (${p2}) = ${pTotal}\\text{ kg}\\cdot\\text{m/s}$`,
          ],
          answer: `$${Math.abs(pTotal)}\\text{ kg}\\cdot\\text{m/s}$ ${dir}`,
        },
        takeaway: 'Because momentum is a vector, opposing momentums partially cancel each other out when summed.',
        isConceptual: false,
      };
    },
  },

  // Level 5: Impulse - Rearranging J = FΔt to find contact duration
  {
    topicId: 'impulse',
    difficulty: 5,
    generator: () => {
      const impulse = randomChoice([18, 24, 36, 48]);
      const force = randomChoice([120, 160, 240]);
      const dt = roundDec(impulse / force, 3);
      const correct = `$${dt}\\text{ s}$`;
      const { options, correctAnswerId } = makeOptions(correct, [
        `$${roundDec(force / impulse, 2)}\\text{ s}$`,
        `$${roundDec(impulse * force, 1)}\\text{ s}$`,
        `$${roundDec(dt * 10, 2)}\\text{ s}$`,
      ]);

      return {
        id: `imp-l5-find-time-${Date.now()}-${Math.random()}`,
        topicId: 'impulse',
        difficulty: 5,
        title: 'Solving for Contact Duration from Impulse',
        problemStatement: `A golf club exerts an average force of $${force}\\text{ N}$ on a golf ball, delivering an impulse of $${impulse}\\text{ N}\\cdot\\text{s}$. How long were the club and ball in contact?`,
        options,
        correctAnswerId,
        formulaUsed: '\\Delta t = \\frac{J}{F}',
        formulaReason: 'Rearrange the impulse formula $J = F\\Delta t$ to solve for contact time $\\Delta t$.',
        givenValues: [
          { symbol: 'F', value: `${force}`, unit: 'N' },
          { symbol: 'J', value: `${impulse}`, unit: 'N·s' },
        ],
        steps: [
          {
            label: 'Step 1: Rearrange $J = F\\Delta t$',
            detail: '$\\Delta t = \\frac{J}{F}$',
          },
          {
            label: 'Step 2: Substitute Given Values',
            detail: `$\\Delta t = \\frac{${impulse}\\text{ N}\\cdot\\text{s}}{${force}\\text{ N}}$`,
          },
          {
            label: 'Step 3: Calculate Time Interval',
            detail: `$\\Delta t = ${dt}\\text{ s}$`,
          },
        ],
        gufsa: {
          given: [
            `$F = ${force}\\text{ N}$`,
            `$J = ${impulse}\\text{ N}\\cdot\\text{s}$`,
          ],
          unknown: '$\\Delta t = ?\\text{ (s)}$',
          formula: '$J = F\\Delta t \\implies \\Delta t = \\frac{J}{F}$',
          solution: [
            `$\\Delta t = \\frac{${impulse}\\text{ N}\\cdot\\text{s}}{${force}\\text{ N}}$`,
            `$\\Delta t = ${dt}\\text{ s}$`,
          ],
          answer: `$\\Delta t = ${dt}\\text{ s}$`,
        },
        takeaway: 'Dividing impulse ($\text{N}\\cdot\text{s}$) by force ($\text{N}$) cancels Newtons and leaves seconds ($\text{s}$).',
        isConceptual: false,
      };
    },
  },
];

/**
 * Generates a fresh question based on optional topic and difficulty filters.
 * Strictly honors topicFilter whenever provided.
 */
export function generateQuestion(
  topicFilter?: TopicId[],
  difficultyFilter?: DifficultyLevel[],
  preferredTopic?: TopicId,
  preferredDifficulty?: DifficultyLevel
): Question {
  let topicEligible = QUESTION_TEMPLATES;

  if (topicFilter && topicFilter.length > 0) {
    topicEligible = topicEligible.filter((t) => topicFilter.includes(t.topicId));
  }

  if (topicEligible.length === 0) {
    topicEligible = QUESTION_TEMPLATES;
  }

  let eligible = topicEligible;

  // Apply preferred topic when cycling sequentially
  if (preferredTopic) {
    const byPreferredTopic = eligible.filter((t) => t.topicId === preferredTopic);
    if (byPreferredTopic.length > 0) {
      eligible = byPreferredTopic;
    }
  }

  // Apply difficulty filter within topic-eligible templates
  if (difficultyFilter && difficultyFilter.length > 0) {
    const byDifficulty = eligible.filter((t) => difficultyFilter.includes(t.difficulty));
    if (byDifficulty.length > 0) {
      eligible = byDifficulty;
    } else {
      // If preferredTopic didn't have that difficulty, try any selected topic that does
      const anyTopicWithDifficulty = topicEligible.filter((t) =>
        difficultyFilter.includes(t.difficulty)
      );
      if (anyTopicWithDifficulty.length > 0) {
        eligible = anyTopicWithDifficulty;
      }
    }
  }

  // Apply preferred difficulty when cycling sequentially
  if (preferredDifficulty) {
    const byPreferredDiff = eligible.filter((t) => t.difficulty === preferredDifficulty);
    if (byPreferredDiff.length > 0) {
      eligible = byPreferredDiff;
    }
  }

  const chosenTemplate = randomChoice(eligible);
  return chosenTemplate.generator();
}

/**
 * Generates a set of unique questions for a Mock Test.
 * Shuffled order, independent randomized difficulty, no duplicates.
 */
export function generateMockTestQuestions(
  count: number,
  topicFilter?: TopicId[]
): Question[] {
  const selectedTopics = topicFilter && topicFilter.length > 0
    ? topicFilter
    : (['momentum', 'impulse', 'impulse_momentum', 'conservation', 'real_life'] as TopicId[]);

  const questions: Question[] = [];
  const usedTitles = new Set<string>();

  // To ensure diversity across difficulty levels and topics
  for (let i = 0; i < count; i++) {
    // Pick topic (cycle or random)
    const topic = selectedTopics[i % selectedTopics.length];
    
    // Pick random difficulty 1-5 independently
    const difficulty = (randomInt(1, 5)) as DifficultyLevel;

    // Filter templates
    let candidates = QUESTION_TEMPLATES.filter(
      (t) => t.topicId === topic && t.difficulty === difficulty
    );

    // Fallback if no exact template for this (topic, difficulty) pair
    if (candidates.length === 0) {
      candidates = QUESTION_TEMPLATES.filter((t) => t.topicId === topic);
    }
    if (candidates.length === 0) {
      candidates = QUESTION_TEMPLATES;
    }

    const template = randomChoice(candidates);
    const q = template.generator();
    
    // Check if title already used; if so, generate another if possible
    if (usedTitles.has(q.title) && questions.length < QUESTION_TEMPLATES.length) {
      const otherCandidates = candidates.filter((c) => {
        const testQ = c.generator();
        return !usedTitles.has(testQ.title);
      });
      if (otherCandidates.length > 0) {
        const altQ = randomChoice(otherCandidates).generator();
        usedTitles.add(altQ.title);
        questions.push(altQ);
        continue;
      }
    }

    usedTitles.add(q.title);
    questions.push(q);
  }

  return shuffle(questions);
}
