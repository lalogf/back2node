var express = require('express'),
    bodyParser = require('body-parser'),
  	app = express(),
  	models = require('./models/index'),
  	methodOverride = require ('method-override'),
  	engine = require('ejs-locals'),
  	pg = require('pg'),
  	port = process.env.PORT || 3000;


app.set("view engine" , "ejs");
app.engine('ejs', engine);


app.use(bodyParser.urlencoded({
	extended:true
}));


var passport = require("passport"),
    localStrategy = require("passport-local").Strategy,
    flash = require('connect-flash'),
    session = require("cookie-session");
    bcrypt = require('bcrypt')

app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  maxage: 3600000
  })
);

app.use(session({
  keys:['key']
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// passport.deserializeUser(function(id, done){
//     models.User.find({
//         where: {
//             id: id
//         }
//     }).done(function(error,user){
//         done(error, user);
//     });
// });


passport.deserializeUser(function(obj, done) {
  done(null, false);  // invalidates the existing login session.
});




// tell your app to use the module
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));


app.get('/', function (req, res){
	var templateData ={
        message: "",
    };
    if(req.isAuthenticated()){
    	models.User.findAll().
	then(function (users){
		templateData.users = users;
	}).finally(function(){
		templateData.isAuthenticated = req.isAuthenticated();
		templateData.userInfo= req.user;
		res.render('index', templateData)
	});
    } else {
    	templateData.isAuthenticated = false;
    	res.render('index.ejs',templateData)
    }
});

app.post('/signup', function (req, res){
	models.User.createNewUser({
		first_name: req.body.firstname,
		last_name: req.body.lastname,
		username: req.body.username,
		password: req.body.password
	});
	res.redirect('/success');
	
	
	// ,
	// function (error){
	// 	req.flash('info', error);
	// 	res.redirect('/')
	// };
});

app.get('/edit/:id', function (req, res) {
	var templateData = {};
	models.User.findOne({
			where: {id: req.params.id}
		}).then(function (user) {
			templateData.user = user
		}).finally(function(){
			res.render('edit.ejs',templateData)
		});
});


app.put('/edit/:id',function (req, res) {
	var templateData = {}; 
	models.User.findOne({
		where : {id: req.params.id}
	}).then(function (user){
		user.updateAttributes({
			first_name: req.body.firstname,
			last_name: req.body.lastname,
			username: req.body.username,
			password: req.body.password
		})
		.then(function(){
			res.redirect('/');
		});
	});
});



app.delete('/delete/:id', function (req, res){
    models.User.findOne({
    	where: {id: req.params.id}
    }).then(function (user){
        user.destroy().then(function(){
            res.redirect('/');
        });
    });
});


//	Set up login POST route to be handled thorugh Passport 
app.get('/login', function (req, res){
	res.render('login.ejs', {message: req.flash('loginMessage')})
});

app.post('/login', passport.authenticate('local', {
	successRedirect: "/",
	failureRedirect: "/login"
}));

app.get('/success', function (req, res){
	res.render('success.ejs')
});

app.get("/logout", function (req, res){
	req.logout();
	res.redirect("/")
});

app.listen(port);
console.log('The magic happens on port ' + port)
