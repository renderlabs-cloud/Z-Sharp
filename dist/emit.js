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
exports.compileAssemblyToBinary = compileAssemblyToBinary;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const z_S_1 = __importDefault(require("~/asm/dist/z_S"));
const header_1 = require("~/cli/header");
async function compileAssemblyToBinary(source, output) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zsharp-'));
    const inputFile = path.join(tempDir, 'temp.s');
    const outputFile = path.join(tempDir, 'temp' + output);
    const zHeaderFile = path.join(tempDir, 'z.S');
    await fs.writeFile(inputFile, source);
    await fs.writeFile(zHeaderFile, z_S_1.default);
    await new Promise((resolve, reject) => {
        const gcc = (0, child_process_1.spawn)('gcc', ['-x', 'assembler-with-cpp', '-c', inputFile, '-o', outputFile]);
        gcc.stderr.on('data', (data) => console.error(`GCC Error: \n${data}\n${header_1.Z_bug} ${header_1.Zasm_bug}`));
        gcc.on('close', (code) => {
            if (code === 0)
                resolve();
            else
                reject(process.exit(1));
        });
    });
    const binary = await fs.readFile(outputFile);
    await fs.rm(tempDir, { recursive: true, force: true });
    return binary;
}
;
