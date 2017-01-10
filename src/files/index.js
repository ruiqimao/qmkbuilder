const RulesMKGenerator = require('./generators/rules.mk');
const ConfigHGenerator = require('./generators/config.h');
const KbHGenerator = require('./generators/kb.h');
const KeymapCGenerator = require('./generators/keymap.c');

class Files {

	/*
	 * Generate the set of source files given a Keyboard.
	 *
	 * @param {Keyboard} keyboard The keyboard to generate files from.
	 *
	 * @return {Object} The generated source files.
	 */
	static generate(keyboard) {
		return {
			'qmk_firmware/keyboards/kb/rules.mk': new RulesMKGenerator(keyboard).generate(),
			'qmk_firmware/keyboards/kb/config.h': new ConfigHGenerator(keyboard).generate(),
			'qmk_firmware/keyboards/kb/kb.h': new KbHGenerator(keyboard).generate(),
			'qmk_firmware/keyboards/kb/keymaps/default/keymap.c': new KeymapCGenerator(keyboard).generate()
		};
	}

}

module.exports = Files;
