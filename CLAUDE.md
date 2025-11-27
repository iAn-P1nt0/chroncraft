# CLAUDE.md - chroncraft Development Guide

**Project**: chroncraft - Next-Generation JavaScript Date/Time Library  
**Purpose**: TypeScript npm package replacing Moment.js with performance focus  
**Target Bundle Size**: < 5KB minified + gzipped  
**Repository**: chroncraft
**Package Name**: chroncraft (https://www.npmjs.com/package/chroncraft)

---

## 🎯 Project Mission

chroncraft is a modern date/time library designed to replace legacy solutions like Moment.js and overcome performance limitations in date-fns. It combines ultra-lightweight bundle size with cutting-edge optimizations including SIMD operations, comprehensive timezone handling, and Temporal API compatibility.

---

## 📋 Core Requirements

### Bundle & Performance
- **Bundle size**: Maximum 5KB minified + gzipped
- **Tree-shakeable**: 100% ES module support with granular imports
- **Performance**: 2-3x faster than date-fns for common operations
- **Zero dependencies**: No external runtime dependencies

### Type Safety
- **TypeScript first**: Native TypeScript with strict mode enabled
- **Full type inference**: No manual type definitions required
- **Immutable by default**: All date objects are immutable
- **Type-safe APIs**: Complete IntelliSense support

### Features
- ISO 8601 parsing and formatting
- Timezone handling with lazy-loading
- Date arithmetic (add, subtract, diff)
- SIMD optimizations for batch operations
- Temporal API compatibility layer
- Common format presets
- Validation and error handling

---

## 🏗️ Project Architecture

```
chroncraft/
├── src/
│   ├── core/           # Core date primitives and factories
│   ├── format/         # Formatting engine (token-based)
│   ├── parse/          # ISO 8601 parser
│   ├── timezone/       # Timezone handling (lazy-loaded)
│   ├── temporal/       # Temporal API compatibility
│   ├── simd/           # SIMD optimizations
│   ├── utils/          # Shared utilities
│   └── index.ts        # Main entry (< 3KB when tree-shaken)
├── tests/
│   ├── unit/           # Unit tests (Vitest)
│   ├── integration/    # Integration tests
│   └── benchmarks/     # Performance benchmarks
├── docs/               # Documentation
├── examples/           # Usage examples
└── dist/               # Build output (ESM + CJS)
```

---

## 🛠️ Development Environment

### Required Tools
- **Node.js**: 18+ (for native Temporal API testing)
- **Package Manager**: npm/yarn/pnpm (pnpm recommended)
- **TypeScript**: 5.3+
- **Build Tool**: tsup (fast esbuild-based bundler)
- **Test Runner**: Vitest (fast, native ESM support)
- **Linter**: ESLint with TypeScript plugin

### Essential npm Scripts
```json
{
  "build": "tsup",
  "dev": "tsup --watch",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "benchmark": "node benchmarks/run.js",
  "lint": "eslint src --ext .ts",
  "type-check": "tsc --noEmit",
  "size": "size-limit",
  "prepublishOnly": "npm run build && npm test && npm run size"
}
```

### Build Configuration (tsup.config.ts)
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    format: 'src/format/index.ts',
    parse: 'src/parse/index.ts',
    timezone: 'src/timezone/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  target: 'es2020',
});
```

---

## 💻 Coding Standards

### TypeScript Configuration
- **Strict mode**: Enabled (`strict: true`)
- **Target**: ES2020 (native optional chaining, nullish coalescing)
- **Module**: ESNext with `moduleResolution: "bundler"`
- **No implicit any**: All types must be explicit or inferred
- **Strict null checks**: Enabled

### Code Style
- **Formatting**: Prettier with 2-space indentation
- **Naming**: camelCase for functions, PascalCase for types/interfaces
- **Exports**: Named exports only (no default exports for tree-shaking)
- **Comments**: JSDoc for public APIs, inline comments for complex logic
- **File organization**: One concept per file, max 200 lines per file

### Performance Guidelines
- **Avoid regex**: Use string manipulation where possible (faster)
- **Minimize allocations**: Reuse objects, avoid unnecessary array copies
- **Use lookup tables**: O(1) access for format tokens and constants
- **Cache compiled functions**: Format strings should compile once
- **Benchmark everything**: Compare against date-fns for validation

### Example Code Style
```typescript
/**
 * Creates an immutable ChronoDate from various inputs
 * @param input - Date, string, number, or existing ChronoDate
 * @returns Immutable date object
 * @throws Error if input is invalid
 */
export function createDate(
  input?: Date | string | number | ChronoDate
): ChronoDate {
  if (!input) {
    return dateFromNative(new Date());
  }
  
  if (typeof input === 'string') {
    return parseISO(input);
  }
  
  if (typeof input === 'number') {
    return dateFromNative(new Date(input));
  }
  
  if (input instanceof Date) {
    return dateFromNative(input);
  }
  
  return input; // Already ChronoDate
}
```

---

## 🧪 Testing Standards

### Test Coverage Requirements
- **Minimum coverage**: 95% for core modules
- **Test types**: Unit, integration, and performance benchmarks
- **Edge cases**: Leap years, timezone boundaries, DST transitions
- **Error cases**: Invalid inputs, out-of-range dates

### Test Structure (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { createDate, format } from '../src';

describe('format', () => {
  it('formats basic ISO date', () => {
    const date = createDate('2025-01-15');
    expect(format(date, 'YYYY-MM-DD')).toBe('2025-01-15');
  });
  
  it('handles leap year dates', () => {
    const date = createDate('2024-02-29');
    expect(date.day).toBe(29);
  });
  
  it('throws on invalid date', () => {
    expect(() => createDate('2023-02-29')).toThrow();
  });
});
```

### Benchmark Standards
- **Tools**: tinybench for microbenchmarks
- **Comparison**: Always benchmark against date-fns and dayjs
- **Operations**: Format, parse, arithmetic, batch operations
- **Metrics**: ops/sec, execution time, bundle size impact

---

## 🚀 Performance Optimization Techniques

### Format Engine Optimization
1. **Token compilation**: Compile format strings into functions once
2. **Lookup table**: Use object lookup for O(1) token access
3. **Cache results**: Cache compiled formatters in WeakMap
4. **Minimize string operations**: Concatenate in single pass

### SIMD Optimization Strategy
```typescript
// Feature detection
export const SIMD_SUPPORTED = (() => {
  try {
    return typeof WebAssembly !== 'undefined' && 
           WebAssembly.validate(new Uint8Array([/* SIMD check */]));
  } catch {
    return false;
  }
})();

// Automatic selection
export function addDurationBatch(dates: ChronoDate[], duration: Duration) {
  return SIMD_SUPPORTED && dates.length >= 4
    ? addDurationSIMD(dates, duration)
    : dates.map(d => addDuration(d, duration));
}
```

### Timezone Optimization
- **Built-in common zones**: UTC, GMT, EST, PST, IST (no network)
- **Lazy-load IANA database**: Dynamic import for other timezones
- **Tree-shakeable**: Timezone code only included if imported

---

## 📦 Bundle Size Management

### size-limit Configuration
```json
{
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "5 KB"
    },
    {
      "path": "dist/format.js",
      "limit": "2 KB"
    },
    {
      "path": "dist/parse.js",
      "limit": "1.5 KB"
    },
    {
      "path": "dist/timezone.js",
      "limit": "3 KB",
      "ignore": ["iana-database"]
    }
  ]
}
```

### Tree-Shaking Strategy
- **Named exports only**: No default exports
- **Modular entry points**: Separate submodules (format, parse, timezone)
- **Side-effect free**: Mark as `"sideEffects": false` in package.json
- **Granular imports**: Allow users to import specific functions

```typescript
// Good: Tree-shakeable
import { format } from 'chronox/format';

// Avoid: Imports entire library
import { format } from 'chronox';
```

---

## 🔄 Development Workflow

### Branch Strategy
- **main**: Stable releases only
- **develop**: Active development
- **feature/***: New features
- **fix/***: Bug fixes
- **perf/***: Performance improvements

### Commit Convention
```
type(scope): description

feat(format): add token-based formatter with caching
fix(parse): handle edge case for leap year validation
perf(simd): optimize batch operations with WASM
docs(readme): update installation instructions
test(timezone): add DST transition tests
```

### Pull Request Process
1. Create feature branch from `develop`
2. Implement feature with tests
3. Ensure all tests pass: `npm test`
4. Check bundle size: `npm run size`
5. Run benchmarks: `npm run benchmark`
6. Create PR with detailed description
7. Address review feedback
8. Merge when approved and CI passes

---

## 🎨 API Design Principles

### Consistency
- All functions return immutable objects
- All functions throw on invalid input
- All functions accept multiple input types where logical

### Discoverability
- Clear function names (`createDate`, not `date`)
- Predictable return types
- Common presets for frequent use cases

### Example API Surface
```typescript
// Core
export function createDate(input?: DateInput): ChronoDate;
export function now(): ChronoDate;
export function isValid(input: any): boolean;

// Formatting
export function format(date: ChronoDate, formatStr: string): string;
export const FORMAT_PRESETS: Record<string, string>;

// Parsing
export function parseISO(isoString: string): ChronoDate;
export function parse(dateString: string, formatStr: string): ChronoDate;

// Arithmetic
export function addDays(date: ChronoDate, days: number): ChronoDate;
export function addMonths(date: ChronoDate, months: number): ChronoDate;
export function addYears(date: ChronoDate, years: number): ChronoDate;
export function addDuration(date: ChronoDate, duration: Duration): ChronoDate;

// Comparison
export function isBefore(date1: ChronoDate, date2: ChronoDate): boolean;
export function isAfter(date1: ChronoDate, date2: ChronoDate): boolean;
export function isSame(date1: ChronoDate, date2: ChronoDate): boolean;
export function diff(date1: ChronoDate, date2: ChronoDate, unit: Unit): number;

// Timezone
export async function toTimezone(date: ChronoDate, tz: string): Promise<ChronoDate>;
export function getTimezoneOffset(tz: string): number;

// Temporal Compatibility
export namespace TemporalCompat {
  export class PlainDate { /* ... */ }
  export class PlainTime { /* ... */ }
  export function isNativeTemporalAvailable(): boolean;
}
```

---

## 🐛 Common Gotchas & Warnings

### Date Mutation
❌ **BAD**: Mutating date objects
```typescript
const date = createDate('2025-01-15');
date.day = 20; // TypeError: Cannot assign to read-only property
```

✅ **GOOD**: Creating new dates
```typescript
const date = createDate('2025-01-15');
const updated = addDays(date, 5); // Returns new immutable object
```

### Timezone Handling
⚠️ **WARNING**: Async timezone operations
```typescript
// toTimezone is async for lazy-loading
const utcDate = createDate('2025-01-15T10:00:00Z');
const istDate = await toTimezone(utcDate, 'Asia/Kolkata');
```

### Format String Caching
💡 **TIP**: Reuse format strings for best performance
```typescript
// Compiled once, cached
const dates = [date1, date2, date3];
const formatted = dates.map(d => format(d, 'YYYY-MM-DD')); // Fast
```

### Bundle Size Impact
⚠️ **WATCH OUT**: Timezone imports increase bundle
```typescript
// Minimal bundle (< 3KB)
import { format, createDate } from 'chronox';

// Larger bundle (~6KB) - includes timezone data
import { toTimezone } from 'chronox/timezone';
```

---

## 📚 Key Files Reference

### Core Type Definitions
**File**: `src/types.ts`
- `ChronoDate`: Immutable date representation
- `Duration`: Time duration for arithmetic
- `FormatOptions`: Formatting configuration
- `Unit`: Time units (year, month, day, etc.)

### Entry Points
**File**: `src/index.ts` - Main entry (core + format + parse)
**File**: `src/format/index.ts` - Formatting only
**File**: `src/parse/index.ts` - Parsing only
**File**: `src/timezone/index.ts` - Timezone handling
**File**: `src/temporal/index.ts` - Temporal API compat

### Configuration Files
- `package.json`: Package metadata, scripts, exports
- `tsconfig.json`: TypeScript compiler options
- `tsup.config.ts`: Build configuration
- `vitest.config.ts`: Test configuration
- `.size-limit.json`: Bundle size limits

---

## 🎯 When to Use Subagents

For complex tasks, Claude should create subagents to handle specific investigations:

### Use Subagents For:
1. **Performance analysis**: "Investigate why format is slower than expected"
2. **Compatibility research**: "Check Temporal API proposal for latest changes"
3. **Bug investigation**: "Find why timezone conversion fails for DST dates"
4. **Dependency research**: "Research alternatives to current SIMD approach"

### Subagent Best Practices:
- Ask subagent to verify specific technical details
- Use subagents for reading large documentation
- Delegate performance profiling to subagents
- Have subagents compare implementation approaches

---

## 🔍 Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test src/format/format.test.ts

# Run benchmarks
npm run benchmark

# Check bundle size
npm run size

# Type check without building
npm run type-check
```

---

## 📝 Documentation Standards

### JSDoc Comments
All public APIs must have JSDoc comments:
```typescript
/**
 * Formats a date according to the specified format string
 * 
 * @param date - The date to format
 * @param formatStr - Format string (e.g., 'YYYY-MM-DD')
 * @returns Formatted date string
 * @throws {Error} If format string is invalid
 * 
 * @example
 * ```typescript
 * const date = createDate('2025-01-15');
 * format(date, 'YYYY-MM-DD'); // '2025-01-15'
 * format(date, 'MMM DD, YYYY'); // 'Jan 15, 2025'
 * ```
 */
export function format(date: ChronoDate, formatStr: string): string;
```

### README Requirements
- Installation instructions
- Quick start example
- Performance comparison table
- API reference link
- Migration guides from other libraries
- Browser/Node compatibility table

---

## 🚢 Release Process

### Pre-release Checklist
- [ ] All tests passing
- [ ] Bundle size within limits
- [ ] Benchmarks show performance improvements
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json

### Publishing
```bash
# Build and test
npm run build
npm test
npm run size

# Dry run
npm publish --dry-run

# Publish (requires npm 2FA)
npm publish --access public
```

### Versioning (SemVer)
- **Major**: Breaking API changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes only

---

## 🎓 Learning Resources

### Temporal API
- TC39 Proposal: https://tc39.es/proposal-temporal/
- MDN Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
- Polyfill: https://github.com/js-temporal/temporal-polyfill

### SIMD in JavaScript
- WebAssembly SIMD: https://github.com/WebAssembly/simd
- V8 SIMD blog posts
- Performance benchmarking guides

### TypeScript Best Practices
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/
- Effective TypeScript book
- TypeScript compiler options reference

---

## 💡 Tips for Working with Claude

### Effective Prompting
1. **Be specific**: "Implement token-based formatter with O(1) lookup"
2. **Include context**: "This should be faster than date-fns because..."
3. **Request tests**: "Include Vitest tests with edge cases"
4. **Ask for benchmarks**: "Show performance comparison with date-fns"

### Iterative Development
1. Start with types and interfaces
2. Implement core functionality
3. Add tests alongside implementation
4. Optimize based on benchmarks
5. Document as you build

### Code Review Focus
- Is it tree-shakeable?
- Does it maintain bundle size budget?
- Are there performance regressions?
- Is TypeScript strict mode satisfied?
- Are edge cases tested?

---

## 🔗 External Dependencies Policy

### Allowed (Dev Dependencies Only)
- TypeScript
- tsup (bundler)
- Vitest (testing)
- ESLint (linting)
- size-limit (bundle size checking)

### Not Allowed (Runtime)
- **NO runtime dependencies**
- All functionality must be self-contained
- Polyfills only for older environments (optional)

---

## 🎯 Success Metrics

Track these metrics for each release:

### Performance
- Format: ops/sec vs date-fns
- Parse: ops/sec vs date-fns
- Arithmetic: ops/sec vs date-fns

### Bundle Size
- Core: < 3KB
- With format: < 5KB
- With timezone: < 8KB
- Full library: < 10KB

### Quality
- Test coverage: > 95%
- Type coverage: 100%
- Zero runtime dependencies
- Zero open security issues

---

*Last Updated: November 2025*
*For questions or clarifications, consult the repository maintainer.*