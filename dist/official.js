"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.official = void 0;
const type_1 = require("~/features/type");
const semantics_1 = require("~/features/semantics");
exports.official = [
    // Word specifics come first
    type_1.Type,
    // Then, generalized specifics
    // 	Identifier,
    // And finally, semantics
    semantics_1.Semicolon
];
