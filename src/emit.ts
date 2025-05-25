import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

import z_S from '~/asm/dist/z_S';

import { FileType } from '~/file';
import { hyperlink, Zasm_bug, Z_bug } from '~/cli/header';

export async function compileAssemblyToBinary(source: string, output: FileType.FileType) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zsharp-'));
  const inputFile = path.join(tempDir, 'temp.s');
  const outputFile = path.join(tempDir, 'temp' + output);
  const zHeaderFile = path.join(tempDir, 'z.S');

  await fs.writeFile(inputFile, source);
  await fs.writeFile(zHeaderFile, z_S);

  await new Promise<void>((resolve, reject) => {
    const gcc = spawn('gcc', ['-x', 'assembler-with-cpp', '-c', inputFile, '-o', outputFile]);

    gcc.stderr.on('data', (data) => console.error(`GCC Error: \n${data}\n${Z_bug} ${Zasm_bug}`));

    gcc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(process.exit(1));
    });
  });

  const binary = await fs.readFile(outputFile);

  await fs.rm(tempDir, { recursive: true, force: true });

  return binary;
};
