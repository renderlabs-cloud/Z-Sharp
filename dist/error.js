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
exports.Errors = void 0;
const ct = __importStar(require("colorette"));
const header_1 = require("~/cli/header");
var Errors;
(function (Errors) {
    const colon = ct.reset(':');
    const exclamation = ct.reset('!');
    const dash = ct.reset('-');
    const newline = ct.reset('\n');
    class MainError {
        message;
        stack;
        /**
         * @param message the error message
         * @param stack the optional stack trace
         */
        constructor(message, stack) {
            this.message = message;
            this.stack = stack;
            this.message = (0, header_1.format)(this.message);
        }
        ;
        count = 0;
    }
    Errors.MainError = MainError;
    ;
    /**
     * Formats a position and a highlight string to be printed to the console.
     * @param position the position to be formatted
     * @param highlight the highlight string to be formatted
     * @returns a formatted string
     */
    function highlight(position, highlight) {
        return ct.cyan(position?.path || '') + colon + ct.yellow(String(position?.line)) + colon + ct.yellow(String(position?.column)) + newline +
            ct.red(highlight);
    }
    ;
    let Parts;
    (function (Parts) {
        class PartError extends MainError {
            constructor(message, position, contents) {
                super(ct.red(ct.bold('A parsing error has occurred')) + exclamation + newline +
                    message + newline +
                    highlight(position, contents));
            }
            ;
        }
        Parts.PartError = PartError;
        ;
        class Unknown extends PartError {
            constructor(contents, position) {
                super(ct.red('Unknown token detected') + colon, position, contents);
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
                super(ct.red(ct.bold('A syntax error has occurred')) + exclamation + newline +
                    message + newline +
                    highlight(position, contents));
            }
            ;
        }
        Syntax.SyntaxError = SyntaxError;
        ;
        class Generic extends SyntaxError {
            constructor(contents, position) {
                super(ct.red('Syntax is invalid') + colon, position, contents);
            }
            ;
        }
        Syntax.Generic = Generic;
        ;
        class Duplicate extends SyntaxError {
            constructor(contents, position) {
                super(ct.red(`Duplicate entries for ${contents}`) + colon, position, contents);
            }
            ;
        }
        Syntax.Duplicate = Duplicate;
        ;
    })(Syntax = Errors.Syntax || (Errors.Syntax = {}));
    ;
    let Reference;
    (function (Reference) {
        class ReferenceError extends MainError {
            constructor(message, contents, position) {
                super(ct.red(ct.bold('A reference error has occured')) + exclamation + newline +
                    message + '\n' +
                    highlight(position, contents));
            }
            ;
        }
        Reference.ReferenceError = ReferenceError;
        ;
        class Undefined extends ReferenceError {
            constructor(reference, position) {
                super(ct.red('Undefined reference') + colon + newline +
                    reference + newline, reference, position);
            }
            ;
        }
        Reference.Undefined = Undefined;
        ;
    })(Reference = Errors.Reference || (Errors.Reference = {}));
    ;
    let Project;
    (function (Project) {
        class ProjectError extends MainError {
            constructor(message) {
                super(ct.red(ct.bold('A project error has occurred')) + exclamation + newline +
                    message);
                console.log(this.message);
                process.exit(1);
            }
            ;
        }
        Project.ProjectError = ProjectError;
        ;
        class Invalid extends ProjectError {
            constructor(message) {
                super(ct.red('Invalid project configuration') + colon + newline +
                    message);
            }
            ;
        }
        Project.Invalid = Invalid;
    })(Project = Errors.Project || (Errors.Project = {}));
    ;
    let Command;
    (function (Command) {
        class CommandError extends MainError {
            constructor(message) {
                super(ct.red(ct.bold('A command error has occurred')) + exclamation + newline +
                    message);
                console.log(this.message);
                process.exit(1);
            }
            ;
        }
        Command.CommandError = CommandError;
        ;
        let Missing;
        (function (Missing) {
            class Parameters extends CommandError {
                constructor(parameters) {
                    super(ct.red('Missing parameters') + colon + newline +
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
                    super(ct.red('Conflicting parameters found') + colon + newline +
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
