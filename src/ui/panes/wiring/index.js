const React = require('react');

const NumberBox = require('ui/elements/numberbox');
const Help = require('ui/elements/help');

const C = require('const');

class Wiring extends React.Component {

	render() {
		const state = this.props.state;
		const keyboard = state.keyboard;
		const selected = keyboard.selected;

		return <div className='pane-wiring'>
			Change the number of rows and columns in the matrix.
			<div style={{ height: '0.5rem' }}/>
			<h2 style={{ width: '4rem', marginRight: '0.5rem' }}>Rows</h2>
			<NumberBox
				style={{ width: '3rem' }}
				min={ 1 }
				value={ keyboard.rows }
				onChange={ v => keyboard.rows = v }/>
			<div style={{ height: '0.5rem' }}/>
			<h2 style={{ width: '4rem', marginRight: '0.5rem' }}>Columns</h2>
			<NumberBox
				style={{ width: '3rem' }}
				min={ 1 }
				value={ keyboard.cols }
				onChange={ v => keyboard.cols = v }/>
			<div style={{ height: '1.5rem' }}/>
			Specify the diode direction.
			<div style={{ height: '0.5rem' }}/>
			<select
				value={ keyboard.settings.diodeDirection }
				onChange={ e => keyboard.setSetting('diodeDirection', parseInt(e.target.value)) }>
				<option value={ C.DIODE_COL2ROW }>Column to Row</option>
				<option value={ C.DIODE_ROW2COL }>Row to Column</option>
			</select>
			<Help>
				<strong>Column to Row</strong>: Marked end of diode towards row. Used by most PCBs and handwired builds (Recommended).
				<br/>
				<strong>Row to Column</strong>: Marked end of diode towards column. Used by Phantom TKL PCB. Not common.
			</Help>
			<div style={{ height: '1.5rem' }}/>
			Change the position of the selected key in the matrix.
			<div style={{ height: '0.5rem' }}/>

			{(() => {
				if (selected) {
					return <div>
						<h2 style={{ width: '4rem', marginRight: '0.5rem' }}>Row</h2>
						<NumberBox
							style={{ width: '3rem' }}
							minus='chevron-up'
							plus='chevron-down'
							min='0'
							max={ keyboard.rows - 1 }
							value={ selected.row }
							onChange={ v => selected.row = v }/>
						<div style={{ height: '0.5rem' }}/>
						<h2 style={{ width: '4rem', marginRight: '0.5rem' }}>Column</h2>
							<NumberBox
								style={{ width: '3rem' }}
							minus='chevron-left'
							plus='chevron-right'
							min='0'
							max={ keyboard.cols - 1 }
							value={ selected.col }
							onChange={ v => selected.col = v }/>
					</div>;
				} else {
					return <h5>No key selected</h5>;
				}
			})()}
		</div>;
	}

}

module.exports = Wiring;
