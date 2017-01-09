const React = require('react');

const Keyboard = require('state/keyboard');

const C = require('const');
const Utils = require('utils');

class Main extends React.Component {

	constructor(props) {
		super(props);

		// Bind functions.
		this.upload = this.upload.bind(this);
		this.useKLE = this.useKLE.bind(this);
	}

	/*
	 * Upload a QMK Builder configuration.
	 */
	upload() {
		const state = this.props.state;

		// Upload a file.
		Utils.readFile(contents => {
			try {
				// Deserialize the contents.
				const deserialized = JSON.parse(contents);

				// Ensure the version is correct.
				if (deserialized.version !== C.VERSION) throw 'version mismatch';

				// Build a new keyboard.
				const keyboard = Keyboard.deserialize(state, deserialized.keyboard);

				state.update({
					keyboard: keyboard,
					screen: C.SCREEN_WIRING // Switch to the wiring screen.
				});
			} catch (e) {
				console.error(e);
				state.error('Invalid configuration');
			}
		});
	}

	/*
	 * Use KLE raw data.
	 */
	useKLE() {
		const state = this.props.state;

		try {
			const json = parser.parse('[' + state.ui.get('kle', '') + ']'); // Parse the raw data.

			// Parse the KLE data.
			const keyboard = new Keyboard(state, json);

			// Make sure the data is valid.
			if (keyboard.keys.length == 0) {
				throw 'empty layout';
			}

			state.update({
				keyboard: keyboard,
				screen: C.SCREEN_WIRING // Switch to the wiring screen.
			});
		} catch (e) {
			console.error(e);
			state.error('Invalid layout');
		}
	}

	render() {
		const state = this.props.state;

		return <div>
			<h3>Upload QMK Firmware Builder configuration</h3>
			<button
				className='block'
				onClick={ this.upload }>
				Upload
			</button>
			<br/><br/>
			<h3>Or import from keyboard-layout-editor.com</h3>
			<textarea
				className='kle'
				placeholder='Paste layout here...'
				value={ state.ui.get('kle', '') }
				onChange={ state.ui.set('kle') }/>
			<button
				className='block'
				onClick={ this.useKLE }>
				Import
			</button>
		</div>;
	}

}

module.exports = Main;
