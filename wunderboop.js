'use strict';
  
var REDIRECT_URI = "http://localhost:3000/authorized";

if (Meteor.isClient) {
  Router.route('/', function() {
    this.render('home');
  });

  Router.route('/lists', function() {
    this.render('lists');
  });

  Router.route('/list/:list_id', function() {
    Session.set("list_id", this.params.list_id);
    this.render('list');
  });

  Router.route('/authorized', function () {
    Meteor.call("authorizeWunderlist", this.params.query.code, function(error, results) {
          Session.set("access_token", results.data.access_token);
          Router.go("/");
        });
  });

  Template.home.helpers({
    isAuthorized: function() {
      if (Session.get("access_token"))
        return Session.get("access_token");
    },
  });

  Template.lists.helpers({
    allLists: function () {
      if (!Session.get("allLists")) {
        Meteor.call("getAllLists", function(err, response) {
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
      var list_id = +Session.get("list_id");
      if (!Session.get(list_id + "_tasks")) {
        Meteor.call("getTasks", list_id, Session.get("access_token"), function(err, response) {
          if (response) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
              response[i].index = i;
            }
            Session.set(list_id + "_tasks", response)
          }
        });
      } else {
        return Session.get(list_id + "_tasks");
      }
    },
    list: function() {
      var list_id = +Session.get("list_id");
      if (!Session.get(list_id)) {
        Meteor.call("getList", list_id, function(err, response) {
          if (response) {
            console.log(response);
            Session.set(list_id, response)
          }
        });
      } else {
        return Session.get(list_id);
      }
    },
    tasksCount: function() {
      var list_id = +Session.get("list_id");
      if (!Session.get(list_id + "_tasksCount")) {
        Meteor.call("getTasksCount", list_id, Session.get("access_token"), function(err, response) {
          if (response) {
            console.log(response);
            Session.set(list_id + "_tasksCount", response)
          }
        });
      } else {
        return Session.get(list_id + "_tasksCount");

      }

    }
  });

  Template.list.events({
    'click .complete-task': function() {
      console.log(this);
      Meteor.call("completeTask", this.id, this.revision, Session.get("access_token"), function(err, response) {
        if (response) {
          console.log(response);
        }
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    getAccessToken : function() {
      try {
        return Meteor.user().services.wunderlist.accessToken;
      } catch(e) {
        return null;
      }
    },
    getAllLists: function() {
      var token = Meteor.call("getAccessToken");
      return Wunderlist.getAllLists(token);
    },
    getTasks: function(list_id) {
      check(list_id, Number);
      var token = Meteor.call("getAccessToken");
      return Wunderlist.getTasks(list_id, token);
    },
    getList: function(list_id) {
      check(list_id, Number);
      var token = Meteor.call("getAccessToken");
      return Wunderlist.getList(list_id, token);
    },
    getTasksCount: function(list_id) {
      check(list_id, Number);
      var token = Meteor.call("getAccessToken");
      return Wunderlist.getTasksCount(list_id, token);
    },
    completeTask: function(task_id, revision) {
      check(task_id, Number);
      check(revision, Number);
      var token = Meteor.call("getAccessToken");
      return Wunderlist.completeTask(task_id, revision, token);
    },
  });
}
