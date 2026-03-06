# Chrome State Machine

A finite state machine library for Chrome extensions with guards, side effects, and persistence across service worker restarts. Built for Manifest V3 lifecycle management.

## Installation

```bash
npm install chrome-state-machine
```

## Quick Start

```typescript
import { StateMachine } from 'chrome-state-machine';

type States = 'idle' | 'running' | 'paused';
type Events = 'start' | 'pause' | 'resume' | 'stop';

const machine = new StateMachine<States, Events>({
  initial: 'idle',
  states: {
    idle: {
      on: {
        start: { target: 'running' }
      }
    },
    running: {
      on: {
        pause: { target: 'paused' },
        stop: { target: 'idle' }
      }
    },
    paused: {
      on: {
        resume: { target: 'running' },
        stop: { target: 'idle' }
      }
    }
  }
});

console.log(machine.state); // 'idle'
await machine.send('start');
console.log(machine.state); // 'running'
```

## API Reference

### Constructor

```typescript
new StateMachine<S, E>(config: MachineConfig<S, E>)
```

The StateMachine constructor takes a configuration object with an initial state and a record of states.

### MachineConfig

```typescript
interface MachineConfig<S extends string, E extends string> {
  initial: S;
  states: Record<S, {
    on?: Partial<Record<E, {
      target: S;
      guard?: () => boolean;
      effect?: () => void | Promise<void>;
    }>>;
  }>;
}
```

Each state can define transitions triggered by events. Transitions support optional guards (conditions that must be met) and effects (side effects that run after the transition).

### State Machine Methods

**send(event: E): Promise\<S\>**

Send an event to trigger a state transition. Returns the new state. Guards are evaluated before transition, effects run after.

**can(event: E): boolean**

Check if an event can be sent from the current state. Returns true if the transition exists and its guard passes.

**available(): E[]**

Get all events that can be sent from the current state.

**is(state: S): boolean**

Check if the machine is in a specific state.

**onChange(callback: (state: S, prev: S) => void): () => void**

Subscribe to state changes. Returns an unsubscribe function.

**getHistory(): S[]**

Get the history of visited states.

**reset(): void**

Reset the machine to its initial state.

**save(key?: string): Promise\<void\>**

Persist the current state and history to chrome.storage.local.

**restore(key?: string): Promise\<void\>**

Restore state and history from chrome.storage.local.

## Guards

Guards are functions that control whether a transition can occur.

```typescript
const machine = new StateMachine({
  initial: 'locked',
  states: {
    locked: {
      on: {
        insertCoin: {
          target: 'unlocked',
          guard: () => hasCredit()
        }
      }
    },
    unlocked: {
      on: {
        turn: { target: 'playing' }
      }
    }
  }
});
```

## Effects

Effects are side effects that run after a successful transition. They can be async.

```typescript
const machine = new StateMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        fetch: {
          target: 'loading',
          effect: async () => {
            console.log('Starting fetch...');
          }
        }
      }
    },
    loading: {
      on: {
        success: { target: 'complete' },
        error: { target: 'failed' }
      }
    },
    complete: {},
    failed: {}
  }
});
```

## Persistence

The StateMachine integrates with chrome.storage.local to persist state across service worker restarts, which is essential for Chrome extension development.

```typescript
const machine = new StateMachine({ /* config */ });

// Save state
await machine.save('my-extension-state');

// Later, after service worker restarts
await machine.restore('my-extension-state');
```

## TypeScript

This library is written in TypeScript and provides full type safety. Define your state and event types for compile-time checking.

```typescript
type AppState = 'booting' | 'ready' | 'processing' | 'error';
type AppEvent = 'bootComplete' | 'startProcess' | 'processDone' | 'reset';

const config: MachineConfig<AppState, AppEvent> = {
  initial: 'booting',
  states: {
    booting: {
      on: {
        bootComplete: { target: 'ready' }
      }
    },
    ready: {
      on: {
        startProcess: { target: 'processing' }
      }
    },
    processing: {
      on: {
        processDone: { target: 'ready' },
        reset: { target: 'booting' }
      }
    },
    error: {
      on: {
        reset: { target: 'booting' }
      }
    }
  }
};
```

## About

chrome-state-machine is maintained by theluckystrike. This library is designed for developers building Chrome extensions who need reliable state management with persistence.

For questions and support, please open an issue on GitHub.

## License

MIT
