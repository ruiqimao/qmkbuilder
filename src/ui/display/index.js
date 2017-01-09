const React = require('react');
const classNames = require('classnames');

const Key = require('./key');

const Keycode = require('state/keyboard/keycode');

const Wiring = require('./wiring');
const Keymap = require('./keymap');

const C = require('const');

class Display extends React.Component {

	constructor(props) {
		super(props);

		// Bind methods.
		this.zoom = this.zoom.bind(this);
		this.onKeyClick = this.onKeyClick.bind(this);
	}

	/*
	 * Generate a function that manages the zoom of the board.
	 *
	 * @param {Number} direction -1 to zoom out, 1 to zoom in.
	 *
	 * @return {Function} A function that zooms in the given direction when called.
	 */
	zoom(direction) {
		const state = this.props.state;

		return () => {
			// Get the current key size.
			let keySize = state.ui.get('keySize', C.KEY_SIZE);

			// Apply the direction.
			keySize += direction * C.KEY_SIZE_INC;

			// Bound the size.
			keySize = Math.min(Math.max(keySize, C.KEY_SIZE_MIN), C.KEY_SIZE_MAX);
			state.ui.set('keySize', keySize);
		};
	}

	/*
	 * Create a function to handle when a key is clicked.
	 *
	 * @param {Key} key The key to handle.
	 *
	 * @return {Function} A function that can be used for an onClick event.
	 */
	onKeyClick(key) {
		const state = this.props.state;
		const keyboard = state.keyboard;

		return (e) => {
			// Do different things depending on the screen.
			switch (state.screen) {
				case C.SCREEN_WIRING: key.select(C.KEY_SELECT); break;
				case C.SCREEN_KEYMAP: {
					// Consume the event.
					e.stopPropagation();

					// Set the key to program.
					key.select(C.KEY_PROGRAM);

					// Clicking anywhere will change to ordinary select.
					const clickListener = () => {
						if (key.selected) key.select(C.KEY_SELECT);
						window.onclick = null;
					};
					window.onclick = clickListener;

					const keyListener = e => {
						if (key.selected === C.KEY_PROGRAM) {
							// Program the key based on the typed key.
							if (C.KEYCODE_NUMBERS[e.which]) {
								const layer = state.ui.get('keymap-layer', 0);
								key.keycodes[layer] = Keycode.getDefault(C.KEYCODE_NUMBERS[e.which]);
								keyboard.verify();
							}
							key.select(C.KEY_SELECT);
						}
						window.onkeydown = null;
					};
					window.onkeydown = keyListener;
					break;
				}
			}
		};
	}

	render() {
		const state = this.props.state;
		const keyboard = state.keyboard;

		const keySize = state.ui.get('keySize', C.KEY_SIZE);

		const className = classNames(
			'display',
			{ 'valid': keyboard.valid });

		const style = {
			width: keyboard.bounds.max.x * keySize + 14,
			height: keyboard.bounds.max.y * keySize + 14,
			marginTop: state.screen === C.SCREEN_WIRING ? '2rem' : '0'
		};

		return <div className='display-wrapper'>
			<h4>Board Size&nbsp;&nbsp;&nbsp;</h4>
			<button
				className='small light'
				onClick={ this.zoom(-1) }>
				<i className='fa fa-search-minus'/>
			</button>
			&nbsp;
			<button
				className='small light'
				onClick={ this.zoom(1) }>
				<i className='fa fa-search-plus'/>
			</button>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<h4>Flip&nbsp;&nbsp;</h4>
			<input
				type='checkbox'
				checked={ state.ui.get('display-flip', false) }/>
			<label
				onClick={ () => { state.ui.set('display-flip', !state.ui.get('display-flip', false)) } }/>
			<br/><br/>
			<div
				className={ className }
				style={ style }>
				<div className='display-inner'>
					{
						// Display all the keys.
						keyboard.keys.map((key, index) => {
							return <Key
								state={ state }
								data={ key }
								key={ index }
								onClick={ this.onKeyClick(key) }/>;
						})
					}
				</div>
				{
					// Wiring.
					state.screen === C.SCREEN_WIRING && <Wiring
						state={ state }/>
				}
				{
					// Keymap.
					state.screen === C.SCREEN_KEYMAP && <Keymap
						state={ state }/>
				}
			</div>
		</div>;
	}

}

module.exports = Display;
