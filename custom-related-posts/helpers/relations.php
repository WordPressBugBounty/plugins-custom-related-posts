<?php

class CRP_Relations {

	private $relations_from = array();
	private $relations_to = array();

    public function __construct()
    {
    }

    public function add_relation( $base_id, $target_id, $from, $to )
    {
        $base = get_post( $base_id );
        $target = get_post( $target_id );

        if( $base_id !== $target_id && is_object( $base ) && is_object( $target ) ) {
            $base_data = $this->get_data( $base );
            $target_data = $this->get_data( $target );

            // Current Relations
            $base_relations_from = $this->get_from( $base_id );
            $base_relations_to = $this->get_to( $base_id );
            $target_relations_from = $this->get_from( $target_id );
            $target_relations_to = $this->get_to( $target_id );

            if( $from ) {
                $base_relations_from[$target_id] = $target_data;
                $target_relations_to[$base_id] = $base_data;

                $this->update_to( $target_id, $target_relations_to );
                $this->update_from( $base_id, $base_relations_from );
            }

            if( $to ) {
                // Default order to last item.
                $target_data['order'] = count( $base_relations_to );

                $base_relations_to[$target_id] = $target_data;
                $target_relations_from[$base_id] = $base_data;

                $this->update_to( $base_id, $base_relations_to );
                $this->update_from( $target_id, $target_relations_from );
            }
        }
    }

    public function remove_relation( $base_id, $target_id, $from, $to )
    {
        $base = get_post( $base_id );

        if( $base_id !== $target_id && is_object( $base ) ) {

            // Current Relations
            $base_relations_from = CustomRelatedPosts::get()->relations_from( $base_id );
            $base_relations_to = CustomRelatedPosts::get()->relations_to( $base_id );

            if( $from ) {
                unset( $base_relations_from[$target_id] );
                $this->update_from( $base_id, $base_relations_from );
            }

            if( $to ) {
                unset( $base_relations_to[$target_id] );
                $this->update_to( $base_id, $base_relations_to );
            }

            // Remove target (if still exists).
            $target = get_post( $target_id );

            if ( is_object( $target ) ) {
                $target_relations_from = CustomRelatedPosts::get()->relations_from( $target_id );
                $target_relations_to = CustomRelatedPosts::get()->relations_to( $target_id );

                if( $from ) {
                    unset( $target_relations_to[$base_id] );
                    $this->update_to( $target_id, $target_relations_to );
                }
    
                if( $to ) {
                    unset( $target_relations_from[$base_id] );
                    $this->update_from( $target_id, $target_relations_from );
                }
            }
        }
    }

    public function set_order( $base_id, $order )
    {
        $base = get_post( $base_id );

        if( is_object( $base ) ) {
            $base_relations_to = $this->get_to( $base_id );
            $ordered_relations = array();

            $index = 0;
            foreach ( $order as $id ) {
                if ( isset( $base_relations_to[ $id ] ) ) {
                    $ordered_relations[ $id ] = $base_relations_to[ $id ];
                    $ordered_relations[ $id ]['order'] = $index;
                    $index++;
                }
            }

            // Set max order, if anything is missing.
            foreach ( $base_relations_to as $id => $relation ) {
                if ( ! isset( $ordered_relations[ $id ] ) ) {
                    $ordered_relations[ $id ] = $relation;
                    $ordered_relations[ $id ]['order'] = $index;
                    $index++;
                }
            }

            $this->update_to( $base_id, $ordered_relations );
        }
    }

    public function get_data( $post )
    {
        if( !is_object( $post ) ) $post = get_post( $post );

        // Get author information
        $author_id = $post->post_author;
        $author_name = get_the_author_meta( 'display_name', $author_id );
        $author_url = get_author_posts_url( $author_id );

        // Get excerpt - use manual excerpt if available, otherwise generate from content
        $excerpt = '';
        if ( ! empty( $post->post_excerpt ) ) {
            $excerpt = $post->post_excerpt;
        } else {
            $excerpt_length = CustomRelatedPosts::setting( 'template_excerpt_length' );
            $excerpt = wp_trim_words( $post->post_content, $excerpt_length, '...' );
        }

        return array(
            'id' => $post->ID,
            'title' => $post->post_title,
            'permalink' => get_permalink( $post ),
            'status' => $post->post_status,
            'date' => $post->post_date,
            'author_id' => $author_id,
            'author_name' => $author_name,
            'author_url' => $author_url,
            'excerpt' => $excerpt,
        );
    }

    public function get_from( $post_id )
    {
	    if( !array_key_exists( $post_id, $this->relations_from ) ) {
		    $relations = get_post_meta( $post_id, 'crp_relations_from', true );
		    if( !$relations ) $relations = array();

		    $this->relations_from[$post_id] = $this->maybe_update_cached_relations( $relations );
	    }

	    return $this->relations_from[$post_id];
    }

	public function get_to( $post_id )
	{
		if( !array_key_exists( $post_id, $this->relations_to ) ) {
			$relations = get_post_meta( $post_id, 'crp_relations_to', true );
			if( !$relations ) $relations = array();

			$this->relations_to[$post_id] = $this->maybe_update_cached_relations( $relations );
		}

		return $this->relations_to[$post_id];
	}

    public function update_from( $post_id, $relations )
    {
        $this->relations_from[$post_id] = $relations;
        update_post_meta( $post_id, 'crp_relations_from', $relations );
    }

    public function update_to( $post_id, $relations )
    {
        $this->relations_from[$post_id] = $relations;
        update_post_meta( $post_id, 'crp_relations_to', $relations );
    }

    public function maybe_update_cached_relations( $relations ) {
        $updated_relations = $relations;

        // Check if caching is disabled.
        if ( ! CustomRelatedPosts::setting( 'cache_relations' ) ) {
            foreach ( $relations as $id => $relation ) {
                $updated_relations[ $id ] = $this->get_data( $id );

                // Make sure order is set.
                $updated_relations[ $id ]['order'] = isset( $relation['order'] ) ? $relation['order'] : 0;
            }
        } else {
            // Make sure ID and order are set (wasn't saved in early versions).
            foreach ( $relations as $id => $relation ) {
                $updated_relations[ $id ]['id'] = $id;
                
                if ( ! isset( $updated_relations[ $id ]['order'] ) ) {
                    $updated_relations[ $id ]['order'] = 0;
                }
            }
        }

        return $updated_relations;
    }

    public function get_posts_with_relations_count() {
        global $wpdb;
        
        $count = $wpdb->get_var( "
            SELECT COUNT(DISTINCT post_id) 
            FROM {$wpdb->postmeta} 
            WHERE meta_key IN ('crp_relations_from', 'crp_relations_to')
        " );
        
        return intval( $count );
    }

    public function get_posts_with_relations_batch( $offset = 0, $limit = 10 ) {
        global $wpdb;
        
        $post_ids = $wpdb->get_col( $wpdb->prepare( "
            SELECT DISTINCT post_id 
            FROM {$wpdb->postmeta} 
            WHERE meta_key IN ('crp_relations_from', 'crp_relations_to')
            ORDER BY post_id
            LIMIT %d OFFSET %d
        ", $limit, $offset ) );
        
        return array_map( 'intval', $post_ids );
    }

    public function update_permalinks_batch( $post_ids ) {
        $updated_count = 0;
        
        foreach ( $post_ids as $post_id ) {
            $updated = false;
            
            // Update relations_from
            $relations_from = get_post_meta( $post_id, 'crp_relations_from', true );
            if ( ! empty( $relations_from ) && is_array( $relations_from ) ) {
                $new_relations_from = array();
                foreach ( $relations_from as $related_id => $relation_data ) {
                    $related_post = get_post( $related_id );
                    if ( $related_post ) {
                        $new_relations_from[ $related_id ] = $this->get_data( $related_post );
                        // Preserve order if it exists
                        if ( isset( $relation_data['order'] ) ) {
                            $new_relations_from[ $related_id ]['order'] = $relation_data['order'];
                        }
                    } else {
                        // Post no longer exists, remove the relation
                        $new_relations_from[ $related_id ] = $relation_data;
                    }
                }
                
                if ( $relations_from !== $new_relations_from ) {
                    update_post_meta( $post_id, 'crp_relations_from', $new_relations_from );
                    $updated = true;
                }
            }
            
            // Update relations_to
            $relations_to = get_post_meta( $post_id, 'crp_relations_to', true );
            if ( ! empty( $relations_to ) && is_array( $relations_to ) ) {
                $new_relations_to = array();
                foreach ( $relations_to as $related_id => $relation_data ) {
                    $related_post = get_post( $related_id );
                    if ( $related_post ) {
                        $new_relations_to[ $related_id ] = $this->get_data( $related_post );
                        // Preserve order if it exists
                        if ( isset( $relation_data['order'] ) ) {
                            $new_relations_to[ $related_id ]['order'] = $relation_data['order'];
                        }
                    } else {
                        // Post no longer exists, remove the relation
                        $new_relations_to[ $related_id ] = $relation_data;
                    }
                }
                
                if ( $relations_to !== $new_relations_to ) {
                    update_post_meta( $post_id, 'crp_relations_to', $new_relations_to );
                    $updated = true;
                }
            }
            
            if ( $updated ) {
                $updated_count++;
            }
        }
        
        return $updated_count;
    }

}