#pragma once

#include "macro.i"

.macro SAVE_R0_R4
	PUSH (RAX)
	PUSH (RBX)
	PUSH (RCX)
	PUSH (RDX)
	PUSH (RSI)
.endm

.macro LOAD_R0_R4
	POP (RSI)
	POP (RDX)
	POP (RCX)
	POP (RBX)
	POP (RAX)
.endm

.macro SAVE_ZASM
	SAVE_R0_R4
	PUSH (RDI)
	PUSH (RSP)
	PUSH (RBP)
	PUSH (R8)
	PUSH (R9)
	PUSH (R10)
	PUSH (R11)
	PUSH (R12)
	PUSH (R13)
	PUSH (R14)
	PUSH (R15)
.endm

.macro LOAD_ZASM
	POP (R15)
	POP (R14)
	POP (R13)
	POP (R12)
	POP (R11)
	POP (R10)
	POP (R9)
	POP (R8)
	POP (RBP)
	POP (RSP)
	POP (RDI)
	LOAD_R0_R4
.endm

.macro SAVE 
	SAVE_R0_R4
	SAVE_ZASM
.endm

.macro LOAD
	LOAD_ZASM
	LOAD_R0_R4
.endm
