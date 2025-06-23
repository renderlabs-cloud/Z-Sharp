export declare namespace Format {
    type SectionHeader = {
        type: '.text' | '.data' | '.bss';
        label?: string;
    };
    function comment(content: string[]): string;
    function section(header: SectionHeader): string;
}
