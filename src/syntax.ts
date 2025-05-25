import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { official } from '~/official';

export namespace Syntax {
	export type SyntaxData = {
		exports: any,
		scope: Feature.Scope,
		feature: Feature.Feature	
	};

	export function toFeatures(parts: Parts.Part[], scope: Feature.Scope, position: Errors.Position, _features: (any)[] = official, path?: string) {
	 	const features = _features.map((v) => {
			return new v();	
		});
		const syntax: SyntaxData[] = [ ];
		const contents = position.content || '';
		
		let done = false;
		let foundMatch = false;
		while (!done) {
			if (parts.length == 0) {
				done = true;
				continue;	
			};
			for (const feature of features) {
				const match = feature.match(parts);
				if (match) {
					const data = feature.create(match.exports, scope, position);
					syntax.push({ exports: data.exports, scope: data.scope, feature: feature });
					parts = parts.slice(match.length);
					foundMatch = true;
					break;
				};
			};
			if (!foundMatch) {
  				throw new Errors.Syntax.Generic(contents, position);	
			};
			foundMatch = false;
		};

		return syntax;
	};
};
