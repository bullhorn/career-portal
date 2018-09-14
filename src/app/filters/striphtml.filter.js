var he = require('he');

class StripHtml {
    constructor() {
        return function (input) {
            let s = String(input).replace(/<[^>]+>/gm, '');
            let out = '';
            let l = s.length;

            for (let i = 0; i < l; i++) {
                let ch = s.charAt(i);
                if (ch === '&') {
                    let semicolonIndex = s.indexOf(';', i + 1);
                    if (semicolonIndex > 0) {
                        let entity = s.substring(i + 1, semicolonIndex);
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
                            ch = he.decode('&' + entity + ';');
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
