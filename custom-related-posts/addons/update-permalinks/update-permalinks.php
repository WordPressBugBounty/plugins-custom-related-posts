<?php

class CRP_Update_Permalinks extends CRP_Addon {

    public function __construct( $name = 'update-permalinks' ) {
        parent::__construct( $name );

        // Actions
        add_action( 'admin_menu', array( $this, 'update_permalinks_menu' ) );
    }

    public function update_permalinks_menu() {
        add_submenu_page( '', __( 'Update Permalinks', 'custom-related-posts' ), __( 'Update Permalinks', 'custom-related-posts' ), 'manage_options', 'crp_update_permalinks', array( $this, 'update_permalinks_page' ) );
    }

    public function update_permalinks_page() {
        if ( !current_user_can('manage_options') ) {
            wp_die( 'You do not have sufficient permissions to access this page.' );
        }

        require( $this->addonDir. '/templates/progress.php' );
    }
}

CustomRelatedPosts::loaded_addon( 'update-permalinks', new CRP_Update_Permalinks() );
