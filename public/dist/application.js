'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'ekleague';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'luegg.directives'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles', ['ngAnimate']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('competitions');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('scrim-finder');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('teams');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
/*
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Posts', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'All Posts', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Post', 'articles/create');
	}
]);
*/

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);

'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$animate', '$timeout', 'Authentication', 'Articles', 'Comments',
	function($scope, $stateParams, $location, $animate, $timeout, Authentication, Articles, Comments) {
		$scope.authentication = Authentication;
		//if(authentication.user.color)
		//	$scope.userSelectedColor = authentication.user.color;

		var welcomeToTheSpot = [
			'Welcome to the Spot',
			'Your spot is now hit',
			'Cigarette spot, smoke em if you got em',
			'You are now a spot',
			'See spot play bongos',
			'There is no smoking in the spot',
			'Spotted leopards everywhere',
			'For all your spot hitting needs',
			'There once was a man from nantucket..',
			'I spy',
			'Somebody poisoned the other spot',
			'This is no child\'s spot',
			'This spot is worth two in the bush',
			'This is an open spot',
			'Small spot: handle with care',
			'The standard in out spot',
			'Your text spot studio',
			'A free spot',
		];
		$scope.WelcomeToTheSpot = welcomeToTheSpot[Math.floor(Math.random()*welcomeToTheSpot.length)];

		$scope.switchShowFull = function(repeatScope){
			repeatScope.showFull = !repeatScope.showFull;
		};

		$scope.userSelectedColor = 'Blue';
		$scope.colorsVisible = false;
		$scope.switchColorsVisible = function(){
			$scope.colorsVisible = !$scope.colorsVisible;
		};

		$scope.createVisible = false;
		$scope.switchCreateVisible = function(){
			$scope.createVisible = !$scope.createVisible;
		};

		$scope.simpleUI = false;
		$scope.switchSimpleUI = function(){
			$scope.simpleUI = !$scope.simpleUI;
		};

/*
		$scope.editBanner = false;
		$scope.switchEditBanner = function(){
			$scope.adminMode = !$scope.adminMode;
		};
*/

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});

			article.parent = 'top'; //by default the articles list only shows where parent = 'top'
			article.user = this.user;
			article.imageurl = this.imageurl;

			article.$save(function(response) {
				//$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
				$scope.imageurl= '';
				$scope.articles.unshift(article); //push it to the display
				$scope.createVisible = !$scope.createVisible;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.createComment = function(parentId) {
			var article = new Articles({
				//parent: this.parentId,
				//title: $scope.parentId.toString(),
				content: this.content
			});
			article.title = 'comment';
			article.parent = $scope.article._id; //this.parentId;
			article.$save(function(response) {
				//$location.path('articles/' + response._id);

				//$scope.title = '';
				$scope.content = '';
				$scope.comments.unshift(article); //display the new comment
				$scope.showComment = !$scope.showComment;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//init the comment field to hidden on load
		$scope.showComment = false;
		$scope.showcomment = function(){
			$scope.showComment = !$scope.showComment;
		};

		$scope.remove = function(article) {
			$scope.confirmDelete = false;
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.kismet = function(article, articleScope) {
			if(!article)
			{
				article = $scope.article;
			}
			article.kismet += 1;
			article.$kismet(function() {
				//$location.path('articles/' + article._id);
			}, function(errorResponse) {
				article.kismet -= 1;
				articleScope.thisError = errorResponse.data.message;
				articleScope.showError=true;
				$timeout(function(){
					articleScope.showError=false;
				},2000);
			});
		};

		$scope.unkismet = function() {
			var article = $scope.article;

			article.kismet -= 1;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.sortBy = 'created';
		$scope.sortDesc = true;
		$scope.sortAndUpdate = function(sorter){
			if(sorter==='reverse')
				$scope.sortDesc = !$scope.sortDesc;
			else
			{
				$scope.sortBy = sorter;
			}

			$scope.find();
		};

		//$scope.now = Date.now();
		//$scope.fuck = 'ug'; //$scope.articles[1].created;
		//$scope.check = $scope.dateDiffInDays(now,$scope.articles[1].created);

		$scope.dateDiffInDays = function (a, b) {
			var _MS_PER_DAY = 1000 * 60 * 60 * 24;
			// Discard the time and time-zone information.
			var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
			return (utc2 - utc1) / _MS_PER_DAY;
			//return Math.floor((utc2 - utc1) / _MS_PER_DAY);
		};

/*
		$scope.sortArticles = function(){
			articles.sort(function(a,b){
				var ageA = Date.Now - a.created;
				var ageB = Date.Now - b.created;

				if(a.Created)
			})
		}
*/
		$scope.find = function() {
			//$scope.articles = Articles.query();
			$scope.articles = Articles.list({sortBy:($scope.sortDesc?'-':'') + $scope.sortBy});
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
			$scope.comments = //['one','two','three'];
			Comments.query({
				parentId: $stateParams.articleId
			});
		};

	}
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles')
	.factory('Articles', //the name of the resource Class
	['$resource',
	function($resource) {
		return $resource('articles/:articleId',
		{
			articleId: '@_id',
		},
		{
			update: {
				method: 'PUT'
			},
			kismet: {
				method: 'POST',
				params: {
					jsonrpc:'2.0',
					method:'send_kismet',
					params:{amt:1},
					id:Date.now,
				}
			},
			list: {
				method: 'GET',
				isArray: true,
				params: {
					sortBy: '@sortBy' //$scope.sorter
				}
			}
		});
	}
]);


//Comments service used for communicating with the articles REST endpoints
angular.module('articles')
	.factory('Comments', //the name of the resource Class
	['$resource',
	function($resource) {
		return $resource('comments/:parentId',
		{
			parentId: '@parent',
		});
	}
]);

'use strict';

// Setting up route
angular.module('competitions').config(['$stateProvider',
function($stateProvider) {

  $stateProvider.
  state('competitions', {
    url: '/competitions',
    templateUrl: 'modules/competitions/views/competitions.client.view.html'
  });

  $stateProvider.
  state('manage-comps', {
    url: '/manage-comps',
    templateUrl: 'modules/competitions/views/manage-comps.client.view.html'
  });

  $stateProvider.
  state('comp-detail', {
    url: '/competitions/:compId',
    templateUrl: 'modules/competitions/views/comp-detail.client.view.html'
  });

}
]);

'use strict';

angular.module('competitions').controller('CompController', ['$scope', '$stateParams', 'Authentication', 'Competitions', 'Rankings', 'Teams',
function($scope, $stateParams, Authentication, Competitions, Rankings, Teams) {
  $scope.authentication = Authentication;

  $scope.createComp = function() {
    var comp = new Competitions({
      name: this.compName,
      banner: this.compBanner,
      description: this.compDesc
    });

    comp.$save(function(response) {
      $scope.compName = '';
      $scope.compBanner = '';
      $scope.compDesc = '';
      $scope.listComps();
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  $scope.gatherCompData = function(compId) {
    if(compId) $scope.selectedComp = compId;
    else $scope.selectedComp = $stateParams.compId;
    $scope.getComp();
    $scope.listRankings();
  }

  $scope.listComps = function() {
    $scope.competitions = Competitions.query();
    $scope.listTeams();
  };

  $scope.getComp = function() {
    $scope.comp = Competitions.get({ compId: $scope.selectedComp });
  };

  $scope.saveComp = function() {
    if($scope.comp)
    {
      //$scope.comp.maps.push({map: 'a', imageurl: 'b'});
      //console.log("update");
      //$scope.comp.maps.push({map: $scope.mapName, imageurl: $scope.mapImage});
      $scope.comp.$save({},function(){
        $scope.listComps();
      });
    }
  };

  $scope.listTeams = function() {
    //$scope.teams = Teams.query();
    $scope.teams = Teams.list({sortBy:'lowername'});
  };

  $scope.listRankings = function() {
    $scope.rankings = Rankings.list({compId: $scope.selectedComp, sortBy:'wins'})
  };

  $scope.addTeamToComp = function() {
    if(this.selectedComp && this.selectedTeam)
    {
      var team = new Rankings({
        competition: this.selectedComp,
        team: this.selectedTeam._id,
      });

      team.$save(function(response) {
        $scope.success = 'Team Added';
        $scope.listRankings();
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }
  };

	$scope.delete = function(comp) {
		$scope.confirmDelete = false;
		if (comp) {
			comp.$remove(function(){
  			for (var i in $scope.competitions) {
  				if ($scope.competitions[i]._id === $scope.comp._id) {
  					$scope.competitions.splice(i, 1);
  				}
  			}
        $scope.comp=null;
        $scope.rankings=null;
      });
		}
	};


}
]);

'use strict';

angular.module('competitions')
  .factory('Competitions', //the name of the resource Class
  ['$resource',
  function($resource) {
    return $resource('competitions/:compId',
    {
      compId: '@_id',
    });
}
]);

'use strict';

angular.module('competitions')
  .factory('Rankings', //the name of the resource Class
  ['$resource',
  function($resource) {
    return $resource('rankings/:compId',
    {
      rankId: '@_id',
    },
    {
      list: {
        method: 'GET',
        isArray: true,
        params: {
          sortBy: '@sortBy'
        }
      }
    });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		});

		$stateProvider.
		state('about', {
			url: '/about',
			templateUrl: 'modules/core/views/about.client.view.html'
		});

	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$sce', '$rootScope', '$timeout', 'Authentication', 'Settings', 'Menus',
	function($scope, $sce, $rootScope, $timeout, Authentication, Settings, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');



    $scope.targetDate = new Date(2015, 2, 7, 12);
    $scope.now = new Date();
		$scope.showCountdownLogin = false;

    function dateDiff(now, later) {
      var diffMs = later - now;

      var secMs = 1000;
      var minMs = secMs * 60;
      var hourMs = minMs * 60;
      var dayMs = hourMs * 24;

      var diffDays = Math.floor(diffMs / dayMs);
      var diffHours = Math.floor((diffMs % dayMs) / hourMs);
      var diffMins = Math.floor((diffMs % hourMs) / minMs);
      var diffSec = Math.floor((diffMs % minMs) / secMs);

      return {
        day: diffDays.toString(),
        hour: diffHours.toString(),
        min: diffMins.toString(),
        sec: diffSec.toString()
        }
    }

    $scope.counter = dateDiff($scope.now, $scope.targetDate);

    $scope.onTimeout = function(){
        $scope.now = new Date();
        $scope.counter = dateDiff($scope.now, $scope.targetDate);
        mytimeout = $timeout($scope.onTimeout,1000);
    }
    var mytimeout = $timeout($scope.onTimeout,1000);



		$rootScope.adminMode = false;
		$scope.switchAdminMode = function(){
			$rootScope.adminMode = !$rootScope.adminMode;
		};

		$scope.editBanner = false;
		$scope.switchEditBanner = function(){
			$scope.editBanner = !$scope.editBanner;

			if($scope.newBanner && $scope.newBanner !== '')
			{
				Settings.update({settingName:'bannerScroll', settingValue:$scope.newBanner});

				$scope.bannerHtml =
					$sce.trustAsHtml('<marquee class="top-scroll" behavior="scroll" direction="left">'
					+$scope.newBanner
					+'</marquee>');
				$scope.newBanner='';
			}
		};

		$scope.getBanner = function() {
			Settings.get({settingName:'bannerScroll'},
				function(response){
					$scope.bannerHtml =
						$sce.trustAsHtml('<marquee class="top-scroll" behavior="scroll" direction="left">'
						+response.value
						+'</marquee>');
				}
			);
		}

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Comments service used for communicating with the articles REST endpoints
angular.module('core')
.factory('Settings', //the name of the resource Class
['$resource',
function($resource) {
  return $resource('settings',
  {
    settingId: '@_id',
  },
  {
    update: {
      method: 'PUT',
      params: {
        settingName: '@settingName',
        settingValue: '@settingValue'
      }
    }
  }
  );}
]);

'use strict';

// Setting up route
angular.module('scrim-finder').config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider.
  state('scrim', {
    url: '/scrim',
    templateUrl: 'modules/scrim-finder/views/scrim.client.view.html'
  });

}
]);

'use strict';

angular.module('scrim-finder').controller('ScrimController', ['$scope', '$rootScope', 'Authentication', 'Scrims', 'SocketIO',
function($scope, $rootScope, Authentication, Scrims, SocketIO) {

  // This provides Authentication context.
  $scope.authentication = Authentication;
  $scope.chatMessages = [];

  $scope.createVisible = false;
  $scope.switchCreateVisible = function(){
    $scope.createVisible = !$scope.createVisible;
  };

  $scope.createScrim = function() {
    var scrim = new Scrims({
      team: this.team,
      map: this.map,
      format: this.format,
      notes: this.notes,
      imageurl: Authentication.user.avatar
    });

    scrim.$save(function(response) {
      //$location.path('articles/' + response._id);
      $scope.switchCreateVisible();

      $scope.team = '';
      $scope.map = '';
      $scope.format = '';
      $scope.notes = '';
      $scope.scrims.unshift(scrim); //push it to the display
      //$scope.createVisible = !$scope.createVisible;
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  $scope.sendChat = function(msg) {
    if($scope.chatMsg !== '')
    {
      SocketIO.emit('scrim-chat', { user: Authentication.user.username, message:msg});
      //$scope.chatMessages.push(msg);
      $scope.chatMsg='';
    }
  };

  $scope.initialize = function(){
    console.log('initializing..');
    console.log('scope: ' + $scope.$id)
    SocketIO.emit('initialize chat');
    $scope.scrims = Scrims.query();
  };

  /*
    if you leave the scrim page and return, the scrim controller
    is destroyed and recreated, but the original event listener
    for chat messages still exists, so now you've got two. They
    keep multiplying as you leave and return to the scrim page.

    Must cleanup listeners when the scope is destroyed! */
  $scope.$on('$destroy', function() {
    if(clearScrimChatListener) {
      clearScrimChatListener();
    }
    if(clearInitlistener) {
      clearInitlistener();
    }
    console.log('destroying scope '+$scope.$id);
  });

  var clearScrimChatListener = SocketIO.on('chat message', function(msg){
    $scope.chatMessages.push(msg);
    //console.log('chat message:  ' + JSON.stringify(msg));
    //console.log('check: ' + JSON.stringify($scope.chatMessages));
    //console.log('scope: ' + $scope.$id);
  });

  var clearInitlistener = SocketIO.on('initialize chat', function(res){
    //console.log('init chat');
    $scope.chatMessages = res;
  });

}
]);

'use strict';

//Comments service used for communicating with the articles REST endpoints
angular.module('scrim-finder')
.factory('Scrims', //the name of the resource Class
['$resource',
function($resource) {
  return $resource('scrims/:postId',
{
  postId: '@_id',
});
}
]);

angular.module('scrim-finder')
  .factory('SocketIO', ['$rootScope', function ($rootScope) {
  var socket = io(); //references script file loaded in layout html.

  return{

    on: function (eventName, callback) {

      socket.on(eventName, wrapper);

      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }

      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }

  };
}]);

'use strict';

// Setting up route
angular.module('teams').config(['$stateProvider',
	function($stateProvider) {

		// Teams state routing
		$stateProvider.
		state('listTeams', {
			url: '/teams',
			templateUrl: 'modules/teams/views/grid-teams.client.view.html'
		});

		$stateProvider.
		state('createTeam', {
			url: '/teams/create',
			templateUrl: 'modules/teams/views/create-team.client.view.html'
		});

		$stateProvider.
		state('viewTeam', {
			url: '/teams/:teamId',
			templateUrl: 'modules/teams/views/team-bio.client.view.html'
		});

		$stateProvider.
		state('editTeam', {
			url: '/teams/:teamId/edit',
			templateUrl: 'modules/teams/views/edit-team.client.view.html'
		});
	}
]);

'use strict';

angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', '$animate', '$timeout', 'Authentication', 'Teams',
	function($scope, $stateParams, $location, $animate, $timeout, Authentication, Teams) {
		$scope.authentication = Authentication;
		//if(authentication.user.color)
		//	$scope.userSelectedColor = authentication.user.color;

		$scope.joinTeam = function() {
			if(Authentication.user && $scope.team && $scope.team.members.indexOf(Authentication.user._id) === -1)
			{
				//$scope.team.members.push(Authentication.user._id);
				$scope.team.$save({newMember: Authentication.user._id},
					function(team){
						$scope.team = team;
					});
			}
		};

		$scope.quitTeam = function() {
			if(Authentication.user && $scope.team && $scope.team.members.indexOf(Authentication.user._id) !== -1)
			{
				//$scope.team.members.push(Authentication.user._id);
				$scope.team.$save({removeMember: Authentication.user._id},
					function(team){
						$scope.team = team;
					});
			}
		};


		$scope.createVisible = false;
		$scope.switchCreateVisible = function(){
			$scope.createVisible = !$scope.createVisible;
		};

		$scope.create = function() {
			var team = new Teams({
				name: this.name,
				description: this.description
			});

			team.user = this.user;
			team.imageurl = this.imageurl;

			team.$save(function(response) {
				//$location.path('teams/' + response._id);
				$location.path('teams/' + response._id);
				$scope.name = '';
				$scope.description = '';
				$scope.imageurl= '';
				$scope.teams.unshift(team); //push it to the display
				$scope.hideCreateForm();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.delete = function(team) {
			$scope.confirmDelete = false;
			if (team) {
				team.$remove();

				for (var i in $scope.teams) {
					if ($scope.teams[i] === team) {
						$scope.teams.splice(i, 1);
					}
				}
			} else {
				$scope.team.$remove(function() {
					$location.path('teams');
				});
			}
		};


		$scope.update = function() {
			var team = $scope.team;

			team.$update(function() {
				$location.path('teams/' + team._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.sortBy = 'created';
		$scope.sortDesc = true;
		$scope.sortAndUpdate = function(sorter){
			if(sorter==='reverse')
				$scope.sortDesc = !$scope.sortDesc;
			else
			{
				$scope.sortBy = sorter;
			}

			$scope.find();
		};

		//$scope.now = Date.now();
		//$scope.fuck = 'ug'; //$scope.teams[1].created;
		//$scope.check = $scope.dateDiffInDays(now,$scope.teams[1].created);

		$scope.dateDiffInDays = function (a, b) {
			var _MS_PER_DAY = 1000 * 60 * 60 * 24;
			// Discard the time and time-zone information.
			var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
			return (utc2 - utc1) / _MS_PER_DAY;
			//return Math.floor((utc2 - utc1) / _MS_PER_DAY);
		};

/*
		$scope.sortTeams = function(){
			teams.sort(function(a,b){
				var ageA = Date.Now - a.created;
				var ageB = Date.Now - b.created;

				if(a.Created)
			})
		}
*/
		$scope.find = function() {
			//$scope.teams = Teams.query();
			$scope.teams = Teams.list({sortBy:($scope.sortDesc?'-':'') + $scope.sortBy});
		};

		$scope.findOne = function() {
			$scope.team = Teams.get({
				teamId: $stateParams.teamId
			});
		};

	}
]);

'use strict';

//Teams service used for communicating with the teams REST endpoints
angular.module('teams')
	.factory('Teams', //the name of the resource Class
	['$resource',
	function($resource) {
		return $resource('teams/:teamId',
		{
			teamId: '@_id',
		},
		{
			update: {
				method: 'PUT'
			},
			list: {
				method: 'GET',
				isArray: true,
				params: {
					sortBy: '@sortBy' //$scope.sorter
				}
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;
			$scope.clicked = 'processing request';

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);