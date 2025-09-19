var CustomRelatedPosts;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 561:
/***/ ((module) => {

module.exports = window.jQuery;

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Metabox: () => (/* reexport */ metabox)
});

;// ./custom-related-posts/assets/js/admin/update-permalinks.js
/* provided dependency */ var jQuery = __webpack_require__(561);
/* provided dependency */ var $ = __webpack_require__(561);

jQuery(document).ready(function ($) {
  if ($('#crp-progress-container').length > 0) {
    CRP_Update_Permalinks.init();
  }
});
var CRP_Update_Permalinks = {
  totalCount: 0,
  processedCount: 0,
  updatedCount: 0,
  batchSize: 10,
  isRunning: false,
  currentOffset: 0,
  init: function init() {
    this.startUpdate();
  },
  startUpdate: function startUpdate() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.showProgressContainer();
    this.updateStatus('Getting total count...');

    // Get total count first
    this.getTotalCount();
  },
  getTotalCount: function getTotalCount() {
    var _this = this;
    jQuery.post(crp_admin.ajax_url, {
      action: 'crp_get_permalinks_count',
      security: crp_admin.nonce
    }, function (response) {
      if (response.success) {
        _this.totalCount = response.data.total_count;
        _this.updateProgressDisplay();
        _this.updateStatus('Starting batch processing...');
        _this.processNextBatch();
      } else {
        _this.showError('Failed to get total count: ' + response.data.message);
      }
    }, 'json').fail(function () {
      _this.showError('Network error while getting total count.');
    });
  },
  processNextBatch: function processNextBatch() {
    var _this2 = this;
    if (!this.isRunning) return;
    this.updateStatus("Processing batch ".concat(Math.floor(this.currentOffset / this.batchSize) + 1, "..."));
    jQuery.post(crp_admin.ajax_url, {
      action: 'crp_update_permalinks_batch',
      security: crp_admin.nonce,
      offset: this.currentOffset,
      limit: this.batchSize
    }, function (response) {
      if (response.success) {
        _this2.processedCount += response.data.processed_count;
        _this2.updatedCount += response.data.updated_count;
        _this2.currentOffset += _this2.batchSize;
        _this2.updateProgressDisplay();
        if (response.data.has_more && _this2.isRunning) {
          // Continue with next batch after a short delay
          setTimeout(function () {
            _this2.processNextBatch();
          }, 100);
        } else {
          _this2.completeUpdate();
        }
      } else {
        _this2.showError('Batch processing failed: ' + response.data.message);
      }
    }, 'json').fail(function () {
      _this2.showError('Network error during batch processing.');
    });
  },
  updateProgressDisplay: function updateProgressDisplay() {
    var percentage = this.totalCount > 0 ? Math.round(this.processedCount / this.totalCount * 100) : 0;
    $('#crp-progress-bar').css('width', percentage + '%');
    $('#crp-progress-text').text(percentage + '%');
    $('#crp-progress-count').text(this.processedCount);
    $('#crp-total-count').text(this.totalCount);
    $('#crp-updated-count').text(this.updatedCount);
  },
  updateStatus: function updateStatus(message) {
    $('#crp-status-text').text(message);
  },
  showProgressContainer: function showProgressContainer() {
    $('#crp-progress-container').show();
    $('#crp-completion-container').hide();
    $('#crp-error-container').hide();
  },
  completeUpdate: function completeUpdate() {
    this.isRunning = false;
    this.updateStatus('Update completed successfully!');
    this.showCompletion();
  },
  showCompletion: function showCompletion() {
    $('#crp-progress-container').hide();
    $('#crp-completion-container').show();
    var message = "Successfully updated permalinks for ".concat(this.updatedCount, " out of ").concat(this.totalCount, " posts with relations.");
    $('#crp-completion-message').html("<p>".concat(message, "</p>"));
  },
  showError: function showError(message) {
    this.isRunning = false;
    $('#crp-progress-container').hide();
    $('#crp-error-container').show();
    $('#crp-error-message').html("<p>".concat(message, "</p>"));
  },
  cancel: function cancel() {
    this.isRunning = false;
    this.showError('Update cancelled by user.');
  },
  retry: function retry() {
    this.totalCount = 0;
    this.processedCount = 0;
    this.updatedCount = 0;
    this.currentOffset = 0;
    this.startUpdate();
  }
};

// Event handlers
jQuery(document).ready(function ($) {
  $(document).on('click', '#crp-cancel-update', function () {
    CRP_Update_Permalinks.cancel();
  });
  $(document).on('click', '#crp-retry-update', function () {
    CRP_Update_Permalinks.retry();
  });
});
/* harmony default export */ const update_permalinks = ((/* unused pure expression or super */ null && (CRP_Update_Permalinks)));
;// ./custom-related-posts/assets/js/admin/metabox.js
/* provided dependency */ var metabox_jQuery = __webpack_require__(561);


metabox_jQuery(document).ready(function ($) {
  if ($('#crp_meta_box').length > 0) {
    Metabox.initMetaBox();
  }
});
var Metabox = {
  post_id: undefined,
  search_term_field: undefined,
  search_button: undefined,
  initMetaBox: function initMetaBox() {
    Metabox.post_id = metabox_jQuery('#crp_post').val();
    Metabox.search_post_type = metabox_jQuery('#crp_search_post_type');
    Metabox.search_term_field = metabox_jQuery('#crp_search_term');
    Metabox.search_button = metabox_jQuery('#crp_search_button');

    // Trigger search for any if these actions.
    Metabox.search_term_field.on('keydown', function (e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        e.stopPropagation();
        Metabox.searchPosts();
      }
    });
    Metabox.search_post_type.on('change', function (e) {
      var search_term = Metabox.search_term_field.val();
      if (search_term.length > 0) {
        Metabox.searchPosts();
      }
    });
    Metabox.search_button.on('click', function () {
      Metabox.searchPosts();
    });
    metabox_jQuery('#crp_relations').on('click', '.crp_remove_relation', function () {
      Metabox.removeRelation(metabox_jQuery(this));
    });
    metabox_jQuery('#crp_search_results_table').on('click', 'button', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
  },
  removeRelation: function removeRelation(btn) {
    var both = btn.hasClass('crp_remove_relation_both'),
      to = btn.hasClass('crp_remove_relation_to'),
      from = btn.hasClass('crp_remove_relation_from'),
      post_id = btn.parent('div').data('post');
    if (post_id == undefined) {
      post_id = btn.parents('tr').data('post');
      if (to) {
        var title = btn.parents('tr').find('td').first().text();
        var element = '<div id="crp_related_post_' + post_id + '" data-post="' + post_id + '">' + crp_admin.remove_image_from + title + '</div>';
        metabox_jQuery('#crp_relations_single_from').prepend(element);
      } else if (from) {
        var title = btn.parents('tr').find('td').first().text();
        var element = '<div id="crp_related_post_' + post_id + '" data-post="' + post_id + '">' + title + crp_admin.remove_image_to + '</div>';
        metabox_jQuery('#crp_relations_single_to').prepend(element);
      }
    }
    metabox_jQuery('#crp_related_post_' + post_id).remove();
    var data = {
      action: 'crp_remove_relation',
      security: crp_admin.nonce,
      base: Metabox.post_id,
      target: post_id,
      from: both || from,
      to: both || to
    };
    metabox_jQuery.post(crp_admin.ajax_url, data);
  },
  searchPosts: function searchPosts() {
    metabox_jQuery('.crp_search_results').slideUp(250);
    Metabox.search_button.addClass('crp_spinner');
    var search_term = Metabox.search_term_field.val();
    if (search_term.length == 0) {
      Metabox.search_button.removeClass('crp_spinner');
      metabox_jQuery('#crp_search_results_input').slideDown(500);
      Metabox.search_term_field.focus();
    } else {
      var data = {
        action: 'crp_search_posts',
        security: crp_admin.nonce,
        post_type: Metabox.search_post_type.val(),
        term: search_term,
        base: Metabox.post_id
      };
      metabox_jQuery.post(crp_admin.ajax_url, data, function (posts) {
        Metabox.search_button.removeClass('crp_spinner');
        if (posts.length == 0) {
          metabox_jQuery('#crp_search_results_none').slideDown(500);
          Metabox.search_term_field.focus();
        } else {
          metabox_jQuery('#crp_search_results_table').slideDown(500).find('tbody').html(posts);
        }
      }, 'html');
    }
  },
  linkTo: function linkTo(post_id) {
    Metabox.addLink(post_id, false, true);
    Metabox.disableActions(post_id, false);
    var title = metabox_jQuery('#crp_post_' + post_id + '_title').text();
    var element = '<div id="crp_related_post_' + post_id + '" data-post="' + post_id + '">' + title + crp_admin.remove_image_to + '</div>';
    metabox_jQuery('#crp_relations_single_to').append(element);
  },
  linkFrom: function linkFrom(post_id) {
    Metabox.addLink(post_id, true, false);
    Metabox.disableActions(post_id, false);
    var title = metabox_jQuery('#crp_post_' + post_id + '_title').text();
    var element = '<div id="crp_related_post_' + post_id + '" data-post="' + post_id + '">' + crp_admin.remove_image_from + title + '</div>';
    metabox_jQuery('#crp_relations_single_from').append(element);
  },
  linkBoth: function linkBoth(post_id) {
    Metabox.addLink(post_id, true, true);
    Metabox.disableActions(post_id, true);

    // Remove any links that might already exists
    metabox_jQuery('#crp_related_post_' + post_id).remove();
    var title = metabox_jQuery('#crp_post_' + post_id + '_title').text();
    var element = '<tr id="crp_related_post_' + post_id + '" data-post="' + post_id + '"><td>' + title + crp_admin.remove_image_to + '</td><td><div class="crp_link">' + crp_admin.remove_image_both + '</div></td><td>' + crp_admin.remove_image_from + title + '</td></tr>';
    metabox_jQuery('#crp_relations_both').append(element);
  },
  disableActions: function disableActions(post_id, both) {
    metabox_jQuery('#crp_post_' + post_id + '_actions').find('button').each(function (index, elem) {
      if (both || index != 1) {
        elem.disabled = true;
      }
    });
  },
  addLink: function addLink(post_id, from, to) {
    var data = {
      action: 'crp_link_posts',
      security: crp_admin.nonce,
      base: Metabox.post_id,
      target: post_id,
      from: from,
      to: to
    };
    metabox_jQuery.post(crp_admin.ajax_url, data);
  }
};
/* harmony default export */ const metabox = (Metabox);
;// ./custom-related-posts/assets/js/admin.js




(CustomRelatedPosts = typeof CustomRelatedPosts === "undefined" ? {} : CustomRelatedPosts).admin = __webpack_exports__;
/******/ })()
;