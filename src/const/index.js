const Keycodes = require('./keycodes');
const Presets = require('./presets');
const Local = require('./local');

const C = {

	// Version.
	VERSION: 1,

	// Screens.
	SCREEN_MAIN:     0,
	SCREEN_WIRING:   1,
	SCREEN_PINS:     2,
	SCREEN_KEYMAP:   3,
	SCREEN_MACROS:   4,
	SCREEN_QUANTUM:  5,
	SCREEN_SETTINGS: 6,
	SCREEN_COMPILE:  7,

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
	KEYCODES: Keycodes.KEYCODES,
	KEYCODE_ALIASES: Keycodes.ALIASES,
	KEYCODE_CATEGORIES: Keycodes.CATEGORIES,
	KEYCODE_REVERSE_CATEGORIES: Keycodes.REVERSE_CATEGORIES,
	KEYCODE_NUMBERS: Keycodes.NUMBERS,
	KEYCODE_SPECIAL: Keycodes.SPECIAL,
	KEYCODE_RECOMMENDED: Keycodes.RECOMMENDED,

	// Keymap.
	KEYMAP_MAX_LAYERS: 16,

	// KLE legend position indices (see https://github.com/ijprest/keyboard-layout-editor/wiki/Serialized-Data-Format).
	POSITION_TO_INDEX: {
		'top left': 0,
		'bottom left': 1,
		'top right': 2,
		'bottom right': 3,
		'front left': 4,
		'front right': 5,
		'center left': 6,
		'center right': 7,
		'top center': 8,
		'center': 9,
		'bottom center': 10,
		'front center': 11
	},

	// Macros.
	MACRO_NONE:     0,
	MACRO_INTERVAL: 1,
	MACRO_DOWN:     2,
	MACRO_UP:       3,
	MACRO_TYPE:     4,
	MACRO_WAIT:     5,

	// Quantum.
	QUANTUM_DEFAULT: `
void matrix_init_user(void) {
}

void matrix_scan_user(void) {
}

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
	return true;
}`.trim(),

	// Bootloader sizes.
	BOOTLOADER_512: 0,
	BOOTLOADER_2048: 1,
	BOOTLOADER_4096: 2,
	BOOTLOADER_8192: 3,

	// Presets.
	PRESETS: Presets,

	// Local settings.
	LOCAL: Local

};

module.exports = C;
