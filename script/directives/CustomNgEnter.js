import 'angular';

class CustomNgEnter {

    //#region Methods

    link(scope, element, attrs) {
        //!!! this is firing twice (once for down, once for press)! should it be???
        element.bind("keydown keypress", event => {
            if (event.which === 13) {
                scope.$apply(() => scope.$eval(attrs.customNgEnter, { 'event': event }));
                event.preventDefault();
            }
        });
    }

    //#endregion

}

export default [
    () => new CustomNgEnter()
];
