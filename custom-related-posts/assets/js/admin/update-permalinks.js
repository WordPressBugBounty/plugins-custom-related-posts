import '../../css/admin/spinner.scss';

jQuery(document).ready(function($) {
    if($('#crp-progress-container').length > 0) {
        CRP_Update_Permalinks.init();
    }
});

let CRP_Update_Permalinks = {
    totalCount: 0,
    processedCount: 0,
    updatedCount: 0,
    batchSize: 10,
    isRunning: false,
    currentOffset: 0,

    init: function() {
        this.startUpdate();
    },

    startUpdate: function() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.showProgressContainer();
        this.updateStatus('Getting total count...');
        
        // Get total count first
        this.getTotalCount();
    },

    getTotalCount: function() {
        jQuery.post(crp_admin.ajax_url, {
            action: 'crp_get_permalinks_count',
            security: crp_admin.nonce
        }, (response) => {
            if (response.success) {
                this.totalCount = response.data.total_count;
                this.updateProgressDisplay();
                this.updateStatus('Starting batch processing...');
                this.processNextBatch();
            } else {
                this.showError('Failed to get total count: ' + response.data.message);
            }
        }, 'json').fail(() => {
            this.showError('Network error while getting total count.');
        });
    },

    processNextBatch: function() {
        if (!this.isRunning) return;
        
        this.updateStatus(`Processing batch ${Math.floor(this.currentOffset / this.batchSize) + 1}...`);
        
        jQuery.post(crp_admin.ajax_url, {
            action: 'crp_update_permalinks_batch',
            security: crp_admin.nonce,
            offset: this.currentOffset,
            limit: this.batchSize
        }, (response) => {
            if (response.success) {
                this.processedCount += response.data.processed_count;
                this.updatedCount += response.data.updated_count;
                this.currentOffset += this.batchSize;
                
                this.updateProgressDisplay();
                
                if (response.data.has_more && this.isRunning) {
                    // Continue with next batch after a short delay
                    setTimeout(() => {
                        this.processNextBatch();
                    }, 100);
                } else {
                    this.completeUpdate();
                }
            } else {
                this.showError('Batch processing failed: ' + response.data.message);
            }
        }, 'json').fail(() => {
            this.showError('Network error during batch processing.');
        });
    },

    updateProgressDisplay: function() {
        const percentage = this.totalCount > 0 ? Math.round((this.processedCount / this.totalCount) * 100) : 0;
        
        $('#crp-progress-bar').css('width', percentage + '%');
        $('#crp-progress-text').text(percentage + '%');
        $('#crp-progress-count').text(this.processedCount);
        $('#crp-total-count').text(this.totalCount);
        $('#crp-updated-count').text(this.updatedCount);
    },

    updateStatus: function(message) {
        $('#crp-status-text').text(message);
    },

    showProgressContainer: function() {
        $('#crp-progress-container').show();
        $('#crp-completion-container').hide();
        $('#crp-error-container').hide();
    },

    completeUpdate: function() {
        this.isRunning = false;
        this.updateStatus('Update completed successfully!');
        this.showCompletion();
    },

    showCompletion: function() {
        $('#crp-progress-container').hide();
        $('#crp-completion-container').show();
        
        const message = `Successfully updated permalinks for ${this.updatedCount} out of ${this.totalCount} posts with relations.`;
        $('#crp-completion-message').html(`<p>${message}</p>`);
    },

    showError: function(message) {
        this.isRunning = false;
        $('#crp-progress-container').hide();
        $('#crp-error-container').show();
        $('#crp-error-message').html(`<p>${message}</p>`);
    },

    cancel: function() {
        this.isRunning = false;
        this.showError('Update cancelled by user.');
    },

    retry: function() {
        this.totalCount = 0;
        this.processedCount = 0;
        this.updatedCount = 0;
        this.currentOffset = 0;
        this.startUpdate();
    }
};

// Event handlers
jQuery(document).ready(function($) {
    $(document).on('click', '#crp-cancel-update', function() {
        CRP_Update_Permalinks.cancel();
    });
    
    $(document).on('click', '#crp-retry-update', function() {
        CRP_Update_Permalinks.retry();
    });
});

export default CRP_Update_Permalinks;
