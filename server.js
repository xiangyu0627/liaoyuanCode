var exoress = require('express');
var app = exoress();
var mongojs = require('mongojs');
var db = mongojs('urlList', ['urlList']);
var bodyParser = require('body-parser');

app.use(exoress.static(__dirname + '/public'));
app.use(bodyParser.json());

/**
 * Takes an URL and generates a shortened version of it
 */
function generateShortURL(originalURL) {
    return '1234';
}

/**
 * Listens to querys from front end, take input url and call generateShortURL,
 * then save the result to database, and finally return the result to front end.
 */
app.post('/getShortURL', function (req, res) { 
    var originalURL = req.body.originalURL;
    var shortURL = generateShortURL(originalURL);

    var result = {
        originalURL: originalURL,
        shortURL: shortURL
    }

    // insert to database and then responde to front end
    db.urlList.insert(result, function (err, doc) {
        res.json(doc);
    });
});

app.listen(3000);
console.log('Server running on port 3000');