import { Parts } from '~/parts';

export namespace Z {
	export type Importer = {
		import: (path: string) => string,	
	};
	export function toAssembly(content: string, importer: Importer) {
		const parts = Parts.toParts(content);
		console.log(parts);
		return ""; // REPLACE!
	};
};
