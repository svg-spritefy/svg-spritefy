import { describe, expect, it } from 'vitest'
import { SymbolMapper } from './symbol-mapper'

describe('SymbolMapper class', () => {
	let symbolMapper: SymbolMapper

	beforeEach(() => {
		symbolMapper = new SymbolMapper()
	})

	it('adds a new symbol correctly', () => {
		const name = 'example'
		const svg = '<svg></svg>'

		symbolMapper.add(name, svg)
		expect(symbolMapper.names).toContain(name)
	})

	it('deletes a symbol correctly', () => {
		const name = 'example'
		const svg = '<svg></svg>'

		symbolMapper.add(name, svg)
		symbolMapper.delete(name)

		expect(symbolMapper.names).not.toContain(name)
	})

	it('produces a correct string representation', () => {
		const name = 'example'
		const svg = '<svg><path d="M0 0h100v100H0z"/></svg>'
		const expected = '<symbol id="example"><path d="M0 0h100v100H0z"/></symbol>'

		symbolMapper.add(name, svg)
		const result = symbolMapper.toSvgContent()
		expect(result).toBe(expected)
	})

	afterEach(() => {
		symbolMapper = new SymbolMapper()
	})
})
