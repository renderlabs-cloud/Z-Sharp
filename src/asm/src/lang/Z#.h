// clang-format off
#pragma once

#include "../architecture.i"
#include "../platform.i"

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