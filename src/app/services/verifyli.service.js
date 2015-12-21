class VerifyLI {
    constructor(configuration) {
        'ngInject';
        this.configuration = configuration;
        this.verified = this.verifyLinkedInIntegration();
    }

    verifyLinkedInIntegration () {
        var clientId = this.configuration.integrations.linkedin.clientId || '';
        if (clientId === '' || clientId === '[ CLIENTID HERE ]' || clientId.length !== 14) {
            return false;
        }
        return true;
    }

}

export default VerifyLI;
