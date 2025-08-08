#include "architecture.i"
#include "platform.i"
#include "pointer.S"

.macro DEBUG value
	MOV (RCX, REF(\value))
	LEN \value
	SUB (RDX, RCX)
.endm
