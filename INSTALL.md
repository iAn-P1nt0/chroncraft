# chroncraft Installation Guide

## Quick Install

### npm

```bash
npm install chroncraft
```

### yarn

```bash
yarn add chroncraft
```

### pnpm

```bash
pnpm add chroncraft
```

## Development Setup

If you're contributing to chroncraft or want to build from source:

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Clone and Install

```bash
git clone https://github.com/ian-p1nt0/chroncraft.git
cd chroncraft
npm install
```

### Build

```bash
npm run build
```

This will generate the distribution files in the `dist/` directory.

### Run Tests

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

For coverage report:

```bash
npm run test:coverage
```

### Run Benchmarks

```bash
npm run benchmark
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Check Bundle Size

```bash
npm run size
```

## Project Structure

```
chroncraft/
├── src/                  # Source code
│   ├── core/            # Core date primitives
│   ├── format/          # Formatting engine
│   ├── parse/           # ISO 8601 parser
│   ├── timezone/        # Timezone handling
│   ├── temporal/        # Temporal API compatibility
│   ├── simd/            # SIMD optimizations
│   ├── utils/           # Shared utilities
│   └── index.ts         # Main entry point
├── tests/               # Test suite
├── benchmarks/          # Performance benchmarks
├── examples/            # Usage examples
├── dist/                # Build output (generated)
└── docs/                # Documentation
```

## Usage in Different Environments

### ES Modules (Recommended)

```typescript
import { createDate, format } from 'chroncraft';

const date = createDate('2025-01-15');
console.log(format(date, 'YYYY-MM-DD'));
```

### CommonJS

```javascript
const { createDate, format } = require('chroncraft');

const date = createDate('2025-01-15');
console.log(format(date, 'YYYY-MM-DD'));
```

### Browser (via CDN)

```html
<script type="module">
  import { createDate, format } from 'https://cdn.jsdelivr.net/npm/chroncraft/+esm';

  const date = createDate('2025-01-15');
  console.log(format(date, 'YYYY-MM-DD'));
</script>
```

### TypeScript

ChronoX includes TypeScript definitions. No additional setup required:

```typescript
import { createDate, format, ChronoDate } from 'chroncraft';

const date: ChronoDate = createDate('2025-01-15');
```

## Tree-Shaking Setup

To maximize tree-shaking benefits:

### Webpack

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
};
```

### Rollup

```javascript
// rollup.config.js
export default {
  treeshake: {
    moduleSideEffects: false,
  },
};
```

### Vite

Vite has tree-shaking enabled by default. No additional configuration needed.

## Troubleshooting

### Module Not Found

If you see "Cannot find module 'chroncraft'":

1. Ensure chroncraft is installed: `npm list chroncraft`
2. Clear your package manager cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### TypeScript Errors

If you see TypeScript errors:

1. Ensure TypeScript 5.3+ is installed
2. Check your `tsconfig.json` has `"moduleResolution": "bundler"` or `"node"`
3. Try deleting `node_modules/@types` and reinstalling

### Build Errors

If the build fails:

1. Ensure Node.js 18+ is installed
2. Clear build cache: `rm -rf dist .tsbuildinfo`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

- Read the [README](README.md) for API documentation
- Check out [examples](examples/) for usage patterns
- See [CLAUDE.md](CLAUDE.md) for development guidelines
- Run benchmarks to see performance comparisons

## Support

- Issues: https://github.com/ian-p1nt0/chroncraft/issues
- Discussions: https://github.com/ian-p1nt0/chroncraft/discussions
