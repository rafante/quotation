sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "br/com/patrimar/quotation/model/models"
  ],
  function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("br.com.patrimar.quotation.Component", {
      metadata: {
        manifest: "json",
        config: {
          fullWidth: true
        }
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        this.getRouter().initialize();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // var that = this;
        // // Prepara o model com os dados do usuário
        // var userAttributes = new sap.ui.model.json.JSONModel();
        // userAttributes.attachRequestCompleted(function (data) {
        //   that.setModel(userAttributes, "userAttributes");
        // });
        // userAttributes.loadData("/services/userapi/attributes");


        // var currentUser = new sap.ui.model.json.JSONModel();
        // currentUser.attachRequestCompleted(function (data) {
        //   that.setModel(currentUser, "currentUser");
        // });
        // currentUser.loadData("/services/userapi/currentUser");
      }
    });
  }
);
