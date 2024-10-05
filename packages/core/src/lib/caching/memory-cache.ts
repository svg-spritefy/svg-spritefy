import { Symbols } from '../symbols.type';
import { Cache } from './cache.interface'

export class MemoryCache implements Cache {
	#store = new Map<string, Symbols>()

	get(name: string): Promise<Symbols | undefined> {
		return Promise.resolve(this.#store.get(name))
	}

	set(name: string, symbols: Symbols): Promise<void> {
		this.#store.set(name, symbols)

		return Promise.resolve()
	}

	delete(name: string): Promise<void> {
		this.#store.delete(name)

		return Promise.resolve()
	}

	clear(): Promise<void> {
		this.#store.clear();

		return Promise.resolve()
	}

}