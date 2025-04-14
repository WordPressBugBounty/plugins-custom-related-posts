<?php

class CRP_Settings {

    public $bvs;

    public function __construct()
    {
        add_action( 'after_setup_theme', array( $this, 'init_settings' ) );
    }

    public function init_settings() {
        require_once( CustomRelatedPosts::get()->coreDir . '/helpers/settings_structure.php');
        require_once( CustomRelatedPosts::get()->coreDir . '/vendor/bv-settings/bv-settings.php' );
        $this->bvs = new BV_Settings( array(
            'uid' => 'crp',
            'menu_title' => 'Custom Related Posts',
            'settings' => $settings_structure,
        ) );
    }

    public function get( $setting ) {
        return $this->bvs->get( $setting );
    }
}