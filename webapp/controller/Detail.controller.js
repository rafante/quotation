sap.ui.define(
  ["./BaseController", "br/com/patrimar/criacotacao/model/CotacaoModel", 'sap/ui/model/json/JSONModel',
    'criacotacao/formatter/formatter'],
  function (BaseController, CotacaoModel, JSONModel, formatter) {
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
        },

        /**
         * 
         * @param {*} e 
         */
        onDetailPress: function (e) {
          var oSource = e.getSource();
          var sPath = oSource.getBindingContextPath();
          var itemsModel = oSource.getModel('quotationItems');
          var itemData = itemsModel.getProperty(sPath);
          var index = parseInt(sPath.replace(/\D/g, ''));
          this.toggleSelected(false, index);
          itemData.selected = true;
          itemsModel.setProperty(sPath, itemData);
          this.showItemDetails(itemData);
        },

        showItemDetails: function (item) {
          var detailsModel = this.getModel('quotationItemDetail');
          var content = detailsModel.getData()[0];
          Object.keys(item.itemDetails).forEach(function (key) {
            content[key] = item.itemDetails[key];
          });
          detailsModel.setData([content]);
        },

        toggleSelected: function (isSelected, excludeIndex = null) {
          var items = this.getModel('quotationItems').getObject('/');
          items = items.map((item, i) => excludeIndex != null && i == excludeIndex ? item : { ...item, selected: isSelected });
          this.getModel('quotationItems').setData(items);
        },

        materialDetailDescription: function (quantity, unit) {
          return 'Quantidade solicitada: ' + quantity + ' ' + unit;
        },

        likePrice: function (priceValue) {
          var formattedPrice = '0.00'
          if (priceValue && !isNaN(priceValue.replace(/\D/g, ''))) formattedPrice = priceValue.replace(/\D/g, '');
          if (formattedPrice.length < 3)
            formattedPrice = '0.' + formattedPrice.padStart(2, '0');
          else
            formattedPrice = (Number(formattedPrice).toFixed(2) / 100).toFixed(2).toString();

          return formattedPrice.replace('.', ',');
        },

        /**
         * 
         * @param {*} oEvent 
         */
        afterObjectMatched(oEvent) {
          this.setModel(new JSONModel(), 'quotationItemDetail');
          this.setModel(new JSONModel(), 'quotationItems');
          this.getModel('quotationItemDetail').setData([
            {
              "title": "Item 1",
              "subtitle": "Detalhes do Item 1",
              "counter": 1,
              // "highlight": "Error",
              "unread": true,
              // "type": "None",
              'nome': 'teste'
            }
          ]);
          var items = this.getModel('jModel').getData().ItemCotacao.results;
          var blockItems = [];
          blockItems = items.map((item) => {
            return {
              "title": item.MaterialDescription,
              // "subtitle": "Detalhes do item 1",
              "counter": parseInt(item.Material),
              "highlight": "Error",
              "type": "Active",
              "itemDetails": item
            };
          });

          if (blockItems.length > 0) {
            blockItems[0].selected = true;
            this.getModel('quotationItems').setData(blockItems);
            this.showItemDetails(blockItems[0]);
          } else
            this.getModel('quotationItems').setData([]);

        }
      }
    );
  }
);
