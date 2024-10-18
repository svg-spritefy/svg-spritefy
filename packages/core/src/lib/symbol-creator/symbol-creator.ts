import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { CacheManager } from '../caching/cache-manager'

import { SourceConfig } from '../source-config.interface'
import { SymbolMapper } from '../symbol-mapper/symbol-mapper'
import { Symbols } from '../symbols.type'

export class SymbolCreator {
	readonly #sourceDir: string
	readonly #prefix: string
	readonly #separator: string
	readonly #cacheManager: CacheManager
	readonly #configHash: string

	constructor(config: SourceConfig, cacheManager: CacheManager) {
		this.#sourceDir = config.sourceDir
		this.#prefix = config.prefix || ''
		this.#separator = config.separator || ':'
		this.#cacheManager = cacheManager

		this.#configHash = createHash('md5').update(JSON.stringify(config)).digest('hex')
	}

	async createMapper(initial?: Symbols): Promise<SymbolMapper> {
		const symbolMapper = new SymbolMapper(initial)

		if (await this.#cacheManager.has(this.#configHash)) {
			const cache = await this.#cacheManager.get(this.#configHash)

			if (cache) return symbolMapper.addSymbols(cache)
		}

		const iconPaths = (await readdir(this.#sourceDir, { recursive: true })).filter(value => value.endsWith('.svg'))

		for (const entry of iconPaths) {
			const iconName =
				this.#prefix + this.#separator + entry.replace(/[\\/]/g, this.#separator).replace('.svg', '')
			const svgFile = await readFile(join(this.#sourceDir, entry), { encoding: 'utf-8' })

			symbolMapper.add(iconName, svgFile)
		}

		await this.#cacheManager.set(this.#configHash, symbolMapper.symbols)

		return symbolMapper
	}
}
