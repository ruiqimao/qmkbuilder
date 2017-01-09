const Utils = require('utils');

const Keycode = require('./keycode');

const C = require('const');

class Key {

	/*
	 * Constructor for a key object.
	 *
	 * @param {Keyboard} keyboard The keyboard associated with the key.
	 * @param {Number} id The id of the key.
	 * @param {String} legend The legend of the key.
	 * @param {Object} state The state of the key.
	 */
	constructor(keyboard, id, legend, state) {
		this.keyboard = keyboard;
		this.id = id;
		this.legend = legend;
		this.state = state;

		this.selected = 0;

		this.keycodes = Array(C.KEYMAP_MAX_LAYERS).fill(new Keycode('KC_TRNS', []));

		// Bind functions.
		this.guessLegend = this.guessLegend.bind(this);
		this.select = this.select.bind(this);
		this.serialize = this.serialize.bind(this);

		// Define some constants for ease of use.
		const rotateX = this.state.rx;
		const rotateY = this.state.ry;
		const angle = this.state.r * Math.PI / 180;

		// Get the angle.
		this.angle = this.state.r;

		// Calculate the true position.
		const pos = {
			x: this.state.x,
			y: this.state.y
		};
		this.pos = Utils.rotateAboutPoint(
			pos.x, pos.y,
			rotateX, rotateY,
			angle);

		// Get the sizes.
		this.size = {
			w: this.state.w,
			h: this.state.h
		};
		this.offset = {
			x: this.state.x2,
			y: this.state.y2
		};
		this.size2 = {
			w: this.state.w2,
			h: this.state.h2
		};

		// Calculate the true bounds.
		const bounds = {
			min: {
				x: Math.min(pos.x, pos.x + this.offset.x),
				y: Math.min(pos.y, pos.y + this.offset.y)
			},
			max: {
				x: Math.max(
					pos.x + this.size.w,
					pos.x + this.offset.x + this.size2.w),
				y: Math.max(
					pos.y + this.size.h,
					pos.y + this.offset.y + this.size2.h)
			}
		};
		const rotated = [
			Utils.rotateAboutPoint(bounds.min.x, bounds.min.y, rotateX, rotateY, angle),
			Utils.rotateAboutPoint(bounds.min.x, bounds.max.y, rotateX, rotateY, angle),
			Utils.rotateAboutPoint(bounds.max.x, bounds.min.y, rotateX, rotateY, angle),
			Utils.rotateAboutPoint(bounds.max.x, bounds.max.y, rotateX, rotateY, angle)
		];
		this.bounds = {
			min: {
				x: Math.min(rotated[0].x, rotated[1].x, rotated[2].x, rotated[3].x) - this.pos.x,
				y: Math.min(rotated[0].y, rotated[1].y, rotated[2].y, rotated[3].y) - this.pos.y
			},
			max: {
				x: Math.max(rotated[0].x, rotated[1].x, rotated[2].x, rotated[3].x) - this.pos.x,
				y: Math.max(rotated[0].y, rotated[1].y, rotated[2].y, rotated[3].y) - this.pos.y
			}
		};

		// Calculate the center of the key.
		const center = {
			x: pos.x + this.size.w / 2,
			y: pos.y + this.size.h / 2
		};
		this.center = Utils.rotateAboutPoint(center.x, center.y, rotateX, rotateY, angle);

		// Define wiring variables.
		this._row = 0;
		this._col = 0;

		// Guess the legend.
		this.guessLegend();
	}

	/*
	 * Getters and setters for wiring.
	 */
	get row() {
		return this._row;
	}
	get col() {
		return this._col;
	}
	set row(r) {
		this._row = r;
		this.keyboard.updateWiring();
	}
	set col(c) {
		this._col = c;
		this.keyboard.updateWiring();
	}

	/*
	 * Guess the legend of the key.
	 */
	guessLegend() {
		// Get the last legend.
		const legends = this.legend.split('\n');
		const legend = legends[legends.length - 1];

		// Look for an alias.
		const keycode = C.KEYCODE_ALIASES[legend.toUpperCase()];
		if (keycode) {
			this.keycodes[0] = new Keycode(keycode.template.raw[0], []);
		} else {
			// Default to KC_NO.
			this.keycodes[0] = new Keycode('KC_NO', []);
		}
	}

	/*
	 * Select the key.
	 *
	 * @param {Number} level The level of selection of the key.
	 */
	select(level) {
		// Deselect all the keys in the keyboard.
		for (const key of this.keyboard.keys) {
			key.selected = 0;
		}

		// Select this key.
		this.selected = level;
		this.keyboard.selected = this;

		// Update the state.
		this.keyboard.state.update();
	}

	/*
	 * Serialize the key.
	 *
	 * @return {String} The serialized key.
	 */
	serialize() {
		// Serialize all the subcomponents.
		const id = this.id;
		const legend = this.legend;
		const state = this.state;
		const row = this.row;
		const col = this.col;
		const keycodes = this.keycodes.map(keycode => keycode.serialize());

		// Return JSON representation.
		const json = {
			'id': id,
			'legend': legend,
			'state': state,
			'row': row,
			'col': col,
			'keycodes': keycodes
		};

		return json;
	}

	/*
	 * Deserialize a key.
	 *
	 * @param {Keyboard} keyboard The keyboard associated with the key.
	 * @param {serialized} The serialized key.
	 *
	 * @return {Key} The deserialized key.
	 */
	static deserialize(keyboard, serialized) {
		// Get the subfields.
		const id = serialized.id;
		const legend = serialized.legend;
		const state = serialized.state;
		const row = serialized.row;
		const col = serialized.col;
		const keycodes = serialized.keycodes.map(keycode => Keycode.deserialize(keycode));

		// Build the new object.
		const key = new Key(keyboard, id, legend, state);
		key._row = row;
		key._col = col;
		key.keycodes = keycodes;
		return key;
	}

}

module.exports = Key;
