import {useCodebridgeContext} from '@codebridge/codebridgeContext';
import {PopUpButton} from '@codebridge/PopUpButton/PopUpButton';
import {sendCodebridgeAnalyticsEvent} from '@codebridge/utils/analyticsReporterHelper';
import React, {useCallback} from 'react';

import codebridgeI18n from '@cdo/apps/codebridge/locale';
import FontAwesomeV6Icon from '@cdo/apps/componentLibrary/fontAwesomeV6Icon/FontAwesomeV6Icon';
import {TooltipProps} from '@cdo/apps/componentLibrary/tooltip';
import WithTooltip from '@cdo/apps/componentLibrary/tooltip/WithTooltip';
import {EVENTS} from '@cdo/apps/metrics/AnalyticsConstants';
import {useAppSelector} from '@cdo/apps/util/reduxHooks';

import darkModeStyles from '@codebridge/styles/dark-mode.module.scss';

/*
  Please note - this is a fairly brittle component in that it's only allowing toggling between
  horizontal and vertical layouts.

  At some point in the future, we may need to expand the functionality to select between arbitrary
  layouts which are available.
*/

const SwapLayoutDropdown: React.FunctionComponent = () => {
  const {config, setConfig} = useCodebridgeContext();
  const appName = useAppSelector(state => state.lab.levelProperties?.appName);

  const onLayoutChange = useCallback(() => {
    const newLayout =
      config.activeGridLayout === 'horizontal' ? 'vertical' : 'horizontal';
    sendCodebridgeAnalyticsEvent(EVENTS.CODEBRIDGE_MOVE_CONSOLE, appName, {
      positionMovedTo: newLayout,
    });
    setConfig({
      ...config,
      activeGridLayout: newLayout,
    });
  }, [appName, config, setConfig]);

  if (!config.activeGridLayout || !config.labeledGridLayouts) {
    return null;
  }

  const iconName =
    config.activeGridLayout === 'horizontal' ? 'up-down' : 'left-right';
  const layoutLabel =
    config.activeGridLayout === 'horizontal'
      ? codebridgeI18n.verticalLayout()
      : codebridgeI18n.defaultLayout();

  const tooltipProps: TooltipProps = {
    text: codebridgeI18n.changeLayout(),
    direction: 'onLeft',
    tooltipId: 'change-layout-tooltip',
    size: 'xs',
  };

  return (
    <WithTooltip tooltipProps={tooltipProps}>
      <PopUpButton iconName="ellipsis-v" alignment="right">
        <div onClick={onLayoutChange} className={darkModeStyles.dropdownItem}>
          <FontAwesomeV6Icon iconName={iconName} iconStyle={'solid'} />
          <div>{layoutLabel}</div>
        </div>
      </PopUpButton>
    </WithTooltip>
  );
};

export default SwapLayoutDropdown;
