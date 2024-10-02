import { optimize, PluginConfig } from 'svgo'
import { Symbols } from '../symbols.type'

export class SymbolMapper {
	readonly #symbols: Symbols

	readonly #svgoConfig: PluginConfig[] = [
		'removeXMLNS',
		'removeDimensions',
		{
			name: 'convertToSymbol',
			fn: () => {
				return {
					element: {
						enter: node => {
							if (node.name === 'svg') node.name = 'symbol'
						},
					},
				}
			},
		},
	]

	constructor(initial: Symbols = {}) {
		this.#symbols = initial
	}

	get names(): string[] {
		return Object.keys(this.#symbols)
	}

	add(name: string, svg: string): this {
		this.#symbols[name] = optimize(svg, {
			plugins: [{ name: 'addAttributesToSVGElement', params: { attribute: { id: name } } }, ...this.#svgoConfig],
		}).data

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

	toString(): string {
		return Object.values(this.#symbols).join('')
	}
}
