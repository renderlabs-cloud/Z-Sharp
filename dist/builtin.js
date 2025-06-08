"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltIn = void 0;
var BuiltIn;
(function (BuiltIn) {
    function inject(scope) {
        scope.set(`type.${scope.alias('byte')}`, {
            'name': 'byte',
            'typeRef': {
                'type': {
                    'alias': {
                        'path': ['byte']
                    }
                }
            }
        });
        return scope;
    }
    BuiltIn.inject = inject;
    ;
})(BuiltIn || (exports.BuiltIn = BuiltIn = {}));
;
