'use strict';

Wunderlist = {};

Wunderlist.getTasksCount = function(list_id, access_token) {
  if(!Meteor.settings.wunderlist)
    throw new Meteor.Error(500, 'Please provide a Wunderlist token in Meteor.settings');
  var getTasksCount = HTTP.get("http://a.wunderlist.com/api/v1/lists/tasks_count",
    {
      timeout: 5000,
      params: {
        list_id: list_id
      },
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": Meteor.settings.wunderlist
      }
    }
  );
  if(getTasksCount.statusCode === 200){
    return getTasksCount.data
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getTasksCount.error);
  }
}

Wunderlist.getList = function(list_id, access_token) {
  if(!Meteor.settings.wunderlist)
    throw new Meteor.Error(500, 'Please provide a Wunderlist token in Meteor.settings');
  var getList = HTTP.get("http://a.wunderlist.com/api/v1/lists/" + list_id,
    {
      timeout: 5000,
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": Meteor.settings.wunderlist
      }
    }
  );
  if(getList.statusCode === 200){
    return getList.data
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getList.error);
  }
}

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

Wunderlist.getTasks = function(list_id, access_token) {
  if(!Meteor.settings.wunderlist)
    throw new Meteor.Error(500, 'Please provide a Wunderlist token in Meteor.settings');
  check(list_id, Number);
  check(access_token, String);
  var getTasks = HTTP.get("http://a.wunderlist.com/api/v1/tasks",
    {
      timeout: 5000,
      params: {
        list_id: list_id
      },
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": Meteor.settings.wunderlist
      }
    }
  );
  if(getTasks.statusCode === 200){
    return getTasks.data
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getTasks.error);
  }
}