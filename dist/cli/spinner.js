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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = exports.spinnerStyles = void 0;
const ct = __importStar(require("colorette"));
exports.spinnerStyles = {
    'compile': {
        frames: [' == ', '  ==', '   =', '  ==', ' == ', '==  ', '=   ', '==  '].map((v) => {
            return ct.white(`[${ct.blue(v)}]`);
        }),
        success: ct.white(`[ ${ct.green('OK')} ]`),
        fail: ct.white(`[ ${ct.red('ER')} ]`),
        warning: ct.white(`[ ${ct.yellow('WN')} ]`),
        framecount: 8,
    }
};
class Spinner {
    options;
    /**
     * Constructs a new Spinner instance with the provided options.
     *
     * @param options - The configuration options for the spinner, which include:
     *   - `text`: The text to display alongside the spinner frames.
     *   - `framerate`: (Optional) The speed of the spinner in frames per second.
     *   - `style`: The style configuration for the spinner, including frames and messages.
     */
    constructor(options) {
        this.options = options;
    }
    ;
    /**
     * Starts the spinner animation.
     *
     * This method sets up an interval to animate the spinner frames at the
     * configured framerate. The spinner is displayed on the current line, and
     * the display is updated every frame.
     */
    async start() {
        let i = 0;
        this.interval = setInterval(() => {
            process.stdout.clearLine(0);
            process.stdout.write(this.options.style.frames[i++] + ' ' + this.options.text);
            process.stdout.cursorTo(0);
            i = i % this.options.style.framecount;
        }, 1000 / (this.options.framerate || 2));
    }
    ;
    /**
     * Stops the spinner animation and writes a success message.
     *
     * This method clears the line where the spinner is displayed, and writes
     * the configured success message followed by a newline character.
     */
    success() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.success + ' ' + this.options.text + '\n');
    }
    ;
    /**
     * Stops the spinner animation and writes a warning message.
     *
     * This method clears the line where the spinner is displayed, and writes
     * the configured warning message followed by a newline character.
     */
    warning() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.warning + ' ' + this.options.text + '\n');
    }
    ;
    /**
     * Stops the spinner animation and writes a failure message.
     *
     * This method clears the line where the spinner is displayed, and writes
     * the configured failure message followed by a newline character.
     */
    fail() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.fail + ' ' + this.options.text + '\n');
    }
    ;
    interval;
}
exports.Spinner = Spinner;
;
