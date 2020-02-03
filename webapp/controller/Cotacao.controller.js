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

                saveQuotation: function () {
                    var cotModel = this.getModel('jModel');
                    this.getModelInstance().save(cotModel.getData());
                },

                selectPayTerms: function () {
                    var paymentTermsDialogModel = new sap.ui.model.json.JSONModel({
                        paymentTermsId: ""
                    });
                    this.getView().setModel(paymentTermsDialogModel, "dlg");
                    var that = this;
                    // var model = new sap.ui.model.odata.ODataModel("/PATRIMAR_S4HANA/sap/opu/odata/sap/ZPORTAL_COTACAO_SRV/FornecedoresSolicitacaoSet/");
                    this.paymentTermsDialog = new sap.m.TableSelectDialog({
                        title: 'Informe o código/nome da condição de pagamento',
                        // model: 'dlg',
                        confirm: function (a, b, c) {
                            var item = a.getParameter('selectedItem');
                            var cell = item.getCells()[0];
                            var cellTitle = item.getCells()[1];
                            var title = cellTitle.getText();
                            var paymentTerms = cell.getText();
                            var model = that.getView().getModel('dlg');
                            model.setData({ 'paymentTermsId': paymentTerms });
                            that.getModel('jModel').setProperty('/PaymTerms', paymentTerms);
                            that.getModel('jModel').setProperty('/PaymTermsDescription', title);
                        },
                        search: function (a) {
                            var query = a.getParameter('value');

                            var itemsBinding = a.getParameter('itemsBinding');
                            var filters = [];
                            var paymentTermsFilter = new sap.ui.model.Filter('PaymentTermsID', sap.ui.model.FilterOperator.Contains, query)
                            var paymentTermsTitleFilter = new sap.ui.model.Filter('Title', sap.ui.model.FilterOperator.Contains, query)
                            //filters.push(new sap.ui.model.Filter('SolcotNo', 'EQ', solCotNo))
                            if (!isNaN(query))
                                filters.push(paymentTermsFilter);
                            if (isNaN(query))
                                filters.push(paymentTermsTitleFilter);
                            itemsBinding.filter(filters)
                        },
                        columns: [
                            new sap.m.Column({
                                header: new sap.m.Label({
                                    text: "Código"
                                })
                            }),
                            new sap.m.Column({
                                header: new sap.m.Label({
                                    text: "Nome"
                                })
                            }),
                        ],
                        items: {
                            path: "/PaymentTermsSet",
                            //                  sorter: {
                            //     path: 'Name',
                            //     descending: false
                            // },
                            // filters: [
                            //     new sap.ui.model.Filter('SolcotNo', 'EQ', solCotNo)
                            // ],
                            template: new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.Text({
                                        text: "{PaymentTermsID}"
                                    }),
                                    new sap.m.Text({
                                        text: "{Title}"
                                    }),
                                ]
                            })
                        }
                    });
                    //to get access to the global model
                    this.getView().addDependent(this.paymentTermsDialog);
                    //}

                    this.paymentTermsDialog.open();
                },

                onSelectPayTerms: function () {
                    this.selectPayTerms();
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
                    this.refreshTotals();
                },

                inputChange: function (evt, property) {
                    var items = this.getModel('quotationItems').getObject('/')
                    var shownItem = this.getModel('quotationItemDetail').getData()[0];
                    var index = items.indexOf(items.find(function (item) { return item.itemDetails.Material == shownItem.Material; }));
                    var newValue = evt.getParameter('newValue');

                    if (evt.getSource() instanceof sap.m.DatePicker) {
                        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
                        newValue = new Date(newValue.replace(pattern, '$3/$2/$1'));
                    } else if (evt.getSource() instanceof sap.m.CheckBox) {
                        newValue = evt.getParameter('selected');
                    }
                    this.getModel('quotationItems').setProperty('/' + index + '/itemDetails/' + property, newValue);
                    shownItem[property] = newValue;
                    this.getModel('quotationItemDetail').setData([shownItem]);
                    this.refreshTotals();
                },

                refreshTotals: function () {
                    var shownItem = this.getModel('quotationItemDetail').getData()[0];
                    var grossPrice = shownItem['GrossPrice'];
                    var discount = shownItem['Discount'];
                    var ipiRate = shownItem['IpiRate'];
                    var freight = shownItem['Freight'];
                    shownItem['priceWithDiscount'] = grossPrice - (grossPrice * discount / 100);
                    shownItem['calculatedIpi'] = (grossPrice * ipiRate / 100);
                    this.getModel('quotationItemDetail').setData([shownItem]);
                },

                createQuotation: function () {
                    var solcotNo = this.getModel('jModel').getData().SolcotNo;
                    var that = this;
                    var supplier = that.getModel('jModel').getData().Supplier;
                    this.getView().getModel('solicitacao').read("/SolicitacaoCotacaoSet('" + solcotNo + "')/Fornecedores", {
                        urlParameters: {
                            "$select": "Fornecedor"
                        },
                        success: function (data) {
                            if (!data || data.results.length == 0 || !data.results.find(function (x) {
                                return parseFloat(x.Fornecedor) ==
                                    parseFloat(supplier)
                            }))
                                sap.m.MessageBox.warning("Fornecedor " + supplier + " não foi selecionado para esta solicitação.");
                            else {
                                // Preenche os dados para o POST
                                var payload = {
                                    SolcotNo: solcotNo,
                                    Supplier: supplier
                                };

                                // Recupera o caminho do binding context e o model
                                var oModel = that.getView().getModel();
                                var sPath = `/SolicitacaoCotacaoSet(SolcotNo='${solcotNo}')/Cotacao`

                                // Executa o POST
                                oModel.create(sPath, payload, {
                                    refreshAfterChange: true,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    },
                                    success: function (e) {
                                        sap.m.MessageBox.success("Cotação " + e.CotNo + " criada com sucesso!");
                                    },
                                    error: function (e) {
                                        sap.m.MessageBox.error(JSON.parse(e.responseText).error.message.value);
                                    }
                                });
                            }
                        },
                        error: function (error) {
                            sap.m.MessageBox.error("Falha ao tentar validar o Fornecedor.");
                        }
                    });
                }
            }
        );
    }
);
