/*global QUnit*/

sap.ui.define(
  ["br/com/patrimar/quotationmap/formatter/formatter",
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
  }
);
