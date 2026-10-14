<?php
/**
 * Plugin Name: Dewlune checkout rules
 * Description: Pakistani address rules for the headless storefront: postal code optional, "Province" instead of "State / County".
 *
 * Must-use plugin: WordPress loads it automatically from wp-content/mu-plugins.
 * The Store API validates checkout addresses against these locale rules, so the
 * Next.js checkout and the classic WooCommerce checkout stay in agreement.
 */

defined('ABSPATH') || exit;

add_filter('woocommerce_get_country_locale', function (array $locale): array {
    $locale['PK']['postcode']['required'] = false;
    $locale['PK']['state']['label'] = __('Province', 'dewlune');
    $locale['PK']['state']['required'] = true;
    return $locale;
});
