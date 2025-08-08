// clang-format off
#pragma once

#include "macro.i"

/**
 * # Register usage
 *
 * Z0 - Z4  : Mnemonic control
 * Z5       : Scope
 * Z6       : Selector control
 * Z7       : Parameters
 * Z8       : Control flow
 * Z9       : Stack control
 * Z10 - Z13: Unallocated
 * Z14      : Debugger control
 * Z15      : PC
 */

/* Architecture mapping */

/* x86_64 (64-bit) */
#define ARCH 0;
#if defined(__x86_64__) || defined(__amd64__)
	#define ARCH "x86_64"

	// Registers
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

	// Mnemonics
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
	#define CALL_REG(x) call x
	#define RET ret
	#define PUSH(x) push x
	#define POP(x) pop x
	#define NOP nop
	#define INT(x) int x

	// Value
	#define REF(x) $x

/* ARM64 (AArch64) */
#elif defined(__aarch64__)
	#define ARCH "aarch64"

	// Registers
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

	// Mnemonics
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
	#define INC(x) add x, x, REF(1)
	#define DEC(x) sub x, x, REF(1)
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
	#define CALL_REG(x) blr x
	#define RET ret
	#define PUSH(x) str x, [sp, REF(-16)]!
	#define POP(x) ldr x, [sp], REF(16)
	#define NOP nop
	#define INT(x) svc x

	// Value
	#define REF(x) x

#else
	#error "Unsupported architecture for register mapping"
#endif

/* Z# Virtual registers */
#define Z0  RAX
#define Z1  RBX
#define Z2  RCX
#define Z3  RDX
#define Z4  RSI
#define Z5  RDI
#define Z6  RBP
#define Z7  R8
#define Z8  R9
#define Z9  R10
#define Z10 R11
#define Z11 R12
#define Z12 R13
#define Z13 R14
#define Z14 R15
#define Z15 RIP

#if defined (__x86_64__) || defined(__amd64__)
	/* System call registers */
	#define Z_RC RAX
	#define Z_R1 RDI
	#define Z_R2 RSI
	#define Z_R3 RDX
	#define Z_R4 R10
	#define Z_R5 R8
	#define Z_R6 R9

#elif defined(__aarch64__)
	/* System call registers */
	#define Z_RC x8
	#define Z_R1 x0
	#define Z_R2 x1
	#define Z_R3 x2
	#define Z_R4 x3
	#define Z_R5 x4
	#define Z_R6 x5
	#define Z_R7 x6
	#define Z_R8 x7
	#define Z_RR x0
#endif


#define Z_R(x) HST(x)
#define A_L(x) Z_R(CONCAT_IMPL_C(x))