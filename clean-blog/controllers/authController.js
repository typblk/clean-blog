const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const Blog = require('../models/Blog')
const Category = require('../models/Category')
const User = require('../models/User')
const About = require('../models/About')


exports.createUser = async (req, res) => {

    try {
        const user = await User.create(req.body)
        res.status(200).redirect('/login')
    } catch (error) {
        const errors = validationResult(req)
        console.log(errors)
        console.log(errors.array()[0].msg)

        for (let i=0; i< errors.array().length; i++) {
            req.flash("error", `${errors.array()[i].msg}`)
        }
        
        res.status(400).redirect('/signup')
    }
}

exports.loginUser = async (req, res) => {

    try {
        const {username, password}  = req.body
        const user = await User.findOne({username})
            if(user) {
                bcrypt.compare(password, user.password, (err, same) => {
                   
                    if (same) {
                        req.session.userID = user._id
                    res.status(200).redirect('/users/dashboard')
                    } else {
                        
                        req.flash("error", `Your password is not correct!`)
                        res.status(400).redirect('/login')
                    }
                })
            } else {
                req.flash("error", `User is not exist!`)
                res.status(400).redirect('/login')
            }
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
    
}

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({_id:req.session.userID}).populate('blogs')
    const categories = await Category.find()
    const blogs = await Blog.find({user:req.session.userID})
    const users = await User.find()
    const abouts = await About.find()
    res.status(200).render('Dashboard', {
        title: "Dashboard",
        user,
        categories,
        blogs,
        users,
        abouts
    })
}

exports.deleteUser = async (req, res) => {

    try{

      await User.findByIdAndRemove(req.params.id)
      await Blog.deleteMany({user:req.params.id})

      req.flash("error", `User has been removed successfully`)

      res.status(200).redirect('/users/dashboard')
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
}

