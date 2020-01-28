sap.ui.define(
  ["./BaseController", "br/com/patrimar/criacotacao/model/CotacaoModel",
    'criacotacao/formatter/formatter'],
  function (BaseController, CriaCotacaoModel, formatter) {
    "use strict";

    return BaseController.extend(
      "br.com.patrimar.criacotacao.controller.List",
      {
        formatter: formatter,

        /**
         * EVENTOS
         */

        /**
         * Inicialização do controller
         */
        onInit: function () {
          // Recupera o ODataModel principal
          var oModel = this.getOwnerComponent().getModel();

          // Prepara o controller (Routing e Model)
          this.prepare(CriaCotacaoModel.getInstance(oModel));

          // Aguarda o metadata do OData ser carregado
          oModel.metadataLoaded().then(
            function () {
              this.loadCriaCotacaoList();
            }.bind(this)
          );
        },

        /**
         * Evento acionado ao clicar em um item da lista
         * @param {*} oItem
         */
        onListItemPressed: function (oItem) {
          var sPath = oItem.getSource().getBindingContextPath();
          var solcotNo = this.getModel("jModel").getProperty(sPath).SolcotNo;
          var cotNo = this.getModel("jModel").getProperty(sPath).CotNo;
          var key = `SolcotNo='${solcotNo}',CotNo='${cotNo}'`;

          // Navega para o detalhe
          this.getRouter().navTo("Detail", {
            key: key
          });
        },

        /**
        * Recupera a lista do backend
        */
        readList: function () {
          return this.readByPath("/" + this.ENTITY_SET_NAME + '?$expand=ItemCotacao');
        },

        /**
         * MÉTODOS
         */

        /**
         * Carrega a lista de Criação de Cotação
         */
        loadCriaCotacaoList: function () {
          // Recupera o modelo (CriaCotacaoModel.js) e faz a leitura dos dados no backend
          this.getModelInstance()
            .readList()
            .then(
              function (data) {
                this.getModel("jModel").setProperty(
                  "/CotacaoSet",
                  data.results
                );
              }.bind(this)
            );
        }
      }
    );
  }
);
