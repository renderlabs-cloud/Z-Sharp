#pragma once

#include "macro.S"

/**
 * # Register usage
 *
 * R0 - R4  : Mnemonic control
 * R5       : Scope
 * R6       : Selector control
 * R7       : Parameters
 * R8       : Call control
 * R9       : Stack control
 * R10 - R13: Unallocated
 * R14      : Debugger control
 * R15      : Temporary
 */

# Architecture mapping

/* x86_64 (64-bit) */
#if defined(__x86_64__) || defined(__amd64__)
	# Registers
	#define RAX rax
	#define RBX rbx
	#define RCX rcx
	#define RDX rdx
	#define RSI rsi
	#define RDI rdi
	#define RSP rsp
	#define RBP rbp
	#define R8  r8
	#define R9  r9
	#define R10 r10
	#define R11 r11
	#define R12 r12
	#define R13 r13
	#define R14 r14
	#define R15 r15
	#define RIP rip

	# Mnemonics
	#define SYSCALL syscall
	#define MOV(x, y) mov x, y
	#define LDR(x, y, z) mov x, [y + z]
	#define LDL(x, y) mov x, y
	#define LEA(x, y, z) lea x, [y + z]
	#define XOR(x, y) xor x, y
	#define ADD(x, y) add x, y
	#define SUB(x, y) sub x, y
	#define IMUL(x, y) imul x, y
	#define IDIV(x) idiv x
	#define INC(x) inc x
	#define DEC(x) dec x
	#define CMP(x, y) cmp x, y
	#define TEST(x, y) test x, y
	#define JMP(x) jmp x
	#define JE(x) je x
	#define JNE(x) jne x
	#define JG(x) jg x
	#define JL(x) jl x
	#define JGE(x) jge x
	#define JLE(x) jle x
	#define CALL(x) call x
	#define RET ret
	#define PUSH(x) push x
	#define POP(x) pop x
	#define NOP nop
	#define INT(x) int x

	# Value
	#define REF(x) $x

/* ARM64 (AArch64) */
#elif defined(__aarch64__)
	# Registers
	#define RAX x0
	#define RBX x1
	#define RCX x2
	#define RDX x3
	#define RSI x4
	#define RDI x5
	#define RSP sp
	#define RBP x29
	#define R8  x8
	#define R9  x9
	#define R10 x10
	#define R11 x11
	#define R12 x12
	#define R13 x13
	#define R14 x14
	#define R15 x15
	#define RIP pc

	# Mnemonics
	#define SYSCALL svc 0
	#define MOV(x, y) mov x, y
	#define LDR(x, y, z) ldr x, [y, z]
	#define LDL(x, y) ldr x, =y
	#define LEA(x, y, z) adr x, y
	#define XOR(x, y) eor x, x, y
	#define ADD(x, y) add x, x, y
	#define SUB(x, y) sub x, x, y
	#define IMUL(x, y) mul x, x, y
	#define IDIV(x, y) sdiv x, x, y
	#define INC(x) add x, x, #1
	#define DEC(x) sub x, x, #1
	#define CMP(x, y) cmp x, y
	#define TEST(x, y) ands xzr, x, y
	#define JMP(x) b x
	#define JE(x) b.eq x
	#define JNE(x) b.ne x
	#define JG(x) b.gt x
	#define JL(x) b.lt x
	#define JGE(x) b.ge x
	#define JLE(x) b.le x
	#define CALL(x) bl x
	#define RET ret
	#define PUSH(x) str x, [sp, #-16]!
	#define POP(x) ldr x, [sp], #16
	#define NOP nop
	#define INT(x) svc x

	# Value
	#define REF(x) #EVAL(x)

#else
	#error "Unsupported architecture for register mapping"
#endif

.macro SAVE_R0_R4
	PUSH (RAX)
	PUSH (RBX)
	PUSH (RCX)
	PUSH (RDX)
	PUSH (RSI)
.endm

.macro LOAD_R0_R4
	POP (RSI)
	POP (RDX)
	POP (RCX)
	POP (RBX)
	POP (RAX)
.endm

.macro SAVE_ZASM
	PUSH (RDI)
	PUSH (RSP)
	PUSH (RBP)
	PUSH (R8)
	PUSH (R9)
	PUSH (R10)
	PUSH (R11)
	PUSH (R12)
	PUSH (R13)
	PUSH (R14)
	PUSH (R15)
.endm

.macro LOAD_ZASM
	POP (R15)
	POP (R14)
	POP (R13)
	POP (R12)
	POP (R11)
	POP (R10)
	POP (R9)
	POP (R8)
	POP (RBP)
	POP (RSP)
	POP (RDI)
.endm

.macro SAVE 
	SAVE_R0_R4
	SAVE_ZASM
.endm

.macro LOAD
	LOAD_ZASM
	LOAD_R0_R4
.endm