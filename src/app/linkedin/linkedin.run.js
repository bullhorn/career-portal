function linkedInRun ($http, $log) {
    'ngInject';
    $http.get('./app.json').then(appConfig => {
        if (appConfig.data) {
            var liClientId = appConfig.data.integrations.linkedin.clientId,
                script,
                head;
            if (liClientId !== '[ CLIENTID HERE ]' || liClientId.length === 14) {
                script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', '//platform.linkedin.com/in.js');
                script.text = 'api_key: ' + liClientId;
                head = document.querySelector('head');
                head.appendChild(script);
            }
        } else {
            $log.error('App\'s app.json did not load correctly.');
        }
    });
}

export default linkedInRun;
