sap.ui.define(
  [
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
    "br/com/patrimar/criacotacao/model/BaseModel"
  ],
  function (Object, JSONModel, BaseModel) {
    "use strict";
    var instance;

    var CotacaoModel = BaseModel.extend(
      "br.com.patrimar.criacotacao.model.CotacaoModel",
      {
        /**
         * Construtor (Definindo um ODataModel)
         * @param {*} oModel
         */
        constructor: function (oModel) {
          this.ENTITY_SET_NAME = "CotacaoSet";
          this.setODataModel(oModel);
        }
      }
    );

    return {
      getInstance: function (oModel) {
        if (!instance) {
          instance = new CotacaoModel(oModel);
        }
        return instance;
      }
    };
  }
);
