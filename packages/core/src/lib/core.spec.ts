import { core } from './core'
import { describe, expect, it } from 'vitest'

describe('core', () => {
	it('should work', () => {
		expect(core()).toEqual('core')
	})
})
