class Utils {

	/*
	 * Rotate a point about another point.
	 *
	 * @param {Number} x The x-coordinate of the point to rotate.
	 * @param {Number} y The y-coordinate of the point to rotate.
	 * @param {Number} rotateX The x-coordinate of the point to rotate about.
	 * @param {Number} rotateY The y-coordinate of the point to rotate about.
	 * @param {Number} angle The angle to rotate by in radians.
	 *
	 * @return {Object} { x: new x position, y: new y position }.
	 */
	static rotateAboutPoint(x, y, rotateX, rotateY, angle) {
		// Translate the system so that we rotate about the origin.
		const translatedPos = {
			x: x - rotateX,
			y: y - rotateY
		};

		// Calculate the sin and cosine angles.
		const sinAngle = Math.sin(angle);
		const cosAngle = Math.cos(angle);

		// Return the rotated point.
		return {
			x: translatedPos.x * cosAngle - translatedPos.y * sinAngle + rotateX,
			y: translatedPos.y * cosAngle + translatedPos.x * sinAngle + rotateY
		};
	}

	/*
	 * Read a text file.
	 *
	 * @param {Function} callback Function to call with the data.
	 */
	static readFile(callback) {
		// Create the file input object.
		const input = document.createElement('input');
		input.type = 'file';

		// Catch the change.
		input.onchange = () => {
			// Grab the file.
			const file = input.files[0];
			if (file) {
				// Create a new reader.
				const reader = new FileReader();
				reader.onload = evt => {
					const contents = evt.target.result;

					// Call the callback.
					callback(contents);
				}

				// Read the file.
				reader.readAsText(file, 'utf-8');
			}
		};

		// Click the object.
		input.click();
	}

	/*
	 * Generate a filesystem friendly name.
	 *
	 * @param {String} name The name to convert.
	 *
	 * @return {String} The filesystem friendly name.
	 */
	static generateFriendly(name) {
		return name.replace(/[^a-z0-9]/gi, '').toLowerCase();
	}

	/*
	 * Left pad.
	 *
	 * @param {String} input The string to left pad.
	 * @param {Number} length The length to be padded to.
	 * @param {String?} pad The character to pad with. Defaults to space.
	 *
	 * @return The padded string.
	 */
	static leftPad(input, length, pad) {
		pad = pad || ' ';
		while (input.length < length) {
			input = pad + input;
		}
		return input;
	}

	/*
	 * Right pad.
	 *
	 * @param {String} input The string to right pad.
	 * @param {Number} length The length to be padded to.
	 * @param {String?} pad The character to pad with. Defaults to space.
	 *
	 * @return The padded string.
	 */
	static rightPad(input, length, pad) {
		pad = pad || ' ';
		while (input.length < length) {
			input = input + pad;
		}
		return input;
	}

}

module.exports = Utils;
