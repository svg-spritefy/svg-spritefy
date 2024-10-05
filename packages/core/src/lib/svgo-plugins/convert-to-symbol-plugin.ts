import { PluginConfig } from 'svgo'

export const convertToSymbolPlugin: PluginConfig = {
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
}