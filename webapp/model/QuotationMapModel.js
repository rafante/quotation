sap.ui.define(
  [
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
    "br/com/patrimar/quotationmap/model/BaseModel"
  ],
  function(Object, JSONModel, BaseModel) {
    "use strict";
    var instance;

    var QuotationMapModel = BaseModel.extend(
      "br.com.patrimar.quotationmap.model.QuotationMapModel",
      {
        /**
         * Construtor (Definindo um ODataModel)
         * @param {*} oModel
         */
        constructor: function(oModel) {
          this.ENTITY_SET_NAME = "QuotationMapSet";
          this.setODataModel(oModel);
        }
      }
    );

    return {
      getInstance: function(oModel) {
        if (!instance) {
          instance = new QuotationMapModel(oModel);
        }
        return instance;
      }
    };
  }
);
