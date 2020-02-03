sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/library"
  ],
  function (Controller, UIComponent, History, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend(
      "br.com.patrimar.quotation.controller.BaseController",
      {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
          return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
          return this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
        },

        /**
         * Getter for the message bundle.
         * @public
         * @returns the message (i18n)
         */
        getBundleMessage: function (name, args) {
          var oBundle = this.getResourceBundle();
          var message = "";
          if (args) {
            message = oBundle.getText(name, args[0]);
          } else {
            message = oBundle.getText(name);
          }
          return message;
        },

        loadInitialData: function () {
          this.linkLoadingFragment();
          this._dialogLoading.open();
        },

        linkLoadingFragment: function () {
          // initialize loading dialog
          if (!this._dialogLoading) {
            this._dialogLoading = sap.ui.xmlfragment(
              "br.com.patrimar.quotation.fragment.DialogLoading",
              this
            );
            this.getView().addDependent(this._dialogLoading);
          }
        },

        // generic error dialog
        showGenericDataErrorDialog: function () {
          var message = this.getBundleMessage("DataLoadingError");
          MessageBox.error(message);
        },

        prepare: function (modelInstance, route, modelName = "jModel") {
          // Seta o atributo modelInstance (que contém um modelo da pasta 'model')
          if (modelInstance) this.modelInstance = modelInstance;

          // Seta o JSONModel
          if (modelName) this.setModel(new JSONModel(), modelName);

          // Prepara o roteamento
          if (route) this.prepareRouting(route);
        },

        prepareRouting: function (route, callback = this._onObjectMatched) {
          // initialize routing
          this.getRouter()
            .getRoute(route)
            .attachPatternMatched(callback, this);
        },

        getModelInstance: function () {
          return this.modelInstance;
        },

        onNavBack: function () {
          var oHistory, sPreviousHash;

          oHistory = History.getInstance();
          sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            this.getRouter().navTo("App", {}, true /*no history*/);
          }
        },

        /**
         * Evento acionado após a navegação, logo após a rota ser preparada
         * @param {*} oEvent
         */
        _onObjectMatched: function (oEvent) {
          var key = oEvent.getParameter("arguments").key;

          this.getModelInstance()
            .readByKey(key)
            .then(
              function (data) {
                this.getModel("jModel").setData(data);
                this.afterObjectMatched(oEvent);
              }.bind(this)
            );
        },

        /**
         * Evento disparado ao carregar os dados no model após o match do routing
         * @param {*} oEvent 
         */
        afterObjectMatched: function (oEvent) {

        }
      }
    );
  }
);
