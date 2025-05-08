export namespace FileType {
	export type fileType = 
	| ".zs"
	| ".asm"
	| null;
	export function get(path: string) {
		return path.match(/.*(\.\w*)/gm)?.[0] as fileType;
	};
};
