sap.ui.define(
  [
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
    "br/com/patrimar/quotation/model/BaseModel"
  ],
  function (Object, JSONModel, BaseModel) {
    "use strict";
    var instance;

    var CotacaoModel = BaseModel.extend(
      "br.com.patrimar.quotation.model.CotacaoModel",
      {
        currentPath: '',
        /**
         * Construtor (Definindo um ODataModel)
         * @param {*} oModel
         */
        constructor: function (oModel) {
          this.ENTITY_SET_NAME = "CotacaoSet";
          this.setODataModel(oModel);
        },

        /**
         * Genérico - Efetua a leitura dos dados no backend de acordo com o sPath
         * @param {*} sPath
         */
        readByPath: function (sPath, propName) {
          var that = this;
          return new Promise(
            function (res, rej) {
              var oModel = this.getODataModel();
              that.currentPath = sPath;
              oModel.read(sPath, {
                urlParameters: {
                  '$expand': 'ItemCotacao,Plants'
                },
                success: function (data, response) {
                  res(data, response);
                }.bind(this),
                error: function (oError) {
                  rej(oError);
                }.bind(this)
              });
            }.bind(this)
          );
        },

        prepareData(data) {
          var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-ddTKK:mm:ss" });
          var object = {};
          object.CreatedAt = dateFormat.format(data.CreatedAt);
          object.SolcotNo = data.SolcotNo;
          object.CotNo = data.CotNo;
          object.ValidTo = dateFormat.format(data.ValidTo);
          object.PaymTerms = data.PaymTerms;
          object.Supplier = data.Supplier;
          object.Status = data.Status;
          object.StatusDescription = data.StatusDescription;
          object.ItemCotacao = [];
          data.ItemCotacao.results.forEach(function (item) {
            object.ItemCotacao.push({
              chave: `ItemCotacaoSet(SolcotNo='${item.SolcotNo}',CotNo='${item.CotNo}',Plant='${item.Plant}',Material='${item.Material}')`,
              info: {
                SolcotNo: item.SolcotNo,
                CotNo: item.CotNo,
                Plant: item.Plant,
                AvailableAt: dateFormat.format(item.AvailableAt),
                Material: item.Material,
                RequestedQuantity: item.RequestedQuantity,
                AvailableQuantity: item.AvailableQuantity,
                MaterialDescription: item.MaterialDescription,
                Unit: item.Unit,
                GrossPrice: item.GrossPrice,
                Discount: item.Discount,
                Currency: item.Currency,
                IpiRate: item.IpiRate,
                Icms: item.Icms,
                FreightType: item.FreightType,
                Freight: item.Freight,
                Pis: item.Pis,
                Cofins: item.Cofins,
                IcmsSt: item.IcmsSt,
                Notes: item.Notes,
                Marcas: item.Marcas
              }
            });
          });
          object.Plants = [];
          data.Plants.results.forEach(function (plant) {
            object.Plants.push({
              SolcotNo: plant.SolcotNo,
              CotNo: plant.CotNo,
              PlantID: plant.PlantID,
              Name1: plant.Name1,
              Name2: plant.Name2,
              Address: plant.Address,
              PostalCode: plant.PostalCode,
              City: plant.City,
              Country: plant.Country,
              Region: plant.Region,
              City1: plant.City1,
              City2: plant.City2,
            })
          });
          return object;
        },

        save: function (data) {
          return new Promise(function (res, rej) {
            var preparedData = this.prepareData(data);
            console.table(preparedData);
            var model = this.getODataModel();

            model.setUseBatch(true);
            model.setDeferredGroups(["teste"]);
            var parameters = {
              groupId: 'teste',
              success: function (data) {
                console.log(data);
              }, error: function (err) {
                console.log(err);
              }
            };
            preparedData.ItemCotacao.forEach(function (item) {
              model.update('/' + item.chave, item.info, parameters);
            });
            delete preparedData['ItemCotacao'];
            delete preparedData['Plants'];
            model.update(`/CotacaoSet(SolcotNo='${preparedData.SolcotNo}',CotNo='${preparedData.CotNo}')`, preparedData, parameters);
            model.submitChanges({
              success: function (data) {
                res(data);
              }, error: function (err) {
                rej(err);
              }
            });
          }.bind(this));
        }
      }
    );

    return {
      getInstance: function (oModel) {
        if (!instance) {
          instance = new CotacaoModel(oModel);
        }
        return instance;
      }
    };
  }
);
