"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = exports.SpinnerTypes = void 0;
const chalk_1 = require("@mnrendra/chalk");
exports.SpinnerTypes = {
    'compile': {
        frames: new Proxy(['', '', '', '', '', '', '', ''], {
            get(target, prop) {
                const i = Number(prop);
                const animation = [' == ', '  ==', '   =', '  ==', ' == ', '==  ', '=   ', '==  '];
                return chalk_1.chalk.white(`[${chalk_1.chalk.blue(animation[i])}]`);
            }
        }),
        success: chalk_1.chalk.white(`[ ${chalk_1.chalk.green('OK')} ]`),
        fail: chalk_1.chalk.white(`[ ${chalk_1.chalk.red('ER')} ]`),
        warning: chalk_1.chalk.white(`[ ${chalk_1.chalk.yellow('WN')} ]`),
        framecount: 8
    }
};
class Spinner {
    options;
    constructor(options) {
        this.options = options;
    }
    ;
    start() {
        let i = 0;
        this.interval = setInterval(() => {
            process.stdout.clearLine(0);
            process.stdout.write(this.options.style.frames[i++] + ' ' + this.options.text);
            process.stdout.cursorTo(0);
            i = i % this.options.style.framecount;
        }, 1000 / (this.options.framerate || 2));
    }
    ;
    success() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.success + ' ' + this.options.text + '\n');
    }
    ;
    warning() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.warning + ' ' + this.options.text + '\n');
    }
    ;
    fail() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.fail + ' ' + this.options.text + '\n');
    }
    ;
    interval;
}
exports.Spinner = Spinner;
;
