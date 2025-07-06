export declare namespace Format {
    type SectionHeader = {
        type: '.text' | '.data' | '.bss';
        label?: string;
    };
    function comment(content: string[]): string;
    namespace section {
        function start(header: SectionHeader): string;
        function end(): string;
    }
}
