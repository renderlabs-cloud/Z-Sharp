"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
var Format;
(function (Format) {
    function comment(content) {
        return content.join('\n * ');
    }
    Format.comment = comment;
    ;
    function section(header) {
        return `
.section ${header.type}
${header.label ? `
#pragma section ${header.label}
` : ''}
		`;
    }
    Format.section = section;
    ;
    // Add compiler readable comments
})(Format || (exports.Format = Format = {}));
;
