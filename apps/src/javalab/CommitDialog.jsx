import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@cdo/javalab/locale';
import color from '@cdo/apps/util/color';
import StylizedBaseDialog, {
  FooterButton
} from '@cdo/apps/componentLibrary/StylizedBaseDialog';
import {connect} from 'react-redux';

class CommitDialog extends React.Component {
  state = {
    filesToBackpack: [],
    commitNotes: '',
    saveInProgress: false,
    hasSaveError: false
  };

  renderFooter = () => {
    let footerIcon = '';
    let footerMessageTitle = '';
    let footerMessageText = '';
    let commitText = i18n.commit();
    const isCommitButtonDisabled =
      !this.state.commitNotes || this.state.saveInProgress;
    if (this.state.filesToBackpack.length > 0) {
      commitText = i18n.commitAndSave();
    }

    // TODO: Add compile status here
    if (this.state.saveInProgress) {
      footerIcon = (
        <span className="fa fa-spin fa-spinner" style={styles.spinner} />
      );
      footerMessageTitle = i18n.saving();
    } else if (this.state.hasSaveError) {
      footerIcon = (
        <span className="fa fa-exclamation-circle" style={styles.iconError} />
      );
      footerMessageTitle = i18n.backpackSaveErrorTitle();
      footerMessageText = i18n.backpackSaveErrorMessage();
    }

    return [
      <div key="footer-status" style={styles.footerStatus}>
        <div style={styles.footerIcon}>{footerIcon}</div>
        <div style={styles.footerMessage}>
          <div style={styles.footerMessageTitle}>{footerMessageTitle}</div>
          <div style={styles.footerMessageText}>{footerMessageText}</div>
        </div>
      </div>,
      <div key="buttons">
        <FooterButton
          key="cancel"
          type="cancel"
          text={i18n.cancel()}
          onClick={this.clearSaveStateAndClose}
        />
        ,
        <FooterButton
          id="confirmationButton"
          key="confirm"
          text={commitText}
          disabled={isCommitButtonDisabled}
          color="green"
          onClick={this.commitAndSaveToBackpack}
        />
      </div>
    ];
  };

  commitAndSaveToBackpack = () => {
    this.props.handleCommit(this.state.commitNotes);
    this.saveToBackpack();
  };

  saveToBackpack = () => {
    this.setState({
      hasSaveError: false,
      saveInProgress: true
    });

    // TODO: Compile before saving and show error if compile fails
    this.props.backpackApi.saveFiles(
      this.props.sources,
      this.state.filesToBackpack,
      this.handleSaveError,
      this.handleSaveSuccess
    );
  };

  handleSaveError = () => {
    this.setState({
      hasSaveError: true,
      saveInProgress: false
    });
  };

  handleSaveSuccess = () => {
    this.setState({
      hasSaveError: false,
      saveInProgress: false,
      commitNotes: '',
      filesToBackpack: []
    });
    this.props.handleClose();
  };

  clearSaveStateAndClose = () => {
    this.setState({
      hasSaveError: false,
      saveInProgress: false
    });
    this.props.handleClose();
  };

  toggleFileToBackpack = filename => {
    let filesToBackpack = [...this.state.filesToBackpack];
    const fileIdx = filesToBackpack.indexOf(filename);
    if (fileIdx === -1) {
      filesToBackpack.push(filename);
    } else {
      filesToBackpack.splice(fileIdx, 1);
    }

    this.setState({filesToBackpack});
  };

  render() {
    const {commitNotes, filesToBackpack} = this.state;
    const {isOpen, files} = this.props;

    return (
      <StylizedBaseDialog
        isOpen={isOpen}
        title={i18n.commitCode()}
        confirmationButtonText={i18n.commit()}
        body={
          <CommitDialogBody
            files={files.map(name => ({
              name,
              commit: filesToBackpack.includes(name)
            }))}
            notes={commitNotes}
            onToggleFile={this.toggleFileToBackpack}
            onChangeNotes={commitNotes => this.setState({commitNotes})}
          />
        }
        renderFooter={this.renderFooter}
        handleClose={this.clearSaveStateAndClose}
        footerJustification="space-between"
      />
    );
  }
}

CommitDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  files: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClose: PropTypes.func.isRequired,
  handleCommit: PropTypes.func.isRequired,
  // populated by redux
  sources: PropTypes.object,
  backpackApi: PropTypes.object
};

function CommitDialogBody({files, notes, onToggleFile, onChangeNotes}) {
  return (
    <div>
      <label htmlFor="commit-notes" style={{...styles.bold, ...styles.notes}}>
        {i18n.commitNotes()}
      </label>
      <textarea
        id="commit-notes"
        placeholder={i18n.commitNotesPlaceholder()}
        onChange={e => onChangeNotes(e.target.value)}
        style={styles.textarea}
        value={notes}
      />
      <div style={{...styles.bold, ...styles.filesHeader}}>
        {i18n.saveToBackpack()}
      </div>
      {files.map(file => (
        <div key={file.name} style={styles.fileRow}>
          <label htmlFor={`commit-${file.name}`} style={styles.fileLabel}>
            {file.name}
          </label>
          <input
            id={`commit-${file.name}`}
            type="checkbox"
            checked={file.commit}
            onChange={() => onToggleFile(file.name)}
            style={styles.checkbox}
          />
        </div>
      ))}
    </div>
  );
}

CommitDialogBody.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      commit: PropTypes.bool.isRequired
    })
  ).isRequired,
  notes: PropTypes.string,
  onToggleFile: PropTypes.func.isRequired,
  onChangeNotes: PropTypes.func.isRequired
};

const PADDING = 8;
const styles = {
  bold: {
    fontFamily: '"Gotham 5r", sans-serif',
    color: color.dark_charcoal
  },
  footerStatus: {
    display: 'flex',
    alignItems: 'center'
  },
  iconSuccess: {
    color: color.level_perfect,
    marginRight: 5
  },
  filesHeader: {
    fontSize: 14,
    backgroundColor: color.lightest_gray,
    padding: PADDING
  },
  fileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: PADDING,
    paddingBottom: PADDING / 2,
    borderBottom: `1px solid ${color.lightest_gray}`
  },
  fileLabel: {
    flexGrow: 2,
    color: color.default_text
  },
  checkbox: {
    width: 18,
    height: 18
  },
  notes: {
    paddingTop: PADDING * 2
  },
  textarea: {
    width: '98%',
    height: 75,
    resize: 'none'
  },
  iconError: {
    color: color.light_orange,
    fontSize: 32
  },
  footerMessageTitle: {
    fontFamily: '"Gotham 5r", sans-serif',
    fontSize: 14
  },
  footerMessageText: {
    fontStyle: 'italic',
    fontSize: 12
  },
  footerMessage: {
    color: color.dark_charcoal
  },
  spinner: {
    color: color.dark_charcoal,
    fontSize: 28
  },
  footerIcon: {
    paddingRight: PADDING
  }
};

export default connect(state => ({
  sources: state.javalab.sources,
  backpackApi: state.javalab.backpackApi
}))(CommitDialog);
