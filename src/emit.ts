import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

import { Util } from '~/util';
import iz_ASM from '~/asm/dist/z_S';
import { Header } from './cli/header';

export namespace Emit {

	type BlockType = 'C' | 'ASM';

	async function parseIZFile(source: string): Promise<{ cSource: string; asmSource: string }> {
		const lines = source.split('\n');
		let currentBlock: BlockType | null = null;
		let cSource = '';
		let asmSource = '';

		for (const line of lines) {
			if (line.startsWith('#pragma block')) {
				if (line.includes('C')) currentBlock = 'C';
				else if (line.includes('ASM')) currentBlock = 'ASM';
				else if (line.includes('end')) currentBlock = null;
				continue;
			};

			if (currentBlock === 'C') cSource += line + '\n';
			else if (currentBlock === 'ASM') asmSource += line + '\n';
		};

		return { cSource, asmSource };
	};

	async function runCommand(command: string, args: string[]): Promise<void> {
		return new Promise((resolve, reject) => {
			const proc = spawn(command, args, { stdio: 'inherit' });
			proc.on('close', (code) => {
				if (code === 0) resolve();
				else reject(new Error(`Command "${command} ${args.join(' ')}" failed with exit code ${code}`));
			});
			proc.on('error', (err) => {
				Util.log(`
${Header.Z_bug} ${Header.Zasm_bug}:
${err.message}
					 `);
			});
		});
	};

	/**
	 * Compiles the given .iz source into an ELF binary.
	 * Returns the ELF file as a Uint8Array (no files saved permanently).
	 *
	 * @param izSource - The .iz source code.
	 * @returns Promise resolving to the ELF binary as Uint8Array.
	 */
	export async function compileIZToELF(izSource: string): Promise<Uint8Array> {
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zsharp-'));
		const { cSource, asmSource } = await parseIZFile(izSource);

		const SFile = path.join(tempDir, 'z.S');
		const cFile = path.join(tempDir, 'temp.c');
		const asmFile = path.join(tempDir, 'temp.S');
		const cOut = path.join(tempDir, 'temp_c.s');
		const asmOut = path.join(tempDir, 'temp_asm.s');
		const elfFile = path.join(tempDir, 'output.elf');

		// Write C and ASM temp files
		await fs.writeFile(SFile, iz_ASM);
		await fs.writeFile(cFile, cSource);
		await fs.writeFile(asmFile, asmSource);

		// Compile to object files
		try {
			await runCommand('gcc', ['-S', cFile, '-o', cOut]);
			await runCommand('gcc', ['-S', asmFile, '-o', asmOut]);
			Util.debug(await fs.readFile(asmOut));

			// Link to ELF
			await runCommand('gcc', [cOut, asmOut, '-o', elfFile]);
		} catch (err) {
			// Util.error(err.message);
		};
		// Read ELF binary buffer
		const elfBuffer = await fs.readFile(elfFile);

		// Cleanup temp files
		await fs.rm(tempDir, { recursive: true, force: true });

		return elfBuffer; // Return pure ELF Uint8Array
	};
};
