import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Symbols } from '../symbols.type'
import { Cache } from './cache.interface'

export class FileCache implements Cache {
	#cacheDir = resolve(dirname(fileURLToPath(import.meta.url)), '.cache')

	async get(name: string): Promise<Symbols | undefined> {
		try {
			const file = await readFile(join(this.#cacheDir, name), 'utf-8')

			return JSON.parse(file)
		} catch {
			return undefined
		}
	}

	async has(name: string): Promise<boolean> {
		try {
			await access(join(this.#cacheDir, name))
			return true
		} catch {
			return false
		}
	}

	async set(name: string, symbols: Symbols): Promise<void> {
		const filePath = join(this.#cacheDir, name)
		const dirPath = dirname(filePath)

		try {
			await access(filePath)
		} catch {
			await mkdir(dirPath, { recursive: true })
		} finally {
			await writeFile(filePath, JSON.stringify(symbols), { encoding: 'utf-8' })
		}
	}

	async delete(name: string): Promise<void> {
		await rm(join(this.#cacheDir, name), { recursive: true })
	}

	async clear(): Promise<void> {
		await rm(this.#cacheDir, { recursive: true })
	}
}
