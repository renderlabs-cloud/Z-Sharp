"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const error_1 = require("~/error");
var Validation;
(function (Validation) {
    function expects(type, expected) {
        if (type !== expected) {
            throw new error_1.Errors.Reference.TypeMismatch(type.name || '', {}); // TODO: position
        }
        ;
        return type === expected;
    }
    Validation.expects = expects;
    ;
})(Validation || (exports.Validation = Validation = {}));
;
