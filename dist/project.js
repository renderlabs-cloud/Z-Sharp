"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const toml_1 = __importDefault(require("toml"));
const zod_1 = __importDefault(require("zod"));
const error_1 = require("~/error");
const util_1 = require("~/util");
var Project;
(function (Project) {
    const name = zod_1.default.union([
        zod_1.default.string(),
        zod_1.default.array(zod_1.default.string()).min(1).max(3),
    ]);
    Project.ConfigurationSchema = zod_1.default.object({
        'Project': zod_1.default.optional(zod_1.default.object({
            'name': zod_1.default.optional(zod_1.default.string()),
            'version': zod_1.default.optional(zod_1.default.tuple([
                zod_1.default.number().int(),
                zod_1.default.number().int(),
                zod_1.default.number().int()
            ])),
            'description': zod_1.default.optional(zod_1.default.string()),
            'Author': zod_1.default.object({
                'name': name
            }).strict(),
            'Contributors': zod_1.default.object({
                'names': zod_1.default.array(name).min(1)
            }),
            'repository': zod_1.default.optional(zod_1.default.string()),
            'license': zod_1.default.optional(zod_1.default.string()).default('MIT'),
        }).strict()),
        'Mods': zod_1.default.optional(zod_1.default.array(zod_1.default.object({
            source: zod_1.default.string(),
            config: zod_1.default.optional(zod_1.default.string())
        }).strict()))
    }).strict();
    /**
     * Convert a Zod error into a {@link Errors.Project.Invalid} error.
     *
     * @param err - the Zod error to convert
     * @returns the converted error
     */
    function error(err) {
        return new error_1.Errors.Project.Invalid(`${err.errors.map(err => err.message).join(',\n')}`);
    }
    Project.error = error;
    ;
    /**
     * Validate a project configuration object.
     *
     * @param data - the object to validate
     * @returns a validated project configuration object
     * @throws {Project.Invalid} if the object is invalid
     */
    function validate(data) {
        try {
            return Project.ConfigurationSchema.parse(data) || {};
        }
        catch (_err) {
            const err = _err;
            util_1.Util.error(Project.error(err));
        }
        ;
        return {}; // This should never happen
    }
    Project.validate = validate;
    ;
    /**
     * Creates a project configuration by validating the provided data.
     * @param data The data to be validated and used for creating the project configuration.
     * @returns The validated project configuration.
     */
    function create(data) {
        return Project.validate(data);
    }
    Project.create = create;
    ;
    /**
     * Attempts to read the nearest .zsharp.toml file, which stores the project's configuration.
     * @param path The path to start searching from.
     * @returns The parsed project configuration, or an empty object if none could be found.
     */
    function get(path) {
        try {
            const data = toml_1.default.parse(fs_1.default.readFileSync(path_1.default.resolve(path + '/.zsharp.toml')).toString());
            const config = Project.create(data);
            return config;
        }
        catch (err) {
            if (path == path_1.default.resolve(path)) {
                return {};
            }
            ;
            return Project.get(path_1.default.resolve(path + '/../'));
        }
        ;
    }
    Project.get = get;
    ;
})(Project || (exports.Project = Project = {}));
;
