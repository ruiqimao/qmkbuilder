const React = require('react');
const classNames = require('classnames');

const Action = require('./action');

const C = require('const');

class Editor extends React.Component {

	constructor(props) {
		super(props);

		// Initial state.
		this.state = {
			recording: false
		};

		// Bind functions.
		this.addAction = this.addAction.bind(this);
		this.changeAction = this.changeAction.bind(this);
		this.removeAction = this.removeAction.bind(this);
		this.upAction = this.upAction.bind(this);
		this.downAction = this.downAction.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.clear = this.clear.bind(this);
	}

	/*
	 * Add an action to the macro.
	 */
	addAction() {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);
		const macro = keyboard.getMacro(current);

		// Add the default macro action.
		macro.push({
			action: C.MACRO_NONE,
			argument: null
		});
		keyboard.setMacro(current, macro);
	}

	/*
	 * Change a macro action.
	 *
	 * @param {Number} index The index of the action.
	 * @param {Object} action The new action.
	 */
	changeAction(index, action) {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);
		const macro = keyboard.getMacro(current);

		// Change the macro.
		macro[index].action = action.action;
		macro[index].argument = action.argument;

		keyboard.setMacro(current, macro);
	}

	/*
	 * Remove a macro action.
	 *
	 * @param {Number} index The index of the action.
	 */
	removeAction(index) {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);
		const macro = keyboard.getMacro(current);

		// Remove the macro.
		macro.splice(index, 1);

		keyboard.setMacro(current, macro);
	}

	/*
	 * Move a macro action up.
	 *
	 * @param {Number} index The index of the action.
	 */
	upAction(index) {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);
		const macro = keyboard.getMacro(current);

		if (index === 0) return; // Do nothing if first element.

		// Swap.
		const temp = macro[index];
		macro[index] = macro[index - 1];
		macro[index - 1] = temp;

		keyboard.setMacro(current, macro);
	}

	/*
	 * Move a macro action down.
	 *
	 * @param {Number} index The index of the action.
	 */
	downAction(index) {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);
		const macro = keyboard.getMacro(current);

		if (index === macro.length - 1) return; // Do nothing if last element.

		// Swap.
		const temp = macro[index];
		macro[index] = macro[index + 1];
		macro[index + 1] = temp;

		keyboard.setMacro(current, macro);
	}

	/*
	 * Start recording.
	 *
	 * @param {Event} e The event that triggered the recording.
	 */
	startRecording(e) {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);
		const macro = keyboard.getMacro(current);

		// Update the state.
		this.setState({
			recording: true
		});

		// Set the listeners.
		window.onkeydown = e => {
			// Get the corresponding key.
			const id = C.KEYCODE_NUMBERS[e.which];
			if (!id) return;

			// Add the action to the macro.
			macro.push({
				action: C.MACRO_DOWN,
				argument: id
			});
			keyboard.setMacro(current, macro);

			// Scroll to the bottom of the page.
			setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
		};
		window.onkeyup = e => {
			// Get the corresponding key.
			const id = C.KEYCODE_NUMBERS[e.which];
			if (!id) return;

			// Check if the previous action was a press of the same key.
			const previous = macro[macro.length - 1];
			if (previous.action === C.MACRO_DOWN && previous.argument === id) {
				// Modify the previous action to be a type.
				previous.action = C.MACRO_TYPE;
			} else {
				// Add the action to the macro.
				macro.push({
					action: C.MACRO_UP,
					argument: id
				});
			}
			keyboard.setMacro(current, macro);
		};

		// Clear the macro.
		macro.splice(0);
		keyboard.setMacro(current, macro);

		// Lose focus.
		e.target.blur();
	}

	/*
	 * Stop recording.
	 */
	stopRecording() {
		// Update the state.
		this.setState({
			recording: false
		});

		// Remove the listeners.
		window.onkeydown = null;
		window.onkeyup = null;
	}

	/*
	 * Clear the current macro.
	 */
	clear() {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);

		// Clear the current macro.
		keyboard.setMacro(current, []);
	}

	render() {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const current = state.ui.get('macros-current', 0);
		const macro = keyboard.getMacro(current);

		// Compile the actions.
		const actions = [];
		for (let i = 0; i < macro.length; i ++) {
			const m = macro[i];

			actions.push(<Action
				index={ i }
				action={ m }
				onChange={ action => this.changeAction(i, action) }
				onRemove={ () => this.removeAction(i) }
				onUp={ () => this.upAction(i) }
				onDown={ () => this.downAction(i) }
				key={ i }/>);
		}

		return <div>
			<button
				onClick={ this.addAction }>
				Add Action
			</button>
			&nbsp;&nbsp;
			<button
				className={ classNames('light pane-macros-editor-record', { 'recording': this.state.recording }) }
				onClick={ e => this.state.recording ? this.stopRecording() : this.startRecording(e) }>
				{ this.state.recording? 'Stop Recording' : 'Record Macro' }
			</button>
			&nbsp;&nbsp;
			<button
				className='light'
				onClick={ this.clear }>
				Clear Macro
			</button>
			<div className='pane-macros-editor-content'>
				{ actions.length === 0 && <div className='pane-macros-editor-empty'>No actions yet</div> }
				{ actions }
			</div>
			<div
				className='pane-macros-editor-screen'
				style={{ display: this.state.recording ? 'block' : 'none' }}/>
		</div>;
	}

}

module.exports = Editor;
