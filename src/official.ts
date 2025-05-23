import { Accessor } from '~/features/accessor';
import { Type } from '~/features/type';
import { Variable } from '~/features/variable';
import { Semicolon } from '~/features/semantics';

export const official = [
	// Word specifics come first
	Type,
	Variable,

	// Then, generalized specifics
	Accessor,

	// And finally, semantics
	Semicolon
];
