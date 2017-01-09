const React = require('react');

const Help = require('ui/elements/help');

const C = require('const');

class Settings extends React.Component {

	constructor(props) {
		super(props);

		// Bind functions.
		this.save = this.save.bind(this);
	}

	/*
	 * Save the configuration.
	 */
	save() {
		const state = this.props.state;
		const keyboard = state.keyboard;

		// Get a friendly name for the keyboard.
		const friendly = keyboard.settings.name ? keyboard.settings.name.replace(/[^a-z0-9]/gi, '').toLowerCase() : 'layout';

		// Serialize the keyboard.
		const serialized = keyboard.serialize();

		// Create the configuration.
		const config = JSON.stringify({
			version: C.VERSION,
			keyboard: serialized
		});

		// Download.
		const blob = new Blob([config], { type: 'text/plain;charset=utf-8' });
		saveAs(blob, friendly + '.json');
	}

	render() {
		const state = this.props.state;
		const keyboard = state.keyboard;

		// Compile a list of errors and warnings.
		const list = [];
		let index = 0;
		for (const error of keyboard.errors) {
			list.push(<div className='pane-settings-list-element' key={ index ++ }>
				<span style={{ color: '#c0392b' }}><i className='fa fa-times-circle'/></span>
				{ error }
			</div>);
		}
		for (const warning of keyboard.warnings) {
			list.push(<div className='pane-settings-list-element' key={ index ++ }>
				<span style={{ color: '#c6cc33' }}><i className='fa fa-exclamation-triangle'/></span>
				{ warning }
			</div>);
		}
		if (list.length === 0) {
			list.push(<div style={{ padding: '1rem' }} key={ -1 }>
				No errors or warnings!
			</div>);
		}

		return <div className='pane-settings'>
			Configure your settings.
			<div style={{ height: '0.5rem' }}/>
			<h2 style={{ width: '8rem', marginRight: '0.8rem' }}>Layout Name</h2>
			<input
				style={{ width: '8rem' }}
				type='text'
				value={ keyboard.settings.name }
				onChange={ e => keyboard.setSetting('name', e.target.value) }/>
			<Help>
				Give your layout a name!
			</Help>
			<div style={{ height: '0.5rem' }}/>
			<h2 style={{ width: '8rem', marginRight: '0.8rem' }}>Bootloader Size</h2>
			<select
				style={{ width: '8rem' }}
				value={ keyboard.settings.bootloaderSize }
				onChange={ e => keyboard.setSetting('bootloaderSize', parseInt(e.target.value)) }>
				<option value={ C.BOOTLOADER_4096 }>4096 KB</option>
				<option value={ C.BOOTLOADER_2048 }>2048 KB</option>
				<option value={ C.BOOTLOADER_512 }>512 KB</option>
			</select>
			<Help>
				<strong>4096 KB</strong>: Atmel DFU Loader, LUFA Bootloader, Arduino Caterina
				<br/>
				<strong>2048 KB</strong>: USBaspLoader
				<br/>
				<strong>512 KB</strong>: Teensy halfKay
			</Help>
			<div style={{ height: '1.5rem' }}/>
			Save your layout.
			<div style={{ height: '0.5rem' }}/>
			<button onClick={ this.save }>
				Save Configuration
			</button>
			<div style={{ height: '1.5rem' }}/>
			Check errors and warnings.
			<div style={{ height: '0.5rem' }}/>
			<div className='pane-settings-list'>
				{ list }
			</div>
		</div>;
	}

}

module.exports = Settings;
