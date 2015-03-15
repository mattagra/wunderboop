
if (Meteor.isClient) {

  Router.route('/', function () {
  // render the Home template with a custom data context
  this.render('hello');
});

  Router.route('/authorized', function () {
    this.render('auth', {
    data: function () {
      return this.params.query.code;
    }});
  });
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.auth.helpers({
    authorize: function () {
      console.log(this);
      Meteor.call("authorizeWunderlist", this.toString(), function(error, results) {
        Session.set("access_token", results.data.access_token);
        window.location.replace("/");
      });
    }
  });

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.authorizeWunderlist.helpers({
    isAuthorized: function() {
      if (Session.get("access_token"))
        return Session.get("access_token");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

    var REDIRECT_URI = "http://localhost:3000/authorized";
  Template.authorizeWunderlist.events({
    'click button': function () {
      // increment the counter when button is clicked
      window.location.replace("https://www.wunderlist.com/oauth/authorize?client_id=7d179a4fd3ac31f9b3aa&redirect_uri=" + REDIRECT_URI + "&state=RANDOM", '_blank');
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.methods({
    authorizeWunderlist: function (code) {
      check(code, String);
      return HTTP.call("POST", "https://www.wunderlist.com/oauth/access_token", 
        {params: 
          {
            client_id: "7d179a4fd3ac31f9b3aa",
            client_secret: "31d61d2c127e76da152fc25cac3ad226d3171e0bac54fc0c3c3740706743",
            code: code
          }
        });
    },
    getWunderlist: function () {
      this.unblock();
      return Meteor.http.call("GET", "link");
    }
  });
}
