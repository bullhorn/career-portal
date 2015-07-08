require.config({
    paths: {
        'angular': '/lib/angular/angular',
        'angular-animate': '/lib/angular-animate/angular-animate',
        'angular-route': '/lib/angular-route/angular-route',
        'angular-sanitize': '/lib/angular-sanitize/angular-sanitize',
        'checklist-model': '/lib/checklist-model/checklist-model',
        'jquery': '/lib/jquery/jquery'
    },
    shim: {
        'angular': ['jquery'],
        'angular-animate': ['angular'],
        'angular-route': ['angular'],
        'angular-sanitize': ['angular'],
        'checklist-model': ['angular']
    }
});

require(['./Program'], Program => Program.run());
