var express = require('express'),
    bodyParser = require('body-parser'),
  	app = express();
  	models = require('./models/index'),


app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({
	extended:true
}));


// tell your app to use the module
app.use(bodyParser.urlencoded())

app.get('/', function (req, res){
	var templateData ={
        messages: "Hello"
    };
	models.User.findAll().
	then(function (users){
		templateData.users = users;
	}).finally(function(){
		res.render('index', templateData)
	});
});

app.post('/signup',function (req, res){
	models.User.create({
		first_name: req.body.firstname,
		last_name: req.body.lastname,
		username: req.body.username,
		password: req.body.password
	}).then(function (user){
		res.redirect('/')
	},function (error){
		req.flash('info', error);
		res.redirect('/')
	});
});



// app.post('/carrier', function (req, res){
//     models.Carrier.create({
//         carrier_name: req.body.carrier,
//         country_code: req.body.country,
//         carrier_logo: req.body.carrierlogo
//     }).then(function (carrier){
//         res.redirect('/admin')
//     },function (error){
//         req.flash('info', error);
//         res.redirect('/admin');
//     });
// });


app.listen(3000);
