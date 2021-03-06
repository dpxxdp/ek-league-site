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
