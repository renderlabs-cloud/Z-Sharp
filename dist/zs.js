"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z = void 0;
const parts_1 = require("~/parts");
var Z;
(function (Z) {
    function toAssembly(content, importer) {
        const parts = parts_1.Parts.toParts(content);
        console.log(parts);
        return ""; // REPLACE!
    }
    Z.toAssembly = toAssembly;
    ;
})(Z || (exports.Z = Z = {}));
;
