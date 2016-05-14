angular.module("umbraco").controller("Test.Datatype", [

    "$scope",
    "dataTypeResource",

    function ($scope, dataTypeResource) {

        $scope.update = function () {
            $scope.model.value = $scope.select.id;
        };

        dataTypeResource.getAll()
            .then(function (result) {
                $scope.opts = [{ name: "--choose--", id: 0 }].concat(result);
                $scope.select = $scope.opts.find(function (c) { return c.id + "" === $scope.model.value });
            });
    }
]);