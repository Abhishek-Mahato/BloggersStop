const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const homeStartingContent = "Embrace the power of words, for as a blogger, you wield the ability to inspire, inform, and ignite change in the hearts and minds of your readers. Each post is a brushstroke on the canvas of thought, creating a masterpiece of ideas and perspectives. So, let your passion flow, your creativity soar, and your voice resonate, for the world eagerly awaits the symphony of your words.";
const aboutContent = "Welcome to our vibrant blogging website, where diverse voices unite to share travel tales, thought-provoking discussions, emotional poetry, and informative articles. Connect with like-minded individuals, engage in meaningful conversations, and build friendships that transcend borders. Unleash your creativity and let your imagination take flight as we weave a tapestry of inspiring stories that uplift hearts and minds, leaving a lasting impact on those who read them. Join our community and be a part of a place where words hold the power to change lives and shape a better tomorrow.";
const contactContent = "If any query just drop your review and question in the Message box we will surely reach out to you to help u with the queries";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://mahato:mahato@cluster.p44dpiq.mongodb.net/blogDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    if (err) {
      console.error("Error fetching posts:", err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    }
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
    .then(() => res.redirect("/"))
    .catch(err => console.error("Error saving post:", err));
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    if (err) {
      console.error("Error fetching post:", err);
    } else {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

// Create a MongoDB schema for the contact form data
const contactSchema = {
  name: String,
  email: String,
  message: String,
};

const Contact = mongoose.model("Contact", contactSchema);

// Routes
app.get("/contact", function (req, res) {
  res.render("contact");
});

app.post("/contact", function (req, res) {
  const newContact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });

  newContact.save(function (err) {
    if (err) {
      console.error("Error saving contact:", err);
    } else {
      console.log("Contact saved successfully.");
      res.redirect("/");
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
