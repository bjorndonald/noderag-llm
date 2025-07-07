# Tailwind CSS IntelliSense Setup

This project has been configured with enhanced Tailwind CSS IntelliSense support for better development experience.

## Features

- **Autocomplete**: Get suggestions for Tailwind classes as you type
- **Syntax highlighting**: Proper highlighting for Tailwind classes
- **Hover preview**: See the CSS output when hovering over Tailwind classes
- **Error detection**: Get warnings for invalid Tailwind classes
- **Custom class support**: IntelliSense for custom classes defined in `tailwind.config.ts`
- **Type safety**: TypeScript support for Tailwind utilities

## Setup

### VS Code Extensions

The following extensions are recommended (see `.vscode/extensions.json`):

1. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Provides autocomplete, syntax highlighting, and linting
   - Automatically installed when opening the project

2. **Prettier** (`esbenp.prettier-vscode`)
   - Formats code including Tailwind classes
   - Works with `prettier-plugin-tailwindcss` for class sorting

### Configuration Files

- `.vscode/settings.json` - VS Code settings for Tailwind IntelliSense
- `src/types/tailwind.d.ts` - TypeScript declarations for custom Tailwind types
- `src/utils/tailwind.ts` - Utility functions for class composition

## Usage

### Basic Class Usage

```tsx
// Standard Tailwind classes with full IntelliSense
<div className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
  Button
</div>
```

### Using Utility Functions

```tsx
import { cn, conditionalClass, responsive } from '@/utils/tailwind';

// Merge classes with conflict resolution
const className = cn(
  'text-red-500',
  isActive && 'bg-blue-500',
  'p-4',
  'text-blue-500' // This will override text-red-500
);

// Conditional classes
const buttonClass = conditionalClass(
  isPrimary,
  'bg-blue-500 hover:bg-blue-600',
  'bg-gray-300 hover:bg-gray-400'
);

// Responsive classes
const textClass = responsive('text-sm', {
  md: 'text-base',
  lg: 'text-lg'
});
```

### Custom Classes

Your custom classes from `tailwind.config.ts` are automatically available:

```tsx
// Custom colors
<div className="bg-brand text-on-accent">Brand Button</div>

// Custom spacing
<div className="p-nice">Nice padding</div>

// Custom breakpoints
<div className="mobile-md:text-sm tablet-md:text-base">Responsive text</div>
```

### Type Safety

```tsx
import type { TailwindColor, TailwindSpacing } from '@/types/tailwind';

// Type-safe color usage
const color: TailwindColor = 'brand-500'; // ✅ Valid
const invalidColor: TailwindColor = 'invalid-color'; // ❌ Type error

// Type-safe spacing
const spacing: TailwindSpacing = 'nice'; // ✅ Valid
```

## Customization

### Adding New Custom Classes

1. **Update `tailwind.config.ts`**:
   ```ts
   theme: {
     extend: {
       colors: {
         'custom-color': '#123456',
       },
       spacing: {
         'custom-spacing': '2.5rem',
       },
     },
   }
   ```

2. **Update `src/types/tailwind.d.ts`**:
   ```ts
   export type TailwindColor = 
     | 'custom-color'
     // ... existing colors
   ```

### VS Code Settings

Customize IntelliSense behavior in `.vscode/settings.json`:

```json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Troubleshooting

### IntelliSense Not Working

1. **Restart VS Code** after installing extensions
2. **Check file associations** - ensure `.tsx` files are recognized as TypeScript React
3. **Verify Tailwind config** - ensure `content` paths include your source files
4. **Check for errors** in VS Code's Output panel (View → Output → Tailwind CSS)

### Missing Custom Classes

1. **Restart TypeScript server** (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")
2. **Check `tailwind.config.ts`** - ensure custom classes are properly defined
3. **Update type definitions** in `src/types/tailwind.d.ts`

### Performance Issues

1. **Exclude large directories** in VS Code settings:
   ```json
   "tailwindCSS.files.exclude": [
     "**/node_modules/**",
     "**/.next/**",
     "**/dist/**"
   ]
   ```

2. **Limit content paths** in `tailwind.config.ts` to only necessary directories

## Best Practices

1. **Use utility functions** for complex class combinations
2. **Leverage TypeScript** for type-safe class usage
3. **Keep custom classes minimal** - prefer standard Tailwind classes
4. **Use consistent naming** for custom classes
5. **Document custom classes** in comments or documentation

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS IntelliSense Extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [VS Code Tailwind CSS Guide](https://tailwindcss.com/docs/editor-setup) 