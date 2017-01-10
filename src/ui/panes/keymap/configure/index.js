const React = require('react');

const Keycode = require('state/keyboard/keycode');

const Selector = require('./selector');
const Mods = require('./mods');

const NumberBox = require('ui/elements/numberbox');

const C = require('const');

class Configure extends React.Component {

	constructor(props) {
		super(props);

		// Set the initial state.
		this.state = {
			open: false
		};

		// Bind functions.
		this.toggleSelector = this.toggleSelector.bind(this);
		this.change = this.change.bind(this);
		this.setField = this.setField.bind(this);
	}

	/*
	 * Toggle the selector.
	 */
	toggleSelector() {
		this.setState({
			open: !this.state.open
		});
	}

	/*
	 * Change the keycode.
	 *
	 * @param {String} code The new keycode.
	 */
	change(code) {
		// Trigger onChange.
		if (this.props.onChange) this.props.onChange(Keycode.getDefault(code));

		// Hide the selector.
		this.toggleSelector();
	}

	/*
	 * Set a field in the keycode.
	 *
	 * @param {Number} index The index to set.
	 * @param {Object} value The value to set.
	 */
	setField(index, value) {
		const keycode = this.props.keycode;

		keycode.fields[index] = value;

		// Trigger onChange.
		if (this.props.onChange) this.props.onChange(keycode);
	}

	render() {
		const keycode = this.props.keycode;
		const template = keycode.template;

		// Generate the subfields.
		const subfields = [];
		for (let i = 0; i < template.fields.length; i ++) {
			const field = template.fields[i];
			const value = keycode.fields[i];
			switch (field) {
				case 'KEY': {
					subfields.push(<div
						className='pane-keymap-configure-field'
						key={ i }>
						<Configure
							keycode={ value }
							onChange={ code => this.setField(i, code) }/>
					</div>);
					break;
				}
				case 'MOD': {
					subfields.push(<div
						className='pane-keymap-configure-field'
						key={ i }>
						<Mods
							mods={ value }
							onChange={ mods => this.setField(i, mods) }/>
					</div>);
					break;
				}
				case 'LAYER': {
					subfields.push(<div
						className='pane-keymap-configure-field'
						key={ i }>
						&nbsp;&nbsp;Layer&nbsp;&nbsp;&nbsp;
						<NumberBox
							style={{ width: '3rem' }}
							value={ value }
							min='0'
							max={ C.KEYMAP_MAX_LAYERS - 1 }
							minus='chevron-down'
							plus='chevron-up'
							onChange={ v => this.setField(i, v) }/>
					</div>);
					break;
				}
				case 'MACRO': {
					subfields.push(<div
						className='pane-keymap-configure-field'
						key={ i }>
						&nbsp;&nbsp;Macro&nbsp;&nbsp;&nbsp;
						<NumberBox
							style={{ width: '3rem' }}
							value={ value }
							min='0'
							minus='chevron-down'
							plus='chevron-up'
							onChange={ v => this.setField(i, v) }/>
					</div>);
					break;
				}
			}
		}

		return <div className='pane-keymap-configure'>
			<button
				className='light pane-keymap-configure-button'
				onClick={ this.toggleSelector }>
				{ template.raw[0] }
			</button>
			{
				this.state.open && <Selector
					style={{ width: '500px' }}
					keycode={ keycode }
					onChange={ this.change }
					onClose={ this.toggleSelector }/>
			}
			{ subfields.length > 0 && <div>
				{ subfields }
			</div> }
		</div>;
	}

}

module.exports = Configure;
