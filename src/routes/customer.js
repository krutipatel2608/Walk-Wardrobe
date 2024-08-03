const customerController = require('../controller/customer')
const auth = require('../middleware/auth.middleware')

module.exports = (app, router) => {
    router.post('/add-customer', auth,customerController.add)
    router.get('/view-customer/:id', auth,customerController.view)
    router.get('/list-customer', auth,customerController.list)
    router.put('/edit-customer/:id', auth,customerController.edit)
    router.delete('/delete-customer/:id', auth,customerController.remove)
    router.put('/chage-password', auth,customerController.changePassword)
    router.put('/generate-otp', customerController.customerOtp)

    app.use('/api', router)
}