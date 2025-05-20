import { Identifier } from '~/features/identifier';
import { Type } from '~/features/type';
import { Semicolon }  from '~/features/semantics';

export const official = [
	// Word specifics come first
	Type,

	// Then, generalized specifics
// 	Identifier,

	// And finally, semantics
	Semicolon
];
