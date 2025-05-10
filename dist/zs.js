"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z = void 0;
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const feature_1 = require("~/feature");
const spinner_1 = require("~/cli/spinner");
var Z;
(function (Z) {
    function toAssembly(content, importer, path) {
        let spinners = Array.from({ length: 10 }, () => {
            const spinner = new spinner_1.Spinner({ text: '', style: spinner_1.SpinnerTypes['compile'] });
            return spinner;
        });
        spinners[0].options.text = 'Parting';
        spinners[0].start();
        const parts = parts_1.Parts.toParts(content, path);
        spinners[0].success();
        spinners[1].options.text = 'Applying syntax';
        spinners[1].start();
        const parsed = syntax_1.Syntax.toFeatures(parts, new feature_1.Feature.Scope(importer));
        spinners[1].success();
        spinners[2].options.text = 'Compiling to assembly';
        spinners[2].start();
        return ""; // REPLACE!
    }
    Z.toAssembly = toAssembly;
    ;
})(Z || (exports.Z = Z = {}));
;
