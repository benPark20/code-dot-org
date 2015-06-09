'use strict';
/* global describe */
/* global beforeEach */
/* global it */

var testUtils = require('../util/testUtils');
testUtils.setupLocale('netsim');
var assert = testUtils.assert;
var assertEqual = testUtils.assertEqual;
var netsimTestUtils = require('../util/netsimTestUtils');
var fakeShard = netsimTestUtils.fakeShard;
var assertTableSize = netsimTestUtils.assertTableSize;

var NetSimVizNode = require('@cdo/apps/netsim/NetSimVizNode');

describe("NetSimVizNode", function () {

  describe("defaults", function () {
    var vizNode;

    beforeEach(function () {
      vizNode = new NetSimVizNode();
    });

    it ("has default properties", function () {
      assertEqual(undefined, vizNode.address_);
      assertEqual(undefined, vizNode.dnsMode_);
      assertEqual(false, vizNode.isRouter);
      assertEqual(false, vizNode.isLocalNode);
      assertEqual(false, vizNode.isDnsNode);
    });

    it ("immediately creates SVG elements", function () {
      var root = vizNode.getRoot();
      assertEqual('[object SVGGElement]', root[0].toString());

      var rootChildren = root.children();
      assertEqual(3, rootChildren.length);

      var circle = rootChildren[0];
      assertEqual('[object SVGCircleElement]', circle.toString());

      var nameGroup = rootChildren[1];
      assertEqual('[object SVGGElement]', nameGroup.toString());
      var nameChildren = $(nameGroup).children();
      assertEqual(2, nameChildren.length);

      var addressGroup = rootChildren[2];
      assertEqual('[object SVGGElement]', addressGroup.toString());
      var addressChildren = $(addressGroup).children();
      assertEqual(2, addressChildren.length);
    });
  });

});
