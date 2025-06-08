.macro FUNC name, _
	.section .text
	.global \name
\name:
.endm

.macro PARAM type, name
	# Store param info
	.quad 0x10
	.asciz "\name"
	.quad \type
.endm

.macro PARAMS_END
	.quad 0x11
.endm

.macro FUNC_END
	.quad 0xFF
.endm
