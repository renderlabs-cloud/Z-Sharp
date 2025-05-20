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

	export function toFeatures(parts: Parts.Part[], scope: Feature.Scope, _features: (any)[] = official, contents: string, path?: string) {
	 	const features = _features.map((v) => {
			return new v();	
		});
		let syntax: SyntaxData[] = [ ];
		
		let done = false;
		let foundMatch = false;
		let position: Errors.Position = { path };
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
					parts = parts.slice(match.parts.length);
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
