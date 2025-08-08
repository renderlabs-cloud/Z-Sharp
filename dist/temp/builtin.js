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
        scope.set(`type.${scope.alias('void')}`, {
            'name': 'void',
            'typeRef': {
                'type': {
                    'alias': {
                        'path': ['void']
                    }
                }
            }
        });
        scope.set(`type.${scope.alias('never')}`, {
            'name': 'never',
            'typeRef': {
                'type': {
                    'alias': {
                        'path': ['never']
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
