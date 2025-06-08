#pragma once

#define EVAL(x) x

#define CONCAT_2(a, b) CONCAT_IMPL(a, b)
#define CONCAT_3(a, b, c) CONCAT_IMPL(a, CONCAT_IMPL(b, c))
#define CONCAT_4(a, b, c, d) CONCAT_IMPL(CONCAT_IMPL(a, b), CONCAT_IMPL(c, d))

#define CONCAT_IMPL(a, b) a##b