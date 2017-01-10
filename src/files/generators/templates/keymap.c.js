module.exports = `

#include "kb.h"

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {

%keymaps%

};

const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt) {
	keyevent_t event = record->event;

	switch (id) {
%macros%
	}
	return MACRO_NONE;
}

%quantum%

void led_set_user(uint8_t usb_led) {

	if (usb_led & (1 << USB_LED_NUM_LOCK)) {
		%led_on_num%
	} else {
		%led_off_num%
	}

	if (usb_led & (1 << USB_LED_CAPS_LOCK)) {
		%led_on_caps%
	} else {
		%led_off_caps%
	}

	if (usb_led & (1 << USB_LED_SCROLL_LOCK)) {
		%led_on_scroll%
	} else {
		%led_off_scroll%
	}

	if (usb_led & (1 << USB_LED_COMPOSE)) {
		%led_on_compose%
	} else {
		%led_off_compose%
	}

	if (usb_led & (1 << USB_LED_KANA)) {
		%led_on_kana%
	} else {
		%led_off_kana%
	}

}

`.trim();
