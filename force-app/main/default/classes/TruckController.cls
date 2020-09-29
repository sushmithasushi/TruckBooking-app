public with sharing class TruckController {
    public TruckController() {}
    @AuraEnabled(cacheable=true)
    public static List<Truck__c> getalldata(){
        List<Truck__c> l=[SELECT Cost_per_Km__c,Maximum_Load__c,Truck_Image__c,Name FROM Truck__c];
        return l;
     }
     @AuraEnabled(cacheable=true)
     public static List<Contact> getcondata(){
         List<Contact> l=[SELECT AccountId FROM Contact];
         return l;
      }
     @AuraEnabled(cacheable=true)
     public static List<Payment__c> getpay(){
         List<Payment__c> l=[SELECT Id,Booking__c,Mode_of_Payment__c,Name,Amount__c,Payment_Received__c,Account_Name__c FROM Payment__c];
         return l;
      }
     @AuraEnabled(cacheable=true)
     public static List<Booking__c> getall(){
         List<Booking__c> l=[SELECT Name,Account__c,Account_Name__c,City__c,Booking_Status__c,From_City__c,From_City_places__c,To_City__c,To_city_places__c,Truck__c,Truck_Name__c,Type__c FROM Booking__c];
         return l;

      }
  
      @AuraEnabled(cacheable=true)
      public static List<AggregateResult> getBookings(){
          return [SELECT Booking_Status__c,COUNT(Name) cnt FROM Booking__c GROUP BY Booking_Status__c];
      }
      @AuraEnabled(cacheable=true)
      public static List<AggregateResult> getsentBooks(){
          return [SELECT Data_Exported__c,COUNT(Name) cnt FROM Booking__c GROUP BY Data_Exported__c];
      }
       @AuraEnabled
      public static void books(String bookId){
        try{
          List<Booking__c> ab=[SELECT Id,Name,Account_Name__c,Truck_Name__c,Type__c,Data_Exported__c FROM Booking__c WHERE Id =: bookId];
          Booking__c ob=ab[0];
        

            if(!ab.isEmpty()){
                JSONGenerator gen = JSON.createGenerator(true);
                gen.writeStartObject();     
                gen.writeFieldName('BookingList');
                gen.writeStartArray();
                for(Booking__c b :ab){
                    gen.writeStartObject();
                    gen.writeStringField('Id', b.Id);
                    gen.writeStringField('Name', b.Name);
                    gen.writeStringField('AccountName', b.Account_Name__c);
                     gen.writeStringField('Truck Name', b.Truck_Name__c);
                    gen.writeStringField('Type', b.Type__c);                
                    gen.writeEndObject();
                }
                gen.writeEndArray();
                gen.writeEndObject();
                String jsonData = gen.getAsString();
                System.debug('jsonData-' + jsonData);
                Http http = new Http();
                HttpRequest request = new HttpRequest();
                request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals');
                request.setMethod('POST');
                request.setHeader('Content-Type', 'application/json;charset=UTF-8');
                // Set the body as a JSON object
                request.setBody(jsonData);
                HttpResponse response = http.send(request);
                // Parse the JSON response
                if (response.getStatusCode() != 201) {
                  ob.Data_Exported__c='No';
                  update ob;
                } else {
                  ob.Data_Exported__c='Yes';
                  update ob;
                }
            }
        }
        catch(DmlException e) {
          
            System.debug('An unexpected error has occurred: ' + e.getMessage());
                 }  
      }   
      @AuraEnabled
      public static void assignconfirm(String bookId){  
       try{
          List<Booking__c> l=[SELECT Assign_driver__c FROM Booking__c WHERE Id =: bookId];
          Booking__c ob=l[0];
          ob.Assign_driver__c='yes';
         update ob;
       }
       catch(DmlException e) {        
              System.debug('An unexpected error has occurred: ' + e.getMessage());
                   }
          
         }
        
}
