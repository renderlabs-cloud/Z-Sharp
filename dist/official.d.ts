import { Type } from '~/features/type';
import { Variable } from '~/features/variable';
import { Function, FunctionCall, Return } from '~/features/function';
import { Semicolon } from '~/features/semantics';
export declare const official: (typeof Variable | typeof Function | typeof Type | typeof FunctionCall | typeof Return | typeof Semicolon)[];
