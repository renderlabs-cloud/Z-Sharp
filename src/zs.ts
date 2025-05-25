import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Feature } from '~/feature';
import { Assembler } from '~/assembler';
import { compileAssemblyToBinary } from '~/emit';
import { FileType } from '~/file';
import { Errors } from '~/error';
import { Spinner, SpinnerTypes } from '~/cli/spinner';
import { header, success, failure, SuccessData, FailureData } from '~/cli/header';
import { official } from '~/official';

export namespace Z {
	export type Importer = {
		import: (path: string) => string,
		cli: boolean
	};

	export function spin(spinner: Spinner) {
		spinner.start();
	};

	export function toAssembly(content: string, importer: Importer, path?: string) {
		const start = Date.now();

		let spinners: Spinner[] = [];
		let assembly: string = '';
		if (importer.cli) {
			console.log(header);
			spinners = Array.from({ length: 10 }, () => {
				const spinner = new Spinner({ text: '', style: SpinnerTypes['compile'] });
				return spinner;
			});
			spinners[0].options.text = 'Parsing';
			spinners[1].options.text = 'Applying syntax';
			spinners[2].options.text = 'Compiling to assembly';
			spinners[0].start();
		};
		try {
			const parts = Parts.toParts(content, path);
			if (importer.cli) {
				spinners[0].success();
				spinners[1].start();
			};
			const scope = new Feature.Scope(importer, 'main');
			const basePosition: Errors.Position = {
				content,	
			};
			const syntax = Syntax.toFeatures(parts, scope, basePosition, undefined, path);
			if (importer.cli) {
				spinners[1].success();
				spinners[2].start();
			};

			assembly = Assembler.assemble(syntax, true);
			if (importer.cli) {
				spinners[2].success();
			};

			if (importer.cli) {
				const end = Date.now();
				console.log(success({
					vulnerabilities: 0, // add later
					time: end - start
				}));
			};
		} catch (_err) {
			let err = (_err as Errors.MainError);
			console.log(err.message);
			console.log(failure({
				errors: err.count || 1
			}));
			process.exit(1);
		};

		return assembly;
	};

	export async function emit(content: string, output: FileType.FileType) {
		const compiled = await compileAssemblyToBinary(content, output);
		return compiled;
	};
};
	
