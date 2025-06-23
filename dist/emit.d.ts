export declare namespace Emit {
    /**
     * Compiles the given .iz source into an ELF binary.
     * Returns the ELF file as a Uint8Array (no files saved permanently).
     *
     * @param izSource - The .iz source code.
     * @returns Promise resolving to the ELF binary as Uint8Array.
     */
    function compileIZToELF(izSource: string): Promise<Uint8Array>;
}
