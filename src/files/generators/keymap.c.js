const Generator = require('./index');

const C = require('const');

class KeymapC extends Generator {

	loadTemplate() { return require('./templates/keymap.c'); }

	fillTemplate() {
		const keyboard = this.keyboard;

		// Generate the keymaps.
		let keymaps = '';
		for (let layer = 0; layer < C.KEYMAP_MAX_LAYERS; layer ++) {
			let layerMap = '\tKEYMAP(\n\t\t';
			for (let row = 0; row < keyboard.rows; row ++) {
				for (let col = 0; col < keyboard.cols; col ++) {
					const key = keyboard.wiring[row + ',' + col];
					if (!key || !key.length) continue;

					layerMap += key[0].keycodes[layer].getCode() + ', ';
				}
				layerMap += '\n\t\t';
			}
			layerMap = layerMap.substring(0, layerMap.length - 5) + '),\n\n';
			keymaps += layerMap;
		}
		keymaps = keymaps.substring(0, keymaps.length - 3);

		// Generate the macros.
		let macros = '';
		for (const macroId in keyboard.macros) {
			macros += '\t\tcase ' + macroId + ':\n\t\t\tif (record->event.pressed) {\n\t\t\t\treturn MACRO( ';

			for (const action of keyboard.macros[macroId]) {
				switch (action.action) {
					case C.MACRO_NONE: continue;
					case C.MACRO_INTERVAL: macros += 'I('; break;
					case C.MACRO_DOWN: macros += 'D('; break;
					case C.MACRO_UP: macros += 'U('; break;
					case C.MACRO_TYPE: macros += 'T('; break;
					case C.MACRO_WAIT: macros += 'W('; break;
				}
				switch (action.action) {
					case C.MACRO_INTERVAL:
					case C.MACRO_WAIT:
						macros += action.argument;
						break;
					case C.MACRO_DOWN:
					case C.MACRO_UP:
					case C.MACRO_TYPE:
						macros += action.argument.substring(3);
						break;
				}
				macros += '), ';
			}

			macros += 'END );\n\t\t\t}\n\t\t\tbreak;\n';
		}
		macros = macros.substring(0, macros.length - 1);

		return {
			'keymaps': keymaps,
			'macros': macros,
			'quantum': keyboard.quantum,
			'led_on_num': this.generateLedOn(keyboard.pins.num),
			'led_off_num': this.generateLedOff(keyboard.pins.num),
			'led_on_caps': this.generateLedOn(keyboard.pins.caps),
			'led_off_caps': this.generateLedOff(keyboard.pins.caps),
			'led_on_scroll': this.generateLedOn(keyboard.pins.scroll),
			'led_off_scroll': this.generateLedOff(keyboard.pins.scroll),
			'led_on_compose': this.generateLedOn(keyboard.pins.compose),
			'led_off_compose': this.generateLedOff(keyboard.pins.compose),
			'led_on_kana': this.generateLedOn(keyboard.pins.kana),
			'led_off_kana': this.generateLedOff(keyboard.pins.kana)
		};
	}

	/*
	 * Generate the code to turn an LED on given a pin.
	 *
	 * @param {String} pin The pin.
	 *
	 * @return {String} The generated code.
	 */
	generateLedOn(pin) {
		if (!pin) return '';

		const port = pin[0];
		const num = pin[1];

		return 'DDR' + port + ' |= (1 << ' + num + '); PORT' + port + ' &= ~(1 << ' + num + ');';
	}

	/*
	 * Generate the code to turn an LED off given a pin.
	 *
	 * @param {String} pin The pin.
	 *
	 * @return {String} The generated code.
	 */
	generateLedOff(pin) {
		if (!pin) return '';

		const port = pin[0];
		const num = pin[1];

		return 'DDR' + port + ' &= ~(1 << ' + num + '); PORT' + port + ' &= ~(1 << ' + num + ');';
	}

}

module.exports = KeymapC;
