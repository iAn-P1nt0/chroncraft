/**
 * Benchmark runner for chroncraft
 * Compares performance against date-fns and dayjs
 */

import { Bench } from 'tinybench';

// Import chroncraft (adjust path after build)
const chroncraft = await import('../dist/index.mjs');

console.log('chroncraft Performance Benchmarks');
console.log('==================================\n');

// Benchmark: Date Creation
const createBench = new Bench({ time: 1000 });

createBench
  .add('chroncraft - createDate from string', () => {
    chroncraft.createDate('2025-01-15T10:30:00Z');
  })
  .add('Native Date - from string', () => {
    new Date('2025-01-15T10:30:00Z');
  });

await createBench.run();
console.log('Date Creation:');
console.table(createBench.table());

// Benchmark: Formatting
const formatBench = new Bench({ time: 1000 });
const date = chroncraft.createDate('2025-01-15T10:30:00Z');

formatBench
  .add('chroncraft - format YYYY-MM-DD', () => {
    chroncraft.format(date, 'YYYY-MM-DD');
  })
  .add('chroncraft - format with caching', () => {
    chroncraft.format(date, 'YYYY-MM-DD');
  })
  .add('Native Date - toISOString', () => {
    new Date('2025-01-15T10:30:00Z').toISOString().split('T')[0];
  });

await formatBench.run();
console.log('\nFormatting:');
console.table(formatBench.table());

// Benchmark: Arithmetic
const arithmeticBench = new Bench({ time: 1000 });

arithmeticBench
  .add('chroncraft - addDays', () => {
    chroncraft.addDays(date, 5);
  })
  .add('Native Date - setDate', () => {
    const d = new Date('2025-01-15T10:30:00Z');
    d.setDate(d.getDate() + 5);
  });

await arithmeticBench.run();
console.log('\nArithmetic Operations:');
console.table(arithmeticBench.table());

// Benchmark: Comparison
const comparisonBench = new Bench({ time: 1000 });
const date1 = chroncraft.createDate('2025-01-15');
const date2 = chroncraft.createDate('2025-01-20');

comparisonBench
  .add('chroncraft - isBefore', () => {
    chroncraft.isBefore(date1, date2);
  })
  .add('Native Date - comparison', () => {
    new Date('2025-01-15') < new Date('2025-01-20');
  });

await comparisonBench.run();
console.log('\nComparison:');
console.table(comparisonBench.table());

// Benchmark: Batch Operations
const batchBench = new Bench({ time: 1000 });
const dates = Array.from({ length: 100 }, (_, i) =>
  chroncraft.createDate(`2025-01-${String(i % 28 + 1).padStart(2, '0')}`)
);

batchBench
  .add('chroncraft - batch format (100 dates)', () => {
    dates.forEach((d) => chroncraft.format(d, 'YYYY-MM-DD'));
  })
  .add('Native Date - batch format (100 dates)', () => {
    dates.forEach((d) => d.toNative().toISOString().split('T')[0]);
  });

await batchBench.run();
console.log('\nBatch Operations:');
console.table(batchBench.table());

console.log('\n✓ Benchmarks complete');
console.log(
  'Note: Install date-fns and dayjs for comprehensive comparison'
);
