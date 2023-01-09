const path = require("path");
const express = require("express");
const app = express();
const pug = require("pug");
const session = require('express-session');

//Importing Router for webServer
const router = require("./router");
const userRouter = require('./user_router');

//Settings for express
app.set("port",process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use( session( {
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static('src/public'));

// Routes
app.use("/", router);
app.use('/users', userRouter);

app.listen(app.get("port"), () =>{
    console.log('*******************************************************************');
    console.log('*   Servidor web online en puerto: ', app.get("port"));
    console.log("*   Ingresar 'localhost:"+ app.get("port") + "' en el navegador web.");
    console.log('*******************************************************************');
});