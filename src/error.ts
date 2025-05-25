import chalk from '@mnrendra/chalk';

export namespace Errors {
	const colon = chalk.reset(':');
	const exclamation = chalk.reset('!');
	const dash = chalk.reset('-');
	const newline = chalk.reset('\n');
	export class MainError {
		constructor (
			public message: string,
			public stack?: string
		) { 

		};
		public count: number = 0;
 	};
 	export type Position = {
 		path?: string,
 		line?: number,
 		column?: number,
 		content?: string
 	};
 	function highlight(position: Position, highlight: string) {
 		return chalk.cyan(position?.path) + colon + chalk.yellow(String(position?.line)) + colon + chalk.yellow(String(position?.column)) + newline + 
 			chalk.white.bgRed(highlight);
 	};
 	export namespace Parts {
 		export class PartError extends MainError {
 			constructor(message: string, position: Position, contents: string) {
 				super(
 					chalk.red.bold('A parsing error has occurred') + exclamation + newline +
 					message + newline +
 					highlight(position, contents)
 				);
 			};
 		};
 		export class Unknown extends PartError {
 			constructor(contents: string, position: Position) {
 				super(
 					chalk.red('Unknown token detected') + colon,
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
 					chalk.red.bold('A syntax error has occurred') +	exclamation + newline,
 					message + newline +
 					highlight(position, contents)
 				);
 			};
 		};
 		export class Generic extends SyntaxError {
 			constructor(contents: string, position: Position) {
 				super(
 					chalk.red('Syntax is invalid') + colon,
 					position,
 					contents
 				);
 			};
 		};
 		export class Duplicate extends SyntaxError {
 			constructor(contents: string, position: Position) {
 				super(
 					chalk.red(`Duplicate entries for ${contents}`) + colon,
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
 					chalk.red.bold('A reference error has occured') + exclamation + newline +
 					message + '\n' +
 					highlight(position, contents)
 				);
 			};
 		};
 		export class Undefined extends ReferenceError {
 			constructor(reference: string, position: Position) {
 				super(
 					chalk.red('Undefined reference') + colon + newline +
 					reference + newline,
 					reference,
 					position
 				);
 			};
 		};
 	};
	export namespace Command {
		export class CommandError extends MainError {
			constructor(message: string) {
				super(
					chalk.red.bold('A command error has occurred') + exclamation + newline +
					message
				);
				console.log(this.message);
				process.exit(1);
			};
		};
		export namespace Missing {
			export class Parameters extends CommandError {
				constructor(parameters: string[]) {
					super(
						chalk.red('Missing parameters') + colon + newline +
						parameters.join(', ')
					);
				};
			};
		};
		export namespace Conflicting {
			export class Parameters extends CommandError {
				constructor(parameters: string[]) {
					super(
						chalk.red('Conflicting parameters found') + colon + newline +
						parameters.join(', ')
					);	
				};
			};
		};
	};
};
