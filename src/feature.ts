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
			type: any,
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
		public toAssembly(feature: Feature): string {
			return '';	
		};
		public match(parts: Parts.Part[]) {
			let i = 0;
			let p = 0;
			let d = 0;

			const matchedParts: Parts.Part[] = [];
			const exports: Record<string, any> = { };

			while (i < this.sequence.length && p < parts.length) {
				const sequenceItem = this.sequence[i];
				const currentPart = parts[p];
				let matched = false;
				
				// 1. Match literal part
				if (sequenceItem.part) {
					if (sequenceItem.part.type === currentPart.type && (sequenceItem.part.value === undefined || sequenceItem.part.value === currentPart.content)) {
						matchedParts.push(currentPart);
						matched = true;
						p++;
						i++;
					};
					if (sequenceItem.export) {
						exports[sequenceItem.export] = currentPart.content;
					};
				}

				// 2. Match sub-feature
				else if (sequenceItem.feature) {
					const subFeature = new sequenceItem.feature.type();
					const result = subFeature.match(parts.slice(p));
					if (result) {
						matchedParts.push(...result.parts);
						p += result.parts.length;
						i++;
						matched = true;
						if (sequenceItem.export) {
							exports[sequenceItem.export] = result.exports;
						};
					};
				}

				// 3. Match OR (any one of the sequences)
				else if (sequenceItem.or) {
					for (const altSeq of sequenceItem.or) {
						const altFeature = new Feature(altSeq);
						const result = altFeature.match(parts.slice(p));
						if (result) {
							matchedParts.push(...result.parts);
							p += result.parts.length;
							matched = true;
							if (sequenceItem.export) {
								exports[sequenceItem.export] = result.exports;
							};
							break;
						};
					};
					if (matched) i++;
				}

				// 4. Match REPEAT (a pattern that can repeat)
				else if (sequenceItem.repeat) {
					const repeatFeature = new Feature(sequenceItem.repeat);
					let repeatMatched = true;
					while (repeatMatched) {
						const result = repeatFeature.match(parts.slice(p));
						if (result) {
							matchedParts.push(...result.parts);
							p += result.parts.length;
							if (sequenceItem.export) {
								if (!exports[sequenceItem.export]) {
									exports[sequenceItem.export] = [];	
								};
								exports[sequenceItem.export].push(result.exports);
							};
						} else {
							repeatMatched = false;
						};
					};
					matched = true;
					i++;
				};

				if (!matched) {
					if (sequenceItem.required !== false) {
						return null; // failed and required
					} else {
						exports[sequenceItem.export || '?'] = null;
						i++; // skip optional sequence
					};
				};
			};

			if (i === this.sequence.length) {
				return { parts: matchedParts, exports };
			};
			return null;
		};
	};
	export class Scope {
		constructor(
			public importer: Z.Importer,
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
