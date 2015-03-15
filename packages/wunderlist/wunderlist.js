Wunderlist = {};

Wunderlist.getAllLists = function(access_token){
  if(!Meteor.settings.wunderlist)
    throw new Meteor.Error(500, 'Please provide a Wunderlist token in Meteor.settings');
  var getAllLists = HTTP.get("http://a.wunderlist.com/api/v1/lists",
    {
      timeout: 5000,
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": Meteor.settings.wunderlist
      }
    }
  );
  if(getAllLists.statusCode === 200){
    return getAllLists.data
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getAllLists.error);
  }
}