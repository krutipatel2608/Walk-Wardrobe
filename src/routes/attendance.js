const attendanceContoller = require('../controller/attendance')
const auth = require('../middleware/auth.middleware')

module.exports = function(app,router) {
    router.post('/add-attendance',attendanceContoller.add)
    router.get('/view-attendance/:staff_id',auth,attendanceContoller.view)
    router.put('/edit-attendance',auth,attendanceContoller.edit)
    router.get('/attendance-list',auth,attendanceContoller.listByDate)
    router.get('/myAttendance',auth,attendanceContoller.myAttendanceList)

    app.use('/api', router)
}