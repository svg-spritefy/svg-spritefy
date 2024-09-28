import { optimize, PluginConfig } from 'svgo'

export class SymbolMapper {
	#symbols: Record<string, string> = {}

	#svgoConfig: PluginConfig[] = [
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

	toString(): string {
		return Object.values(this.#symbols).join('')
	}
}
