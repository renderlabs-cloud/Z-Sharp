"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileType = void 0;
var FileType;
(function (FileType) {
    function get(path) {
        return path.match(/.*(\.\w*)/gm)?.[0];
    }
    FileType.get = get;
    ;
})(FileType || (exports.FileType = FileType = {}));
;
