import { Feature } from '~/feature';
import { Syntax } from '~/syntax';
import { official } from '~/official';

export namespace Assembler {
	export function assemble(syntaxData: Syntax.SyntaxData[]) {
		let content = '#include "z.S"\n';
		for (const data of syntaxData) {
//			console.log(data);
		};
		return content;
	};
};
