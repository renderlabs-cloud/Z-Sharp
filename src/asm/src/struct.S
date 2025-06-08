#pragma once
#include "architecture.S"

# Usage: 
# STRUCT name
#   STRUCT_FIELD field_name, size
# STRUCT_END

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
