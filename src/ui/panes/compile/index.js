const React = require('react');

class Compile extends React.Component {

	render() {
		return <div className='pane-compile'>
			Download the .hex file to flash to your keyboard.
			<div style={{ height: '0.5rem' }}/>
			<button>
				Download .hex
			</button>
			<div style={{ height: '1.5rem' }}/>
			Download the source files.
			<div style={{ height: '0.5rem' }}/>
			<button className='light'>
				Download .zip
			</button>
		</div>;
	}

}

module.exports = Compile;
