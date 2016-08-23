import FirebaseStorage from '../firebaseStorage';
import Radium from 'radium';
import React from 'react';
import { castValue, displayValue } from './dataUtils';
import * as dataStyles from './dataStyles';

const AddTableRow = React.createClass({
  propTypes: {
    columnNames: React.PropTypes.array.isRequired,
    tableName: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return { newRecord: {} };
  },

  handleChange(columnName, event) {
    const newRecord = Object.assign({}, this.state.newRecord, {
      [columnName]: castValue(event.target.value)
    });
    this.setState({ newRecord });
  },

  handleAdd() {
    FirebaseStorage.createRecord(
      this.props.tableName,
      this.state.newRecord,
      () => this.setState(this.getInitialState()),
      msg => console.warn(msg));
  },

  render() {
    return (
      <tr style={dataStyles.row}>
        {
          this.props.columnNames.map(columnName => (
            <td key={columnName} style={dataStyles.cell}>
              {
                (columnName === 'id') ?
                  <span style={{color: 'darkgray'}}>#</span> :
                  <input
                    style={dataStyles.input}
                    value={displayValue(this.state.newRecord[columnName])}
                    placeholder="enter text"
                    onChange={event => this.handleChange(columnName, event)}
                  />
              }
            </td>
          ))
        }

        <td style={dataStyles.cell}/>

        <td style={dataStyles.buttonCell}>
          <button
            className="btn btn-primary"
            style={dataStyles.button}
            onClick={this.handleAdd}
          >
            Add Row
          </button>
        </td>
      </tr>
    );
  }
});

export default Radium(AddTableRow);
