const UI = require('./ui');

const C = require('const');

class State {

	constructor(app) {
		this.app = app;

		// State fields.
		this.ui = new UI(this);   // UI state handler.

		this.screen = C.SCREEN_MAIN; // The current screen.
		this.keyboard = null; // The current keyboard layout.

		// Bind methods.
		this.update = this.update.bind(this);
		this.error = this.error.bind(this);
		this.message = this.message.bind(this);
	}

	/*
	 * Update the state.
	 */
	update(t) {
		if (t) Object.assign(this, t);
		this.app.setState(this);
	}

	/*
	 * Display an error.
	 *
	 * @param {String} msg The error message to display.
	 */
	error(msg) {
		alert(msg);
	}

	/*
	 * Display a message.
	 *
	 * @param {String} msg The message to display.
	 */
	message(msg) {
		alert(msg);
	}

}

module.exports = State;
