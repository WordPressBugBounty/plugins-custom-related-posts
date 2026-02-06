var CustomRelatedPosts;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;


var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.A = querystringify;
__webpack_unused_export__ = querystring;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// ./custom-related-posts/assets/js/blocks/data/helpers.js
var _wp = wp,
  apiFetch = _wp.apiFetch;
var withSelect = wp.data.withSelect;
/* harmony default export */ const helpers = ({
  selectRelationsForCurrentPost: withSelect(function (select, ownProps) {
    var _select = select('core/editor'),
      getCurrentPostId = _select.getCurrentPostId;
    var postId = getCurrentPostId();
    var relations = select('custom-related-posts').getRelations(null, {
      postId: postId
    });
    var updated = Date.now();

    // Component doesn't update when passing along relations only. Problem because of "isShallowEqual"?
    return {
      postId: postId,
      relations: relations,
      updated: updated,
      relationToIDs: Object.keys(relations.to).map(function (id) {
        return parseInt(id);
      }),
      relationFromIDs: Object.keys(relations.from).map(function (id) {
        return parseInt(id);
      })
    };
  }),
  saveRelation: function saveRelation(base, target, type) {
    apiFetch({
      path: "custom-related-posts/v1/relations/".concat(base),
      method: 'POST',
      data: {
        target: target,
        type: type
      }
    });
  },
  setOrder: function setOrder(base, order) {
    apiFetch({
      path: "custom-related-posts/v1/relations/".concat(base, "/order"),
      method: 'PUT',
      data: {
        order: order
      }
    });
  },
  removeRelation: function removeRelation(base, target, type) {
    apiFetch({
      path: "custom-related-posts/v1/relations/".concat(base),
      method: 'DELETE',
      data: {
        target: target,
        type: type
      }
    });
  }
});
;// ./custom-related-posts/assets/js/blocks/data/index.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var data_wp = wp,
  data_apiFetch = data_wp.apiFetch;
var _wp$data = wp.data,
  registerStore = _wp$data.registerStore,
  dispatch = _wp$data.dispatch;

var DEFAULT_STATE = {
  relations: {
    to: {},
    from: {}
  }
};
registerStore('custom-related-posts', {
  reducer: function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
      case 'SET_RELATIONS':
        newState.relations = action.relations;
        return newState;
      case 'SET_ORDER':
        var orderedRelations = {};
        var index = 0;
        var _iterator = _createForOfIteratorHelper(action.order),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _id = _step.value;
            if (state.relations.to.hasOwnProperty(_id)) {
              orderedRelations[_id] = _objectSpread(_objectSpread({}, state.relations.to[_id]), {}, {
                order: index
              });
              index++;
            }
          }

          // Make sure every relation stays.
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        for (var _i = 0, _Object$keys = Object.keys(state.relations.to); _i < _Object$keys.length; _i++) {
          var id = _Object$keys[_i];
          if (!orderedRelations.hasOwnProperty(id)) {
            orderedRelations[id] = _objectSpread(_objectSpread({}, state.relations.to[id]), {}, {
              order: index
            });
          }
        }
        newState.relations.to = orderedRelations;
        return newState;
      case 'ADD_RELATION_TO':
        newState.relations.to[action.post.id] = action.post;
        return newState;
      case 'ADD_RELATION_BOTH':
        newState.relations.to[action.post.id] = action.post;
        newState.relations.from[action.post.id] = action.post;
        return newState;
      case 'ADD_RELATION_FROM':
        newState.relations.from[action.post.id] = action.post;
        return newState;
      case 'REMOVE_RELATION_TO':
        delete newState.relations.to[action.target];
        return newState;
      case 'REMOVE_RELATION_FROM':
        delete newState.relations.from[action.target];
        return newState;
    }
    return state;
  },
  actions: {
    setRelations: function setRelations(relations) {
      return {
        type: 'SET_RELATIONS',
        relations: relations
      };
    },
    setOrder: function setOrder(postId, order) {
      helpers.setOrder(postId, order);
      return {
        type: 'SET_ORDER',
        order: order
      };
    },
    addRelationTo: function addRelationTo(postId, post) {
      helpers.saveRelation(postId, post.id, 'to');
      return {
        type: 'ADD_RELATION_TO',
        post: post
      };
    },
    addRelationBoth: function addRelationBoth(postId, post) {
      helpers.saveRelation(postId, post.id, 'both');
      return {
        type: 'ADD_RELATION_BOTH',
        post: post
      };
    },
    addRelationFrom: function addRelationFrom(postId, post) {
      helpers.saveRelation(postId, post.id, 'from');
      return {
        type: 'ADD_RELATION_FROM',
        post: post
      };
    },
    removeRelationTo: function removeRelationTo(postId, target) {
      helpers.removeRelation(postId, target, 'to');
      return {
        type: 'REMOVE_RELATION_TO',
        target: target
      };
    },
    removeRelationFrom: function removeRelationFrom(postId, target) {
      helpers.removeRelation(postId, target, 'from');
      return {
        type: 'REMOVE_RELATION_FROM',
        target: target
      };
    }
  },
  selectors: {
    getRelations: function getRelations(state, args) {
      return state.relations;
    }
  },
  resolvers: {
    getRelations: function getRelations(state, args) {
      var request = data_apiFetch({
        path: "custom-related-posts/v1/relations/".concat(args.postId)
      });
      request.then(function (relations) {
        // Make sure relations are an object.
        if (Array.isArray(relations.to)) {
          relations.to = {};
        }
        if (Array.isArray(relations.from)) {
          relations.from = {};
        }
        dispatch('custom-related-posts').setRelations(relations);
      });
    }
  }
});
;// ./custom-related-posts/assets/js/blocks/sidebar/relation.js
var _wp$components = wp.components,
  Button = _wp$components.Button,
  Dashicon = _wp$components.Dashicon;
var Relation = function Relation(props) {
  var post = props.post;
  if (!post) {
    return null;
  }
  return /*#__PURE__*/React.createElement("li", {
    className: "crp-relation"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "crp-remove-relation-button",
    onClick: function onClick() {
      return props.onRemove(post.id);
    }
  }, /*#__PURE__*/React.createElement(Dashicon, {
    icon: "trash"
  })), /*#__PURE__*/React.createElement("a", {
    className: "crp-relation-title",
    href: post.permalink,
    target: "_blank"
  }, post.title), props.hasOwnProperty('onChangeOrder') && false !== props.onChangeOrder && /*#__PURE__*/React.createElement("span", {
    className: "crp-relation-order-buttons"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "crp-order-up-relation-button",
    onClick: function onClick() {
      return props.onChangeOrder(true);
    },
    disabled: !props.allowUp
  }, /*#__PURE__*/React.createElement(Dashicon, {
    icon: "arrow-up"
  })), /*#__PURE__*/React.createElement(Button, {
    className: "crp-order-down-relation-button",
    onClick: function onClick() {
      return props.onChangeOrder(false);
    },
    disabled: !props.allowDown
  }, /*#__PURE__*/React.createElement(Dashicon, {
    icon: "arrow-down"
  }))));
};
/* harmony default export */ const sidebar_relation = (Relation);
;// ./custom-related-posts/assets/js/blocks/sidebar/relations.js
var __ = wp.i18n.__;
var Fragment = wp.element.Fragment;
var compose = wp.compose.compose;
var withDispatch = wp.data.withDispatch;


var relationsList = function relationsList(relations, onRemoveRelation, onChangeOrder) {
  var orderedRelations = Object.values(relations);
  orderedRelations.sort(function (a, b) {
    return a.order - b.order;
  });
  return /*#__PURE__*/React.createElement("ul", null, orderedRelations.map(function (relation, index) {
    var post = relations[relation.id];
    var allowUp = 0 < index;
    var allowDown = index < orderedRelations.length - 1;
    var onChangeRelationOrder = false;
    if (false !== onChangeOrder) {
      onChangeRelationOrder = function onChangeRelationOrder(up) {
        var orderedIds = orderedRelations.map(function (a) {
          return a.id;
        });
        var swapIndex = index;
        if (up && allowUp) {
          swapIndex--;
        } else if (!up && allowDown) {
          swapIndex++;
        }
        var temp = orderedIds[swapIndex];
        orderedIds[swapIndex] = orderedIds[index];
        orderedIds[index] = temp;
        onChangeOrder(orderedIds);
      };
    }
    return /*#__PURE__*/React.createElement(sidebar_relation, {
      post: post,
      allowUp: allowUp,
      allowDown: allowDown,
      key: relation.id,
      onRemove: onRemoveRelation,
      onChangeOrder: onChangeRelationOrder
    });
  }));
};
function Relations(props) {
  var relations = props.relations,
    relationToIDs = props.relationToIDs,
    relationFromIDs = props.relationFromIDs;
  return /*#__PURE__*/React.createElement(Fragment, null, 0 < relationToIDs.length && /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("h3", null, __('This post links to')), relationsList(relations.to, props.onRemoveRelationTo, props.onChangeOrder)), 0 < relationFromIDs.length && /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("h3", null, __('This post get links from')), relationsList(relations.from, props.onRemoveRelationFrom, false)));
}
;
var applyWithDispatch = withDispatch(function (dispatch, ownProps) {
  var _dispatch = dispatch('custom-related-posts'),
    removeRelationTo = _dispatch.removeRelationTo,
    removeRelationFrom = _dispatch.removeRelationFrom,
    setOrder = _dispatch.setOrder;
  return {
    onRemoveRelationTo: function onRemoveRelationTo(target) {
      return removeRelationTo(ownProps.postId, target);
    },
    onRemoveRelationFrom: function onRemoveRelationFrom(target) {
      return removeRelationFrom(ownProps.postId, target);
    },
    onChangeOrder: function onChangeOrder(order) {
      return setOrder(ownProps.postId, order);
    }
  };
});
/* harmony default export */ const relations = (compose(helpers.selectRelationsForCurrentPost, applyWithDispatch)(Relations));
// EXTERNAL MODULE: ./node_modules/querystringify/index.js
var querystringify = __webpack_require__(2);
;// ./custom-related-posts/assets/js/blocks/modal/post.js
function post_typeof(o) { "@babel/helpers - typeof"; return post_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, post_typeof(o); }
function post_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function post_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? post_ownKeys(Object(t), !0).forEach(function (r) { post_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : post_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function post_defineProperty(e, r, t) { return (r = post_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function post_toPropertyKey(t) { var i = post_toPrimitive(t, "string"); return "symbol" == post_typeof(i) ? i : i + ""; }
function post_toPrimitive(t, r) { if ("object" != post_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != post_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var post_ = wp.i18n.__;
var post_Fragment = wp.element.Fragment;
var post_Button = wp.components.Button;
var post_compose = wp.compose.compose;
var post_withDispatch = wp.data.withDispatch;

function Post(props) {
  var post = props.post,
    relationToIDs = props.relationToIDs,
    relationFromIDs = props.relationFromIDs;
  if (!post) {
    return null;
  }
  var linked = false;
  if (relationToIDs.includes(post.id) && relationFromIDs.includes(post.id)) {
    linked = 'both';
  } else if (relationToIDs.includes(post.id)) {
    linked = 'to';
  } else if (relationFromIDs.includes(post.id)) {
    linked = 'from';
  }
  var orderedPost = post_objectSpread(post_objectSpread({}, post), {}, {
    order: relationToIDs.length
  });
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, post.post_type), /*#__PURE__*/React.createElement("td", null, post.date_display), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: post.permalink,
    target: "_blank"
  }, post.title)), /*#__PURE__*/React.createElement("td", null, 'both' === linked ? /*#__PURE__*/React.createElement(post_Button, {
    variant: "secondary",
    disabled: true
  }, post_('Already linked')) : /*#__PURE__*/React.createElement(post_Fragment, null, /*#__PURE__*/React.createElement(post_Button, {
    className: "crp-add-relations-button-to",
    variant: "secondary",
    disabled: false !== linked,
    onClick: function onClick() {
      return props.onAddRelationTo(orderedPost);
    }
  }, post_('To')), /*#__PURE__*/React.createElement(post_Button, {
    className: "crp-add-relations-button-both",
    isPrimary: true,
    onClick: function onClick() {
      return props.onAddRelationBoth(orderedPost);
    }
  }, post_('Both')), /*#__PURE__*/React.createElement(post_Button, {
    className: "crp-add-relations-button-from",
    variant: "secondary",
    disabled: false !== linked,
    onClick: function onClick() {
      return props.onAddRelationFrom(orderedPost);
    }
  }, post_('From')))));
}
;
var post_applyWithDispatch = post_withDispatch(function (dispatch, ownProps) {
  var _dispatch = dispatch('custom-related-posts'),
    addRelationTo = _dispatch.addRelationTo,
    addRelationBoth = _dispatch.addRelationBoth,
    addRelationFrom = _dispatch.addRelationFrom;
  return {
    onAddRelationTo: function onAddRelationTo(post) {
      return addRelationTo(ownProps.postId, post);
    },
    onAddRelationBoth: function onAddRelationBoth(post) {
      return addRelationBoth(ownProps.postId, post);
    },
    onAddRelationFrom: function onAddRelationFrom(post) {
      return addRelationFrom(ownProps.postId, post);
    }
  };
});
/* harmony default export */ const modal_post = (post_compose(helpers.selectRelationsForCurrentPost, post_applyWithDispatch)(Post));
;// ./custom-related-posts/assets/js/blocks/modal/index.js
function modal_typeof(o) { "@babel/helpers - typeof"; return modal_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, modal_typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, modal_toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function modal_toPropertyKey(t) { var i = modal_toPrimitive(t, "string"); return "symbol" == modal_typeof(i) ? i : i + ""; }
function modal_toPrimitive(t, r) { if ("object" != modal_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != modal_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == modal_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }

var modal_ = wp.i18n.__;
var modal_wp = wp,
  modal_apiFetch = modal_wp.apiFetch;
var Component = wp.element.Component;
var Modal = wp.components.Modal;


var AddRelationModal = /*#__PURE__*/function (_Component) {
  function AddRelationModal() {
    var _this;
    _classCallCheck(this, AddRelationModal);
    _this = _callSuper(this, AddRelationModal, arguments);
    _this.state = {
      postType: '',
      search: '',
      searchType: 'default',
      posts: [],
      updatingPosts: false,
      needToUpdatePosts: false
    };
    return _this;
  }
  _inherits(AddRelationModal, _Component);
  return _createClass(AddRelationModal, [{
    key: "onChangePostType",
    value: function onChangePostType(event) {
      var postType = event.target.value;
      if (postType !== this.state.postType) {
        this.setState({
          postType: postType,
          needToUpdatePosts: this.state.search.length >= 2 // Only update if there is text.
        });
      }
    }
  }, {
    key: "onChangeSearch",
    value: function onChangeSearch(event) {
      var search = event.target.value;
      if (search !== this.state.search) {
        this.setState({
          search: search,
          needToUpdatePosts: true
        });
      }
    }
  }, {
    key: "onChangeSearchType",
    value: function onChangeSearchType(event) {
      var searchType = event.target.value;
      if (searchType !== this.state.searchType) {
        this.setState({
          searchType: searchType,
          needToUpdatePosts: this.state.search.length >= 2 // Only update if there is text.
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.needToUpdatePosts) {
        this.updatePosts();
      }
    }
  }, {
    key: "updatePosts",
    value: function updatePosts() {
      var _this2 = this;
      if (!this.state.updatingPosts) {
        if (this.state.search.length < 2) {
          this.setState({
            updatingPosts: false,
            needToUpdatePosts: false,
            posts: []
          });
        } else {
          this.setState({
            updatingPosts: true,
            needToUpdatePosts: false
          });
          var request = modal_apiFetch({
            path: "/custom-related-posts/v1/search?".concat((0,querystringify/* stringify */.A)({
              post_type: this.state.postType,
              keyword: this.state.search,
              search_type: this.state.searchType
            }))
          });
          request.then(function (posts) {
            _this2.setState({
              posts: posts,
              updatingPosts: false
            });
          });
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(Modal, {
        title: modal_('Add Relations'),
        onRequestClose: this.props.onClose,
        focusOnMount: false,
        className: "crp-add-relations-modal"
      }, /*#__PURE__*/React.createElement("div", {
        className: "crp-add-relations"
      }, /*#__PURE__*/React.createElement("div", {
        className: "crp-add-relations-input"
      }, /*#__PURE__*/React.createElement("select", {
        value: this.state.postType,
        onChange: this.onChangePostType.bind(this)
      }, /*#__PURE__*/React.createElement("option", {
        value: ""
      }, modal_('All Post Types', 'custom-related-posts')), Object.keys(crp_admin.post_types).map(function (postType, index) {
        return /*#__PURE__*/React.createElement("option", {
          value: postType,
          key: index
        }, crp_admin.post_types[postType]);
      })), /*#__PURE__*/React.createElement("input", {
        autoFocus: true,
        type: "text",
        placeholder: modal_('Start typing to search...'),
        className: "crp-add-relations-search",
        value: this.state.search,
        onChange: this.onChangeSearch.bind(this)
      }), /*#__PURE__*/React.createElement("select", {
        value: this.state.searchType,
        onChange: this.onChangeSearchType.bind(this)
      }, /*#__PURE__*/React.createElement("option", {
        value: "default"
      }, modal_('Default Search', 'custom-related-posts')), /*#__PURE__*/React.createElement("option", {
        value: "title"
      }, modal_('Search by Title only', 'custom-related-posts')), /*#__PURE__*/React.createElement("option", {
        value: "id"
      }, modal_('Search by Post ID', 'custom-related-posts')))), /*#__PURE__*/React.createElement("table", {
        className: "crp-add-relations-posts"
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, modal_('Post Type')), /*#__PURE__*/React.createElement("th", null, modal_('Date')), /*#__PURE__*/React.createElement("th", null, modal_('Title')), /*#__PURE__*/React.createElement("th", null, modal_('Link')))), 0 === this.state.posts.length ? /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
        colSpan: "4"
      }, /*#__PURE__*/React.createElement("em", null, "No posts found.")))) : /*#__PURE__*/React.createElement("tbody", null, this.state.posts.map(function (post, index) {
        return /*#__PURE__*/React.createElement(modal_post, {
          post: post,
          key: index
        });
      })))));
    }
  }]);
}(Component);
/* harmony default export */ const modal = (AddRelationModal);
;// ./custom-related-posts/assets/js/blocks/sidebar/index.js
function sidebar_typeof(o) { "@babel/helpers - typeof"; return sidebar_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, sidebar_typeof(o); }
function sidebar_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function sidebar_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, sidebar_toPropertyKey(o.key), o); } }
function sidebar_createClass(e, r, t) { return r && sidebar_defineProperties(e.prototype, r), t && sidebar_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function sidebar_toPropertyKey(t) { var i = sidebar_toPrimitive(t, "string"); return "symbol" == sidebar_typeof(i) ? i : i + ""; }
function sidebar_toPrimitive(t, r) { if ("object" != sidebar_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != sidebar_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function sidebar_callSuper(t, o, e) { return o = sidebar_getPrototypeOf(o), sidebar_possibleConstructorReturn(t, sidebar_isNativeReflectConstruct() ? Reflect.construct(o, e || [], sidebar_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function sidebar_possibleConstructorReturn(t, e) { if (e && ("object" == sidebar_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return sidebar_assertThisInitialized(t); }
function sidebar_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function sidebar_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (sidebar_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function sidebar_getPrototypeOf(t) { return sidebar_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, sidebar_getPrototypeOf(t); }
function sidebar_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && sidebar_setPrototypeOf(t, e); }
function sidebar_setPrototypeOf(t, e) { return sidebar_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, sidebar_setPrototypeOf(t, e); }
var sidebar_ = wp.i18n.__;
var _wp$element = wp.element,
  sidebar_Component = _wp$element.Component,
  sidebar_Fragment = _wp$element.Fragment;
var sidebar_wp$components = wp.components,
  Panel = sidebar_wp$components.Panel,
  PanelBody = sidebar_wp$components.PanelBody,
  sidebar_Button = sidebar_wp$components.Button,
  Icon = sidebar_wp$components.Icon;
var registerPlugin = wp.plugins.registerPlugin;

// WordPress 6.6+ uses wp.editor, WordPress 6.4-6.5 used wp.editPost
var _ref = wp.editor && wp.editor.PluginSidebar ? wp.editor : wp.editPost,
  PluginSidebar = _ref.PluginSidebar,
  PluginSidebarMoreMenuItem = _ref.PluginSidebarMoreMenuItem;



var Sidebar = /*#__PURE__*/function (_Component) {
  function Sidebar() {
    var _this;
    sidebar_classCallCheck(this, Sidebar);
    _this = sidebar_callSuper(this, Sidebar, arguments);
    _this.state = {
      isModalOpen: false
    };
    return _this;
  }
  sidebar_inherits(Sidebar, _Component);
  return sidebar_createClass(Sidebar, [{
    key: "openModal",
    value: function openModal() {
      if (!this.state.isModalOpen) {
        this.setState({
          isModalOpen: true
        });
      }
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      if (this.state.isModalOpen) {
        this.setState({
          isModalOpen: false
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(sidebar_Fragment, null, /*#__PURE__*/React.createElement(PluginSidebarMoreMenuItem, {
        target: "sidebar-custom-related-posts",
        icon: "admin-links"
      }, "Custom Related Posts"), /*#__PURE__*/React.createElement(PluginSidebar, {
        name: "sidebar-custom-related-posts",
        title: "Custom Related Posts",
        icon: /*#__PURE__*/React.createElement(Icon, {
          icon: /*#__PURE__*/React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 32 32",
            width: "20",
            height: "20"
          }, /*#__PURE__*/React.createElement("title", null, "link"), /*#__PURE__*/React.createElement("g", {
            className: "nc-icon-wrapper",
            fill: "currentColor"
          }, /*#__PURE__*/React.createElement("path", {
            d: "M17.619,10.138l-2.241,2.24c-.06.061-.1.13-.158.193a4.958,4.958,0,0,1,2.816,1.393,5.008,5.008,0,0,1,0,7.072l-5.5,5.5a5,5,0,0,1-7.072-7.072l2.385-2.385a10.054,10.054,0,0,1-.23-4.011L3.343,17.343A8,8,0,0,0,14.657,28.657l5.5-5.5a7.99,7.99,0,0,0-2.538-13.019Z",
            fill: "currentColor"
          }), " ", /*#__PURE__*/React.createElement("path", {
            "data-color": "color-2",
            d: "M17.343,3.343l-5.5,5.5a7.99,7.99,0,0,0,2.538,13.019l2.241-2.24c.06-.061.107-.129.162-.193a4.953,4.953,0,0,1-2.82-1.393,5.008,5.008,0,0,1,0-7.072l5.5-5.5a5,5,0,0,1,7.072,7.072l-2.383,2.382a10.086,10.086,0,0,1,.241,4l4.263-4.263A8,8,0,0,0,17.343,3.343Z",
            fill: "currentColor"
          })))
        })
      }, /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(PanelBody, {
        title: sidebar_('Relations')
      }, /*#__PURE__*/React.createElement(relations, null), /*#__PURE__*/React.createElement(sidebar_Button, {
        isPrimary: true,
        onClick: this.openModal.bind(this)
      }, sidebar_('Add Relations'))))), this.state.isModalOpen && /*#__PURE__*/React.createElement(modal, {
        onClose: this.closeModal.bind(this)
      }));
    }
  }]);
}(sidebar_Component);
registerPlugin('custom-related-posts', {
  render: Sidebar
});
;// ./custom-related-posts/assets/js/blocks/related-posts/edit.js
function edit_typeof(o) { "@babel/helpers - typeof"; return edit_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, edit_typeof(o); }
function edit_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function edit_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? edit_ownKeys(Object(t), !0).forEach(function (r) { edit_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : edit_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function edit_defineProperty(e, r, t) { return (r = edit_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function edit_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function edit_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, edit_toPropertyKey(o.key), o); } }
function edit_createClass(e, r, t) { return r && edit_defineProperties(e.prototype, r), t && edit_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function edit_toPropertyKey(t) { var i = edit_toPrimitive(t, "string"); return "symbol" == edit_typeof(i) ? i : i + ""; }
function edit_toPrimitive(t, r) { if ("object" != edit_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != edit_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function edit_callSuper(t, o, e) { return o = edit_getPrototypeOf(o), edit_possibleConstructorReturn(t, edit_isNativeReflectConstruct() ? Reflect.construct(o, e || [], edit_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function edit_possibleConstructorReturn(t, e) { if (e && ("object" == edit_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return edit_assertThisInitialized(t); }
function edit_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function edit_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (edit_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function edit_getPrototypeOf(t) { return edit_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, edit_getPrototypeOf(t); }
function edit_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && edit_setPrototypeOf(t, e); }
function edit_setPrototypeOf(t, e) { return edit_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, edit_setPrototypeOf(t, e); }
var edit_ = wp.i18n.__;
var edit_wp$components = wp.components,
  edit_PanelBody = edit_wp$components.PanelBody,
  TextControl = edit_wp$components.TextControl,
  RadioControl = edit_wp$components.RadioControl,
  Disabled = edit_wp$components.Disabled,
  Spinner = edit_wp$components.Spinner;
var edit_wp$element = wp.element,
  edit_Component = edit_wp$element.Component,
  edit_Fragment = edit_wp$element.Fragment;

// Backwards compatibility - WordPress 6.4+ uses wp.blockEditor
var edit_ref = wp.blockEditor || wp.editor || {},
  InspectorControls = edit_ref.InspectorControls,
  useBlockProps = edit_ref.useBlockProps;
var ServerSideRender = wp.serverSideRender || wp.components.ServerSideRender;


var RelatedPostsEdit = /*#__PURE__*/function (_Component) {
  function RelatedPostsEdit() {
    var _this;
    edit_classCallCheck(this, RelatedPostsEdit);
    _this = edit_callSuper(this, RelatedPostsEdit, arguments);
    _this.state = {
      isLoading: false
    };
    _this.loadingTimeout = null;
    return _this;
  }
  edit_inherits(RelatedPostsEdit, _Component);
  return edit_createClass(RelatedPostsEdit, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;
      // If relations changed (IDs or order), show loading indicator
      var relations = this.props.relations;

      // Get ordered relation IDs based on order property
      var getOrderedRelationIDs = function getOrderedRelationIDs(relationsObj) {
        return Object.values(relationsObj.to).filter(function (post) {
          return 'publish' === post.status;
        }).sort(function (a, b) {
          return (a.order || 0) - (b.order || 0);
        }).map(function (post) {
          return post.id;
        });
      };
      var prevOrderedIDs = getOrderedRelationIDs(prevProps.relations).join(',');
      var currentOrderedIDs = getOrderedRelationIDs(relations).join(',');
      if (prevOrderedIDs !== currentOrderedIDs) {
        // Clear any existing timeout
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
        }

        // Show loading indicator
        this.setState({
          isLoading: true
        });

        // Hide loading indicator after a reasonable time (ServerSideRender handles its own loading)
        // This gives users visual feedback that something is happening
        this.loadingTimeout = setTimeout(function () {
          _this2.setState({
            isLoading: false
          });
          _this2.loadingTimeout = null;
        }, 1500); // Show for at least 1.5 seconds to give ServerSideRender time to load
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // Clean up timeout
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        attributes = _this$props.attributes,
        setAttributes = _this$props.setAttributes,
        relations = _this$props.relations;
      var title = attributes.title,
        none_text = attributes.none_text,
        order_by = attributes.order_by,
        order = attributes.order;

      // Filter and sort relations by order property (for custom order)
      var filteredRelations = Object.values(relations.to).filter(function (post) {
        return 'publish' === post.status;
      }).sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
      var hasRelations = filteredRelations.length > 0;

      // Create ordered relation IDs for the render key (includes order information)
      var orderedRelationIDs = filteredRelations.map(function (post) {
        return post.id;
      });
      var sideBar = InspectorControls ? /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(edit_PanelBody, {
        title: edit_('Custom Related Posts Settings')
      }, /*#__PURE__*/React.createElement(TextControl, {
        label: edit_('Title'),
        value: title,
        onChange: function onChange(value) {
          return setAttributes({
            title: value
          });
        }
      }), /*#__PURE__*/React.createElement(TextControl, {
        label: edit_('None Text'),
        help: edit_('Leave blank to hide when there are no related posts.'),
        value: none_text,
        onChange: function onChange(value) {
          return setAttributes({
            none_text: value
          });
        }
      }), /*#__PURE__*/React.createElement(RadioControl, {
        label: edit_('Order By'),
        selected: order_by,
        options: [{
          label: edit_('Title'),
          value: 'title'
        }, {
          label: edit_('Date'),
          value: 'date'
        }, {
          label: edit_('Custom'),
          value: 'custom'
        }, {
          label: edit_('Random'),
          value: 'rand'
        }],
        onChange: function onChange(value) {
          return setAttributes({
            order_by: value
          });
        }
      }), /*#__PURE__*/React.createElement(RadioControl, {
        label: edit_('Order'),
        selected: order,
        options: [{
          label: edit_('Ascending'),
          value: 'ASC'
        }, {
          label: edit_('Descending'),
          value: 'DESC'
        }],
        onChange: function onChange(value) {
          return setAttributes({
            order: value
          });
        }
      }))) : null;

      // Create a key that changes when relations change (IDs or order) to force ServerSideRender to re-render
      var renderKey = orderedRelationIDs.join(',');
      var isLoading = this.state.isLoading;
      return /*#__PURE__*/React.createElement(edit_Fragment, null, sideBar, /*#__PURE__*/React.createElement(RelatedPostsEditContent, {
        isLoading: isLoading,
        hasRelations: hasRelations,
        none_text: none_text,
        renderKey: renderKey,
        attributes: attributes,
        filteredRelations: filteredRelations
      }));
    }
  }]);
}(edit_Component); // Wrapper component that uses useBlockProps hook for API version 3 compatibility
function RelatedPostsEditContent(props) {
  var blockProps = useBlockProps ? useBlockProps() : {};
  var isLoading = props.isLoading,
    hasRelations = props.hasRelations,
    none_text = props.none_text,
    renderKey = props.renderKey,
    attributes = props.attributes,
    filteredRelations = props.filteredRelations;
  return /*#__PURE__*/React.createElement("div", blockProps, !hasRelations && !none_text ? /*#__PURE__*/React.createElement("em", null, edit_('This block will be empty until you add a related post.')) : /*#__PURE__*/React.createElement(Disabled, null, isLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      minHeight: '60px'
    }
  }, /*#__PURE__*/React.createElement(Spinner, null), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: '10px'
    }
  }, edit_('Loading related posts...'))), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: isLoading ? 0.5 : 1,
      transition: 'opacity 0.3s ease'
    }
  }, ServerSideRender ? /*#__PURE__*/React.createElement(ServerSideRender, {
    key: renderKey,
    block: "custom-related-posts/related-posts",
    attributes: edit_objectSpread(edit_objectSpread({}, attributes), {}, {
      relations: filteredRelations
    })
  }) : /*#__PURE__*/React.createElement("em", null, edit_('Server-side rendering is not available. Please refresh the page.')))));
}
/* harmony default export */ const edit = (helpers.selectRelationsForCurrentPost(RelatedPostsEdit));
;// ./custom-related-posts/assets/js/blocks/related-posts/index.js
var related_posts_ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;

registerBlockType('custom-related-posts/related-posts', {
  apiVersion: 3,
  title: related_posts_('Custom Related Posts'),
  description: related_posts_('Display a list of your custom related posts.'),
  icon: 'list-view',
  keywords: ['crp'],
  category: 'widgets',
  supports: {
    html: false
  },
  transforms: {
    from: [{
      type: 'shortcode',
      tag: 'custom-related-posts',
      attributes: {
        title: {
          type: 'string',
          shortcode: function shortcode(_ref) {
            var _ref$named$title = _ref.named.title,
              title = _ref$named$title === void 0 ? '' : _ref$named$title;
            return title.replace('title', '');
          }
        },
        order_by: {
          type: 'string',
          shortcode: function shortcode(_ref2) {
            var _ref2$named$order_by = _ref2.named.order_by,
              order_by = _ref2$named$order_by === void 0 ? '' : _ref2$named$order_by;
            return order_by.replace('order_by', '');
          }
        },
        order: {
          type: 'string',
          shortcode: function shortcode(_ref3) {
            var _ref3$named$order = _ref3.named.order,
              order = _ref3$named$order === void 0 ? '' : _ref3$named$order;
            return order.replace('order', '');
          }
        },
        none_text: {
          type: 'string',
          shortcode: function shortcode(_ref4) {
            var _ref4$named$none_text = _ref4.named.none_text,
              none_text = _ref4$named$none_text === void 0 ? '' : _ref4$named$none_text;
            return none_text.replace('none_text', '');
          }
        }
      }
    }]
  },
  edit: edit,
  save: function save(props) {
    return null;
  }
});
;// ./custom-related-posts/assets/js/blocks.js



(CustomRelatedPosts = typeof CustomRelatedPosts === "undefined" ? {} : CustomRelatedPosts).blocks = __webpack_exports__;
/******/ })()
;