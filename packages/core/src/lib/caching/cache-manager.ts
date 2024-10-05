import { Symbols } from '../symbols.type'
import { Cache } from './cache.interface'
import { FileCache } from './file-cache'
import { MemoryCache } from './memory-cache'

export class CacheManager implements Cache {
	#fileCache = new FileCache()
	#memoryCache = new MemoryCache()

	async get(name: string): Promise<Symbols | undefined> {
		const memory = await this.#memoryCache.get(name)

		if (memory) return memory

		const file = await this.#fileCache.get(name)

		if (file) await this.#memoryCache.set(name, file)

		return file
	}

	async has(name: string): Promise<boolean> {
		const hasMemory = await this.#memoryCache.has(name)

		if (hasMemory) return true

		const file = await this.#fileCache.get(name)

		if (file) await this.#memoryCache.set(name, file)

		return !!file
	}

	async set(name: string, symbols: Symbols): Promise<void> {
		await Promise.all([this.#memoryCache.set(name, symbols), this.#fileCache.set(name, symbols)])
	}

	async delete(name: string): Promise<void> {
		await Promise.all([this.#memoryCache.delete(name), this.#fileCache.delete(name)])
	}

	async clear(): Promise<void> {
		await Promise.all([this.#memoryCache.clear(), this.#fileCache.clear()])
	}
}
