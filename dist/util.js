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
exports.Util = void 0;
const node_util_1 = __importDefault(require("node:util"));
const ct = __importStar(require("colorette"));
const header_1 = require("~/cli/header");
var Util;
(function (Util) {
    /**
     * Trim an object down to a certain depth by recursively replacing children with `null` once a certain depth is reached.
     *
     * @param obj The object to trim.
     * @param maxDepth The maximum depth to trim to.
     * @param currentDepth The current depth of the object. Defaults to 0.
     *
     * @returns The trimmed object, or `null` if the object is too deep.
     */
    function trimDepth(obj, maxDepth, currentDepth = 0) {
        if (currentDepth >= maxDepth || obj === null || typeof obj !== 'object') {
            return null;
        }
        ;
        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const trimmed = trimDepth(obj[key], maxDepth, currentDepth + 1);
                if (trimmed !== null) {
                    result[key] = trimmed;
                }
                ;
            }
            ;
        }
        ;
        return result;
    }
    Util.trimDepth = trimDepth;
    ;
    /**
     * Logs the error message, stack trace, and failure details, then exits the process.
     *
     * @param err An instance of `Errors.MainError` containing the error details to be logged.
     */
    function error(err) {
        console.log(err.message, err.stack);
        console.log((0, header_1.failure)({
            errors: err.count || 1
        }));
        console.debug(err.stack);
        process.exit(1);
    }
    Util.error = error;
    ;
    function debug(...args) {
        for (const arg of args) {
            console.log(`[${ct.magenta('DEBUG')}:${new Error().stack?.split('\n')[2].replace('\t', '')}]: ${node_util_1.default.inspect(arg, { colors: true, depth: Infinity })}`);
        }
        ;
    }
    Util.debug = debug;
    ;
})(Util || (exports.Util = Util = {}));
;
