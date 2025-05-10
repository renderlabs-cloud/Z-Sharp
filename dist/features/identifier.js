"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
class Identifier extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'repeat': [
                    { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'property' },
                    { 'part': { 'type': parts_1.Parts.PartType.COLON } },
                    { 'feature': { 'type': Identifier }, 'export': 'type' },
                    { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
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
