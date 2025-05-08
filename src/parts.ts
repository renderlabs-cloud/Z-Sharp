export namespace Parts {
	export enum PartType { 
		WORD = "/([a-z,A-Z,$][a-z,A-Z,0-9]*)/g",
		NUMBER = "/([0-9]*)/g",
		DOUBLE_QUOTE_STRING = "/\\\"(.*)\\\"/g",
		SINGLE_QUOTE_STRING = "/\\'(.*)\\'/g",
		BACKTICK_QUOTE_STRING = "/\\`([^\\0]+)\\`/g",
		BACKTICK_INTERPOLATION = "/\\$\\{[^\\0]+\\}/g",
		PARENTHESIS_OPEN = "/\\(/",
		PARENTHESIS_CLOSE = "/\\)/",
		SQUARE_BRACKET_OPEN = "/\\[/",
		SQUARE_BRACKET_CLOSE = "/\\]/",
		CURLY_BRACKET_OPEN = "/\\{/",
		CURLY_BRACKET_CLOSE = "/\\}/",
		COLON = "/\\:/g",
		SEMICOLON = "/\\;/g",
		EQUALS = "/\\=/",

		UNKNOWN = "/\\0/",
	};
		
	export type Part = {
		content: string,
		type: PartType	
	};

	export function parseRegex(str: string): RegExp {
	  const match = str.match(/^\/(.*)\/([a-z]*)$/i);
	  if (!match) throw new Error("Invalid regex string");
	  const [, pattern, flags] = match;
	  return new RegExp(pattern, flags);
	};

	export function toParts(content: string) {
		const parts: Array<Part> = [];
		let done = false;
		while (!done) {
			for (const partType of Object.values(PartType)) {
				if (partType == PartType.UNKNOWN) {
					// Throw error
				};
				const match: any = content.match(parseRegex(partType));
				if (!match) continue;
				if (content.indexOf(match[0]) == 0) {
					content = content.slice(match[0].length).trim();
					console.log(content);
					if (content == '' || match[0] == content) {
						done = true;
						break;	
					};
				};
			};
		};
	};
};
