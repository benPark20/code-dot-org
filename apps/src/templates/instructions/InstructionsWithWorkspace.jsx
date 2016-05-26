var React = require('react');
var connect = require('react-redux').connect;
var styleConstants = require('../../styleConstants');
var CodeWorkspaceContainer = require('../CodeWorkspaceContainer');
var TopInstructions = require('./TopInstructions');
var instructions = require('../../redux/instructions');

var HEADER_HEIGHT = styleConstants['workspace-headers-height'];
var RESIZER_HEIGHT = styleConstants['resize-bar-width'];

/**
 * A component representing the right side of the screen in our app. In particular
 * it has instructions in the top pane (unless disabled), a resizer, and then
 * our code workspace component
 */
var InstructionsWithWorkspace = React.createClass({
  propTypes: {
    // props provided via connect
    showInstructions: React.PropTypes.bool.isRequired,
    // instructionsCollapsed: React.PropTypes.bool.isRequired,
    instructionsHeight: React.PropTypes.number.isRequired,
    // instructionsMaxHeight: React.PropTypes.number.isRequired,
    // setInstructionsHeight: React.PropTypes.func.isRequired,
    // setInstructionsMaxHeight: React.PropTypes.func.isRequired,

    // shortInstructionsWhenCollapsed: React.PropTypes.bool,
    // TODO - properly pass these to top instructions
    // isRtl: React.PropTypes.bool.isRequired,
    // noVisualization: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    // only used so that we can rerender when resized
    return {
      windowWidth: undefined,
      windowHeight: undefined
    };
  },

  /**
   * Called when the window resizes. Look to see if width/height changed, then
   * call adjustTopPaneHeight as our maxHeight may need adjusting.
   */
  onResize() {
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();

    // We fire window resize events when the grippy is dragged so that non-React
    // controlled components are able to rerender the editor. If width/height
    // didn't change, we don't need to do anything else here
    if (windowWidth === this.state.windowWidth &&
        windowHeight === this.state.windowHeight) {
      return;
    }

    this.setState({
      windowWidth: $(window).width(),
      windowHeight: $(window).height()
    });

    // Determine what the maximum size of our instructions is based off of the
    // size of the code workspace.

    // Have a preference for showing at least 150px of editor and 120px of
    // debugger. Shrink instructions to make room. If that doesn't provide
    // enough space, start also shrinking workspace
    // TODO - no debugger in CSF
    const EDITOR_RESERVE = 150;
    const DEBUGGER_RESERVE = 120;
    const INSTRUCTIONS_RESERVE = 150;

    const instructionsHeight = this.props.instructionsHeight;
    const codeWorkspaceHeight = this.refs.codeWorkspaceContainer
      .getWrappedInstance().getRenderedHeight();
    if (codeWorkspaceHeight === 0) {
      // We haven't initialized the codeWorkspace yet. No need to change the
      // max height of instructions
      return;
    }

    const totalHeight = instructionsHeight + codeWorkspaceHeight;
    let maxInstructionsHeight = totalHeight - DEBUGGER_RESERVE - EDITOR_RESERVE;

    if (maxInstructionsHeight < INSTRUCTIONS_RESERVE) {
      // We couldn't meet all of our reserves. Just give 1/3 of whatever space
      // we have to instructions, and the other 2/3 to the workspace
      maxInstructionsHeight = Math.round(totalHeight / 3);
    }
    this.props.setInstructionsMaxHeightAvailable(maxInstructionsHeight);
  },

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  },

  render() {
    // TODO - might be able to get rid of refs
    return (
      <span>
        {this.props.showInstructions &&
          <TopInstructions
              ref="topInstructions"
          />
        }
        <CodeWorkspaceContainer
            ref="codeWorkspaceContainer"
            topMargin={this.props.instructionsHeight}
        />
      </span>
    );
  }
});

module.exports = connect(function propsFromStore(state) {
  return {
    showInstructions: state.pageConstants.instructionsInTopPane,
    instructionsHeight: state.instructions.renderedHeight
  };
}, function propsFromDispatch(dispatch) {
  return {
    setInstructionsHeight: function (height) {
      dispatch(instructions.setInstructionsHeight(height));
    },
    setInstructionsMaxHeightAvailable: function (maxHeight) {
      dispatch(instructions.setInstructionsMaxHeightAvailable(maxHeight));
    }
  };
})(InstructionsWithWorkspace);
