const sizeController = require('../controller/size')
const auth = require('../middleware/auth.middleware')

module.exports = (app, router) => {
    router.post('/add-size', auth,sizeController.add)
    router.get('/view-size/:id', auth,sizeController.view)
    router.get('/list-size', auth,sizeController.list)
    router.put('/edit-size/:id', auth,sizeController.edit)
    router.delete('/delete-size/:id', auth,sizeController.remove)

    app.use('/api', router)
}