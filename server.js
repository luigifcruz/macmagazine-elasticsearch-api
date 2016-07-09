"use strict";
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const konfig = require('konfig')({ path: './' });
const elasticsearch = require('elasticsearch');
const superagent = require("superagent");

var app = express();
var server = http.createServer(app).listen(konfig.app.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var client = new elasticsearch.Client({
  host: `localhost:${konfig.app.elasticsearch}`
});

app.get('/search', function(req, res) {
  client.search({
    q: req.query.string,
    size: req.query.size || -1
  }).then(function (body) {
    const posts = humanize(body.hits.hits, req.query.type);
    let response = {
      confirmation: true,
      length: posts.length,
      posts
    }
    res.send(response);
  }, function (error) {
    let response = {
      confirmation: false,
      length: 0,
      posts: []
    }
    res.send(response);
  });
});

app.get('/new', function(req, res) {
  superagent
    .get(`https://macmagazine.com.br/wp-json/wp/v2/posts/${req.query.id}`)
    .end(function(err, post){
      var virtualPost = {
        title: post.body["title"]["rendered"],
        link: post.body["guid"]["rendered"],
        id: post.body["id"],
        date: post.body["date_gmt"],
        content: post.body["excerpt"]["rendered"]
      }

      client.create({
        index: "posts",
        type: "post",
        id: post.body["id"],
        body: virtualPost
      }, (error, response) => {
        if (error) {
          res.send({ confirmation: false, error: error.displayName });
          return;
        } else {
          res.send({ confirmation: true });
        }
      });
    });
});

function humanize(posts, type) {
  let results = [];
  posts.map((post) => {
    if (type == "light") {
      delete post._source["content"];
    }
    results.push(post._source);
  });
  return results;
}

console.log(`Server is up and running...`);
console.log(`   Port:    ${konfig.app.port}`);
console.log(`   Elastic: ${konfig.app.elasticsearch}`);
