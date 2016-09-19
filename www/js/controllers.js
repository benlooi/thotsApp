angular.module('starter.controllers', [])
.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|content):/);
  
})
.controller('tabsCtrl', function($scope,Camera,$state,$ionicModal) {
  
    
  

  })
.controller('loginCtrl',function($scope,$rootScope,$state,userService,$ionicPopup,$ionicLoading,$ionicModal){
  //localStorage.removeItem('thots_user');
  $scope.user={};
  var checkUser=localStorage.getItem('thots_user');
//console.log(checkUser);
  if (checkUser!=null){
    //checkUser.groups=JSON.parse(checkUser.groups);
    $rootScope.loggedinuser=checkUser;
    $state.go('home.tab.home');
  } else if (checkUser==null){
 
}
$scope.login = function (){
  if ($scope.user.username==undefined || $scope.user.password==undefined) {
    var PopUp = $ionicPopup.alert(
      {
        title: 'Error',
        template:'Please enter both username and password'
      });
  } else {

  $ionicLoading.show({
    template:"<ion-spinner icon='spiral'></ion-spinner>logging in..."
  });
  userService.login($scope.user)
  .success(function (data){
    //console.log(data);
    var loggedinuser=data;
    //console.log(loggedinuser);
   
    if (data=="unauthorised" ){
      $ionicLoading.hide();
      var alertMessage=$ionicPopup.alert(
        {
          title:"LOG IN",
          template:"Incorrect Username or password"
        });
      alertMessage.then(function (res){
         $state.reload();
      }
        )
      } else if (data!="unauthorised" && angular.isDefined(data.name)){
         $ionicLoading.hide();
      loggedinuser.groups=JSON.parse(loggedinuser.groups);
    localStorage.setItem('thots_user',JSON.stringify(loggedinuser));
    $rootScope.loggedinuser=loggedinuser;
    ////console.log($rootScope.loggedinuser);
     $rootScope.loggedinuser=checkUser;
    $state.go('home.tab.home');
    }
     
    

    
  })
  .error(function (err){
    //console.log(err);
  })
}
}


$ionicModal.fromTemplateUrl('templates/login_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.UPHelp = function () {
    $scope.modal.show();
  }


  $scope.closeModal = function () {
    $scope.modal.hide();
  }
$scope.request={};
  $scope.requestHelp= function() {
    //console.log ($scope.request.email);
    userService.requestEmail($scope.request.email)
    .success(function(data){
      //console.log(data);
      if (data=="email sent") {

        var Ackpopup = $ionicPopup.alert({
          title:"Request Password",
          content:"Your request have been received. Check your email for instructions."
        });
        Ackpopup.then(function (res){
          $scope.modal.hide();
        })
      } else {
        var Ackpopup = $ionicPopup.alert({
          title:"Request Password",
          content:"An error has occured. Try again later."
        });
        Ackpopup.then(function (res){
          $scope.modal.hide();
        })

      }

    })
    .error(function(err){
      //console.log(err);
    })
    $scope.modal.hide();
  }

})
.controller('HomeCtrl', function ($filter,$scope,$rootScope,postService,$ionicModal,$ionicSideMenuDelegate,$ionicLoading,$state,$timeout,userService,$ionicPopup,$ionicPopover) {
//$state.reload();
$scope.toggleRight = function () {

  $ionicSideMenuDelegate.toggleRight();
}
$rootScope.loggedinuser=userService.loggedinuser();
////console.log($rootScope.loggedinuser);
$scope.user={};
//console.log(JSON.stringify($rootScope.loggedinuser));
var post_start=0;
var post_limit=1;

  postService.getPosts($rootScope.loggedinuser.user_id,post_start,post_limit)
  .success(function (data){
    
    console.log(data);
for (var i=0;i<data.length;i++){
  //data[i].values=data[i].values;
  data[i].likes=JSON.parse(data[i].likes);
  data[i].comments=JSON.parse(data[i].comments);
  if (ionic.Platform.isIOS()||ionic.Platform.isIPad()||ionic.Platform.isWebView()){
     var datetimeIOS=data[i].datetime.replace(' ','T');
    
      datetime=new Date(datetimeIOS);
    datetime=moment(datetime).fromNow();
    data[i].date_time=datetime;
  } else if(ionic.Platform.isAndroid()){
    
      var datetime=new Date(data[i].datetime);
    datetime=moment(datetime).fromNow();
    data[i].date_time=datetime;
  }
 
  
  data[i].values=JSON.parse(data[i].values);
  
  
  // console.log(data[i].date);
  //var now=new Date();
  //var postedsince=now-data[i].date;
 // console.log(data[i].date);

  var inlike=data[i].likes.indexOf($rootScope.loggedinuser.user_id);
  //console.log('liked result: '+inlike);
    if ((data[i].likes.indexOf($rootScope.loggedinuser.user_id))>-1) {
      data[i].liked=true;
    } else if 
      ((data[i].likes.indexOf($rootScope.loggedinuser.user_id))<0) {
      data[i].liked=false;
    }
  }
  
$scope.posts=data;
})
.error(function (err){

    console.log(err);
  });

$ionicPopover.fromTemplateUrl('templates/whoisthis.html',{
  scope: $scope
  }).then(function(popover) {
    $scope.who_popover = popover;
  });

$scope.whoIsThis = function ($event,name){
  //console.log(name);
$scope.thisIs=name;
  $scope.who_popover.show($event);

}

$scope.close_whoIsThis = function() {
    $scope.who_popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.who_popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
//login modal
 $ionicModal.fromTemplateUrl('templates/login_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(login_modal) {
    $scope.login_modal = login_modal;
  });

//$timeout(function () {$scope.login_modal.show()},1000);


$scope.like = function (entry_id) {
  $rootScope.loggedinuser=userService.loggedinuser();
  postService.like($rootScope.loggedinuser.user_id,entry_id)
  .success(function(data){
    //console.log(data);
    var posts=$scope.posts.map(function (p){
      return thispost=p.entry_id;
    })
    var a=posts.indexOf(entry_id);
    if (data=="entry updated"){
      $scope.posts[a].likes.push($rootScope.loggedinuser.user_id);
      $scope.posts[a].liked=true;
      //$scope.$apply();
    }
  })
  .error(function (err){
    console.log(err);
  })
}

$scope.unlike = function (entry_id) {
  $rootScope.loggedinuser=userService.loggedinuser();
  postService.unlike($rootScope.loggedinuser.user_id,entry_id)
  .success(function(data){
   // console.log(data);
    var posts=$scope.posts.map(function (p){
      return thispost=p.entry_id;
    })
    var a=posts.indexOf(entry_id);
    if (data=="entry updated") {
    var b=$scope.posts[a].likes.indexOf($rootScope.loggedinuser.user_id);
    $scope.posts[a].likes.splice(b,1);
    $scope.posts[a].liked=false;
    //$scope.$apply();
  }
  })
  .error(function (err){
    console.log(err);
  })
}

//comments modals
   $ionicModal.fromTemplateUrl('templates/post_comments.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/edit_comment.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editComment_modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/delete_comment.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.deleteComment_modal = modal;
  });
//edit posts
$ionicModal.fromTemplateUrl('templates/edit_Post.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editPost_modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/delete_Post.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.deletePost_modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/setPostPrivacy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.setPostPrivacy_modal = modal;
  });

//edit comment

$scope.showEditComment = function (this_comment) {
  $scope.comment_popover.hide();
  $scope.editcomment=this_comment;
  $scope.editComment_modal.show();
}

$scope.closeEditComment = function () {
  
  $scope.editComment_modal.hide();
}


  $scope.postComment = function(entry_id) {
$scope.entry_id=entry_id;
    //console.log(entry_id);
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  
  $scope.submitComment = function (entry_id,comment){
    $ionicLoading.show({
    template:"<ion-spinner icon='spiral'></ion-spinner>Posting comment..."
  });
    //console.log(comment);
    $scope.comment=comment;
    postService.postComment($rootScope.loggedinuser.user_id,entry_id,$scope.comment)
    .success(function (data){
      $ionicLoading.hide();
      //console.log(data);
      data=data.split('-');
      if (data[0]=="comment added"){
        var posts=$scope.posts.map(function (p){
          return thispost=p.entry_id;
        })
        var a=posts.indexOf(entry_id);
        $scope.posts[a].comments.push(data[1]);
        var thiscomment={};
        thiscomment.comment_id=data[1];
        thiscomment.entry_id=entry_id;
        thiscomment.from_user=$rootScope.loggedinuser.user_id;
        thiscomment.comment=comment;
        thiscomment.username=$rootScope.loggedinuser.username;
        thiscomment.avatar=$rootScope.loggedinuser.avatar;
        $scope.posts[a].entrycomments.push(thiscomment);

        $scope.closeModal();
      }

    })
    .error(function (err){
console.log(err);
    })
  }

   $scope.doRefresh = function () {
    postService.getPosts($rootScope.loggedinuser.user_id)
      .success(function (data){
        //console.log(data);
       for (var i=0;i<data.length;i++){
  
  data[i].likes=JSON.parse(data[i].likes);
  data[i].comments=JSON.parse(data[i].comments);
 if (ionic.Platform.isIOS()||ionic.Platform.isIPad()||ionic.Platform.isWebView()){
     var datetimeIOS=data[i].datetime.replace(' ','T');
    
      datetime=new Date(datetimeIOS);
    datetime=moment(datetime).fromNow();
    data[i].date_time=datetime;
  } else if(ionic.Platform.isAndroid()){
    
      var datetime=new Date(data[i].datetime);
    datetime=moment(datetime).fromNow();
    data[i].date_time=datetime;
  }

  var inlike=data[i].likes.indexOf($rootScope.loggedinuser.user_id);
  //console.log('liked result: '+inlike);
    if ((data[i].likes.indexOf($rootScope.loggedinuser.user_id))>-1) {
      data[i].liked=true;
    } else if 
      ((data[i].likes.indexOf($rootScope.loggedinuser.user_id))<0) {
      data[i].liked=false;
    }

  data[i].values=JSON.parse(data[i].values);
  }
$scope.posts=data;
        
      }).error(function (err){

        console.log(err);
      })
      
      .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      

     }
//do logout

$scope.logout = function () {
  //console.log("logout");
   var confirmPopup = $ionicPopup.confirm({
     title: 'Log out',
     template: 'Are you sure you want to log out?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       //console.log('log out');
       localStorage.removeItem('thots_user');
       $ionicSideMenuDelegate.toggleRight();
     $state.go('login');
     } else {
       //console.log('You are not sure');
     }
   });
 };
//end do logout   
//toggle Menu
$scope.toggleMenu = function () {
  $ionicSideMenuDelegate.toggleRight();
}
//end toggle menu
//popover to report post

 $ionicPopover.fromTemplateUrl('templates/my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

 $scope.openPopover = function($event,entry,index) {
    $scope.this_entry=entry;
    $scope.this_index=index;
    //console.log($scope.this_entry);
    //console.log($scope.this_index);
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  //popover for comments
  $ionicPopover.fromTemplateUrl('templates/my-comments-popover.html',{
    scope:$scope}).then(function(popover){
      $scope.comment_popover=popover;
    })
  $scope.showCommentPopover=function($event,comment,PostIndex,CommentIndex){
    //console.log(comment);
$scope.postIdx=PostIndex;
$scope.commentIdx=CommentIndex;
   // console.log($scope.postIdx+"-"+$scope.commentIdx);
    $scope.this_comment=comment;
   
    $scope.comment_popover.show($event);
  }
  $scope.closeCommentPopover = function (){

    $scope.comment_popover.hide();
  }
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

$scope.flagPost = function (user,entryId){
  //console.log(entryId);
  postService.flagPost(user,entryId)
  .success(function(data){
    //console.log(data);
    if (data=="email sent") {

       var ackPopup = $ionicPopup.alert({
    title:"Report Post",
    template:"Post has been reported. Thank you."
  });
  ackPopup.then (function (res){
    //console.log('reported');
  });
    }
    $scope.popover.hide();

  })
  .error(function(err){
    console.log(err);
  })
  
}

$scope.ackFlagPost = function () {
  var ackPopup = $ionicPopup.alert({
    title:"Report Post",
    template:"Post has been reported. Thank you."
  });
  ackPopup.then (function (res){
    //console.log('reported');
  });
}
$scope.editpost={};
$scope.showEditPost = function (this_entry) {

$scope.editpost=this_entry;
    $scope.editPost_modal.show();
    $scope.closePopover();
}


$scope.editPost = function (this_entry){
  $ionicLoading.show({
    template:"<ion-spinner icon='spiral'></ion-spinner>Submitting edited post..."
  });
postService.editPost($rootScope.loggedinuser.user_id,$scope.editpost)
.success(function (data){
//console.log(data);
$ionicLoading.hide();
if (data=="entry updated") {
  var alertPopup = $ionicPopup.alert({
     title: 'Edit Post',
     template: 'Post updated'
   });

   alertPopup.then(function(res) {
    $scope.editPost_modal.hide();

   });
 
} else if (data=="entry not updated") {
$scope.editPost_modal.hide();


}
})
.error(function(err){
  console.log(err)
})
}
$scope.deletePost = function (this_entry,index){
  $scope.closePopover();
var deletePopup = $ionicPopup.confirm({
   title: 'Delete Post',
     template: 'Are you sure you want to delete this Post?'
   });

   deletePopup.then(function(res) {
     if(res) {
       postService.deletePost(this_entry.from_user,this_entry.entry_id)
       .success(function(data){
        //console.log(data);
        if(data=="entry deleted") {
          var deleteConfirmed = $ionicPopup.alert({

              title:'Post Deleted',
              template:"Post has been deleted"
          })

          deleteConfirmed.then(function (res){
            $scope.posts.splice(index,1);

          })

        } else if (data=="entry not deleted") {

        }
       })
       .error(function (err){
        console.log(err);
       })
     } else {
       console.log('You are not sure');
     }
   });
}
  

$scope.setPrivacy = function (this_entry){
var PrivatePopup = $ionicPopup.confirm({
  title:"Change Privacy",
  content:"Change privacy?"
});
  PrivatePopup.then(function(res){
    if (res) {
      postService.setPrivacy($rootScope.loggedinuser.user_id,this_entry)
      .success(function(data){
        //console.log(data);
        if (data=="privacy settings changed") {
          var ackPrivate = $ionicPopup.alert({
            title:"Change Privacy",
            content:"Privacy Changed"
          });
          ackPrivate.then(function (resp){

          })
        } else {
            var ackPrivate = $ionicPopup.alert({
            title:"Change Privacy",
            content:"Privacy Not Changed"
          });
          ackPrivate.then(function (resp){

          })

        }

      })
      .error(function(err){

      })
    } else {

    }

  })
  
}
$scope.closeEditPost = function () {
  $scope.editPost_modal.hide();
}


$scope.editComment= function () {
$ionicLoading.show({
    template:"<ion-spinner icon='spiral'></ion-spinner>Editing comment..."
  });
  postService.editComment($rootScope.loggedinuser.user_id,$scope.editcomment)
  .success(function (data){
      //console.log(data);
      $ionicLoading.hide();
      if (data=='comment edited') {

        var alertPopup=$ionicPopup.alert({
          title:"Edit Comment",
          content:"Comment edited."
        });
        alertPopup.then(function (resp){
          $scope.editComment_modal.hide();
        })
      } else {
        var alertPopup=$ionicPopup.alert({
          title:"Edit Comment",
          content:"Comment not edited."
        });
        alertPopup.then(function (resp){
          $scope.editComment_modal.hide();
        })

      }
  })
  .error(function(err){
    console.log(err);
  })
}

$scope.deleteComment = function (this_comment){
 //console.log($scope.postIdx+"/"+$scope.commentIdx);
 //console.log(this_comment);
 var entry_id=$scope.posts[$scope.postIdx].entry_id;
    $scope.comment_popover.hide();
var alertPopup = $ionicPopup.confirm({
            title:"Delete Comment",
            content:"Confirm delete comment?"
          });
  alertPopup.then (function (res){

    if (res) {
      postService.deleteComment($rootScope.loggedinuser.user_id,this_comment.comment_id,this_comment.entry_id)
      .success(function(data){
        console.log(data);
        if (data=="comment deleted"){
          var theseposts=$scope.posts.map(function(thispost){
            return thispost.entry_id;

          })
          var p = theseposts.indexOf(this_comment.entry_id);


          $scope.posts[p].entrycomments.splice($scope.commentIdx,1);
          $scope.posts[p].comments.splice($scope.commentIdx,1);

        var ackPopup = $ionicPopup.alert({
          title:"Delete Comment",
          "content":"Comment deleted."

        })

        ackPopup.then(function(res){

        })
      } else {
        
          var ackPopup = $ionicPopup.alert({
          title:"Delete Comment",
          "content":"Comment not deleted."

        })

        ackPopup.then(function(res){

        })

      }
      })
      .error(function(err){
        console.log(err);
      })
  } else {

  }
  
})
}


//popover for canned comments
$scope.cannedComments = [
  {"comment":"Your passion and enthusiasm is clearly seen when you were in action and it is also shown through your reflection that shows good critical thinking. Keep up the good work." },
  {"comment":"Good thinking, love reading it. Continue to reflect on your learning experiences and learn from them." },
  {"comment":"Thank you for your reflection, I wish to read more about your deeper thoughts on the issue and your experiences." }
  ];

 

$scope.selectComment = function (index){
  $scope.comment = $scope.cannedComments[index].comment;
}

})
.controller('myThotsCtrl',function ($scope,$rootScope,userService,postService,$filter,$ionicPopover,$ionicPopup){
    $rootScope.loggedinuser=userService.loggedinuser();
    console.log($rootScope.loggedinuser);



      postService.getUserPosts($rootScope.loggedinuser.user_id)
      .success(function (data){
        for (i=0;i<data.length;i++){
          data[i].comments=JSON.parse(data[i].comments);
          data[i].likes=JSON.parse(data[i].likes);
          data[i].values=JSON.parse(data[i].values);
          //console.log(data[i].datetime);
          var thisdate=data[i].datetime.split(' ');
          var time=thisdate[1];
          time=time.split(':');
          var date=thisdate[0];
          date=date.split('-');
          date=new Date(date[0],date[1]-1,date[2],time[0],time[1],time[2]);
          data[i].date=$filter('date')(date,'dd MMM yyyy');
          data[i].time=$filter('date')(date,'h:mm a');
        }
        $scope.myposts=data;
        //console.log(data);

      })
      .error(function (err){

      });

      $ionicPopover.fromTemplateUrl('templates/mythots-popover.html',{
    scope:$scope}).then(function(popover){
      $scope.mythots_popover=popover;
    })

      $scope.showPopover = function ($event,postIndex,post) {
        $scope.mythots_popover.show($event);
        $scope.this_entry=post;

      }

      $scope.closePopover = function () {
        $scope.mythots_popover.hide();
      }

})
.controller('SnapCtrl', function ($scope,Camera,$ionicModal,$ionicPopup,$timeout,userService){
$rootScope.loggedinuser=userService.loggedinuser();
$scope.post={};
 

$scope.counter=1;
 $ionicModal.fromTemplateUrl('templates/comments_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.postComment = function(post) {
    //console.log(post);
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

 
 $scope.nextQn = function () {
  
  $scope.counter++;
  //console.log($scope.counter);
}
$scope.prevQn = function () {
  $scope.counter --;
  //console.log($scope.counter);
}


 


})

.controller('assignmentCtrl', function ($scope,$rootScope,userService,surveyService,messageService,$state,$ionicPopup,$ionicModal,$timeout,$ionicLoading){
$rootScope.loggedinuser=userService.loggedinuser();
   //console.log($rootScope.loggedinuser);
  messageService.getEvents($rootScope.loggedinuser.user_id, $rootScope.loggedinuser.groups)
  .success(function(data){
$scope.events=data;
//console.log($scope.events);
  })
  .error(function(err){
console.log(err);
  })

  $scope.makeThot = function (eventID){
//console.log(eventID);
$state.go('home.tab.thots.write',{assignmentID:eventID});
}

$scope.showDetails = function (eventID){
var events=$scope.events.map(function (item){
  return item.message_id;
})

var a = events.indexOf(eventID);
if (a!=-1){
  var thistitle=$scope.events[a].title;
  var thismessage=$scope.events[a].message;
}
var popUp=$ionicPopup.alert({
  title:thistitle,
  template:thismessage
});
}
$rootScope.s_counter=0;
$scope.doSurvey = function (eventID) {
$rootScope.assignmentID=eventID;
surveyService.getSurveyQns(eventID)
  .success(function (data){
    $rootScope.survey_results=[];
    $rootScope.survey_qns=data;
    surveyService.getResponses()
    .success(function(data){
      $rootScope.responses=data;
      //console.log($rootScope.responses);
    })
    .error(function(err){
      console.log(err);
    })
    //localStorage.setItem('survey_qns',JSON.stringify(data));
    //console.log($rootScope.survey_qns);
    $state.go('home.tab.thots.survey');


  })
  .error(function(err){
    console.log(err);
  });
}

$scope.prevQn = function (index) {
$rootScope.s_counter=index-1;
}

$scope.nextQn = function (index) {
$rootScope.s_counter=index+1;
}

$scope.submitSurvey = function (assignmentID) {
  $ionicLoading.show({
    template:"<ion-spinner icon='spiral'></ion-spinner>Submitting survey..."
  });
  $scope.results=[];
 for (i=0;i<$rootScope.survey_qns.length;i++){
var thisresults= {};
thisresults.qn_no=i+1;
thisresults.score=$rootScope.survey_qns[i].score;
$scope.results.push(thisresults);
 }
 surveyService.submitSurveyResults($rootScope.loggedinuser.user_id,$rootScope.assignmentID,$scope.results)
  .success(function (data){
    $ionicLoading.hide();
//console.log(data);
if (data=="survey submitted") {

  var Ack= $ionicPopup.alert(
  {
    title:"Survey Submitted",
    content:"Thank you!"
  });

  Ack.then(function (res){
    if (res) {
      $state.go('home.tab.thots.assignment');
    }
  })
} else if (data!="survey submitted"){
  var Ack= $ionicPopup.alert(
  {
    title:"Survey Message",
    content:"Oops. Either you have done the survey for this event, or error has occurred. "
  });
  Ack.then(function (res){
    if (res) {
      $state.go('home.tab.thots.assignment');
    }
  })
}
  })
  .error(function(err){
    console.log(err);
  })
  //console.log($rootScope.survey_qns);
}

$scope.doRefresh = function() {
    messageService.getEvents($rootScope.loggedinuser.user_id, $rootScope.loggedinuser.groups)
  .success(function(data){
$scope.events=data;
     })
  .error(function(err){
console.log(err);
  })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

  })




.controller('surveyCtrl',function ($scope,postService,$state,$stateParams,assignmentID,$ionicPopup){
  $rootScope.loggedinuser=userService.loggedinuser();
   
  postService.getSurveyQns(assignmentID)
  .success(function (data){
    $scope.survey_qns=data;
    //console.log($scope.survey_qns);
  })
  .error(function(err){
    console.log(err);
  });

  $scope.submitSurvey= function () {
    
    postService.submitSurveyResults($rootScope.loggedinuser.user_id,$scope.results)
    .success(function(data){
      $ionicLoading.hide();
      //console.log(data);

    })
    .error(function(err){
      console.log(err);
    })
  }
})

.controller('thotsCtrl', function ($scope,$ionicPopup,$timeout,$filter,Camera,$stateParams,$ionicModal,$state,userService,postService,$ionicLoading){
  //camera controls
  //console.log($stateParams.assignmentID);
$scope.logout = function () {
  //console.log("logout");
   var confirmPopup = $ionicPopup.confirm({
     title: 'Log out',
     template: 'Are you sure you want to log out?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       //console.log('log out');
       localStorage.removeItem('thots_user');
     $state.go('login');
     } else {
       console.log('You are not sure');
     }
   });
 };

  
  $scope.user=userService.loggedinuser();
  $scope.values=[
  {"description":"Grace","checked":false},
  {"description":"Responsibility","checked":false},
{"description":"Resilience","checked":false},
{"description":"Integrity","checked":false},
{"description":"Nation before Self","checked":false},
{"description":"Dignity","checked":false},
{"description":"Care","checked":false},
{"description":"Teamwork","checked":false}
];
  $scope.post={};

  $scope.isDisabled=true;
$scope.counter=1;
  $scope.nextQn = function () {
  
  $scope.counter++;
  $scope.isDisabled=true;
  //console.log($scope.counter);
}
$scope.prevQn = function () {
  $scope.counter --;
  //console.log($scope.counter);
}
 $scope.getPhoto = function() {

    var options = {
      quality: 90,
      destinationType: 0,
      //sourceType: Camera.PictureSourceType.CAMERA,
      //allowEdit: true,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
    
    Camera.getPicture(options).then(function(imageData) {
       $scope.post.imageURI = "data:image/jpeg;base64,"+imageData;
      
       var preview=document.getElementById('preview');
       preview.src=$scope.post.imageURI;
 //$scope.$apply();
      
       $timeout(function() {$scope.counter=2;},1000);
      //sessionStorage.setItem('pic',$scope.post.imageURI);

      //console.log(JSON.stringify($scope.post));
      
      $timeout(function() {$scope.counter=2;},3000);
      

    }, function(err) {
      console.log(err);
    });
  };

  $scope.getPhotoFromGallery = function() {

    var options = {
      quality: 90,
      destinationType: 0,
      sourceType: 0,
      //allowEdit: true,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
    
    Camera.getPicture(options).then(function(imageData) {
       $scope.post.imageURI = "data:image/jpeg;base64,"+imageData;
      var preview=document.getElementById('preview');
       preview.src=$scope.post.imageURI;
 

      //sessionStorage.setItem('pic',$scope.post.imageURI);
      
      //console.log(JSON.stringify($scope.post));
       $timeout(function() {$scope.counter=2;},3000);

    }, function(err) {
      console.log(err);
    });
  };
/*$scope.popUp = function() {
  $scope.data = {};


  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: 'Select Image from...',
    title: 'Select Image',
    subTitle: 'Gallery or Camera',
    scope: $scope,
    buttons: [
      { text: 'Gallery',
    onTap:$scope.getPhotoFromGallery()
        
       },
      {
        text: 'Camera',
        type: 'button-positive',
        onTap: $scope.getPhoto()
        
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 3000);
 };*/
 
$scope.check_d= function () {
if ($scope.post.d_part==undefined) {
  $scope.have_d=true;
} else if ($scope.post.d_part!=undefined) {
  $scope.isDisabled=false;
}
}
$scope.check_e= function () {
  if ($scope.post.d_part==undefined) {
  $scope.have_e=true;
} else if ($scope.post.d_part!=undefined) {
  $scope.isDisabled=false;
}
}

$scope.check_al= function () {
  if ($scope.post.d_part==undefined) {
  $scope.have_al=true;
} else if ($scope.post.d_part!=undefined) {
  $scope.isDisabled=false;
}
}

$scope.check_values= function () {
 for (i=0;i<$scope.values.length;i++){
  if ($scope.values[i].checked==true) {
    $scope.isDisabled=false;
    break;
  }
 }
  

}

$scope.post.private={checked:false};


$scope.post.user=$scope.user;
//console.log($scope.post.user);
  $scope.post.thots="";
 
$scope.post.values=[];
 //$scope.$apply();
 $scope.sendPost = function () {
  $ionicLoading.show({
    template:"<ion-spinner icon='spiral'></ion-spinner>Posting..."
  });
  $scope.post.assignment=$stateParams.assignmentID,
   $scope.post.thots=$scope.post.d_part+" "+$scope.post.e_part +" "+$scope.post.al_part;
  $scope.post.values=$scope.values;
  //console.log($scope.post);
  postService.sendPost($scope.post,$scope.user.user_id)
  .success(function (data){
    console.log(data);
    if (data=="entry added") {
      $ionicLoading.hide();
      var popUp = $ionicPopup.alert({
        title:'Thots',
        template:'Post sent!'
      });
      popUp.then (function (res){
      $scope.post={};
      $scope.counter=1;
      
      $state.go('tab.home');
      $state.reload();

      })
     
      

    } else if (data!=="entry added") {
      $ionicLoading.hide();
      var popUp = $ionicPopup.alert({
        title:'Thots',
        template:'Oops, can\'t send post. Try again later.'

      })
      popUp.then (function (res){
        $scope.post={};
      $scope.counter=1;
       $state.reload();
      })
    }
//console.log(data);
  })
  .error(function (err){
    console.log(err);
  })
 }
})
.controller('assessmentCtrl', function ($scope,$rootScope,$http,$state,userService,surveyService,$ionicPopup,$ionicLoading){
$rootScope.loggedinuser=userService.loggedinuser();
  $scope.canTakeTest=true;
  var last_assessment_date = localStorage.getItem('wgs_date_of_assessment');
  var assessment_results = localStorage.getItem('wgs_assessment');
  //console.log(last_assessment_date);

   $http.get('json/assessment.json')
    .success(function (data){
      //console.log(data);
      $rootScope.assessment=data;
    })
    .error (function (err){
      console.log(err);
    })
  if (last_assessment_date!=null ) {

    last_assessment_date=new Date(last_assessment_date);

    var today = new Date();
     //console.log(last_assessment_date.setDate(last_assessment_date.getDate()));
    //console.log(today.setDate(today.getDate()));
    var lastTestTaken = today-last_assessment_date; 
    var daysSinceLastTest=Math.floor(lastTestTaken/(60*60*1000*24));
    //console.log(lastTestTaken);
    //console.log(daysSinceLastTest);
     if (daysSinceLastTest<183 && assessment_results!=null) {
      $scope.canTakeTest=false;
     } else if (daysSinceLastTest>=183 || assessment_results==null){
      $scope.canTakeTest=true;
     }
  }
$scope.counter=-1;

   
$scope.prevQn = function (number) {

  $scope.counter=number-1;
}
$scope.nextQn = function (number) {

  $scope.counter=number+1;
  //console.log($scope.counter);
  //console.log($scope.assessment);

}
$rootScope.assessment_results=[];
$scope.submitAssessment = function () {
  $ionicLoading.show({
    template:"<ion-spinner icon='spiral'></ion-spinner>Submitting assessment..."
  });
  for (i=0;i<$rootScope.assessment.length;i++){
    var thisresult={};
    thisresult.qn_no=i+1;
    thisresult.score=$rootScope.assessment[i].score;
    $scope.assessment_results.push(thisresult);

  }
  var assessment_date=new Date();
  //console.log(assessment_date);
  localStorage.setItem('wgs_assessment',JSON.stringify($scope.assessment_results));
  localStorage.setItem('wgs_date_of_assessment',assessment_date.toDateString());
surveyService.submitAssessment($rootScope.loggedinuser.user_id,$scope.assessment_results)
.success(function(data){
console.log(data);
if (data=="results submitted") {
  $ionicLoading.hide();
  var Ack= $ionicPopup.alert(
  {
    title:"Assessment Submitted",
    content:"Thank you for your sumission."
  }
    );
  Ack.then(function (res){

    if (res) {
      $state.go('home.report');
    }
  })
  }
  else if (data!="results submitted") {
    var Ack= $ionicPopup.alert(
  {
    title:"Assessment",
    content:"An error has occured."
  }
    );
  Ack.then(function (res){

    if (res) {
      $state.go('home.tab.thots.home');
    }
  })
  }

 
  })
.error(function(err){
  console.log(err);
})
}
$scope.selected= function (qn,score) {
  $scope.assessement[qn].score=score;
  //console.log(score);
  $scope.choice_selected=score;
}

$scope.viewReport = function () {
    var assessment_results=JSON.parse(localStorage.getItem('wgs_assessment'));
    //console.log(assessment_results);
    if (assessment_results!=null){
    //console.log($rootScope.assessment);

     for (i=0;i<$rootScope.assessment.length;i++) {
      $rootScope.assessment[i].score=assessment_results[i].score;
     }
     $state.go('home.report');
   
        } else if (assessment_results==null) {
          $scope.canTakeTest=true;
        }
      }
})
.controller('reportCtrl', function ($scope,$rootScope,$state,$timeout,$filter){
  $scope.Personal = [];
  $scope.Peer = [];
  $scope.People = [];
  $scope.Public = [];
//console.log($rootScope.assessment);
  var pers_qualities = {
    "awareness":0,"affection":0,"ability":0
  }
  var peer_qualities = {
    "awareness":0,"affection":0,"ability":0
  }
  var people_qualities = {
    "awareness":0,"affection":0,"ability":0
  }
  var public_qualities = {
    "awareness":0,"affection":0,"ability":0
  }
  
  var pers_maxscore = {
    "awareness":0,"affection":0,"ability":0
 
  }
  var peer_maxscore = {
    "awareness":0,"affection":0,"ability":0
 
  }
  var people_maxscore = {
    "awareness":0,"affection":0,"ability":0
 
  }
  var public_maxscore = {
    "awareness":0,"affection":0,"ability":0
 
  }

  var pers_score=0;
  var pers_max_score=0;
  var peer_score=0;
  var peer_max_score=0;
  var people_score=0;
  var people_max_score=0;
  var public_score=0;
  var public_max_score=0;

  for (i=0;i<$rootScope.assessment.length;i++) {
    switch ($rootScope.assessment[i].level) {
      case "Personal": pers_score+=$rootScope.assessment[i].score;
                      pers_max_score+=$rootScope.assessment[i].max_score
                       switch ($rootScope.assessment[i].category) {
                          case "Awareness":
                            pers_qualities.awareness+=$rootScope.assessment[i].score;
                            pers_maxscore.awareness+=$rootScope.assessment[i].max_score;
                            break;
                           case "Affection":
                           pers_qualities.affection+=$rootScope.assessment[i].score;
                            pers_maxscore.affection+=$rootScope.assessment[i].max_score;
                           
                            break;
                            case "Ability To Act":
                           pers_qualities.ability+=$rootScope.assessment[i].score;
                            pers_maxscore.ability+=$rootScope.assessment[i].max_score;
                            break;
                       };
                       break;
      case "Peer": peer_score+=$rootScope.assessment[i].score;
                      peer_max_score+=$rootScope.assessment[i].max_score
                      
                       switch ($rootScope.assessment[i].category) {
                          case "Awareness":
                            peer_qualities.awareness+=$rootScope.assessment[i].score;
                            peer_maxscore.awareness+=$rootScope.assessment[i].max_score;
                            break;
                           case "Affection":
                           peer_qualities.affection+=$rootScope.assessment[i].score;
                            peer_maxscore.affection+=$rootScope.assessment[i].max_score;
                           
                            break;
                            case "Ability To Act":
                           peer_qualities.ability+=$rootScope.assessment[i].score;
                            peer_maxscore.ability+=$rootScope.assessment[i].max_score;
                            
                            break;
                       };
                       break;
      case "People":people_score+=$rootScope.assessment[i].score;
                      people_max_score+=$rootScope.assessment[i].max_score
                      
                       switch ($rootScope.assessment[i].category) {
                          case "Awareness":
                            people_qualities.awareness+=$rootScope.assessment[i].score;
                            people_maxscore.awareness+=$rootScope.assessment[i].max_score;
                            
                            break;
                           case "Affection":
                           people_qualities.affection+=$rootScope.assessment[i].score;
                            people_maxscore.affection+=$rootScope.assessment[i].max_score;
                           
                            break;
                            case "Ability To Act":
                           people_qualities.ability+=$rootScope.assessment[i].score;
                          people_maxscore.ability+=$rootScope.assessment[i].max_score;
                            
                          break;
                       };
                       break;

      case "Public":public_score+=$rootScope.assessment[i].score;
                      public_max_score+=$rootScope.assessment[i].max_score
                      
                       switch ($rootScope.assessment[i].category) {
                          case "Awareness":
                            public_qualities.awareness+=$rootScope.assessment[i].score;
                            public_maxscore.awareness+=$rootScope.assessment[i].max_score;
                            
                            break;
                           case "Affection":
                           public_qualities.affection+=$rootScope.assessment[i].score;
                            public_maxscore.affection+=$rootScope.assessment[i].max_score;
                            
                            break;
                            case "Ability To Act":
                           public_qualities.ability+=$rootScope.assessment[i].score;
                            public_maxscore.ability+=$rootScope.assessment[i].max_score;
                            
                            break;
                       };
                       break;

                            
    }

  }

   $scope.Personal.push(pers_qualities.awareness/pers_maxscore.awareness *100,pers_qualities.affection/pers_maxscore.affection*100,pers_qualities.ability/pers_maxscore.ability*100);
$scope.Peer.push(peer_qualities.awareness/peer_maxscore.awareness*100,peer_qualities.affection/peer_maxscore.affection*100,peer_qualities.ability/peer_maxscore.ability*100);
   $scope.People.push(people_qualities.awareness/people_maxscore.awareness*100,people_qualities.affection/peer_maxscore.affection*100,people_qualities.ability/people_maxscore.ability*100);
   $scope.Public.push(public_qualities.awareness/public_maxscore.awareness*100,public_qualities.affection/peer_maxscore.affection*100,public_qualities.ability/public_maxscore.ability*100);
  
   $scope.overall=[pers_score/pers_max_score,peer_score/peer_max_score,people_score/people_max_score,public_score/public_max_score];


   //console.log($scope.Personal);
//check Overall acheivement


  $scope.rdata=[$scope.Personal,$scope.Peer,$scope.People,$scope.Public];
  $scope.rlabels=["Awareness","Affection","Ability To Act"];
  $scope.rseries=["Personal","Peer","People","Public"];
  $scope.roptions={
    scaleOverride: true,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: 10,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 10,
    // Number - The scale starting value
    scaleStartValue: 0
  }

var strength = [];
var awareness = [];
var affection =[];
var ability =[]

  awareness.push($scope.Personal[0],$scope.Peer[0],$scope.People[0],$scope.Public[0]);
  affection.push($scope.Personal[1],$scope.Peer[1],$scope.People[1],$scope.Public[1]);
ability.push($scope.Personal[2],$scope.Peer[2],$scope.People[2],$scope.Public[2]);



  var highest_awareness = Math.max.apply(Math, awareness);
  
  var strength_awareness=awareness.indexOf(highest_awareness);
  //console.log(highest_awareness+"/"+strength_awareness);
  var highest_affection = Math.max.apply(Math, affection);
   var strength_affection=affection.indexOf(highest_affection);
 // console.log(highest_affection+"/"+strength_affection);
 
  var highest_ability = Math.max.apply(Math, ability);
    var strength_ability=ability.indexOf(highest_ability);
  // console.log(highest_ability+"/"+strength_ability);
 
$scope.strength_awareness="";
$scope.strength_affection="";
$scope.strength_ability="";




switch (strength_awareness) {
    case 0:$scope.strength_awareness="Personal Awareness";
    $scope.strength_awareness_para="Being able to be aware of your own strength and weaknesses. Recognising that you are responsible for your own behaviour and be aware that it is important to manage your own life well first, before you are able to lead others. Always being reflective towards your own awareness and understanding.";
              break;
    case 1:$scope.strength_awareness="Peer Awareness";
             $scope.strength_awareness_para="Being able to be teachable and humble. Recognising that you can always learn from other members in your team. Being aware of the different personalities when you are working in a group and being aware of the team dynamics within the group.  Showing respect to every individual in your group and being aware of the practices of your friends from other ethnic and religious groups."; 
              break;
    case 2:$scope.strength_awareness="People Awareness";
             $scope.strength_awareness_para="Being aware that you have a shared responsibility in enhancing school experience, and that there are various platforms for you to contribute in CCA, in class, in VIA etc. In addition to that, being aware that volunteerism can help improve community, for example the lives of the elderly, the disabled, the disadvantaged children, and the environment.";
             break;
    case 3:$scope.strength_awareness="Public Awareness";
              $scope.strength_awareness_para="Being aware of current and global issues, and how its impact in Singapore. Being aware of the specific needs of the different sectors of community. For example, knowing the specific needs of the elderly, the disabled, the under-privilege children and the environment.In addition to that, being aware of the various specific community organisations (VWOs, NGOs) and the sectors in which they are actively serving in.";
              break;
          }
     switch (strength_affection) {
    case 0:$scope.strength_affection="Personal Affection";
            $scope.strength_affection_para="Being able to be distinguish between different emotions (e.g., fear, anger, shame and sadness) and more importantly, learning to manage them well. Continue to work towards building a healthy self-image, paying attention to how media is shaping your perception towards yourself. If you need help, you may seek help from school counsellor or from your parent. Continue to build on your self-efficacy, having the confidence to accomplish given task. Always being reflective towards your own feelings and emotions.";
            break;
              
    case 1:$scope.strength_affection="Peer Affection";
             $scope.strength_affection_para="Being able to build and maintain healthy friendship. Being sensitive to the feelings and needs of others and empathising with peers who are experiencing problems. Always showing respect to others and are willing to participate actively in school community projects.";
             break; 
    case 2:$scope.strength_affection="People Affection";
             $scope.strength_affection_para="Feeling morally responsible and morally obliged to volunteer your service to help others. Putting yourself in the shoes of the less privilege in our school and being able to feel for them. Committing yourself to build peers’ confidence and capability by helping them in class, in CCA and in VIA.";
             break; 
    case 3:$scope.strength_affection="Public Affection";
              $scope.strength_affection_para="Intrinsically motivated to volunteer in the community. Having a sense of personal satisfaction when you help others and being able to empathise with members of the community who are disadvantaged.";
              break;
          }
    switch (strength_ability) {
    case 0:$scope.strength_ability="Personal Ability To Act";
             $scope.strength_ability_para="Being able to seek appropriate help when necessary. Setting clear personal goals, be it in academic, in your future ambition, in CCA or in your leadership progression. When you are given multiple tasks, having the ability to set the right priority and stay on task to complete the assignments on time. Always being reflective towards your own action and reaction.";
             break;
    case 1:$scope.strength_ability="Peer Ability To Act";
              $scope.strength_ability_para="Being able to take initiative to help peers and teachers within the school community. (e.g. helping with homework, helping others in CCA, helping friends who are facing with issues). Working cooperatively in a team to complete tasks and projects in schools. You can achieve so by being open minded and see things from others’ perspectives.  Communicating effectively by being an active listener, be timely in your speech, and learn to speak confidently and concisely.";
              break;
    case 2:$scope.strength_ability="People Ability To Act";
              $scope.strength_ability_para="Being able to identify school needs and lead your peers to plan and implement initiatives to improve the school. For example leading in CCA, in school events, in class VIA etc. In addition to that, Identifying needs of the community and leading your schoolmates to plan and implement a VIA / service learning project to benefit the community.";
              break;
    case 3:$scope.strength_ability="Public Ability To Act";
              $scope.strength_ability_para="Being able to volunteer and contribute to the community beyond what is required by the school, even in overseas service learning projects. Having a passion for certain social causes that is close to your heart, advocating and influencing others towards the same cause.";
              break;
          }
   
var OrderBy = $filter('orderBy');
var sorted_awareness=OrderBy(awareness);
var lowest_awareness=awareness.indexOf(sorted_awareness[0]);
var secondlowest_awareness=awareness.indexOf(sorted_awareness[1]);
    switch (lowest_awareness) {
    case 0:$scope.lowest_awareness="Personal Awareness";
              break;
    case 1:$scope.lowest_awareness="Peer Awareness";
              break;
    case 2:$scope.lowest_awareness="People Awareness";
             break;
    case 3:$scope.lowest_awareness="Public Awareness";
              break;
          }
    switch (secondlowest_awareness) {
    case 0:$scope.secondlowest_awareness="Personal Awareness";
              break;
    case 1:$scope.secondlowest_awareness="Peer Awareness";
              break;
    case 2:$scope.secondlowest_awareness="People Awareness";
             break;
    case 3:$scope.secondlowest_awareness="Public Awareness";
              break;
          }
     
    
var sorted_affection=OrderBy(affection);
var lowest_affection=affection.indexOf(sorted_affection[0]);
var secondlowest_affection=affection.indexOf(sorted_affection[1]);
switch (lowest_affection) {
    case 0:$scope.lowest_affection="Personal Affection";
            break;
              
    case 1:$scope.lowest_affection="Peer Affection";
             break; 
    case 2:$scope.lowest_affection="People Affection";
             break; 
    case 3:$scope.lowest_affection="Public Affection";
              break;
          }

      switch (secondlowest_affection) {
    case 0:$scope.secondlowest_affection="Personal Affection";
            break;
              
    case 1:$scope.secondlowest_affection="Peer Affection";
             break; 
    case 2:$scope.secondlowest_affection="People Affection";
             break; 
    case 3:$scope.secondlowest_affection="Public Affection";
              break;
          }

var sorted_ability=OrderBy(ability);
var lowest_ability=ability.indexOf(sorted_ability[0]);
var secondlowest_ability=ability.indexOf(sorted_ability[1]);
switch (lowest_ability) {
    case 0:$scope.lowest_ability="Personal Ability To Act";
             break;
    case 1:$scope.lowest_ability="Peer Ability To Act";
              break;
    case 2:$scope.lowest_ability="People Ability To Act";
              break;
    case 3:$scope.lowest_ability="Public Ability To Act";
              break;
          }
    switch (secondlowest_ability) {
    case 0:$scope.secondlowest_ability="Personal Ability To Act";
             break;
    case 1:$scope.secondlowest_ability="Peer Ability To Act";
              break;
    case 2:$scope.secondlowest_ability="People Ability To Act";
              break;
    case 3:$scope.secondlowest_ability="Public Ability To Act";
              break;
          }

  $scope.achieved={
  "Pers":false,
  "Peer":false,
  "People":false,
  "Public":false,

};

  if ($scope.overall[0]>=0.7) {
    $scope.achieved.Pers=true;
  } 

  if ($scope.overall[1]>=0.7) {
    $scope.achieved.Peer=true;
  } 
   //console.log(pers_score/pers_max_score+"/"+peer_score/peer_max_score);
  if ($scope.overall[2]>=0.75) {
    $scope.achieved.People=true;
  } 

  if ($scope.overall[3]>=0.8) {
    $scope.achieved.Public=true;
  } 

  var max_achievement=Math.max.apply(Math, $scope.overall);
var highest_achievement=$scope.overall.indexOf(max_achievement);
//console.log(highest_achievement);
//console.log($scope.overall);
$scope.achievement="";
switch (true){
  case (highest_achievement==0 && $scope.achieved.Pers==true): $scope.achievement="Personal";
                                                                break;
                                          
   case (highest_achievement==1 && $scope.achieved.Peer==true): $scope.achievement="Peer";
                                         break;
     case (highest_achievement==2 && $scope.achieved.People==true): $scope.achievement="People";
                                          break;
     case (highest_achievement==3 && $scope.achieved.Public==true): $scope.achievement="Public";
                                           break;
      default: $scope.achievement="developing";
                          break;

}
//console.log($scope.achieved);
//console.log($scope.achievement);

   
})
.controller('profileCtrl',function ($scope,$rootScope,userService,Camera,$state,$ionicPopup){
$rootScope.loggedinuser=userService.loggedinuser();
$scope.new_image=false;
$scope.password_disabled=true;
$scope.user_image="http://www.pompipi.co/thots/apis/assets/images/avatars/"+$rootScope.loggedinuser.avatar;
$scope.getPhotoFromGallery = function() {
//console.log('getting image');
    var options = {
      quality: 90,
      destinationType: 0,
      sourceType: 0,
      //allowEdit: true,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
     
    Camera.getPicture(options).then(function(imageData) {
       $scope.new_image=true;
       $scope.user_image = "data:image/jpeg;base64,"+imageData;
      //console.log($scope.user_image);
      var preview=document.getElementById('preview');
       
       preview.src=$scope.user_image;
 

      //sessionStorage.setItem('pic',$scope.post.imageURI);
      
      
    }, function(err) {
      console.log(err);
    });
}
$scope.changeAvatar = function () {

  userService.changeAvatar($rootScope.loggedinuser.user_id,$scope.user_image)
  .success(function (data){
    var info=data.split('/');
    if (info[0]=="avatar changed"){
      var Popup=$ionicPopup.alert(
      {
        title:'Avatar Changed',
        content:'Your avatar has been changed!'
      });
      Popup.then (function(res){
        $rootScope.loggedinuser.avatar=info[1];
        localStorage.setItem('thots_user',JSON.stringify($rootScope.loggedinuser));
        $state.go('home.tab.home');
      })
    } else if (info[0]!="avatar changed"){
       var Popup=$ionicPopup.alert(
      {
        title:'Avatar Unchanged',
        content:'Your avatar has NOT been changed.'
      });
      Popup.then (function(res){
        //console.log(data);
      })
    }
  })
  .error(function(err){
    console.log(err);
  })
}
$scope.user={
  newpassword:'',confirmpassword:'',newUserName:''
};
  $scope.changeUserName = function () {
    //console.log($scope.newUserName);
    userService.changeUserName($rootScope.loggedinuser.user_id,$scope.user.newUserName)
    .success(function (data){
      //console.log(data);
      if (data=="Username changed"){
      var PopUp=$ionicPopup.alert({

        title:"Username changed",
        content: "Your username is now "+$scope.user.newUserName
      });
      PopUp.then(function (res){
        //console.log('name changed');
      })
    } else if (data!="Username changed"){
      var PopUp=$ionicPopup.alert({

        title:"Username Unchanged",
        content: "Your username is unchanged"
      });
      PopUp.then(function (res){
        //console.log('name unchanged');
      })
    }
    })
    .error(function (err){
      console.log(err);
    })
  }

  $scope.changeNewPassword = function () {

    //console.log($scope.user);
    if ($scope.user.newpassword==$scope.user.confirmpassword) {
      //console.log($scope.user.newpassword);
    userService.changePassword($rootScope.loggedinuser.user_id,$scope.user.newpassword)
    .success(function (data){
     
     if (data=="password changed"){
      var PopUp = $ionicPopup.alert(
      {
        title: "Password Changed",
        content: "Your password has been changed."
      }
        );

      PopUp.then (function (res){
         //console.log(data);
         $state.reload();
      })
    } else if (data!="password changed"){
      var PopUp = $ionicPopup.alert(
      {
        title: "Password Unchanged",
        content: "Your password is NOT changed."
      }
        );

      PopUp.then (function (res){
         //console.log(data);
         $state.reload();
      })

    }
    })
    .error(function (err){
      console.log(err);
    })

    } else if ($scope.user.newpassword!=$scope.user.confirmpassword) {
      var Popup = $ionicPopup.alert(
        {
          title: "Change Password Failed",
          content: "Passwords do not match. Try again"
        });
      Popup.then(function(res){
        if (res){
          $state.reload();
        }
      });

    }
  }

  $scope.checkPasswordMatch = function () {
    if ($scope.newpassword!=$scope.confirmpassword){
      $scope.message="Passwords do not match";
      //console.log($scope.message);
      //console.log($scope.newpassword +"/"+$scope.confirmpassword);
      $scope.password_disabled=true;
    } else if ($scope.newpassword==$scope.confirmpassword){
      $scope.message="Passwords match";
      //console.log($scope.newpassword +"/"+$scope.confirmpassword);
      //console.log($scope.message);
      $scope.password_disabled=false;
    }

  }

})


;
