#pragma once
#include "struct.S"
#include "pointer.S"
#include "memory.S"
#include "architecture.S"

# Type initialization
.macro TYPE name
	STRUCT \name
.endm

.macro TYPE_FIELD type, name
	#if type == BYTE
		STRUCT_FIELD \name
	#endif
.endm

.macro TYPE_END
	STRUCT_END
.endm
