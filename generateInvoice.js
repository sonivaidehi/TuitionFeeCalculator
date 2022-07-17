const { isEmpty, find, filter, forEach, groupBy } = require('lodash')
const fs = require('fs');
const dummyData = fs.readFileSync('./dummyData/data.json');
const data = JSON.parse(dummyData);
const {tutors, students, classes} = data;

/**
 * 
 * @param {int} tutorId 
 * @returns Object invoice
 */
const calculateInvoice = (tutorId)=>{
    // object to hold invoice details
    const invoice = {};
    // find tutor info
    const tutorInfo = find(tutors, {id: tutorId});
    // find all classes given by a tutor
    const classesInfo = filter(classes, {tutor_id: tutorId});
    // intialize total hours with 0
    let totalHours = 0;
    // intialize total Amount Payable with 0
    let totalAmountPayable =0;
    // An array to hold all class details 
    const classDetails = [];
    // A variable to hold details for single class
    var classDetail={};
    // A variable to hold student information
    var student;
    // A variable to hold total amount
    var totalAmount=0
    // An object which is having class details grouped by student_id
    const studentGroupBy = groupBy(classesInfo, 'student_id')
    // iterate class details grouped by student_id
    forEach(studentGroupBy, (classArr, studentId)=>{
        // total hours for particaluar student
        let studentHrs = 0;
        // A varibale to hold calculated hours of class
        let hr=0;
        // A variable to hold amout of particular student.
        let amount=0;
        // find Student information
        student = find(students, {id: parseInt(studentId)});
        // assign studentName to classDetail object
        Object.assign(classDetail, {studentName: `${student.first_name} ${student.last_name}`});
        // iterate classes attended by a student
        forEach(classArr, (cObj)=>{
            // calculate hours from start time and end time
            hr = Math.abs(new Date(cObj.start_time).getTime() - new Date(cObj.end_time).getTime()) / (1000*60*60)
            // add hours to student class hours
            studentHrs+=hr;
            // add hours to total hours 
            totalHours+=hr;
            // calculate amount as per total hours and fees per class of particular tutor
            totalAmount = (hr*cObj.class_fee_per_hour);
            // apply discount as well
            if(cObj.discount_rate) totalAmount = totalAmount - (totalAmount/cObj.discount_rate);
            // add totalAmount to amount for particular student
            amount+=totalAmount;
            // add totalAmount to totalAmountPayable
            totalAmountPayable+=totalAmount;
        })
        // assign calculated hours and amount to class details.
        Object.assign(classDetail, { hours: studentHrs, amount: amount});
        // add class detail object to an array
        classDetails.push(classDetail);
        classDetail = {};
    })
    
    // add tutor info
    invoice.tutor = tutorInfo;
    // add time duration of a tutor
    invoice.timeDuration = totalHours;
    // add class details
    invoice.classDetails = classDetails;
    // deduct 8% txt from total payable amount
    totalAmountPayable = totalAmountPayable - (totalAmountPayable/8)
    invoice.totalAmountPayable = totalAmountPayable
    
    // return invoice details
    return invoice
}
const getTutorInvoices = (tutorId=null) => {
    let result;
    // if tutorId is available
    if(tutorId){
        // get invoice of that particular tutor
        result = calculateInvoice(tutorId)
    }else{

        // calculate invoices of all tutor
        result = []
        forEach(tutors,(tutor)=>{
            result.push(calculateInvoice(tutor.id));
        })
    }
    // return array/object of invoices
    return result;
}


console.log(getTutorInvoices(2))
