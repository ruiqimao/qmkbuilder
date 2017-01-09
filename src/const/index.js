const keycodes = require('./keycodes');

const C = {

	// Version.
	VERSION: 1,

	// Screens.
	SCREEN_MAIN:     0,
	SCREEN_WIRING:   1,
	SCREEN_PINS:     2,
	SCREEN_KEYMAP:   3,
	SCREEN_MACROS:   4,
	SCREEN_SETTINGS: 5,
	SCREEN_COMPILE:  6,

	// Display properties.
	KEY_SIZE: 60,
	KEY_SIZE_MIN: 45,
	KEY_SIZE_MAX: 75,
	KEY_SIZE_INC: 5,

	// Key properties.
	KEY_SELECT: 1,
	KEY_PROGRAM: 2,

	// Diode direction.
	DIODE_COL2ROW: 0,
	DIODE_ROW2COL: 1,

	// Controllers.
	CONTROLLER_ATMEGA32U2: 0,
	CONTROLLER_ATMEGA32U4: 1,
	CONTROLLER_AT90USB1286: 2,

	// Pins.
	PINS: {
		0: [ // CONTROLLER_ATMEGA32U2
			'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
			'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
			'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'
		],
		1: [ // CONTROLLER_ATMEGA32U4
			'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
			'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
			'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7',
			'E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7',
			'F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'
		],
		2: [ // CONTROLLER_AT90USB1286
			'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
			'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
			'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
			'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7',
			'E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7',
			'F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'
		]
	},

	// Keycodes.
	KEYCODES: keycodes.KEYCODES,
	KEYCODE_ALIASES: keycodes.ALIASES,
	KEYCODE_CATEGORIES: keycodes.CATEGORIES,
	KEYCODE_REVERSE_CATEGORIES: keycodes.REVERSE_CATEGORIES,
	KEYCODE_NUMBERS: keycodes.NUMBERS,
	KEYCODE_SPECIAL: keycodes.SPECIAL,
	KEYCODE_RECOMMENDED: keycodes.RECOMMENDED,

	// Keymap.
	KEYMAP_MAX_LAYERS: 16,

	// Macros.
	MACRO_NONE:     0,
	MACRO_INTERVAL: 1,
	MACRO_DOWN:     2,
	MACRO_UP:       3,
	MACRO_TYPE:     4,
	MACRO_WAIT:     5,

	// Bootloader sizes.
	BOOTLOADER_512: 0,
	BOOTLOADER_2048: 1,
	BOOTLOADER_4096: 2

};

module.exports = C;
