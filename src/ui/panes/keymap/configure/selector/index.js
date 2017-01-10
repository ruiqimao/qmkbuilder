const React = require('react');
const classNames = require('classnames');

const Utils = require('utils');
const C = require('const');

class Selector extends React.Component {

	constructor(props) {
		super(props);

		const keycode = this.props.keycode;

		// Get the category.
		const category = keycode ? (C.KEYCODE_REVERSE_CATEGORIES[keycode.id] || 'OTHER') : Object.keys(C.KEYCODE_CATEGORIES)[0];

		// Initial state.
		this.state = {
			tab: category,
			other: keycode ? keycode.id : ''
		};

		// Bind functions.
		this.setKeycode = this.setKeycode.bind(this);
	}

	/*
	 * Set the keycode.
	 *
	 * @param {String} id The keycode id.
	 */
	setKeycode(id) {
		// Make sure the ID is valid.
		if (C.KEYCODES[id] && (!this.props.limited || (id.startsWith('KC_') && !C.KEYCODE_SPECIAL.includes(id)))) {
			// onChange.
			if (this.props.onChange) {
				this.props.onChange(id);
			}
		} else {
			// Do nothing.
			this.setState({
				other: this.props.keycode.id
			});
		}
	}

	render() {
		const keycode = this.props.keycode;

		// Generate the tabs.
		const tabs = [];
		const categoryNames = Object.keys(C.KEYCODE_CATEGORIES);
		if (this.props.limited) {
			// If this is a limited selector, remove the lighting and fn categories.
			categoryNames.splice(categoryNames.indexOf('LIGHTING'), 1);
			categoryNames.splice(categoryNames.indexOf('FN'), 1);
		}
		categoryNames.push('OTHER');
		for (const category of categoryNames) {
			const className = classNames(
				'pane-keymap-selector-tab',
				{ 'selected': this.state.tab === category }
			);
			tabs.push(<div
				className={ className }
				onClick={ () => { this.setState({ tab: category }) } }
				key={ category }>
				{ category }
			</div>);
		}

		// Generate the content.
		const content = [];
		if (this.state.tab === 'OTHER') {
			// Textbox.
			content.push(<input
				type='text'
				style={{
					width: '5rem',
					textAlign: 'center'
				}}
				value={ this.state.other }
				onChange={ e => this.setState({ other: e.target.value }) }
				onBlur={ e => this.setKeycode(e.target.value) }
				key={ 1 }/>);
		} else {
			// Generate the buttons.
			let addedKey = false;
			for (let i = 0; i < C.KEYCODE_CATEGORIES[this.state.tab].length; i ++) {
				const key = C.KEYCODE_CATEGORIES[this.state.tab][i];
				if (key) {
					if (this.props.limited && C.KEYCODE_SPECIAL.includes(key)) continue; // In limited mode, no special keycodes.
					const buttonContent = this.state.tab === 'FN' ? key : C.KEYCODES[key].display;
					const style = {};
					if (keycode && key === keycode.id) style.borderColor = '#aaaaaa';
					content.push(<button
						className='light small'
						style={ style }
						onClick={ e => this.setKeycode(key) }
						key={ i }>
						{ buttonContent }
					</button>);
					addedKey = true;
				} else {
					if (addedKey) content.push(<div style={{ height: '0.8rem' }} key={ i }/>);
					addedKey = false;
				}
			}
		}

		return <div className='pane-keymap-selector' style={ this.props.style }>
			<div
				className='pane-keymap-selector-close'
				onClick={ this.props.onClose && this.props.onClose }>
				&times;
			</div>
			{ tabs }
			<div className='pane-keymap-selector-buttons'>
				{ content }
			</div>
		</div>;
	}

}

module.exports = Selector;
