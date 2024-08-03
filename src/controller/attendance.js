const moment = require('moment')

require('dotenv').config()

const response = require('../constant/response')
const attendanceModel = require('../models/attendance')
// const staffModel = db.staff
// const  { Op } = db.Sequelize

// add staff attendance 
exports.add = async(req, res) => {
        const todaysDate = moment().format('YYYY-MM-DD')
        const findRecordLength = await attendanceModel.find(
            {date: todaysDate, staff_id: req.body.staff_id}
        )

        if(findRecordLength.length >= 2){
            return response(res, false, 422, 'Sorry, You can check-in only twice a day')
        }else{

            const findExistingRecord = await attendanceModel.findOne(
                {date:  todaysDate, staff_id: req.body.staff_id}
            )
            if(findExistingRecord){
                if(findExistingRecord.out_time ===  null){
                    const totalTimeDifference = await timeDifference(findExistingRecord)
                    console.log(findExistingRecord, '------- findExistingRecord 27');
                
                    const updateObj = {
                        out_time: moment(totalTimeDifference.endTime).format('HH:mm:ss'),
                        is_checkIn: false,
                        time_duration: `${totalTimeDifference.countHours}:${totalTimeDifference.countMin}`
                    }
            
                    const updateRecord = await attendanceModel.findOneAndUpdate({_id: findExistingRecord.id},updateObj)
                    if(!updateRecord){
                        return response(res, false, 422, 'Error, out_time not updated for last check-in')
                    }
                }
                    req.body.date = moment().format('YYYY-MM-DD')
                    req.body.in_time = moment().format('HH:mm:ss')
                    await attendanceModel.create(req.body)
                    .then((attdResult) => {
                        return response(res, true, 201, 'attendence added successfully!',attdResult)
                    })
                    .catch((err) => {
                        console.log('err ==> ',err);
                        return response(res, false, 422, 'error, attendance not added!')
                    })
                
                
            }else{
                    req.body.date = moment().format('YYYY-MM-DD')
                    req.body.in_time = moment().format('HH:mm:ss')
                    await attendanceModel.create(req.body)
                    .then((attdResult) => {
                        return response(res, true, 201, 'attendence added successfully!',attdResult)
                    })
                    .catch((err) => {
                        console.log('err ==> ',err);
                        return response(res, false, 422, 'error, attendance not added!')
                    })
                
            }
        
        }

}

// view particular staff attendance by staff_id
exports.view = async(req, res) => {
   await attendanceModel.find({staff_id: req.params.staff_id}).populate('staff_id')
   .then((staffResult) => {
    
    if(!staffResult.length){
        return response(res, false, 204, 'staff attendance does not exist')
    }else{
        const staffArr = []
        for(let i =0; i< staffResult.length; i++){
            staffArr.push({
               id: staffResult[i].id,
               date: staffResult[i].date? moment(staffResult[i].date).format(): null,
               in_time:  staffResult[i].in_time? moment(staffResult[i].in_time, 'HH:MM:ss') : null,
               out_time: staffResult[i].out_time? moment(staffResult[i].out_time, 'HH:MM:ss') : null,
               notes: staffResult[i].notes,
               status: staffResult[i].status,
               is_checkIn: staffResult[i].is_checkIn,
               time_duration: staffResult[i].time_duration? moment(staffResult[i].time_duration, 'HH:MM:ss') : null,
               staff_id: staffResult[i].staff_id.id,
               staff_name: staffResult[i].staff_id.name 
            })
        }
        return response(res, true, 200, 'staff attendance result found',  staffArr)
    }
   })
   .catch(() =>{
    return response(res, false, 422, 'staff attendance data not found')
   })
}

// add or edit staff attendance
exports.edit = async(req, res) => {
    const todaysDate = moment().format('YYYY-MM-DD')
    const checkExistingRecord=  await attendanceModel.findOne({ date: todaysDate, staff_id: req.currentUser.id, out_time: null })
    /* ---------------------------------------
    

    
   

           
            method-1
            const minutesDdifference = moment(outTime,'HH:mm:ss').diff(moment(startTime, 'HH:mm:ss'), 'minutes')
            const HourDifference = moment(outTime,'HH:mm:ss').diff(moment(startTime, 'HH:mm:ss'), 'hours')
            
            console.log('startTime => ',startTime);
            console.log('endTime => ',endTime);
            
            console.log('minutesDdifference => ',minutesDdifference);
            console.log('HourDifference => ',HourDifference);
            -----------------------------------------------------
            
            method-2
            const difference = moment.duration(endTime.diff(startTime))
            const hourDifference =difference.hours()
            const minDifference =difference.minutes()
            console.log('hourDifference => ',hourDifference);
            console.log('minDifference => ',minDifference);
            (not working bcoz of wrong min diff)
            -------------------------------------------- */
            
    
        if(checkExistingRecord){
            const totalTimeDifference = await timeDifference(checkExistingRecord)
                req.body.out_time = moment(totalTimeDifference.endTime).format('HH:mm:ss')
                req.body.is_checkIn = false
                req.body.time_duration = `${totalTimeDifference.countHours}:${totalTimeDifference.countMin}`
            
            await attendanceModel.findOneAndUpdate({_id:checkExistingRecord.id},req.body)
            .then(async() => {
                return response(res, true, 201, 'Checked-out successfully')
            })
            .catch((error) => {
                return response(res, false, 422, 'Error, out_time not updated for last check-in')
            })
        }else{
            const findRecordLength = await attendanceModel.find(
                {date: todaysDate, staff_id: req.currentUser.id}
            )
            
            if(findRecordLength.length >= 2){
                return response(res, false, 422, 'Sorry, You can check-in only twice a day')
            }else{

                req.body.date = moment().format('YYYY-MM-DD')
                req.body.in_time = moment().format('HH:mm:ss')
                req.body.status = 'Working';
                req.body.staff_id = req.currentUser.id
                await attendanceModel.create(req.body)
                .then((attdResult) => {
                    return response(res, true, 201, 'Checked-in successfully',attdResult)
                })
                .catch(() => {
                    return response(res, false, 422, 'error while checking-in')
                })
            }
        }  
}

// particular date wise/currrent day attendance list of staff
exports.listByDate = async(req, res) => {
    let condition = {}
    if(req.query.date){
        condition = {
            date: req.query.date
        }
    }else{
        condition = {
            date: moment().format('YYYY-MM-DD')
        }
    }
    await attendanceModel.find(condition).populate('staff_id')
    .then(async(listResult) => { 
        if(!listResult){
            return response(res, false, 422, 'staff attendance does not exist')
        }
    
        const listArr = []
        for(let i = 0; i< listResult.length; i++){
            const obj = {
                id: listResult[i].id,
                date: listResult[i].date,
                in_time: listResult[i].in_time,
                out_time: listResult[i].out_time,
                notes: listResult[i].notes,
                status: listResult[i].status,
                is_checkIn: listResult[i].is_checkIn,
                time_duration:listResult[i].time_duration ? convertH2M(listResult[i].time_duration) + ' min' : '', 
                staff_id: listResult[i].staff_id._id,
                staff_name: listResult[i].staff_id.name
            }
            listArr.push(obj)
        }
        return response(res, true, 200, 'staff attendance list',listArr)
    })
    .catch((err) => {
        console.log('err => ',err);
        return response(res, false, 422, 'staff attendance list not found')
    })
}

// current day loged-in staff attendance list
exports.myAttendanceList = async(req, res) => {
    console.log(req.currentUser.id);
    await attendanceModel.find({staff_id: req.currentUser.id, date: moment().format('YYYY-MM-DD') })
    .then((staffData) => {
        if(!staffData.length){
            return response(res, false, 204, 'staff data does not exist')
        }else{
            for(let i = 0; i < staffData.length; i++){
                 staffData[i].time_duration = staffData[i].time_duration? convertH2M(staffData[i].time_duration) + ' min' : null
            }
            return response(res, true, 200, 'staff data found', staffData)
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'staff data not found')
    })
}







function convertH2M(hours){
    const timeParts = hours.split(':')
    return Number(timeParts[0] * 60) + Number(timeParts[1])
}

function timeDifference(data){
    const outTime = moment()
    const startTime = moment(data.in_time,'HH:mm:ss')
    const endTime = moment(outTime, 'HH:mm:ss') 
            
    const hourDifference =endTime.hours() - startTime.hours()
    const minutesDifference =Math.abs(endTime.minutes() - startTime.minutes())

    const countHours = hourDifference < 10 ? '0' + hourDifference : hourDifference;
    const countMin = minutesDifference < 10 ? '0' + minutesDifference : minutesDifference;

    const obj = {
        countHours: countHours,
        countMin: countMin,
        endTime: endTime
    }

    return obj;
}