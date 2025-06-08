# 0 "test/test.iz"
# 0 "<built-in>"
# 0 "<command-line>"
# 1 "/usr/include/stdc-predef.h" 1 3 4
# 0 "<command-line>" 2
# 1 "test/test.iz"
# 1 "src/asm/dist/z.S" 1
# 47 "src/asm/dist/z.S"
# Architecture mapping
# 104 "src/asm/dist/z.S"
;// !  # Registers
# 123 "src/asm/dist/z.S"
 # Mnemonics
# 152 "src/asm/dist/z.S"
 # Value

;// ! 




;// ! .macro SAVE_R0_R4
 str x0, [sp, #-16]!
 str x1, [sp, #-16]!
 str x2, [sp, #-16]!
 str x3, [sp, #-16]!
 str x4, [sp, #-16]!
.endm

.macro LOAD_R0_R4
 ldr x4, [sp], #16
 ldr x3, [sp], #16
 ldr x2, [sp], #16
 ldr x1, [sp], #16
 ldr x0, [sp], #16
.endm

.macro SAVE_ZASM
 str x5, [sp, #-16]!
 str sp, [sp, #-16]!
 str x29, [sp, #-16]!
 str x8, [sp, #-16]!
;// !  str x9, [sp, #-16]!
 str x10, [sp, #-16]!
 str x11, [sp, #-16]!
 str x12, [sp, #-16]!
 str x13, [sp, #-16]!
 str x14, [sp, #-16]!
 str x15, [sp, #-16]!
.endm

.macro LOAD_ZASM
 ldr x15, [sp], #16
 ldr x14, [sp], #16
 ldr x13, [sp], #16
 ldr x12, [sp], #16
 ldr x11, [sp], #16
 ldr x10, [sp], #16
 ldr x9, [sp], #16
 ldr x8, [sp], #16
 ldr x29, [sp], #16
 ldr sp, [sp], #16
 ldr x5, [sp], #16
.endm

.macro SAVE
 SAVE_R0_R4
 SAVE_ZASM
.endm

.macro LOAD
 LOAD_ZASM
 LOAD_R0_R4
.endm
# 302 "src/asm/dist/z.S"
# Allocate N bytes → result in %rax
.macro MALLOC size
 SAVE_ZASM
 mov x0, #9 ;
 mov x5, #0 ;
 mov x4, #\size ;
 mov x3, #3 ;
 mov x10, #0x22 ;
 mov x8, #-1 ;
 mov #0, x9 ;
 svc 0
 LOAD_ZASM
.endm

# Read value at pointer → %reg
# ptr = register with pointer
# reg = output register
.macro PTR_READ ptr, reg
    mov [\ptr], \reg
.endm

# Write value to pointer
# value = register with value
# ptr = pointer register
.macro PTR_WRITE value, ptr
    mov \value, [\ptr]
.endm

# Store value in memory, and return a pointer to it
# value = register with value
# out = output register with pointer
.macro PTR_CREATE value, size, out
    SAVE_R0_R4
    MALLOC \size ;
    mov \value, [x0] ;
    mov x0, \out ;
    LOAD_R0_R4
.endm

.macro LEN ptr, out
 SAVE_R0_R4
 mov \ptr, x2
1:
 mov [x2], x3
 cmp x3, #0
 b.eq 2f
 add x2, x2, #1
 b 1b
2:
 mov x2, \out
 LOAD_R0_R4
.endm

.macro FREE ptr, size
 SAVE
 mov #11, x0 ;
 mov \ptr, x5 ;
 mov #\size, x4 ;
 svc 0
 LOAD
.endm

.macro DEBUG value
 mov x2, #\value
 LEN \value
 sub x3, x3, x2
.endm

.section .data
debug_msg:
 .asciz "Hello, Debug!"

.section .text
.global _start
_start:
 DEBUG debug_msg

# Allocate the table itself once
.macro LAZY_LIST_INIT name, slots
    .lcomm \name, \slots * 8
.endm

# Get address of list[index] → in %rdi
.macro LAZY_PTR_GET name, index, reg
 SAVE
 adr \name, \reg
 mov #\index, x4
 mul #8, #8, x4
 add x4, x4, \reg
 LOAD
.endm

# Access item at index, allocate if null
# name = list name
# index = integer index
# size = allocation size
# reg = register for result address
.macro LAZY_BLOCK_GET name, index, size, reg
 SAVE
 LAZY_PTR_GET \name, \index, \reg
 mov (\reg), x4
;// !  b.ne #1f
 MALLOC \size
 mov x0, \reg
1:
 ldr \reg, [\reg, 0]
 LOAD
.endm

# Set value at a specific index in a lazy list
# name = list name
# index = integer index
# value = value to set (in register)
.macro LAZY_BLOCK_SET name, index, value
 SAVE
 LAZY_PTR_GET \name, \index, x5
 mov #\value, x5
 LOAD
.endm

# Usage:
# STRUCT name
# STRUCT_FIELD field_name, size
;// ! # STRUCT_END

.set STRUCT_OFFSET, 0

.macro STRUCT name
 .set \name\()_SIZE, 0
 .pushsection .data
\name:
.endm

.macro STRUCT_FIELD name, size
\name:
 .skip \size
 .set STRUCT_OFFSET, STRUCT_OFFSET + \size
.endm

.macro STRUCT_END
 .popsection
 .set STRUCT_SIZE, STRUCT_OFFSET
 .set STRUCT_OFFSET, 0
.endm

.macro ALIGN boundary
 .balign \boundary
.endm

.macro VAR id, value, out
 MALLOC 24 ;
 ldr \id, =x0 ;
 ldr \value, [x0, #8] ;
 eor x2, x2, x2 ;
 ldr x2, [x0, #16]
 mov x0, \out ;
.endm

# Set a variable in current_scope
# If it exists: update
# Else: prepend new node
.macro SET_VAR id, value
 SAVE_R0_R4
 mov current_scope, x1 ;
.loop:
 cmp x1, 0
 JE .not_found

 mov (x1), x2 ;
 cmp x2, \id
 JE .update

 mov 16(x1), x1 ;
 JMP .loop

.update:
 mov \value, 8(x1) ;
 JMP .done
.done:
 LOAD_R0_R4
.endm

# Get a variable by id → out
.macro GET_VAR id, out
 SAVE_R0_R4
 mov current_scope, x1
.loop:
 cmp x1, 0
 JE .not_found

 mov (x1), x2
 cmp x2, \id
 JE .found

 mov 16(x1), x1
 JMP .loop

.found:
 mov 8(x1), \out
 JMP .end
.end:
 LOAD_R0_R4
.endm
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

# Type initialization
.macro TYPE name
 STRUCT \name
.endm
;// ! 
.macro TYPE_FIELD type, name, size

  STRUCT_FIELD \name, \size

.endm

;// ! .macro TYPE_END
 STRUCT_END
;// ! .endm
# 2 "test/test.iz" 2
.section .data
main_$literal.16517599$XWQANKxfJqjFHIUTLFUE6kvbJqydueuybruzcwbF15NpZCbFIigObcTCCpDsReSM:
 .asciz "Brendan Lucas"



.section .text

TYPE type.main_$Person$jHfx7HAO6FCaIiP0qQKi0KfhEmbIni3KSyPjGla5v6QWRMzmcR0MC32SJKlLRFcm
 TYPE_FIELD BYTE, type_field.main_$name$fRQyAJJi2KL9P3mQb6fJZjkbujTSibshFSmoeIoWLghCROnjGEsXodCvaJJaOHEx,
TYPE_END


MOV x5, #main_$literal.16517599$XWQANKxfJqjFHIUTLFUE6kvbJqydueuybruzcwbF15NpZCbFIigObcTCCpDsReSM

VAR var.main_$myName$MAEstr000zjW8ntnigtcWShiWnUuJd75gjFc0hCFld2gDUDAhLrMAsQS2vuPTecM, x5, x5




VAR var.main_$me$UbWVDO5msXtzIGvDfQZRk96XWPlq9ulo1dGz8wEZgyhx1dukoxITp2jCRklXMeIU, x5, x5

FUNC function.main_$greet$MtDxp9nsSN7elnhRZ07G5E9H2PUeCVQrq4eIikfdhmxTmA2XylijI6LHjusu9Exm, PARAMS
 PARAM type.main_$Person$jHfx7HAO6FCaIiP0qQKi0KfhEmbIni3KSyPjGla5v6QWRMzmcR0MC32SJKlLRFcm, greet_main_$person$VzXozD10lgqvjiTve2eimYuXqstosoNIr1bkB4Z7epYrIcsz3P4q6WESk5J0E6DF
PARAMS_END
.section .data

greet_main_$literal.71697874$2f63SfxbrdhS4zBJnj1ktKLsEcWzDoA7t4fPYtmKnqdOIF5am9um7myfmArJHxDN:
 .asciz "Hello, ${person.name}"
.section .text




MOV x5, #greet_main_$literal.71697874$2f63SfxbrdhS4zBJnj1ktKLsEcWzDoA7t4fPYtmKnqdOIF5am9um7myfmArJHxDN

FUNC_END




VAR var.main_$myGreeting$hRA63InbCshSPKQWHRX4coxPHGAzf6ACMBk7ea7kiU0wPWuVADgDLNONaSHMguuu, x5, x5
