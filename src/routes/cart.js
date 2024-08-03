const cartController = require('../controller/cart')
const auth = require('../middleware/auth.middleware')

module.exports = function(app, router) {
    router.post('/add',cartController.add)
    router.get('/view-cart/:user_id',cartController.view)
    router.put('/edit-cart',cartController.removeCartItems)
    // router.put('/edit-category/:id',categoryController.edit)
    // router.delete('/delete-category/:id',categoryController.remove)

    app.use('/api', router)
}