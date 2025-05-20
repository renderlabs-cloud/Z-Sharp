#pragma once
#include "pointer.S"
#include "architecture.S"

# Allocate the table itself once
.macro LAZY_LIST_INIT name, slots
    .lcomm \name, \slots * 8
.endm

# Get address of list[index] → in %rdi
.macro LAZY_PTR_GET name, index, reg
    LEA (\name, \reg, RIP)
    MOV (REF(\index), RSI)
    IMUL (REF(8), RSI, RSI)
    ADD (RSI, \reg)
.endm

# Access item at index, allocate if null
#   name = list name
#   index = integer index
#   size = allocation size
#   reg = register for result address
.macro LAZY_BLOCK_GET name, index, size, reg
    LAZY_PTR_GET \name, \index, \reg
    MOV ((\reg), RSI)
    JNE (REF(1f), RSI)
    MALLOC \size
    MOV (RAX, \reg)
1:
    LDR (\reg, \reg)
.endm

# Set value at a specific index in a lazy list
#   name = list name
#   index = integer index
#   value = value to set (in register)
.macro LAZY_BLOCK_SET name, index, value
    LAZY_PTR_GET \name, \index, RDI
    MOV (REF(\value), RDI)
.endm
