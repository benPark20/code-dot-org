import {useCodebridgeContext} from '@codebridge/codebridgeContext';
import {LanguageSupport} from '@codemirror/language';
import React, {useCallback, useMemo} from 'react';

import codebridgeI18n from '@cdo/apps/codebridge/locale';
import {BodyOneText} from '@cdo/apps/componentLibrary/typography';
import {getActiveFileForProject} from '@cdo/apps/lab2/projects/utils';
import CodeEditor from '@cdo/apps/lab2/views/components/editor/CodeEditor';

import {editableFileType} from '../utils';

import moduleStyles from './styles/editor.module.scss';

interface EditorProps {
  langMapping: {[key: string]: LanguageSupport};
  editableFileTypes: string[];
}

export const Editor = ({langMapping, editableFileTypes}: EditorProps) => {
  const {project, saveFile} = useCodebridgeContext();

  const file = getActiveFileForProject(project);

  const onChange = useCallback(
    (value: string) => {
      if (file?.id) {
        saveFile(file.id, value);
      }
    },
    [file?.id, saveFile]
  );

  const editorConfigExtensions = useMemo(() => {
    if (file?.language && langMapping[file.language]) {
      return [langMapping[file.language]];
    } else {
      return [];
    }
  }, [file?.language, langMapping]);

  if (file && !editableFileType(file.language, editableFileTypes)) {
    return (
      <div>{codebridgeI18n.cannotEditFile({language: file.language})}</div>
    );
  }

  return (
    <div className={moduleStyles.editorContainer}>
      {file ? (
        <CodeEditor
          key={`${file.id}/${1}`}
          darkMode={true}
          onCodeChange={onChange}
          startCode={file.contents}
          editorConfigExtensions={editorConfigExtensions}
        />
      ) : (
        <BodyOneText className={moduleStyles.noOpenFilesMessage}>
          {codebridgeI18n.noOpenFiles()}
        </BodyOneText>
      )}
    </div>
  );
};
