"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
class Identifier extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'base' },
            {
                'repeat': [
                    { 'part': { 'type': parts_1.Parts.PartType.PERIOD } },
                    { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'property' },
                ], 'export': 'location', 'required': false
            }
        ]);
    }
    ;
    create = Identifier.create;
    static create(data, scope, position) {
        const identifierData = {};
        identifierData.base = data.base;
        identifierData.location = data.location?.map((v) => { return v.property; });
        identifierData.path = [identifierData.base, ...(identifierData.location || [])];
        return { scope, export: identifierData };
    }
    ;
}
exports.Identifier = Identifier;
;
