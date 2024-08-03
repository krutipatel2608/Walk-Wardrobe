const brandController = require('../controller/brand')
const auth = require('../middleware/auth.middleware')

module.exports = (app, router) => {
    router.post('/add-brand', auth,brandController.add)
    router.get('/view-brand/:id', auth,brandController.view)
    router.get('/list-brand', auth,brandController.list)
    router.put('/edit-brand/:id', auth,brandController.edit)
    router.delete('/delete-brand/:id', auth,brandController.remove)

    app.use('/api', router)
}