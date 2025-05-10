import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { official } from '~/official';

export namespace Syntax {
	export function toFeatures(parts: Parts.Part[], scope: Feature.Scope, _features: (any)[] = official) {
		const features = _features.map((v) => {
			return new v();	
		});
		
	};
};
