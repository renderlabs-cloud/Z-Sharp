"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
var Assembler;
(function (Assembler) {
    function assemble(syntaxData) {
        let content = '#include "z.S"\n';
        for (const data of syntaxData) {
            //			console.log(data);
        }
        ;
        return content;
    }
    Assembler.assemble = assemble;
    ;
})(Assembler || (exports.Assembler = Assembler = {}));
;
