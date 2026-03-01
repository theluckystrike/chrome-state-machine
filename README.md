# chrome-state-machine — Finite State Machine for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-state-machine`

Typed states and events, transition guards, async side effects, history, and persistence across service worker restarts.

```typescript
import { StateMachine } from 'chrome-state-machine';
const machine = new StateMachine({
  initial: 'idle',
  states: {
    idle: { on: { START: { target: 'running', guard: () => isReady(), effect: () => startWork() } } },
    running: { on: { STOP: { target: 'idle' }, ERROR: { target: 'failed' } } },
    failed: { on: { RETRY: { target: 'running' } } },
  },
});
await machine.send('START');
await machine.save();
```
MIT License
