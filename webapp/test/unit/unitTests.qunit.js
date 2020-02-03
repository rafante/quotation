/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
  "use strict";

  sap.ui.require(["br/com/patrimar/quotation/test/unit/AllTests"], function () {
    QUnit.start();
  });
});
