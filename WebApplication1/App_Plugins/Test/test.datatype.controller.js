angular.module("umbraco").controller("Test.Datatype", [

    "$scope",
    "contentTypeResource",

    function ($scope, dataTypeResource) {
        $scope.opts = dataTypeResource.getAll().map(function(d) { return { value: d.Id, name: d.Name }; });
    }
]);