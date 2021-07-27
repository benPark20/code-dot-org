import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {getStore, registerReducers} from '@cdo/apps/redux';
import JavalabView from './JavalabView';
import javalab, {
  getSources,
  getValidation,
  setAllSources,
  setAllValidation,
  setIsDarkMode,
  appendOutputLog,
  setBackpackApi,
  setIsStartMode,
  setLevelName
} from './javalabRedux';
import {TestResults} from '@cdo/apps/constants';
import project from '@cdo/apps/code-studio/initApp/project';
import JavabuilderConnection from './JavabuilderConnection';
import {showLevelBuilderSaveButton} from '@cdo/apps/code-studio/header';
import {RESIZE_VISUALIZATION_EVENT} from '@cdo/apps/lib/ui/VisualizationResizeBar';
import Neighborhood from './Neighborhood';
import NeighborhoodVisualizationColumn from './NeighborhoodVisualizationColumn';
import TheaterVisualizationColumn from './TheaterVisualizationColumn';
import Theater from './Theater';
import {CsaViewMode} from './constants';
import {DisplayTheme, getDisplayThemeFromString} from './DisplayTheme';
import BackpackClientApi from '../code-studio/components/backpack/BackpackClientApi';

/**
 * On small mobile devices, when in portrait orientation, we show an overlay
 * image telling the user to rotate their device to landscape mode.
 */
const MOBILE_PORTRAIT_WIDTH = 600;

/**
 * An instantiable Javalab class
 */

const Javalab = function() {
  this.skin = null;
  this.level = null;

  /** @type {StudioApp} */
  this.studioApp_ = null;
  this.miniApp = null;
  this.visualization = null;
};

/**
 * Inject the studioApp singleton.
 */
Javalab.prototype.injectStudioApp = function(studioApp) {
  this.studioApp_ = studioApp;
};

/**
 * Initialize this Javalab instance.  Called on page load.
 */
Javalab.prototype.init = function(config) {
  if (!this.studioApp_) {
    throw new Error('Javalab requires a StudioApp');
  }

  this.skin = config.skin;
  this.level = config.level;
  // Sets dark mode based on displayTheme user preference
  this.isDarkMode =
    getDisplayThemeFromString(config.displayTheme) === DisplayTheme.DARK;
  this.isStartMode = !!config.level.editBlocks;
  config.makeYourOwn = false;
  config.wireframeShare = true;
  config.noHowItWorks = true;
  config.usesAssets = true;

  // We don't want icons in instructions
  config.skin.staticAvatar = null;
  config.skin.smallStaticAvatar = null;
  config.skin.failureAvatar = null;
  config.skin.winAvatar = null;

  // Provide a way for us to have top pane instructions disabled by default, but
  // able to turn them on.
  config.noInstructionsWhenCollapsed = true;

  config.pinWorkspaceToBottom = true;

  config.getCode = this.getCode.bind(this);
  config.afterClearPuzzle = this.afterClearPuzzle.bind(this);
  const onRun = this.onRun.bind(this);
  const onContinue = this.onContinue.bind(this);
  const onCommitCode = this.onCommitCode.bind(this);
  const onInputMessage = this.onInputMessage.bind(this);
  const handleVersionHistory = this.studioApp_.getVersionHistoryHandler(config);
  if (this.level.csaViewMode === CsaViewMode.NEIGHBORHOOD) {
    this.miniApp = new Neighborhood();
    config.afterInject = () =>
      this.miniApp.afterInject(this.level, this.skin, config, this.studioApp_);
    this.visualization = <NeighborhoodVisualizationColumn />;
  } else if (this.level.csaViewMode === CsaViewMode.THEATER) {
    this.miniApp = new Theater();
    this.visualization = <TheaterVisualizationColumn />;
  }

  const onMount = () => {
    // NOTE: Most other apps call studioApp.init(). Like WebLab, Ailab, and Fish, we don't.
    this.studioApp_.setConfigValues_(config);
    window.addEventListener(RESIZE_VISUALIZATION_EVENT, e => {
      this.studioApp_.resizeVisualization(e.detail);
    });

    // NOTE: if we called studioApp_.init(), the code here would be executed
    // automatically since pinWorkspaceToBottom is true...
    const container = document.getElementById(config.containerId);
    const bodyElement = document.body;
    bodyElement.style.overflow = 'hidden';
    bodyElement.className = bodyElement.className + ' pin_bottom';
    container.className = container.className + ' pin_bottom';
    this.studioApp_.initVersionHistoryUI(config);
    this.studioApp_.initTimeSpent();
    this.studioApp_.initProjectTemplateWorkspaceIconCallout();

    // Fixes viewport for small screens.  Also usually done by studioApp_.init().
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      this.studioApp_.fixViewportForSpecificWidthForSmallScreens_(
        viewport,
        MOBILE_PORTRAIT_WIDTH
      );
    }
    config.afterInject?.();
  };

  // Push initial level properties into the Redux store
  this.studioApp_.setPageConstants(config, {
    channelId: config.channel,
    isProjectLevel: !!config.level.isProjectLevel,
    isEditingStartSources: this.isStartMode,
    isResponsive: true
  });

  registerReducers({javalab});
  // If we're in editBlock mode (for editing start_sources) we set up the save button to save
  // the project file information into start_sources on the level.
  if (config.level.editBlocks) {
    config.level.lastAttempt = '';
    showLevelBuilderSaveButton(() => ({
      start_sources: getSources(getStore().getState()),
      validation: getValidation(getStore().getState())
    }));
  }

  const startSources = config.level.lastAttempt || config.level.startSources;
  const validation = config.level.validation || {};
  // if startSources exists and contains at least one key, use startSources
  if (
    startSources &&
    typeof startSources === 'object' &&
    Object.keys(startSources).length > 0
  ) {
    if (config.level.editBlocks) {
      Object.keys(startSources).forEach(key => {
        startSources[key].isValidation = false;
      });
      Object.keys(validation).forEach(key => {
        validation[key].isValidation = true;
        validation[key].isVisible = false;
      });
      getStore().dispatch(
        setAllSources({
          ...startSources,
          // If we're editing start sources, validation is part of the source
          ...(config.level.editBlocks && validation)
        })
      );
    } else {
      getStore().dispatch(setAllSources(startSources));
    }
  }

  // If we aren't editing start sources but we have validation code, we need to
  // store it in redux to check for naming conflicts
  if (
    !config.level.editBlocks &&
    validation &&
    typeof validation === 'object' &&
    Object.keys(validation).length > 0
  ) {
    getStore().dispatch(setAllValidation(validation));
  }

  // Set information about the current Javalab level being displayed.
  getStore().dispatch(setIsStartMode(this.isStartMode));
  getStore().dispatch(setLevelName(this.level.name));

  // Dispatches a redux update of isDarkMode
  getStore().dispatch(setIsDarkMode(this.isDarkMode));

  // ensure autosave is executed on first run by manually setting
  // projectChanged to true.
  project.projectChanged();

  getStore().dispatch(
    setBackpackApi(new BackpackClientApi(config.backpackChannel))
  );

  ReactDOM.render(
    <Provider store={getStore()}>
      <JavalabView
        onMount={onMount}
        onRun={onRun}
        onContinue={onContinue}
        onCommitCode={onCommitCode}
        onInputMessage={onInputMessage}
        handleVersionHistory={handleVersionHistory}
        visualization={this.visualization}
      />
    </Provider>,
    document.getElementById(config.containerId)
  );

  window.addEventListener('beforeunload', this.beforeUnload.bind(this));
};

// Ensure project is saved before exiting
Javalab.prototype.beforeUnload = function(event) {
  if (project.hasOwnerChangedProject()) {
    // Manually trigger an autosave instead of waiting for the next autosave.
    project.autosave();

    event.preventDefault();
    event.returnValue = '';
  } else {
    delete event.returnValue;
  }
};

// Called by the Javalab app when it wants execute student code.
Javalab.prototype.onRun = function() {
  this.miniApp?.reset?.();
  const options = {};
  if (this.level.csaViewMode === CsaViewMode.NEIGHBORHOOD) {
    options.useNeighborhood = true;
  }
  this.javabuilderConnection = new JavabuilderConnection(
    this.level.javabuilderUrl,
    message => getStore().dispatch(appendOutputLog(message)),
    this.miniApp,
    getStore().getState().pageConstants.serverLevelId,
    options
  );
  project.autosave(() => {
    this.javabuilderConnection.connectJavabuilder();
  });
};

// Called by Javalab console to send a message to Javabuilder.
Javalab.prototype.onInputMessage = function(message) {
  this.javabuilderConnection.sendMessage(message);
};

// Called by the Javalab app when it wants to go to the next level.
Javalab.prototype.onContinue = function() {
  const onReportComplete = result => {
    this.studioApp_.onContinue();
  };

  this.studioApp_.report({
    app: 'javalab',
    level: this.level.id,
    result: true,
    testResult: TestResults.ALL_PASS,
    program: '',
    onComplete: result => {
      onReportComplete(result);
    }
  });
};

Javalab.prototype.getCode = function() {
  const storeState = getStore().getState();
  return getSources(storeState);
};

Javalab.prototype.afterClearPuzzle = function() {
  getStore().dispatch(setAllSources(this.level.startSources));
  project.autosave();
};

Javalab.prototype.onCommitCode = function(filesToCommit, commitNotes) {
  project.autosave();
};

export default Javalab;
