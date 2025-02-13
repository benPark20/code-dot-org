import {resetOutput} from '@codebridge/redux/consoleRedux';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import codebridgeI18n from '@cdo/apps/codebridge/locale';
import Button, {buttonColors} from '@cdo/apps/componentLibrary/button';
import useLifecycleNotifier from '@cdo/apps/lab2/hooks/useLifecycleNotifier';
import {LifecycleEvent} from '@cdo/apps/lab2/utils/LifecycleNotifier';
import PanelContainer from '@cdo/apps/lab2/views/components/PanelContainer';
import {EVENTS} from '@cdo/apps/metrics/AnalyticsConstants';
import {useAppSelector} from '@cdo/apps/util/reduxHooks';

import {sendCodebridgeAnalyticsEvent} from '../utils/analyticsReporterHelper';

import ControlButtons from './ControlButtons';
import GraphModal from './GraphModal';
import RightButtons from './RightButtons';

import moduleStyles from './console.module.scss';

const Console: React.FunctionComponent = () => {
  const codeOutput = useAppSelector(state => state.codebridgeConsole.output);
  const dispatch = useDispatch();
  const appName = useAppSelector(state => state.lab.levelProperties?.appName);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const [graphModalOpen, setGraphModalOpen] = useState(false);
  const [activeGraphIndex, setActiveGraphIndex] = useState(0);

  // TODO: Update this with other apps that use the console as needed.
  const systemMessagePrefix = appName === 'pythonlab' ? '[PYTHON LAB] ' : '';

  const clearOutput = useCallback(() => {
    dispatch(resetOutput());
    sendCodebridgeAnalyticsEvent(EVENTS.CODEBRIDGE_CLEAR_CONSOLE, appName);
    setGraphModalOpen(false);
  }, [dispatch, appName]);

  // Clear console when we change levels.
  useLifecycleNotifier(LifecycleEvent.LevelLoadCompleted, clearOutput);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [codeOutput]);

  const popOutGraph = (index: number) => {
    sendCodebridgeAnalyticsEvent(EVENTS.CODEBRIDGE_POP_OUT_IMAGE, appName);
    setActiveGraphIndex(index);
    setGraphModalOpen(true);
  };

  return (
    <PanelContainer
      id="codebridge-console"
      className={moduleStyles.consoleContainer}
      headerContent={'Console'}
      rightHeaderContent={<RightButtons clearOutput={clearOutput} />}
      leftHeaderContent={<ControlButtons />}
      headerClassName={moduleStyles.consoleHeader}
    >
      <div className={moduleStyles.console}>
        {codeOutput.map((outputLine, index) => {
          if (outputLine.type === 'img') {
            return (
              <div key={index}>
                <img
                  src={`data:image/png;base64,${outputLine.contents}`}
                  alt="matplotlib_image"
                />
                <Button
                  color={buttonColors.black}
                  disabled={false}
                  icon={{
                    iconName: 'up-right-from-square',
                    iconStyle: 'solid',
                  }}
                  isIconOnly={true}
                  onClick={() => popOutGraph(index)}
                  size="xs"
                  type="primary"
                  aria-label="open matplotlib_image in pop-up"
                />
                {activeGraphIndex === index && graphModalOpen && (
                  <GraphModal
                    src={`data:image/png;base64,${outputLine.contents}`}
                    onClose={() => setGraphModalOpen(false)}
                  />
                )}
              </div>
            );
          } else if (
            outputLine.type === 'system_out' ||
            outputLine.type === 'system_in'
          ) {
            return <div key={index}>{outputLine.contents}</div>;
          } else if (outputLine.type === 'error') {
            return (
              <div key={index} className={moduleStyles.errorLine}>
                {outputLine.contents}
              </div>
            );
          } else if (outputLine.type === 'system_error') {
            return (
              <div key={index} className={moduleStyles.errorLine}>
                {systemMessagePrefix}
                {codebridgeI18n.systemCodeError()}
              </div>
            );
          } else {
            return (
              <div key={index}>
                {systemMessagePrefix}
                {outputLine.contents}
              </div>
            );
          }
        })}
        <div ref={scrollAnchorRef} />
      </div>
    </PanelContainer>
  );
};

export default Console;
