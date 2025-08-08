#pragma once
#include "architecture.i"

# Allocate N bytes → result in %rax
.macro MALLOC size
	SAVE_ZASM
	MOV (RAX, REF(SYS_GET(SYSCALL_MMAP))) ;// syscall number: mmap (Linux AArch64)
	MOV (RDI, REF(0))                     ;// addr = NULL
	MOV (RSI, REF(\size))                 ;// length = size
	MOV (RDX, REF(3))                     ;// PROT_READ | PROT_WRITE
	MOV (R10, REF(0x22))                  ;// MAP_ANONYMOUS | MAP_PRIVATE
	MOV (R8, REF(-1))                     ;// fd = -1
	MOV (REF(0), R9)                      ;// offset = 0
	SYSCALL
	LOAD_ZASM
.endm

# Read value at pointer → %reg
#   ptr = register with pointer
#   reg = output register
.macro PTR_READ ptr, reg
    MOV ([\ptr], \reg)
.endm

# Write value to pointer
#   value = register with value
#   ptr = pointer register
.macro PTR_WRITE value, ptr
    MOV (\value, [\ptr])
.endm

# Store value in memory, and return a pointer to it
#   value = register with value
#   out = output register with pointer
.macro PTR_CREATE value, size, out
    SAVE_R0_R4
    MALLOC \size               ;// allocate bytes
    MOV (\value, [RAX])        ;// store value at allocated address
    MOV (RAX, \out)            ;// return pointer
    LOAD_R0_R4
.endm

.macro LEN ptr, out
	SAVE_R0_R4
	MOV (\ptr, RCX)
1:
	MOV ([RCX], RDX)
	CMP (RDX, REF(0))
	JE (2f)
	INC (RCX)
	JMP (1b)
2:
	MOV (RCX, \out)
	LOAD_R0_R4
.endm

.macro FREE ptr, size
	SAVE
	MOV (REF(11), RAX)          ;// sys_munmap
	MOV (\ptr, RDI)             ;// pointer
	MOV (REF(\size), RSI)       ;// size in bytes
	SYSCALL
	LOAD
.endm
