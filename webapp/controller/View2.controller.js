sap.ui.define([
    'ey/hr/payroll/controller/BaseController',
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
], function (BaseController, History, MessageBox, MessageToast, Fragment, FilterOperator, Filter) {
    'use strict';
    return BaseController.extend("ey.hr.payroll.controller.View2", {
        onBack: function () {
            //Chaining - single line w/o extra varibale
            //  this.getView().getParent().to("idView1");
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter.navTo("home");
            }


        },

        onInit: function () {

            //get router object
            this.oRouter = this.getOwnerComponent().getRouter();
            //register the route matched handler event
            //this is the object of current controller, which we need to also pass to herculis function
            this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
        },
        herculis: function (oRoute) {

            // get the fruit id from the event object
            var sId = oRoute.getParameter("arguments").fruitId;
            // reconstruct te fruit address of element
            var sPath = "/fruits/" + sId;
            this.getView().bindElement(sPath)
        },

        onSave: function () {

            var that = this;
            MessageBox.confirm("Object Saved", {
                title: "Piotr app",

                // when we attatch a function to event dynamically (in JS0), the function will never
                //have access to 'this' pointer, since we need 'this' object inside the function,
                //we can pass it explicitly to event handler using 2 techniques =
                //1. Dynamic binding of this pointer to the event handler
                //2. Create a local variable in caller function which will be In-scope to the called function
                onClose: function (status) {
                    that.testFunction();
                    if (status === "OK") {
                        MessageToast.show("the order waas created succesfully");
                    } else {
                        MessageBox.alert("Order was not created");
                    }
                },
            })

        },

        onSupplierNav: function (oEvent) {
            //Step 1: extract the detail of which item was clicked
            var oSelectedItem = oEvent.getParameter("listItem");
            //Step 2: get the element path
            var sPath = oSelectedItem.getBindingContextPath();
            console.log(sPath);
            //Step 3: Extract the index of the selected item from the path
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            //Step 4: Ask router to navigate also pass the index to route
            this.oRouter.navTo("supplier", {
                supplierId: sIndex
            });
        },

        testFunction: function () {
            MessageBox.error("Im a controller function");
        },

        onReject: function () {
            MessageBox.error("Order was canceled");

        },

        oSupplierPopup: null,
        onSuppFilter: function (oEvent) {
            //Create a copy of global this pointer to local variable so we can access
            //our controller object inside promise function
            var that = this;
            if (this.oSupplierPopup == null) {
                Fragment.load({
                    fragmentName: 'ey.hr.payroll.fragments.popup',
                    type: 'XML',
                    id: 'supplier',
                    controller: this
                }).then(function (oFragment) {
                    that.oSupplierPopup = oFragment;
                    that.oSupplierPopup.setTitle("Select Suppliers");
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.bindAggregation("items", {
                        path: '/supplier',
                        template: new sap.m.StandardListItem({
                            title: '{name}',
                            description: '{person}',
                            icon: 'sap-icon://supplier'
                        })
                    });
                    that.oSupplierPopup.open();
                });
            } else {
                this.oSupplierPopup.open();
            }

        },

        onSupplier: function () {
            MessageBox.confirm("this funcitonality is under construction");

        },
        oCityPopup: null,
        oField: null,
        onF4Help: function (oEvent) {
            //take a snapshot of the table cell the F4 was fired
            this.oField = oEvent.getSource();
            var that = this;
            if (this.oCityPopup == null) {
                Fragment.load({
                    fragmentName: 'ey.hr.payroll.fragments.popup',
                    type: 'XML',
                    id: 'cities',
                    controller: this
                })
                    //then promise once the fragement is loaded...get the fragment object here
                    .then(function (oFragment) {
                        that.oCityPopup = oFragment;
                        that.oCityPopup.setTitle("Choose your city");
                        that.getView().addDependent(that.oCityPopup);
                        that.oCityPopup.bindAggregation("items", {
                            path: '/cities',
                            template: new sap.m.StandardListItem({
                                title: '{name}',
                                description: '{state}'
                            })
                        });
                        that.oCityPopup.open();
                    });
            } else {
                this.oCityPopup.open();
            }
        },

        onSearchPopup: function (oEvent) {
            //extract the value search by user
            var sVal = oEvent.getParameter("value");
            //build the filter object
            var oFilter = new Filter("name", FilterOperator.EQ, sVal);
            //get the binding of source control (select dialog)
            var oBinding = oEvent.getSource().getBinding("items");
            //inject the filter
            oBinding.filter(oFilter);
        },
        onPopupConfirm: function (oEvent) {
            var sId = oEvent.getSource().getId();
            //find the item that was selected by user
            var oSelectedItem = oEvent.getParameter("selectedItem");
            //extract the title of selected item
            var sText = oSelectedItem.getTitle();
            if (sId.indexOf("cities") !== -1) {
                //set the value to the cell of the table on which F4 was fired
                this.oField.setValue(sText);
            } else {
                    //here is the logic for filtering data inside the table
                    //get all selected items in the popup fragment
                    var aItems = oEvent.getParameter("selectedItems");
                    //loop over each item and make a filter array
                    var aFilters =[];
                    for (let index = 0; index < aItems.length; index++) {
                        const element = aItems[index];
                        var oFilter = new Filter("name", FilterOperator.EQ, element.getTitle());
                        aFilters.push(oFilter);
                    }
                    //make a global filter with OR condtion
                    var oFinalFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });
                    //get the table object
                    var oTable = this.getView().byId("idSupplier");
                    //get the binding of the table
                    var oBinding = oTable.getBinding("items");
                    //inject the filter of the binding
                    oBinding.filter(oFinalFilter);

            }

        }
    });
});