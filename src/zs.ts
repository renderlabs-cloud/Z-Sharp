import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Feature } from '~/feature';
import { Assembler } from '~/assembler';
import { Spinner, SpinnerTypes } from '~/cli/spinner';
import { official } from '~/official';

export namespace Z {
	export type Importer = {
		import: (path: string) => string,	
	};
		
	export function spin(spinner: Spinner) {
		spinner.start();
	};
	
	export function toAssembly(content: string, importer: Importer, path?: string) {
		let spinners: Spinner[] = Array.from({ length: 10 }, () => {
			const spinner = new Spinner({ text: '', style: SpinnerTypes['compile'] }); 
			return spinner;
		});
		spinners[0].options.text = 'Parsing';
		spinners[0].start();
		const parts = Parts.toParts(content, path);
		spinners[0].success();
		
		spinners[1].options.text = 'Applying syntax';
		spinners[1].start();
		const scope = new Feature.Scope(importer);
		const syntax = Syntax.toFeatures(parts, scope, official, content, path);
		spinners[1].success();
		
		spinners[2].options.text = 'Compiling to assembly';
		spinners[2].start();
		const assembly = Assembler.assemble(syntax);
		spinners[2].success();
		console.log(assembly);

		return ""; // REPLACE!
	};
};
