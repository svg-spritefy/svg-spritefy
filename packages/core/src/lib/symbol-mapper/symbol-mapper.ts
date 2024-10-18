import { Config as SvgoConfig, optimize, PluginConfig } from 'svgo'
import { convertToSymbolPlugin } from '../svgo-plugins/convert-to-symbol-plugin'
import { svgoDefaultPlugins } from '../svgo-plugins/svgo-default-plugins'
import { Symbols } from '../symbols.type'

export class SymbolMapper {
	static merge(...mappers: SymbolMapper[]): SymbolMapper {
		const newMapper = new SymbolMapper()

		for (const mapper of mappers) newMapper.addSymbols(mapper.symbols)

		return newMapper
	}

	readonly #symbols: Symbols

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

	addSymbols(symbols: Symbols): this {
		Object.assign(this.#symbols, symbols)

		return this
	}

	delete(name: string): this {
		delete this.#symbols[name]

		return this
	}

	prune(names: string[]): this {
		for (const name of names) delete this.#symbols[name]

		return this
	}

	toSvgContent(): string {
		return `<svg xmlns="http://www.w3.org/2000/svg">${Object.values(this.#symbols).join('')}</svg>`
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
