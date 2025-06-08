"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parts = void 0;
const error_1 = require("~/error");
var Parts;
(function (Parts) {
    let PartType;
    (function (PartType) {
        PartType["SINGLE_LINE_COMMENT"] = "/\\/\\/.*/g";
        PartType["MULTI_LINE_COMMENT"] = "/\\/\\*[\\s\\S]*?\\*\\//gs";
        PartType["MULTI_LINE_DEF_COMMENT"] = "/\\/\\*\\*[\\s\\S]*?\\*\\//gs";
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
        PartType["QUESTION"] = "/\\?/g";
        PartType["SEMICOLON"] = "/\\;/g";
        PartType["EQUALS"] = "/\\=/g";
        PartType["EXTRA_WHITESPACE"] = "/\\s+/g";
        PartType["UNKNOWN"] = "/\\0/g";
    })(PartType = Parts.PartType || (Parts.PartType = {}));
    ;
    /**
     * Given a string in the form of "/pattern/modifiers", parse and
     * return a RegExp object.
     *
     * @param {string} str - The string to parse
     * @returns {RegExp} The parsed RegExp object
     */
    function parseRegex(str) {
        const match = str.match(/^\/(.*)\/([a-z]*)$/i);
        if (!match)
            return PartType.UNKNOWN;
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
    }
    Parts.parseRegex = parseRegex;
    ;
    /**
     * Parses the given content string into an array of parts, identifying and
     * categorizing each part according to its type. The parts are determined
     * based on predefined regular expressions for various token types such
     * as comments, strings, numbers, etc.
     *
     * @param {string} content - The content to be parsed into parts.
     * @param {string} [path] - An optional path indicating the source of the content.
     * @returns {Array<Part>} An array of parsed parts, each containing the
     * content, type, and position information.
     * @throws {Errors.Parts.Unknown} Throws an error if an unknown token is detected.
     */
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
                    if (partType == PartType.EXTRA_WHITESPACE || partType == PartType.SINGLE_LINE_COMMENT || partType == PartType.MULTI_LINE_COMMENT) {
                        content = content.slice(match[0].length).trim();
                        if (content == '' || match[0] == content) {
                            done = true;
                        }
                        ;
                        break;
                    }
                    ;
                    position.line = origin.indexOf(content.split('\n')[0]) + 1;
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
