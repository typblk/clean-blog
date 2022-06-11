const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const fileupload = require('express-fileupload')
const pageRoute = require('./routes/pageRoute')
const blogRoute = require('./routes/blogRoute')
const categoryRoute = require('./routes/categoryRoute')
const userRoute = require('./routes/userRoute')

const app = express()

//connect db
mongoose.connect('mongodb+srv://typblk:Tayyip1507@cluster0.02qdc.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connected successfuly')
})

//template engine
app.set("view engine", "ejs")

//global variable
global.userIN = null

//middlewares
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(fileupload())
app.use(session({
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://typblk:Tayyip1507@cluster0.02qdc.mongodb.net/Cluster0?retryWrites=true&w=majority'})
}))
app.use(flash())
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash()
    next()
})
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}))

//routes
app.use('*', (req, res, next) => {
    userIN = req.session.userID
    next()
})
app.use('/', pageRoute)
app.use('/blogs', blogRoute)
app.use('/categories', categoryRoute)
app.use('/users', userRoute)

const port = 3000
app.listen(port, () => {
    console.log('App started on port 3000')
})