import { Symbols } from '../symbols.type'

export interface Cache {
	get(key: string): Promise<Symbols | undefined>

	has(key: string): Promise<boolean>

	set(key: string, value: Symbols): Promise<void>

	delete(key: string): Promise<void>
	clear(): Promise<void>
}