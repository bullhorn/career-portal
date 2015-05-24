require.config({
    paths: {
        'angular': '/lib/angular/angular',
        'angular-animate': '/lib/angular-animate/angular-animate',
        'angular-route': '/lib/angular-route/angular-route',
        'angular-sanitize': '/lib/angular-sanitize/angular-sanitize',
        'jquery': '/lib/jquery/jquery'
    },
    shim: {
        'angular': ['jquery'],
        'angular-animate': ['angular'],
        'angular-route': ['angular'],
        'angular-sanitize': ['angular']
    }
});

require(['./Program'], Program => Program.run());
