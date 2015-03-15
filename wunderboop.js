'use strict';
  
  var REDIRECT_URI = "http://localhost:3000/authorized";
  var CLIENT_ID = "7d179a4fd3ac31f9b3aa";
  var CLIENT_SECRET = "31d61d2c127e76da152fc25cac3ad226d3171e0bac54fc0c3c3740706743";

if (Meteor.isClient) {

Router.route('/', function() {
  this.render('home');
});

  Router.route('/authorized', function () {
    // this.render('auth', {
    // data: function () {
    //   return this.params.query.code;
    // }});
    Meteor.call("authorizeWunderlist", this.params.query.code, function(error, results) {
          Session.set("access_token", results.data.access_token);
          console.log(Session.get("access_token"));
          Router.go("/");
        });
    //this.next();
  });
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.auth.created = function (){
    console.log(this);
    // authorize: function () {
    //   return 
      Meteor.call("authorizeWunderlist", this.data, function(error, results) {
        console.log(results);
        Session.set("access_token", results.data.access_token);
        Session.get("access_token");
        Router.redirect("/");
      });
      return "";
    //}
  };

  Template.home.helpers({
    isAuthorized: function() {
      if (Session.get("access_token"))
        return Session.get("access_token");
    },
    allLists: function () {

      var lists = Meteor.subscribe('allLists', Session.get("access_token"));
      console.log(lists);
      return lists.ready();
      var lists = null;
      Meteor.call("getAllLists", Session.get("access_token"), function (err, response){
        lists = response;
        console.log(lists);
        return lists;
      });
    }
  });

  Template.home.events({
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
  Meteor.publish("allLists", function (access_token) {
    var response = HTTP.call("GET", "http://a.wunderlist.com/api/v1/lists", {
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": CLIENT_ID
      }
    });
    return response.data;
  });

  Meteor.methods({
    authorizeWunderlist: function (code) {
      check(code, String);
      console.log(code);
      return HTTP.call("POST", "https://www.wunderlist.com/oauth/access_token", 
        {params: 
          {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code
          }
        });
    },
  });
}
