/*global QUnit*/

sap.ui.define(
  ["br/com/patrimar/criacotacao/formatter/formatter",
    'sap/ui/core/ValueState'],
  function (formatter, ValueState) {
    "use strict";

    QUnit.module("Formatter");

    QUnit.test("I should test the Status Icon Formatter", function (assert) {
      assert.equal(formatter.getStatusIcon("A"), "sap-icon://message-success");
      assert.equal(formatter.getStatusIcon("E"), "sap-icon://message-warning");
      assert.equal(formatter.getStatusIcon("L"), "sap-icon://message-information");
      assert.equal(formatter.getStatusIcon("C"), "sap-icon://status-inactive");
      assert.equal(formatter.getStatusIcon(), "sap-icon://status-inactive");
    });


    QUnit.test("I should test the Status Icon State", function (assert) {
      assert.equal(formatter.getStatusState("A"), ValueState.Success);
      assert.equal(formatter.getStatusState("E"), ValueState.Warning);
      assert.equal(formatter.getStatusState("L"), ValueState.Information);
      assert.equal(formatter.getStatusState("C"), ValueState.Information);
      assert.equal(formatter.getStatusState(), ValueState.Error);
    });

    QUnit.test("I should return a value formatted like money", function (assert) {
      assert.equal(formatter.likePrice("000"), "0,00");
      assert.equal(formatter.likePrice("1"), "0,01");
      assert.equal(formatter.likePrice("10"), "0,10");
      assert.equal(formatter.likePrice("200"), "2,00");
      assert.equal(formatter.likePrice("2,33"), "2,33");
      assert.equal(formatter.likePrice("233"), "2,33");
      assert.equal(formatter.likePrice("13425.9222255"), "1342592222,55");
      assert.equal(formatter.likePrice("20000"), "200,00");
      assert.equal(formatter.likePrice("00200"), "2,00");
      assert.equal(formatter.likePrice(null), "0,00");
      assert.equal(formatter.likePrice(undefined), "0,00");
      assert.equal(formatter.likePrice(0), "0,00");
    });
  }
);
