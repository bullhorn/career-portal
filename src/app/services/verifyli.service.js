class VerifyLI {
    constructor(configuration) {
        'ngInject';
        this.configuration = configuration;
        this.verified = this.verifyLinkedInIntegration();
    }

    verifyLinkedInIntegration () {
        var clientId = this.configuration.integrations.linkedin.clientId || '';
        return !(clientId === '' || clientId === '[ CLIENTID HERE ]' || clientId.length < 11 || clientId.length > 20);
    }

}

export default VerifyLI;
