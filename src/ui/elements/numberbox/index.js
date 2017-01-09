const React = require('react');

class NumberBox extends React.Component {

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
		if (value === '') value = 0; // Blank is zero.
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

		// Make sure the vlue is a number.
		if (isNaN(value)) return;

		// Check if the value is within limits.
		if (this.props.min && value < parseInt(this.props.min)) value = parseInt(this.props.min);
		if (this.props.max && value > parseInt(this.props.max)) value = parseInt(this.props.max);

		// Change the value.
		this.props.onChange(value);
	}

	render() {
		return <div className='numberbox'>
			<button
				className='small'
				onClick={ () => { this.changeValue(this.props.value - 1) } }>
				<i className={ 'fa fa-' + (this.props.minus || 'minus') }/>
			</button>
			<input
				style={ this.props.style }
				type='text'
				value={ this.props.value }
				onChange={ this.onChange }/>
			<button
				className='small'
				onClick={ () => { this.changeValue(this.props.value + 1) } }>
				<i className={ 'fa fa-' + (this.props.plus || 'plus') }/>
			</button>
		</div>;
	}

}

module.exports = NumberBox;
