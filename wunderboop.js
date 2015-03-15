'use strict';
  
var REDIRECT_URI = "http://localhost:3000/authorized";

if (Meteor.isClient) {

  Router.route('/', function() {
    this.render('home');
  });

  Router.route('/list/:list_id', function() {
    Session.set("list_id", this.params.list_id);
    this.render('list');
  });

  Router.route('/authorized', function () {
    // this.render('auth', {
    // data: function () {
    //   return this.params.query.code;
    // }});
    Meteor.call("authorizeWunderlist", this.params.query.code, function(error, results) {
          Session.set("access_token", results.data.access_token);
          Router.go("/");
        });
    //this.next();
  });
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.home.helpers({
    isAuthorized: function() {
      if (Session.get("access_token"))
        return Session.get("access_token");
    },
  });

  Template.lists.helpers({
    allLists: function () {
      if (!Session.get("allLists")) {
        Meteor.call("getAllLists", Session.get("access_token"), function(err, response) {
          if (response) {
            Session.set("allLists", response)
          }
        });
      } else {
        return Session.get("allLists");
      }
    }
  });

  Template.list.helpers({
    tasks: function () {
      console.log(Session.get("list_id"));
      var list_id = +Session.get("list_id");
      if (!Session.get(list_id + "_tasks")) {
        Meteor.call("getTasks", list_id, Session.get("access_token"), function(err, response) {
          if (response) {
            console.log(response);
            Session.set(list_id + "_tasks", response)
          }
        });
      } else {
        return Session.get(list_id + "_tasks");
      }

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

  Meteor.methods({
    authorizeWunderlist: function (code) {
      check(code, String);
      console.log(code);
      return HTTP.call("POST", "https://www.wunderlist.com/oauth/access_token", 
        {params: 
          {
            client_id: Meteor.settings.wunderlist,
            client_secret: Meteor.settings.wunderlist_secret,
            code: code
          }
        });
    },
    getAllLists: function(access_token) {
      check(access_token, String);
      return Wunderlist.getAllLists(access_token);
    },
    getTasks: function(list_id, access_token) {
      check(list_id, Number);
      check(access_token, String);
      return Wunderlist.getTasks(list_id, access_token);
    }
  });
}
