# Generate invoice 

## Steps to run the project
1. ```npm i  // install node dependency
2. node ./generateInvoice.js // run js file

## Description
Here we have a dummy data inside "DummyData" folder. It's in JSON format. 
Let's assume that we are using MongoDB as a database. 
In a "generateInvoice" file, we have 2 functions
    1. getTutorInvoices
    2. calculate

Pass tutor_id in getTutorInvoices function to get invoices for particular tutor.
If we don't pass any tutor_id then we will receive invoices for all tutors.

