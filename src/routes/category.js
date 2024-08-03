const categoryController = require('../controller/category')
const auth = require('../middleware/auth.middleware')

module.exports = function(app, router) {
    router.post('/add',categoryController.add)
    router.get('/view-category/:id',categoryController.view)
    router.get('/list-category',categoryController.list)
    router.put('/edit-category/:id',categoryController.edit)
    router.delete('/delete-category/:id',categoryController.remove)

    app.use('/api', router)
}