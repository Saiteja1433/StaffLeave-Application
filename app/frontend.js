
var app = angular.module('myApp', ["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "login.html"
    })
    .when("/user", {
      templateUrl: "home.html",
      controller: "myCtrl"
    })
    .when("/admin", {
      templateUrl: "adminHand.html",
      controller: "adminCntrl"
    });
});



app.controller('myCtrl', function ($scope, $http, $rootScope, $location) {
  $scope.lists = [];
  $scope.goToLink = function (list) {
    console.log(list);
  }
  $scope.login = function (user) {
    $http.post("http://localhost:3178/staffLog", user)
      .then(function (res) {
        $scope.lists.push(res.data);
        if ($scope.lists[0].data1[0].password == user.passwords && $scope.lists[0].data1[0].password != "saiteja") {
          if ($scope.lists[0].data1[0].password == user.passwords) {
            $rootScope.userinfo = $scope.lists[0].data1;
            $rootScope.userreq = $scope.lists[0].data2;
            var arr = [];
            var arr = ($rootScope.userreq).slice();
            if (arr.length == 0) {
              $rootScope.leavereq = true;
              $rootScope.pending = false;
            } else {
              var len = ($rootScope.userreq).length;
              len = len - 1;
              var st = $rootScope.userreq[len].status;
              if (st !== "Pending") {
                $rootScope.leavereq = true;
                $rootScope.pending = false;
              }
              else {
                $rootScope.leavereq = false;
                $rootScope.pending = true;
              }
            }
            if ($location.path('/')) {
              $location.path('user');
            }
          }
        }
        else {
          if ($scope.lists[0].data1[0].password == user.passwords) {
            console.log($scope.lists[0].data1);
            $rootScope.userinfo = $scope.lists[0].data1;
            $location.path('admin');
          }
          else {
            alert("You entered WRONG Password!");
          }
        }
      });
  };



  $scope.insertMsg = function (msg, dat, noofdays) {
    console.log($rootScope.userreq);
    $scope.leavereq = false;
    $scope.pending = true;
    var finalData = {
      staffid: dat[0].staffid,
      name: dat[0].name,
      leavesleft: dat[0].leavesremaining,
      leavesused: dat[0].leavesused,
      msg: msg,
      noofdays: parseInt(noofdays)
    }
    console.log(finalData.leavesused);
    var addData = {
      reason: msg,
      status: "Pending",
      noofdays: noofdays,
      data: dat
    }
    $rootScope.userreq.splice(0, 0, addData);
    $http.post('/leaveApp', finalData).then(function (response) {
    });
  }

});


app.controller('adminCntrl', function ($scope, $http, $rootScope, $location) {
  $scope.requests = true;
  $scope.register = false;
  $http.post('/admin').then(function (response) {
    if (response) {
      $scope.lica = response.data;
      $scope.msg = response.data;
    }
  })


  $scope.registerFac = function () {
    $scope.register = true;
    $scope.requests = false;
    $scope.facilitydetails = false;
  }

  $scope.cancel = function () {
    $scope.register = false;
    $scope.requests = true;
    $scope.facilitydetails = false;
  }

  $scope.showdetails = function () {
    $scope.register = false;
    $scope.requests = false;
    $scope.facilitydetails = true;
    $http.post('/displaydetails').then(function (response) {
      if (response) {
        $scope.facdetails = response.data;
      }

    }
    )
  }

  $scope.registerfacility = function (name, staffid, password, mobileno) {
    $scope.showerr = false;
    var details = {
      name: name,
      staffid: staffid,
      password: password,
      mobileno: parseInt(mobileno)
    }
    $http.post('/registerfac', details).then(function (response) {
      $scope.lists = response.data;
      if (response.data.errno == 1062) {
        $scope.register = true;
        $scope.requests = false;
        $scope.showerr = true;
      } else {
        $scope.register = false;
        $scope.showerr = false;
        $scope.requests = true;
      }
    });
  }

  $scope.desicion = function (sno, num) {
    var finalDecision = {
      sno: sno.sno,
      num: num,
      details: sno
    }
    console.log
    var index = $scope.msg.findIndex((dd) => dd.sno === sno.sno);
    $scope.msg.splice(index, 1);
    $http.post('/makeDec', finalDecision).then(function (response) {
      $scope.lists = response.data;
      $location.path('admin');
    });

  }
})


