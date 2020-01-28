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
        },

        /**
         * Genérico - Efetua a leitura dos dados no backend de acordo com o sPath
         * @param {*} sPath
         */
        readByPath: function (sPath, propName) {
          return new Promise(
            function (res, rej) {
              var oModel = this.getODataModel();

              oModel.read(sPath, {
                urlParameters: {
                  '$expand': 'ItemCotacao,Plants'
                },
                success: function (data, response) {
                  res(data, response);
                }.bind(this),
                error: function (oError) {
                  rej(oError);
                }.bind(this)
              });
            }.bind(this)
          );
        },
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
