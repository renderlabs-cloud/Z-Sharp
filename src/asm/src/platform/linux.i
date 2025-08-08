#pragma once

#include <sys/syscall.h>

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