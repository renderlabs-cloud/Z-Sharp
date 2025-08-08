"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parts = void 0;
const error_1 = require("~/error");
const util_1 = require("~/util");
var Parts;
(function (Parts) {
    let PartType;
    (function (PartType) {
        PartType["SINGLE_LINE_COMMENT"] = "/\\/\\/[^\\n]*/g";
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
        PartType["UNKNOWN"] = "/^\0/g";
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
    // * O(n)
    function toParts(content, path) {
        const parts = [];
        const position = { path };
        const origin = content.split('\n');
        // Build master regex using PartType
        const patterns = Object.entries(PartType)
            // .filter(([key, value]) => key !== 'UNKNOWN') // skip UNKNOWN on purpose
            .map(([key, value]) => `(?<${key}>${value.slice(1, -2)})`); // Remove the leading and trailing "/" in regex string
        const masterRegex = new RegExp(patterns.join('|'), 'gs');
        let match;
        let prev;
        while ((match = masterRegex.exec(content)) !== null) {
            const groups = match.groups;
            const type = Object.keys(groups).find(k => groups[k] !== undefined);
            // Calculate line number
            const line = content.slice(0, match.index).split('\n').length;
            const column = match.index - (prev?.index ?? 0) - 1;
            position.line = line;
            position.column = column;
            if (!type || type === 'UNKNOWN') {
                util_1.Util.error(new error_1.Errors.Parts.Unknown(origin[line - 1], position));
            }
            ;
            if (type === 'EXTRA_WHITESPACE' ||
                type === 'SINGLE_LINE_COMMENT' ||
                type === 'MULTI_LINE_COMMENT') {
                continue; // skip this part
            }
            ;
            prev = match;
            parts.push({
                content: match[0],
                type: PartType[type],
                position
            });
        }
        ;
        return parts;
    }
    Parts.toParts = toParts;
    ;
})(Parts || (exports.Parts = Parts = {}));
;
