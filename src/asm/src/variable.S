#pragma once
#include "pointer.S"

.macro VAR id, value, out
	MALLOC 24                 ;// struct is 3 quads = 24 bytes
	LDL (\id, RAX)            ;// id
	LDR (\value, RAX, REF(8)) ;// value
	XOR (RCX, RCX)            ;// next = null
	LDR (RCX, RAX, REF(16))
	MOV (RAX, \out)           ;// return pointer in `out`
.endm

# Set a variable in current_scope
# If it exists: update
# Else: prepend new node
.macro SET_VAR id, value
	SAVE_R0_R4
	MOV (current_scope, RBX) ;// start of list
.loop:
	CMP (RBX, 0)
	JE .not_found

	MOV ((RBX), RCX)     ;// read id
	CMP (RCX, \id)
	JE .update

	MOV (16(RBX), RBX)   ;// next node
	JMP .loop

.update:
	MOV (\value, 8(RBX)) ;// update value
	JMP .done
.done:
	LOAD_R0_R4
.endm

# Get a variable by id → out
.macro GET_VAR id, out
	SAVE_R0_R4
	MOV (current_scope, RBX)
.loop:
	CMP (RBX, 0)
	JE .not_found

	MOV ((RBX), RCX)
	CMP (RCX, \id)
	JE .found

	MOV (16(RBX), RBX)
	JMP .loop

.found:
	MOV (8(RBX), \out)
	JMP .end
.end:
	LOAD_R0_R4
.endm