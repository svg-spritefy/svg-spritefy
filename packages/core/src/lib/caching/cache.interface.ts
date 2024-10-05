import { Symbols } from '../symbols.type'

export interface Cache {
	get(name: string): Promise<Symbols | undefined>

	has(name: string): Promise<boolean>
	set(name: string, symbols: Symbols): Promise<void>
	delete(name: string): Promise<void>
	clear(): Promise<void>
}