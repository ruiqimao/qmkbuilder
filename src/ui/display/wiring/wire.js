const React = require('react');
const classNames = require('classnames');

const C = require('const');

class Wire extends React.Component {

	render() {
		const state = this.props.state;
		const flipped = state.ui.get('display-flip', false);

		const p1 = Object.assign({}, this.props.p1);
		const p2 = Object.assign({}, this.props.p2);
		if (flipped) {
			p1.x = state.keyboard.bounds.max.x - p1.x;
			p2.x = state.keyboard.bounds.max.x - p2.x;
		}

		const keySize = state.ui.get('keySize', C.KEY_SIZE);

		const className = classNames(
			'display-wire',
			{
				'display-wire-row': this.props.row,
				'display-wire-col': this.props.col
			});

		// Calculate the angle and length.
		const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
		const length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

		const rotateString = 'rotate(' + angle + 'deg)';
		const style = {
			top: p1.y * keySize,
			left: p1.x * keySize,
			width: length * keySize,

			WebkitTransform: rotateString,
			MozTransform: rotateString,
			msTransform: rotateString,
			transform: rotateString
		};

		return <div
			className={ className }
			style={ style }/>;
	}

}

module.exports = Wire;
