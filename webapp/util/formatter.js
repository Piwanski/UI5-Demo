sap.ui.define([

], function() {
    'use strict';
    return{
        getStatus: function(status){
            //Since the Model was initialized by manifest file
            //the model is available at component level
            //Step 1: access the object of component from controller object
            var oComponent = this.getOwnerComponent();
            //step 2. From the model acces the entityset which has constant values
            var statuses = oComponent.getModel().getProperty("/status");
            //loop over everything to derive the value out
            for (let i = 0; i < statuses.length; i++) {
                const element = statuses[i];
                if(element.key === status){
                    return element.value;
                }
                
            }
            statuses.forEach(element => {
                if(element.key === status){
                    return element.value;
                }
            });
        },

        getColorCode: function(status){
            //Since the Model was initialized by manifest file
            //the model is available at component level
            //Step 1: access the object of component from controller object
            var oComponent = this.getOwnerComponent();
            //step 2. From the model acces the entityset which has constant values
            switch (status) {
                case "A":
                    return 'Success';
                    break;
                case "D":
                    return 'Warning';
                    break;
            
                case "O":
                    return 'Error';
                    break;
                       
                default:
                    break;
            }
        }
    }
});