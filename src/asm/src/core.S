#include "legal.S"

#include "platform.S"
#include "type.S"
#include "memory.S"
#include "debug.S"
#include "architecture.S"
#include "static.S"

TYPE Person
    TYPE_FIELD BYTE, name, 32
    TYPE_FIELD BYTE, id, 1
TYPE_END

LAZY_LIST_INIT my_list, 10

# LAZY_BLOCK_GET my_list, 5, 8, R15

LAZY_BLOCK_SET my_list, 5, 100

# DEBUG R15
