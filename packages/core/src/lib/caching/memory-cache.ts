import { Symbols } from '../symbols.type'
import { Cache } from './cache.interface'

export class MemoryCache implements Cache {
	#store = new Map<string, Symbols>()

	get(key: string): Promise<Symbols | undefined> {
		return Promise.resolve(this.#store.get(key))
	}

	has(key: string): Promise<boolean> {
		return Promise.resolve(this.#store.has(key))
	}

	set(key: string, value: Symbols): Promise<void> {
		this.#store.set(key, value)

		return Promise.resolve()
	}

	delete(key: string): Promise<void> {
		this.#store.delete(key)

		return Promise.resolve()
	}

	clear(): Promise<void> {
		this.#store.clear()

		return Promise.resolve()
	}
}
