export declare namespace Header {
    type SuccessData = {
        vulnerabilities: number;
        time: number;
    };
    type FailureData = {
        errors: number;
    };
    function hyperlink(text: string, url: string, attrs?: string[]): string;
    function bullets(data: string[]): string;
    const header: string;
    const Zasm_error: string;
    const Z_bug: string;
    const Zasm_bug: string;
    const zs: string;
    /**
     * Format a time in ms as a green string.
     * @param time The time in ms.
     * @returns A green colored in the format of `X.XXs`.
     */
    function time(time: number): string;
    /**
     * Generates a success message for the CLI.
     * @param data The data to include in the message.
     * @returns The message.
     */
    function success(data: SuccessData): string;
    /**
     * Generates a failure message for the CLI.
     * @param data The data to include in the message.
     * @returns The message.
     */
    function failure(data: FailureData): string;
    /**
     * Format a string with color.
     * @param data The string to format.
     * @returns The formatted string.
     */
    function format(data: string): string;
}
