# Getting Started with chroncraft

## Installation

```bash
npm install chroncraft
```

## Your First chroncraft Program

Create a file `example.js`:

```javascript
import { createDate, format, addDays } from 'chroncraft';

// Create a date
const today = createDate('2025-01-15');

// Format it
console.log('Today:', format(today, 'MMMM D, YYYY'));
// Output: Today: January 15, 2025

// Add 5 days
const future = addDays(today, 5);
console.log('In 5 days:', format(future, 'MMMM D, YYYY'));
// Output: In 5 days: January 20, 2025
```

Run it:

```bash
node example.js
```

## Common Use Cases

### 1. Display Dates in Different Formats

```javascript
import { createDate, format } from 'chroncraft';

const date = createDate('2025-01-15T10:30:00Z');

console.log(format(date, 'YYYY-MM-DD')); // 2025-01-15
console.log(format(date, 'MMM DD, YYYY')); // Jan 15, 2025
console.log(format(date, 'MMMM D, YYYY [at] h:mm A')); // January 15, 2025 at 10:30 AM
```

### 2. Calculate Date Differences

```javascript
import { createDate, diff } from 'chroncraft';

const start = createDate('2025-01-15');
const end = createDate('2025-02-15');

console.log('Days:', diff(start, end, 'day')); // 31
console.log('Weeks:', diff(start, end, 'week')); // 4
console.log('Months:', diff(start, end, 'month')); // 1
```

### 3. Add/Subtract Time

```javascript
import { createDate, addDays, addMonths, format } from 'chroncraft';

const date = createDate('2025-01-15');

const nextWeek = addDays(date, 7);
console.log(format(nextWeek, 'YYYY-MM-DD')); // 2025-01-22

const nextMonth = addMonths(date, 1);
console.log(format(nextMonth, 'YYYY-MM-DD')); // 2025-02-15
```

### 4. Compare Dates

```javascript
import { createDate, isBefore, isAfter, isSame } from 'chroncraft';

const date1 = createDate('2025-01-15');
const date2 = createDate('2025-01-20');

console.log(isBefore(date1, date2)); // true
console.log(isAfter(date1, date2)); // false
console.log(isSame(date1, date2, 'month')); // true
```

### 5. Work with Timezones

```javascript
import { createDate, toTimezone, format } from 'chroncraft/timezone';

const utcDate = createDate('2025-01-15T10:00:00Z');

const istDate = await toTimezone(utcDate, 'Asia/Kolkata');
console.log(format(istDate, 'YYYY-MM-DD HH:mm')); // 2025-01-15 15:30

const pstDate = await toTimezone(utcDate, 'PST');
console.log(format(pstDate, 'YYYY-MM-DD HH:mm')); // 2025-01-15 02:00
```

## Next Steps

### Learn More

- Read the full [API Documentation](README.md)
- Explore [Examples](examples/)
- Check [Performance Benchmarks](benchmarks/)

### Key Concepts

1. **Immutability**: All operations return new date objects
   ```javascript
   const date = createDate('2025-01-15');
   addDays(date, 5); // Returns new date
   console.log(date.day); // Still 15
   ```

2. **Tree-Shaking**: Import only what you need
   ```javascript
   // Minimal bundle
   import { createDate, format } from 'chroncraft';

   // With timezone support
   import { toTimezone } from 'chroncraft/timezone';
   ```

3. **Type Safety**: Full TypeScript support
   ```typescript
   import { ChronoDate } from 'chroncraft';
   const date: ChronoDate = createDate('2025-01-15');
   ```

### Common Patterns

#### Formatting Today's Date

```javascript
import { now, format } from 'chroncraft';

console.log('Today is', format(now(), 'MMMM D, YYYY'));
```

#### Checking if a Date is in the Past

```javascript
import { createDate, isBefore, now } from 'chroncraft';

const eventDate = createDate('2024-12-25');
const isPast = isBefore(eventDate, now());
```

#### Creating a Date Range

```javascript
import { createDate, addDays, isSameOrBefore } from 'chroncraft';

const start = createDate('2025-01-01');
const end = createDate('2025-01-31');

let current = start;
const dates = [];

while (isSameOrBefore(current, end)) {
  dates.push(current);
  current = addDays(current, 1);
}

console.log(`Generated ${dates.length} dates`);
```

## Tips

1. **Format Caching**: Reuse format strings for better performance
   ```javascript
   const format = 'YYYY-MM-DD';
   dates.forEach(d => format(d, format)); // Cached!
   ```

2. **Presets**: Use built-in format presets
   ```javascript
   import { FORMAT_PRESETS } from 'chroncraft';
   format(date, 'ISO'); // Uses preset
   ```

3. **Validation**: Check date validity before operations
   ```javascript
   import { isValid } from 'chroncraft';
   if (isValid(userInput)) {
     const date = createDate(userInput);
   }
   ```

## Need Help?

- Check the [README](README.md) for full API reference
- Look at [examples](examples/) for code samples
- Open an issue on [GitHub](https://github.com/ian-p1nt0/chroncraft/issues)

Happy coding with chroncraft!
