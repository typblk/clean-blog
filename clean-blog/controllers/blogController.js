const Blog = require('../models/Blog')
const User = require('../models/User')
const About = require('../models/About')
const Category = require('../models/Category')
const fs = require('fs')
const fileupload = require('express-fileupload')

exports.createBlog = async (req, res) => {
 try{
  const uploadDir = 'public/images'
  if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }
  let uploadImage = req.files.image
  let uploadPath = __dirname + '/../public/images/' + uploadImage.name
  uploadImage.mv(uploadPath,
    async () => {
      await Blog.create({
        user: req.session.userID,
        ...req.body,
        image: '/images/' + uploadImage.name 
      })
      req.flash("success", `Blog has been create successfully`)
      res.status(200).redirect('/users/dashboard')
    })
 }catch {
    req.flash("error", `Saved happened!`)
    res.status(200).redirect('/users/dashboard')
 }
}


exports.getAllBlogs = async (req, res) => {

    try {
      const page = req.query.page || 1
      const blogsPerPage = 5

      const totalBlogs = await Blog.find().countDocuments()

      const categorySlug = req.query.categories
      const query = req.query.search
      const category = await Category.findOne({slug:categorySlug})
      let filter = {}
      if (categorySlug) {
        filter = {category:category._id}
      }

      if (query) {
        filter = {name:query}
      }

      if (!query && !categorySlug) {
        filter.name = "",
        filter.category = null
      }

    
      const blogs = await Blog.find({}).sort('-createdAt').populate('user')

      const categories = await Category.find()
      
    const abouts = await About.find()
  
      res.status(200).render('blogs', {
        blogs,
        abouts,
        categories,
        title: 'Blogs',
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

  exports.getBlog = async (req, res) => {

    try {
      const blog = await Blog.findOne({slug: req.params.slug}).populate('user')
      const user = await User.findById(req.session.userID) 
  
      res.status(200).render('post', {
        blog,
        user
      })
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

  exports.saveBlog = async (req, res) => {

    try {
      const user = await User.findById(req.session.userID)
      await user.blogs.push({_id:req.body.blog_id})
      await user.save()
  
      res.status(200).redirect('/users/dashboard')
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

  exports.releaseBlog = async (req, res) => {

    try {
      const user = await User.findById(req.session.userID)
      await user.blogs.pull({_id:req.body.blog_id})
      await user.save()
  
      res.status(200).redirect('/users/dashboard')
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

  exports.deleteBlog = async (req, res) => {

    try{

      const blog = await Blog.findOne({ slug: req.params.slug });
      const countimage = await Blog.count({ image: blog.image })
      let deletedImage = __dirname + '/../public' + blog.image;
      if (countimage < 2) {
        fs.unlinkSync(deletedImage);
      }

      await Blog.findOneAndRemove({slug:req.params.slug})

      req.flash("error", `Blog has been removed successfully`)

      res.status(200).redirect('/users/dashboard')
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

  exports.updateBlog = async (req, res, next) => {
    try{
      let uploadImage = req.files.image
        let uploadPath = __dirname + '/../public/images/' + uploadImage.name
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('No files were uploaded.');
        }
        uploadImage.mv(uploadPath,async () => {
          await Blog.findOneAndUpdate({
            ...req.body,
            image:'/images/' + uploadImage.name
          })
        })
      const blogs = await Blog.findOne({ id: req.params.id });
      blogs.name= req.body.name
      blogs.description= req.body.description
      blogs.slogan= req.body.slogan
      blogs.image = req.file
      blogs.save()
      
      req.flash("success", `Blog has been update successfully`)
      res.status(200).redirect('/users/dashboard')
      
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };