export namespace FileType {
	export type FileType = 
	| ".zs"
	| ".iz"
	| null;
	export function get(path: string) {
		return path.match(/.*(\.\w*)/gm)?.[0] as FileType;
	};
};
