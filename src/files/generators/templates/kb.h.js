module.exports = `

#ifndef KB_H
#define KB_H

#include "quantum.h"

#define KEYMAP( \\
%keymap_1%
) { \\
%keymap_2%
}

#endif

`.trim();
