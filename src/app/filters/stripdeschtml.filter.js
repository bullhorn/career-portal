class StripDescHtml {
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
                              case 'quot':
                                  ch = String.fromCharCode(0x0022);
                                  break;
                              case 'amp':
                                  ch = String.fromCharCode(0x0026);
                                  break;
                              case 'lt':
                                  ch = String.fromCharCode(0x003c);
                                  break;
                              case 'gt':
                                  ch = String.fromCharCode(0x003e);
                                  break;
                              case 'nbsp':
                                  ch = String.fromCharCode(0x00a0);
                                  break;
                              case 'Agrave':
                                  ch = String.fromCharCode(0x00C0);
                                  break;
                              case 'agrave':
                                  ch = String.fromCharCode(0x00E0);
                                  break;
                              case 'Acirc':
                                  ch = String.fromCharCode(0x00C2);
                                  break;
                              case 'acirc':
                                  ch = String.fromCharCode(0x00E2);
                                  break;
                              case 'AElig':
                                  ch = String.fromCharCode(0x00C6);
                                  break;
                              case 'aelig':
                                  ch = String.fromCharCode(0x00E6);
                                  break;
                              case 'Ccedil':
                                  ch = String.fromCharCode(0x00C7);
                                  break;
                              case 'ccedil':
                                  ch = String.fromCharCode(0x00E7);
                                  break;
                              case 'Egrav':
                                  ch = String.fromCharCode(0x00C8);
                                  break;
                              case 'egrav':
                                  ch = String.fromCharCode(0x00E8);
                                  break;
                              case 'Eacute':
                                  ch = String.fromCharCode(0x00C9);
                                  break;
                              case 'eacute':
                                  ch = String.fromCharCode(0x00E9);
                                  break;
                              case 'Ecirc':
                                  ch = String.fromCharCode(0x00CA);
                                  break;
                              case 'ecirc':
                                  ch = String.fromCharCode(0x00EA);
                                  break;
                              case 'Euml':
                                  ch = String.fromCharCode(0x00CB);
                                  break;
                              case 'euml':
                                  ch = String.fromCharCode(0x00EB);
                                  break;
                              case 'Icirc':
                                  ch = String.fromCharCode(0x00CE);
                                  break;
                              case 'icirc':
                                  ch = String.fromCharCode(0x00EE);
                                  break;
                              case 'Iuml':
                                  ch = String.fromCharCode(0x00CF);
                                  break;
                              case 'iuml':
                                  ch = String.fromCharCode(0x00EF);
                                  break;
                              case 'Ocirc':
                                  ch = String.fromCharCode(0x00D4);
                                  break;
                              case 'ocirc':
                                  ch = String.fromCharCode(0x00F4);
                                  break;
                              case 'OElig':
                                  ch = String.fromCharCode(0x0152);
                                  break;
                              case 'oelig':
                                  ch = String.fromCharCode(0x0153);
                                  break;
                              case 'Ugrav':
                                  ch = String.fromCharCode(0x00D9);
                                  break;
                              case 'ugrav':
                                  ch = String.fromCharCode(0x00F9);
                                  break;
                              case 'Ucirc':
                                  ch = String.fromCharCode(0x00DB);
                                  break;
                              case 'ucirc':
                                  ch = String.fromCharCode(0x00FB);
                                  break;
                              case 'Uuml':
                                  ch = String.fromCharCode(0x00DC);
                                  break;
                              case 'uuml':
                                  ch = String.fromCharCode(0x00FC);
                                  break;
                              case 'laquo':
                                  ch = String.fromCharCode(0x00AB);
                                  break;
                              case 'raquo':
                                  ch = String.fromCharCode(0x00BB);
                                  break;
                              case '27':
                                  ch = String.fromCharCode(0x0027);
                                  break;
                              case '91':
                                  ch = String.fromCharCode(0x0027);
                                  break;
                              case '92':
                                  ch = String.fromCharCode(0x0027);
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

  export default StripDescHtml;
