#include <sys/syscall.h>
// clang-format off

#define EVAL(x) x

#define HST(...) #__VA_ARGS__
#define STR(x) HST(#x)

#define CONCAT_2(a, b) CONCAT_IMPL(a, b)
#define CONCAT_3(a, b, c) CONCAT_IMPL(a, CONCAT_IMPL(b, c))
#define CONCAT_4(a, b, c, d) CONCAT_IMPL(CONCAT_IMPL(a, b), CONCAT_IMPL(c, d))

#define CONCAT_IMPL(a, b) a##b

#define CONCAT_IMPL_C(...) __VA_ARGS__

#define __STAR__ *
// clang-format off

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

#define WINDOWS_SYSCALL_EXIT 0x0
#define WINDOWS_SYSCALL_WRITE 0x0
#define WINDOWS_SYSCALL_READ 0x0
#define WINDOWS_SYSCALL_OPEN 0x0
#define WINDOWS_SYSCALL_CLOSE 0x0
#define WINDOWS_SYSCALL_FORK 0x0
#define WINDOWS_SYSCALL_EXECVE 0x0
#define WINDOWS_SYSCALL_WAIT4 0x0
#define WINDOWS_SYSCALL_GETPID 0x0
#define WINDOWS_SYSCALL_GETUID 0x0
#define WINDOWS_SYSCALL_GETGID 0x0
#define WINDOWS_SYSCALL_BRK 0x0
#define WINDOWS_SYSCALL_MMAP 0x0
#define WINDOWS_SYSCALL_MUNMAP 0x0
#define WINDOWS_SYSCALL_CLONE 0x0

#define APPLE_SYSCALL_EXIT 0x2000001
#define APPLE_SYSCALL_WRITE 0x2000004
#define APPLE_SYSCALL_READ 0x2000003
#define APPLE_SYSCALL_OPEN 0x2000005
#define APPLE_SYSCALL_CLOSE 0x2000006
#define APPLE_SYSCALL_FORK 0x2000002
#define APPLE_SYSCALL_EXECVE 0x200003b
#define APPLE_SYSCALL_WAIT4 0x2000007
#define APPLE_SYSCALL_GETPID 0x2000014
#define APPLE_SYSCALL_GETUID 0x2000018
#define APPLE_SYSCALL_GETGID 0x200001a
#define APPLE_SYSCALL_BRK 0x2000034
#define APPLE_SYSCALL_MMAP 0x20000c5
#define APPLE_SYSCALL_MUNMAP 0x2000049
#define APPLE_SYSCALL_CLONE 0x20000fa

#define LINUX_SYSCALL_EXIT SYS_exit
#define LINUX_SYSCALL_WRITE SYS_write
#define LINUX_SYSCALL_READ SYS_read
#define LINUX_SYSCALL_OPEN SYS_open
#define LINUX_SYSCALL_CLOSE SYS_close
#define LINUX_SYSCALL_FORK SYS_fork
#define LINUX_SYSCALL_EXECVE SYS_execve
#define LINUX_SYSCALL_WAIT4 SYS_wait4
#define LINUX_SYSCALL_GETPID SYS_getpid
#define LINUX_SYSCALL_GETUID SYS_getuid
#define LINUX_SYSCALL_GETGID SYS_getgid
#define LINUX_SYSCALL_BRK SYS_brk
#define LINUX_SYSCALL_MMAP SYS_mmap
#define LINUX_SYSCALL_MUNMAP SYS_munmap
#define LINUX_SYSCALL_CLONE SYS_clone
// ...
// clang-format off

#if defined __WIN32
	#define TARGET "WINDOWS"
	#define SYS WINDOWS
	#define SYS_CASE_WINDOWS(...) __VA_ARGS__
#elif defined TARGET_OS_MAC
	#define TARGET "APPLE"
	#define SYS APPLE
#elif defined TARGET_OS_IPHONE
	#define TARGET "APPLE"
	#define SYS APPLE
#elif defined __linux__
	#define TARGET "LINUX"
	#define SYS LINUX
#elif defined __unix__
	#define TARGET "UNIX"
	#define SYS UNIX
#else
	#define TARGET "UNKNOWN"
	#define SYS "UNKNOWN"
#endif

#define SYSCALL_GET(x) CONCAT_2(EVAL(SYS), _SYSCALL_##x)

// clang-format off

/**
 * # This file is for the compadibility of C / C++ with Intermediate Z#.
 * Mostly for the usage of C++.
 */

typedef char uint32_t;
typedef uint32_t byte;

/**
 * # Inline assembly
 */
#define ZSHARP_ASM(...) \
	__asm__ volatile (__VA_ARGS__)

#define ZSHARP_IMPL(name) \
	name##_impl
	

/**
 * # Inline function
 */
#define ZSHARP_FUNC(type, name, ...) \
type ZSHARP_IMPL(name)(__VA_ARGS__); \
void name() { \
	ZSHARP_ASM( \
		A_L(MOV(Z5, Z7)) "\n" \
		A_L(CALL_REG(%0)) "\n" \
		A_L(MOV(Z6, Z_RC)) "\n" \
		A_L(RET) "\n" \
		: \
		: "r"(ZSHARP_IMPL(name)) \
	); \
}; \
type ZSHARP_IMPL(name)(__VA_ARGS__)

#if defined __cplusplus
	/**
	 * # Inline namespace
	 */
	#define ZSHARP_NAMESPACE(name) \
		namespace name

	/**
	 * # Inline generic
	 */
	#define ZSHARP_GENERIC(name) \
		template<typename name>

	/**
	 * # Inline class
	 */
	#define ZSHARP_CLASS(name) \
		class ZSHARP_IMPL(name)

	/**
	 * # Inline class extensions
	 */
	#define ZSHARP_CLASS_EXTENDS(name) \
		: public ZSHARP_IMPL(name)

	/**
	 * # Inline class constructor
	*/
	#define ZSHARP_CLASS_CONSTRUCTOR(name, ...) \
		ZSHARP_IMPL(name)(__VA_ARGS__)
	
	/**
	 * # Inline class public attribute
	*/
	#define ZSHARP_CLASS_PUBLIC \
		public:

	/**
	 * # Inline class private attribute
	*/
	#define ZSHARP_CLASS_PRIVATE \
		private:

	/**
	 * # Inline class protected attribute
	*/
	#define ZSHARP_CLASS_PROTECTED \
		protected:

	/**
	 * # Inline class readonly attribute
	 */
	#define ZSHARP_CLASS_READONLY \
		public: const \

	/**
	 * # Inline operator
	 */
	#define ZSHARP_OPERATOR(type, operation, ...) \
		type operator operation(__VA_ARGS__)
	
#else
	#error "This feature is only for C++."
#endif