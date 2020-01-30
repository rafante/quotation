sap.ui.define(["sap/ui/base/Object"], function (Object) {
  "use strict";

  return Object.extend("br.com.patrimar.criacotacao.model.BaseModel", {
    /**
     * Construtor
     */
    constructor: function () { },

    /**
     * Genérico - Efetua a leitura dos dados no backend de acordo com o sPath
     * @param {*} sPath
     */
    readByPath: function (sPath, urlParameters) {
      return new Promise(
        function (res, rej) {
          var oModel = this.getODataModel();

          oModel.read(sPath, {
            urlParameters: urlParameters,
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

    /**
     * Recupera a lista do backend
     */
    readList: function (urlParameters) {
      return this.readByPath("/" + this.ENTITY_SET_NAME, urlParameters);
    },

    /**
     * Recupera a lista do backend
     */
    readByKey: function (key, urlParameters = null) {
      // Ex.: /CriaCotacaoSet('0000000001')
      var sPath = this.getPathFromKey(this.ENTITY_SET_NAME, key);
      return this.readByPath(sPath, urlParameters);
    },

    /**
     * Recupera o caminho com base no entity set e na chave
     * Ex.: /CriaCotacaoSet('0000000001')
     * @param {*} entitySetName
     * @param {*} key
     */
    getPathFromKey: function (entitySetName, key) {
      // TODO: Escrever testes unitários
      return `/${entitySetName}(${key})`;
    },

    /**
     * Define o ODataModel/JSONModel para a instância
     * @param {*} oModel
     */
    setODataModel: function (oModel) {
      this.oModel = oModel;
    },

    /**
     * Retorna o ODataModel/JSONModel da instância
     */
    getODataModel: function () {
      return this.oModel;
    }
  });
});
