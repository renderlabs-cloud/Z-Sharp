// clang-format off

#pragma once

#include "../macro.i"

#define DOC_LINE(content) __STAR__ content __NL__
#define DOXYGEN_LINE(type, ...) DOC_LINE(@type __VA_ARGS__)

#define DOC(...) __C_S__ __NL__ __VA_ARGS__ __C_E__

#define RETURNS(type) DOXYGEN_LINE(return, type)
#define PARAM(type, name, description) DOXYGEN_LINE(param, type name description)

#define DETAILS(description) DOXYGEN_LINE(details, description)
#define BRIEF(description) DOXYGEN_LINE(brief, description)
#define CODE(content) DOXYGEN_LINE(code, ) content DOXYGEN_LINE(endcode, )

#define NOTE(content) DOXYGEN_LINE(note, content)
#define WARNING(content) DOXYGEN_LINE(warning, content)
#define BUG(content) DOXYGEN_LINE(bug, content)
#define TODO(content) DOXYGEN_LINE(todo, content)

#define SEE(name) DOXYGEN_LINE(see, name)

#define REF_PARAM(name) \p name