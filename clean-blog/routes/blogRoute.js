const express = require('express')
const { body } = require('express-validator')
const blogController = require('../controllers/blogController')
const roleMiddleware = require('../middlewares/roleMiddleware')
const Blog = require('../models/Blog')

const router = express.Router()

router.route('/').post(roleMiddleware(["admin"]),blogController.createBlog )
router.route('/').get(blogController.getAllBlogs)
router.route('/:slug').get(blogController.getBlog)
router.route('/:slug').delete(blogController.deleteBlog)
router.route('/:id').put(blogController.updateBlog)
router.route('/save').post(blogController.saveBlog)
router.route('/release').post(blogController.releaseBlog)

module.exports = router