"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
var Assembler;
(function (Assembler) {
    function assemble(syntaxData, isMain) {
        let content = isMain ? '#include "z.S"\n' : '';
        for (const data of syntaxData) {
            content += data.feature.toAssembly(data.exports, data.scope);
        }
        ;
        console.log(content);
        return content;
    }
    Assembler.assemble = assemble;
    ;
})(Assembler || (exports.Assembler = Assembler = {}));
;
