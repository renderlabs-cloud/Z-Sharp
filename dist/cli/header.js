"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zs = exports.header = void 0;
exports.hyperlink = hyperlink;
exports.success = success;
exports.failure = failure;
const chalk_1 = require("@mnrendra/chalk");
function hyperlink(text, url, attrs) {
    return `\u001b]8;${attrs || ''};${url || text}\u0007${text}\u001b]8;;\u0007`;
}
;
exports.header = chalk_1.chalk.white(':===: ' + chalk_1.chalk.red('Z#') + ' :===:' + '\n\n' +
    chalk_1.chalk.blue(hyperlink('Documentation', 'https://docs.zsharp.dev')) + '\n');
exports.zs = chalk_1.chalk.red('Z#');
function success(data) {
    return chalk_1.chalk.white('\n' +
        `Code compilation ${chalk_1.chalk.green('succeeded')} in ${chalk_1.chalk.green(data.time)}ms with ${((data.vulnerabilities == 0) ? chalk_1.chalk.green('0') : ((data.vulnerabilities < 5) ? chalk_1.chalk.yellow(data.vulnerabilities) : chalk_1.chalk.red(data.vulnerabilities)))} known vulnerabilities.`);
}
;
function failure(data) {
    return chalk_1.chalk.white('\n' +
        `Code compilation ${chalk_1.chalk.red('failed')} with ${chalk_1.chalk.red(data.errors)} error(s).`);
}
;
