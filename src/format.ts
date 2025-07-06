export namespace Format {
	export type SectionHeader = {
		type:
		| '.text'
		| '.data'
		| '.bss'
		label?: string
	};
	export function comment(content: string[]) {
		return content.join('\n * ');
	};
	export namespace section {
		export function start(header: SectionHeader) {
			return `
.section ${header.type}
${header.label ? `
#pragma section ${header.label}` : ''}
`;
		};
		export function end() {
			return `
#pragma section end
`;
		};
	};
};