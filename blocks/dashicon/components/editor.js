import classnames from 'classnames';

const {
	Fragment,
	Component
} = wp.element;

const { __, _x } = wp.i18n;
const { compose } = wp.compose;

const {
	PanelBody,
	TextControl,
	CheckboxControl,
	RangeControl,
	withFallbackStyles
} = wp.components;

const {
	RichText,
	ContrastChecker,
	InspectorControls,
	withColors,
	PanelColorSettings,
	AlignmentToolbar,
	BlockControls,
	getColorClassName
} = wp.editor;

const { getComputedStyle } = window;

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { color, backgroundColor, borderColor } = ownProps;
	const backgroundColorValue = backgroundColor && backgroundColor.color;
	const colorValue = color && color.color;
	const borderColorValue = borderColor && borderColor.color;

	//avoid the use of querySelector if textColor color is known and verify if node is available.
	const textNode = ! colorValue && node ? node.querySelector( '[contenteditable="true"]' ) : null;

	return {
		fallbackBackgroundColor: backgroundColorValue || ! node ? undefined : getComputedStyle( node ).backgroundColor,
		fallbackColor: colorValue || ! textNode ? undefined : getComputedStyle( textNode ).color,
		fallbackBorderColor: borderColorValue || ! textNode ? undefined : getComputedStyle( textNode ).borderColor,
	};
} );

class DashIconEditor extends Component {

	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			setAttributes,
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
				customBorderColor
			},
			backgroundColor,
			color,
			borderColor,
			setBackgroundColor,
			setColor,
			setBorderColor,
			fallbackBackgroundColor,
			fallbackColor,
			fallbackBorderColor,
			isSelected
		} = this.props;
		
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

		const textClass = getColorClassName( 'color', color.slug );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor.slug )
		const borderClass = getColorClassName( 'border-color', borderColor.slug );

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

		const autocompleters = [
			{
				name: 'dashicons',
				// The prefix that triggers this completer
				triggerPrefix: '',
				isDebounced: true,
				// The option data
				options: _dashiconsAutocompleteList,
				getOptionLabel: option => (
					<span>
						<span className={"dashicons dashicons-" + option.id } ></span> { option.name }
					</span>
				),
				// Declares that options should be matched by their name
				getOptionKeywords: option => [ option.name ],
				// Declares completions should be inserted as abbreviations
				getOptionCompletion: option => (
					option.id
				),
				allowContext: ( before, after ) => {
					// display the autocomplete UI only when the cursor is at the end of the search.
					if ( '' !== after ) {
						return false;
					}

					return true;
				}
			}
		];

		let colorSettings = [
			{
				value: backgroundColor.color,
				onChange: setBackgroundColor,
				label: __( 'Background Color' ),
			},
			{
				value: color.color,
				onChange: setColor,
				label: __( 'Icon Color' ),
			},
		];

		if ( hasBorder ) {
			colorSettings.push( {
				value: borderColor.color,
				onChange: setBorderColor,
				label: __( 'Border Color' ),
			} );
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

			<BlockControls>
				<RichText
					tagName="p"
					onChange={ ( name ) => { setAttributes( { name } ) } }
					value={ name }
					autocompleters={ autocompleters }
					multiline={false}
					placeholder="Search here..."
					unstableOnFocus={ ( value ) => {
						// @TODO force a full selection when the curson is not at the end
						const selection = window.getSelection();
						console.log( selection )
					}}
				/>
				<AlignmentToolbar
					value={ alignment }
					onChange={ ( alignment ) => { setAttributes( { alignment } ) } }
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title="Icon">
					<RangeControl
						label="Size"
						value={ size }
						onChange={ ( size ) => setAttributes( { size } ) }
						min={ 12 }
						max={ 260 }
						initialPosition={32}
						allowReset={true}
					/>

					<RangeControl
						label="Inner Spacing"
						value={ innerSpacing }
						onChange={ ( innerSpacing ) => setAttributes( { innerSpacing } ) }
						min={ 0 }
						max={ 100 }
						initialPosition={0}
						allowReset={true}
					/>

					<RangeControl
						label="Outer Spacing"
						value={ outerSpacing }
						onChange={ ( outerSpacing ) => setAttributes( { outerSpacing } ) }
						min={ 0 }
						max={ 100 }
						initialPosition={0}
						allowReset={true}
					/>
				</PanelBody>

				<PanelBody title="Border">

					<CheckboxControl
						label="Add Border?"
						help="Should this block have a visible border?"
						checked={ hasBorder }
						onChange={ ( hasBorder ) => { setAttributes( { hasBorder } ) } }
					/>

					{ hasBorder ?
						<Fragment>
							<RangeControl
								label="Border Size"
								value={ borderSize }
								onChange={ ( borderSize ) => setAttributes( { borderSize } ) }
								min={ 0 }
								max={ 100 }
								initialPosition={0}
								allowReset={true}
							/>

							<RangeControl
								label="Radius Size"
								value={ borderRadius }
								onChange={ ( borderRadius ) => setAttributes( { borderRadius } ) }
								min={ 0 }
								max={ 50 }
								initialPosition={0}
								allowReset={true}
							/>
						</Fragment>
					: '' }
				</PanelBody>

				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ colorSettings }
				>
							<ContrastChecker
								{ ...{
									isLargeText: false,
									color: color.color,
									backgroundColor: backgroundColor.color,
									borderColor: borderColor.color,
									fallbackBackgroundColor,
									fallbackColor,
									fallbackBorderColor
								} }
							/>
						</PanelColorSettings>
			</InspectorControls>

		</Fragment>;
    }
}

const DashIconEditorWithHocs = compose( [
	withColors( 'backgroundColor', { color: 'color', borderColor: 'borderColor' } ),
	applyFallbackStyles,
] )( DashIconEditor );

export default DashIconEditorWithHocs