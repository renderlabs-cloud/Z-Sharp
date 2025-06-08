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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zs = exports.Zasm_bug = exports.Z_bug = exports.Zasm_error = exports.header = void 0;
exports.hyperlink = hyperlink;
exports.success = success;
exports.failure = failure;
exports.format = format;
const ct = __importStar(require("colorette"));
function hyperlink(text, url, attrs) {
    return ct.blue(`\u001b]8;${attrs || ''};${url || text}\u0007${text}\u001b]8;;\u0007`);
}
;
exports.header = ct.white(':===: ' + ct.red('Z#') + ' :===:' + '\n\n' +
    hyperlink('Documentation', 'https://docs.zsharp.dev') + '\n');
exports.Zasm_error = `${ct.red(ct.bold('Z# intermediate Error'))}!`;
exports.Z_bug = `${ct.red(ct.bold('This is definitely a bug'))}! Please report it:`;
exports.Zasm_bug = hyperlink('Report', 'https://github.com/renderlabs-cloud/Z-Sharp/issues/new?template=Zasm_bug.yml');
exports.zs = ct.red('Z#');
/**
 * Generates a success message for the CLI.
 * @param data The data to include in the message.
 * @returns The message.
 */
function success(data) {
    return ct.white('\n' +
        `Code compilation ${ct.green('succeeded')} in ${ct.green(data.time)}ms with ${((data.vulnerabilities == 0) ? ct.green('0') : ((data.vulnerabilities < 5) ? ct.yellow(data.vulnerabilities) : ct.red(data.vulnerabilities)))} known vulnerabilit(ies).`);
}
;
/**
 * Generates a failure message for the CLI.
 * @param data The data to include in the message.
 * @returns The message.
 */
function failure(data) {
    return ct.white('\n' +
        `Code compilation ${ct.red('failed')} with ${ct.red(data.errors)} error(s).`);
}
;
/**
 * Format a string with color.
 * @param data The string to format.
 * @returns The formatted string.
 */
function format(data) {
    return data
        .replace(/(['"])([^'"]+)\1/g, (_, quote, content) => ct.green(`${quote}${content}${quote}`))
        .replace(/\b(0x[0-9a-fA-F]+|\d+)\b/g, (match) => ct.cyan(match));
}
