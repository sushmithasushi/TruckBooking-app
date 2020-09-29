import { LightningElement,api,wire } from 'lwc';
import acc from '@salesforce/schema/Contact.AccountId';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
const fields = [acc];

export default class UpdAccount extends LightningElement {
    @api recordId;
    @api objectApiName;
    @wire(getRecord, { recordId: '$recordId', fields })
    contact;
     get acc() {
        return getFieldValue(this.contact.data, acc);
    }
    handleSuccess(event) {
        const msg=new ShowToastEvent({
            
            message: 'Updatetion Successful',
            variant: 'success',
            })
            this.dispatchEvent(msg);
           this.s=false;
    }
    handleError(){
    
        const msg=new ShowToastEvent({
        title: 'Error',
        message: '',
        variant: 'error',
        })
        this.dispatchEvent(msg);
}
cancel1(event)
{
    this.s=false;
}
}