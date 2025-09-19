<div class="wrap crp-update-permalinks">
    <div id="icon-tools" class="icon32"></div>
    <h2><?php _e( 'Update Permalinks', 'custom-related-posts' ); ?></h2>
    
    <div id="crp-progress-container" style="display: none;">
        <h3><?php _e( 'Updating Permalinks...', 'custom-related-posts' ); ?></h3>
        <p><?php _e( 'Please wait while we update the stored permalinks in your relations. This may take a few minutes depending on the number of posts.', 'custom-related-posts' ); ?></p>
        
        <div class="progress-bar-container" style="width: 100%; background-color: #f0f0f0; border-radius: 4px; margin: 20px 0;">
            <div id="crp-progress-bar" style="width: 0%; height: 30px; background-color: #0073aa; border-radius: 4px; transition: width 0.3s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                <span id="crp-progress-text">0%</span>
            </div>
        </div>
        
        <div id="crp-progress-details" style="margin: 10px 0;">
            <p><strong><?php _e( 'Status:', 'custom-related-posts' ); ?></strong> <span id="crp-status-text"><?php _e( 'Initializing...', 'custom-related-posts' ); ?></span></p>
            <p><strong><?php _e( 'Progress:', 'custom-related-posts' ); ?></strong> <span id="crp-progress-count">0</span> / <span id="crp-total-count">0</span> <?php _e( 'posts processed', 'custom-related-posts' ); ?></p>
            <p><strong><?php _e( 'Updated:', 'custom-related-posts' ); ?></strong> <span id="crp-updated-count">0</span> <?php _e( 'posts with changes', 'custom-related-posts' ); ?></p>
        </div>
        
        <div id="crp-progress-actions" style="margin: 20px 0;">
            <button id="crp-cancel-update" class="button" style="display: none;"><?php _e( 'Cancel', 'custom-related-posts' ); ?></button>
        </div>
    </div>
    
    <div id="crp-completion-container" style="display: none;">
        <h3><?php _e( 'Update Complete!', 'custom-related-posts' ); ?></h3>
        <div id="crp-completion-message"></div>
        <p>
            <a href="<?php echo admin_url( 'options-general.php?page=bv_settings_crp' ); ?>" class="button button-primary"><?php _e( 'Return to Settings', 'custom-related-posts' ); ?></a>
        </p>
    </div>
    
    <div id="crp-error-container" style="display: none;">
        <h3><?php _e( 'Update Failed', 'custom-related-posts' ); ?></h3>
        <div id="crp-error-message"></div>
        <p>
            <button id="crp-retry-update" class="button button-primary"><?php _e( 'Try Again', 'custom-related-posts' ); ?></button>
            <a href="<?php echo admin_url( 'options-general.php?page=bv_settings_crp' ); ?>" class="button"><?php _e( 'Return to Settings', 'custom-related-posts' ); ?></a>
        </p>
    </div>
</div>

<style>
.crp-update-permalinks .progress-bar-container {
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

.crp-update-permalinks #crp-progress-bar {
    min-width: 30px;
}

.crp-update-permalinks .progress-details {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
}
</style>
