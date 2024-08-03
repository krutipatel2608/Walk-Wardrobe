const materialController = require('../controller/material')
const auth = require('../middleware/auth.middleware')

module.exports = (app, router) => {
    router.post('/add-material', auth,materialController.add)
    router.get('/view-material/:id', auth,materialController.view)
    router.get('/list-material', auth,materialController.list)
    router.put('/edit-material/:id', auth,materialController.edit)
    router.delete('/delete-brand/:id', auth,materialController.remove)

    app.use('/api', router)
}