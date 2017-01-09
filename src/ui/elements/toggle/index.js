const React = require('react');

class Toggle extends React.Component {

	render() {
		return <div
			className={ 'toggle' + (this.props.value ? ' enabled' : '') }
			onClick={ () => (this.props.onChange && this.props.onChange(!this.props.value)) }>
			{ this.props.children }
		</div>;
	}

}

module.exports = Toggle;
