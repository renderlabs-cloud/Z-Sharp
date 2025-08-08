// clang-format off
#pragma once

#define EVAL(x) x

#define HST(...) #__VA_ARGS__
#define STR(x) HST(#x)

#define CONCAT_2(a, b) CONCAT_IMPL(a, b)
#define CONCAT_3(a, b, c) CONCAT_IMPL(a, CONCAT_IMPL(b, c))
#define CONCAT_4(a, b, c, d) CONCAT_IMPL(CONCAT_IMPL(a, b), CONCAT_IMPL(c, d))

#define CONCAT_IMPL(a, b) a##b

#define CONCAT_IMPL_C(...) __VA_ARGS__

#define __STAR__ *