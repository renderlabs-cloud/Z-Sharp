"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z = void 0;
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const feature_1 = require("~/feature");
const assembler_1 = require("~/assembler");
const spinner_1 = require("~/cli/spinner");
const official_1 = require("~/official");
var Z;
(function (Z) {
    function spin(spinner) {
        spinner.start();
    }
    Z.spin = spin;
    ;
    function toAssembly(content, importer, path) {
        let spinners = Array.from({ length: 10 }, () => {
            const spinner = new spinner_1.Spinner({ text: '', style: spinner_1.SpinnerTypes['compile'] });
            return spinner;
        });
        spinners[0].options.text = 'Parsing';
        spinners[0].start();
        const parts = parts_1.Parts.toParts(content, path);
        spinners[0].success();
        spinners[1].options.text = 'Applying syntax';
        spinners[1].start();
        const scope = new feature_1.Feature.Scope(importer);
        const syntax = syntax_1.Syntax.toFeatures(parts, scope, official_1.official, content, path);
        spinners[1].success();
        spinners[2].options.text = 'Compiling to assembly';
        spinners[2].start();
        const assembly = assembler_1.Assembler.assemble(syntax);
        spinners[2].success();
        console.log(assembly);
        return ""; // REPLACE!
    }
    Z.toAssembly = toAssembly;
    ;
})(Z || (exports.Z = Z = {}));
;
