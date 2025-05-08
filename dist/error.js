"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorType = void 0;
const chalk_1 = __importDefault(require("@mnrendra/chalk"));
var ErrorType;
(function (ErrorType) {
    const Colon = chalk_1.default.white(':');
    const Exclamation = chalk_1.default.white('!');
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
    let Command;
    (function (Command) {
        class CommandError extends MainError {
            constructor(message) {
                super(chalk_1.default.red.bold('A command error has occurred') + Exclamation + '\n' +
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
                    super(chalk_1.default.red('Missing parameters') + Colon + '\n' +
                        '\t' + parameters.join(', '));
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
                    super(chalk_1.default.red('Conflicting parameters found') + Colon + '\n' +
                        '\t' + parameters.join(', '));
                }
                ;
            }
            Conflicting.Parameters = Parameters;
            ;
        })(Conflicting = Command.Conflicting || (Command.Conflicting = {}));
        ;
    })(Command = ErrorType.Command || (ErrorType.Command = {}));
    ;
})(ErrorType || (exports.ErrorType = ErrorType = {}));
;
