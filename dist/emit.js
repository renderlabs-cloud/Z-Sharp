"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emit = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const util_1 = require("~/util");
const z_S_1 = __importDefault(require("~/asm/dist/z_S"));
const error_1 = require("~/error");
var Emit;
(function (Emit) {
    async function parseIZFile(source) {
        const lines = source.split('\n');
        let currentBlock = null;
        let cSource = '';
        let asmSource = '';
        for (const line of lines) {
            if (line.startsWith('#pragma block')) {
                if (line.includes('C'))
                    currentBlock = 'C';
                else if (line.includes('ASM'))
                    currentBlock = 'ASM';
                else if (line.includes('end'))
                    currentBlock = null;
                continue;
            }
            ;
            if (currentBlock === 'C')
                cSource += line + '\n';
            else if (currentBlock === 'ASM')
                asmSource += line + '\n';
        }
        ;
        return { cSource, asmSource };
    }
    ;
    async function runCommand(command, args) {
        return new Promise((resolve, reject) => {
            const proc = (0, child_process_1.spawn)(command, args);
            let stderr = '';
            let handled = false;
            proc.on('close', (code) => {
                if (handled)
                    return;
                handled = true;
                if (code === 0)
                    resolve();
                else
                    reject(`
GCC exited with exit code: ${code}
${stderr}
`);
            });
            proc.stderr?.on('data', (chunk) => {
                stderr += chunk.toString();
            });
        });
    }
    ;
    /**
     * Compiles the given .iz source into an ELF binary.
     * Returns the ELF file as a Uint8Array (no files saved permanently).
     *
     * @param izSource - The .iz source code.
     * @returns Promise resolving to the ELF binary as Uint8Array.
     */
    async function compileIZToELF(izSource) {
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zsharp-'));
        const { cSource, asmSource } = await parseIZFile(izSource);
        const SFile = path.join(tempDir, 'z.S');
        const cFile = path.join(tempDir, 'temp.c');
        const asmFile = path.join(tempDir, 'temp.S');
        const cOut = path.join(tempDir, 'temp_c.s');
        const elfFile = path.join(tempDir, 'output.elf');
        await fs.writeFile(SFile, z_S_1.default);
        await fs.writeFile(cFile, cSource);
        await fs.writeFile(asmFile, asmSource);
        // Compile to object files
        try {
            await runCommand('gcc', ['-S', cFile, '-o', cOut]);
            // Link to ELF
            await runCommand('gcc', [cOut, SFile, asmFile, '-o', elfFile]);
        }
        catch (err) {
            util_1.Util.error(new error_1.Errors.IZ.Bug(err), false);
        }
        ;
        // Read ELF binary buffer
        const elfBuffer = await fs.readFile(elfFile);
        // Cleanup temp files
        await fs.rm(tempDir, { recursive: true, force: true });
        return elfBuffer; // Return pure ELF Uint8Array
    }
    Emit.compileIZToELF = compileIZToELF;
    ;
})(Emit || (exports.Emit = Emit = {}));
;
