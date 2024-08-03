const staffController = require('../controller/staff')
const auth = require('../middleware/auth.middleware')

module.exports = function(app, router) {
    router.post('/staff-add',auth,staffController.add)
    router.get('/view-staff/:id',auth ,staffController.view)
    router.get('/list-staff',auth ,staffController.list)
    router.put('/edit-staff/:id',auth,staffController.edit)
    router.put('/change-password',auth,staffController.changePassword)
    router.delete('/delete-staff/:id',auth,staffController.remove)
    // router.post('/create-bucket', staffController.uploadToS3)

    app.use('/api', router)
}