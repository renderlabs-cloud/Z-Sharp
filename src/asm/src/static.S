

.macro STRING name, string
	.section data
		\name: .asciz \string
	.section text
.endm
