sap.ui.define(
  ["./BaseController", "br/com/patrimar/criacotacao/model/CotacaoModel",
    'criacotacao/formatter/formatter'],
  function (BaseController, CotacaoModel, formatter) {
    "use strict";

    return BaseController.extend(
      "br.com.patrimar.criacotacao.controller.Detail",
      {
        formatter: formatter,

        /**
         * Inicialização do controller
         */
        onInit: function () {
          // Recupera o ODataModel principal
          var oModel = this.getOwnerComponent().getModel();

          // Prepara o controller (Model, Routing)
          this.prepare(CotacaoModel.getInstance(oModel), "Detail");
        }
      }
    );
  }
);
