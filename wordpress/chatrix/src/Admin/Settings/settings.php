<?php

namespace Automattic\Chatrix\Admin\Settings;

const DEFAULT_VALUES     = array(
	'homeserver' => 'https://example.com',
);
const SETTINGS_PAGE_SLUG = 'chatrix';
const OPTION_GROUP       = 'chatrix';
const OPTION_NAME        = 'chatrix_settings';

function init() {
	// All settings are stored under a single associative array.
	register_setting(
		OPTION_GROUP,
		OPTION_NAME,
		array(
			'type'              => 'array',
			'default'           => DEFAULT_VALUES,
			'sanitize_callback' => 'Automattic\Chatrix\Admin\Settings\sanitize',
		)
	);

	// If field is not set, use default value instead.
	$settings = shortcode_atts( DEFAULT_VALUES, get_option( OPTION_NAME ) );

	room_section( $settings );
}

function room_section( $settings ) {
	$section_slug = 'chatrix_room';
	add_settings_section(
		$section_slug,
		'Room',
		function () {
			?>
			<p>Configure the Matrix room.</p>
			<?php
		},
		SETTINGS_PAGE_SLUG
	);

	add_settings_field(
		"{$section_slug}_homeserver",
		'Homeserver',
		function ( $args ) {
			printf(
				'<input name="%1$s[%2$s]" id="%3$s" value="%4$s" class="regular-text">',
				esc_attr( $args['option_name'] ),
				esc_attr( $args['name'] ),
				esc_attr( $args['label_for'] ),
				esc_attr( $args['value'] ),
			);
		},
		SETTINGS_PAGE_SLUG,
		$section_slug,
		array(
			'label_for'   => OPTION_NAME . '_homeserver',
			'name'        => 'homeserver',
			'value'       => esc_attr( $settings['homeserver'] ),
			'option_name' => OPTION_NAME,
		)
	);
}


function sanitize_value( $field_name, $value ): string {
	if ( 'homeserver' === $field_name ) {
		$value = sanitize_text_field( $value );
		if ( empty( $value ) ) {
			add_error( 'homeserver-empty', 'Homeserver must not be empty.' );
		}

		if ( ! wp_http_validate_url( $value ) ) {
			add_error( 'homeserver-invalid', 'Homeserver must be a valid URL.' );
		}
	}

	return $value;
}

function menu() {
	add_options_page(
		'Chatrix',
		'Chatrix',
		'manage_options',
		SETTINGS_PAGE_SLUG,
		function () {
			?>
			<div id="chatrix-settings" class="wrap">
				<h1>Chatrix Settings</h1>
				<form action="options.php" method="POST">
					<?php
					settings_fields( OPTION_GROUP );
					do_settings_sections( SETTINGS_PAGE_SLUG );
					submit_button();
					?>
				</form>
			</div>
			<?php
		}
	);
}

function sanitize( $values ): array {
	if ( ! is_array( $values ) ) {
		return DEFAULT_VALUES;
	}

	$out = array();
	foreach ( DEFAULT_VALUES as $key => $default_value ) {
		$out[ $key ] = sanitize_value( $key, $values[ $key ] );
	}

	return $out;
}

function add_error( $code, $message ) {
	add_settings_error( OPTION_GROUP, "chatrix-$code", $message );
}
