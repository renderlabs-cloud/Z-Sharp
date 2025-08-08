// clang-format off
#pragma once
#include "macro.i"
#include "platform/windows.i"
#include "platform/apple.i"
#include "platform/linux.i"
#include "platform/embedded.i"

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
