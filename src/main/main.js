const React = require('react');

const Keyboard = require('state/keyboard');

const C = require('const');
const Utils = require('utils');

const Request = require('superagent');
const queryString = require("query-string");

class Main extends React.Component {

	constructor(props) {
		super(props);

		// Bind functions.
		this.upload = this.upload.bind(this);
		this.useKLE = this.useKLE.bind(this);
		this.usePreset = this.usePreset.bind(this);
		this.useGist = this.useGist.bind(this);
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

	/*
	 * Use a preset.
	 *
	 * @param {String} id The id of the preset.
	 */
	usePreset(id) {
		const state = this.props.state;

		Request
			.get(C.LOCAL.PRESETS + id + '.json')
			.end((err, res) => {
				if (err) return state.error('Unable to load preset.');

				try {
					// Deserialize the contents.
					const deserialized = JSON.parse(res.text);

					// Ensure the version is correct.
					if (deserialized.version !== C.VERSION) throw 'version mismatch';

					// Build a new keyboard.
					const keyboard = Keyboard.deserialize(state, deserialized.keyboard);

					state.update({
						keyboard: keyboard,
						screen: C.SCREEN_KEYMAP // Switch to the keymap screen.
					});
				} catch (e) {
					console.error(e);
					state.error('Invalid configuration');
				}
			});
	}

	/*
	 * Use a GitHub Gist.
	 *
	 * @param {String} id The id of the Gist.
	 */
	useGist(id) {
		const state = this.props.state;

		Request
			.get('https://api.github.com/gists/' + id)
			.end((err, res) => {
				if (err) return state.error('Unable to load preset.');

				try {
					// Get files in gist
					const files = res.body.files;

					// Get the contents of the first file
					const serialized = files[Object.keys(files)[0]].content;

					// Deserialize the contents.
					const deserialized = JSON.parse(serialized);

					// Ensure the version is correct.
					if (deserialized.version !== C.VERSION) throw 'version mismatch';

					// Build a new keyboard.
					const keyboard = Keyboard.deserialize(state, deserialized.keyboard);

					state.update({
						keyboard: keyboard,
						screen: C.SCREEN_KEYMAP // Switch to the keymap screen.
					});
				} catch (e) {
					console.error(e);
					state.error('Invalid configuration');
				}
			});
	}

	componentDidMount() {
		// Check for GitHub Gist to load preset from
		const parsedQueryString = queryString.parse(location.search);
		const gist = parsedQueryString.gist;

		if (gist) {
			// Validate that the gist id is a valid hash
			if (/^[A-Za-z0-9]+$/.test(gist)) {
				// Fetch the gist
				this.useGist(gist);
			}
		}
	}

	render() {
		const state = this.props.state;

		return <div>
			<h3>Upload Keyboard Firmware Builder configuration</h3>
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
			<br/><br/>
			<h3>Or choose a preset layout</h3>
			{(() => {
				const presets = [];
				for (const preset in C.PRESETS) {
					presets.push(<button
						className='light block'
						onClick={ () => this.usePreset(preset) }
						key={ preset }>
						{ C.PRESETS[preset] }
					</button>);
					presets.push(<div style={{ height: '0.5rem' }} key={ '-key-' + preset }/>);
				}
				return presets;
			})()}
		</div>;
	}

}

module.exports = Main;
