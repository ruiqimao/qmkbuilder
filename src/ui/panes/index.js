const React = require('react');

const Tabs = require('./tabs');
const Wiring = require('./wiring');
const Pins = require('./pins');
const Keymap = require('./keymap');
const Macros = require('./macros');
const Quantum = require('./quantum');
const Settings = require('./settings');
const Compile = require('./compile');

const C = require('const');

class Panes extends React.Component {

	render() {
		const state = this.props.state;

		return <div className='panes-wrapper'>
			<div className='panes'>
				<Tabs
					state={ state }/>
				<div className='panes-content'>
					{ state.screen === C.SCREEN_WIRING && <Wiring state={ state }/> }
					{ state.screen === C.SCREEN_PINS && <Pins state={ state }/> }
					{ state.screen === C.SCREEN_KEYMAP && <Keymap state={ state }/> }
					{ state.screen === C.SCREEN_MACROS && <Macros state={ state }/> }
					{ state.screen === C.SCREEN_QUANTUM && <Quantum state={ state }/> }
					{ state.screen === C.SCREEN_SETTINGS && <Settings state={ state }/> }
					{ state.screen === C.SCREEN_COMPILE && <Compile state={ state }/> }
				</div>
			</div>
		</div>;
	}

}

module.exports = Panes;
