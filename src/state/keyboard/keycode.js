const C = require('const');

class Keycode {

	/*
	 * Constructor for a keycode.
	 *
	 * @param {String} id The id of the keycode.
	 * @param {List} fields The fields associated with the keycode.
	 */
	constructor(id, fields) {
		this.id = id;
		this.fields = fields;

		// Get the keycode.
		this.code = C.KEYCODES[id];
		this.template = this.code.template;

		// Bind functions.
		this.getCode = this.getCode.bind(this);
		this.getName = this.getName.bind(this);
		this.serialize = this.serialize.bind(this);
	}

	/*
	 * Get the code.
	 *
	 * @return {String} The code..
	 */
	getCode() {
		const fields = [];
		for (let i = 0; i < this.fields.length; i ++) {
			const field = this.fields[i];
			const templateField = this.template.fields[i];
			switch(templateField) {
				case 'KEY': {
					fields.push(field.getCode());
					break;
				}
				case 'MOD': {
					// Get active mods.
					const active = [];
					if (field & 0b000001) active.push('MOD_LCTL');
					if (field & 0b000010) active.push('MOD_LSFT');
					if (field & 0b000100) active.push('MOD_LALT');
					if (field & 0b001000) active.push('MOD_LGUI');
					if (field & 0b010000) active.push('MOD_HYPR');
					if (field & 0b100000) active.push('MOD_MEH');
					if (active.length === 0) active.push(0);
					fields.push(active.join(' | '));
					break;
				}
				case 'LAYER': {
					fields.push(field);
					break;
				}
				case 'MACRO': {
					fields.push(field);
					break;
				}
			}
		}
		return this.template.getCode(fields);
	}

	/*
	 * Get the display name.
	 *
	 * @return {String} The display name.
	 */
	getName() {
		const fields = [];
		for (let i = 0; i < this.fields.length; i ++) {
			const field = this.fields[i];
			const templateField = this.template.fields[i];
			switch(templateField) {
				case 'KEY': {
					fields.push(field.getName());
					break;
				}
				case 'MOD': {
					// Get active mods.
					const active = [];
					if (field & 0b000001) active.push('CTRL');
					if (field & 0b000010) active.push('SHIFT');
					if (field & 0b000100) active.push('ALT');
					if (field & 0b001000) active.push('GUI');
					if (field & 0b010000) active.push('HYPER');
					if (field & 0b100000) active.push('MEH');
					if (active.length === 0) active.push('NONE');
					fields.push(active.join(' | '));
					break;
				}
				case 'LAYER': {
					fields.push(field);
					break;
				}
				case 'MACRO': {
					fields.push(field);
					break;
				}
			}
		}
		return this.template.getName(fields);
	}

	/*
	 * Get the default Keycode for some id.
	 *
	 * @param {String} code The id of the keycode.
	 *
	 * @return {Keycode} The default keycode.
	 */
	static getDefault(code) {
		const keycode = C.KEYCODES[code];
		const template = keycode.template;

		// Get the fields.
		const fields = [];
		for (const field of template.fields) {
			switch (field) {
				case 'KEY': {
					fields.push(new Keycode('KC_NO', []));
					break;
				}
				case 'MOD': {
					fields.push(0);
					break;
				}
				case 'LAYER': {
					fields.push(0);
					break;
				}
				case 'MACRO': {
					fields.push(0);
					break;
				}
			}
		}

		// Return the new Keycode.
		return new Keycode(code, fields);
	}

	/*
	 * Serialize the keycode.
	 *
	 * @return {String} The serialized keycode.
	 */
	serialize() {
		// Serialize the subfields.
		const id = this.id;
		const fields = this.fields.map(field => {
			if (typeof(field) === 'number' || field instanceof Number) {
				return field;
			} else {
				return field.serialize();
			}
		});

		// Return JSON representation.
		const json = {
			id: id,
			fields: fields
		};

		return json;
	}

	/*
	 * Deserialize a keycode.
	 *
	 * @param {String} serialized The serialized keycode.
	 *
	 * @return {Keycode} The deserialized keycode.
	 */
	static deserialize(serialized) {
		// Get the subfields.
		const id = serialized.id;
		const fields = serialized.fields.map(field => {
			if (typeof(field) === 'number' || field instanceof Number) {
				return field;
			} else {
				return Keycode.deserialize(field);
			}
		});

		// Build the new object.
		const keycode = new Keycode(id, fields);
		return keycode;
	}

}

module.exports = Keycode;
