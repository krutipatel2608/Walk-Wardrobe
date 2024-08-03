const subcategoryController = require('../controller/subcategory')
const auth = require('../middleware/auth.middleware')

module.exports = function(app, router) {
    router.post('/subcategory-add',subcategoryController.add)
    router.get('/view-subcategory/:id',subcategoryController.view)
    router.get('/list-subcategory',subcategoryController.list)

    // category wise all subcategory
    router.get('/subcategory-by-category/:category_id',subcategoryController.subcategoryBycat)
    
    router.put('/edit-subcategory/:id',subcategoryController.edit)
    router.delete('/delete-subcategory/:id',subcategoryController.remove)

    app.use('/api', router)
}