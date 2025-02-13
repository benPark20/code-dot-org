import {useCodebridgeContext} from '@codebridge/codebridgeContext';
import ToggleFileBrowserButton from '@codebridge/components/ToggleFileBrowserButton';
import {Editor} from '@codebridge/Editor';
import {FileBrowser} from '@codebridge/FileBrowser';
import {FileTabs} from '@codebridge/FileTabs';
import classnames from 'classnames';
import React from 'react';

import codebridgeI18n from '@cdo/apps/codebridge/locale';
import Alert from '@cdo/apps/componentLibrary/alert/Alert';
import {START_SOURCES, WARNING_BANNER_MESSAGES} from '@cdo/apps/lab2/constants';
import {isProjectTemplateLevel} from '@cdo/apps/lab2/lab2Redux';
import {getAppOptionsEditBlocks} from '@cdo/apps/lab2/projects/utils';
import {setRestoredOldVersion} from '@cdo/apps/lab2/redux/lab2ProjectRedux';
import PanelContainer from '@cdo/apps/lab2/views/components/PanelContainer';
import ProjectTemplateWorkspaceIcon from '@cdo/apps/templates/ProjectTemplateWorkspaceIcon';
import {useAppDispatch, useAppSelector} from '@cdo/apps/util/reduxHooks';
import commonI18n from '@cdo/locale';

import HeaderButtons from './HeaderButtons';

import moduleStyles from './workspace.module.scss';

const Workspace = () => {
  const {config} = useCodebridgeContext();
  const isStartMode = getAppOptionsEditBlocks() === START_SOURCES;
  const projectTemplateLevel = useAppSelector(isProjectTemplateLevel);
  const viewingOldVersion = useAppSelector(
    state => state.lab2Project.viewingOldVersion
  );
  const hasRestoredOldVersion = useAppSelector(
    state => state.lab2Project.restoredOldVersion
  );
  const dispatch = useAppDispatch();

  const headerContent = (
    <>
      {commonI18n.workspaceHeaderShort()}{' '}
      {projectTemplateLevel && <ProjectTemplateWorkspaceIcon />}
    </>
  );

  const closeRestoredVersionBanner = () => {
    dispatch(setRestoredOldVersion(false));
  };

  return (
    <PanelContainer
      id="editor-workspace"
      headerContent={headerContent}
      rightHeaderContent={<HeaderButtons />}
      className={moduleStyles.workspace}
    >
      <div
        className={classnames(moduleStyles.workspaceWorkarea, {
          [moduleStyles.withFileBrowser]: config.showFileBrowser,
        })}
      >
        <div
          className={classnames(moduleStyles.workspaceToggleButtonContainer, {
            [moduleStyles.withFileBrowser]: config.showFileBrowser,
          })}
        >
          <ToggleFileBrowserButton />
        </div>
        <div>
          <FileTabs />
        </div>

        {config.showFileBrowser && <FileBrowser />}

        <div
          className={classnames(moduleStyles.workplaceEditorWrapper, {
            [moduleStyles.withFileBrowser]: config.showFileBrowser,
          })}
        >
          {isStartMode && (
            <div
              id="startSourcesWarningBanner"
              className={moduleStyles.warningBanner}
            >
              {projectTemplateLevel
                ? WARNING_BANNER_MESSAGES.TEMPLATE
                : WARNING_BANNER_MESSAGES.STANDARD}
            </div>
          )}
          <Editor
            langMapping={config.languageMapping}
            editableFileTypes={config.editableFileTypes}
          />
        </div>
        <div className={moduleStyles.workspaceWarningArea}>
          {viewingOldVersion && (
            <Alert text={codebridgeI18n.viewingOldVersion()} type={'warning'} />
          )}
          {hasRestoredOldVersion && (
            <Alert
              text={codebridgeI18n.restoredOldVersion()}
              type={'success'}
              onClose={closeRestoredVersionBanner}
            />
          )}
        </div>
      </div>
    </PanelContainer>
  );
};
export default Workspace;
