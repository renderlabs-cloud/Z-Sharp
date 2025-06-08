import { Errors } from '~/error';

export namespace Parts {
	export enum PartType {
		SINGLE_LINE_COMMENT = "/\\/\\/.*/g",
		MULTI_LINE_COMMENT = "/\\/\\*[\\s\\S]*?\\*\\//gs",
		MULTI_LINE_DEF_COMMENT = "/\\/\\*\\*[\\s\\S]*?\\*\\//gs",

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
		QUESTION = "/\\?/g",
		SEMICOLON = "/\\;/g",
		EQUALS = "/\\=/g",

		EXTRA_WHITESPACE = "/\\s+/g",

		UNKNOWN = "/\\0/g",
	};

	export type Part = {
		content: string,
		type: PartType,
		position?: Errors.Position
	};

	/**
	 * Given a string in the form of "/pattern/modifiers", parse and
	 * return a RegExp object.
	 *
	 * @param {string} str - The string to parse
	 * @returns {RegExp} The parsed RegExp object
	 */
	export function parseRegex(str: string) {
		const match = str.match(/^\/(.*)\/([a-z]*)$/i);
		if (!match) return PartType.UNKNOWN;
		const [, pattern, flags] = match;
		return new RegExp(pattern, flags);
	};

	/**
	 * Parses the given content string into an array of parts, identifying and 
	 * categorizing each part according to its type. The parts are determined 
	 * based on predefined regular expressions for various token types such 
	 * as comments, strings, numbers, etc.
	 * 
	 * @param {string} content - The content to be parsed into parts.
	 * @param {string} [path] - An optional path indicating the source of the content.
	 * @returns {Array<Part>} An array of parsed parts, each containing the 
	 * content, type, and position information.
	 * @throws {Errors.Parts.Unknown} Throws an error if an unknown token is detected.
	 */
	export function toParts(content: string, path?: string) {
		const parts: Array<Part> = [];
		const position: Errors.Position = {};
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
					if (partType == PartType.EXTRA_WHITESPACE || partType == PartType.SINGLE_LINE_COMMENT || partType == PartType.MULTI_LINE_COMMENT) {
						content = content.slice(match[0].length).trim();
						if (content == '' || match[0] == content) {
							done = true;
						};
						break;
					};
					position.line = origin.indexOf(content.split('\n')[0]) + 1;
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
