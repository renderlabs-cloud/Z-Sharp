#!/usr/bin/node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("@mnrendra/chalk"));
const zs_1 = require("~/zs");
const error_1 = require("~/error");
const header_1 = require("~/cli/header");
let project = {};
function getProject(path) {
    try {
        return JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(path + '/.zsharp.json')).toString());
    }
    catch (err) {
        if (path == path_1.default.resolve(path)) {
            return {};
        }
        ;
        return getProject(path_1.default.resolve(path + '/../'));
    }
    ;
}
;
commander_1.program
    .name('zs')
    .description(chalk_1.default.white(`${header_1.zs} compiler`));
commander_1.program.command('build')
    .description(`Compile ${header_1.zs} code`)
    .option('--input, -I <path>')
    .option('--output, -O <path>')
    .option('--mode, -M <string>')
    .action((_options) => {
    for (const option in _options) {
        if (project?.[option] && _options[option] !== project?.[option]) {
            throw new error_1.Errors.Command.Conflicting.Parameters([option, option]);
        }
        ;
    }
    ;
    const options = { ..._options, ...project };
    if (!options.input) {
        throw new error_1.Errors.Command.Missing.Parameters(['input']);
    }
    ;
    project = getProject(options.input.split('/').slice(0, -1).join('/'));
    const asm = zs_1.Z.toAssembly(fs_1.default.readFileSync(options.input).toString(), {
        import: (path) => {
            return fs_1.default.readFileSync(path).toString();
        },
        cli: true
    }, options.input);
    fs_1.default.writeFileSync(options.output || options.input + '.iz', asm);
});
commander_1.program.parse();
const options = commander_1.program.opts();
