module.exports = React.createClass({
  propTypes: {
    elements: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getInitialState: function() {
    return {};
  },

  render: function() {

    return (
      <div style={{float: 'right', marginRight: '-10px'}}>
        <select style={{width: '150px'}}>
          {this.props.elements.map(function (element) {
            return <option>{element.display}</option>;
          })}
        </select>
      </div>
    );
  }
});
