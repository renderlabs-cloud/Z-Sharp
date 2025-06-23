import { Accessor } from '~/features/accessor';
import { Type } from '~/features/type';
import { Variable } from '~/features/variable';
import { Function, FunctionCall } from '~/features/function';
import { Semicolon } from '~/features/semantics';
export declare const official: (typeof Function | typeof Type | typeof FunctionCall | typeof Accessor | typeof Variable | typeof Semicolon)[];
