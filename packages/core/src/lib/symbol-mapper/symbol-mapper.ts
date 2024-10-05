import { Config as SvgoConfig, optimize, PluginConfig } from 'svgo'
import { Symbols } from '../symbols.type'
import { convertToSymbolPlugin } from '../svgo-plugins/convert-to-symbol-plugin'
import { svgoDefaultPlugins } from '../svgo-plugins/svgo-default-plugins'



export class SymbolMapper {
	#symbols: Symbols

	readonly #svgoPlugins: PluginConfig[]

	constructor(initial: Symbols = {}, svgoPlugins: PluginConfig[] = svgoDefaultPlugins) {
		this.#symbols = initial
		this.#svgoPlugins = svgoPlugins
	}

	get names(): string[] {
		return Object.keys(this.#symbols)
	}

	get symbols(): Readonly<Symbols> {
		return Object.freeze(this.#symbols)
	}

	add(name: string, svg: string): this {
		this.#symbols[name] = optimize(svg, this.#getSvgoConfig(name)).data

		return this
	}

	merge(symbolMapper: SymbolMapper): void {
		this.#symbols = Object.assign(this.#symbols, symbolMapper.#symbols)
	}

	delete(name: string): this {
		delete this.#symbols[name]

		return this
	}

	prune(names: string[]): this {
		for (const name of names) delete this.#symbols[name]

		return this
	}

	toString(): string {
		return Object.values(this.#symbols).join('')
	}

	#getSvgoConfig(name: string): SvgoConfig {
		return {
			plugins: [
				...this.#svgoPlugins,
				{
					name: 'removeAttrs',
					params: {
						attrs: 'id',
					},
				},
				{
					name: 'addAttributesToSVGElement',
					params: { attribute: { id: name } },
				},
				convertToSymbolPlugin,
			],
		}
	}
}
