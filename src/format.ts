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
	export function section(header: SectionHeader) {
		return `
.section ${header.type}
${header.label ? `
#pragma section ${header.label}
`: ''}
		`;
	};
	// Add compiler readable comments
};