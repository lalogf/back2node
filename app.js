var express = require('express'),
    bodyParser = require('body-parser'),
  	app = express(),
  	models = require('./models/index'),
  	methodOverride = require ('method-override'),
  	engine = require('ejs-locals');


app.set("view engine" , "ejs");
app.engine('ejs', engine);

app.use(bodyParser.urlencoded({
	extended:true
}));


// tell your app to use the module
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));

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

app.get('/edit/:id', function (req, res) {
	var userId = parseInt(req.params.id, 10);
	var templateData = {};
	models.User.findOne({
			where: {id: userId}
		}).then(function (user) {
			templateData.user = user
		}).finally(function(){
			res.render('edit.ejs',templateData)
		});
});

// app.put('/edit/:id',function (req, res) {
// 	var userId = parseInt(req.params.id, 10);
// 	var templateData = {}; 
// 	models.User.findOne(userId).then(function (user){
// 		user.updateAttributes({
// 			first_name: req.body.firstname,
// 			last_name: req.body.lastname,
// 			username: req.body.username,
// 			password: req.body.password
// 		})
// 		.success(function (){
// 			res.redirect('/');
// 		});
// 	});
// });
// app.delete('/delete/:id', function (req, res){
// 	console.log(this);
//     models.User.find(req.params.id).success(function (user){
//         user.destroy().success(function(){
//             res.redirect('/');
//         });
//     });
// });


// app.put('/edit/:id', function (req, res){
//     models.User.find(req.params.id).success(function (user){
//         user.updateAttributes({
//             first_name: req.body.firstname,
//             last_name: req.body.lastname,
//             age: req.body.age
//         }) 
//         .success(function(){
//             res.redirect("/");
//         });
//     });
// });


app.listen(3000);
