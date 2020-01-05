sap.ui.define(
  ["./BaseController", "br/com/patrimar/quotationmap/model/QuotationMapModel"],
  function(BaseController, QuotationMapModel) {
    "use strict";

    return BaseController.extend(
      "br.com.patrimar.quotationmap.controller.Detail",
      {
        /**
         * Inicialização do controller
         */
        onInit: function() {
          // Recupera o ODataModel principal
          var oModel = this.getOwnerComponent().getModel();

          // Prepara o controller (Model, Routing)
          this.prepare(QuotationMapModel.getInstance(oModel), "Detail");
        }
      }
    );
  }
);
