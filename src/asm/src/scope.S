#pragma once
#include "pointer.S"

# A scope is just a pointer to a linked list (initially null)
.macro SCOPE name, parent
	XOR (RAX, RAX)   ;// null pointer
	MOV (RAX, \name) ;// scope = null list
	MOV (RAX, RDX)
.endm

.macro SET_SCOPE ptr
	MOV (\ptr, RDX)
.endm
