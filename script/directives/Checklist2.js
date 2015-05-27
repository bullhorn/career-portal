import 'angular';

class Checklist {

    constructor($parse, $compile) {
        this.$parse = $parse;
        this.$compile = $compile;
    }

    //#region Properties

    get restrict() {
        return 'A';
    }

    get priority() {
        return 1000;
    }

    get terminal() {
        return true;
    }

    get scope() {
        return true;
    }

    //#endregion

    //#region Methods

    contains(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    return true;
                }
            }
        }
        return false;
    }

    add(arr, item, comparator) {
        arr = angular.isArray(arr) ? arr : [];
        if (!this.contains(arr, item, comparator)) {
            arr.push(item);
        }
        return arr;
    }

    remove(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        return arr;
    }

    // http://stackoverflow.com/a/19228302/1458162
    postLinkFn(scope, elem, attrs) {
        // compile with `ng-model` pointing to `checked`
        this.$compile(elem)(scope);

        // getter / setter for original model
        var getter = this.$parse(attrs.checklistModel);
        var setter = getter.assign;
        var checklistChange = this.$parse(attrs.checklistChange);

        // value added to list
        var value = this.$parse(attrs.checklistValue)(scope.$parent);

        var comparator = angular.equals;

        if (attrs.hasOwnProperty('checklistComparator')) {
            comparator = this.$parse(attrs.checklistComparator)(scope.$parent);
        }

        // watch UI checked change
        scope.$watch('checked', function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            var current = getter(scope.$parent);
            if (newValue === true) {
                setter(scope.$parent, this.add(current, value, comparator));
            } else {
                setter(scope.$parent, this.remove(current, value, comparator));
            }

            if (checklistChange) {
                checklistChange(scope);
            }
        });

        var that = this;
        // declare one function to be used for both $watch functions
        function setChecked(newArr) {
            scope.checked = that.contains(newArr, value, comparator);
        }

        // watch original model change
        // use the faster $watchCollection method if it's available
        if (angular.isFunction(scope.$parent.$watchCollection)) {
            scope.$parent.$watchCollection(attrs.checklistModel, setChecked);
        } else {
            scope.$parent.$watch(attrs.checklistModel, setChecked, true);
        }
    }

    compile(tElement, tAttrs) {
        if (tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') {
            throw 'checklist-model should be applied to `input[type="checkbox"]`.';
        }

        if (!tAttrs.checklistValue) {
            throw 'You should provide `checklist-value`.';
        }

        // exclude recursion
        tElement.removeAttr('checklist-model');

        // local scope var storing individual checkbox model
        tElement.attr('ng-model', 'checked');

        return {
            post: this.postLinkFn
        };
    }

    //#endregion

}

export default [
    '$parse',
    '$compile',
    ($parse, $compile) => {
        let checklist = new Checklist($parse, $compile);

        return {
            restrict: checklist.restrict,
            priority: checklist.priority,
            terminal: checklist.terminal,
            scope: checklist.scope,
            compile: function() { checklist.compile(...arguments); }
        };
    }
];
