/**
 * Cloud9 Language Foundation
 *
 * @copyright 2011, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
define(function(require, exports, module) {

var completeUtil = require("ext/codecomplete/complete_util");
var baseLanguageHandler = require('ext/language/base_handler');
var htmlSnippets = require("ext/htmllanguage/snippets");

var completer = module.exports = Object.create(baseLanguageHandler);

completer.handlesLanguage = function(language) {
    return language === "html";
};

var HAML_REGEX = /([a-zA-Z]*)([.#])([\w]+)$/;

completer.complete = function(doc, fullAst, pos, currentNode, callback) {
    var line = doc.getLine(pos.row);
    var match = HAML_REGEX.exec(line.substring(0, pos.column));
    if(match) {
        var replaceText;
        var snippet = htmlSnippets[match[1]];
        if (snippet) {
            replaceText = snippet.replace("<" + match[1] + ">",
                ["<", match[1], match[2] === "." ? " class=\"" : " id=\"",
                    match[3], "\">"].join(""));
        }
        else {
            replaceText = ["<", match[1] || "div",
                match[2] === "." ? " class=\"" : " id=\"", match[3],
                "\">^^", "</", match[1] || "div", ">"].join("");
        }
        callback([{
              name        : match[0],
              replaceText : replaceText,
              doc         : "<pre>" + replaceText.replace("\^\^", "&#9251;") + "</pre>",
              icon        : null,
              meta        : "HAML",
              priority    : 100
        }]);
    }
    else {
        var identifier = completeUtil.retrievePreceedingIdentifier(line, pos.column);
        var allIdentifiers = Object.keys(htmlSnippets);
        var matches = completeUtil.findCompletions(identifier, allIdentifiers);
        callback(matches.map(function(m) {
            return {
              name        : m,
              replaceText : htmlSnippets[m],
              doc         : "<pre>" + htmlSnippets[m].replace("\^\^", "&#9251;") + "</pre>",
              icon        : null,
              meta        : "snippet",
              priority    : 2
            };
        }));
    }
};


});