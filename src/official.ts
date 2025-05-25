import { Accessor } from '~/features/accessor';
import { Type } from '~/features/type';
import { Variable } from '~/features/variable';
import { Function, } from '~/features/function';
import { Semicolon } from '~/features/semantics';

export const official = [
	// Word specifics come first
	Type,
	Variable,
	Function,

	// Then, generalized specifics
	Accessor,

	// And finally, semantics
	Semicolon
];
