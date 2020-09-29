import { LightningElement,wire,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getdata from '@salesforce/apex/TruckController.getalldata';

export default class Customers extends LightningElement {
    @track truck;
    s=true;
    a=false;
    ind;
    truckId;
    inSelect = false;
    outSelect = false;
    inn=false;
    out=false;
    b1=true;
    b2=true;
    l=false;
    t;
    co=false;
    
    @wire (getdata)
    getApexData({error,data}){
        if(data){
            this.truck=data;
            console.log("this is data")
            console.log(data);
        }
        if(error)
        {
            console.log('error in fetching data');
        }
        
    }
    select(event)
    {
        this.ind=event.target.value;
        this.s=false;
        this.a=true;
        this.truckId=this.truck[this.ind].Id;
        this.up=this.truck[this.ind].Name;
    }
    incity(event)
    {
        this.inSelect = !this.inSelect;
        this.t='within city';
        this.inn=true;
        this.b2=false;
        this.out=false;
    }
    outcity(event)
    {
        this.outSelect = !this.outSelect;
        this.t='outside city';
        this.out=true;
        this.b1=false;
        this.inn=false;
    }
    back(event)
    {
        this.s=true;
        this.a=false;
    }
    handleError(){
    
        const msg=new ShowToastEvent({
        title: 'Error',
        message: '',
        variant: 'error',
        })
        this.dispatchEvent(msg);
}
handleSuccess(event) {
    const msg=new ShowToastEvent({
        
        message: 'Kindly add the Load information',
        variant: 'success',
        })
        this.dispatchEvent(msg);
        this.inn=false;
        this.out=false;
        this.bookId=event.detail.id;
        this.a=false;
        this.l=true;  
}
loadinfo(event) {
    const msg=new ShowToastEvent({
        
        message: 'Congrats!!! Your booking is done',
        variant: 'success',
        })
        this.dispatchEvent(msg);
        this.inn=false;
        this.out=false;
        this.bookId=event.detail.id;
        this.a=false;
        this.l=false;   
        this.s=true;
}
handleError(event)
{
    
    const msg=new ShowToastEvent({
        title: 'City , From City Places and To City Places cannot be Null',
        message: 'Kindly Provide a Value',
        variant: 'error',
        })
        this.dispatchEvent(msg);
}


handlerror(event)
{
    
    const msg=new ShowToastEvent({
        title: 'From City or To City cannot be Null',
        message: 'Kindly provide a Value',
        variant: 'error',
        })
        this.dispatchEvent(msg);
}

error(event)
{
    
    const msg=new ShowToastEvent({
        title: 'Error',
        message: 'Kindly enter wt less than apx wt',
        variant: 'error',
        })
        this.dispatchEvent(msg);
}
cancel1(event)
{
    this.inn=false;
    this.inSelect = !this.inSelect;

}
cancel2(event)
{
    this.out=false;
    this.outSelect = !this.outSelect;
}
clear(event)
{
    this.l=false;
    this.a=true;
}
}