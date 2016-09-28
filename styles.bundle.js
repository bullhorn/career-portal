webpackJsonp([1,2],{

/***/ 364:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(627);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(660)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js!./styles.scss", function() {
			var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js!./styles.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 627:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(628)();
// imports


// module
exports.push([module.i, "/*\n===================\n    Color Maps\n===================\n*/\nhtml, body {\n  font-family: \"Roboto\", sans-serif;\n  font-size: 14px;\n  line-height: 24px;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  color: #3D464D; }\n\nbody h1,\nbody h2,\nbody h3,\nbody h4,\nbody h5 {\n  font-weight: 300; }\n  body h1.lead,\n  body h2.lead,\n  body h3.lead,\n  body h4.lead,\n  body h5.lead {\n    color: rgba(47, 56, 79, 0.75); }\n\nbody h1.lead {\n  font-size: 2.5em; }\n\nbody h2.lead {\n  font-size: 2.25em; }\n\nbody h3.lead {\n  font-size: 2em; }\n\nbody h4.lead {\n  font-size: 1.75em; }\n\nbody app-root {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-flow: column; }\n  body app-root > p {\n    text-align: center;\n    width: 100%;\n    padding-top: 3em; }\n    body app-root > p .fa-spinner {\n      color: rgba(0, 0, 0, 0.5); }\n  body app-root header {\n    display: flex;\n    background-color: #2f384f;\n    flex: 1 1 80px; }\n    body app-root header nav {\n      flex: 1;\n      display: flex;\n      align-items: stretch; }\n      body app-root header nav span {\n        font-size: 1.3em;\n        font-weight: 300;\n        color: white;\n        flex: 3;\n        display: flex;\n        align-items: center;\n        padding: 0 1em;\n        cursor: pointer; }\n      body app-root header nav a {\n        align-items: center;\n        display: flex;\n        flex: 1;\n        justify-content: center;\n        color: rgba(255, 255, 255, 0.7);\n        text-decoration: none;\n        transition: background-color 250ms, color 250ms, border-color 250ms;\n        border-top: solid 2px #2F384F; }\n        body app-root header nav a:hover {\n          color: white; }\n        body app-root header nav a.active {\n          color: white;\n          border-top-color: white; }\n  body app-root app-deployment,\n  body app-root app-customization,\n  body app-root app-extensibility,\n  body app-root app-getting-started,\n  body app-root app-faq {\n    flex: 1;\n    display: flex;\n    flex-flow: inherit; }\n    body app-root app-deployment > section,\n    body app-root app-customization > section,\n    body app-root app-extensibility > section,\n    body app-root app-getting-started > section,\n    body app-root app-faq > section {\n      padding-top: 2em;\n      width: 900px;\n      margin: auto; }\n  body app-root footer {\n    display: flex;\n    flex: 1 1 80px;\n    color: rgba(47, 56, 79, 0.5);\n    font-size: .9em;\n    width: 100%;\n    justify-content: center;\n    align-items: center;\n    align-self: baseline; }\n\n.divider {\n  width: 100%;\n  margin: 3em 0 3em;\n  border-bottom: dashed thin rgba(47, 56, 79, 0.25); }\n\na {\n  color: rgba(47, 56, 79, 0.75);\n  transition: color 250ms; }\n  a:hover {\n    color: #2F384F; }\n\ncode {\n  background-color: rgba(47, 56, 79, 0.1);\n  color: #2F384F;\n  padding: .5em 1em;\n  border: dashed thin #2F384F;\n  border-radius: .5em;\n  display: block; }\n\n.btn {\n  text-decoration: none;\n  color: #2F384F;\n  border: none;\n  background: rgba(255, 255, 255, 0.8);\n  padding: .65em 1.75em;\n  border-radius: .5em;\n  font-family: 'Open Sans', sans-serif;\n  font-size: .8em;\n  margin-right: .5em;\n  transition: background-color 250ms, color 250ms;\n  cursor: pointer; }\n  .btn:hover {\n    background-color: white; }\n  .btn.primary {\n    margin-right: 0;\n    background-color: #4A89DC;\n    color: white; }\n    .btn.primary:hover {\n      background-color: #2363b6; }\n  .btn.large {\n    padding: 1.2em 2em;\n    font-size: 1em; }\n  .btn > i {\n    font-size: 1.25em;\n    margin-right: .5em; }\n", ""]);

// exports


/***/ },

/***/ 628:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },

/***/ 660:
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },

/***/ 663:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(364);


/***/ }

},[663]);
//# sourceMappingURL=styles.map