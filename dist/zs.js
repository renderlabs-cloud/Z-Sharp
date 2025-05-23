"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z = void 0;
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const feature_1 = require("~/feature");
const assembler_1 = require("~/assembler");
const spinner_1 = require("~/cli/spinner");
const header_1 = require("~/cli/header");
const official_1 = require("~/official");
var Z;
(function (Z) {
    function spin(spinner) {
        spinner.start();
    }
    Z.spin = spin;
    ;
    function toAssembly(content, importer, path) {
        const start = Date.now();
        let spinners = [];
        let assembly = '';
        if (importer.cli) {
            spinners = Array.from({ length: 10 }, () => {
                const spinner = new spinner_1.Spinner({ text: '', style: spinner_1.SpinnerTypes['compile'] });
                return spinner;
            });
            spinners[0].options.text = 'Parsing';
            spinners[1].options.text = 'Applying syntax';
            spinners[2].options.text = 'Compiling to assembly';
            spinners[0].start();
            console.log(header_1.header);
        }
        ;
        try {
            const parts = parts_1.Parts.toParts(content, path);
            if (importer.cli) {
                spinners[0].success();
                spinners[1].start();
            }
            ;
            const scope = new feature_1.Feature.Scope(importer, 'main');
            const syntax = syntax_1.Syntax.toFeatures(parts, scope, official_1.official, content, path);
            if (importer.cli) {
                spinners[1].success();
                spinners[2].start();
            }
            ;
            assembly = assembler_1.Assembler.assemble(syntax);
            if (importer.cli) {
                spinners[2].success();
            }
            ;
            if (importer.cli) {
                const end = Date.now();
                console.log((0, header_1.success)({
                    vulnerabilities: 0, // add later
                    time: end - start
                }));
            }
            ;
        }
        catch (_err) {
            let err = _err;
            console.log(err.message);
            console.log((0, header_1.failure)({
                errors: err.count || 1
            }));
            process.exit(1);
        }
        ;
        return assembly;
    }
    Z.toAssembly = toAssembly;
    ;
})(Z || (exports.Z = Z = {}));
;
