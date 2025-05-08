"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const zs_1 = require("~/zs");
const error_1 = require("~/error");
const project = JSON.parse(fs_1.default.readFileSync('Z#.project.json').toString());
commander_1.program
    .name('Z#')
    .description('Z# compiler');
commander_1.program.command('build')
    .description('Compile Z# code')
    .option('--input, -I <path>')
    .option('--output, -O <path>')
    .option('--mode, -M <string>')
    .action((_options) => {
    for (const option in _options) {
        if (project?.[option] && _options[option] !== project?.[option]) {
            throw new error_1.ErrorType.Command.Conflicting.Parameters([option, option]);
        }
        ;
    }
    ;
    const options = { ..._options, ...project };
    if (!options.input) {
        throw new error_1.ErrorType.Command.Missing.Parameters(['input']);
    }
    ;
    const asm = zs_1.Z.toAssembly(fs_1.default.readFileSync(options.input).toString(), {
        import: (path) => {
            return fs_1.default.readFileSync(path).toString();
        }
    });
    fs_1.default.writeFileSync(options.output || options.input + '.asm', asm);
});
commander_1.program.parse();
const options = commander_1.program.opts();
