const React = require('react');
const classNames = require('classnames');

const C = require('const');

class Key extends React.Component {

	render() {
		const state = this.props.state;
		const data = this.props.data;
		const flipped = state.ui.get('display-flip', false);

		const keySize = state.ui.get('keySize', C.KEY_SIZE);

		const className = classNames(
			'display-key',
			{
				'select1': data.selected == 1,
				'select2': data.selected == 2
			}
		);

		const style = {
			top: data.pos.y * keySize,
			left: (flipped ? state.keyboard.bounds.max.x - data.pos.x - data.size.w : data.pos.x) * keySize,
		};

		// Only apply rotation if needed.
		if (data.angle != 0) {
			const rotateString = 'rotate(' + data.angle + 'deg)';
			style.WebkitTransform = rotateString;
			style.MozTransform = rotateString;
			style.msTransform = rotateString;
			style.transform = rotateString;
		}

		const block1Style = {
			width: data.size.w * keySize,
			height: data.size.h * keySize
		};
		const block2Style = {
			width: data.size2.w * keySize,
			height: data.size2.h * keySize,
			top: data.offset.y * keySize,
			left: (flipped ? data.size.w - data.size2.w - data.offset.x : data.offset.x) * keySize
		};

		return <div
			className={ className }
			style={ style }
			onClick={ this.props.onClick }
			onMouseEnter={ this.props.onMouseEnter }
			onMouseLeave={ this.props.onMouseLeave }>
			<div
				className='display-key-block'
				style={ block1Style }>
				<div className='display-key-block-inner-background'/>
				<div className='display-key-block-inner'/>
			</div>
			<div
				className='display-key-block'
				style={ block2Style }>
				<div className='display-key-block-inner-background'/>
				<div className='display-key-block-inner'/>
			</div>
		</div>;
	}

}

module.exports = Key;
