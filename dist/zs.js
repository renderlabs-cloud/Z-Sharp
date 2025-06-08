"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z = void 0;
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const feature_1 = require("~/feature");
const assembler_1 = require("~/assembler");
const emit_1 = require("~/emit");
const spinner_1 = require("~/cli/spinner");
const header_1 = require("~/cli/header");
const util_1 = require("~/util");
var Z;
(function (Z) {
    /**
     * Starts the provided spinner.
     *
     * @param spinner The spinner instance to start.
     */
    function spin(spinner) {
        spinner.start();
    }
    Z.spin = spin;
    ;
    /**
     * Compiles Z# code to assembly.
     * @param content the content of the Z# file to compile
     * @param importer the importer object, used to import Z# modules
     * @param path the path of the Z# file to compile, if any
     * @returns the compiled assembly code
     */
    /**
     * Compiles Z# code to assembly.
     *
     * @param content the content of the Z# file to compile
     * @param importer the importer object, used to import Z# modules
     * @param path the path of the Z# file to compile, if any
     * @returns the compiled assembly code
     */
    function toAssembly(content, importer, path) {
        const start = Date.now();
        let spinners = [];
        let assembly = '';
        if (importer.cli) {
            console.log(header_1.header);
            spinners = Array.from({ length: 10 }, () => {
                const spinner = new spinner_1.Spinner({ text: '', style: spinner_1.SpinnerTypes['compile'] });
                return spinner;
            });
            spinners[0].options.text = 'Parsing';
            spinners[1].options.text = 'Applying syntax';
            spinners[2].options.text = 'Compiling to assembly';
            spinners[0].start();
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
            const basePosition = {
                content,
            };
            const syntax = syntax_1.Syntax.toFeatures(parts, scope, basePosition, undefined, path);
            if (importer.cli) {
                spinners[1].success();
                spinners[2].start();
            }
            ;
            assembly = assembler_1.Assembler.assemble(syntax, scope, true);
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
            util_1.Util.error(_err);
        }
        ;
        return assembly;
    }
    Z.toAssembly = toAssembly;
    ;
    /**
     * Emit the given Z# assembly into a binary file.
     *
     * @param content The Z# assembly source code.
     * @param output The output file path.
     *
     * @returns The compiled binary data.
     */
    async function emit(content, output) {
        const compiled = await emit_1.Emit.compileAssemblyToBinary(content, output);
        return compiled;
    }
    Z.emit = emit;
    ;
})(Z || (exports.Z = Z = {}));
;
