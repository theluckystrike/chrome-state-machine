# chrome-state-machine

State machine utilities for Chrome extensions.

## Installation

```bash
npm install chrome-state-machine
```

## Usage

```javascript
import { StateMachine } from 'chrome-state-machine';

const machine = new StateMachine({
  initial: 'idle',
  states: { idle: { on: { start: 'running' } } }
});
```

## License

MIT
