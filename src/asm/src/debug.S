#include "architecture.S"
#include "platform.S"
#include "pointer.S"

.macro DEBUG value
	MOV (RCX, REF(\value))
	LEN \value
	SUB (RDX, RCX)
.endm
