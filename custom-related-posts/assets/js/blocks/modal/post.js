const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Button } = wp.components;
const { compose } = wp.compose;
const { withDispatch } = wp.data;

import Data from '../data/helpers';

function Post( props ) {
	const { post, relationToIDs, relationFromIDs } = props;

	if ( ! post ) {
		return null;
	}

	let linked = false;
	if ( relationToIDs.includes(post.id) && relationFromIDs.includes(post.id) ) {
		linked = 'both';
	} else if ( relationToIDs.includes(post.id) ) {
		linked = 'to';
	} else if ( relationFromIDs.includes(post.id) ) {
		linked = 'from';
	}

	let orderedPost = {
		...post,
		order: relationToIDs.length,
	}

	return (
		<tr className="crp-add-relations-row">
			<td className="crp-add-relations-col-thumbnail">
				{ post.thumbnail ? (
					<img src={ post.thumbnail } alt="" />
				) : (
					<span className="crp-add-relations-thumbnail-placeholder" aria-hidden="true" />
				) }
			</td>
			<td className="crp-add-relations-col-type">{ post.post_type }</td>
			<td className="crp-add-relations-col-date">{ post.date_display }</td>
			<td className="crp-add-relations-col-title"><a href={ post.permalink} target="_blank">{ post.title }</a></td>
			<td className="crp-add-relations-col-action">
				{
					'both' === linked
					?
					<Button
						className="crp-add-relations-button"
						variant="secondary"
						disabled={true}
					>{ __( 'Already linked' ) }</Button>
					:
					<Fragment>
						<Button
							className="crp-add-relations-button crp-add-relations-button-to"
							variant="secondary"
							disabled={ false !== linked }
							onClick={ () => props.onAddRelationTo( orderedPost ) }
						>{ __( 'To' ) }</Button>
						<Button
							className="crp-add-relations-button crp-add-relations-button-both"
							isPrimary={true}
							onClick={ () => props.onAddRelationBoth( orderedPost ) }
						>{ __( 'Both' ) }</Button>
						<Button
							className="crp-add-relations-button crp-add-relations-button-from"
							variant="secondary"
							disabled={ false !== linked }
							onClick={ () => props.onAddRelationFrom( orderedPost ) }
						>{ __( 'From' ) }</Button>
					</Fragment>
				}
			</td>
		</tr>
) };

const applyWithDispatch = withDispatch( ( dispatch, ownProps ) => {
	const { addRelationTo, addRelationBoth, addRelationFrom } = dispatch( 'custom-related-posts' );

    return {
		onAddRelationTo: ( post ) => {
			return addRelationTo( ownProps.postId, post );
		},
		onAddRelationBoth: ( post ) => {
			return addRelationBoth( ownProps.postId, post );
		},
		onAddRelationFrom: ( post ) => {
			return addRelationFrom( ownProps.postId, post );
		},
    }
} );

export default compose(
    Data.selectRelationsForCurrentPost,
    applyWithDispatch
)( Post );
