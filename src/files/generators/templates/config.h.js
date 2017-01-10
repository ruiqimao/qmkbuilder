module.exports = `

#ifndef CONFIG_H
#define CONFIG_H

#include "config_common.h"

/* USB Device descriptor parameter */
#define VENDOR_ID       0xFEED
#define PRODUCT_ID      0x6060
#define DEVICE_VER      0x0001
#define MANUFACTURER    qmkbuilder
#define PRODUCT         keyboard
#define DESCRIPTION     Keyboard

/* key matrix size */
#define MATRIX_ROWS %rows%
#define MATRIX_COLS %cols%

/* key matrix pins */
#define MATRIX_ROW_PINS { %row_pins% }
#define MATRIX_COL_PINS { %col_pins% }
#define UNUSED_PINS

/* COL2ROW or ROW2COL */
#define DIODE_DIRECTION %diode_direction%

/* number of backlight levels */
%backlight_pin%
#ifdef BACKLIGHT_PIN
#define BACKLIGHT_LEVELS %backlight_levels%
#endif

/* Set 0 if debouncing isn't needed */
#define DEBOUNCING_DELAY 5

/* Mechanical locking support. Use KC_LCAP, KC_LNUM or KC_LSCR instead in keymap */
#define LOCKING_SUPPORT_ENABLE

/* Locking resynchronize hack */
#define LOCKING_RESYNC_ENABLE

/* key combination for command */
#define IS_COMMAND() ( \\
    keyboard_report->mods == (MOD_BIT(KC_LSHIFT) | MOD_BIT(KC_RSHIFT)) \\
)

/* prevent stuck modifiers */
#define PREVENT_STUCK_MODIFIERS

%rgb_pin%
#ifdef RGB_DI_PIN
#define RGBLIGHT_ANIMATIONS
#define RGBLED_NUM %num_rgb%
#define RGBLIGHT_HUE_STEP 8
#define RGBLIGHT_SAT_STEP 8
#define RGBLIGHT_VAL_STEP 8
#endif

#endif

`.trim();
