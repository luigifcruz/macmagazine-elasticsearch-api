# macmagazine-elasticsearch-api
MacMagazine ElasticSearch API for blog posts.

### Installation

  npm install moodle-scraper
  
### Routes

#### GET `/api/elasticsearch/:query`

##### Variables
`:query` User RAW search query.

##### Output
```javascript
[{
  title: "Hello World",
  author: "Me",
  date: 1466512415348,
  text: "Hello World is a expression...",
  url: "https://macmagazine.com.br/awesomepost",
  thumb: "https://macmagazine.com.br/awesomephoto.jpg" // Optional
}, ...]
```



