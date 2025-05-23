"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessor = void 0;
const feature_1 = require("~/feature");
const identifier_1 = require("~/features/identifier");
class Accessor extends feature_1.Feature.Feature {
    constructor() {
        super([
            {
                'or': [
                    [
                        { 'feature': { 'type': identifier_1.Identifier }, 'export': 'identifier' },
                    ]
                ], 'export': 'declaration'
            }
        ]);
    }
    ;
    create(data, scope, position) {
        let propertyData = {};
        console.log(data);
        return { scope, exports: propertyData };
    }
    ;
    toAssembly(propertyData, scope) {
        let content = `// ???\n`;
        return content;
    }
    ;
}
exports.Accessor = Accessor;
;
