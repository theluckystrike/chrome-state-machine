/**
 * State Machine — Finite state machine with guards, effects, and persistence
 */
export interface MachineConfig<S extends string, E extends string> {
    initial: S;
    states: Record<S, { on?: Partial<Record<E, { target: S; guard?: () => boolean; effect?: () => void | Promise<void> }>> }>;
}

export class StateMachine<S extends string, E extends string> {
    private current: S;
    private config: MachineConfig<S, E>;
    private listeners: Array<(state: S, prev: S) => void> = [];
    private history: S[] = [];

    constructor(config: MachineConfig<S, E>) {
        this.config = config;
        this.current = config.initial;
        this.history.push(this.current);
    }

    /** Get current state */
    get state(): S { return this.current; }

    /** Send an event to trigger transition */
    async send(event: E): Promise<S> {
        const stateConfig = this.config.states[this.current];
        if (!stateConfig?.on) return this.current;

        const transition = stateConfig.on[event];
        if (!transition) return this.current;

        if (transition.guard && !transition.guard()) return this.current;

        const prev = this.current;
        this.current = transition.target;
        this.history.push(this.current);

        if (transition.effect) await transition.effect();
        this.listeners.forEach((fn) => fn(this.current, prev));

        return this.current;
    }

    /** Check if event can be sent */
    can(event: E): boolean {
        const stateConfig = this.config.states[this.current];
        if (!stateConfig?.on) return false;
        const transition = stateConfig.on[event];
        if (!transition) return false;
        return transition.guard ? transition.guard() : true;
    }

    /** Get available events from current state */
    available(): E[] {
        const stateConfig = this.config.states[this.current];
        if (!stateConfig?.on) return [];
        return (Object.keys(stateConfig.on) as E[]).filter((e) => this.can(e));
    }

    /** Subscribe to state changes */
    onChange(callback: (state: S, prev: S) => void): () => void {
        this.listeners.push(callback);
        return () => { this.listeners = this.listeners.filter((fn) => fn !== callback); };
    }

    /** Get transition history */
    getHistory(): S[] { return [...this.history]; }

    /** Reset to initial state */
    reset(): void { this.current = this.config.initial; this.history = [this.current]; }

    /** Save state to storage */
    async save(key: string = '__fsm_state__'): Promise<void> {
        await chrome.storage.local.set({ [key]: { current: this.current, history: this.history } });
    }

    /** Restore state from storage */
    async restore(key: string = '__fsm_state__'): Promise<void> {
        const result = await chrome.storage.local.get(key);
        if (result[key]) { this.current = result[key].current; this.history = result[key].history || []; }
    }

    /** Check if in specific state */
    is(state: S): boolean { return this.current === state; }
}
