import { Type } from '~/features/type';
import { Variable } from '~/features/variable';
import { Function, FunctionCall, Return } from '~/features/function';
import { Semicolon } from '~/features/semantics';
export declare const official: (typeof Variable | typeof Type | typeof Function | typeof FunctionCall | typeof Return | typeof Semicolon)[];
