#include "architecture.S"

.macro DEBUG value
    MOV(REF(1), RAX)  ;// sys_write system call
    MOV(REF(1), RDI)  ;// stdout file descriptor
    MOV(\value, RSI)  ;// pointer to the string
    MOV(REF(10), RDX) ;// length of the string
    SYSCALL
.endm
