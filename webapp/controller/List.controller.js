sap.ui.define(
  ["./BaseController", "br/com/patrimar/quotation/model/SolicitacaoCotacaoModel",
    'quotation/formatter/formatter'],
  function (BaseController, SolicitacaoCotacaoModel, formatter) {
    "use strict";

    return BaseController.extend(
      "br.com.patrimar.quotation.controller.List",
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
          this.prepare(SolicitacaoCotacaoModel.getInstance(oModel));

          // Aguarda o metadata do OData ser carregado
          oModel.metadataLoaded().then(
            function () {
              this.loadQuotationRequestList();
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
          // var cotNo = this.getModel("jModel").getProperty(sPath).CotNo;
          var key = `SolcotNo='${solcotNo}'`;

          // Navega para o detalhe
          this.getRouter().navTo("Detail", {
            key: key
          });
        },

        /**
        * Recupera a lista do backend
        */
        readList: function () {
          return this.readByPath("/" + this.ENTITY_SET_NAME, '$expand=SolicitacaoCotacaoItems,Cotacao');
        },

        /**
         * MÉTODOS
         */

        /**
         * Carrega a lista de Criação de Cotação
         */
        loadQuotationRequestList: function () {
          // Recupera o modelo (QuotationModel.js) e faz a leitura dos dados no backend
          this.getModelInstance()
            .readList('$expand=SolicitacaoCotacaoItems,Cotacao')
            .then(
              function (data) {
                this.getModel("jModel").setProperty(
                  "/SolicitacaoCotacaoSet",
                  data.results
                );
              }.bind(this)
            );
        }
      }
    );
  }
);
