const React = require('react');

const Display = require('ui/display');
const Panes = require('ui/panes');

class Editor extends React.Component {

	render() {
		return <div>
			<Display
				state={ this.props.state }/>
			<Panes
				state={ this.props.state }/>
		</div>;
	}

}

module.exports = Editor;
