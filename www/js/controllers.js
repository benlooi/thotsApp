angular.module('starter.controllers', [])
.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})
.controller('tabsCtrl', function($scope,Camera,$state) {
  
    
  

  })
.controller('HomeCtrl', function($scope,postService,$ionicModal) {

  postService.getPosts()
  .success(function (data){
    $scope.posts=data;
  })
  .error(function (err){

    console.log(err);
  })


   $ionicModal.fromTemplateUrl('templates/comments_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.postComment = function(post) {
    console.log(post);
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
})
.controller('SnapCtrl', function ($scope,Camera,$ionicModal,$ionicPopup,$timeout){


  $scope.getPhoto = function() {

    var options = {
      quality: 75,
      //destinationType: Camera.DestinationType.DATA_URL,
      //sourceType: Camera.PictureSourceType.CAMERA,
      //allowEdit: true,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    
    Camera.getPicture(options).then(function(imageData) {
       $scope.imageURI = imageData;
      
      $state.go('tab.snap');
      sessionStorage.setItem('pic',$scope.imageURI);
      console.log(imageData);

    }, function(err) {
      console.err(err);
    });
  };

  $scope.getPhotoFromGallery = function() {

    var options = {
      quality: 75,
      //destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      //allowEdit: true,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    
    Camera.getPicture(options).then(function(imageData) {
       $scope.imageURI = imageData;
      
      $state.go('tab.snap');
      sessionStorage.setItem('pic',$scope.imageURI);
      console.log(imageData);

    }, function(err) {
      console.err(err);
    });
  };

$scope.image=sessionStorage.getItem('pic');

$scope.counter=1;
 $ionicModal.fromTemplateUrl('templates/comments_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.postComment = function(post) {
    console.log(post);
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
  console.log($scope.counter);
}
$scope.prevQn = function () {
  $scope.counter --;
  console.log($scope.counter);
}

 //popup
 $scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: 'Select Image from...',
    title: 'Select Image',
    subTitle: 'Gallery or Camera',
    scope: $scope,
    buttons: [
      { text: 'Gallery',
    onTap: function(e) {
          $scope.getPhotoFromGallery();
        }
       },
      {
        text: 'Camera',
        type: 'button-positive',
        onTap: function(e) {
          $scope.getPhoto();
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 3000);
 };
})

.controller('assignmentCtrl', function ($scope,messageService){
  messageService.getMessages()
  .success(function (data){
    $scope.messages=data;
    console.log(data);

  })
  .error (function (err){
    console.log(err);
  })


  })
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
