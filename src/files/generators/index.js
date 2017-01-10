class Generator {

	constructor(keyboard) {
		this.template = this.loadTemplate();
		this.keyboard = keyboard;
	}

	/*
	 * Generate a file.
	 */
	generate() {
		// Get the fields.
		const fields = this.fillTemplate();

		let result = this.template;
		for (const field in fields) {
			// Do a search and replace.
			result = result.replace(new RegExp('%' + field + '%', 'g'), fields[field]);
		}

		// Return the result.
		return result;
	}

}

module.exports = Generator;
