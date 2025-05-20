#pragma once
#include "architecture.S"

# Allocate N bytes → result in %rax
.macro MALLOC size
    MOV (REF(9), RAX)     ;// sys_mmap
    XOR (RDI, RDI)        ;// NULL address
    MOV (REF(\size), RSI) ;// size in bytes
    MOV (REF(3), RAX)     ;// PROT_READ | PROT_WRITE
    MOV (REF(34), R10)    ;// MAP_PRIVATE | MAP_ANONYMOUS
    XOR (R8, R8)          ;// fd = -1
    XOR (R9, R9)          ;// offset
    SYSCALL               ;// -> %rax = allocated pointer
.endm

# Read value at pointer → %reg
#   ptr = register with pointer
#   reg = output register
.macro PTR_READ ptr, reg
    MOV ((\ptr), \reg)
.endm

# Write value to pointer
#   value = register with value
#   ptr = pointer register
.macro PTR_WRITE value, ptr
    MOV (\value, (\ptr))
.endm

# Store value in memory, and return a pointer to it
#   value = register with value
#   out = output register with pointer
.macro PTR_CREATE value, out
    MALLOC 8            ;// allocate 8 bytes
    MOV (\value, (RAX)) ;// store value at allocated address
    MOV (RAX, \out)     ;// return pointer
.endm

# Optional, depending on the environment
.macro FREE ptr, size
    MOV (REF(11), RAX)    ;// sys_munmap
   	MOV (REF(\ptr), RDI)  ;// pointer
    MOV (REF(\size), RSI) ;// size in bytes
    SYSCALL
.endm
