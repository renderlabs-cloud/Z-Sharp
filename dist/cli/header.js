"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zHeader = void 0;
exports.hyperlink = hyperlink;
const chalk_1 = require("@mnrendra/chalk");
function hyperlink(text, url, attrs) {
    return `\u001b]8;${attrs || ''};${url || text}\u0007${text}\u001b]8;;\u0007`;
}
;
exports.zHeader = chalk_1.chalk.white(':===: ' + chalk_1.chalk.red('Z#') + ' :===:' + '\n\n' +
    chalk_1.chalk.blue(hyperlink('Documentation', 'https://z.labz.online')) + '\n\n');
