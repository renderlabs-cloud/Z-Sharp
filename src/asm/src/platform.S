#pragma once
#include "architecture.S"

#ifdef __WIN32
	#define TARGET "MICROSOFT/WINDOWS"
#elif TARGET_OS_MAC
	#define TARGET "APPLE/MAC-OS"
#elif TARGET_OS_IPHONE
	#define TARGET "APPLE/IPHONE"
#elif __linux__
	#define TARGET "LINUX"
#elif __ANDROID__
	#define TARGET "ANDROID"
#elif __unix__
	#define TARGET "UNIX"
#else
	#define TARGET "UNKNOWN"
#endif
