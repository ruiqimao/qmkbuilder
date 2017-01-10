const React = require('react');

const Main = require('main/main');
const Editor = require('main/editor');

const State = require('state');

const C = require('const');

class Index extends React.Component {

	constructor(props) {
		super(props);

		this.state = new State(this);
	}

	render() {
		// Assign the current screen.
		let Screen;
		if (this.state.screen === C.SCREEN_MAIN) {
			Screen = Main;
		} else {
			Screen = Editor;
		}

		return <div>
			<div className='header'>
				QMK Firmware Builder
			</div>
			<Screen
				state={ this.state }/>
		</div>;
	}

}

module.exports = Index;
