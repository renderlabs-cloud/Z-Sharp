import { Parts } from '~/parts';

export namespace Feature {
	export type SequenceItem = {
		type: 'part' | 'feature',
		part?: {
			type: Parts.PartType	
		},
		feature?: {
			properties: string[],
			type: Feature
		}
	};
	export type Sequence = SequenceItem[];
	export class Feature {
		constructor(
			public sequence: Sequence,
			public properties: string[]
		)	{
			
		};
		public set(property: string, value: string | number) {
			this._properties.set(property, value);
		};
		
		public get(property: string) {
			return this._properties.get(property);	
		};

		private _properties: Map<string, string |  number> = new Map();
	};
};
