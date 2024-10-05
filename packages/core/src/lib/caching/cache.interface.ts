import { Symbols } from '../symbols.type'

export interface Cache {
	get(name: string): Promise<Symbols | undefined>
	set(name: string, symbols: Symbols): Promise<void>
	delete(name: string): Promise<void>
	clear(): Promise<void>
}