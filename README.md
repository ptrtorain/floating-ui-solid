# floating-ui-solid

## Installation

```bash
npm i floating-ui-solid
```
```bash
yarn add floating-ui-solid
```
```bash
pnpm i floating-ui-solid
```

```bash
bun add floating-ui-solid`
```


## Usage

```js
import { useFloating } from 'floating-ui-solid';

export default function App() {
  const [isOpen, setIsOpen] = createSignal(false);
  const { x, y, refs, floatingStyles } = useFloating({
    placement: "bottom",
    isOpen: isOpen,
    strategy: "absolute",
  });

  return (
    <>
      <main>
        <div>
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)} class="reference"
            ref={refs.setReference}>
            Hover me
          </div>
        </div>
        {isOpen() && <div ref={refs.setFloating} style={{ ...floatingStyles() }} class="float">Floating</div>}
      </main >
    </>
  );
}
```

### autoUpdate
```js
import {autoUpdate} from 'floating-ui-solid';

  const { x, y, refs, floatingStyles } = useFloating({
    placement: "bottom",
    isOpen: isOpen,
    strategy: "absolute",
    whileElementsMounted: autoUpdate,
    // or
    whileElementsMounted: (reference, floating, update) => {
        const cleanup = autoUpdate(reference, floating, update, {elementResize: true});
        return cleanup;
    },
  });

```