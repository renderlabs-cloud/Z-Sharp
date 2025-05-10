"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Syntax = void 0;
const official_1 = require("~/official");
var Syntax;
(function (Syntax) {
    function toFeatures(parts, scope, _features = official_1.official) {
        const features = _features.map((v) => {
            return new v();
        });
    }
    Syntax.toFeatures = toFeatures;
    ;
})(Syntax || (exports.Syntax = Syntax = {}));
;
