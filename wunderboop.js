REDIRECT_URI = "http://localhost:3000";

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.authorizeWunderlist.events({
    'click button': function () {
      // increment the counter when button is clicked
      window.open("https://www.wunderlist.com/oauth/authorize?client_id=7d179a4fd3ac31f9b3aa&redirect_uri=" + REDIRECT_URI + "&state=RANDOM", '_blank');
    }
  });

    Meteor.call("authorizeWunderlist", function(error, results) {
        console.log(results.content); //results.data should be a JSON object
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.methods({
    authorizeWunderlist: function () {
      this.unblock();
      return Meteor.http.call("GET", "link");
    },
    getWunderlist: function () {
      this.unblock();
      return Meteor.http.call("GET", "link");
    }
  });
}
