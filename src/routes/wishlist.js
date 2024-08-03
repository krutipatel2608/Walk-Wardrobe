const weishListController = require('../controller/wishlist')
const auth = require('../middleware/auth.middleware')

module.exports = function(app, router) {
    router.post('/wishlist-add',auth,weishListController.add)
    // router.get('/view-staff/:id',auth ,staffController.view)
    router.get('/wishlist/:user_id',auth ,weishListController.list)
    // router.put('/edit-staff/:id',auth,staffController.edit)
    // router.put('/change-password',auth,staffController.changePassword)
    // router.delete('/delete-staff/:id',auth,staffController.remove)

    app.use('/api', router)
}