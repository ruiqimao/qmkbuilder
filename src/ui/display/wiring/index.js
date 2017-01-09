const React = require('react');
const classNames = require('classnames');

const Wire = require('./wire');

const C = require('const');

class Wiring extends React.Component {

	render() {
		const state = this.props.state;
		const keyboard = state.keyboard;
		const flipped = state.ui.get('display-flip', false);

		const keySize = state.ui.get('keySize', C.KEY_SIZE);

		// Create a list of Wires.
		const wires = [];
		for (let r = 0; r < keyboard.rows; r ++) {
			for (let c = 0; c < keyboard.cols; c ++) {
				// Check if there's a key at the matrix position.
				let keys;
				if (!(keys = keyboard.wiring[r + ',' + c])) continue;

				// Check if there's a key at a previous row.
				let prevRow;
				let i = 1;
				while (!(prevRow = keyboard.wiring[(r - i) + ',' + c]) && i ++ <= r);
				if (i <= r) {
					// Create wires.
					for (const key of keys) {
						for (const rowKey of prevRow) {
							wires.push(<Wire col
								state={ state }
								p1={ key.center }
								p2={ rowKey.center }
								key={ key.id + ',' + rowKey.id }/>);
						}
					}
				}

				// Check if there's a key at a previous column.
				let prevCol;
				i = 1;
				while (!(prevCol = keyboard.wiring[r + ',' + (c - i)]) && i ++ <= c);
				if (i <= c) {
					// Create wires.
					for (const key of keys) {
						for (const colKey of prevCol) {
							wires.push(<Wire row
								state={ state }
								p1={ key.center }
								p2={ colKey.center }
								key={ key.id + ',' + colKey.id }/>);
						}
					}
				}
			}
		}

		// Get the positions for each label.
		const rowPositions = {};
		const colPositions = {};
		for (const key of keyboard.keys) {
			if (!rowPositions[key.row] || key.center.x < rowPositions[key.row].x) rowPositions[key.row] = key.center;
			if (!colPositions[key.col] || key.center.y < colPositions[key.col].y) colPositions[key.col] = key.center;
		}

		// Place labels for the wires.
		const labels = [];
		for (let r = 0; r < keyboard.rows; r ++) {
			if (!rowPositions[r]) continue;

			const style = {
				top: rowPositions[r].y * keySize,
				left: -30
			};
			labels.push(<div
				className='display-wire-label row'
				style={ style }
				key={ 'r' + r }>
				{ r }
			</div>);
		}
		for (let c = 0; c < keyboard.cols; c ++) {
			if (!colPositions[c]) continue;

			const style = {
				top: -30,
				left: (flipped ? keyboard.bounds.max.x - colPositions[c].x : colPositions[c].x) * keySize,
			};
			labels.push(<div
				className='display-wire-label col'
				style={ style }
				key={ 'c' + c }>
				{ c }
			</div>);
		}

		return <div className='display-inner'>
			{ keyboard.keys.map((key, index) => {
				// Draw a pad on each key.
				return <div
					className='display-pad'
					style={{
						top: key.center.y * keySize,
						left: (flipped ? keyboard.bounds.max.x - key.center.x : key.center.x) * keySize
					}}
					key={ index }/>
			}) }
			{ wires }
			{ labels }
		</div>;
	}

}

module.exports = Wiring;
