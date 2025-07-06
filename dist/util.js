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
const os_1 = __importDefault(require("os"));
const worker_threads_1 = require("worker_threads");
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
     * Replaces all instances of `~` in the given path with the actual home directory
     * as determined by the `os.homedir()` function.
     *
     * @param path The path to be modified.
     *
     * @returns The modified path.
     */
    function OSPath(path) {
        return path
            .replace(/~/g, os_1.default.homedir());
    }
    Util.OSPath = OSPath;
    ;
    /**
     * Replaces backslashes with forward slashes and all instances of `@` with
     * `~/.zsharp/modules/` in the given path.
     *
     * @param path The path to be modified.
     *
     * @returns The modified path.
     */
    function modPath(path) {
        return Util.OSPath(path
            .replace(/\\/g, '/')
            .replace(/\@/g, '~/.zsharp/modules/'));
    }
    Util.modPath = modPath;
    ;
    async function runInWorker(func, ...args) {
        return new Promise((resolve, reject) => {
            const worker = new worker_threads_1.Worker((() => {
                const { parentPort } = require('worker_threads');
                parentPort?.postMessage(func());
            }).toString(), {
                eval: true
            });
            worker.on('error', reject);
            worker.on('message', (result) => {
                resolve(result);
            });
        });
    }
    Util.runInWorker = runInWorker;
    ;
    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    Util.sleep = sleep;
    ;
    /**
     * Exits the process cleanly.
     *
     * This function is intended to be attached to process events like `SIGINT` and `SIGTERM`.
     */
    function terminate() {
        Util.log('Exiting...');
        process.exit(0);
    }
    Util.terminate = terminate;
    ;
    /**
     * Logs the error message, stack trace, and failure details, then exits the process.
     *
     * @param err An instance of `Errors.MainError` containing the error details to be logged.
     */
    function error(err, codeError = true) {
        console.log('\n', err.message);
        if (codeError) {
            console.log(header_1.Header.failure({
                errors: err.count || 1
            }));
        }
        ;
        process.exit(1);
    }
    Util.error = error;
    ;
    /**
     * Logs debug information for the provided arguments, including a stack trace.
     *
     * @param args A list of arguments to be logged as debug information.
     */
    function debug(...args) {
        for (const arg of args) {
            console.log('\n', `[${ct.magenta('DEBUG')}:${new Error().stack?.split('\n')[2].replace('\t', '')}]: ${node_util_1.default.inspect(arg, { colors: true, depth: Infinity })}`);
        }
        ;
    }
    Util.debug = debug;
    ;
    function debugScope(scope) {
        Util.debug(scope._data);
    }
    Util.debugScope = debugScope;
    ;
    /**
     * Logs the provided arguments.
     *
     * @param args A list of arguments to be logged.
     */
    function log(...args) {
        console.log('\n', ...args);
    }
    Util.log = log;
    ;
})(Util || (exports.Util = Util = {}));
;
