var testUtils = require('../../util/testUtils');
var TestResults = require('@cdo/apps/constants.js').TestResults;

// f(x) = x + 1
// compute: f(15)
var solutionBlocks = '' +
  '<block type="functional_compute" inline="false" deletable="false" movable="false">' +
  '  <functional_input name="ARG1">' +
  '    <block type="functional_call" inline="false">' +
  '      <mutation name="f">' +
  '        <arg name="x" type="Number"></arg>' +
  '      </mutation>' +
  '      <functional_input name="ARG0">' +
  '        <block type="functional_math_number">' +
  '          <title name="NUM">15</title>' +
  '        </block>' +
  '      </functional_input>' +
  '    </block>' +
  '  </functional_input>' +
  '</block>' +
  '<block type="functional_definition" inline="false" deletable="false" movable="false" editable="false">' +
  '  <mutation>' +
  '    <arg name="x" type="Number"></arg>' +
  '    <outputtype>Number</outputtype>' +
  '  </mutation>' +
  '  <title name="NAME">f</title>' +
  '  <functional_input name="STACK">' +
  '    <block type="functional_plus" inline="false">' +
  '      <functional_input name="ARG1">' +
  '        <block type="functional_parameters_get">' +
  '          <mutation>' +
  '            <outputtype>Number</outputtype>' +
  '          </mutation>' +
  '          <title name="VAR">x</title>' +
  '        </block>' +
  '      </functional_input>' +
  '      <functional_input name="ARG2">' +
  '        <block type="functional_math_number">' +
  '          <title name="NUM">1</title>' +
  '        </block>' +
  '      </functional_input>' +
  '    </block>' +
  '  </functional_input>' +
  '</block>';

module.exports = {
  app: 'calc',
  skinId: 'calc',
  levelDefinition: {
    solutionBlocks: solutionBlocks,
    useContractEditor: true,
    examplesRequired: true,
    requiredBlocks: '',
    freePlay: false
  },
  tests: [
    {
      description: "example is missing result block",
      expected: {
        result: false,
        testResult: TestResults.EXAMPLE_FAILED
      },
      customValidator: function (assert) {
        assert.equal(Calc.__testonly__.appState.message, 'You need at least one ' +
          'example in function f. Make sure each example has a call and a result.');
        return true;
      },
      xml: '<xml>' +
        solutionBlocks +
        '<block type="functional_example" inline="false">' +
        '  <functional_input name="ACTUAL">' +
        '    <block type="functional_call" inline="false">' +
        '      <mutation name="f">' +
        '        <arg name="x" type="Number"></arg>' +
        '      </mutation>' +
        '      <functional_input name="ARG0">' +
        '        <block type="functional_math_number">' +
        '          <title name="NUM">1</title>' +
        '        </block>' +
        '      </functional_input>' +
        '    </block>' +
        '  </functional_input>' +
        '</block>' +
        '</xml>'
    },
    {
      description: "example result doesnt match definition",
      expected: {
        result: false,
        testResult: TestResults.EXAMPLE_FAILED
      },
      customValidator: function (assert) {
        assert.equal(Calc.__testonly__.appState.message, 'The function f has' +
          ' one or more examples that need adjusting. Make sure they match your' +
          ' definition and answer the question.');
        return true;
      },
      xml: '<xml>' +
        solutionBlocks +
        '<block type="functional_example" inline="false">' +
        '  <functional_input name="ACTUAL">' +
        '    <block type="functional_call" inline="false">' +
        '      <mutation name="f">' +
        '        <arg name="x" type="Number"></arg>' +
        '      </mutation>' +
        '      <functional_input name="ARG0">' +
        '        <block type="functional_math_number">' +
        '          <title name="NUM">1</title>' +
        '        </block>' +
        '      </functional_input>' +
        '    </block>' +
        '  </functional_input>' +
        '  <functional_input name="EXPECTED">' +
        '    <block type="functional_plus" inline="false">' +
        '      <functional_input name="ARG1">' +
        '        <block type="functional_math_number">' +
        '          <title name="NUM">1</title>' +
        '        </block>' +
        '      </functional_input>' +
        '      <functional_input name="ARG2">' +
        '        <block type="functional_math_number">' +
        '          <title name="NUM">20</title>' +
        '        </block>' +
        '      </functional_input>' +
        '    </block>' +
        '  </functional_input>' +
        '</block>' +
        '</xml>'
    },
    {
      description: "example result does match definition",
      expected: {
        result: true,
        testResult: TestResults.ALL_PASS
      },
      customValidator: function (assert) {
        assert.equal(Calc.__testonly__.appState.message, null);
        return true;
      },
      xml: '<xml>' +
        solutionBlocks +
        '<block type="functional_example" inline="false">' +
        '  <functional_input name="ACTUAL">' +
        '    <block type="functional_call" inline="false">' +
        '      <mutation name="f">' +
        '        <arg name="x" type="Number"></arg>' +
        '      </mutation>' +
        '      <functional_input name="ARG0">' +
        '        <block type="functional_math_number">' +
        '          <title name="NUM">1</title>' +
        '        </block>' +
        '      </functional_input>' +
        '    </block>' +
        '  </functional_input>' +
        '  <functional_input name="EXPECTED">' +
        '    <block type="functional_plus" inline="false">' +
        '      <functional_input name="ARG1">' +
        '        <block type="functional_math_number">' +
        '          <title name="NUM">1</title>' +
        '        </block>' +
        '      </functional_input>' +
        '      <functional_input name="ARG2">' +
        '        <block type="functional_math_number">' +
        '          <title name="NUM">1</title>' +
        '        </block>' +
        '      </functional_input>' +
        '    </block>' +
        '  </functional_input>' +
        '</block>' +
        '</xml>'
    },

    {
      description: "no examples when examples required",
      expected: {
        result: false,
        testResult: TestResults.EXAMPLE_FAILED
      },
      customValidator: function (assert) {
        assert.equal(Calc.__testonly__.appState.message, 'You need at least one' +
        ' example in function f. Make sure each example has a call and a result.');
        return true;
      },
      xml: '<xml>' +
        solutionBlocks +
        '</xml>'
    }
  ]
};
