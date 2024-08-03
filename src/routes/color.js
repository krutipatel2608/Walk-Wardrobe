const colorController = require('../controller/color')
const auth = require('../middleware/auth.middleware')

module.exports = (app, router) => {
    router.post('/add-color', auth,colorController.add)
    router.get('/view-color/:id', auth,colorController.view)
    router.get('/list-color', auth,colorController.list)
    router.put('/edit-color/:id', auth,colorController.edit)
    router.delete('/delete-color/:id', auth,colorController.remove)

    app.use('/api', router)
}