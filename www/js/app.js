// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directives','ngMessages','chart.js','ionicLazyLoad'])
.constant('ApiEndPoint', {
  url: "http://www.pompipi.co/thots/apis/index.php/"
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})
.run(function($http) {
  $http.defaults.headers.common['Authorization'] = 'Basic' + 'alakazam'
})
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = false;
}])
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    

  // Each tab has its own nav history stack:
.state('login',{
  url:'/login',
  templateUrl:"templates/login.html",
  controller:'loginCtrl'
})
.state('home',{
url:'/home',
abstract:true,
templateUrl: 'templates/home.html',
controller:'HomeCtrl'
})

.state('home.tab', {
    url: "/tab",
    abstract: true,
    views: {
      'main': {
        templateUrl: "templates/tabs.html",
    controller:'tabsCtrl'
      }
    }
    
  })
  .state('home.tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('home.tab.mythots', {
    url: '/mythots',
    views: {
      'tab-mythots': {
        templateUrl: 'templates/tab-mythots.html',
        controller: 'myThotsCtrl'
      }
    }
  })

  .state('home.tab.thots', {
      url: '/thots',
      abstract:true,
      views: {
        'tab-snap': {
          templateUrl: 'templates/thots.html',
          controller: 'thotsCtrl'
        }
      }
    })


  .state('home.tab.thots.home', {
    url: "/home",
    views: {
      'thotsHome': {
    templateUrl: "templates/thots_home.html",
    controller:'thotsCtrl'
  }
  }
  })
  .state('home.tab.thots.assignments', {
    url: "/assignments",
    views: {
      'thotsHome': {
    templateUrl: "templates/assignments.html",
    controller:'assignmentCtrl'
    }
  }
  })
  .state('home.tab.thots.survey', {
    url: "/survey",
    views: {
      'thotsHome': {
    templateUrl: "templates/survey.html",
    controller:'assignmentCtrl'
    }
  }
  })
  .state('home.tab.thots.write', {
    url: "/write/:assignmentID",
    views: {
      "thotsHome": {
    templateUrl: "templates/write.html",
    controller:'thotsCtrl'
    }
  }
  })
  .state('home.assessment',{
    url:"/assessment",
    views: {
      'main':{
         templateUrl:"templates/assessment.html",
    controller:"assessmentCtrl"
      }
    }
   
})
   .state('home.report',{
    url:"/report",
    views: {
      'main':{
         templateUrl:"templates/assessment_report.html",
    controller:"reportCtrl"
      }
    }
   
})
   .state('home.myprofile',{
    url:"/myprofile",
    views: {
      'main':{
         templateUrl:"templates/profile.html",
    controller:"profileCtrl"
      }
    }
   
})
   .state('home.about',{
    url:"/about",
    views: {
      'main':{
         templateUrl:"templates/about.html",
    controller:"HomeCtrl"
      }
    }
   
})

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
