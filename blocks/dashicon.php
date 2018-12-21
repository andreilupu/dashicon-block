<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) for the
 * Gutenberg block.
 *
 * @package locals
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * @see https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type/#enqueuing-block-scripts
 */
function dashicon_block_init() {
	// Skip block registration if Gutenberg is not enabled/merged.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$dir = dirname( __FILE__ );

	$index_js = 'blocks.build.js';
	wp_register_script(
		'dashicon-block-editor',
		plugins_url( $index_js, __FILE__ ),
		array(
			'wp-editor',
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);


	$file = file_get_contents( plugin_dir_path( __FILE__ ) . './dashicons-list.json' );

	$dashiconsList = json_decode( $file, true );

	foreach ( $dashiconsList as $icon => $code ) {
		$dashiconsList[ $icon ] = array(
			'id' => $icon,
			'visual' => $icon,
			'name' => ucfirst( str_replace( '-', ' ', $icon ) )
		);
		// { visual: 'FB', name: 'Facebook', id: 'facebook' },
	}
	
	wp_localize_script( 'dashicon-block-editor', '_dashiconsAutocompleteList', array_values( $dashiconsList ) );

	$editor_css = 'dashicon/editor.css';
	wp_register_style(
		'dashicon-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'dashicon/style.css';
	wp_register_style(
		'dashicon-block',
		plugins_url( $style_css, __FILE__ ),
		array( 'dashicons' ),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'locals/dashicon', array(
		'editor_script' => 'dashicon-block-editor',
		'editor_style'  => 'dashicon-block-editor',
		'style'         => 'dashicon-block',
	) );
}
add_action( 'init', 'dashicon_block_init' );

// @TODO Generate style for custom theme colors

function dashicon_color_pallets() {

	$colors = get_theme_support( 'editor-color-palette' );

	if ( empty( $colors ) ) {
		return;
	}

	echo '<style id="dashicon-custom-styles">';

	foreach ( $colors[0] as $color ) {
		echo "\n" . '.has-background.has-' . $color['slug'] . '-background-color span { background-color: ' . $color['color'] . ";}\n";
		echo "\n" . '.has-text-color.has-' . $color['slug'] . '-color span:before { color: ' . $color['color'] . ";}\n";
		echo "\n" . '.has-border.has-' . $color['slug'] . '-border-color span { border-color: ' . $color['color'] . ";}\n";
	}

	echo '</style>';
}
add_action( 'admin_head', 'dashicon_color_pallets' );
add_action( 'wp_head', 'dashicon_color_pallets' );