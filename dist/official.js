"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.official = void 0;
const accessor_1 = require("~/features/accessor");
const type_1 = require("~/features/type");
const variable_1 = require("~/features/variable");
const semantics_1 = require("~/features/semantics");
exports.official = [
    // Word specifics come first
    type_1.Type,
    variable_1.Variable,
    // Then, generalized specifics
    accessor_1.Accessor,
    // And finally, semantics
    semantics_1.Semicolon
];
