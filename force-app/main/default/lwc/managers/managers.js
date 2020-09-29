import { LightningElement,wire,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getData from '@salesforce/apex/TruckController.getall';
import { deleteRecord ,updateRecord} from 'lightning/uiRecordApi';
import assignconfirm from '@salesforce/apex/TruckController.assignconfirm';
import getBookings from '@salesforce/apex/TruckController.getBookings';
import booksout from '@salesforce/apex/TruckController.books';
import getsentBooks from '@salesforce/apex/TruckController.getsentBooks';


export default class Managers extends LightningElement {
    @track b
    w=false;
    o=false;
    j;
    m=false;
    cnt;
    cc=false;
    c1=false;
   
    
    outSelect=false;
    ind;
    

    @wire (getData)
    getApexData({error,data}){
        if(data){
            this.b=data;
            console.log("this is within data")
            console.log(data);
        }
        if(error)
        {
            console.log('error in fetching data');
        }


}
clear(event)
{
    this.m=false;
}
chart(event)
{
    this.cc=!this.cc;
}
chart2(event)
{
    this.c1=!this.c1;
}
edit(event)
{
 
    this.ind=event.target.value;
    this.truckId=this.b[this.ind].Truck__c;
    this.bookId=this.b[this.ind].Id;
    this.typ=this.b[this.ind].Type__c;
    this.acc=this.b[this.ind].Account__c;
    this.c=this.b[this.ind].City__c;
    this.fcp=this.b[this.ind].From_City_places__c;
    this.tcp=this.b[this.ind].To_city_places__c;
    this.fc=this.b[this.ind].From_City__c;
    this.tc=this.b[this.ind].To_City__c;

  
    this.m=true;
    alert(this.m);
    
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
del(event){
    this.ind=event.target.value;
    this.bookId=this.b[this.ind].Id;
    alert(this.bookId)
        deleteRecord(this.bookId)
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
        alert("hi")
     location.reload();
        
}

assign(event){
    this.outSelect = !this.outSelect;
    this.ind=event.target.value;
    this.bookId=this.b[this.ind].Id;
    assignconfirm({
        bookId:this.bookId
    })
    const msg=new ShowToastEvent({
        
        message: 'Assigned to a Driver',
        variant: 'success',
        })
        this.dispatchEvent(msg);
    location.reload();
}
@wire(getsentBooks, {})
getsentBooks({error, data}) {
 if (error) {
  this.error = error;
  console.log('error => ' + JSON.stringify(error));
  this.chartConfiguration = undefined;
 } else if (data) {
  let chartData = [];
  let chartLabels = [];
  data.forEach(opp => {
   chartData.push(opp.cnt);
   chartLabels.push(opp.Data_Exported__c);
  });

  this.chartConfig = {
   type: 'doughnut',
   data: {
    labels: chartLabels,
    datasets: [
     {
      label: 'Data Export Status',
      barPercentage: 1.0,
      barThickness: 5,
      maxBarThickness: 8,
      minBarLength: 0,
      backgroundColor: ["#8e5ea2","#3e95cd"],
      data: chartData,
     },
    ],
   },
   options: {
   },
  };
  console.log('data => ', data);
  this.error = undefined;
 }
}
@wire(getBookings, {})
getBookings({error, data}) {
 if (error) {
  this.error = error;
  console.log('error => ' + JSON.stringify(error));
  this.chartConfiguration = undefined;
 } else if (data) {
  let chartData = [];
  let chartLabels = [];
  data.forEach(opp => {
   chartData.push(opp.cnt);
   chartLabels.push(opp.Booking_Status__c);
  });

  this.chartConfiguration = {
   type: 'bar',
   data: {
    labels: chartLabels,
    datasets: [
     {
      label: 'Booking Status',
      barPercentage: 1.0,
      barThickness: 5,
      maxBarThickness: 8,
      minBarLength: 0,
      backgroundColor: "Blizzard blue",
      data: chartData,
     },
    ],
   },
   options: {
   },
  };
  console.log('data => ', data);
  this.error = undefined;
 }
}
sendbook(event)
{
    this.ind=event.target.value;
    this.bookId=this.b[this.ind].Id;
    alert(this.bookId+"asxasx");
    booksout({
        bookId:this.bookId
        })
    location.reload();
}

}