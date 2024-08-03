const productController = require('../controller/product')
const auth = require('../middleware/auth.middleware')

module.exports = (app, router) => {
    // Product routes
    router.post('/add-product', auth, productController.add)
    router.get('/view-product/:id', auth,productController.view)
    router.get('/list-product', auth,productController.list)
    router.put('/edit-product/:id', auth,productController.edit)
    router.delete('/delete-product/:id', auth,productController.remove)
    router.patch('/edit-variant-status/:id', auth,productController.variantStatusUpdate)
    router.get('/product-filter', auth,productController.variantFilters)

    app.use('/api', router)
}