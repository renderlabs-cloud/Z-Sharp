#include <z.S>
.section .data
main_$literal.27827973$sJTUbQojDUnAv5uUAU2K4CtXvv8Lj7kZ0q2wJqYNPl46kv2cJklIRvFixhNr4He3: 
	.asciz "Brendan Lucas"
// ??? 
// ??? 
.section .text
#pragma section main
TYPE type.main_$Person$sgZ43DyNGIzQfH5HT4x0Gycuu5iW6U0w2vOiYXnrtfqRAmsIKPe7xCR3XySRoHIj
	TYPE_FIELD BYTE, type_field.main_$name$56LVTJaonZkEptWmAhmQPOY4eh077OeY1ixOBa9ZnGkQcCNlBfZqpjRt0JMUDRd2, 
TYPE_END
/* Variable myName */
/* Accessor */
MOV RDI, REF(main_$literal.27827973$sJTUbQojDUnAv5uUAU2K4CtXvv8Lj7kZ0q2wJqYNPl46kv2cJklIRvFixhNr4He3)

VAR var.main_$myName$StJAV0KUClDqFg47gsCT2QTcPKhNUfw2dqNBaAixGM094onE4pfEmb6uYbkflFDf, RDI, RDI
/* Variable me */
/* Accessor */
// ??? 

VAR var.main_$me$JVUqDk0ic1DJLSpN5mGK1Z9raYcocsW6CQhmkE1XqjMCwREYUk3FMhRBEw0yV2qr, RDI, RDI
/* Function greet */
FUNC function.main_$greet$FbIVJWvld0A4PM7Bz39BSZ1XD1Uuu2wK6GQtveeoZicd9mwNAHHHY2KKC3VpuQV3, PARAMS
 PARAM type.main_$Person$sgZ43DyNGIzQfH5HT4x0Gycuu5iW6U0w2vOiYXnrtfqRAmsIKPe7xCR3XySRoHIj, greet_main_$person$rupacFCz5tXFCfo7RT93WgMKxPaVPGbHBXygmCjpJni9QfLhFAfgWWo7jLX6MDlE
PARAMS_END
.section .data
// ??? 
greet_main_$literal.96457007$tkanqrOg5PWYElz3qNPCES8QarVX2wR18PsCZYlrlMLFaJ27B2rKcxIrLcomXtxP: 
	.asciz "Hello, ${person.name}"
.section .text
#pragma section main
/* Accessor */
// ??? 
/* Accessor */
MOV RDI, REF(greet_main_$literal.96457007$tkanqrOg5PWYElz3qNPCES8QarVX2wR18PsCZYlrlMLFaJ27B2rKcxIrLcomXtxP)

FUNC_END
/* Variable myGreeting */
/* Accessor */
// ??? 

VAR var.main_$myGreeting$C4Vj7xrufLYEHHonZ9XbizoLy9qVUMHdvOqLIMO1ADqAwC5lAUlTWRSwAPuyeWaf, RDI, RDI
