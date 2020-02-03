/*global QUnit*/

sap.ui.define(
  ["br/com/patrimar/quotation/controller/App.controller"],
  function (Controller) {
    "use strict";

    QUnit.module("Model Controller");

    QUnit.test("I should test the App controller", function (assert) {
      var oAppController = new Controller();
      oAppController.onInit();
      assert.ok(oAppController);
    });
  }
);
