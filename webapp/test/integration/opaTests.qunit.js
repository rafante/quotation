/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
  "use strict";

  sap.ui.require(["br/com/patrimar/quotationmap/test/integration/AllJourneys"], function() {
    QUnit.start();
  });
});
