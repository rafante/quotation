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
            return date.toLocaleDateString();
        }
    };
});