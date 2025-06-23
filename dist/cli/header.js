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
exports.Header = void 0;
const ct = __importStar(require("colorette"));
const package_json_1 = __importDefault(require("package.json"));
var Header;
(function (Header) {
    function hyperlink(text, url, attrs) {
        return ct.blue(`\u001b]8;${attrs || ''};${url || text}\u0007${text}\u001b]8;;\u0007`);
    }
    Header.hyperlink = hyperlink;
    ;
    function bullets(data) {
        return data.map((item) => `• ${item}`).join('\n');
    }
    Header.bullets = bullets;
    ;
    Header.header = ct.white(`
:===: ${ct.red('Z#')} :===:

${bullets([
        hyperlink('Documentation', 'https://docs.zsharp.dev'),
        hyperlink('GitHub', 'https://github.com/renderlabs-cloud/Z-Sharp'),
        hyperlink('Discord', 'https://discord.gg/gGcbaBjtBS'),
        hyperlink('Version', `https://npmjs.com/package/@zsharp/core/v/${package_json_1.default.version}`)
        // ? Perhaps add a support page?
    ])}
		`);
    Header.Zasm_error = `${ct.red(ct.bold('Z# intermediate Error'))}!`;
    Header.Z_bug = `${ct.red(ct.bold('This should not happen! :\'('))}!`;
    Header.Zasm_bug = hyperlink('Report', 'https://github.com/renderlabs-cloud/Z-Sharp/issues/new?template=Zasm_bug.yml');
    Header.zs = ct.red('Z#');
    /**
     * Format a time in ms as a green string.
     * @param time The time in ms.
     * @returns A green colored in the format of `X.XXs`.
     */
    function time(time) {
        let timeString = null;
        if (time < 1000) {
            timeString = `${time}ms`;
        }
        else {
            timeString = `${(time / 1000).toFixed(2)}s`;
        }
        ;
        if (time < 1000) {
            return ct.green(timeString);
        }
        else if (time < 10000) {
            return ct.yellow(timeString);
        }
        else {
            return ct.red(timeString);
        }
        ;
    }
    Header.time = time;
    ;
    /**
     * Generates a success message for the CLI.
     * @param data The data to include in the message.
     * @returns The message.
     */
    function success(data) {
        return ct.white(`Code compilation ${ct.green('succeeded')} in ${Header.time(data.time)} with ${((data.vulnerabilities == 0) ? ct.green('0') : ((data.vulnerabilities < 5) ? ct.yellow(data.vulnerabilities) : ct.red(data.vulnerabilities)))} known vulnerabilit(ies).`);
    }
    Header.success = success;
    ;
    /**
     * Generates a failure message for the CLI.
     * @param data The data to include in the message.
     * @returns The message.
     */
    function failure(data) {
        return ct.white(`Code compilation ${ct.red('failed')} with ${ct.red(data.errors)} error(s).`);
    }
    Header.failure = failure;
    ;
    const ansiRegex = /\x1b\[[0-9;]*m/g;
    /**
     * Format a string with color.
     * @param data The string to format.
     * @returns The formatted string.
     */
    function format(data) {
        let lastColor = ''; // will hold the last color code found before match
        return data.replace(/(['"])([^'"]+)\1/g, (match, quote, content, offset) => {
            // Find the last color code before this match
            lastColor = findLastColorCode(data.slice(0, offset)) || lastColor;
            return ct.green(`${quote}${content}${quote}`) + lastColor;
        }).replace(/\b(0x[0-9a-fA-F]+|\d+)\b/g, (match, _, offset) => {
            lastColor = findLastColorCode(data.slice(0, offset)) || lastColor;
            return ct.cyan(match) + lastColor;
        });
    }
    Header.format = format;
    ;
    function findLastColorCode(str) {
        const matches = [...str.matchAll(ansiRegex)];
        return matches.length ? matches[matches.length - 1][0] : null;
    }
    ;
})(Header || (exports.Header = Header = {}));
;
