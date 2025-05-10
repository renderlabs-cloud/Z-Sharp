import { chalk } from '@mnrendra/chalk';


export type SpinnerOptions = {
	text: string,
	framerate?: number,
	style: SpinnerStyle
};
	
export type SpinnerStyle = {
	frames: string[],
	framecount: number,
	success: string,
	fail: string,
	warning: string
};
	
export const SpinnerTypes: Record<string, SpinnerStyle> = {
	'compile': {
		frames: new Proxy([ '', '', '', '', '', '', '', ''  ], {
			get(target, prop) {
				const i = Number(prop);
				const animation = [ ' == ', '  ==', '   =', '  ==', ' == ', '==  ', '=   ', '==  ' ];
				return chalk.white(`[${chalk.blue(animation[i])}]`);
			}
		}),
		success: chalk.white(`[ ${chalk.green('OK')} ]`),
		fail: chalk.white(`[ ${chalk.red('ER')} ]`),
		warning: chalk.white(`[ ${chalk.yellow('WN')} ]`),
		framecount: 8
	}
};

export class Spinner {
	constructor(
		public options: SpinnerOptions
	) {
			
	};

	public start() {
	    let i = 0;
		this.interval = setInterval(() => {
			process.stdout.clearLine(0);
			process.stdout.write(this.options.style.frames[i++] + ' ' + this.options.text);
			process.stdout.cursorTo(0);
			i = i % this.options.style.framecount;
		}, 1000 / (this.options.framerate || 2));
	};

	public success() {
		clearInterval(this.interval);
		process.stdout.clearLine(0);
		process.stdout.write(this.options.style.success + ' ' +this.options.text + '\n');	
	};

	public warning() {
		clearInterval(this.interval);
		process.stdout.clearLine(0);
		process.stdout.write(this.options.style.warning + ' ' +this.options.text + '\n');	
	};
	
	public fail() {
		clearInterval(this.interval);
		process.stdout.clearLine(0);
		process.stdout.write(this.options.style.fail + ' ' +this.options.text + '\n');	
	};

	private interval?: ReturnType<typeof setInterval>;
};
