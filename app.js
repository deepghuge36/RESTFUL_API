//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);
app.route("/articles")

    .get(function (req, res) {
        Article.find(function (err, foundaritcle) {
            if (!err) {
                res.send(foundaritcle);
            }
            res.send(err);
        });
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("done no error");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("deleted");
            } else {
                res.send("not deleted");
            }
        });
    });
// only for single users/

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundarticle) {
            if (foundarticle) {
                res.send(foundarticle);
            } else {
                res.send("not found");
            }
        });
    })
    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err, result) {
                if (!err) {
                    res.send("done put");
                }
            })
    })
    .patch(function (req, res) {

        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err, result) {
                if (!err) {
                    res.send("updated article")
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err, result) {
            if (!err) {
                res.send("deletd");
            } else {
                res.send(err);
            }
        });
    });


app.listen(3000, function () {
    console.log("sever ruunning on port 3000");
});