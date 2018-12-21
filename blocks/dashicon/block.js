/**
 * A DashIcon block.
 * @TODO Add some spacing options.
 * @TODO Add a real icon selection process.
 **/
import classnames from 'classnames';

const { Fragment } = React;

const { registerBlockType } = wp.blocks;

const {
	getColorClassName
} = wp.editor;

import { default as editor } from './components/editor'

registerBlockType( 'locals/dashicon', {
    title: 'DashIcon',

    icon: 'smiley',

    category: 'layout',

    attributes: {
        name: {
            type: 'string',
            source: 'attribute',
			selector: 'div.dashicon-block-wrapper',
			attribute: 'data-name',
			default: 'smiley'
		},
		alignment: {
			type: 'string',
			default: 'none',
		},
		size: {
            type: 'string',
            source: 'attribute',
			selector: 'div.dashicon-block-wrapper',
			attribute: 'data-size',
			default: '32'
		},
		innerSpacing: {
            type: 'string',
            source: 'attribute',
			selector: 'div.dashicon-block-wrapper',
			attribute: 'data-inner-spacing',
			default: '0'
		},
		outerSpacing: {
            type: 'string',
            source: 'attribute',
			selector: 'div.dashicon-block-wrapper',
			attribute: 'data-outer-spacing',
			default: '0'
		},
		backgroundColor: {
			type: 'string',
		},
		color: {
			type: 'string',
		},
		borderColor: {
			type: 'string',
		},
		customBackgroundColor: {
			type: 'string',
		},
		customColor: {
			type: 'string',
		},
		customBorderColor: {
			type: 'string',
		},
		borderSize: {
            type: 'string',
            source: 'attribute',
			selector: 'div.dashicon-block-wrapper',
			attribute: 'data-border-size',
			default: '32'
		},
		hasBorder: {
            type: 'boolean',
            source: 'attribute',
			selector: 'div.dashicon-block-wrapper',
			attribute: 'data-has-border',
			default: false
		},
		borderRadius: {
            type: 'string',
            source: 'attribute',
			selector: 'div.dashicon-block-wrapper',
			attribute: 'data-border-radius',
			default: '0'
		},
    },

    edit: editor,

    save( props ) {

		const {
			attributes: {
				name,
				alignment,
				size,
				innerSpacing,
				outerSpacing,
				hasBorder,
				borderSize,
				borderRadius,
				customBackgroundColor,
				customColor,
				backgroundColor,
				color,
				borderColor,
				customBorderColor
			}
		} = props;

		let iconStyle = {
			fontSize: size + 'px',
		}

		if ( innerSpacing ) {
			iconStyle.padding = innerSpacing + 'px';
		}

		if ( outerSpacing ) {
			iconStyle.margin = outerSpacing + 'px';
		}

		if ( hasBorder === true ) {
			iconStyle.borderWidth = borderSize + 'px';
			iconStyle.borderStyle = 'solid';
			iconStyle.borderRadius = borderRadius + '%';
		}

		const textClass = getColorClassName( 'color', color );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor )
		const borderClass = getColorClassName( 'border-color', borderColor );

		const dashiconClasses = classnames( 'wp-block-dashicon dashicon-block-wrapper dashicons dashicon-block-align-' + alignment, {
			'has-text-color': color || customColor,
			[ textClass ]: textClass,
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ]: backgroundClass,
			'has-border': borderColor || customBorderColor,
			[ borderClass ]: borderClass,
		} );

		if ( ! textClass ) {
			iconStyle.color = customColor
		}

		if ( ! backgroundClass ) {
			iconStyle.backgroundColor = customBackgroundColor
		}

		if ( ! borderClass ) {
			iconStyle.borderColor = customBorderColor
		}

        return <Fragment>
			<div
				className={ dashiconClasses }
				data-name={ name }
				data-size={ size }
				data-has-border={ hasBorder }
				data-border-size={ borderSize }
				data-border-radius={ borderRadius }
				data-inner-spacing={ innerSpacing }
				data-outer-spacing={ outerSpacing }
				>
				<span className={ "dashicons-" + name } style={iconStyle}></span>
			</div>
	</Fragment>;
    },
} );