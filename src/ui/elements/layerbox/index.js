const React = require('react');

class LayerBox extends React.Component {

	constructor(props) {
		super(props);

		// Bind functions.
		this.onChange = this.onChange.bind(this);
		this.changeValue = this.changeValue.bind(this);
	}

	/*
	 * Called when the value of the input changes.
	 *
	 * @param {Event} e The event triggered.
	 */
	onChange(e) {
		const target = e.target;
		let value = target.value.trim();

		// Change the value.
		this.changeValue(parseInt(value));
	}

	/*
	 * Called to change the value to a certain value.
	 *
	 * @param {Number} value The value to change to.
	 */
	changeValue(value) {
		// Make sure there is a function we can call.
		if (!this.props.onChange) return;

		// Change the value.
		this.props.onChange(value);
	}

	render() {
		return <div className='layerbox'>
			<input
				style={{ width: '2rem' }}
				type='text'
				value={ this.props.value }
				onChange={ this.onChange }/>
		</div>;
	}

}

module.exports = LayerBox;
