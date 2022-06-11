const nodemailer = require('nodemailer')
const Blog = require('../models/Blog')
const User = require('../models/User')
const About = require('../models/About')
const fileupload = require('express-fileupload')

exports.getIndexPage = async (req, res) => {
    const blogs = await Blog.find().sort('-createdAt').limit(3)
    const abouts = await About.find()
    const user = await User.findById(req.session.userID)
    res.status(200).render('index', {
        title: "Home",
        blogs,
        user,
        abouts
    })
}

exports.getAboutPage = async (req, res) => {
    const abouts = await About.find()
    res.status(200).render('about', {
        title: "About",
        abouts
    })
}

exports.getBlogsPage = (req, res) => {
    res.status(200).render('blogs', {
        title: "Blog"
    })
}

exports.getContactPage = (req, res) => {
    res.status(200).render('contact', {
        title: "Contact"
    })
}

exports.getSignupPage = (req, res) => {
    res.status(200).render('signup', {
        title: "Sign Up"
    })
}

exports.getLoginPage = (req, res) => {
    res.status(200).render('login', {
        title: "Login"
    })
}

exports.sendEmail = async (req, res) => {

    try{
        const outputMessage = `
    <h1>Message Details </h1>
    <ul>
       <li> name: ${req.body.name} </li>
       <li> email: ${req.body.email} </li>
    </ul>
    <h1>Message</h1>
    <p> ${req.body.message} </p>
    `

        let transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "tayyipboluk209@gmail.com", // generated ethereal user
                pass: "lnegggtzdjxqafwo", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Clean Blog Contact Form" <tayyipboluk209@gmail.com>', // sender address
            to: "typblk1903@gmail.com", // list of receivers
            subject: "Clean Blog Contact Form Message ✔", // Subject line

            html: outputMessage, // html body
        });


        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        req.flash("success", "We received your message succesfully")

        res.status(200).redirect('contact')
    } catch {
        req.flash("error", "Something happened!")
        res.status(200).redirect('contact')
    } 
}

exports.updateAbout = async (req, res) => {

    try{
        let uploadImage = req.files.image
        let uploadPath = __dirname + '/../public/images/' + uploadImage.name
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('No files were uploaded.');
        }
        uploadImage.mv(uploadPath,async () => {
          await About.findOneAndUpdate({
            ...req.body,
            image:'/images/' + uploadImage.name
          })
        })
      const abouts = await About.findOne({ id: req.params.id });
      abouts.name= req.body.name
      abouts.description= req.body.description
      abouts.slogan= req.body.slogan
      abouts.image = req.file
      abouts.save()

      req.flash("success", `About has been update successfully`)

      res.status(200).redirect('/users/dashboard')
        
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

