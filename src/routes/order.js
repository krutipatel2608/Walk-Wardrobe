const orderDetailsController = require('../controller/order-details')
const auth = require('../middleware/auth.middleware')

module.exports = (app, router) => {
    router.post('/add-order', auth,orderDetailsController.add)
    router.post('/add-order-details', auth,orderDetailsController.addOrder)
    router.get('/view-order/:orderId', auth,orderDetailsController.view)
    router.get('/view-payment-status/:razorpayOrderId', auth,orderDetailsController.viewPaymentStatus)
    router.get('/list-order', auth,orderDetailsController.list)
    // router.put('/edit-material/:id', auth,materialController.edit)
    // router.delete('/delete-brand/:id', auth,materialController.remove)
    router.post('/payment/webhook',orderDetailsController.paymentCapture)

    app.use('/api', router)
}