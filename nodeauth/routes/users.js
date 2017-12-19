var express = require('express');
var router = express.Router();
var multer = require('multer'); //form data post로 전송 시 이미지 때문에 multer을 써야 함.
var upload = multer({ dest: './uploads' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/user', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('register', {
		title: 'Register'
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Login'
	});
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: 'Invalid Username or Password'
	}),
	function(req, res) {
		req.flash('success', 'You are now logged in');
		res.redirect('/');
	}
);

passport.serializeUser((user, done) => {
	// Strategy 성공 시 호출됨
	done(null, user.id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((id, done) => {
	// 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
	User.getUserById(id, (err, user) => {
		done(null, user); // 여기의 user가 req.user가 됨
	});
});

passport.use(
	new LocalStrategy((username, password, done) => {
		User.getUserByUsername(username, (err, user) => {
			if (err) throw err;
			if (!user) {
				return done(null, false, {
					message: 'Unknown User'
				});
			}

			User.comparePassword(password, user.password, (err, isMatch) => {
				if (err) return done(err);
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {
						message: 'Invalid Password'
					});
				}
			});
		});
	})
);

router.post('/register', upload.single('profileimage'), function(
	req,
	res,
	next
) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	if (req.file) {
		console.log('Uploading File...');
		var profileimage = req.file.filename;
	} else {
		console.log('No File Uploaded...');
		var profileimage = 'noimage.jpg';
	}

	//Form Validator
	req.checkBody('name', 'Name file is required').notEmpty();
	req.checkBody('email', 'Email file is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password file is required').notEmpty();
	req
		.checkBody('password2', 'Passwords do not match')
		.equals(req.body.password);

	//Check Errors
	var errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			title: 'Register',
			errors //이렇게 객체를 담아서 보내면 받는 곳에서 #{}이거 안쓰고도 받을 수 있나봐
		});
	} else {
		var newUser = new User({
			name,
			email,
			username,
			password,
			profileimage
		});

		User.createUser(newUser, (err, user) => {
			if (err) throw err;
			console.log(user);
		});

		req.flash('success', 'You are now registered and can login');

		res.location('/');
		res.redirect('/');
	}
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You are now logged out');
	res.redirect('/users/login');
});

module.exports = router;
