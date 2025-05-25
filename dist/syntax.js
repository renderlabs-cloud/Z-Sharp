"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Syntax = void 0;
const error_1 = require("~/error");
const official_1 = require("~/official");
var Syntax;
(function (Syntax) {
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
            for (const feature of features) {
                const match = feature.match(parts);
                if (match) {
                    const data = feature.create(match.exports, scope, position);
                    syntax.push({ exports: data.exports, scope: data.scope, feature: feature });
                    parts = parts.slice(match.length);
                    foundMatch = true;
                    break;
                }
                ;
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
