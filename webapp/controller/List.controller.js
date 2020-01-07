sap.ui.define(
  ["./BaseController", "br/com/patrimar/quotationmap/model/QuotationMapModel",
    'quotationmap/formatter/formatter'],
  function (BaseController, QuotationMapModel, formatter) {
    "use strict";

    return BaseController.extend(
      "br.com.patrimar.quotationmap.controller.List",
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
          this.prepare(QuotationMapModel.getInstance(oModel));

          // Aguarda o metadata do OData ser carregado
          oModel.metadataLoaded().then(
            function () {
              this.loadQuotationMapList();
            }.bind(this)
          );
        },

        /**
         * Evento acionado ao clicar em um item da lista
         * @param {*} oItem
         */
        onListItemPressed: function (oItem) {
          var sPath = oItem.getSource().getBindingContextPath();
          var key = this.getModel("jModel").getProperty(sPath).SolcotNo;

          // Navega para o detalhe
          this.getRouter().navTo("Detail", {
            key: key
          });
        },

        /**
         * MÉTODOS
         */

        /**
         * Carrega a lista de Mapas de Cotação
         */
        loadQuotationMapList: function () {
          // Recupera o modelo (QuotationMapModel.js) e faz a leitura dos dados no backend
          this.getModelInstance()
            .readList()
            .then(
              function (data) {
                this.getModel("jModel").setProperty(
                  "/QuotationMapSet",
                  data.results
                );
              }.bind(this)
            );
        }
      }
    );
  }
);
