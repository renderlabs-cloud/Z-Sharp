"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parts = void 0;
const error_1 = require("~/error");
var Parts;
(function (Parts) {
    let PartType;
    (function (PartType) {
        PartType["WORD"] = "/([a-zA-Z$_][a-zA-Z0-9$_]*)/g";
        PartType["NUMBER"] = "/([0-9][0-9]*)/g";
        PartType["DOUBLE_QUOTE_STRING"] = "/\\\"(.*)\\\"/g";
        PartType["SINGLE_QUOTE_STRING"] = "/\\'(.*)\\'/g";
        PartType["BACKTICK_QUOTE_STRING"] = "/\\`([^\\0]+)\\`/g";
        PartType["BACKTICK_INTERPOLATION"] = "/\\$\\{[^\\0]+\\}/g";
        PartType["PARENTHESIS_OPEN"] = "/\\(/g";
        PartType["PARENTHESIS_CLOSE"] = "/\\)/g";
        PartType["SQUARE_BRACKET_OPEN"] = "/\\[/g";
        PartType["SQUARE_BRACKET_CLOSE"] = "/\\]/g";
        PartType["CURLY_BRACKET_OPEN"] = "/\\{/g";
        PartType["CURLY_BRACKET_CLOSE"] = "/\\}/g";
        PartType["ANGLE_BRACKET_OPEN"] = "/\\</g";
        PartType["ANGLE_BRACKET_CLOSE"] = "/\\>/g";
        PartType["COLON"] = "/\\:/g";
        PartType["COMMA"] = "/\\,/g";
        PartType["PERIOD"] = "/\\./g";
        PartType["SEMICOLON"] = "/\\;/g";
        PartType["EQUALS"] = "/\\=/g";
        PartType["EXTRA_WHITESPACE"] = "/\\s+/g";
        PartType["UNKNOWN"] = "/\\0/g";
    })(PartType = Parts.PartType || (Parts.PartType = {}));
    ;
    function parseRegex(str) {
        const match = str.match(/^\/(.*)\/([a-z]*)$/i);
        if (!match)
            return PartType.UNKNOWN;
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
    }
    Parts.parseRegex = parseRegex;
    ;
    function toParts(content, path) {
        const parts = [];
        const position = {};
        const origin = content.split('\n');
        let done = false;
        position.path = path;
        while (!done) {
            for (const partType of Object.values(PartType)) {
                const match = content.match(parseRegex(partType));
                if (partType == PartType.UNKNOWN) {
                    throw new error_1.Errors.Parts.Unknown(content[0], position);
                }
                ;
                if (!match)
                    continue;
                if (content.indexOf(match[0]) == 0) {
                    if (partType == PartType.EXTRA_WHITESPACE) {
                        content = content.slice(match[0].length).trim();
                        break;
                    }
                    ;
                    position.line = origin.indexOf(content.split('\n')[0]) + 1 || position.line;
                    // position.column = origin[(position.line || 1) - 1].length;
                    parts.push({ content: match[0] || content, type: partType, position });
                    content = content.slice(match[0].length).trim();
                    if (content == '' || match[0] == content) {
                        done = true;
                    }
                    ;
                    break;
                }
                ;
            }
            ;
        }
        ;
        return parts;
    }
    Parts.toParts = toParts;
    ;
})(Parts || (exports.Parts = Parts = {}));
;
