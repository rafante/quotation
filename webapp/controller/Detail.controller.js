sap.ui.define(
  ["./BaseController", "br/com/patrimar/criacotacao/model/SolicitacaoCotacaoModel", 'sap/ui/model/json/JSONModel',
    'criacotacao/formatter/formatter', 'sap/ui/model/Filter'],
  function (BaseController, SolicitacaoCotacaoModel, JSONModel, formatter, Filter) {
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
          this.prepare(SolicitacaoCotacaoModel.getInstance(oModel), "Detail");
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

        showQuotation: function (oItem) {
          var sPath = oItem.getSource().getBindingContextPath();
          var solcotNo = this.getModel("jModel").getProperty(sPath).SolcotNo;
          var cotNo = this.getModel("jModel").getProperty(sPath).CotNo;
          var key = `SolcotNo='${solcotNo}',CotNo='${cotNo}'`;

          // Navega para o detalhe
          this.getRouter().navTo("Cotacao", {
            key: key
          });
        },

        onCreateQuotation: function (e) {
          var solcotNo = this.getModel("jModel").getProperty('/SolcotNo');
          this.selectSupplier(solcotNo);
        },

        selectSupplier: function (solCotNo) {
          var supplierDialogModel = new sap.ui.model.json.JSONModel({
            supplier: ""
          });
          this.getView().setModel(supplierDialogModel, "dlg");
          var that = this;
          // var model = new sap.ui.model.odata.ODataModel("/PATRIMAR_S4HANA/sap/opu/odata/sap/ZPORTAL_COTACAO_SRV/FornecedoresSolicitacaoSet/");
          this.supplierDialog = new sap.m.TableSelectDialog({
            title: 'Informe o código/nome do fornecedor do SAP',
            // model: 'dlg',
            confirm: function (a, b, c) {
              var item = a.getParameter('selectedItem');
              var cell = item.getCells()[0];
              var supplierInputValue = cell.getText();
              var model = that.getView().getModel('dlg');
              model.setData({ 'supplier': supplierInputValue });
              that.createQuotation(supplierInputValue, solCotNo);
            },
            search: function (a) {
              var query = a.getParameter('value');

              var itemsBinding = a.getParameter('itemsBinding');
              var filters = [];
              var supplierFilter = new sap.ui.model.Filter('Fornecedor', sap.ui.model.FilterOperator.Contains, query)
              var supplierNameFilter = new sap.ui.model.Filter('Name', sap.ui.model.FilterOperator.Contains, query)
              //filters.push(new sap.ui.model.Filter('SolcotNo', 'EQ', solCotNo))
              if (!isNaN(query))
                filters.push(supplierFilter);
              if (isNaN(query))
                filters.push(supplierNameFilter);
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
              path: "/FornecedoresSolicitacaoSet",
              //                  sorter: {
              //     path: 'Name',
              //     descending: false
              // },
              filters: [
                new sap.ui.model.Filter('SolcotNo', 'EQ', solCotNo)
              ],
              template: new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({
                    text: "{Fornecedor}"
                  }),
                  new sap.m.Text({
                    text: "{Name}"
                  }),
                ]
              })
            }
          });
          //to get access to the global model
          this.getView().addDependent(this.supplierDialog);
          //}

          this.supplierDialog.open();
        },

        createQuotation: function (supplier, solcotNo) {
          var that = this;
          var oModel = this.getView().getModel();

          // Verificamos se o fornecedor está habilitado para fazer cotações a esta solicitação
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
                // Recupera o caminho do binding context e o model
                var sPath = `/SolicitacaoCotacaoSet(SolcotNo='${solcotNo}')/Cotacao`;

                // Preenche os dados para o POST
                var payload = {
                  SolcotNo: solcotNo,
                  Supplier: supplier
                };

                // Executa o POST
                oModel.create(sPath, payload, {
                  refreshAfterChange: true,
                  // urlParameters: 'sap-client=300',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  },
                  success: function (e, c, d) {
                    sap.m.MessageBox.success("Cotação " + e.CotNo + " criada com sucesso!", {
                      onClose: function () {
                        var m = that.getModel('jModel');
                        var items = m.getData().Cotacao;
                        items.results.push(e);
                        m.setProperty('/Cotacao/results', items.results);
                      }
                    });
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
        },
      }
    );
  }
);
