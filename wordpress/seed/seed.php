<?php
/**
 * Seeds WooCommerce with the Dewlune catalog. Run through WP-CLI:
 *   wp eval-file /seed/seed.php
 * Safe to run again: existing products and categories are updated, not duplicated.
 */

if (!class_exists('WooCommerce')) {
    WP_CLI::error('WooCommerce must be active before seeding.');
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$catalog = json_decode(file_get_contents('/catalog/catalog.json'), true);
if (!$catalog) {
    WP_CLI::error('Could not read /catalog/catalog.json');
}

// Store settings: Pakistani rupees without decimals, guest checkout, open storefront.
$settings = [
    'woocommerce_currency' => 'PKR',
    'woocommerce_currency_pos' => 'left_space',
    'woocommerce_price_num_decimals' => '0',
    'woocommerce_price_thousand_sep' => ',',
    'woocommerce_default_country' => 'PK:IS',
    'woocommerce_specific_allowed_countries' => ['PK'],
    'woocommerce_allowed_countries' => 'specific',
    'woocommerce_ship_to_countries' => '',
    'woocommerce_calc_taxes' => 'no',
    'woocommerce_enable_guest_checkout' => 'yes',
    'woocommerce_coming_soon' => 'no',
    'woocommerce_onboarding_profile' => ['skipped' => true],
];
foreach ($settings as $key => $value) {
    update_option($key, $value);
}

update_option('woocommerce_cod_settings', [
    'enabled' => 'yes',
    'title' => 'Cash on delivery',
    'description' => 'Pay the rider when your order arrives.',
    'instructions' => 'Pay with cash upon delivery.',
    'enable_for_methods' => [],
    'enable_for_virtual' => 'yes',
]);

// Delivery: free from Rs 5,000, otherwise a flat Rs 250 (the storefront shows the same rule).
foreach (WC_Shipping_Zones::get_zones() as $zone) {
    if ($zone['zone_name'] === 'Pakistan') {
        WC_Shipping_Zones::delete_zone($zone['id']);
    }
}
$zone = new WC_Shipping_Zone();
$zone->set_zone_name('Pakistan');
$zone->add_location('PK', 'country');
$zone->save();
$free = $zone->add_shipping_method('free_shipping');
update_option("woocommerce_free_shipping_{$free}_settings", [
    'title' => 'Free delivery',
    'requires' => 'min_amount',
    'min_amount' => '5000',
    'ignore_discounts' => 'no',
]);
$flat = $zone->add_shipping_method('flat_rate');
update_option("woocommerce_flat_rate_{$flat}_settings", [
    'title' => 'Standard delivery',
    'tax_status' => 'none',
    'cost' => '250',
]);
WP_CLI::log('Store settings, cash on delivery and shipping configured.');

// Concerns become product categories.
$category_ids = [];
foreach ($catalog['concerns'] as $concern) {
    $existing = get_term_by('slug', $concern['slug'], 'product_cat');
    if ($existing) {
        wp_update_term($existing->term_id, 'product_cat', ['name' => $concern['name'], 'description' => $concern['blurb']]);
        $category_ids[$concern['slug']] = $existing->term_id;
    } else {
        $term = wp_insert_term($concern['name'], 'product_cat', ['slug' => $concern['slug'], 'description' => $concern['blurb']]);
        $category_ids[$concern['slug']] = $term['term_id'];
    }
}

function dewlune_attribute(string $name, array $options, int $position): WC_Product_Attribute {
    $attribute = new WC_Product_Attribute();
    $attribute->set_id(0);
    $attribute->set_name($name);
    $attribute->set_options(array_values($options));
    $attribute->set_position($position);
    $attribute->set_visible(true);
    $attribute->set_variation(false);
    return $attribute;
}

function dewlune_attach_image(string $slug, string $title): int {
    $source = "/seed/images/{$slug}.png";
    if (!file_exists($source)) {
        return 0;
    }
    $tmp = wp_tempnam("{$slug}.png");
    copy($source, $tmp);
    $id = media_handle_sideload(['name' => "{$slug}.png", 'tmp_name' => $tmp], 0, $title);
    if (is_wp_error($id)) {
        WP_CLI::warning("Image for {$slug}: " . $id->get_error_message());
        return 0;
    }
    update_post_meta($id, '_wp_attachment_image_alt', $title);
    return $id;
}

foreach ($catalog['products'] as $index => $p) {
    $existing = get_page_by_path($p['slug'], OBJECT, 'product');
    $product = $existing ? wc_get_product($existing->ID) : new WC_Product_Simple();

    $regular = $p['regularPrice'] / 100;
    $price = $p['price'] / 100;

    $product->set_name($p['name']);
    $product->set_slug($p['slug']);
    $product->set_status('publish');
    $product->set_catalog_visibility('visible');
    $product->set_menu_order($index);
    $product->set_regular_price((string) $regular);
    $product->set_sale_price($price < $regular ? (string) $price : '');
    $product->set_short_description($p['tagline']);
    $product->set_description($p['description']);
    $product->set_category_ids(array_values(array_intersect_key($category_ids, array_flip($p['concerns']))));
    $product->set_manage_stock(false);
    $product->set_stock_status('instock');
    $product->set_attributes([
        dewlune_attribute('Size', [$p['size']], 0),
        dewlune_attribute('Key ingredients', $p['keyIngredients'], 1),
        dewlune_attribute('How to use', [$p['howToUse']], 2),
    ]);
    if (!$product->get_image_id()) {
        $image = dewlune_attach_image($p['slug'], $p['name']);
        if ($image) {
            $product->set_image_id($image);
        }
    }
    $product->save();
    WP_CLI::log(($existing ? 'Updated ' : 'Created ') . $p['name']);
}

flush_rewrite_rules();
WP_CLI::success(count($catalog['products']) . ' products ready.');
