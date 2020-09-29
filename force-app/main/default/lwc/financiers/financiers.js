import { LightningElement,wire,track } from 'lwc';
import getpay from '@salesforce/apex/TruckController.getpay';
import { deleteRecord ,updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const options = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'CAD', value: 'CAD' },
    { label: 'GBP', value: 'GBP' },
    { label: 'INR', value: 'INR' }];


export default class Financiers extends LightningElement {
    @track f;
    @track chartConfiguration;
    @track fromCurrencyValue;
    @track toCurrencyValue;
    @track options = options;
    @track toCurrencyOptions = options;
    @track conversionData;
    at;
    ca;
    payId;
    m=false;
   
    @wire (getpay)
    getApexData({error,data}){
        if(data){
            this.f=data;
            console.log("this is data")
            console.log(data);
        }
        if(error)
        {
            console.log('error in fetching data');
        }
        
    }
    convert(event)
    {
        this.ind=event.target.value;
        this.at=this.f[this.ind].Amount__c;
        this.ca=parseInt(this.at)*this.conversionData.Exchange_Rate;
        alert("Converted Amount is:"+this.ca)
    }
    del(event){
        this.ind=event.target.value;
        this.payId=this.f[this.ind].Id;
        alert(this.payId)
            deleteRecord(this.payId)
            .then(() => {
            this.dispatchEvent(
            new ShowToastEvent({
            title: 'Success',
            message: 'Record Is Deleted',
            variant: 'success',
            }),
            );
            })
            .catch(error => {
            this.dispatchEvent(
            new ShowToastEvent({
            title: 'Error While Deleting record',
            message: error.message,
            variant: 'error',
            }),
            );
            });
         location.reload();
            
    }
    edit(event)
{
 
    this.ind=event.target.value;
    this.payId=this.f[this.ind].Id;
    this.BookId=this.f[this.ind].Booking__c;
    this.mop=this.f[this.ind].Mode_of_Payment__c;
    this.pr=this.f[this.ind].Payment_Received__c;
    this.m=true;
    
    
}
clear(event)
{
    this.m=false;
}
error(event)
{
    
    const msg=new ShowToastEvent({
        title: 'Error',
        message: 'Cannot save the Changes',
        variant: 'error',
        })
        this.dispatchEvent(msg);
        
}
success(event) {
    const msg=new ShowToastEvent({
        
        message: 'Congrats!!! Changes are Saved',
        variant: 'success',
        })
        this.dispatchEvent(msg);
        this.m=false;
        location.reload();
         
}
    
    // Getting Base currency value
    handleFromCurrencyChange(event) {
        this.fromCurrencyValue = 'USD';
        alert("from Currency Value"+this.fromCurrencyValue)
    }

    // getting exchange currency value
    handleToCurrencyChange(event) {
        this.toCurrencyValue = event.detail.value;
        alert("To Currency Value"+this.toCurrencyValue)

    }


    // Making Callout using Fetch
    handleCurrencyConversion() {
        fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=' 
                    + this.fromCurrencyValue + '&to_currency=' + this.toCurrencyValue + '&apikey=4W7NZUQNJ061YHHF', // End point URL
        {
            // Request type
            method:"GET",
            
            headers:{
                // content type
                "Content-Type": "application/json",
                // adding your access token 
                "Authorization": "OAuth 00DB0000000EfVQ!AQwAQEiiynMU2EsBcS2PhXSQ6KQTTG.Zr0hlDHTFcGcAPqKQOBNDB0rwyASZK44fqIAVe6GrVNZPsAWJ6iqXLNBfSQ.dqvW1",
            }
        })
        .then((response) => {
            return response.json(); // returning the response in the form of JSON
        })
        .then((jsonResponse) => {

            let objData = {
                From_Currency_Name : '',
                From_Currency_Code : '',
                To_Currency_Name : '',
                To_Currency_Code : '',
                Exchange_Rate : '',
                Last_Refersed : '',
            };

            window.console.log('jsonResponse ===> '+JSON.stringify(jsonResponse));
            // retriving the response data
            let exchangeData = jsonResponse['Realtime Currency Exchange Rate'];

            // adding data object
            objData.From_Currency_Code = exchangeData['1. From_Currency Code'];
            objData.From_Currency_Name = exchangeData['2. From_Currency Name'];
            objData.To_Currency_Code = exchangeData['3. To_Currency Code'];
            objData.To_Currency_Name = exchangeData['4. To_Currency Name'];
            objData.Exchange_Rate = exchangeData['5. Exchange Rate'];
            objData.Last_Refershed = exchangeData['6. Last Refreshed'];

            // adding data object to show in UI
            this.conversionData = objData;
        })
        .catch(error => {
            window.console.log('callout error ===> '+JSON.stringify(error));
        })
    } 



}