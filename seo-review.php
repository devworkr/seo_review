<?php

/**
 * Plugin Name: Seo Review
 * Plugin URI: https://example.com/
 * Description: A wordpress plugin to check and compare the seo score of websites.
 * Version: 1.0.0
 * Author: Dinesh Kumar
 * Author URI: https://dinesh.com
 * Text Domain: seo-review
 * Domain Path: /i18n/languages/
 *
 * @package seo-review
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Define SEO_PLUGIN_FILE.
if (!defined('SEO_PLUGIN_FILE')) {
    define('SEO_PLUGIN_FILE', __FILE__);
}

// Include the main SeoReview class.
if (!class_exists('SeoReview')) {
    include_once dirname(__FILE__) . '/inc/class-seoreview.php';
}

/**
 * Main instance of Seo Review.
 *
 * Returns the main instance of SeoReview.
 *
 * @since  1.0.0
 * @return SeoReview
 */
function SeoReview() {
    return SeoReview::instance();
}

// Global for backwards compatibility.
$GLOBALS['seoreview'] = SeoReview();