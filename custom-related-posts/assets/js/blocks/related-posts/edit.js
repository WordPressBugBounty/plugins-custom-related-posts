const { __ } = wp.i18n;
const {
    PanelBody,
    TextControl,
    RadioControl,
    Disabled,
    Spinner,
} = wp.components;
const { Component, Fragment } = wp.element;

// Backwards compatibility - WordPress 6.4+ uses wp.blockEditor
const { InspectorControls, useBlockProps } = wp.blockEditor || wp.editor || {};
const ServerSideRender = wp.serverSideRender || wp.components.ServerSideRender;

import '../../../css/public/output.scss';
import Data from '../data/helpers';

class RelatedPostsEdit extends Component {
    constructor() {
        super( ...arguments );
        
        this.state = {
            isLoading: false,
        };
        
        this.loadingTimeout = null;
    }

    componentDidUpdate( prevProps ) {
        // If relations changed (IDs or order), show loading indicator
        const { relations } = this.props;
        
        // Get ordered relation IDs based on order property
        const getOrderedRelationIDs = ( relationsObj ) => {
            return Object.values( relationsObj.to )
                .filter( post => 'publish' === post.status )
                .sort( (a, b) => (a.order || 0) - (b.order || 0) )
                .map( post => post.id );
        };
        
        const prevOrderedIDs = getOrderedRelationIDs( prevProps.relations ).join( ',' );
        const currentOrderedIDs = getOrderedRelationIDs( relations ).join( ',' );
        
        if ( prevOrderedIDs !== currentOrderedIDs ) {
            // Clear any existing timeout
            if ( this.loadingTimeout ) {
                clearTimeout( this.loadingTimeout );
            }
            
            // Show loading indicator
            this.setState( { isLoading: true } );
            
            // Hide loading indicator after a reasonable time (ServerSideRender handles its own loading)
            // This gives users visual feedback that something is happening
            this.loadingTimeout = setTimeout( () => {
                this.setState( { isLoading: false } );
                this.loadingTimeout = null;
            }, 1500 ); // Show for at least 1.5 seconds to give ServerSideRender time to load
        }
    }

    componentWillUnmount() {
        // Clean up timeout
        if ( this.loadingTimeout ) {
            clearTimeout( this.loadingTimeout );
        }
    }

    render() {
        const { attributes, setAttributes, relations } = this.props;
        const { title, none_text, order_by, order } = attributes;

        // Filter and sort relations by order property (for custom order)
        const filteredRelations = Object.values( relations.to )
            .filter( (post) => 'publish' === post.status )
            .sort( (a, b) => (a.order || 0) - (b.order || 0) );
        const hasRelations = filteredRelations.length > 0;
        
        // Create ordered relation IDs for the render key (includes order information)
        const orderedRelationIDs = filteredRelations.map( post => post.id );

        const sideBar = InspectorControls ? (
			<InspectorControls>
				<PanelBody title={ __( 'Custom Related Posts Settings' ) }>
                    <TextControl
                        label={ __( 'Title' ) }
                        value={ title }
                        onChange={ ( value ) => setAttributes( { title: value } ) }
                    />
                    <TextControl
                        label={ __( 'None Text' ) }
                        help={ __( 'Leave blank to hide when there are no related posts.' ) }
                        value={ none_text }
                        onChange={ ( value ) => setAttributes( { none_text: value } ) }
                    />
                    <RadioControl
                        label={ __( 'Order By' ) }
                        selected={ order_by }
                        options={ [
                            { label: __( 'Title' ), value: 'title' },
                            { label: __( 'Date' ), value: 'date' },
                            { label: __( 'Custom' ), value: 'custom' },
                            { label: __( 'Random' ), value: 'rand' },
                        ] }
                        onChange={ ( value ) => setAttributes( { order_by: value } ) }
                    />
                    <RadioControl
                        label={ __( 'Order' ) }
                        selected={ order }
                        options={ [
                            { label: __( 'Ascending' ), value: 'ASC' },
                            { label: __( 'Descending' ), value: 'DESC' },
                        ] }
                        onChange={ ( value ) => setAttributes( { order: value } ) }
                    />
				</PanelBody>
			</InspectorControls>
        ) : null;
        
        // Create a key that changes when relations change (IDs or order) to force ServerSideRender to re-render
        const renderKey = orderedRelationIDs.join( ',' );
        const { isLoading } = this.state;
        
        return (
            <Fragment>
                { sideBar }
                <RelatedPostsEditContent
                    isLoading={ isLoading }
                    hasRelations={ hasRelations }
                    none_text={ none_text }
                    renderKey={ renderKey }
                    attributes={ attributes }
                    filteredRelations={ filteredRelations }
                />
            </Fragment>
        );
    }
}

// Wrapper component that uses useBlockProps hook for API version 3 compatibility
function RelatedPostsEditContent( props ) {
    const blockProps = useBlockProps ? useBlockProps() : {};
    const { isLoading, hasRelations, none_text, renderKey, attributes, filteredRelations } = props;
    
    return (
        <div { ...blockProps }>
            {
                ! hasRelations && ! none_text
                ?
                <em>{ __( 'This block will be empty until you add a related post.' ) }</em>
                :
                <Disabled>
                    { isLoading && (
                        <div style={ { 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            padding: '20px',
                            minHeight: '60px'
                        } }>
                            <Spinner />
                            <span style={ { marginLeft: '10px' } }>
                                { __( 'Loading related posts...' ) }
                            </span>
                        </div>
                    ) }
                    <div style={ { opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.3s ease' } }>
                        { ServerSideRender ? (
                            <ServerSideRender
                                key={ renderKey }
                                block="custom-related-posts/related-posts"
                                attributes={ {
                                    ...attributes,
                                    relations: filteredRelations,
                                }}
                            />
                        ) : (
                            <em>{ __( 'Server-side rendering is not available. Please refresh the page.' ) }</em>
                        ) }
                    </div>
                </Disabled>
            }
        </div>
    );
}

export default Data.selectRelationsForCurrentPost( RelatedPostsEdit );
