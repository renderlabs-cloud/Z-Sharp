"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
class Body extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_OPEN } },
            {
                'between': {
                    'left': { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_OPEN } },
                    'right': { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } },
                }, 'export': 'parts'
            },
            { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } }
        ]);
    }
    ;
    create(data, scope, position) {
        let bodyData = {};
        return { scope, export: bodyData };
    }
    ;
    toAssemblyText(bodyData, scope) {
        let content = ``;
        return content;
    }
    ;
}
exports.Body = Body;
;
