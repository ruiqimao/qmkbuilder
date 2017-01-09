const React = require('react');

const Toggle = require('ui/elements/toggle');

class Mods extends React.Component {

	render() {
		const mods = this.props.mods;

		return <div>
			&nbsp;&nbsp;Mods&nbsp;&nbsp;&nbsp;
			<Toggle
				value={ mods & 0b000001 }
				onChange={ v => (this.props.onChange && this.props.onChange(v ? (mods | 0b000001) : (mods & ~0b000001))) }>
				CTRL
			</Toggle>
			<Toggle
				value={ mods & 0b000010 }
				onChange={ v => (this.props.onChange && this.props.onChange(v ? (mods | 0b000010) : (mods & ~0b000010))) }>
				SHIFT
			</Toggle>
			<Toggle
				value={ mods & 0b000100 }
				onChange={ v => (this.props.onChange && this.props.onChange(v ? (mods | 0b000100) : (mods & ~0b000100))) }>
				ALT
			</Toggle>
			<Toggle
				value={ mods & 0b001000 }
				onChange={ v => (this.props.onChange && this.props.onChange(v ? (mods | 0b001000) : (mods & ~0b001000))) }>
				GUI
			</Toggle>
			<Toggle
				value={ mods & 0b010000 }
				onChange={ v => (this.props.onChange && this.props.onChange(v ? (mods | 0b010000) : (mods & ~0b010000))) }>
				HYPER
			</Toggle>
			<Toggle
				value={ mods & 0b100000 }
				onChange={ v => (this.props.onChange && this.props.onChange(v ? (mods | 0b100000) : (mods & ~0b100000))) }>
				MEH
			</Toggle>
		</div>;
	}

}

module.exports = Mods;
