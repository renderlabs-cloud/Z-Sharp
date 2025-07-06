import * as ct from 'colorette';

import { Header } from '~/cli/header';
import { Util } from '~/util';


export namespace Errors {
	const colon = ct.reset(':');
	const exclamation = ct.reset('!');
	const dash = ct.reset('-');
	const newline = ct.reset('\n');
	export class MainError {
		/**
		 * @param message the error message
		 * @param stack the optional stack trace
		 */
		constructor(
			public message: string,
			public stack?: string
		) {
			this.message = (this.message);
		};
		public count: number = 0;
	};
	export type Position = {
		path?: string,
		line?: number,
		column?: number,
		content?: string
	};
	/**
	 * Formats a position and a highlight string to be printed to the console.
	 * @param position the position to be formatted
	 * @param highlight the highlight string to be formatted
	 * @returns a formatted string
	 */
	function highlight(position: Position, highlight: string) {
		return ct.cyan(position?.path || '') + colon + ct.yellow(String(position?.line)) + colon + ct.yellow(String(position?.column)) + newline +
			ct.red(highlight);
	};
	export namespace Parts {
		export class PartError extends MainError {
			constructor(message: string, position: Position, contents: string) {
				super(
					ct.red(ct.bold('A parsing error has occurred')) + exclamation + newline +
					message + newline +
					highlight(position, contents)
				);

				Util.error(this);
			};
		};
		export class Unknown extends PartError {
			constructor(contents: string, position: Position) {
				super(
					ct.red('Unknown token detected') + colon,
					position,
					contents
				);
			};
		};
	};
	export namespace Syntax {
		export class SyntaxError extends MainError {
			constructor(message: string, position: Position, contents: string) {
				super(
					ct.red(ct.bold('A syntax error has occurred')) + exclamation + newline +
					message + newline +
					highlight(position, contents)
				);

				Util.error(this);
			};
		};
		export class Generic extends SyntaxError {
			constructor(contents: string, position: Position) {
				super(
					ct.red('Syntax is invalid') + colon,
					position,
					contents
				);
			};
		};
		export class Duplicate extends SyntaxError {
			constructor(contents: string, position: Position) {
				super(
					ct.red(`Duplicate entries for ${contents}`) + colon,
					position,
					contents
				);
			};
		};
	};
	export namespace Reference {
		export class ReferenceError extends MainError {
			constructor(message: string, contents: string, position: Position) {
				super(
					ct.red(ct.bold('A reference error has occured')) + exclamation + newline +
					message + '\n' +
					highlight(position, contents)
				);
			};
		};
		export class Undefined extends ReferenceError {
			constructor(reference: string, position: Position) {
				super(
					ct.red('Undefined reference') + colon + newline +
					reference + newline,
					reference,
					position
				);
			};
		};
		export class TypeMismatch extends ReferenceError {
			constructor(reference: string, position: Position) {
				super(
					ct.red('Type mismatch') + colon + newline +
					reference + newline,
					reference,
					position
				);
			};
		};
	};
	export namespace Project {
		export class ProjectError extends MainError {
			constructor(message: string) {
				super(
					ct.red(ct.bold('A project error has occurred')) + exclamation + newline +
					message
				);
				Util.error(this);
			};
		};
		export class Invalid extends ProjectError {
			constructor(message: string) {
				super(
					ct.red('Invalid project configuration') + colon + newline +
					message);
			};
		}
	};
	export namespace Command {
		export class CommandError extends MainError {
			constructor(message: string) {
				super(
					ct.red(ct.bold('A command error has occurred')) + exclamation + newline +
					message
				);
				Util.error(this);
			};
		};
		export namespace Missing {
			export class Parameters extends CommandError {
				constructor(parameters: string[]) {
					super(
						ct.red('Missing parameters') + colon + newline +
						parameters.join(', ')
					);
				};
			};
		};
		export namespace Conflicting {
			export class Parameters extends CommandError {
				constructor(parameters: string[]) {
					super(
						ct.red('Conflicting parameters found') + colon + newline +
						parameters.join(', ')
					);
				};
			};
		};
	};
	export namespace IZ {
		export class IZError extends MainError {
			constructor(message: string) {
				super(
					ct.red(ct.bold(`A ${Header.iz} error has occurred`)) + exclamation + newline +
					message
				);
				Util.error(this);
			};
		};
		export class Bug extends IZError {
			constructor(message: string) {
				super(
					message + newline +
					Header.Z_bug + newline +
					Header.Zasm_bug
				);
			};
		}
	};
};
