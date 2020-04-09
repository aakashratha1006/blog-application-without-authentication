var express = require('express');
var app = express();
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

//app config
mongoose.connect("mongodb://localhost/blog_app");
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Title
//Image
//body
//Created

//moongoose/model config

var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created : {type : Date, default : Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

/*Blog.create({
    title : "Test Blog",
    image : "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
    body  : "HELLO!! THIS IS A BLOG POST"
}); */

//Restful Routes

app.get('/',function(req, res){
    res.redirect('/blogs');
});

// INDEX ROUTE

app.get('/blogs',function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log("ERROR!!");
        }
        else{
            res.render('index',{blogs : blogs});
        }
    });
});

// NEW ROUTE

app.get('/blogs/new',function(req, res){
    res.render('new');
});

// CREATE ROUTE

app.post('/blogs',function(req, res){
    // CREATE BLOG
    Blog.create(req.body.blog,function(err, newBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/blogs');
        }
    });
});

// SHOW ROUTE

app.get('/blogs/:id',function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render('show',{blog:foundBlog});
        }
    });
});

// EDIT ROUTE

app.get('/blogs/edit/:id',function(req, res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render('edit',{blog : foundBlog});
        }
    });
});

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,UpdatedBlog){
        if(err){
            console.log(err);
            res.redirect('/blogs');
        }        
        else{
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// DELETE ROUTE

app.delete('/blogs/:id',function(req,res){
    
    //DESTROY BLOG AND REDIRECT SOMEWHERE

    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs');
        }
});

});

app.listen(3000,function(){
    console.log("Server is Running");    
});