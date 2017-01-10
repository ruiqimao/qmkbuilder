const React = require('react');

const Display = require('ui/display');
const Panes = require('ui/panes');

class Editor extends React.Component {

	constructor(props) {
		super(props);

		// Initialize notification for leaving page.
		window.onbeforeunload = () => {
			return 'Are you sure you want to leave the page? You may have unsaved changes.';
		};
	}

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
