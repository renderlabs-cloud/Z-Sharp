"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
const chalk_1 = __importDefault(require("@mnrendra/chalk"));
var Errors;
(function (Errors) {
    const colon = chalk_1.default.reset(':');
    const exclamation = chalk_1.default.reset('!');
    const dash = chalk_1.default.reset('-');
    const newline = chalk_1.default.reset('\n');
    class MainError {
        message;
        stack;
        constructor(message, stack) {
            this.message = message;
            this.stack = stack;
            console.log(this.message);
            process.exit(1);
        }
        ;
    }
    ;
    function highlight(position, highlight) {
        return chalk_1.default.cyan(position?.path) + colon + chalk_1.default.yellow(String(position?.line)) + colon + chalk_1.default.yellow(String(position?.column)) + newline +
            chalk_1.default.white.bgRed(highlight);
    }
    ;
    let Parts;
    (function (Parts) {
        class PartError extends MainError {
            constructor(message, position, contents) {
                super(chalk_1.default.red.bold('A parsing error has occurred') + exclamation + newline +
                    message + newline +
                    highlight(position, contents));
            }
            ;
        }
        Parts.PartError = PartError;
        ;
        class Unknown extends PartError {
            constructor(contents, position) {
                super(chalk_1.default.red('Unknown token detected') + colon, position, contents);
            }
            ;
        }
        Parts.Unknown = Unknown;
        ;
    })(Parts = Errors.Parts || (Errors.Parts = {}));
    ;
    let Syntax;
    (function (Syntax) {
        class SyntaxError extends MainError {
            constructor(message, position, contents) {
                super(chalk_1.default.red.bold('A syntax error has occurred') + exclamation + newline, message + newline +
                    highlight(position, contents));
            }
            ;
        }
        Syntax.SyntaxError = SyntaxError;
        ;
        class Generic extends SyntaxError {
            constructor(contents, position) {
                super(chalk_1.default.red('Syntax is invalid') + colon, position, contents);
            }
            ;
        }
        Syntax.Generic = Generic;
        ;
        class Duplicate extends SyntaxError {
            constructor(contents, position) {
                super(chalk_1.default.red(`Duplicate entries for ${contents}`) + colon, position, contents);
            }
            ;
        }
        Syntax.Duplicate = Duplicate;
        ;
    })(Syntax = Errors.Syntax || (Errors.Syntax = {}));
    ;
    let Command;
    (function (Command) {
        class CommandError extends MainError {
            constructor(message) {
                super(chalk_1.default.red.bold('A command error has occurred') + exclamation + newline +
                    message);
            }
            ;
        }
        Command.CommandError = CommandError;
        ;
        let Missing;
        (function (Missing) {
            class Parameters extends CommandError {
                constructor(parameters) {
                    super(chalk_1.default.red('Missing parameters') + colon + newline +
                        parameters.join(', '));
                }
                ;
            }
            Missing.Parameters = Parameters;
            ;
        })(Missing = Command.Missing || (Command.Missing = {}));
        ;
        let Conflicting;
        (function (Conflicting) {
            class Parameters extends CommandError {
                constructor(parameters) {
                    super(chalk_1.default.red('Conflicting parameters found') + colon + newline +
                        parameters.join(', '));
                }
                ;
            }
            Conflicting.Parameters = Parameters;
            ;
        })(Conflicting = Command.Conflicting || (Command.Conflicting = {}));
        ;
    })(Command = Errors.Command || (Errors.Command = {}));
    ;
})(Errors || (exports.Errors = Errors = {}));
;
