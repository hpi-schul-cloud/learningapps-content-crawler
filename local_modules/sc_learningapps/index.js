var resourceName = "LearningApps.org";
//Requirements
var axios = require('axios');
var jxon = require("jxon")
var fs = require("fs")
//Some variables
// Module vars
var _config = {
  api_url: "<api_url>"
}
var _returnItems = [];

// ---------------------Module public methods

// This is just a stub method to be overwritten by external calls to fetch(..) of this module
// Can be used to test this module locally
var _callbackFunc = function (_returnItems) {
  console.log(_returnItems)
  console.log("length of all fetched items:", _returnItems.length)
}
// Helper structure, because the category and subcategory labels of apps are represented by ids; these labels are to be fetched separately beforehand
var _categoryTree = {}

function _build_categoryTree(response) {
  //convert the response xml to nicer JSON
  var responseJSON = jxon.stringToJs(response.data);
  _categoryTree = {};
  responseJSON.results.category.map(function (categoryObj) {
    _categoryTree[categoryObj["$id"]] = {
      name: categoryObj["$name"]
    }
    if (categoryObj.hasOwnProperty("subcategory")) {
      if (categoryObj["subcategory"].length > 0) {
        _categoryTree[categoryObj["$id"]].subCategories = {};
        categoryObj["subcategory"].map(function (subCategoryObj) {
          _categoryTree[categoryObj["$id"]].subCategories[subCategoryObj["$id"]] = subCategoryObj["$title"];
        })
      }
    }
  })
}

/**
 * 
 * 
 */
function _fetchItems() {
  axios.get(_config.api_url, {
      params: {
        "getapps": ""
      }
    })
    .then(function (response) {
      var _returnItems = jxon.stringToJs(response.data).results.app;
      //Convert the category and subcategory $id of each item to their real labels, using the prepared _categoryTree
      _returnItems.map(function (item) {
        item["$subcategory"] = _categoryTree[item["$category"]].subCategories[item["$subcategory"]];
        if(item["$tags"]!==undefined){
          item["$tags"]=item["$tags"].split(" ")
        }else{
          item["$tags"]=[]
        }
        (item["$subcategory"]!==undefined)? item["$tags"].unshift(item["$subcategory"]): delete item["$subcategory"] ;
        //item["$tags"]=item["$tags"].join(",");
        item["$category"] = _categoryTree[item["$category"]].name;
      })
      _callbackFunc(_returnItems)
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 * 
 * @param {object} config 
 */
function _configValid(config) {
  var returnValue = true;
  returnValue &= config !== undefined;
  returnValue &= config.hasOwnProperty("api_url") ? config.api_url !== "" && config.api_url.indexOf("<api_url>") : false;
  return returnValue;
}



// ---------------------Module public methods
/**
 * 
 * @param {object} config - Simple config object containing the API key and an array of channel ids as strings. 
 * @param {function} callbackFunc - The callback that handles the response.callbackFunc 
 * @param {boolean} fetchAsync - Utitlity flag setting whether the callback is called with every chunk or with the complete list of fecthed videos.
 */
function fetch(config, callbackFunc, fetchAsync) {
  if (_configValid(config)) {
    //[NOT USED IN THIS CASE]
    //_fetchAsync = (fetchAsync === undefined) ? _fetchAsync : fetchAsync;
    _returnItems = [];
    _callbackFunc = callbackFunc || _callbackFunc;
    _config = config;
    axios.get(_config.api_url, {
        params: {
          "getcategories": ""
        }
      })
      .then(function (response) {
        _build_categoryTree(response)
        _fetchItems()
      })
      .catch(function (error) {
        console.log(error);
      });

  } else {
    console.log(resourceName + " config not valid!")
    console.log("editable " + resourceName + " config blueprint:", JSON.stringify(_config))
  }
}
//fetch({api_url:'https://learningapps.org/api.php'})
module.exports = {
  fetch: fetch
}