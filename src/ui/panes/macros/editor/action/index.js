const React = require('react');

const Keycode = require('state/keyboard/keycode');

const Selector = require('ui/panes/keymap/configure/selector');

const C = require('const');

class Action extends React.Component {

	constructor(props) {
		super(props);

		// Set the initial state.
		this.state = {
			open: false
		};

		// Bind functions.
		this.onChange = this.onChange.bind(this);
		this.changeTime = this.changeTime.bind(this);
		this.changeKey = this.changeKey.bind(this);
		this.toggleSelector = this.toggleSelector.bind(this);
	}

	/*
	 * Called when the action is changed.
	 *
	 * @param {Event} e The event.
	 */
	onChange(e) {
		const m = this.props.action;
		const action = m.action;
		const argument = m.argument;

		// Get the new action.
		const newAction = parseInt(e.target.value);
		let newArgument;
		switch (newAction) {
			case C.MACRO_NONE: {
				newArgument = null;
				break;
			};
			case C.MACRO_INTERVAL: {
				newArgument = 0;
				break;
			};
			case C.MACRO_DOWN: {
				newArgument = 'KC_NO';
				break;
			};
			case C.MACRO_UP: {
				newArgument = 'KC_NO';
				break;
			};
			case C.MACRO_TYPE: {
				newArgument = 'KC_NO';
				break;
			};
			case C.MACRO_WAIT: {
				newArgument = 0;
				break;
			};
		}

		// Trigger onChange.
		if (this.props.onChange) this.props.onChange({
			action: newAction,
			argument: newArgument
		});
	}

	/*
	 * Called when a time field changes.
	 *
	 * @param {Event} e The event.
	 */
	changeTime(e) {
		// Get the new time.
		let newTime = parseInt(e.target.value);
		if (!e.target.value) newTime = 0; // Empty is 0.

		// Make sure the time isn't NaN.
		if (isNaN(newTime)) return;

		// Trigger onChange.
		if (this.props.onChange) this.props.onChange({
			action: this.props.action.action,
			argument: newTime
		});
	}

	/*
	 * Called when the key is changed.
	 *
	 * @param {String} code The keycode.
	 */
	changeKey(code) {
		// Trigger onChange.
		if (this.props.onChange) this.props.onChange({
			action: this.props.action.action,
			argument: code
		});

		// Close the selector.
		this.toggleSelector();
	}

	/*
	 * Toggle the selector.
	 */
	toggleSelector() {
		this.setState({
			open: !this.state.open
		});
	}

	render() {
		const m = this.props.action;
		const action = m.action;
		const argument = m.argument;

		return <div className='pane-macros-editor-action'>
			{ this.props.index + 1 }
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<button
				className='small light pane-macros-editor-action-up'
				onClick={ this.props.onUp }>
				<i className='fa fa-chevron-up'/>
			</button>
			<button
				className='small light pane-macros-editor-action-down'
				onClick={ this.props.onDown }>
				<i className='fa fa-chevron-down'/>
			</button>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<select
				value={ action }
				onChange={ this.onChange }>
				<option value={ C.MACRO_NONE }>No Action</option>
				<option value={ C.MACRO_INTERVAL }>Set Interval</option>
				<option value={ C.MACRO_DOWN }>Press</option>
				<option value={ C.MACRO_UP }>Release</option>
				<option value={ C.MACRO_TYPE }>Type</option>
				<option value={ C.MACRO_WAIT }>Wait</option>
			</select>
			{ action === C.MACRO_INTERVAL && <span>&nbsp;&nbsp;to&nbsp;&nbsp;</span> }
			{ (action === C.MACRO_DOWN || action === C.MACRO_UP || action === C.MACRO_TYPE) && <span>&nbsp;key&nbsp;</span> }
			{ action === C.MACRO_WAIT && <span>&nbsp;&nbsp;for&nbsp;&nbsp;</span> }
			{ (action === C.MACRO_INTERVAL || action === C.MACRO_WAIT) && <span>
					<input
						style={{ width: '4rem' }}
						type="text"
						value={ argument }
						onChange={ this.changeTime }/>
					&nbsp;&nbsp;milliseconds
				</span>}
			{ (action === C.MACRO_DOWN || action === C.MACRO_UP || action === C.MACRO_TYPE) && <span>
					<button
						style={{ verticalAlign: 'baseLine' }}
						className='light small'
						onClick={ this.toggleSelector }>
						{ Keycode.getDefault(argument).getName() }
					</button>
				</span>}
			{ this.state.open && <Selector
					limited
					keycode={ Keycode.getDefault(argument) }
					onChange={ this.changeKey }
					onClose={ this.toggleSelector }/>}
			<div
				className='pane-macros-editor-action-remove'
				onClick={ this.props.onRemove }>
				&times;
			</div>
		</div>;
	}

}

module.exports = Action;
