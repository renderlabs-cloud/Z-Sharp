export declare namespace Errors {
    class MainError {
        message: string;
        stack?: string | undefined;
        /**
         * @param message the error message
         * @param stack the optional stack trace
         */
        constructor(message: string, stack?: string | undefined);
        count: number;
    }
    type Position = {
        path?: string;
        line?: number;
        column?: number;
        content?: string;
    };
    namespace Parts {
        class PartError extends MainError {
            constructor(message: string, position: Position, contents: string);
        }
        class Unknown extends PartError {
            constructor(contents: string, position: Position);
        }
    }
    namespace Syntax {
        class SyntaxError extends MainError {
            constructor(message: string, position: Position, contents: string);
        }
        class Generic extends SyntaxError {
            constructor(contents: string, position: Position);
        }
        class Duplicate extends SyntaxError {
            constructor(contents: string, position: Position);
        }
    }
    namespace Reference {
        class ReferenceError extends MainError {
            constructor(message: string, contents: string, position: Position);
        }
        class Undefined extends ReferenceError {
            constructor(reference: string, position: Position);
        }
        class TypeMismatch extends ReferenceError {
            constructor(reference: string, position: Position);
        }
    }
    namespace Project {
        class ProjectError extends MainError {
            constructor(message: string);
        }
        class Invalid extends ProjectError {
            constructor(message: string);
        }
    }
    namespace Command {
        class CommandError extends MainError {
            constructor(message: string);
        }
        namespace Missing {
            class Parameters extends CommandError {
                constructor(parameters: string[]);
            }
        }
        namespace Conflicting {
            class Parameters extends CommandError {
                constructor(parameters: string[]);
            }
        }
    }
}
