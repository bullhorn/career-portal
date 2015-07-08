import 'angular';

class FileModel {

    constructor($parse) {
        this.$parse = $parse;
    }

    //#region Properties

    get require() {
        return 'ngModel';
    }

    get restrict() {
        return 'A';
    }

    //#endregion

    //#region Methods

    link(scope, element, attrs, ngModel) {
        var model = this.$parse(attrs.fileModel);
        var modelSetter = model.assign;

        ngModel.$render = function() {
            var fileName = element.val();

            if (fileName) {
                var index = fileName.lastIndexOf('\\');

                if (!index) {
                    index = fileName.lastIndexOf('/');
                }

                fileName = fileName.substring(index + 1);
            }

            ngModel.$setViewValue(fileName);
        };

        element.bind('change', function() {
            scope.$apply(function() {
                modelSetter(scope, element[0].files[0]);
                ngModel.$render();
            });
        });
    }

    //#endregion

}

export default [
    '$parse',
    ($parse) => {
        let fileModel = new FileModel($parse);

        return {
            require: fileModel.require,
            restrict: fileModel.restrict,
            link: function() { fileModel.link(...arguments); }
        };
    }
];
