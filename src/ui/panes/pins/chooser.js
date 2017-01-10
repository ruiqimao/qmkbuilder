const React = require('react');

const C = require('const');

class Chooser extends React.Component {

	render() {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const pin = this.props.pin || 'N/A';

		// Get list of available pins.
		const pins = this.props.backlight ? ['B5', 'B6', 'B7'] : C.PINS[keyboard.controller].slice(); // B5, B6, and B7 on backlight.

		// Allow for no pin if set.
		if (this.props.noPin) pins.splice(0, 0, null);

		return <select
			value={ pin }
			onChange={ e => (this.props.onChange && this.props.onChange(e.target.value === 'N/A' ? null : e.target.value)) }>
			{ pins.map((p, index) => <option key={ index } value={ p || 'N/A' }>{ p || 'N/A' }</option>) }
		</select>;
	}

}

module.exports = Chooser;
