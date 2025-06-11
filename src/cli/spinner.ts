import * as ct from 'colorette';


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

export const spinnerStyles: Record<string, SpinnerStyle> = {
	'compile': {
		frames: [' == ', '  ==', '   =', '  ==', ' == ', '==  ', '=   ', '==  '].map((v) => {
			return ct.white(`[${ct.blue(v)}]`);
		}),
		success: ct.white(`[ ${ct.green('OK')} ]`),
		fail: ct.white(`[ ${ct.red('ER')} ]`),
		warning: ct.white(`[ ${ct.yellow('WN')} ]`),
		framecount: 8,
	}
};

export class Spinner {
	/**
	 * Constructs a new Spinner instance with the provided options.
	 *
	 * @param options - The configuration options for the spinner, which include:
	 *   - `text`: The text to display alongside the spinner frames.
	 *   - `framerate`: (Optional) The speed of the spinner in frames per second.
	 *   - `style`: The style configuration for the spinner, including frames and messages.
	 */
	constructor(
		public options: SpinnerOptions
	) {

	};

	/**
	 * Starts the spinner animation.
	 *
	 * This method sets up an interval to animate the spinner frames at the
	 * configured framerate. The spinner is displayed on the current line, and
	 * the display is updated every frame.
	 */
	public async start() {
		let i = 0;
		this.interval = setInterval(() => {
			process.stdout.clearLine(0);
			process.stdout.write(this.options.style.frames[i++] + ' ' + this.options.text);
			process.stdout.cursorTo(0);
			i = i % this.options.style.framecount;
		}, 1000 / (this.options.framerate || 2));
	};

	/**
	 * Stops the spinner animation and writes a success message.
	 *
	 * This method clears the line where the spinner is displayed, and writes
	 * the configured success message followed by a newline character.
	 */
	public success() {
		clearInterval(this.interval);
		process.stdout.clearLine(0);
		process.stdout.write(this.options.style.success + ' ' + this.options.text + '\n');
	};

	/**
	 * Stops the spinner animation and writes a warning message.
	 *
	 * This method clears the line where the spinner is displayed, and writes
	 * the configured warning message followed by a newline character.
	 */
	public warning() {
		clearInterval(this.interval);
		process.stdout.clearLine(0);
		process.stdout.write(this.options.style.warning + ' ' + this.options.text + '\n');
	};

	/**
	 * Stops the spinner animation and writes a failure message.
	 *
	 * This method clears the line where the spinner is displayed, and writes
	 * the configured failure message followed by a newline character.
	 */
	public fail() {
		clearInterval(this.interval);
		process.stdout.clearLine(0);
		process.stdout.write(this.options.style.fail + ' ' + this.options.text + '\n');
	};

	private interval?: ReturnType<typeof setInterval>;
};
