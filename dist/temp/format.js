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
    let section;
    (function (section) {
        function start(header) {
            return `
.section ${header.type}
${header.label ? `
#pragma section ${header.label}` : ''}
`;
        }
        section.start = start;
        ;
        function end() {
            return `
#pragma section end
`;
        }
        section.end = end;
        ;
    })(section = Format.section || (Format.section = {}));
    ;
})(Format || (exports.Format = Format = {}));
;
