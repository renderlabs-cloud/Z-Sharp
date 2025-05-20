"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semicolon = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
class Semicolon extends feature_1.Feature.Feature {
    constructor() {
        super([
            { part: { type: parts_1.Parts.PartType.SEMICOLON } }
        ]);
    }
    ;
}
exports.Semicolon = Semicolon;
;
