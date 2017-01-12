const Generator = require('./index');

const Utils = require('utils');

class KeyboardH extends Generator {

	loadTemplate() { return require('./templates/kb.h'); }

	fillTemplate() {
		const keyboard = this.keyboard;

		// Generate the keymaps.
		const keymap1 = (() => {
			const rowLength = String(keyboard.rows).length;
			const colLength = String(keyboard.cols).length;
			const space = ' '.repeat(rowLength + colLength + 3);

			let result = '';

			for (let row = 0; row < keyboard.rows; row ++) {
				const sRow = Utils.leftPad(String(row), rowLength, '0');

				let rowString = '';
				for (let col = 0; col < keyboard.cols; col ++) {
					const sCol = Utils.leftPad(String(col), colLength, '0');

					if (keyboard.wiring[row + ',' + col]) {
						rowString += 'K' + sRow + sCol + ', ';
					} else {
						rowString += space;
					}
				}

				if (row === keyboard.rows - 1) {
					rowString = rowString.replace(/,[ ]*?$/, ', ');
				}
				result += '\t' + rowString + '\\\n';
			}

			result = result.substring(0, result.length - 4) + '  \\';

			return result;
		})();

		const keymap2 = (() => {
			const rowLength = String(keyboard.rows).length;
			const colLength = String(keyboard.cols).length;
			const cellLength = Math.max(rowLength + colLength + 1, 'KC_NO'.length) + 2;

			let result = '';

			for (let row = 0; row < keyboard.rows; row ++) {
				const sRow = Utils.leftPad(String(row), rowLength, '0');

				let rowString = '';
				for (let col = 0; col < keyboard.cols; col ++) {
					const sCol = Utils.leftPad(String(col), colLength, '0');

					if (keyboard.wiring[row + ',' + col]) {
						rowString += Utils.rightPad('K' + sRow + sCol + ', ', cellLength);
					} else {
						rowString += Utils.rightPad('KC_NO' + ', ', cellLength);
					}
				}

				rowString = rowString.trim();
				result += '\t{ ' + rowString.substring(0, rowString.length - 1) + ' }, \\\n';
			}

			result = result.substring(0, result.length - 4) + '  \\';

			return result;
		})();

		return {
			'keymap_1': keymap1,
			'keymap_2': keymap2
		};
	}

}

module.exports = KeyboardH;
