const express = require('express')
const pageController = require('../controllers/pageController')
const redirectMiddleware = require('../middlewares/redirectMiddleware')

const router = express.Router()

router.route('/').get(pageController.getIndexPage)
router.route('/about').get(pageController.getAboutPage)
router.route('/contact').get(pageController.getContactPage)
router.route('/signup').get(redirectMiddleware, pageController.getSignupPage)
router.route('/login').get(redirectMiddleware, pageController.getLoginPage)
router.route('/contact').post(pageController.sendEmail)
router.route('/:_id').put(pageController.updateAbout)

module.exports = router