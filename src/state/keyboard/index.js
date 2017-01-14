const Key = require('./key');
const Keycode = require('./keycode');

const C = require('const');

class Keyboard {

	/*
	 * Constructor for a keyboard object.
	 *
	 * @param {State} state The state associated with this keyboard.
	 * @param {Object} json If defined, the KLE json to load from.
	 */
	constructor(state, json) {
		this.state = state;
		this.keys = [];
		this.bounds = {
			min: { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
			max: { x: Number.MIN_VALUE, y: Number.MIN_VALUE }
		};
		this.wiring = {};
		this._rows = 1;
		this._cols = 1;
		this._controller = C.CONTROLLER_ATMEGA32U4;
		this.pins = {
			row: [],
			col: [],
			num: null,
			caps: null,
			scroll: null,
			compose: null,
			kana: null,
			led: null,
			rgb: null
		};
		this.macros = {};
		this.quantum = C.QUANTUM_DEFAULT;
		this.settings = {
			diodeDirection: C.DIODE_COL2ROW,
			name: '',
			bootloaderSize: C.BOOTLOADER_4096,
			rgbNum: 0,
			backlightLevels: 3,
			positionIndexToLayerMap: [],
			strictLayers: false
		};

		this.valid = false;
		this.errors = [];
		this.warnings = [];

		this.selected = null;

		// Bind methods.
		this.importKLE = this.importKLE.bind(this);
		this.updateWiring = this.updateWiring.bind(this);
		this.estimateWiring = this.estimateWiring.bind(this);
		this.setRowPin = this.setRowPin.bind(this);
		this.setColPin = this.setColPin.bind(this);
		this.setPin = this.setPin.bind(this);
		this.updatePins = this.updatePins.bind(this);
		this.getMacro = this.getMacro.bind(this);
		this.setMacro = this.setMacro.bind(this);
		this.setSetting = this.setSetting.bind(this);
		this.verify = this.verify.bind(this);
		this.serialize = this.serialize.bind(this);

		this.deselect = this.deselect.bind(this);

		this.setLayer = this.setLayer.bind(this);
		this.getLayer = this.getLayer.bind(this);
		this.updateLayers = this.updateLayers.bind(this);

		// Import KLE if it exists.
		if (json) this.importKLE(json);

		// Verify validity.
		this.verify();
	}

	/*
	 * Import a KLE layout.
	 *
	 * @param {Object} json The KLE layout to import.
	 */
	importKLE(json) {
		// Define starting states.
		const state = {
			x: 0,
			y: 0,
			r: 0,
			rx: 0,
			ry: 0,
			w: 1,
			h: 1,
			x2: 0,
			y2: 0,
			w2: 0,
			h2: 0
		}

		// Define the x and y positions to reset to.
		let resetX = 0;
		let resetY = 0;

		// Iterate through all the KLE data.
		let keyIndex = 0;
		for (const row of json) {
			for (const entry of row) {
				// Check if the entry is a modifier.
				if (entry instanceof Object) {
					// Iterate through all the fields of the modifier.
					for (const mod in entry) {
						if (mod === 'x' || mod === 'y') {
							state[mod] += entry[mod]; // x and y are added.
						} else {
							state[mod] = entry[mod]; // Set the state accordingly.
						}

						if (mod === 'rx') {
							// Set resetX if new rotation point x is set.
							resetX = state[mod];
						}
						if (mod === 'ry') {
							// Set resetY if new rotation point y is set.
							resetY = state[mod];
						}
						if (mod === 'rx' || mod === 'ry') {
							// Reset the positions if new rotation point is set.
							state.x = resetX;
							state.y = resetY;
						}
					}
					continue;
				}

				// Create a new key with the current state.
				const key = new Key(this, keyIndex ++, entry, Object.assign({}, state));
				this.keys.push(key);

				// Update bounds.
				this.bounds.min.x = Math.min(this.bounds.min.x, key.pos.x + key.bounds.min.x);
				this.bounds.max.x = Math.max(this.bounds.max.x, key.pos.x + key.bounds.max.x);
				this.bounds.min.y = Math.min(this.bounds.min.y, key.pos.y + key.bounds.min.y);
				this.bounds.max.y = Math.max(this.bounds.max.y, key.pos.y + key.bounds.max.y);

				// Increment x.
				state.x += state.w;

				// Reset the temporary states.
				state.w = 1;
				state.h = 1;
				state.x2 = 0;
				state.y2 = 0;
				state.w2 = 0;
				state.h2 = 0;
			}

			// Increment y.
			state.y ++;

			// Reset x.
			state.x = resetX;
		}

		// Normalize the positions and bounds.
		for (const key of this.keys) {
			key.pos.x -= this.bounds.min.x;
			key.pos.y -= this.bounds.min.y;
			key.center.x -= this.bounds.min.x;
			key.center.y -= this.bounds.min.y;
		}
		this.bounds.max.x -= this.bounds.min.x;
		this.bounds.max.y -= this.bounds.min.y;
		this.bounds.min.x = 0;
		this.bounds.min.y = 0;

		// Estimate the wiring.
		this.estimateWiring();

		// Initialize pins.
		let usedPins = 0;
		for (let i = 0; i < this.rows; i ++) {
			this.pins.row.push(C.PINS[this.controller][Math.min(usedPins ++, C.PINS[this.controller].length)]);
		}
		for (let i = 0; i < this.cols; i ++) {
			this.pins.col.push(C.PINS[this.controller][Math.min(usedPins ++, C.PINS[this.controller].length)]);
		}
	}

	/*
	 * Getters and setters for wiring.
	 */
	get rows() {
		return this._rows;
	}
	get cols() {
		return this._cols;
	}
	set rows(r) {
		this._rows = r;
		this.updatePins();
		this.updateWiring();
	}
	set cols(c) {
		this._cols = c;
		this.updatePins();
		this.updateWiring();
	}

	/*
	 * Update all keys in the case of a row or column number change.
	 */
	updateWiring() {
		// Reset the wiring matrix.
		this.wiring = {};

		// Find all the keys again.
		for (const key of this.keys) {
			// Update invalid keys.
			if (key.row >= this.rows) key._row = this.rows - 1;
			if (key.col >= this.cols) key._col = this.cols - 1;

			// Assign the key to the matrix.
			const k = key.row + ',' + key.col;
			if (!this.wiring[k]) this.wiring[k] = [];
			this.wiring[k].push(key);
		}

		this.verify();

		// Update the state.
		this.state.update();
	}

	/*
	 * Estimate wiring based on the layout.
	 */
	estimateWiring() {
		// Extremely naive but effective solution.
		let minRow = Number.MAX_VALUE;
		let minCol = Number.MAX_VALUE;
		for (const key of this.keys) {
			// Calculate an estimated row and column.
			let row = Math.floor(key.center.y);
			let col = Math.floor(key.center.x);

			key._row = row;
			key._col = col;

			minRow = Math.min(row, minRow);
			minCol = Math.min(col, minCol);
			this._rows = Math.max(row + 1, this._rows);
			this._cols = Math.max(col + 1, this._cols);
		}

		for (const key of this.keys) {
			key._row -= minRow;
			key._col -= minCol;
		}
		this._rows -= minRow;
		this._cols -= minCol;

		this.updateWiring();
	}

	/*
	 * Getters and setters for pin configuration.
	 */
	get controller() {
		return this._controller;
	}
	set controller(c) {
		this._controller = c;
		this.updatePins();
	}
	setRowPin(pin, value) {
		this.pins.row[pin] = value;
		this.updatePins();
	}
	setColPin(pin, value) {
		this.pins.col[pin] = value;
		this.updatePins();
	}
	setPin(pin, value) {
		this.pins[pin] = value;
		this.updatePins();
	}

	/*
	 * Update all the pins in the case of a controller or pin change.
	 */
	updatePins() {
		const allowedPins = C.PINS[this.controller];
		const defaultPin = allowedPins[0];

		// Remove invalid pins.
		for (let i = 0; i < this.pins.row.length; i ++) {
			if (!allowedPins.includes(this.pins.row[i])) this.pins.row[i] = defaultPin;
		}
		for (let i = 0; i < this.pins.col.length; i ++) {
			if (!allowedPins.includes(this.pins.col[i])) this.pins.col[i] = defaultPin;
		}

		// Fix the number of pins.
		this.pins.row.splice(this.rows);
		this.pins.col.splice(this.cols);
		while (this.pins.row.length < this.rows) this.pins.row.push(defaultPin);
		while (this.pins.col.length < this.cols) this.pins.col.push(defaultPin);

		this.verify();

		// Update the state.
		this.state.update();
	}

	/*
	 * Verify the validity of the keyboard.
	 */
	verify() {
		this.valid = true;
		this.errors = [];
		this.warnings = [];

		// Make sure every key has a unique position in the matrix.
		if (Object.keys(this.wiring).length !== this.keys.length) {
			this.errors.push('Not every key has a unique position in the wiring matrix.');
			this.valid = false;
		}

		// Make sure there are no overlapping pins.
		const usedPins = [];
		let overlappingPins = true;
		for (const pin of this.pins.row) {
			if (usedPins.includes(pin)) {
				this.valid = overlappingPins = false;
			}
			usedPins.push(pin);
		}
		for (const pin of this.pins.col) {
			if (usedPins.includes(pin)) this.valid = overlappingPins = false;
			usedPins.push(pin);
		}
		if (this.pins.num && usedPins.includes(this.pins.num)) this.valid = overlappingPins = false;
		usedPins.push(this.pins.num);
		if (this.pins.caps && usedPins.includes(this.pins.caps)) this.valid = overlappingPins = false;
		usedPins.push(this.pins.caps);
		if (this.pins.scroll && usedPins.includes(this.pins.scroll)) this.valid = overlappingPins = false;
		usedPins.push(this.pins.scroll);
		if (this.pins.compose && usedPins.includes(this.pins.compose)) this.valid = overlappingPins = false;
		usedPins.push(this.pins.compose);
		if (this.pins.kana && usedPins.includes(this.pins.kana)) this.valid = overlappingPins = false;
		usedPins.push(this.pins.kana);
		if (this.pins.led && usedPins.includes(this.pins.led)) this.valid = overlappingPins = false;
		usedPins.push(this.pins.led);
		if (this.pins.rgb && usedPins.includes(this.pins.rgb)) this.valid = overlappingPins = false;
		usedPins.push(this.pins.rgb);
		if (!overlappingPins) {
			this.errors.push('There are overlapping pins.');
		}

		// Check to see if there are all the recommended keys in the keymap.
		const inKeymap = new Set();
		for (const key of this.keys) {
			for (const keycode of key.keycodes) {
				inKeymap.add(keycode.id);
			}
		}
		const missing = [];
		for (const recommended of C.KEYCODE_RECOMMENDED) {
			if (!inKeymap.has(recommended)) {
				missing.push(Keycode.getDefault(recommended).getName());
			}
		}
		if (missing.length) this.warnings.push('Your keymap is missing the key' + (missing.length > 1 ? 's' : '')  + ': ' + missing.join(', ') + '.');

		// Check to see if there is a soft reset key.
		if (!inKeymap.has('RESET')) this.warnings.push('Your keymap is missing a soft reset key.');
	}

	/*
	 * Get a macro.
	 *
	 * @param {Number} id The id of the macro.
	 */
	getMacro(id) {
		if (this.macros[id]) return this.macros[id];
		return [];
	}

	/*
	 * Set a macro.
	 *
	 * @param {Number} id The id of the macro.
	 * @param {List} macro The new macro.
	 */
	setMacro(id, macro) {
		this.macros[id] = macro;
		if (macro.length === 0) delete this.macros[id];

		// Update the state.
		this.state.update();
	}

	/*
	 * Set a setting.
	 *
	 * @param {String} id The id of the setting.
	 * @param {Object} value The value to set.
	 */
	setSetting(id, value) {
		this.settings[id] = value;

		// Update the state.
		this.state.update();
	}

	getLayer(position) {
		const positionIndex = C.POSITION_TO_INDEX[position];
		return this.settings.positionIndexToLayerMap[positionIndex];
	}

	/**
	 * Maps the supplied legend position to the supplied layer.
	 *
	 * @param {String} position The legend position to be mapped.
	 * @param {Number} layer The layer the position should be mapped to.
	 */
	setLayer(position, layer) {
		const positionIndex = C.POSITION_TO_INDEX[position];
		if (isNaN(layer)) {
			this.settings.positionIndexToLayerMap[positionIndex] = undefined;
		} else {
			this.settings.positionIndexToLayerMap[positionIndex] = layer;
		}

		this.state.update();
	}

	updateLayers() {
		for (const key of this.keys) {
			key.guessLegend();
		}
		this.verify();

		this.state.update();
	}

	/*
	 * Deselect all keys.
	 */
	deselect() {
		this.keys.map(key => key.selected = 0);
		this.selected = null;

		this.state.update();
	}

	/*
	 * Serialize the keyboard.
	 *
	 * @return {String} The serialized keyboard.
	 */
	serialize() {
		// Serialize all the subcomponents.
		const keys = this.keys.map(key => key.serialize());
		const controller = this.controller;
		const bounds = this.bounds;
		const rows = this.rows;
		const cols = this.cols;
		const pins = this.pins;
		const macros = this.macros;
		const quantum = this.quantum;
		const settings = this.settings;

		// Return JSON representation.
		const json = {
			'keys': keys,
			'controller': controller,
			'bounds': bounds,
			'rows': rows,
			'cols': cols,
			'pins': pins,
			'macros': macros,
			'quantum': quantum,
			'settings': settings
		};

		return json;
	}

	/*
	 * Deserialize a keyboard.
	 *
	 * @param {State} state The state associated with the keyboard.
	 * @param {String} serialized The serialized keyboard.
	 *
	 * @return {Keyboard} The deserialized keyboard.
	 */
	static deserialize(state, serialized) {
		// Build the new object.
		const keyboard = new Keyboard(state);

		// Get the subfields.
		const keys = serialized.keys.map(key => Key.deserialize(keyboard, key));
		const controller = serialized.controller;
		const bounds = serialized.bounds;
		const rows = serialized.rows;
		const cols = serialized.cols;
		const pins = serialized.pins;
		const macros = serialized.macros;
		const quantum = serialized.quantum;
		const settings = serialized.settings;

		keyboard.keys = keys;
		keyboard._controller = controller;
		keyboard.bounds = bounds;
		keyboard._rows = rows;
		keyboard._cols = cols;
		keyboard.pins = pins;
		keyboard.macros = macros;
		keyboard.quantum = quantum;
		keyboard.settings = settings;

		keyboard.updateWiring();
		keyboard.updatePins();
		keyboard.verify();

		return keyboard;
	}

}

module.exports = Keyboard;
