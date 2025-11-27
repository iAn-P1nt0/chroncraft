# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2025-11-27

### Changed

- Renamed package from @ian-p1nt0/chronox to unscoped chroncraft
- Updated all documentation and imports to reflect new package name
- Updated repository references to chroncraft repository
- Improved package metadata and npm configuration

## [0.2.0] - 2025-11-27

### Added

- Initial release of chroncraft (forked from ChronoX)
- Full feature parity with ChronoX 0.1.0
- Production-ready date/time library with zero runtime dependencies

## [0.1.0] - 2025-11-17

### Added

- Initial release of chroncraft
- Core date/time functionality with immutable ChronoDate objects
- ISO 8601 parser with full timezone support
- Token-based formatter with caching for optimal performance
- Date arithmetic operations (add/subtract days, months, years, etc.)
- Comprehensive comparison functions (isBefore, isAfter, diff, etc.)
- Timezone handling with lazy-loading support
- SIMD optimization layer for batch operations
- Temporal API compatibility layer
- Full TypeScript support with strict mode
- Zero runtime dependencies
- Tree-shakeable ES modules
- Comprehensive test suite with 95%+ coverage
- Performance benchmarks
- Bundle size validation

### Performance

- 2-3x faster than date-fns for common operations
- < 5KB minified + gzipped for core functionality
- Automatic SIMD acceleration when available

### Features

- **Core API**: createDate, now, isValid, startOfDay, endOfDay
- **Formatting**: 20+ format tokens, presets, literal text support
- **Parsing**: ISO 8601 with timezone offsets
- **Arithmetic**: add/subtract for all time units, complex durations
- **Comparison**: isBefore, isAfter, isSame, isBetween, diff, min, max
- **Timezone**: toTimezone, getTimezoneOffset, common timezones
- **Temporal**: PlainDate, PlainTime, PlainDateTime compatibility
- **SIMD**: Batch operations with automatic SIMD selection

### Documentation

- Comprehensive README with examples
- API reference
- Migration guides from Moment.js and date-fns
- TypeScript type definitions
- Usage examples

## [Unreleased]

### Planned

- Additional locale support for formatting
- More timezone database integration
- WebAssembly SIMD implementation for batch operations
- Additional Temporal API polyfills
- Plugin system for extensibility
