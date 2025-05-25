import { Feature } from '~/feature';
import { Syntax } from '~/syntax';
import { official } from '~/official';

export namespace Assembler {
	export function assemble(syntaxData: Syntax.SyntaxData[], isMain?: boolean) {
		let content = isMain ? '#include "z.S"\n': '';
		for (const data of syntaxData) {
			content += data.feature.toAssembly(data.exports, data.scope);
		};
		console.log(content);
		return content;
	};
};
