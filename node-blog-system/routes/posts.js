var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' });
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET posts listing. */
router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');
    posts.findOne({ _id: req.params.id }, (err, post) => {
        res.render('show', {
            post: post
        });
    });
});

/* GET posts listing. */
router.get('/add', function(req, res, next) {
    var categories = db.get('categories');
    categories.find({}, {}, (err, categories) => {
        console.log(categories);
        res.render('addpost', {
            title: 'Add Post',
            categories
        });
    });
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
    //Get Form values
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var author = req.body.author;
    var date = new Date();

    //Check Image Upload
    if (req.file) {
        var mainimage = req.file.filename;
        console.log('Yes');
    } else {
        var mainimage = 'noimage.jpg';
        console.log(mainimage);
    }

    //Form Validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();
    //CHeck Validation Errors
    var errors = req.validationErrors();

    if (errors) {
        var categories = db.get('categories');
        categories.find({}, {}, (err, categories) => {
            res.render('addpost', {
                errors,
                categories
            });
        });

    } else {
        var posts = db.get('posts');
        posts.insert(
            {
                title: title,
                body: body,
                category: category,
                date: date,
                author: author,
                mainimage: mainimage
            },
            (err, post) => {
                if (err) {
                    res.send(err);
                } else {
                    req.flash('success', 'Post Added');
                    res.location('/');
                    res.redirect('/');
                }
            }
        );
    }
});

router.post('/addcomment', function(req, res, next) {
    //Get Form values
    var postid = req.body.postid;
    var name = req.body.name;
    var body = req.body.body;
    var email = req.body.email;
    var commentDate = new Date();

    //Form Validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();
    req
        .checkBody('email', 'Email field is required but never displayed')
        .notEmpty();
    req.checkBody('email', 'Email is not formatted properly').isEmail();
    //CHeck Validation Errors
    var errors = req.validationErrors();

    if (errors) {
        var posts = db.get('posts');
        posts.findOne({ _id: postid }, (err, post) => {
            res.render('show', {
                errors: errors,
                post
            });
        });
    } else {
        var comment = {
            name,
            email,
            body,
            commentDate
        };
        var posts=db.get('posts');
        posts.update({
            "_id": postid
        }, {
            $push:{
                "comments": comment
            }
        }, (err, doc)=>{
            if(err){
                throw err;
            }else{
                req.flash('success', 'Comment Added');
                res.location('/posts/show/'+postid);
                res.redirect('/posts/show/'+postid)
            }
        })
    }
});
module.exports = router;