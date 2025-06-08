"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Syntax = void 0;
const error_1 = require("~/error");
const official_1 = require("~/official");
var Syntax;
(function (Syntax) {
    /**
     * Converts an array of {@link Parts.Part} into an array of {@link SyntaxData}.
     *
     * @param parts The array of parts to convert.
     * @param scope The scope to use when creating features.
     * @param position The position to use when creating features.
     * @param _features The array of features to use when creating features. Defaults to {@link official}.
     * @param path The path of the file being converted. Used for error reporting.
     * @returns An array of {@link SyntaxData} representing the features found in the parts.
     */
    function toFeatures(parts, scope, position, _features = official_1.official, path) {
        const features = _features.map((v) => {
            return new v();
        });
        const syntax = [];
        const contents = position.content || '';
        let done = false;
        let foundMatch = false;
        while (!done) {
            if (parts.length == 0) {
                done = true;
                continue;
            }
            ;
            let i = 0;
            for (const feature of features) {
                const match = feature.match(parts);
                if (match) {
                    const data = feature.create?.(match.exports, scope, position);
                    syntax.push({ export: data.export, scope: data.scope, feature: feature });
                    parts = parts.slice(match.length);
                    foundMatch = true;
                    break;
                }
                ;
                i++;
            }
            ;
            if (!foundMatch) {
                throw new error_1.Errors.Syntax.Generic(contents, position);
            }
            ;
            foundMatch = false;
        }
        ;
        return syntax;
    }
    Syntax.toFeatures = toFeatures;
    ;
})(Syntax || (exports.Syntax = Syntax = {}));
;
