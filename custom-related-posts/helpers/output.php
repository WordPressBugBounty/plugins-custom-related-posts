<?php

class CRP_Output {

    public function __construct()
    {
    }

    public function output_list( $post_id, $args, $widget = false )
    {
        $post_types = CustomRelatedPosts::setting( 'general_post_types' );
        if( !in_array( get_post_type( $post_id ), $post_types ) ) return '';

        $args = shortcode_atts(
            array(
                'title' => __( 'Related Posts', 'custom-related-posts' ),
                'order_by' => 'title',
                'order' => 'ASC',
                'none_text' => __( 'None found', 'custom-related-posts' ),
            ), $args
        );

        // Sanitize arguments.
        $args['title'] = sanitize_text_field( $args['title'] );
        $args['order_by'] = sanitize_key( $args['order_by'] );
        $args['order'] = strtoupper( sanitize_key( $args['order'] ) );
        $args['none_text'] = sanitize_text_field( $args['none_text'] );

        $relations = CustomRelatedPosts::get()->relations_to( $post_id );

        // Sort relations
        if( $args['order_by'] == 'title' ) {
            usort( $relations, array( $this, 'sortByTitle' ) );
        } elseif( $args['order_by'] == 'date' ) {
            usort( $relations, array( $this, 'sortByDate' ) );
        } elseif( $args['order_by'] == 'custom' ) {
            usort( $relations, array( $this, 'sortByOrder' ) );
        } elseif( $args['order_by'] == 'rand' ) {
            shuffle( $relations );
        }

        // echo '<pre>' . var_export( $relations, true ) . '</pre>';

        if( $args['order'] == 'DESC') {
            $relations = array_reverse( $relations, true );
        }

        // Start output
        $output = '';
        if( $widget ) {
            $output .= $widget['before_widget'];

            $title = apply_filters( 'widget_title', $args['title'] );
            if( !empty( $title ) ) {
                $output .= $widget['before_title'] . esc_html( $title ) . $widget['after_title'];
            }
        } else {
            if( $args['title'] ) {
                $title_tag = CustomRelatedPosts::setting( 'template_title_tag' );
                $output .= apply_filters( 'crp_output_list_title', '<' . $title_tag . ' class="crp-list-title">' . esc_html( $args['title'] ) . '</' . $title_tag . '>', $post_id );
            }
        }

        // Check if we can output any relations
        $relations_output = $this->output_relations( $relations, $post_id );

        if ( $relations_output ) {
            $output .= $relations_output;
        } else {
            if ( $args['none_text'] ) {
                $output .= '<p>' . esc_html( $args['none_text'] ) . '</p>';
            } else {
                // Don't output widget if no relations and no text to show
                return '';
            }
        }

        if( $widget ) $output .= $widget['after_widget'];

        // Add wrapper container.
        $output = '<div class="crp-list-container">' . $output . '</div>';

        return apply_filters( 'crp_output_list', $output, $post_id );
    }

    public function sortByTitle( $a, $b )
    {
        return strcmp( $a['title'], $b['title'] );
    }

    public function sortByDate( $a, $b )
    {
        return strtotime( $a['date'] ) - strtotime( $b['date'] );
    }

    public function sortByOrder( $a, $b )
    {
        return $a['order']- $b['order'];
    }

    public function output_relations( $relations, $post_id = false ) {
        $output = '';

        foreach( $relations as $relation ) {
            if( $relation['status'] == 'publish' ) {
                $output .= apply_filters( 'crp_output_list_item', $this->output_relation( $relation, $post_id ), $post_id, $relation );
            }
        }

        if ( $output ) {
            $tag = CustomRelatedPosts::setting( 'template_container' );
            $output = '<' . $tag . ' class="crp-list">' . $output . '</' . $tag . '>';
        }

        return $output;
    }

    public function output_relation( $relation, $current_post_id = false ) {
        $classes = array(
            'crp-list-item',
        );

        // Check if this relation is linking to the same post
        $is_self_reference = $current_post_id && isset( $relation['id'] ) && $relation['id'] == $current_post_id;
        
        if ( $is_self_reference ) {
            $classes[] = 'crp-list-item-self';
        }
        
        // Check if self-reference links are disabled
        $disable_self_links = $is_self_reference && !CustomRelatedPosts::setting( 'output_self_reference_links' );

        $link_target = CustomRelatedPosts::setting( 'output_open_in_new_tab') ? ' target="_blank"' : '';
        $tag = 'div' === CustomRelatedPosts::setting( 'template_container' ) ? 'div' : 'li';

        // Image.
        $image = '';
        $image_style = CustomRelatedPosts::setting( 'template_image' );
        
        $classes[] = 'crp-list-item-image-' . $image_style;

        if ( 'none' !== $image_style ) {
            $size = CustomRelatedPosts::setting( 'template_image_size' );

            preg_match( '/^(\d+)x(\d+)$/i', $size, $match );
            if ( ! empty( $match ) ) {
                $size = array( intval( $match[1] ), intval( $match[2] ) );
            }

            // Get attachment ID and use wp_get_attachment_image for proper alt/title attributes
            $attachment_id = get_post_thumbnail_id( $relation['id'] );
            $image = $attachment_id ? wp_get_attachment_image( $attachment_id, $size ) : '';

            if ( $image ) {
                // Prevent image stretching in Gutenberg.
                $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $relation['id'] ), $size );
                if ( $thumb[1] ) {
                    $style = 'max-width: ' . $thumb[1] . 'px; height: auto;';
    
                    if ( false !== stripos( $image, ' style="' ) ) {
                        $image = str_ireplace( ' style="', ' style="' . $style, $image );
                    } else {
                        $image = str_ireplace( '<img ', '<img style="' . $style . '" ', $image );
                    }
                }

                // Disable image pinning.
                if ( CustomRelatedPosts::setting( 'template_image_nopin' ) ) {
                    $image = str_ireplace( '<img ', '<img data-pin-nopin="true" ', $image );
                }

                $classes[] = 'crp-list-item-has-image';
                if ( $disable_self_links ) {
                    $image = '<div class="crp-list-item-image">' . $image . '</div>';
                } else {
                    $image = '<div class="crp-list-item-image"><a href="' . $relation['permalink'] . '"' . $link_target . '>' . $image . '</a></div>';
                }
            }
        }

        // Check if user has enabled any additional fields beyond title
        $has_additional_fields = $this->has_additional_fields_enabled();

        if ( $has_additional_fields ) {
            // Build content fields based on user settings and order
            $content_fields = $this->build_content_fields( $relation, $link_target, $disable_self_links );

            $output = '<' . $tag . ' class="' . implode( ' ', $classes ) . '">';

            if ( in_array( CustomRelatedPosts::setting( 'template_image' ), array( 'above', 'left' ) ) ) {
                $output .= $image;
            }

            $output .= '<div class="crp-list-item-content">' . $content_fields . '</div>';

            if ( in_array( CustomRelatedPosts::setting( 'template_image' ), array( 'below', 'right' ) ) ) {
                $output .= $image;
            }

            $output .= '</' . $tag . '>';
        } else {
            // Use original structure for backward compatibility
            $output = '<' . $tag . ' class="' . implode( ' ', $classes ) . '">';

            if ( in_array( CustomRelatedPosts::setting( 'template_image' ), array( 'above', 'left' ) ) ) {
                $output .= $image;
            }

            if ( $disable_self_links ) {
                $output .= '<div class="crp-list-item-title">';
                $output .= $relation['title'];
                $output .= '</div>';
            } else {
                $output .= '<div class="crp-list-item-title"><a href="' . $relation['permalink'] . '"' . $link_target . '>';
                $output .= $relation['title'];
                $output .= '</a></div>';
            }

            if ( in_array( CustomRelatedPosts::setting( 'template_image' ), array( 'below', 'right' ) ) ) {
                $output .= $image;
            }

            $output .= '</' . $tag . '>';
        }
        
        return $output;
    }

    private function build_content_fields( $relation, $link_target, $disable_self_links = false ) {
        $template = CustomRelatedPosts::setting( 'template_field_layout' );
        if ( empty( $template ) ) {
            $template = '[title]';
        }

        // Split template into lines
        $lines = array_filter( array_map( 'trim', explode( "\n", $template ) ) );
        $content = '';

        foreach ( $lines as $line ) {
            if ( empty( $line ) ) continue;

            // Replace faux shortcodes with actual content
            $line_content = $this->replace_shortcodes( $line, $relation, $link_target, $disable_self_links );
            
            if ( ! empty( $line_content ) ) {
                $content .= '<div class="crp-list-item-line">' . $line_content . '</div>';
            }
        }

        return $content;
    }

    private function replace_shortcodes( $line, $relation, $link_target, $disable_self_links = false ) {
        // Replace [title] shortcode
        $line = preg_replace_callback( '/\[title\]/', function( $matches ) use ( $relation, $link_target, $disable_self_links ) {
            if ( $disable_self_links ) {
                return '<span class="crp-field-title">' . esc_html( $relation['title'] ) . '</span>';
            } else {
                return '<span class="crp-field-title"><a href="' . $relation['permalink'] . '"' . $link_target . '>' . esc_html( $relation['title'] ) . '</a></span>';
            }
        }, $line );

        // Replace [author] shortcode
        $line = preg_replace_callback( '/\[author\]/', function( $matches ) use ( $relation, $link_target ) {
            if ( CustomRelatedPosts::setting( 'template_show_author' ) && ! empty( $relation['author_name'] ) ) {
                return '<span class="crp-field-author"><a href="' . esc_url( $relation['author_url'] ) . '"' . $link_target . '>' . esc_html( $relation['author_name'] ) . '</a></span>';
            }
            return '';
        }, $line );

        // Replace [date] shortcode
        $line = preg_replace_callback( '/\[date\]/', function( $matches ) use ( $relation ) {
            if ( CustomRelatedPosts::setting( 'template_show_date' ) && ! empty( $relation['date'] ) ) {
                $date_format = CustomRelatedPosts::setting( 'template_date_format' );
                $formatted_date = get_the_date( $date_format, $relation['id'] );
                return '<span class="crp-field-date">' . esc_html( $formatted_date ) . '</span>';
            }
            return '';
        }, $line );

        // Replace [excerpt] shortcode
        $line = preg_replace_callback( '/\[excerpt\]/', function( $matches ) use ( $relation ) {
            if ( CustomRelatedPosts::setting( 'template_show_excerpt' ) && ! empty( $relation['excerpt'] ) ) {
                $excerpt_length = CustomRelatedPosts::setting( 'template_excerpt_length' );
                $excerpt = wp_trim_words( $relation['excerpt'], $excerpt_length, '...' );
                return '<span class="crp-field-excerpt">' . esc_html( $excerpt ) . '</span>';
            }
            return '';
        }, $line );

        return $line;
    }

    private function has_additional_fields_enabled() {
        // Check if any additional fields are enabled
        $show_author = CustomRelatedPosts::setting( 'template_show_author' );
        $show_date = CustomRelatedPosts::setting( 'template_show_date' );
        $show_excerpt = CustomRelatedPosts::setting( 'template_show_excerpt' );
        
        // Check if field layout has been customized (not just default '[title]')
        $field_layout = CustomRelatedPosts::setting( 'template_field_layout' );
        $has_custom_layout = ! empty( $field_layout ) && trim( $field_layout ) !== '[title]';
        
        return ( $show_author || $show_date || $show_excerpt ) && $has_custom_layout;
    }
}