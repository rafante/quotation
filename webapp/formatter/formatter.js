sap.ui.define([
    'sap/ui/core/ValueState'
], function (ValueState) {
    "use strict";
    return {
        getStatusIcon: function (status) {
            switch (status) {
                case "A":
                    return "sap-icon://message-success";
                case "E":
                    return "sap-icon://message-warning";
                case "L":
                    return "sap-icon://message-information";
                case "C":
                    return "sap-icon://status-inactive";
                default:
                    return "sap-icon://status-inactive";
            }
        },

        getStatusHighlight: function (status) {
            switch (status) {
                case "A":
                    return sap.ui.core.ValueState.Success;
                case "E":
                    return sap.ui.core.ValueState.Warning;
                case "L":
                    return sap.ui.core.ValueState.Information;
                case "C":
                    return sap.ui.core.ValueState.Information;
                default:
                    return sap.ui.core.ValueState.Error;

            }
        },

        getStatusState: function (status) {
            switch (status) {
                case "A":
                    return ValueState.Success;
                case "E":
                    return ValueState.Warning;
                case "L":
                    return ValueState.Information;
                case "C":
                    return ValueState.Information;
                default:
                    return ValueState.Error;

            }
        },

        getFormattedDate: function (date) {
            return date ? date.toLocaleDateString() : '';
        },

        materialDetailDescription: function (a, b) {
            return a + ':' + b;
        },

        likePrice: function (priceValue) {
            var formattedPrice = '0.00'
            if (priceValue && !isNaN(priceValue.replace(/\D/g, ''))) formattedPrice = priceValue.replace(/\D/g, '');
            if (formattedPrice.length < 3)
                formattedPrice = '0.' + formattedPrice.padStart(2, '0');
            else
                formattedPrice = (Number(formattedPrice).toFixed(2) / 100).toFixed(2).toString();

            return formattedPrice.replace('.', ',');
        }
    };
});