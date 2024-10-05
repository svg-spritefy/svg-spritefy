import { join } from 'node:path'
import { SourceConfig } from '../source-config.interface'
import { readdir, readFile } from 'node:fs/promises'

import { SymbolMapper } from '../symbol-mapper/symbol-mapper'
import { Symbols } from '../symbols.type'

export class SymbolCreator {
	readonly #sourceDir: string
	readonly #prefix: string
	readonly #separator: string

	constructor({ sourceDir, prefix = '', separator = ':' }: SourceConfig) {
		this.#sourceDir = sourceDir
		this.#prefix = prefix
		this.#separator = separator
	}

	async createSymbols(initial?: Symbols): Promise<SymbolMapper> {
		const sprite = new SymbolMapper(initial)


		const iconPaths = (await readdir(this.#sourceDir, { recursive: true })).filter(value => value.endsWith('.svg'))

		for (const entry of iconPaths) {
			const iconName =
				this.#prefix + this.#separator + entry.replace(/[\\/]/g, this.#separator).replace('.svg', '')
			const svgFile = await readFile(join(this.#sourceDir, entry), { encoding: 'utf-8' })

			sprite.add(iconName, svgFile)
		}

		return sprite
	}
}
