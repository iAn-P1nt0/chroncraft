# AGENTS.md - AI Coding Agent Instructions for chroncraft

**Project**: chroncraft Date/Time Library  
**Type**: TypeScript npm package  
**NPM Package**: chroncraft (https://www.npmjs.com/package/chroncraft)  
**Agent Compatibility**: Claude Code, GitHub Copilot, Cursor, Zed, OpenCode  
**Last Updated**: November 2025

---

## 📌 Project Overview

chroncraft is a high-performance, TypeScript-first date/time library designed to replace Moment.js and improve upon date-fns. The library prioritizes bundle size (< 5KB), performance (2-3x faster), and developer experience.

**Primary Goals:**
1. Ultra-lightweight bundle with tree-shaking support
2. Native TypeScript with full type inference
3. SIMD-optimized batch operations
4. Comprehensive timezone handling
5. Temporal API compatibility layer

---

## 🎯 Agent Objectives

When working on chroncraft, AI agents must:

1. **Maintain bundle size budget**: Every change must keep total bundle < 5KB
2. **Write type-safe code**: TypeScript strict mode with no `any` types
3. **Optimize for performance**: Benchmark against date-fns for all operations
4. **Ensure immutability**: All date objects must be immutable
5. **Write comprehensive tests**: Minimum 95% code coverage
6. **Document public APIs**: JSDoc comments for all exported functions

---

## 🏗️ Project Structure

```
chroncraft/
├── src/
│   ├── core/              # Date primitives and factories
│   │   ├── create.ts      # createDate factory function
│   │   ├── constants.ts   # Shared constants and lookup tables
│   │   └── types.ts       # Core type definitions
│   ├── format/            # Formatting engine
│   │   ├── index.ts       # Main format function
│   │   ├── tokens.ts      # Token lookup table and compiler
│   │   └── presets.ts     # Common format presets
│   ├── parse/             # Parsing utilities
│   │   ├── index.ts       # Main parse function
│   │   ├── iso8601.ts     # ISO 8601 parser
│   │   └── validators.ts  # Date validation utilities
│   ├── timezone/          # Timezone handling
│   │   ├── index.ts       # Main timezone functions
│   │   ├── common.ts      # Common timezone offsets
│   │   └── iana.ts        # IANA database (lazy-loaded)
│   ├── temporal/          # Temporal API compatibility
│   │   ├── index.ts       # Temporal namespace
│   │   └── adapter.ts     # Compatibility layer
│   ├── simd/              # SIMD optimizations
│   │   ├── detect.ts      # Feature detection
│   │   └── batch.ts       # Batch operations
│   ├── utils/             # Shared utilities
│   └── index.ts           # Main entry point
├── tests/
│   ├── unit/              # Unit tests (*.test.ts)
│   ├── integration/       # Integration tests
│   └── benchmarks/        # Performance benchmarks
├── docs/                  # Documentation
├── examples/              # Usage examples
├── package.json           # Package metadata
├── tsconfig.json          # TypeScript configuration
├── tsup.config.ts         # Build configuration
├── vitest.config.ts       # Test configuration
└── .size-limit.json       # Bundle size limits
```

---

## 🛠️ Development Setup

### Initial Setup Commands
```bash
# Clone repository
git clone <repo-url>
cd chronox

# Install dependencies
pnpm install  # or npm install / yarn install

# Start development mode (watch builds)
pnpm dev

# Run tests in watch mode
pnpm test:watch
```

### Essential Commands
```bash
# Build the package
pnpm build

# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Check bundle size
pnpm size

# Run benchmarks
pnpm benchmark

# Lint code
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format
```

---

## 📝 Coding Standards & Conventions

### TypeScript Configuration
- **Target**: ES2020
- **Module**: ESNext
- **Strict mode**: Enabled
- **No implicit any**: Enforced
- **Strict null checks**: Enabled

### Code Style Rules

#### Naming Conventions
- **Functions**: camelCase (`createDate`, `formatDate`)
- **Types/Interfaces**: PascalCase (`ChronoDate`, `FormatOptions`)
- **Constants**: UPPER_SNAKE_CASE (`ISO_8601_FORMAT`, `COMMON_OFFSETS`)
- **Files**: kebab-case (`iso8601.ts`, `token-compiler.ts`)

#### Export Rules
```typescript
// ✅ CORRECT: Named exports for tree-shaking
export function createDate(input?: DateInput): ChronoDate { }
export const FORMAT_PRESETS = { };

// ❌ WRONG: Default exports break tree-shaking
export default function createDate() { }
```

#### Immutability Pattern
```typescript
// ✅ CORRECT: Return new object
export function addDays(date: ChronoDate, days: number): ChronoDate {
  return {
    ...date,
    day: date.day + days,
  };
}

// ❌ WRONG: Mutate input
export function addDays(date: ChronoDate, days: number): ChronoDate {
  date.day += days; // Error: readonly property
  return date;
}
```

#### Performance Patterns
```typescript
// ✅ CORRECT: Lookup table (O(1))
const TOKEN_FORMATTERS: Record<string, (d: ChronoDate) => string> = {
  YYYY: (d) => String(d.year).padStart(4, '0'),
  MM: (d) => String(d.month).padStart(2, '0'),
};

// ❌ WRONG: Switch statement or if-else chain
function formatToken(token: string, date: ChronoDate) {
  if (token === 'YYYY') return String(date.year).padStart(4, '0');
  if (token === 'MM') return String(date.month).padStart(2, '0');
  // ... slower for many tokens
}
```

---

## 🎨 Code Generation Guidelines

### When Creating New Functions

1. **Start with type signature**
```typescript
/**
 * Adds specified number of days to a date
 * @param date - The input date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 */
export function addDays(date: ChronoDate, days: number): ChronoDate {
  // Implementation here
}
```

2. **Write test first** (TDD approach)
```typescript
describe('addDays', () => {
  it('adds positive days', () => {
    const date = createDate('2025-01-15');
    const result = addDays(date, 5);
    expect(result.day).toBe(20);
  });
  
  it('handles month overflow', () => {
    const date = createDate('2025-01-30');
    const result = addDays(date, 5);
    expect(result.month).toBe(2);
    expect(result.day).toBe(4);
  });
  
  it('handles negative days', () => {
    const date = createDate('2025-01-15');
    const result = addDays(date, -10);
    expect(result.day).toBe(5);
  });
});
```

3. **Implement with performance in mind**
```typescript
export function addDays(date: ChronoDate, days: number): ChronoDate {
  // Convert to timestamp for accurate arithmetic
  const timestamp = dateToTimestamp(date);
  const adjusted = timestamp + (days * 24 * 60 * 60 * 1000);
  return timestampToDate(adjusted);
}
```

4. **Benchmark against alternatives**
```typescript
// benchmarks/add-days.bench.ts
import { bench } from 'vitest';
import { addDays as chronoAddDays } from '../src';
import { addDays as dateFnsAddDays } from 'date-fns';

bench('ChronoX addDays', () => {
  chronoAddDays(testDate, 5);
});

bench('date-fns addDays', () => {
  dateFnsAddDays(new Date('2025-01-15'), 5);
});
```

---

## 🧪 Testing Requirements

### Test Coverage Rules
- **Minimum coverage**: 95% for all modules
- **Required test types**: Unit, integration, performance
- **Edge cases**: Must test leap years, timezone boundaries, DST
- **Error handling**: Must test all error conditions

### Test File Naming
```
src/format/format.ts → tests/unit/format/format.test.ts
src/parse/iso8601.ts → tests/unit/parse/iso8601.test.ts
```

### Test Structure Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { functionName } from '../../src/module';

describe('functionName', () => {
  describe('happy path', () => {
    it('handles basic case', () => {
      // Arrange
      const input = /* ... */;
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
  
  describe('edge cases', () => {
    it('handles leap year', () => { /* ... */ });
    it('handles timezone boundary', () => { /* ... */ });
  });
  
  describe('error cases', () => {
    it('throws on invalid input', () => {
      expect(() => functionName(invalid)).toThrow('Expected error message');
    });
  });
});
```

### Performance Benchmark Template
```typescript
// benchmarks/feature.bench.ts
import { bench, describe } from 'vitest';
import { chronoFunction } from '../src';
import { dateFnsFunction } from 'date-fns';
import dayjs from 'dayjs';

describe('Feature Performance', () => {
  const testData = /* setup */;
  
  bench('ChronoX', () => {
    chronoFunction(testData);
  });
  
  bench('date-fns', () => {
    dateFnsFunction(testData);
  });
  
  bench('dayjs', () => {
    dayjs(testData).method();
  });
});
```

---

## 📦 Bundle Size Management

### Size Budgets (Enforced by size-limit)
```json
{
  "path": "dist/index.js",
  "limit": "5 KB"
}
```

### Tree-Shaking Checklist
- [ ] Use named exports only
- [ ] No side effects in module scope
- [ ] Mark package as `"sideEffects": false`
- [ ] Separate entry points for large features

### Module Import Strategy
```typescript
// ✅ CORRECT: Granular imports
import { format } from 'chronox/format';
import { toTimezone } from 'chronox/timezone';

// ⚠️ OK but larger bundle
import { format, toTimezone } from 'chronox';

// ❌ WRONG: Imports everything
import * as chronox from 'chronox';
```

---

## 🚀 Performance Optimization Rules

### Avoid These Patterns
```typescript
// ❌ WRONG: Regex is slow
function parseDate(str: string) {
  const match = /(\d{4})-(\d{2})-(\d{2})/.exec(str);
  // ...
}

// ✅ CORRECT: String operations are faster
function parseDate(str: string) {
  const year = parseInt(str.slice(0, 4), 10);
  const month = parseInt(str.slice(5, 7), 10);
  const day = parseInt(str.slice(8, 10), 10);
  // ...
}
```

### Use These Patterns
```typescript
// ✅ CORRECT: Cache compiled functions
const formatCache = new Map<string, (date: ChronoDate) => string>();

export function format(date: ChronoDate, formatStr: string): string {
  let formatter = formatCache.get(formatStr);
  if (!formatter) {
    formatter = compileFormat(formatStr);
    formatCache.set(formatStr, formatter);
  }
  return formatter(date);
}
```

### Minimize Allocations
```typescript
// ❌ WRONG: Creates array for no reason
function formatTokens(date: ChronoDate, tokens: string[]) {
  return tokens.map(t => formatToken(t, date)).join('');
}

// ✅ CORRECT: Direct string concatenation
function formatTokens(date: ChronoDate, tokens: string[]) {
  let result = '';
  for (const token of tokens) {
    result += formatToken(token, date);
  }
  return result;
}
```

---

## 🔧 Build & Release Process

### Pre-commit Checks
Before any commit, these must pass:
```bash
# Type check
pnpm type-check

# Run linter
pnpm lint

# Run tests
pnpm test

# Check bundle size
pnpm size
```

### Pre-release Checklist
- [ ] All tests passing (`pnpm test`)
- [ ] Bundle size within limit (`pnpm size`)
- [ ] Benchmarks show improvement (`pnpm benchmark`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json

### Commit Message Format
```
type(scope): description

Types: feat, fix, perf, docs, test, refactor, chore
Scopes: core, format, parse, timezone, temporal, simd

Examples:
feat(format): add token-based formatter with caching
fix(parse): handle leap year edge case
perf(simd): optimize batch operations with WASM
docs(readme): add migration guide from moment.js
test(timezone): add DST transition tests
```

---

## 🎯 Feature Implementation Workflow

### Step-by-Step Process

**1. Research & Design**
```bash
# Create subagent to research
"Research how date-fns implements this feature"
"Investigate performance characteristics of approach X vs Y"
"Check Temporal API spec for compatibility requirements"
```

**2. Write Types First**
```typescript
// src/types.ts
export interface NewFeature {
  readonly prop1: string;
  readonly prop2: number;
}
```

**3. Write Tests (TDD)**
```typescript
// tests/unit/new-feature.test.ts
describe('newFeature', () => {
  it('handles basic case', () => {
    // Test before implementation exists
  });
});
```

**4. Implement**
```typescript
// src/new-feature/index.ts
export function newFeature(input: Input): Output {
  // Implementation
}
```

**5. Benchmark**
```typescript
// benchmarks/new-feature.bench.ts
bench('ChronoX newFeature', () => { /* ... */ });
bench('date-fns equivalent', () => { /* ... */ });
```

**6. Document**
```typescript
/**
 * Description of what this does
 * @param input - What this parameter is
 * @returns What this returns
 * @example
 * ```typescript
 * const result = newFeature(input);
 * ```
 */
export function newFeature(input: Input): Output {
  // ...
}
```

**7. Verify Bundle Size**
```bash
pnpm build
pnpm size
# Ensure new feature didn't blow budget
```

---

## 🐛 Debugging & Troubleshooting

### Common Issues

**Issue: Bundle size exceeded**
```bash
# Identify culprit
pnpm run analyze-bundle

# Solutions:
# - Split large feature into separate entry point
# - Lazy-load heavy dependencies
# - Use dynamic imports for optional features
```

**Issue: Tests failing**
```bash
# Run specific test file
pnpm test src/feature.test.ts

# Run with debugging
pnpm test --no-coverage --reporter=verbose

# Check type errors first
pnpm type-check
```

**Issue: Performance regression**
```bash
# Run benchmarks
pnpm benchmark

# Profile specific function
NODE_OPTIONS='--inspect-brk' pnpm benchmark:profile

# Compare with baseline
git checkout main
pnpm benchmark > baseline.txt
git checkout feature-branch
pnpm benchmark > feature.txt
diff baseline.txt feature.txt
```

---

## 🔍 Code Review Guidelines

### For AI Agents Reviewing Code

Check these points for every PR:

**1. Type Safety**
- [ ] No `any` types used
- [ ] All function parameters typed
- [ ] Return types explicit or correctly inferred
- [ ] No TypeScript errors (`pnpm type-check`)

**2. Performance**
- [ ] No unnecessary regex
- [ ] Minimal object allocations
- [ ] Lookup tables for O(1) access
- [ ] Format functions cached
- [ ] Benchmarks show no regression

**3. Bundle Size**
- [ ] Named exports only
- [ ] No default exports
- [ ] Side-effect free
- [ ] Size limit not exceeded

**4. Testing**
- [ ] Unit tests for all paths
- [ ] Edge cases covered (leap years, DST, boundaries)
- [ ] Error cases tested
- [ ] Coverage > 95%

**5. Documentation**
- [ ] JSDoc on public functions
- [ ] Examples in JSDoc
- [ ] README updated if API changed
- [ ] CHANGELOG.md entry added

---

## 🧰 Tool-Specific Instructions

### For File Operations

**Creating new module:**
```bash
# Structure
mkdir -p src/new-module
touch src/new-module/index.ts
touch src/new-module/types.ts
touch tests/unit/new-module/index.test.ts
```

**Updating exports:**
```typescript
// src/index.ts
export { newFunction } from './new-module';

// package.json
"exports": {
  "./new-module": {
    "import": "./dist/new-module/index.js",
    "types": "./dist/new-module/index.d.ts"
  }
}
```

### For Git Operations

**Branch naming:**
```bash
feat/add-duration-arithmetic
fix/timezone-dst-bug
perf/optimize-format-cache
docs/update-api-reference
test/add-leap-year-tests
```

**Commit flow:**
```bash
git add .
pnpm lint
pnpm test
git commit -m "feat(core): add duration arithmetic functions"
git push origin feat/add-duration-arithmetic
```

---

## 📊 Performance Targets

### Benchmark Goals (vs date-fns)

| Operation | Target Improvement |
|-----------|-------------------|
| Format    | 2-3x faster       |
| Parse     | 30-50% faster     |
| Arithmetic| 2x faster         |
| Batch ops | 4-8x faster (SIMD)|

### Bundle Size Targets

| Package Part | Size Limit |
|-------------|-----------|
| Core only   | < 3KB     |
| + Format    | < 5KB     |
| + Parse     | < 5KB     |
| + Timezone  | < 8KB     |
| Full lib    | < 10KB    |

---

## 🎓 Domain Knowledge

### Date/Time Concepts to Understand

**ISO 8601 Format:**
- `YYYY-MM-DD` (date only)
- `YYYY-MM-DDTHH:mm:ss.sssZ` (full datetime with UTC)
- `YYYY-MM-DDTHH:mm:ss+05:30` (with timezone offset)

**Leap Year Rules:**
```typescript
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
```

**Timezone Offset:**
- Stored in minutes from UTC
- IST = UTC+5:30 = 330 minutes
- PST = UTC-8:00 = -480 minutes

**DST (Daylight Saving Time):**
- Spring forward: 2:00 AM → 3:00 AM (skip hour)
- Fall back: 2:00 AM → 1:00 AM (repeat hour)
- Must test transitions

---

## 🚨 Critical Rules (Never Break These)

### Immutability
```typescript
// ❌ NEVER mutate input parameters
function addDays(date: ChronoDate, days: number) {
  date.day += days; // FORBIDDEN
  return date;
}

// ✅ ALWAYS return new objects
function addDays(date: ChronoDate, days: number) {
  return { ...date, day: date.day + days };
}
```

### No Runtime Dependencies
```typescript
// ❌ NEVER add runtime dependencies
import dayjs from 'dayjs'; // FORBIDDEN

// ✅ Use only dev dependencies
import { describe, it } from 'vitest'; // OK (dev only)
```

### Type Safety
```typescript
// ❌ NEVER use 'any'
function format(date: any, format: any): any { } // FORBIDDEN

// ✅ ALWAYS use explicit types
function format(date: ChronoDate, format: string): string { }
```

### Bundle Size
```typescript
// ❌ NEVER exceed 5KB main bundle
// Run 'pnpm size' after every change

// ✅ Split large features into separate entries
// chronox/timezone, chronox/format, etc.
```

---

## 🤝 Collaboration Patterns

### Working with Multiple Agents

**Task Division:**
- Agent 1: Implement core feature
- Agent 2: Write comprehensive tests
- Agent 3: Write benchmarks and optimize
- Agent 4: Update documentation

**Handoff Protocol:**
```
Agent 1 → Commits implementation with TODO: tests needed
Agent 2 → Reads implementation, writes tests, removes TODO
Agent 3 → Runs benchmarks, optimizes if needed
Agent 4 → Documents API, updates README
```

### Using Subagents

**When to create subagent:**
1. Need to research Temporal API spec
2. Need to investigate performance issue
3. Need to analyze bundle size impact
4. Need to compare implementation approaches

**Subagent prompt template:**
```
"Create subagent to investigate:
- What is the current Temporal API spec for PlainDate?
- How does it handle timezone conversions?
- What are the performance implications?
Return summary with key findings and recommendations."
```

---

## 📖 Reference Materials

### TypeScript
- Strict mode enabled
- Target ES2020
- Module resolution: bundler
- No implicit any

### Testing (Vitest)
- Test files: `*.test.ts`
- Run: `pnpm test`
- Coverage: `pnpm test:coverage`
- UI: `pnpm test:ui`

### Bundling (tsup)
- Config: `tsup.config.ts`
- Dual output: ESM + CJS
- Declaration files: Auto-generated
- Tree-shaking: Enabled

### Size Checking (size-limit)
- Config: `.size-limit.json`
- Run: `pnpm size`
- CI: Auto-fails if exceeded

---

## 🎯 Agent Success Criteria

An AI agent is successful on ChronoX when:

1. ✅ All generated code passes TypeScript strict checks
2. ✅ Bundle size remains under budget
3. ✅ All tests pass with > 95% coverage
4. ✅ Benchmarks show performance improvements
5. ✅ Code is documented with JSDoc
6. ✅ No runtime dependencies added
7. ✅ Immutability maintained throughout
8. ✅ Tree-shaking preserved

---

## 📝 Quick Command Reference

```bash
# Development
pnpm dev              # Watch mode build
pnpm test:watch       # Watch mode tests

# Quality Checks
pnpm lint             # ESLint
pnpm type-check       # TypeScript
pnpm test             # Run tests
pnpm test:coverage    # With coverage
pnpm size             # Check bundle size

# Build & Release
pnpm build            # Production build
pnpm benchmark        # Performance tests
pnpm prepublishOnly   # Pre-release checks
```

---

*This file is read automatically by Claude Code and compatible AI coding agents. Keep it updated as the project evolves.*