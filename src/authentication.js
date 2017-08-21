const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const CustomStrategy = require('passport-custom');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());

  // custom passport strategy for client side social login
  app
    .passport
    .use('client-social-token', new CustomStrategy(function (req, callback) {
      // Do your custom user finding logic here, or set to false based on req object
      // callback(null, user);
      console.log(req.body);
      callback(null, false);
    }));

  // The `authentication` service is used to create a JWT. The before `create`
  // hook registers strategies that can be used to create a new valid JWT (e.g.
  // local or oauth2)
  app
    .service('authentication')
    .hooks({
      before: {
        create: [
          authentication
            .hooks
            .authenticate(config.strategies)
        ],
        remove: [
          authentication
            .hooks
            .authenticate('jwt')
        ]
      }
    });
};
