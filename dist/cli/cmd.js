#!/usr/bin/env node
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
const fs_1 = __importDefault(require("fs"));
const process_1 = __importDefault(require("process"));
const commander_1 = require("commander");
const ct = __importStar(require("colorette"));
const prompts_1 = require("@inquirer/prompts");
const zs_1 = require("~/zs");
const error_1 = require("~/error");
const header_1 = require("~/cli/header");
const project_1 = require("~/project");
const util_1 = require("~/util");
const package_json_1 = __importDefault(require("package.json"));
process_1.default.addListener('SIGINT', util_1.Util.terminate);
process_1.default.addListener('SIGTERM', util_1.Util.terminate);
let config = {};
commander_1.program
    .addHelpText('after', `
THIS SOFTWARE IS FREE AND MAY NOT BE SOLD UNDER ANY CIRCUMSTANCES.

If you paid for this software, you were scammed — demand a full refund immediately.
If the seller refuses, you are encouraged to pursue legal action.

Any attempt to sell this software, or modified versions of it, is strictly prohibited
and may result in prosecution.

"We are always watching" 🫎
	`);
commander_1.program
    .name('zs')
    .description(ct.white(`${header_1.Header.zs} compiler`))
    .version(package_json_1.default.version)
    .usage('<command> [options]');
commander_1.program.command('build')
    .description(`Build ${header_1.Header.zs} code`)
    .option('--input, -I <path>')
    .option('--output, -O <path>')
    .option('--mode, -M <string>')
    .option('--debug, -D')
    .action(async (options) => {
    if (!options.input) {
        throw new error_1.Errors.Command.Missing.Parameters(['input']);
    }
    ;
    util_1.Util.log(header_1.Header.header);
    config = project_1.Project.get(options.input.split('/').slice(0, -1).join('/'));
    const asm = await zs_1.Z.toIZ(fs_1.default.readFileSync(options.input).toString(), {
        import: [(path) => {
                return fs_1.default.readFileSync(path).toString();
            }],
        cli: true,
        debug: options.debug,
        base: config.base || ''
    }, config, options.input);
    fs_1.default.writeFileSync(options.output || options.input + '.iz', asm);
});
commander_1.program.command('emit')
    .description(`Compile ${header_1.Header.zs} intermediate assembly`)
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
        const termsAgreement = await (0, prompts_1.select)({
            choices: [
                'I agree',
                'I disagree'
            ],
            message: `Please read the Intermediate ${header_1.Header.zs} file (${header_1.Header.iz}) and accept the terms.`,
            default: 'I disagree'
        });
        if (termsAgreement == 'I disagree') {
            util_1.Util.terminate();
        }
        ;
    }
    ;
    const asm = fs_1.default.readFileSync(_options.input).toString();
    const binary = await zs_1.Z.emit(asm);
    fs_1.default.writeFileSync(_options.output, binary);
});
commander_1.program.parse();
