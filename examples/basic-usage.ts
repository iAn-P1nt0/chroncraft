/**
 * Basic usage examples for chroncraft
 */

import {
  createDate,
  now,
  format,
  parseISO,
  addDays,
  addDuration,
  isBefore,
  diff,
} from '../src/index';

// ===== Creating Dates =====
console.log('Creating Dates:');
console.log('---------------');

const date1 = createDate('2025-01-15T10:30:00Z');
console.log('From ISO string:', date1.toISOString());

const date2 = createDate(Date.now());
console.log('From timestamp:', date2.toISOString());

const date3 = now();
console.log('Current date:', date3.toISOString());

// ===== Formatting =====
console.log('\nFormatting:');
console.log('-----------');

const date = createDate('2025-01-15T10:30:45.123Z');

console.log('YYYY-MM-DD:', format(date, 'YYYY-MM-DD'));
console.log('Custom format:', format(date, 'MMM DD, YYYY at h:mm A'));
console.log('With literal:', format(date, '[Today is] MMMM D, YYYY'));
console.log('Preset ISO:', format(date, 'ISO'));
console.log('Preset LONG:', format(date, 'LONG'));

// ===== Parsing =====
console.log('\nParsing:');
console.log('--------');

const parsed1 = parseISO('2025-01-15');
console.log('Date only:', format(parsed1, 'YYYY-MM-DD'));

const parsed2 = parseISO('2025-01-15T10:30:00Z');
console.log('With time:', format(parsed2, 'YYYY-MM-DD HH:mm:ss'));

const parsed3 = parseISO('2025-01-15T10:30:00.123Z');
console.log('With ms:', format(parsed3, 'YYYY-MM-DD HH:mm:ss.SSS'));

// ===== Arithmetic =====
console.log('\nArithmetic:');
console.log('-----------');

const base = createDate('2025-01-15T10:00:00Z');

const future = addDays(base, 5);
console.log('Add 5 days:', format(future, 'YYYY-MM-DD'));

const complex = addDuration(base, {
  days: 5,
  hours: 3,
  minutes: 30,
});
console.log(
  'Complex duration:',
  format(complex, 'YYYY-MM-DD HH:mm')
);

// ===== Comparison =====
console.log('\nComparison:');
console.log('-----------');

const dateA = createDate('2025-01-15');
const dateB = createDate('2025-01-20');

console.log('A before B:', isBefore(dateA, dateB));
console.log('Difference in days:', diff(dateA, dateB, 'day'));
console.log('Difference in hours:', diff(dateA, dateB, 'hour'));

// ===== Immutability =====
console.log('\nImmutability:');
console.log('-------------');

const original = createDate('2025-01-15');
const modified = addDays(original, 5);

console.log('Original:', format(original, 'YYYY-MM-DD'));
console.log('Modified:', format(modified, 'YYYY-MM-DD'));
console.log('Original unchanged:', original.day === 15);
