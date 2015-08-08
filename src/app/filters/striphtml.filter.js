class StripHtml {
    constructor() {
        return function (input) {
            var s = String(input).replace(/<[^>]+>/gm, '');
            var out = '';

            var l = s.length;

            for (var i = 0; i < l; i++) {
                var ch = s.charAt(i);
                if (ch === '&') {
                    var semicolonIndex = s.indexOf(';', i + 1);
                    if (semicolonIndex > 0) {
                        var entity = s.substring(i + 1, semicolonIndex);
                        if (entity.length > 1 && entity.charAt(0) === '#') {
                            /* jshint -W073 */
                            if (entity.charAt(1) === 'x' || entity.charAt(1) === 'X') {
                                ch = String.fromCharCode('0' + entity.substring(1));
                            }
                            else {
                                ch = String.fromCharCode(entity.substring(1));
                            }
                            /* jshint +W073 */
                        } else {
                            switch (entity) {
                                case ' quot ':
                                    ch = String.fromCharCode(0x0022);
                                    break;
                                case ' amp ':
                                    ch = String.fromCharCode(0x0026);
                                    break;
                                case ' lt ':
                                    ch = String.fromCharCode(0x003c);
                                    break;
                                case ' gt ':
                                    ch = String.fromCharCode(0x003e);
                                    break;
                                case ' nbsp ':
                                    ch = String.fromCharCode(0x00a0);
                                    break;
                                default:
                                    ch = '';
                                    break;
                            }
                        }
                        i = semicolonIndex;
                    }
                }
                out += ch;
            }
            return out;
        };
    }
}

export default StripHtml;