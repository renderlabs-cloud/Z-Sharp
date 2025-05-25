.macro FUNC name, _
.section .text
.global \name
\name:
.endm

.macro PARAM type, name
# Store param info
.byte 0x10
.asciz "\name"
.byte \type
.endm

.macro PARAMS_END
.byte 0x11
.endm

.macro FUNC_END
.byte 0xFF
.endm
