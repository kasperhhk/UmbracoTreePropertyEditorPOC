angular.module("umbraco").controller("Test.Controller", [

    "$scope",
    "contentTypeResource",

    function ($scope, contentTypeResource) {

        var watches = [];

        $scope.model.value = $scope.model.value || [];
        $scope.current = unloadProp({});
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
                    $scope.current = unloadProp({});
                    $scope.propertyForm.$setDirty();
                };
            }
            lm.create = function (name) {
                if (!name)
                    return;

                var o = createModel(name);
                model.children.push(o);
                var nlm = createLocalModel(o, lm, true);
                lm.children.push(nlm);
                $scope.loadProp(nlm);
            };

            return lm;
        }

        function removeFromList(value, list) {
            var idx = list.indexOf(value);
            delete list[idx];
            list.splice(idx, 1);
        }

        function createModel(name) {
            return {
                value: undefined,
                name: name,
                children: []
            }
        }

        function unloadProp(obj) {
            obj.loaded = false;
            while (watches.length) {
                var w = watches.pop();
                w(); //deregister
            }
            return obj;
        }

        $scope.loadProp = function(localModel) {
            $scope.current = unloadProp(localModel);
            contentTypeResource.getPropertyTypeScaffold($scope.model.config.NCTestPrevalue)
                .then(function(result) {
                    $scope.current.property = result;
                    $scope.current.property.value = localModel.model.value;
                    var w = $scope.$watch(function() {
                            return $scope.current.property.value;
                        },
                        function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                localModel.model.value = newValue;
                            }
                        });
                    watches.push(w);
                    $scope.current.loaded = true;
                });
        };
    }
]);