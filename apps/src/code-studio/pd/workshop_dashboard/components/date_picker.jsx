/**
 * DatePicker control.
 * It's basically a wrapper around react-datepicker (with limited props) that displays
 * as a React-Bootstrap select with a calendar icon Addon.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import ReactDatePicker from 'react-datepicker';
import {DATE_FORMAT} from '../workshopConstants';
import FontAwesome from '@cdo/apps/templates/FontAwesome';
import {
  InputGroup,
  FormGroup,
  FormControl
} from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

const styles = {
  readOnlyInput: {
    backgroundColor: 'inherit',
    cursor: 'default',
    border: 'none'
  },
  clearElement: {
    color:'#999',
    fontSize: '18px',
    zIndex: 10,
    cursor: 'pointer',
    pointerEvents: 'all',
    ':hover': {
      color: '#D0021B'
    }
  }
};

const DateInputWithIcon = Radium(React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool,
    onClear: React.PropTypes.func,

    // These properties are set from ReactDatePicker, expected on the customInput.
    // Pass them through to the appropriate controls below.
    onChange: React.PropTypes.func,
    onClick: React.PropTypes.func,
    value: React.PropTypes.string,
    onBlur: React.PropTypes.func
  },

  // Called by ReactDatePicker to focus on the custom input.
  // Redirect to the underlying input control.
  focus() {
    if (this.inputControl) {
      this.inputControl.focus();
    }
  },

  handleClear(e) {
    e.stopPropagation();
    this.props.onClear();
  },

  render() {
    return (
      <InputGroup onClick={this.props.onClick}>
        <FormGroup>
          <FormControl
            type="text"
            value={this.props.value}
            onChange={this.props.onChange}
            style={this.props.disabled ? styles.readOnlyInput : null}
            disabled={this.props.disabled}
            onBlur={this.props.onBlur}
            ref={ref => this.inputControl = ReactDOM.findDOMNode(ref)}
          />
          {
            !this.props.disabled && this.props.value && this.props.onClear &&
            <FormControl.Feedback>
                <span
                  style={styles.clearElement}
                  onClick={this.handleClear}
                  title="Clear value"
                >
                  &times;
                </span>
            </FormControl.Feedback>
          }
        </FormGroup>
        {!this.props.disabled && (
          <InputGroup.Addon>
            {<FontAwesome icon="calendar"/>}
          </InputGroup.Addon>
        )}
      </InputGroup>
    );
  }
}));

const DatePicker = React.createClass({
  propTypes: {
    date: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    minDate: React.PropTypes.object,
    maxDate: React.PropTypes.object,
    selectsStart: React.PropTypes.bool,
    selectsEnd: React.PropTypes.bool,
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    readOnly: React.PropTypes.bool,
    clearable: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      selectsStart: false,
      selectsEnd: false,
      startDate: null,
      endDate: null
    };
  },

  handleChange(date) {
    this.props.onChange(date);
  },

  handleClear() {
    this.props.onChange(null);
  },

  render() {
    return (
      <ReactDatePicker
        customInput={
          <DateInputWithIcon
            disabled={this.props.readOnly}
            onClear={this.props.clearable && this.handleClear}
          />
        }
        selected={this.props.date}
        onChange={this.handleChange}
        dateFormat={DATE_FORMAT}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        selectsStart={this.props.selectsStart}
        selectsEnd={this.props.selectsEnd}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        disabled={this.props.readOnly}
      />
    );
  }
});
export default DatePicker;
