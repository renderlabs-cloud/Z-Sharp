"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
class Identifier extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'repeat': [
                    { 'part': { 'type': parts_1.Parts.PartType.PERIOD } },
                    { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'property' },
                ], 'export': 'location' }
        ]);
    }
    ;
    create(data, scope, position) {
        return { scope, export: {
                location: data.location?.join('.')
            } };
    }
    ;
}
exports.Identifier = Identifier;
;
