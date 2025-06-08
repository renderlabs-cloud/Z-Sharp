import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { official } from '~/official';

export namespace Syntax {
	export type SyntaxData = {
		export: any,
		scope: Feature.Scope,
		feature: Feature.Feature
	};

	/**
	 * Converts an array of {@link Parts.Part} into an array of {@link SyntaxData}.
	 *
	 * @param parts The array of parts to convert.
	 * @param scope The scope to use when creating features.
	 * @param position The position to use when creating features.
	 * @param _features The array of features to use when creating features. Defaults to {@link official}.
	 * @param path The path of the file being converted. Used for error reporting.
	 * @returns An array of {@link SyntaxData} representing the features found in the parts.
	 */
	export function toFeatures(parts: Parts.Part[], scope: Feature.Scope, position: Errors.Position, _features: (any)[] = official, path?: string) {
		const features = _features.map((v) => {
			return new v();
		});
		const syntax: SyntaxData[] = [];
		const contents = position.content || '';

		let done = false;
		let foundMatch = false;
		while (!done) {
			if (parts.length == 0) {
				done = true;
				continue;
			};
			let i = 0;
			for (const feature of features) {
				const match = feature.match(parts);
				if (match) {
					const data = feature.create?.(match.exports, scope, position);
					syntax.push({ export: data.export, scope: data.scope, feature: feature });
					parts = parts.slice(match.length);
					foundMatch = true;
					break;
				};
				i++;
			};
			if (!foundMatch) {
				throw new Errors.Syntax.Generic(contents, position);
			};
			foundMatch = false;
		};

		return syntax;
	};
};
