//jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//DATABASE PART

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});

const postSchema = mongoose.Schema({
	title: String,
	content: String
});

const pageContentSchema = mongoose.Schema({
	name: String,
	content: String
});

const Post = mongoose.model("Post", postSchema);
const PageContent = mongoose.model("pageContent", pageContentSchema);


const homeStartingContent = new PageContent({
	name: "home",
	content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."

});

// const aboutContent = new PageContent({
// 	name: "about",
// 	content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
// });

// const contactContent = new PageContent({
// 	name: "contact",
// 	content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
// });

// PageContent.insertMany([homeStartingContent, aboutContent, contactContent], (err) => {
// 	if (err) {console.log(err);}
// });



app.get("/", (req, res) => {


	Post.find({}, (err, foundPosts) => {

		if (!err) {
		// 	//render
			res.render("home", {
			homeContent: homeStartingContent.content, 
			posts: foundPosts,
			
			});

		} else {
			console.log(err);
		}
	});

});

app.get("/contact", function (req, res) {

	PageContent.findOne({name: "contact"}, (err, foundContent) => {
		if (!err) {
			res.render("contact", {contactPage : foundContent.content});
		}
	});
	
});

app.get("/about", (req, res) => {
	
	PageContent.findOne({name: "about"}, (err, foundContent) => {
		if (!err) {
			res.render("about", {aboutPage: foundContent.content});
		} else {
			console.log(err);
		}
	});
});

app.get("/compose", function (req, res) {
	res.render("compose");
	
});

app.get("*/posts/:postName", function (req, res) {

	 //using lodash to lower case the first letter.
	const postNameParams = _.lowerCase(req.params.postName); //using lodash "_." to replace the "-" by a " " white  space. 


	Post.find({}, (err, foundPosts) => {
		if(!err) {
			// render
			foundPosts.forEach(post => {
				const lastPostsElement = _.lowerCase(post.title);
				if (postNameParams === lastPostsElement) {
					res.render("post", {
						title: post.title,
						content: post.content
					});

				} 
			
			});
			

		} else {
			console.log(err);
		}
	});

	// foundPosts.forEach(function (post) {
	// 	

	// 	
	// 		res.render("post", {
	// 			title: post.titleContent,
	// 			content: post.postContent
	// 		});
	// 	}
});



app.post("/compose", function (req, res) {
	
	const post = new Post ({
		title : req.body.titleCompose,
		content : req.body.textCompose
	});

	post.save();

	
	res.redirect("/");	

});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
