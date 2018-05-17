import React, {Component, PropTypes} from 'react';
import {Table, sort} from 'reactabular';
import {tableLayoutStyles, sortableOptions} from "../tables/tableConstants";
import commonMsg from '@cdo/locale';
import wrappedSortable from '../tables/wrapped_sortable';
import orderBy from 'lodash/orderBy';
import { studentData, multipleChoiceData } from './sectionAssessmentsHelpers';
import MultipleChoiceAnswerCell from './MultipleChoiceAnswerCell';
import { row } from 'reactabular-select/dist';

export const COLUMNS = {
  QUESTION: 0,
  STUDENT_ANSWER: 1,
  CORRECT_ANSWER: 2,
};

const studentAnswerDataPropType = PropTypes.shape({
  id:  PropTypes.string,
  name: PropTypes.string,
  studentAnswers: PropTypes.array,
});

const answerDataPropType = PropTypes.shape({
  multipleChoiceOption: PropTypes.string,
  percentAnswered: PropTypes.number,
  isCorrectAnswer: PropTypes.bool,
});

const questionDataPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(answerDataPropType),
  notAnswered: PropTypes.number.isRequired,
});


class StudentAssessmentOverviewTable extends Component {
  static propTypes= {
    questionAnswerData: PropTypes.arrayOf(questionDataPropType),
    studentAnswerData: PropTypes.arrayOf(studentAnswerDataPropType)
  };

  state = {
    [COLUMNS.NAME]: {
      direction: 'desc',
      position: 0
    }
  };

  getSortingColumns = () => {
    return this.state.sortingColumns || {};
  };

  onSort = (selectedColumn) => {
    this.setState({
      sortingColumns: sort.byColumn({
        sortingColumns: this.state.sortingColumns,
        // Custom sortingOrder removes 'no-sort' from the cycle
        sortingOrder: {
          FIRST: 'asc',
          asc: 'desc',
          desc: 'asc'
        },
        selectedColumn
      })
    });
  };

  correctAnswerColumnFormatter = (answers, {rowData, columnIndex, rowIndex, property}) => {
    debugger;
    const cell = rowData.answers;

    let studentQuestion = '';
      cell.forEach ((secItem) => {
        if (secItem.isCorrectAnswer) {
          studentQuestion = secItem.multipleChoiceOption;
        }
      });

    return (
        <MultipleChoiceAnswerCell
          id={rowData.id}
          studentQuestion={studentQuestion}
        />
    );
  };

  getColumns = (sortable) => {
    let dataColumns = [
      {
        property: 'question',
        header: {
          label: commonMsg.question(),
          props: {
            style: {
            ...tableLayoutStyles.headerCell,
          }},
          transforms: [sortable],
        },
        cell: {
          props: {
            style: {
            ...tableLayoutStyles.cell,
          }}
        }
      },
      {
        property: 'percentAnsweredOptionOne',
        header: {
          label: commonMsg.studentAnswer(),
          props: {
            style: {
            ...tableLayoutStyles.headerCell,
            width: 90,
          }},
        },
        cell: {
          props: {
            style: {
            ...tableLayoutStyles.cell,
            width: 90,
          }}
        }
      },
      {
        property: 'correctAnswer',
        header: {
          label: commonMsg.checkCorrectAnswer(),
          props: {
            style: {
            ...tableLayoutStyles.headerCell,
            width: 120,
          }},
        },
        cell: {
          format: this.correctAnswerColumnFormatter,
          props: {
            style: {
            ...tableLayoutStyles.cell,
            width: 120,
          }}
        }
      },
    ];
    return dataColumns;
  };

  render() {
    // Define a sorting transform that can be applied to each column
    const sortable = wrappedSortable(this.getSortingColumns, this.onSort, sortableOptions);
    const columns = this.getColumns(sortable);
    const sortingColumns = this.getSortingColumns();

    const sortedRows = sort.sorter({
      columns,
      sortingColumns,
      sort: orderBy,
    })(this.props.questionAnswerData);

    return (
        <Table.Provider
          columns={columns}
          style={tableLayoutStyles.table}
        >
          <Table.Header />
          <Table.Body rows={sortedRows} rowKey="id" />
        </Table.Provider>
    );
  }
}

export default StudentAssessmentOverviewTable;




