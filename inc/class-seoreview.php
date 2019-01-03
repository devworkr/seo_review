<?php

/**
 * Seo Review setup
 *
 * @package seo-review
 * @since   1.0.0
 */
defined('ABSPATH') || exit;

class SeoReview {

    /**
     * seo-review version.
     *
     * @var string
     */
    public $version = '1.0.0';

    /**
     * The single instance of the class.
     *
     * @var SeoReview
     * @since 1.0.0
     */
    protected static $_instance = null;

    /**
     * Main SeoReview Instance.
     *
     * Ensures only one instance of SeoReview is loaded or can be loaded.
     *
     * @since 1.0.0
     * @static
     * @return SeoReview.
     */
    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * SeoReview Constructor.
     */
    public function __construct() {
        $this->define_constants();
        $this->includes();
        $this->init_hooks();

        do_action('seo_review_loaded');
    }

    /**
     * Hook into actions and filters.
     *
     * @since 1.0.0
     */
    private function init_hooks() {
        register_activation_hook(SEO_PLUGIN_FILE, array($this, 'initialize_plugin'));
        add_action('init', array($this, 'init'), 0);
        add_action('wp_enqueue_scripts', array($this, 'seo_review_enqueue'), 0);
        add_action('init', array('SeoReview_Shortcodes', 'init'));
        add_action('wp_ajax__send_verification', array(&$this, 'send_verification'));
        add_action('wp_ajax_nopriv__send_verification', array(&$this, 'send_verification'));

        add_action('wp_ajax__verify_email', array(&$this, 'verifyemail_address'));
        add_action('wp_ajax_nopriv__verify_email', array(&$this, 'verifyemail_address'));
    }

    /**
     * Define Seoreview Constants.
     */
    private function define_constants() {
        $this->define('SEO_REVIEW_ABSPATH', dirname(SEO_PLUGIN_FILE) . '/');
        $this->define('SEO_REVIEW_BASENAME', plugin_basename(SEO_PLUGIN_FILE));
        $this->define('SEO_REVIEW_URL', plugins_url(basename(SEO_REVIEW_ABSPATH)));
        $this->define('SEO_REVIEW_VERSION', $this->version);
    }

    /**
     * Include required core files used in admin and on the frontend.
     */
    public function includes() {
        include_once SEO_REVIEW_ABSPATH . 'inc/seoreview_shortcodes.php';
    }

    /**
     * Init WooCommerce when WordPress Initialises.
     */
    public function init() {
        
    }

    /**
     * Define constant if not already set.
     *
     * @param string      $name  Constant name.
     * @param string|bool $value Constant value.
     */
    private function define($name, $value) {
        if (!defined($name)) {
            define($name, $value);
        }
    }

    /* enque seo scrits  */

    public function seo_review_enqueue() {

        wp_enqueue_script('seo_review_script', SEO_REVIEW_URL . '/assets/js/scripts.min.js', array('jquery',), SEO_REVIEW_VERSION);
        wp_enqueue_script('sweetalert', SEO_REVIEW_URL . '/assets/js/sweetalert.min.js', array(), SEO_REVIEW_VERSION);
        wp_enqueue_script('gaugejs', SEO_REVIEW_URL . '/assets/js/gauge.min.js', array(), SEO_REVIEW_VERSION);
        wp_enqueue_script('bootstrap.min', SEO_REVIEW_URL. '/assets/js/bootstrap.min.js', array(), SEO_REVIEW_VERSION);

        wp_enqueue_style('seo_review_style', SEO_REVIEW_URL . '/assets/css/styles.css', array(), SEO_REVIEW_VERSION);
        wp_enqueue_style('bootstrap_style', SEO_REVIEW_URL . '/assets/css/sweetalert.min.css', array(), SEO_REVIEW_VERSION);

        wp_localize_script('seo_review_script', 'seo_review_object', array('ajax_url' => admin_url('admin-ajax.php')));
    }

    /*
     * send verification email
     * 
     * @var POST emailaddress
     * 
     * return JSON
     */

    public function send_verification() {
        if (isset($_POST['emailaddress']) && $_POST['emailaddress']) {
            $verificationcode = rand(100000,999999);
            $emailaddress = $_POST['emailaddress'];
            $expire_time = strtotime(date("Y-m-d H:i:s", strtotime('+24 hours')));
            //insert into table
            global $wpdb;
            $data = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->prefix}seo_data where email_id= %s", array($emailaddress)));
            if ($data) {
                $isinserted = $wpdb->update($wpdb->prefix . 'seo_data', array('code' => $verificationcode, 'expire_time' => $expire_time), array('email_id' => $emailaddress));
                $isinserted = true;
            } else {
                $isinserted = $wpdb->insert($wpdb->prefix . 'seo_data', array('email_id' => $emailaddress, 'code' => $verificationcode, 'expire_time' => $expire_time));
            }
            // insert done

            $subject = 'Verify your email';
            $body = "Your verification code is: {$verificationcode}. And validity of this code is 24 hours.";
            $headers = array('Content-Type: text/html; charset=UTF-8');
            wp_mail($emailaddress, $subject, $body, $headers);
            if ($isinserted) {
                die(json_encode(array('status' => 'success', 'message' => 'we sent you a verification code.')));
            } else {
                die(json_encode(array('status' => 'error', 'message' => 'error to send the verification code.')));
            }
        }
    }

    /*
     * verify the email
     * 
     * @var POST emailaddress, POST code
     * 
     * return JSON
     */

    public function verifyemail_address() {
        if (isset($_POST['emailaddress']) && isset($_POST['code'])) {
            $email = $_POST['emailaddress'];
            $code = $_POST['code'];
            global $wpdb;
            $data = $wpdb->get_row($wpdb->prepare("select * from {$wpdb->prefix}seo_data where email_id= %s and code=%s", array($email, $code)));
            if ($data) {
                if ($data->expire_time > time()) {
                    /* email verfied */
                    die(json_encode(array('status' => 'success', 'message' => 'email verified.')));
                } else {
                    /* code expired */
                    die(json_encode(array('status' => 'error', 'message' => 'Your verification code has been expired.')));
                }
            } else {
                die(json_encode(array('status' => 'error', 'message' => 'Invalid Code.')));
            }
        } else {
            die(json_encode(array('status' => 'error', 'message' => 'your request is invalid.')));
        }
    }

    public function initialize_plugin() {
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        global $wpdb;
        $sql = "CREATE TABLE `{$wpdb->prefix}seo_data` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `email_id` varchar(55) NOT NULL,
            `expire_time` varchar(55) NOT NULL,
            `code` varchar(24) NOT NULL,
            `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
          ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
        $response = dbDelta($sql);
        return $response;
    }

}
