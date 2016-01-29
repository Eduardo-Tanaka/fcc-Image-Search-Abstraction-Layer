var express = require('express');
var router = express.Router();
var request = require('request');
var Search = require('../model/model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/search/:q', function(req, res){
	var start = req.query.offset ? req.query.offset * 10 : 1;
	var url = 'https://www.googleapis.com/customsearch/v1?key=' +
        process.env.GOOGLE_API_KEY + '&cx=' + process.env.GOOGLE_CSE_KEY +
        '&searchType=image&q=' + req.params.q + '&start=' + start +
        '&fields=items(image%2FthumbnailLink%2Clink%2Csnippet)';

    request.get(url, { json: true }, function(error, response, body) {
        if (error) {
            throw error;
        } else {
        	var newSearch = {
        		term: req.params.q,
        		when: new Date
        	};
        	Search.create(newSearch, function(err){
        		if (err)
        			res.json(err);
        	});
            var results = [];
            if(body.items != undefined) {
            	for(var i = 0, len = body.items.length; i < len; i++) {
            		results.push({
	                	"image": body.items[i].image.thumbnailLink,
	                    "snippet": body.items[i].snippet,
	                    "page": body.items[i].link
                	});
            	} 
            }
            res.json(results);
        }
    });
});

router.get('/latestsearch', function(req, res){
	Search.find({}, function(err, searches){
		res.json(searches);
	});
});

module.exports = router;
