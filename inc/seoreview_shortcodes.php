<?php

/**
 * Seo Review shortcodes
 *
 * @package seo-review
 * @since   1.0.0
 */
class SeoReview_Shortcodes {

    public function init() {
        add_shortcode('seo_compare_websites', __CLASS__ . '::seo_compare_form');
    }

    public function seo_compare_form($atts = []) {
        $atts = shortcode_atts(
            array(
                'button_text' => 'Compare',
            ), $atts, 'bartag');
        ob_start();
        do_action('before_seo_review');
        ?>
        <div class="seo_review_wrap">
            <form id="seo_review_form" method="post" class="seo_review_form">
                <div class="seo_input_wrap">
                    <label for="website_url">Website Url</label>
                    <input type="text" id="website_url" name="website_url" class="website_url url seo_input">
                </div>
                <div class="seo_input_wrap">
                    <label for="competitor_url">Competitor Url</label>
                    <input type="text" id="competitor_url" name="competitor_url" class="competitor_url url seo_input">
                </div>
                <div class="seo_input_wrap">
                    <label for="sr_email_id">Email</label>
                    <input type="text" id="sr_email_id" name="email_id" class="email seo_input sr_email_id">
                </div>
                <div style="display:none" class="seo_input_wrap sr_verification_input">
                    <label for="sr_email_id">Verification Code</label>
                    <input type="text" id="sr_ver_code" name="verification_code" class="code seo_input sr_ver_code">
                </div>
                <div class="btn-wrap">
                    <button type="button" class="compare_seo_validate"><?php echo $atts['button_text']; ?></button>
                </div> 
            </form>
            <div style="display: none" id="seoBox">
                
            </div>
            <div class="seo_result_wrap">
                <div class="close_resuts btn btn-primary">Close</div>
                <div  id="seo_report">
                
                </div>
            </div>    
        </div>
        <?php
        do_action('after_seo_review');
        
        $contents = ob_get_contents();
        ob_end_clean();

        return $contents;
    }

}
