# floating-ui-solid

[![NPM](https://img.shields.io/npm/v/floating-ui-solid)](https://www.npmjs.com/package/floating-ui-solid)

![Logo](https://i.imgur.com/l8VYgtb.png)
A lightweight and efficient Floating UI implementation for SolidJS.

## Why choose floating-ui-solid?

- 📦 Smaller bundle size
- 🧹 Proper cleanup: cleanup function with autoUpdate is properly handled
- 💪 Improved TypeScript support
- 🤖 Better API

## Installation

Choose your preferred package manager:

```bash
npm install floating-ui-solid
# or
yarn add floating-ui-solid
# or
pnpm add floating-ui-solid
# or
bun add floating-ui-solid
```

## Usage

Here's a basic example of how to use floating-ui-solid:

```jsx
import { createSignal } from 'solid-js';
import { useFloating } from 'floating-ui-solid';

export default function App() {
  const [isOpen, setIsOpen] = createSignal(false);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",
    isOpen: isOpen,
    strategy: "absolute",
  });

  return (
    <main>
      <div
        ref={refs.setReference}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        class="reference"
      >
        Hover me
      </div>
      {isOpen() && (
        <div
          ref={refs.setFloating}
          style={floatingStyles()}
          class="float"
        >
          Floating
        </div>
      )}
    </main>
  );
}
```

### Using autoUpdate

To keep the floating element positioned correctly when the reference element changes, use the `autoUpdate` function:

```jsx
import { autoUpdate, useFloating } from 'floating-ui-solid';

const { refs, floatingStyles } = useFloating({
  placement: "bottom",
  isOpen: isOpen,
  strategy: "absolute",
  whileElementsMounted: autoUpdate,
  // or for more control:
  whileElementsMounted: (reference, floating, update) => {
    const cleanup = autoUpdate(reference, floating, update, { elementResize: true });
    return cleanup;
  },
});
```

### Applying Custom Styles

You can apply custom styles to the floating element using middleware:

```jsx
import { autoUpdate, useFloating, size, offset } from 'floating-ui-solid';

const { refs, floatingStyles, setStyles } = useFloating({
  placement: "bottom",
  isOpen: isOpen,
  strategy: "absolute",
  middleware: [
    offset(10),
    size({
      apply({ availableHeight }) {
        setStyles({ ...floatingStyles(), maxHeight: `${availableHeight}px` });
      }
    })
  ],
});
```

## License

This project is licensed under the MIT License.