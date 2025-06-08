#pragma once

#include "architecture.S"

.section .data
debug_msg:
	.asciz "Hello, Debug!"

.section .text
.global _start
_start:
	DEBUG debug_msg

