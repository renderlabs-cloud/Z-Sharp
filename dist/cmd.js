#!/usr/bin/node
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
require('module-alias/register');
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const ct = __importStar(require("colorette"));
const prompts_1 = require("@inquirer/prompts");
const zs_1 = require("~/zs");
const error_1 = require("~/error");
const header_1 = require("~/cli/header");
const project_1 = require("~/project");
let config = {};
commander_1.program
    .name('zs')
    .description(ct.white(`${header_1.zs} compiler`));
commander_1.program.command('build')
    .description(`Build ${header_1.zs} code`)
    .option('--input, -I <path>')
    .option('--output, -O <path>')
    .option('--mode, -M <string>')
    .option('--debug, -D')
    .action((options) => {
    if (!options.input) {
        throw new error_1.Errors.Command.Missing.Parameters(['input']);
    }
    ;
    config = project_1.Project.get(options.input.split('/').slice(0, -1).join('/'));
    const asm = zs_1.Z.toAssembly(fs_1.default.readFileSync(options.input).toString(), {
        import: (path) => {
            return fs_1.default.readFileSync(path).toString();
        },
        cli: true,
        debug: options.debug
    }, config, options.input);
    fs_1.default.writeFileSync(options.output || options.input + '.iz', asm);
});
commander_1.program.command('emit')
    .description(`Compile ${header_1.zs} intermediate assembly`)
    .option('--input, -I <path>')
    .option('--output, -O <path>')
    .option('--target, -T <arch>')
    .option('--agree, -A')
    .action(async (_options) => {
    if (!_options.input) {
        throw new error_1.Errors.Command.Missing.Parameters(['input']);
    }
    ;
    if (!_options.agree) {
        await (0, prompts_1.confirm)({
            message: 'Before emitting the code, please read the Intermediate Z# file (.iz) and accept the terms.',
            default: false
        });
    }
    ;
    const asm = fs_1.default.readFileSync(_options.input).toString();
    const binary = await zs_1.Z.emit(asm, _options.output);
    fs_1.default.writeFileSync(_options.output, binary);
});
commander_1.program.parse();
const options = commander_1.program.opts();
