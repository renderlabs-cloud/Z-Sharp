#define ZSHARP_FUNC(type, name, ...)                     \
	__attribute__((naked)) type name() {           \
		__asm__(                                   \
			"mov rdi, r7\n"                         \
			"call " #name "_impl\n"                \
			"mov r7, rax\n"                         \
			"ret\n"                                 \
		);                                         \
	}                                              \
	ZSharpValue* name##_impl(__VA_ARGS__)
