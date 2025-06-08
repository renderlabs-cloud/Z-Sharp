#pragma once
#include "architecture.S"
#include "macro.S"

#include "platform/windows.S"
#include "platform/apple.S"
#include "platform/unix.S"
#include "platform/linux.S"

#ifdef __WIN32
	#define TARGET "MICROSOFT/WINDOWS"
	#define SYS WINDOWS
#elif TARGET_OS_MAC
	#define TARGET "APPLE/MAC-OS"
	#define SYS APPLE
#elif TARGET_OS_IPHONE
	#define TARGET "APPLE/IPHONE"
	#define SYS APPLE
#elif __linux__
	#define TARGET "LINUX"
	#define SYS LINUX
#elif __ANDROID__
	#define TARGET "ANDROID"
	#define SYS LINUX
#elif __unix__
	#define TARGET "UNIX"
	#define SYS UNIX
#else
	#define TARGET "UNKNOWN"
	#define SYS LINUX
#endif

#define SYS_GET(x) CONCAT_2(EVAL(SYS), _##x)