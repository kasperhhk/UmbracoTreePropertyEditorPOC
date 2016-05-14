angular.module("umbraco").controller("Test.Controller", [

    "$scope",
    "contentTypeResource",

    function ($scope, contentTypeResource) {

        $scope.model.value = $scope.model.value || [];
        $scope.property = unloadProp();
        $scope.structure = createLocalStructure();

        $scope.addRoot = function() {
            var o = createModel();
            $scope.model.value.push(o);
            loadProp(o);
        };

        function createLocalStructure() {
            return createLocalModel({ children: $scope.model.value }, null, false);
        }

        function createLocalModel(model, parent, canDelete) {
            var lm = {
                model: model,
                children: []
            };
            if (model.children) {
                lm.children = model.children.map(function(c) {
                    return createLocalModel(c, lm, true);
                });
            }

            if (canDelete) {
                lm.delete = function() {
                    removeFromList(model, parent.model.children);
                    removeFromList(lm, parent.children);
                };
            }
            lm.create = function() {
                var o = createModel();
                model.children.push(o);
                lm.children.push(createLocalModel(o, lm, true));
            };
        }

        function removeFromList(value, list) {
            var idx = list.findIndex(value);
            delete list[idx];
            list.splice(idx, 1);
        }

        function createModel() {
            return {
                value: undefined,
                children: []
            }
        }

        function unloadProp() {
            return { loaded: false };
        }

        function loadProp(model) {
            $scope.property = unloadProp();
            contentTypeResource.getPropertyTypeScaffold($scope.model.config.NCTestPrevalue)
            .then(function (result) {
                $scope.property = result;
                $scope.property.value = model.value;
                $scope.$watch(function() {
                        return $scope.property.value;
                    },
                    function(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            model.value = newValue;
                        }
                    });
                $scope.property.loaded = true;
            });
        }
    }
]);