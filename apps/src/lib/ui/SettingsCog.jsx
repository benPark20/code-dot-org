/** @file Settings menu cog icon */
import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import Portal from 'react-portal';
import msg from '@cdo/locale';
import FontAwesome from '../../templates/FontAwesome';
import color from '../../util/color';
import * as assets from '../../code-studio/assets';
import project from '../../code-studio/initApp/project';
import * as maker from '../kits/maker/toolkit';
import PopUpMenu from './PopUpMenu';

const style = {
  iconContainer: {
    float: 'right',
    marginRight: 10,
    marginLeft: 10,
    height: '100%',
    cursor: 'pointer',
    color: color.lighter_purple,
    ':hover': {
      color: color.white,
    }
  },
  assetsIcon: {
    fontSize: 18,
    verticalAlign: 'middle',
  },
};

class SettingsCog extends Component {
  constructor(props) {
    super(props);

    // Bind methods to instance
    this.open = this.open.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.close = this.close.bind(this);
    this.manageAssets = this.manageAssets.bind(this);
    this.toggleMakerToolkit = this.toggleMakerToolkit.bind(this);

    // Default icon bounding rect for first render
    this.targetPoint = {top: 0, left: 0};
  }

  static propTypes = {
    isRunning: PropTypes.bool,
    runModeIndicators: PropTypes.bool,
  };

  // This ugly two-flag state is a workaround for an event-handling bug in
  // react-portal that prevents closing the portal by clicking on the icon
  // that opened it.  For now we're just disabling the cog when the menu is
  // open, and re-enabling one tick after it closes.
  // @see https://github.com/tajo/react-portal/issues/140
  state = {
    open: false,
    canOpen: true,
  };

  open() {
    this.setState({open: true, canOpen: false});
  }

  beforeClose(_, resetPortalState) {
    resetPortalState();
    this.setState({open: false});
    window.setTimeout(() => this.setState({canOpen: true}), 0);
  }

  close() {
    this.setState({open: false});
  }

  manageAssets() {
    this.close();
    assets.showAssetManager();
  }

  toggleMakerToolkit() {
    this.close();
    project.toggleMakerEnabled();
  }

  setTargetPoint(icon) {
    if (!icon) {
      return;
    }

    const rect = icon.getBoundingClientRect();
    const offsetSoItLooksRight = {top: -6, left: -1};
    this.targetPoint = {
      top: rect.bottom + offsetSoItLooksRight.top,
      left: rect.left + (rect.width / 2) + offsetSoItLooksRight.left,
    };
  }

  render() {
    const {isRunning, runModeIndicators} = this.props;

    // Adjust icon color when running
    const rootStyle = {...style.iconContainer};
    if (runModeIndicators && isRunning) {
      rootStyle.color = color.dark_charcoal;
    }

    return (
      <span
        style={rootStyle}
        ref={icon => this.setTargetPoint(icon)}
      >
        <FontAwesome
          className="settings-cog"
          icon="cog"
          style={style.assetsIcon}
          title={msg.settings()}
          onClick={this.state.canOpen ? this.open : undefined}
        />
        <Portal
          closeOnEsc
          closeOnOutsideClick
          isOpened={this.state.open}
          beforeClose={this.beforeClose}
        >
          <SettingsMenu
            targetPoint={this.targetPoint}
            handleManageAssets={this.manageAssets}
            handleToggleMaker={this.toggleMakerToolkit}
          />
        </Portal>
      </span>
    );
  }
}
export default Radium(SettingsCog);

export class SettingsMenu extends Component {
  static propTypes = {
    targetPoint: PropTypes.shape({
     top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
    }).isRequired,
    handleManageAssets: PropTypes.func.isRequired,
    handleToggleMaker: PropTypes.func.isRequired,
  };

  render() {
    return (
      <PopUpMenu className="settings-cog-menu" targetPoint={this.props.targetPoint}>
        <PopUpMenu.Item onClick={this.props.handleManageAssets}>
          {msg.manageAssets()}
        </PopUpMenu.Item>
        {maker.isAvailable() &&
        <PopUpMenu.Item onClick={this.props.handleToggleMaker}>
          {maker.isEnabled() ? msg.disableMaker() : msg.enableMaker()}
        </PopUpMenu.Item>
        }
      </PopUpMenu>
    );
  }
}
