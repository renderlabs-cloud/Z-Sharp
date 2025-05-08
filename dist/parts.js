"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parts = void 0;
var Parts;
(function (Parts) {
    let PartType;
    (function (PartType) {
        PartType["WORD"] = "/([a-z,A-Z,$][a-z,A-Z,0-9]*)/g";
        PartType["NUMBER"] = "/([0-9]*)/g";
        PartType["DOUBLE_QUOTE_STRING"] = "/\\\"(.*)\\\"/g";
        PartType["SINGLE_QUOTE_STRING"] = "/\\'(.*)\\'/g";
        PartType["BACKTICK_QUOTE_STRING"] = "/\\`([^\\0]+)\\`/g";
        PartType["BACKTICK_INTERPOLATION"] = "/\\$\\{[^\\0]+\\}/g";
        PartType["PARENTHESIS_OPEN"] = "/\\(/";
        PartType["PARENTHESIS_CLOSE"] = "/\\)/";
        PartType["SQUARE_BRACKET_OPEN"] = "/\\[/";
        PartType["SQUARE_BRACKET_CLOSE"] = "/\\]/";
        PartType["CURLY_BRACKET_OPEN"] = "/\\{/";
        PartType["CURLY_BRACKET_CLOSE"] = "/\\}/";
        PartType["COLON"] = "/\\:/g";
        PartType["SEMICOLON"] = "/\\;/g";
        PartType["EQUALS"] = "/\\=/";
        PartType["UNKNOWN"] = "/\\0/";
    })(PartType = Parts.PartType || (Parts.PartType = {}));
    ;
    function parseRegex(str) {
        const match = str.match(/^\/(.*)\/([a-z]*)$/i);
        if (!match)
            throw new Error("Invalid regex string");
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
    }
    Parts.parseRegex = parseRegex;
    ;
    function toParts(content) {
        const parts = [];
        let done = false;
        while (!done) {
            for (const partType of Object.values(PartType)) {
                if (partType == PartType.UNKNOWN) {
                    // Throw error
                }
                ;
                const match = content.match(parseRegex(partType));
                if (!match)
                    continue;
                if (content.indexOf(match[0]) == 0) {
                    content = content.slice(match[0].length).trim();
                    console.log(content);
                    if (content == '' || match[0] == content) {
                        done = true;
                        break;
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    }
    Parts.toParts = toParts;
    ;
})(Parts || (exports.Parts = Parts = {}));
;
