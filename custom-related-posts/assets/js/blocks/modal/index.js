import { stringify } from 'querystringify';

const { __ } = wp.i18n;
const { apiFetch } = wp;
const { Component } = wp.element;
const { Modal, Spinner } = wp.components;

import '../../../css/admin/modal.scss';
import Post from './post';

class AddRelationModal extends Component {
	constructor() {
		super( ...arguments );

        this.latestRequestId = 0;
        this.isComponentMounted = false;

		this.state = {
            postType: '',
            search: '',
            searchType: 'default',
            posts: [],
            updatingPosts: false,
            hasLoadedPosts: false,
		};
    }

    componentDidMount() {
        this.isComponentMounted = true;
        this.updatePosts();
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    onChangePostType(event) {
        const postType = event.target.value;

        if ( postType !== this.state.postType ) {
            this.setState( {
                postType,
            }, this.updatePosts.bind( this ) );
        }
    }

    onChangeSearch(event) {
        const search = event.target.value;

        if ( search !== this.state.search ) {
            this.setState( {
                search,
            }, this.updatePosts.bind( this ) );
        }
    }

    onChangeSearchType(event) {
        const searchType = event.target.value;

        if ( searchType !== this.state.searchType ) {
            this.setState( {
                searchType,
            }, this.updatePosts.bind( this ) );
        }
    }

    updatePosts() {
        const requestId = ++this.latestRequestId;

        this.setState( {
            updatingPosts: true,
        } );

        apiFetch( {
            path: `/custom-related-posts/v1/search?${ stringify( {
                post_type: this.state.postType,
                keyword: this.state.search,
                search_type: this.state.searchType,
            } ) }`,
        } ).then( ( posts ) => {
            if ( this.isComponentMounted && requestId === this.latestRequestId ) {
                this.setState( {
                    posts,
                    updatingPosts: false,
                    hasLoadedPosts: true,
                } );
            }
        } ).catch( () => {
            if ( this.isComponentMounted && requestId === this.latestRequestId ) {
                this.setState( {
                    posts: [],
                    updatingPosts: false,
                    hasLoadedPosts: true,
                } );
            }
        } );
    }

    renderPostsBody() {
        const postRows = this.state.posts.map( ( post, index ) => (
            <Post
                post={ post }
                key={ index }
            />
        ) );

        if ( ! this.state.hasLoadedPosts ) {
            return <tbody />;
        }

        if ( 0 === this.state.posts.length ) {
            return (
                <tbody>
                    <tr className="crp-add-relations-feedback">
                        <td colSpan="5">
                            <em>{ __( 'No posts found.', 'custom-related-posts' ) }</em>
                        </td>
                    </tr>
                </tbody>
            );
        }

        return <tbody>{ postRows }</tbody>;
    }

	render() {
        return (
            <Modal
                title={ __( 'Add Relations') }
                onRequestClose={ this.props.onClose }
                focusOnMount={ false }
                className="crp-add-relations-modal"
            >
                <div className="crp-add-relations">
                    <div className="crp-add-relations-input">
                        <select
                            value={ this.state.postType }
                            onChange={ this.onChangePostType.bind(this) }
                        >
                            <option value="">{ __( 'All Post Types', 'custom-related-posts' ) }</option>
                            {
                                Object.keys(crp_admin.post_types).map( ( postType, index ) => (
                                    <option
                                        value={ postType }
                                        key={ index }
                                    >{ crp_admin.post_types[ postType ] }</option>
                                ) )
                            }
                        </select>
                        <div className="crp-add-relations-search-wrap">
                            <input
                                autoFocus
                                type="text"
                                placeholder={ __( 'Search posts...' ) }
                                className="crp-add-relations-search"
                                value={ this.state.search }
                                onChange={ this.onChangeSearch.bind(this) }
                            />
                            { this.state.updatingPosts && (
                                <span className="crp-add-relations-search-spinner">
                                    <Spinner />
                                </span>
                            ) }
                        </div>
                        <select
                            value={ this.state.searchType }
                            onChange={ this.onChangeSearchType.bind(this) }
                        >
                            <option value="default">{ __( 'Default Search', 'custom-related-posts' ) }</option>
                            <option value="title">{ __( 'Search by Title only', 'custom-related-posts' ) }</option>
                            <option value="id">{ __( 'Search by Post ID', 'custom-related-posts' ) }</option>
                        </select>
                    </div>
                    <div className={ `crp-add-relations-results${ this.state.updatingPosts ? ' is-loading' : '' }` }>
                        <table className="crp-add-relations-posts">
                            <thead>
                                <tr>
                                    <th className="crp-add-relations-col-thumbnail">&nbsp;</th>
                                    <th className="crp-add-relations-col-type">{ __( 'Type' ) }</th>
                                    <th className="crp-add-relations-col-date">{ __( 'Date' ) }</th>
                                    <th className="crp-add-relations-col-title">{ __( 'Title' ) }</th>
                                    <th className="crp-add-relations-col-action">{ __( 'Link' ) }</th>
                                </tr>
                            </thead>
                            { this.renderPostsBody() }
                        </table>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default AddRelationModal;
