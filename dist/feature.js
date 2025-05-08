"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
var Feature;
(function (Feature_1) {
    class Feature {
        sequence;
        properties;
        constructor(sequence, properties) {
            this.sequence = sequence;
            this.properties = properties;
        }
        ;
        set(property, value) {
            this._properties.set(property, value);
        }
        ;
        get(property) {
            return this._properties.get(property);
        }
        ;
        _properties = new Map();
    }
    Feature_1.Feature = Feature;
    ;
})(Feature || (exports.Feature = Feature = {}));
;
