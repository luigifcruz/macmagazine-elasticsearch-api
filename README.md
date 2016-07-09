# macmagazine-elasticsearch-api
MacMagazine ElasticSearch API for blog posts.

### Server
API hosted at https://api.luigifreitas.me/macmagazine.

### Routes

#### GET `/macmagazine/search`

##### URL Parameters
Parameter | Type | Required | Description
--- | --- | --- | ---
`string` | String | Yes | User RAW search query.
`size` | Int | Optional | Maximum number of results.
`type` | `light` | Optional |  Load post without `content`.

##### Example
https://api.luigifreitas.me/macmagazine/search?string=Tim+Cook&size=5

##### Output
```javascript
{
  confirmation: true,
  length: 1,
  posts: [{
    title: "Awesome Post",
    link: "https://macmagazine.com.br/",
    id: 345234,
    date: "2012-12-26 21:49:52",
    content: "Hello World is a expression..."
  }]
}
```
