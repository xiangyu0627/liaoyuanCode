var exoress = require('express');
var app = exoress();

app.use(exoress.static(__dirname + '/public'));

app.listen(3000);
console.log('Server running on port 3000');