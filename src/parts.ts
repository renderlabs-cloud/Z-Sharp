import { Errors } from '~/error';

export namespace Parts {
	export enum PartType { 
		WORD = "/([a-zA-Z$_][a-zA-Z0-9$_]*)/g",
		NUMBER = "/([0-9][0-9]*)/g",
		DOUBLE_QUOTE_STRING = "/\\\"(.*)\\\"/g",
		SINGLE_QUOTE_STRING = "/\\'(.*)\\'/g",
		BACKTICK_QUOTE_STRING = "/\\`([^\\0]+)\\`/g",
		BACKTICK_INTERPOLATION = "/\\$\\{[^\\0]+\\}/g",
		PARENTHESIS_OPEN = "/\\(/g",
		PARENTHESIS_CLOSE = "/\\)/g",
		SQUARE_BRACKET_OPEN = "/\\[/g",
		SQUARE_BRACKET_CLOSE = "/\\]/g",
		CURLY_BRACKET_OPEN = "/\\{/g",
		CURLY_BRACKET_CLOSE = "/\\}/g",
		ANGLE_BRACKET_OPEN = "/\\</g",
		ANGLE_BRACKET_CLOSE = "/\\>/g",
		COLON = "/\\:/g",
		COMMA = "/\\,/g",
		PERIOD = "/\\./g",
		SEMICOLON = "/\\;/g",
		EQUALS = "/\\=/",
	
		UNKNOWN = "/\\0/g",
	};
		
	export type Part = {
		content: string,
		type: PartType,
		position?: Errors.Position
	};

	export function parseRegex(str: string) {
	  const match = str.match(/^\/(.*)\/([a-z]*)$/i);
	  if (!match) return PartType.UNKNOWN;
	  const [, pattern, flags] = match;
	  return new RegExp(pattern, flags);
	};

	export function toParts(content: string, path?: string) {
		const parts: Array<Part> = [];
		const position: Errors.Position = { };
		const origin: string[] = content.split('\n');
		let done = false;
		position.path = path;
		while (!done) {
			for (const partType of Object.values(PartType)) {
				const match: any = content.match(parseRegex(partType));
				if (partType == PartType.UNKNOWN) {
					throw new Errors.Parts.Unknown(content[0], position);
				};
				if (!match) continue;
				if (content.indexOf(match[0]) == 0) {
					position.line = origin.indexOf(content.split('\n')[0]) + 1 || position.line;
					// position.column = origin[(position.line || 1) - 1].length;
					parts.push({ content: match[0] || content, type: partType, position });
					content = content.slice(match[0].length).trim();
					if (content == '' || match[0] == content) {
						done = true;
					};
					break;
				};
			};
		};
		return parts;
	};
};
