const React = require('react');

class Help extends React.Component {

	render() {
		return <div className='help'>
			<div className='help-icon'>
				<i className='fa fa-question-circle'/>
			</div>
			<div className='help-content'>
				{ this.props.children }
			</div>
		</div>;
	}

}

module.exports = Help;
