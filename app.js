var express             = require("express"),
    app                 = express(),
    expressSanitizer    = require("express-sanitizer"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override")
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

//MONGOOSE/ MODEL CONGIF
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: 
            {
                type : Date, 
                default : Date.now()
            }
});
var Blog = mongoose.model("Blog" , blogSchema);

//ROUTES

//ROOT ROUTE
app.get("/" , function(req, res) {
    res.redirect("/blogs");
});

//INDEX
app.get("/blogs",function(req , res){
    Blog.find({},function(err , blogs){
        if (err) {
            console.log("Something went wrong with the search! :(");
        } else {
            res.render("index" , {blogs : blogs});
        }    
    });
    
});

//SUBMIT BLOG ROUTE
app.post("/blogs" , function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog , function(err , newBlog){
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});



//NEW ROUTE
app.get("/blogs/new" , function(req, res) {
    res.render("new");
});

//SHOW ROUTE
app.get("/blogs/:id" , function(req, res) {
    Blog.findById(req.params.id , function(err , foundBlog){
        if (err) {
            res.redirect("/blogs");
            console.log("ERROR RETRIEVING THE FILE!");        
        } else {
            console.log(foundBlog.title);        
            res.render("show" , {blog:foundBlog});    
        }
        
    });
    
});

app.get("/blogs/:id/edit" , function(req, res) {
     Blog.findById(req.params.id , function(err , editBlog){
        if (err) {
            res.redirect("/blogs");
            console.log("ERROR RETRIEVING THE FILE!");        
        } else {
            console.log(editBlog.title);        
            res.render("edit" , {blog:editBlog});    
        }
        
    });
});

app.put("/blogs/:id" , function(req , res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updatedBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

app.delete("/blogs/:id" , function(req, res){
    Blog.findByIdAndRemove(req.params.id , function(err){
        if (err) {
            res.send("Unable to delete, please try again.");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The express server has started!");
});