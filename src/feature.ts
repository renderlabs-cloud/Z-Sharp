import { Parts } from '~/parts';
import { Errors } from '~/error';
import  { Z } from '~/zs';

export namespace Feature {
	export type SequenceItem = {
		part?: {
			type: Parts.PartType,
			value?: string	
		},
		feature?: {
			type: typeof Feature,
			properties?: string[]
		},
		
		or?: Sequence[],
		repeat?: Sequence,

		export?: string,
		required?: boolean,
	};
	export type Sequence = SequenceItem[];
	export class Feature {
		constructor(
			public sequence: Sequence,
		)	{
			
		};
		public create(data: any, scope: Scope, position: Errors.Position): { scope: Scope, export?: any } {
			return { scope };
		};
	};
	export class Scope {
		constructor(
			public importer: Z.Importer ,
			public parent?: Scope
		) {
			this._data = parent?._data || { };
		};
		
		public set(name: string, value: any) {
			this._data[name] = value;
		};

		public get(name: string) {
			return this._data[name];	
		};

		public _data: any;
	};
};
