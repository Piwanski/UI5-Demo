sap.ui.define([
    'ey/hr/payroll/controller/BaseController',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Filter'
], function(BaseController, FilterOperator, Filter) {
    'use strict';
    return BaseController.extend("ey.hr.payroll.controller.View1",{
        onInit: function(){
           this.oRouter = this.getOwnerComponent().getRouter();
        },
        onNext: function(sFruitId){
            //Step 1 : go to mother/parent - app container object
      //   var oAppCon = this.getView().getParent().getParent();
            //Step 2: mother/parent will call second child - navigate to view2
       //    var oView2 = oAppCon.getDetailPages()[1];
           //pass the object to view 2
      //     oAppCon.toDetail(oView2);
           this.oRouter.navTo("detail",{
            fruitId: sFruitId
           });

        },

        onItemDelete: function(oEvent){
           //get the object of selected item to mark for deletion
           var oItemToBeDeleted = oEvent.getParameter("listItem");
          //Get list controll of object
           var oList = oEvent.getSource();
           //Delete the item from List
           oList.removeItem(oItemToBeDeleted);

        },

        onItemSelect: function(oEvent){
            //when item is selected, i know which item is selected
            var oSelectedItem = oEvent.getParameter("listItem");
            //get path of selected item (element address)
            var sAddress = oSelectedItem.getBindingContextPath();
        //    get the object of the view 2
       // var oView2 = this.getView().getParent().getParent().getDetailPages()[1];
         //element binding of target controll (oSimple.bindelement(spath))
    //   oView2.bindElement(sAddress);

 var sMyId = sAddress.split("/")[sAddress.split("/").length - 1];
            this.onNext(sMyId);
        },

        onDelete: function(oEvent){
            //get object of list controll
           var oList = this.getView().byId("idList");
           //get selected items from list
             var aSelections = oList.getSelectedItems();
             //loop over items and delete them 1 by 1
             aSelections.forEach(element => {
                oList.removeItem(element);
             });
        },
        onSearch: function(oEvent){
             //read the value entered in the search bar
             var sVal = oEvent.getParameter("query");
             if(!sVal){
                sVal = oEvent.getParameter("newValue");
             }
             //take the value and make a search condidtion using filter object
             var oFilter1 = new Filter("name", FilterOperator.Contains, sVal);
             var oFilter2 = new Filter("taste", FilterOperator.Contains, sVal);
             //get the binding of list items
             var oBinding = this.getView().byId("idList").getBinding("items");
             // perform an OR between conditions
             var oFilter = new Filter({
                filters: [oFilter1, oFilter2],
                and: false
            });
             //inject the search condition to the beinding
             oBinding.filter(oFilter);
        }
    });
});