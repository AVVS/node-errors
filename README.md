# Node Errors

Extended Node.JS Error classes, allowing you to easily handle common errors in a
web application. Predefined error messages and codes will save you some time
and boilerplate code.

Furthermore, it contains a common error handler middleware, which complements
forming responses based on the errors that had been passed

## Error types

Name          | Message         | Code          | Payload        | Signature
------------- | -------------   | ------------- | -------------- | ------------
Common        | null            | 400           | null           | `message`, `code`
Auth          | Not authorized  | 401           | null           | `message`
Forbidden     | Forbidden       | 403           | null           | `message`
NotFound      | Not Found       | 404           | null           | `message`
BadRequest    | Bad Request     | 400           | null           | `payload`
Uninitialized | Uninitialized   | 500           | null           |
Internal      | Internal Server Error | 500     | null           | `message`

## Usage

One of the many usage cases

```js
var Errors = require('node-errors');
var express = require('express');
var app = express();


var router = express.Router();

// custom router, for now it's in the same file, but it's more
// and more common to have components-based web servers, so let's keep it
// that way
router
  .post('/register', function (req, res, next) {
    var body = req.body;
    var username = body.username;
    var password = body.password;

    if (!username) {
      return next(new Errors.BadRequest('missing.username'));
    }

    if (!password) {
      return next(new Errors.BadRequest('missing.password'));
    }

    if (password.length < 10) {
      return next(new Errors.BadRequest('password.small'));
    }

    // etc, we can do various check, you get the idea

    res.send('OK');

  });


app.use(router);
app.use(Errors.commonErrorHandler);

```

