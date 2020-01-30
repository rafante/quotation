sap.ui.define(
    ["./BaseController", "br/com/patrimar/criacotacao/model/CotacaoModel", 'sap/ui/model/json/JSONModel',
        'criacotacao/formatter/formatter', 'sap/ui/model/Filter'],
    function (BaseController, CotacaoModel, JSONModel, formatter, Filter) {
        "use strict";

        return BaseController.extend(
            "br.com.patrimar.criacotacao.controller.Cotacao",
            {
                formatter: formatter,

                /**
                 * Inicialização do controller
                 */
                onInit: function () {
                    // Recupera o ODataModel principal
                    var oModel = this.getOwnerComponent().getModel();

                    // Prepara o controller (Model, Routing)
                    this.prepare(CotacaoModel.getInstance(oModel), "Cotacao");
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

                onSelectPayTerms: function () {
                    alert('Funcionou');
                },

                handleValueHelp: function (oEvent) {
                    var sInputValue = oEvent.getSource().getValue();

                    this.inputId = oEvent.getSource().getId();
                    // create value help dialog
                    if (!this._valueHelpDialog) {
                        this._valueHelpDialog = sap.ui.xmlfragment(
                            "br.com.patrimar.criacotacao.fragment.SelectPayTerms",
                            this
                        );
                        this.getView().addDependent(this._valueHelpDialog);
                    }

                    // create a filter for the binding
                    this._valueHelpDialog.getBinding("items").filter([new Filter(
                        "Title",
                        sap.ui.model.FilterOperator.Contains, sInputValue
                    )]);

                    // open value help dialog filtered by the input value
                    this._valueHelpDialog.open(sInputValue);
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
