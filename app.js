var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"), //requiring method-override
  mongoose = require("mongoose");

//Setup
mongoose.connect("mongodb://127.0.0.1:27017/blog_app") //connect to and create a db name blog_app
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method")) //tells express to use method override which converts the a post metod in ejs to other method specified

//SCHEMA SETUP
var blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String,
  // image: { type: String, default: "/images/df.jpg" },
  created: { type: Date, default: Date.now },  //Automatically creates/generate the current date and time.
  // updated: {type: Date},
  author: String,
  remark: String, //comment area (not working)
  poster: String  //admin password authentication
})

let adminBlog = mongoose.model("adminBlog", blogSchema)  //admin's blog collections
let userBlog = mongoose.model("blog", blogSchema)  //user's blog collections
// let comment = mongoose.model("blog", blogSchema)  //not wrking

//landing Page - redirects to the index route
app.get("/", function (req, res) {
  res.redirect("/blog")
})

//====INDEX ROUTE - List or find all blogs in the db, using index.ejs file
app.get("/blog", function (req, res) {
  adminBlog.find({}, function (error, adminBlog) {
    if (error) { res.render("index") } else {
      res.render("index", { adminBlog: adminBlog })
    }
  })
})

//Another index route for the user collections (NOT NECCESSARY)
//Created so that user can make a post in differnt page other than admin page 
//(this is because of error that occures while printing the adminBlog and userBlog collections in one page)
//NOTE: Try fixing the error of printing both collection (adminBlog and userBlog) in one ejs file (ie index.ejs)
app.get("/user", function (req, res) {
  userBlog.find({}, function (error, userBlog) {
    if (error) { res.render("userIndex") } else {
      res.render("userIndex", { userBlog: userBlog })
    }
  })
})


//====NEW ROUTE - Show new blog form
app.get("/blog/new", function (req, res) {
  res.render("new")
})
//Note: both collections uses this route


//====CREATE ROUTE - Adds/create new blog collection in db
app.post("/blog", function (req, res) {
  //without validation on which collection to create and redirect
  // var blogForm = req.body.blog //Captures the name value of all the input which is blog, and assigns it to blogFprm
  // adminBlog.create(blogForm, function (error, createdBblog) {
  //   if (error) { res.render("new") } else {
  //     res.redirect("/blog")
  //   }
  // })

  //Validates which collection to create and where to redirect using the poster(password) input
  let poster = req.body.poster //Captures the value of poster (which is password) and assigns it to poster variable decleard.
  var blogForm = req.body.blog //Captures the name value of all the input which is blog, and assigns it to blogFprm

  if (poster === "pdsoft") {
    adminBlog.create(blogForm, function (error, createdBblog) {
      if (error) { res.render("new") } else {
        res.redirect("/blog")
      }
    })
  } else {
    userBlog.create(blogForm, function (error, createdBblog) {
      if (error) { res.render("new") } else {
        res.redirect("/user")
      }
    })
  }
})


//====SHOW ROUTE - Show more info about one specific blog
app.get("/blog/:id", function (req, res) {
  adminBlog.findById(req.params.id, function (error, foundBlog) {
    if (error) { res.render("show") } else {
      res.render("show", { foundBlog: foundBlog })
    }
  })
})
//Note:findById takes two arguments, i.e findById(id and callBackFunc)

//Another show route for the user show page (NOT NECCESSARY)
//Created so that user can view in differnt page other than admin page 
//(this is because of error that occures while printing the adminBlog show and userBlog show in one page)
//NOTE: Try fixing the error of printing both shows (adminBlog show and userBlog show) in one ejs file (ie show.ejs)
app.get("/user/:id", function (req, res) {
  userBlog.findById(req.params.id, function (error, foundBlog) {
    if (error) { res.render("userShow") } else {
      res.render("userShow", { foundBlog: foundBlog })
    }
  })
})


//====EDIT ROUTE - Show edit form for one blog
app.get("/blog/:id/edit", function (req, res) {
  adminBlog.findById(req.params.id, function (error, foundBlog) {
    if (error) { res.render("show") } else {
      res.render("edit", { foundBlog: foundBlog })
    }
  })
})

//Another edit route for the user edit page
//Created so that form address in the userEdit can locate userBlog collections and update since there are two different colllections
app.get("/user/:id/edit", function (req, res) {
  userBlog.findById(req.params.id, function (error, foundBlog) {
    if (error) { res.render("userShow") } else {
      res.render("userEdit", { foundBlog: foundBlog })
    }
  })
})


//====UPDATE ROUTE - Update a particular blog
app.put("/blog/:id", function (req, res) {
  adminBlog.findByIdAndUpdate(req.params.id, req.body.blog, function (error, updatedBlog) { //Takes three arguments
    if (error) { res.redirect("/blog") } else {
      res.redirect("/blog/" + req.params.id)
      // res.redirect("/blog/" + updatedBlog ) //Alternatively
    }
  })
})
//Note: findByIdAndUpdate take three arguments ie findByIdAndUpdate(id, nameValueFromTheEditForm and callBack)

//Another update route for the user update page
//Created to update the userEdit page
app.put("/user/:id", function (req, res) {
  userBlog.findByIdAndUpdate(req.params.id, req.body.blog, function (error, foundBlog) {
    if (error) { res.render("userShow") } else {
      res.redirect("/user/" + req.params.id)
      // res.redirect("/blog/" + updatedBlog ) //Alternatively
    }
  })
})


//====DESTROY ROUTE - Delete a prticular blog
app.delete("/blog/:id", function (req, res) {
  adminBlog.findByIdAndRemove(req.params.id, function (error, updatedBlog) {
    if (error) { res.redirect("/blog") } else {
      res.redirect("/blog")
    }
  })
})
//Note:findByIdAndRemove takes two arguments, i.e findByIdAndRemove(id and callBackFunc)

//Another destroy route for the userBlog
//Created to destroy the userShow page update the userEdit page
app.delete("/user/:id", function (req, res) {
  userBlog.findByIdAndRemove(req.params.id, function (error, updatedBlog) {
    if (error) { res.redirect("/user") } else {
      res.redirect("/user")
    }
  })
})


//THE ROUTES LOGIC

// 1) THE INDEX ROUTE LOGIC:
//This route list or find all blogs in the db, and renders it in an index.ejs file

// 2) THE NEW ROUTE LOGIC:
//This route shows/renders new blog form

// 3) THE CREATE ROUTE LOGIC:
//This route adds/create new blog collection in db using POST request in the new route

// 4) THE SHOW ROUTE LOGIC:
//The unique id of every blog is captured in the index.ejs page, made possible by looping through
//this unique id is passed as the href of an anchor tag, plus blog i.e href="/blog/<%=blog._id%>" where "<%=blog._id%>" is the looped id. This address goes to/is the SHOW ROUTE
//the html user interface of the anchor tag above is "Read More"
//OPERATION SYNTAX:
//when the user clicks on "Read More", it will take it to the "/blog/:id" i.e the SHOW ROUTES above.
//this unique id being clicked will be captured by findById method that determines the id using "req.params.id"
//The callback function will return the value being captured, i.e "foundBlog" and save it as "foundBlog" so it can be used in show.ejs which is being rendered to display its content.

// 5) THE EDIT ROUTE LOGIC:
//In the show.ejs an anchor tag Edit is created with the id of the blog (made possible by looping through)
//that is:  <a class="btnn" href="/blog/<%=foundBlog._id%>/edit">Edit Post</a> where "<%=foundBlog._id%>" is the id of the displayed blog
//OPERATION SYNTAX:
//When cliked by the user, it will link to "/user/:id/edit" in the express app (THE EDIT ROUTE) and render edit.ejs in the edit route
//At this time, the edit file or form is open for the user to make changes.

// 6) THE UPDATE ROUTE LOGIC:
//After making changes in the edit file/form, the user hits update button which is the submit button for the form, edit
//the action and method of the form goes to update route in the express file. (<form action="/blog/<%=foundBlog._id%>/?_method=PUT" method="POST">) 
//Note that the action method carries the unique id of the blog (<%=foundBlog._id%>) and the method is a PUT request made possible by method-overrride package installed
//method-override package is installed b/c HTML only supports a GET AND POST request of HTTP verb
//In the update route "app.put("/blog/:id", function (req, res) {..." it edit form will be updated and renders back the blog.

// 7) THE DESTROY ROUTE LOGIC:
//In the show.ejs, an empty form is created with action attributes going to the destroy route and method = DELET made possible by method-override package.
//the form action (<form action="/blog/<%=foundBlog._id%>?_method=Delete" method="POST">) has it's unique id which is "<%=foundBlog._id%>"
//By cliking "Delete button" (that is submiting the form), it goes to delete route in express file and triger the code to execute the "findByIdAndRemove" command on the id
//When this is done, that particular id is gone and the route will be redirected to the index route.





//................Listener................
app.listen(3000, function () {
  console.log("Server Listening, (Blog_App2)")
})





//=====
// 7 RESTful Routes Table

//     Name      Path              HTTP Verb   Purpose                                              Response path(that is res.something())
//====================================================================================================================================
// 1)  Index     /blogs            GET         List all blogs                                       Renders an index.ejs file
// 2)  New       /blogs/new        GET         Show new blog form                                   Renders a form called "new"
// 3)  Create    /blogs            POST        Create a new blog, the redirect somewhere            Redirects to index route(or somewhere)
// 4)  Show      /blogs/:id        GET         Show more info about ine soecific blog               Renders a show.ejs file
// 5)  Edit      /blogs/:id/edit   GET         Show edit form for one blog                          Renders an edit.ejs file
// 6)  Update    /blogs/:id        UPDATE      Updates a particular blog, the redirect somewhere    Redirects to show page using it's id obtained (ie res.redirect("/blog/" + req.params.id))
// 7)  Destroy   /blog/:id         DELETE      Delete a particular blog, then redirect somewhere    Redirects to index.ejs route (or somewhere)




//NOTE: 
//landing page "/" redirects to an index route
// 1) index route renders an index page
// 2) new route renders a form called new
// 3) create route redirects to index route
// 4) show route renders a show page
// 5) edit route renders an edit page
// 6) update route redirects to show page using its id obtained (ie res.redirect("/blog/" + req.params.id))
// 7) delete route redirects to index route

