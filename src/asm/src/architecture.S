#pragma once

#define EVAL(x) x

/*
 * R0 - R4 : Mnemonic control
 * R5      : Scope
 * R6      : Selector control
 * R7      : Parameter control
 * R8      : Stack
 * R9 - R14: Unallocated
 * R15     : Temporary
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
    #define LDR(x, y) mov (x), y
    #define LEA(x, y, z) lea x(z), y
	#define XOR(x, y) xor x, y
	#define ADD(x, y) add x, y
	#define SUB(x, y) sub x, y
	#define IMUL(x, y) imul x, y

	#define JNE(x, y) jne x, y
	
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

    #define RIP rip

    # Mnemonics
    #define SYSCALL svc 0
	#define MOV(x, y) mov y, x
	#define LDR(x, y) ldr y, [x]
	#define LEA(x, y, z) adr y, x
	#define XOR(x, y) eor x, x, y
	#define ADD(x, y) add x, x, y
	#define SUB(x, y) sub x, x, y
	#define IMUL(x, y, z) MOV(x, R15) __NL__ \
						  MUL R15, y, z

	#define JNE(x, y) 
	
    # Value
    #define REF(x) #EVAL(x)
#else
    #error "Unsupported architecture for register mapping"
#endif
