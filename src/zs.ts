import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Feature } from '~/feature';
import { Spinner, SpinnerTypes } from '~/cli/spinner';

export namespace Z {
	export type Importer = {
		import: (path: string) => string,	
	};
	export function toAssembly(content: string, importer: Importer, path?: string) {
		let spinners: Spinner[] = Array.from({ length: 10 }, () => {
			const spinner = new Spinner({ text: '', style: SpinnerTypes['compile'] }); 
			return spinner;
		});
		spinners[0].options.text = 'Parting';
		spinners[0].start();
		const parts = Parts.toParts(content, path);
		spinners[0].success();
		
		spinners[1].options.text = 'Applying syntax';
		spinners[1].start();
		const parsed = Syntax.toFeatures(parts, new Feature.Scope(importer));
		spinners[1].success();

		spinners[2].options.text = 'Compiling to assembly';
		spinners[2].start();

		return ""; // REPLACE!
	};
};
