class UI {

	constructor(state) {
		this.state = state;

		this.fields = {}; // All UI fields and their values.
	}

	/*
	 * Get the value of a field.
	 *
	 * @param {String} field The name of the field.
	 * @param {String} def The default value of the field.
	 */
	get(field, def) {
		if (field in this.fields) return this.fields[field]; // Return the value if it exists.

		this.fields[field] = def; // Otherwise, set the value and return it.
		return def;
	}

	/*
	 * Create a function for setting the value of a field.
	 *
	 * @param {String} field The name of the field.
	 * @param {Object} value The value if it is to be set immediately.
	 */
	set(field, value) {
		if (value !== undefined) {
			// Set the value immediately.
			this.fields[field] = value;
			this.state.update();

			return;
		}

		return (evt) => {
			this.fields[field] = evt.target.value;
			this.state.update();
		};
	}

}

module.exports = UI;
