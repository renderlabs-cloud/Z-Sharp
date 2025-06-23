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
exports.Module = void 0;
const zod_1 = __importDefault(require("zod"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const toml_1 = __importDefault(require("toml"));
const _ = __importStar(require("@zsharp/module"));
const util_1 = require("~/util");
const error_1 = require("~/error");
const project_1 = require("~/project");
var Module;
(function (Module) {
    Module.ConfigurationSchema = zod_1.default.object({
        name: zod_1.default.string(),
        description: zod_1.default.string().optional(),
        version: zod_1.default.tuple([zod_1.default.number().int(), zod_1.default.number().int(), zod_1.default.number().int()]),
        source: zod_1.default.string(),
        configuration: zod_1.default.string().optional(),
    }).strict();
    /**
     * Reads and parses a module configuration file from the specified path.
     *
     * @param path - The path to the module configuration file.
     * @returns The parsed module configuration.
     * @throws {Errors.Project.Invalid} If the file content is invalid.
     */
    function get(_path, projectPath) {
        _path = util_1.Util.modPath(_path);
        try {
            const data = toml_1.default.parse(fs_1.default.readFileSync(_path).toString());
            const configuration = Module.ConfigurationSchema.parse(data);
            const modPath = _path.slice(0, _path.lastIndexOf('/'));
            try {
                const evaluated = require(path_1.default.join(modPath, configuration.source)).default(configuration.configuration
                    ? toml_1.default.parse(fs_1.default.readFileSync(path_1.default.resolve(projectPath, configuration.configuration)).toString())
                    : '');
                const module = _.Module.ModuleDataSchema.parse(evaluated);
                return module;
            }
            catch (err) {
                if (err instanceof zod_1.default.ZodError) {
                    util_1.Util.error(project_1.Project.error(err));
                }
                else {
                    util_1.Util.error(new error_1.Errors.Project.Invalid(err.message));
                }
                ;
            }
            finally {
                return null;
            }
            ;
        }
        catch (err) {
            if (err instanceof zod_1.default.ZodError) {
                util_1.Util.error(project_1.Project.error(err));
            }
            else {
                util_1.Util.error(new error_1.Errors.Project.Invalid(err.message));
            }
            ;
        }
        ;
    }
    Module.get = get;
    ;
})(Module || (exports.Module = Module = {}));
;
