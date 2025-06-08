import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

import z_S from '~/asm/dist/z_S';

import { FileType } from '~/file';
import { Zasm_error, Zasm_bug, Z_bug } from '~/cli/header';

export namespace Emit {
	/**
	 * Compiles the given assembly source code into a binary file.
	 *
	 * This function creates a temporary directory to handle the compilation process,
	 * writes the provided assembly source to a temporary file, and uses the GNU Compiler
	 * Collection (GCC) to compile the assembly into a binary format. The function also
	 * manages the inclusion of necessary header files required for the compilation.
	 *
	 * @param source - The assembly source code to be compiled.
	 * @param output - The desired output file path for the compiled binary.
	 * @returns A promise that resolves to the compiled binary data.
	 * @throws An error if the compilation process fails.
	 */

	export async function compileAssemblyToBinary(source: string, output: string) {
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zsharp-'));
		const inputFile = path.join(tempDir, 'temp.s');
		const outputFile = path.join(tempDir, path.join('main', output || ''));
		const outputDir = path.dirname(outputFile);
		const includeDir = path.join(tempDir, 'include');
		await fs.mkdir(path.join(tempDir, 'include'));
		const zHeaderFile = path.join(includeDir, 'z.S');

		fs.mkdir(outputDir, { recursive: true });

		await fs.writeFile(inputFile, source);
		await fs.writeFile(zHeaderFile, z_S);
		await new Promise<void>((resolve, reject) => {
			const gcc = spawn('gcc', ['-x', 'assembler-with-cpp', '-c', inputFile, '-o', outputFile, '-I', includeDir]);

			gcc.stderr.on('data', (data) => console.error(`${Zasm_error}: \n${data}\n${Z_bug} ${Zasm_bug}`));

			gcc.on('close', (code) => {
				if (code === 0) resolve();
				else reject(process.exit(1));
			});
		});

		const binary = await fs.readFile(outputFile);

		await fs.rm(tempDir, { recursive: true, force: true });

		return binary;
	};
};
