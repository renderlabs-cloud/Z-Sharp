import chalk from '@mnrendra/chalk';

export namespace ErrorType {
	const Colon = chalk.white(':');
	const Exclamation = chalk.white('!');
	class MainError {
		constructor (
			public message: string,
			public stack?: string
		) { 
			console.log(this.message);
			process.exit(1);
		};
 	};
	export namespace Command {
		export class CommandError extends MainError {
			constructor(message: string) {
				super(
					chalk.red.bold('A command error has occurred') + Exclamation + '\n' +
					message
				);	
			};
		};
		export namespace Missing {
			export class Parameters extends CommandError {
				constructor(parameters: string[]) {
					super(
						chalk.red('Missing parameters') + Colon + '\n' +
						'\t' + parameters.join(', ')	
					);
				};
			};
		};
		export namespace Conflicting {
			export class Parameters extends CommandError {
				constructor(parameters: string[]) {
					super(
						chalk.red('Conflicting parameters found') + Colon + '\n' +
						'\t' + parameters.join(', ')
					);	
				};
			};
		};
	};
};
