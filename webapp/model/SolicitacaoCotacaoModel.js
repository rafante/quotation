sap.ui.define(
    [
        "sap/ui/base/Object",
        "sap/ui/model/json/JSONModel",
        "br/com/patrimar/criacotacao/model/BaseModel"
    ],
    function (Object, JSONModel, BaseModel) {
        "use strict";
        var instance;

        var SolicitacaoCotacaoModel = BaseModel.extend(
            "br.com.patrimar.criacotacao.model.SolicitacaoCotacaoModel",
            {
                /**
                 * Construtor (Definindo um ODataModel)
                 * @param {*} oModel
                 */
                constructor: function (oModel) {
                    this.ENTITY_SET_NAME = "SolicitacaoCotacaoSet";
                    this.setODataModel(oModel);
                },

                /**
                 * Recupera a lista do backend
                 */
                readByKey: function (key, urlParameters = null) {
                    // Ex.: /CriaCotacaoSet('0000000001')
                    var sPath = this.getPathFromKey(this.ENTITY_SET_NAME, key);
                    return this.readByPath(sPath, '$expand=SolicitacaoCotacaoItems,Cotacao,Cotacao/ItemCotacao');
                },
            });
        return {
            getInstance: function (oModel) {
                if (!instance) {
                    instance = new SolicitacaoCotacaoModel(oModel);
                }
                return instance;
            }
        };
    });
