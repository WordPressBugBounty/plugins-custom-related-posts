<?php

class CRP_Api {

    public function __construct()
    {
        add_action( 'rest_api_init', array( $this, 'api_register_data' ) );
    }

    public function api_register_data() {
        if ( function_exists( 'register_rest_field' ) ) { // Prevent issue with Jetpack.
			register_rest_route( 'custom-related-posts/v1', '/relations/(?P<id>\d+)', array(
				'callback' => array( $this, 'api_get_relations' ),
				'methods' => 'GET',
				'args' => array(
					'id' => array(
						'validate_callback' => array( $this, 'api_validate_numeric' ),
					),
                ),
                'permission_callback' => '__return_true',
            ));
            register_rest_route( 'custom-related-posts/v1', '/relations/(?P<id>\d+)', array(
				'callback' => array( $this, 'api_add_relation' ),
				'methods' => 'POST',
				'args' => array(
					'id' => array(
						'validate_callback' => array( $this, 'api_validate_numeric' ),
					),
                ),
                'permission_callback' => array( $this, 'api_check_user_permission' ),
            ));
            register_rest_route( 'custom-related-posts/v1', '/relations/(?P<id>\d+)/order', array(
				'callback' => array( $this, 'api_set_relations_order' ),
				'methods' => 'PUT',
				'args' => array(
					'id' => array(
						'validate_callback' => array( $this, 'api_validate_numeric' ),
					),
                ),
                'permission_callback' => array( $this, 'api_check_user_permission' ),
            ));
            register_rest_route( 'custom-related-posts/v1', '/relations/(?P<id>\d+)', array(
				'callback' => array( $this, 'api_remove_relation' ),
				'methods' => 'DELETE',
				'args' => array(
					'id' => array(
						'validate_callback' => array( $this, 'api_validate_numeric' ),
					),
                ),
                'permission_callback' => array( $this, 'api_check_user_permission' ),
            ));
            register_rest_route( 'custom-related-posts/v1', '/search', array(
				'callback' => array( $this, 'api_search' ),
                'methods' => 'GET',
                'args' => array(
					'keyword' => array(
						'type' => 'string',
					),
					'search_type' => array(
						'type' => 'string',
						'default' => 'default',
					),
                ),
                'permission_callback' => array( $this, 'api_check_user_permission' ),
			));
		}
    }

    public function api_validate_numeric( $param, $request, $key ) {
		return is_numeric( $param );
	}

    public function api_check_user_permission( $request ) {
        return is_user_logged_in();
    }

    public function api_add_relation( $request ) {
        $base_id = $request['id'];
        $type = $request['type'];

        if ( current_user_can( 'edit_post', $base_id ) ) {
            $target_id = $request['target'];
            $from = 'from' === $type || 'both' === $type ? true : false;
            $to = 'to' === $type || 'both' === $type ? true : false;

            CustomRelatedPosts::get()->helper( 'relations' )->add_relation( $base_id, $target_id, $from, $to );
        }

        return $this->api_get_relations( $request );
    }

    public function api_set_relations_order( $request ) {
        $base_id = $request['id'];

        if ( current_user_can( 'edit_post', $base_id ) ) {
            $order = $request['order'];

            CustomRelatedPosts::get()->helper( 'relations' )->set_order( $base_id, $order );
        }

        return $this->api_get_relations( $request );
    }

    public function api_remove_relation( $request ) {
        $base_id = $request['id'];
        $type = $request['type'];

        if ( current_user_can( 'edit_post', $base_id ) ) {
            $target_id = $request['target'];
            $from = 'from' === $type || 'both' === $type ? true : false;
            $to = 'to' === $type || 'both' === $type ? true : false;

            CustomRelatedPosts::get()->helper( 'relations' )->remove_relation( $base_id, $target_id, $from, $to );
        }

        return $this->api_get_relations( $request );
	}

    public function api_get_relations( $request ) {
        $relations_from = CustomRelatedPosts::get()->relations_from( $request['id'] );
        $relations_to = CustomRelatedPosts::get()->relations_to( $request['id'] );

        $is_logged_in = is_user_logged_in();

        // Filter relations based on user access
        $filtered_from = array();
        foreach ( $relations_from as $post_id => $relation ) {
            $post = get_post( $post_id );
            if ( ! $post ) {
                continue;
            }

            if ( $is_logged_in ) {
                // For logged-in users: check if they can read this post
                if ( current_user_can( 'read_post', $post_id ) ) {
                    $filtered_from[ $post_id ] = $relation;
                }
            } else {
                // For non-logged-in users: only return published posts
                if ( 'publish' === $post->post_status ) {
                    $filtered_from[ $post_id ] = $relation;
                }
            }
        }

        $filtered_to = array();
        foreach ( $relations_to as $post_id => $relation ) {
            $post = get_post( $post_id );
            if ( ! $post ) {
                continue;
            }

            if ( $is_logged_in ) {
                // For logged-in users: check if they can read this post
                if ( current_user_can( 'read_post', $post_id ) ) {
                    $filtered_to[ $post_id ] = $relation;
                }
            } else {
                // For non-logged-in users: only return published posts
                if ( 'publish' === $post->post_status ) {
                    $filtered_to[ $post_id ] = $relation;
                }
            }
        }

        return array(
            'from' => $filtered_from,
            'to' => $filtered_to,
        );
    }

    public function api_search( $request ) {
        $post_type = sanitize_key( $request['post_type'] );
        $keyword = sanitize_text_field( (string) $request['keyword'] );
        $search_type = sanitize_text_field( $request['search_type'] );

        // Sanitize Post Type.
        $search_post_types = CustomRelatedPosts::setting( 'general_post_types' );

        if ( ! in_array( $post_type, $search_post_types ) ) {
            $post_type = $search_post_types;
        }

        $args = array(
            'post_type' => $post_type,
            'post_status' => CustomRelatedPosts::setting( 'search_post_status' ),
            'posts_per_page' => intval( CustomRelatedPosts::setting( 'search_number_of_posts' ) ),
            'orderby' => 'date',
            'order' => 'DESC',
            'perm' => 'readable', // Only return posts the current user can read,
        );

        if ( '' === $keyword ) {
            $args['ignore_sticky_posts'] = true;
        } else {
            // Handle search type
            switch ( $search_type ) {
                case 'title':
                    // For title-only search, use a custom query parameter and filter
                    $args['crp_search_title'] = $keyword;
                    break;
                case 'id':
                    // For ID search, use a custom query parameter and filter
                    $args['crp_search_id'] = $keyword;
                    break;
                default:
                    // Default search in title and content
                    $args['s'] = $keyword;
                    break;
            }
        }

        $args = apply_filters( 'crp_search_args', $args );
        
        add_filter( 'posts_where', array( $this, 'filter_posts_where_custom_search' ), 10, 2 );
        $query = new WP_Query( $args );
        remove_filter( 'posts_where', array( $this, 'filter_posts_where_custom_search' ), 10 );

        $posts = array();
        if ( $query->have_posts() ) {
            $query_posts = $query->posts;

            foreach( $query_posts as $post ) {
                // Additional safeguard: Only include posts the current user can read
                if ( ! current_user_can( 'read_post', $post->ID ) ) {
                    continue;
                }

                $post_type = get_post_type_object( $post->post_type );

                $thumbnail_url = '';
                $thumbnail_id = get_post_thumbnail_id( $post->ID );
                if ( $thumbnail_id ) {
                    $thumbnail = wp_get_attachment_image_src( $thumbnail_id, 'thumbnail' );
                    if ( $thumbnail ) {
                        $thumbnail_url = $thumbnail[0];
                    }
                }

                $posts[] = array(
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'permalink' => get_permalink( $post ),
                    'status' => $post->post_status,
                    'date' => $post->post_date,
                    'date_display' => mysql2date( "j M 'y", $post->post_date ),
                    'post_type' => $post_type->labels->singular_name,
                    'thumbnail' => $thumbnail_url,
                );
            }
        }

        return $posts;
	}

    /**
     * Filter posts_where to add title-only and ID search functionality
     */
    public function filter_posts_where_custom_search( $where, $wp_query ) {
        global $wpdb;
        
        $title_search = $wp_query->get( 'crp_search_title' );
        if ( $title_search ) {
            $where .= ' AND ' . $wpdb->posts . '.post_title LIKE \'%' . esc_sql( $wpdb->esc_like( $title_search ) ) . '%\'';
        }
        
        $id_search = $wp_query->get( 'crp_search_id' );
        if ( $id_search ) {
            $where .= ' AND ' . $wpdb->posts . '.ID LIKE \'%' . esc_sql( $wpdb->esc_like( $id_search ) ) . '%\'';
        }
        
        return $where;
    }
}
