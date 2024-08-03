const adminController = require('../controller/admin')
const customerController = require('../controller/customer')


module.exports = function(app, router) {
    // router.post('/sign-up', adminController.signUp)
    router.post('/sign-in', adminController.signIn)
    router.post('/customer-login',adminController.customerLogin)

    app.use('/api', router)
}