"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
var Feature;
(function (Feature_1) {
    class Feature {
        sequence;
        constructor(sequence) {
            this.sequence = sequence;
        }
        ;
        create(data, scope, position) {
            return { scope };
        }
        ;
    }
    Feature_1.Feature = Feature;
    ;
    class Scope {
        importer;
        parent;
        constructor(importer, parent) {
            this.importer = importer;
            this.parent = parent;
            this._data = parent?._data || {};
        }
        ;
        set(name, value) {
            this._data[name] = value;
        }
        ;
        get(name) {
            return this._data[name];
        }
        ;
        _data;
    }
    Feature_1.Scope = Scope;
    ;
})(Feature || (exports.Feature = Feature = {}));
;
