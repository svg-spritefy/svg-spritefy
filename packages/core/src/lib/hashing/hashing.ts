import type { Hash } from 'node:crypto'
import { createHash } from 'node:crypto'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

export class Hashing {
	async createFolderHash(folderPath: string): Promise<string> {
		try {
			const hash = this.#createHash()
			const files = await readdir(folderPath, { recursive: true })

			for (const file of files) {
				const filePath = join(folderPath, file)
				const stats = await stat(filePath)

				hash.update(stats.mtime.getTime().toString())
			}

			return hash.digest('hex')
		} catch (err) {
			console.error('[svg-spritefy] Error reading directory or files:', err)
			throw err
		}
	}

	createContentHash(content: string): string {
		return this.#createHash().update(content).digest('hex')
	}

	#createHash(): Hash {
		return createHash('shake256', { outputLength: 4 })
	}
}
