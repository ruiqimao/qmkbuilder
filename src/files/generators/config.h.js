const Generator = require('./index');

const C = require('const');

class ConfigH extends Generator {

	loadTemplate() { return require('./templates/config.h'); }

	fillTemplate() {
		const keyboard = this.keyboard;

		return {
			'rows': keyboard.rows,
			'cols': keyboard.cols,
			'row_pins': keyboard.pins.row.join(', '),
			'col_pins': keyboard.pins.col.join(', '),
			'diode_direction': (keyboard.settings.diodeDirection === C.DIODE_COL2ROW ? 'COL2ROW' : 'ROW2COL'),
			'backlight_levels': keyboard.settings.backlightLevels,
			'backlight_pin': keyboard.pins.led ? '#define BACKLIGHT_PIN ' + keyboard.pins.led : '',
			'rgb_pin': keyboard.pins.rgb ? '#define RGB_DI_PIN ' + keyboard.pins.rgb : '',
			'num_rgb': keyboard.settings.rgbNum
		};
	}

}

module.exports = ConfigH;
