var ApiEndpoint = {
  userService:"https://thotsapponline.com/apis/index.php/Users/",
  postService:"https://thotsapponline.com/apis/index.php/Posts/",
  surveyService:"https://thotsapponline.com/apis/index.php/Survey/"
}
angular.module('starter.services', [])

.factory('userService',  function($http){

var factory={};
factory.login = function (user){
  return $http.post(ApiEndpoint.userService+"login",{user:user});
}
factory.loggedinuser=function () {
  return JSON.parse(localStorage.getItem('thots_user'));
}
factory.changePassword = function (user,newpassword){

  return $http.post(ApiEndpoint.userService+"changepassword",{user:user,newpassword:newpassword});

}
factory.changeUserName = function (user,newusername){
  return $http.post(ApiEndpoint.userService+"changeusername",{user:user,newusername:newusername});

}
factory.changeAvatar = function (user,avatar){
   return $http.post(ApiEndpoint.userService+"changeAvatar",{user:user,avatar:avatar});

}
factory.requestEmail = function (email){
   return $http.post(ApiEndpoint.userService+"requestPassword",{email:email});

}
return factory;

  })
.factory('postService', function ($http){

  var factory={};
  factory.getPosts = function (user,start,limit){
    return $http.post(ApiEndpoint.postService+'getPosts',{user:user,start:start,limit:limit});

  }

  factory.getUserPosts = function (user){
    return $http.post(ApiEndpoint.postService+'getUserPosts',{user:user});

  }
  factory.like = function (user,entry){
    return $http.post(ApiEndpoint.postService+"likePost",{user:user,entry:entry})
  } 
  factory.unlike = function (user,entry){
    return $http.post(ApiEndpoint.postService+"unlikePost",{user:user,entry:entry})
  } 
  factory.postComment = function (user,entry,comment) {
    return $http.post(ApiEndpoint.postService+"postComment",{user:user,entry:entry,comment:comment});
  }
  factory.sendPost = function (post,user) {
    return $http.post(ApiEndpoint.postService+"sendPost",{post:post,user:user});


  }

  factory.flagPost = function (user,entry){
    return $http.post(ApiEndpoint.postService+"flagPost",{user:user,entry:entry})
  }
  factory.getPost = function (user,entry){
    return $http.post(ApiEndpoint.postService+"getPost",{user:user,entry:entry})
  }
  factory.editPost = function (user,entry){
    return $http.post(ApiEndpoint.postService+"editPost",{user:user,entry:entry})
  }
  factory.deletePost = function (user,entry){
    return $http.post(ApiEndpoint.postService+"deletePost",{user:user,entry:entry})
  }
  factory.setPrivacy = function (user,entry){
    return $http.post(ApiEndpoint.postService+"setPrivacy",{user:user,entry:entry})
  }

  factory.getComment = function (user,comment){
    return $http.post(ApiEndpoint.postService+"getComment",{user:user,comment:comment})
  }
  factory.editComment = function (user,comment){
    return $http.post(ApiEndpoint.postService+"editComment",{user:user,comment:comment})
  }
  factory.deleteComment = function (user,comment,entry_id){
    return $http.post(ApiEndpoint.postService+"deleteComment",{user:user,comment:comment,entry_id:entry_id})
  }
  factory.flagComment = function (user,comment){
    return $http.post(ApiEndpoint.postService+"flagComment",{user:user,comment:comment})
  }


  return factory;
})

.factory('surveyService', function ($http){

  var factory={};
  factory.getSurveyQns = function (assignment) {
     return $http.post(ApiEndpoint.surveyService+"getsurveyqns",{assignment:assignment});
  }
  factory.submitSurveyResults = function (user,assignment_id,responses) {
     return $http.post(ApiEndpoint.surveyService+"submitsurveyresults",{user:user,assignment:assignment_id,responses:responses});
  }
  factory.submitAssessment = function (user,results){
    return $http.post(ApiEndpoint.surveyService+"submitassessmentresults",{user:user,results:results});
  
  }
  factory.getResponses = function () {
    return $http.get('json/responses.json');
  }
  return factory;
})
.factory ('messageService',function ($http){

  var factory={};
  factory.getMessages = function () {

    return $http.get('json/messages.json');

  }

  factory.getEvents = function (user,groups) {

    return $http.post(ApiEndpoint.postService+'getEvents',{user:user,groups:groups});

  }

  return factory;
})

.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);
;
