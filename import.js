"use strict";
const fs = require('fs');
const xml2js = require('xml2js');
const htmlToText = require('html-to-text');
const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({ host: 'localhost:9200' });
const parser = new xml2js.Parser();

console.log(`Reading Started...`);

fs.readFile(__dirname + '/import/2016.xml', (err, data) => {
  parser.parseString(data, (err, result) => {
    console.log(`Cloning ${result.rss.channel[0]['item'].length} posts on Elasticsearch.`);
    result.rss.channel[0]['item'].forEach((post) => {
      const id = post['wp:post_id'][0];

      var virtualPost = {
        title: post.title[0],
        link: post.link[0],
        id,
        date: post['wp:post_date_gmt'][0],
        content: htmlToText.fromString(post['content:encoded'])
      }

      client.create({
        index: "posts",
        type: "post",
        id: id,
        body: virtualPost
      }, function(error, response) {
        if (error) {
          console.log("FAILED " + id + " " + error.displayName);
          return;
        } else {
          console.log("ADDED " + id);
        }
      });
    })
  });
});
