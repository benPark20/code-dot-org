import musicI18n from '../locale';

import {backupFunctionDefinitons} from './blockUtils';
import {
  DEFAULT_TRACK_NAME_EXTENSION,
  FIELD_CHORD_TYPE,
  FIELD_PATTERN_TYPE,
  FIELD_PATTERN_AI_TYPE,
  FIELD_TUNE_TYPE,
  FIELD_SOUNDS_TYPE,
  PLAY_MULTI_MUTATOR,
  FIELD_EFFECTS_EXTENSION,
} from './constants';
import {
  getDefaultTrackNameExtension,
  playMultiMutator,
  effectsFieldExtension,
} from './extensions';
import FieldChord from './FieldChord';
import FieldPattern from './FieldPattern';
import FieldPatternAi from './FieldPatternAi';
import FieldSounds from './FieldSounds';
import FieldTune from './FieldTune';
import {MUSIC_BLOCKS} from './musicBlocks';
import {BlockConfig} from './types';

/**
 * Set up the global Blockly environment for Music Lab. This should
 * only be called once per page load, as it configures the global
 * Blockly state.
 * @param {string} blockMode - The block mode to determine whether advanced blocks should be registered.
 */
export function setUpBlocklyForMusicLab() {
  backupFunctionDefinitons();
  Blockly.Extensions.register(
    DEFAULT_TRACK_NAME_EXTENSION,
    getDefaultTrackNameExtension()
  );

  Blockly.Extensions.register(FIELD_EFFECTS_EXTENSION, effectsFieldExtension);
  Blockly.Extensions.registerMutator(PLAY_MULTI_MUTATOR, playMultiMutator);

  // Needed for TypeScript to recognize the type of the MUSIC_BLOCKS. Remove
  // after converting musicBlocks to TypeScript.
  const typedMusicBlocks = MUSIC_BLOCKS as {[key: string]: BlockConfig};
  for (const blockType of Object.keys(typedMusicBlocks)) {
    const blockConfig = typedMusicBlocks[blockType] as BlockConfig;
    Blockly.Blocks[blockType] = {
      init: function () {
        this.jsonInit(blockConfig.definition);
      },
    };

    Blockly.JavaScript[blockType] = blockConfig.generator;
  }

  Blockly.fieldRegistry.register(FIELD_SOUNDS_TYPE, FieldSounds);
  Blockly.fieldRegistry.register(FIELD_PATTERN_TYPE, FieldPattern);
  Blockly.fieldRegistry.register(FIELD_PATTERN_AI_TYPE, FieldPatternAi);
  Blockly.fieldRegistry.register(FIELD_CHORD_TYPE, FieldChord);
  Blockly.fieldRegistry.register(FIELD_TUNE_TYPE, FieldTune);

  // Rename the new function placeholder text for Music Lab specifically.
  Blockly.Msg['PROCEDURES_DEFNORETURN_PROCEDURE'] =
    musicI18n.blockly_functionNamePlaceholder();

  Blockly.setInfiniteLoopTrap();
}
