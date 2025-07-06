"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z = void 0;
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const feature_1 = require("~/feature");
const assembler_1 = require("~/assembler");
const emit_1 = require("~/emit");
const header_1 = require("~/cli/header");
const official_1 = require("~/official");
const module_1 = require("~/module");
const builtin_1 = require("~/builtin");
const util_1 = require("~/util");
const ora_1 = __importDefault(require("ora"));
const syncing_1 = require("syncing");
const ct = __importStar(require("colorette"));
var Z;
(function (Z) {
    /**
     * Compiles Z# code to assembly.
     *
     * @param content the content of the Z# file to compile
     * @param importer the importer object, used to import Z# modules
     * @param path the path of the Z# file to compile, if any
     * @returns the compiled Z# intermediate assembly
     */
    async function toIZ(content, importer, config, path) {
        const start = Date.now();
        let assembly = '';
        let spinner = null;
        let message = '';
        let features = official_1.official;
        for (const mod of config.Mods || []) {
            features.push(...(module_1.Module.get(mod.source, importer.base)?.implements?.features || []));
        }
        ;
        if (importer.cli) {
            message = path ? `Compiling ${path}` : 'Compiling';
            spinner = (0, ora_1.default)({
                text: message,
                color: 'blue',
                spinner: 'dots',
            });
            spinner.start();
        }
        ;
        try {
            let scope = new feature_1.Feature.Scope(importer, 'main');
            scope = builtin_1.BuiltIn.inject(scope);
            const basePosition = {
                content,
            };
            const compilation = new Promise(async (resolve, reject) => {
                const parts = parts_1.Parts.toParts(content, path);
                const syntax = syntax_1.Syntax.toFeatures(parts, scope, basePosition, features, path);
                assembly = await assembler_1.Assembler.assemble(syntax, scope, config);
                resolve(assembly);
            });
            assembly = await new syncing_1.Sync(compilation).get();
            if (importer.cli) {
                const end = Date.now();
                spinner?.stopAndPersist({
                    text: message + ' - ' + header_1.Header.time(end - start),
                    symbol: ct.green('⠿')
                });
                util_1.Util.log(header_1.Header.success({
                    vulnerabilities: 0, // add later
                    time: end - start
                }));
            }
            ;
            return assembly;
        }
        catch (_err) {
            if (importer.cli) {
                spinner?.stopAndPersist({
                    text: message,
                    symbol: ct.red('⠿')
                });
            }
            ;
            util_1.Util.error(_err, false);
        }
        ;
    }
    Z.toIZ = toIZ;
    ;
    /**
     * Emit the given Z# intermediate assembly into a binary file.
     *
     * @param content The Z# intermediate assembly source code.
     * @param output The output file path.
     *
     * @returns The compiled binary data.
     */
    async function emit(content) {
        const compiled = await emit_1.Emit.compileIZToELF(content);
        return compiled;
    }
    Z.emit = emit;
    ;
})(Z || (exports.Z = Z = {}));
;
