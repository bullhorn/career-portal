require.config({
    paths: {
        'angular': '/lib/angular/angular',
        'jquery': '/lib/jquery/jquery'
    },
    shim: {
        'angular': ['jquery']
    }
});

require(
    [],
    function() {
        'use strict';

        //#region Using

        alert('hello world!');
    }
);