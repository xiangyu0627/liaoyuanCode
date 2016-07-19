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
function generateShortURL(originalURL, flag, shortURL, callback) {
    var urlChar = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1',
        '2', '3', '4', '5', '6', '7', '8', '9'];
    var result = '';
    if (flag === 0) {
        for (var i = 0; i < 5; i++) {
            var ascii = originalURL.charCodeAt(originalURL.length - 1 - i);
            result += urlChar[ascii % 36];
        }
    } else {
        var randomNum = Math.floor((Math.random() * 35));
        var randomIndex = Math.floor((Math.random() * 3 + 1));
        result = shortURL.substring(0, randomIndex) + urlChar[randomNum] + shortURL.substring(randomIndex + 1);
    }
    
    db.urlList.findOne({ shortURL: result }, function (err, doc) {
        if (doc) {
            generateShortURL(originalURL, 1, result, callback);
        } else {
            callback(result);
        }
    });
}

/**
 * Search database for shortURL, returns true if database already has the same url,
 * returns false if it doesn't.
 */
function containsShortURL(shortURL) {
    db.urlList.findOne({ shortURL: shortURL }, function (err, doc) {
        if (doc) {         
            return true;
        } else {
            return false;
        }
    });
}

/**
 * Listens to querys from front end, take input url and call generateShortURL,
 * then save the result to database, and finally return the result to front end.
 */
app.post('/getShortURL', function (req, res) { 
    var originalURL = req.body.originalURL;
    if (originalURL.length < 5) {
        res.status(404).send('Invalid Url');
    }
    // Search database for originalURL
    db.urlList.findOne({ originalURL: originalURL }, function (err, doc) {
        // return the shortURL if originalURL exists in database already 
        if (doc) {
            var result = {
                originalURL: originalURL,
                shortURL: doc.shortURL
            }
            res.json(result);
            
        } else {
            // Generate initial shortURL
            generateShortURL(originalURL, 0, '', function (shortURL) {
                var result = {
                    originalURL: originalURL,
                    shortURL: shortURL
                }

                // Insert to database and then responde to front end
                db.urlList.insert(result, function (err, doc) {
                    res.json(doc);
                });
            }); 
        }
    });

    /**
     * Listens to querys from front end, take short url and redirect to originalURL
     */
    app.post('/redirect', function (req, res) {
        console.log(req.body.shortURL);
        db.urlList.findOne({ shortURL: req.body.shortURL }, function (err, doc) {
            console.log(doc);
            res.json(doc);
        });
    });
    
});

app.listen(3000);
console.log('Server running on port 3000');