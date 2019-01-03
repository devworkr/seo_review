/*
 * 
 * 
 * @since 1.0.0
 * 
 */
(function (jQuery) {
    window.$ = jQuery.noConflict();
})(jQuery);

(function ($) {
    var progressLevel = 0;
    var hashCode = 0;
    var pendingStats = 0;
    var domainCount = 2;
    var domainType = 2;
    var passScore = 0;
    var improveScore = 0;
    var errorScore = 0;
    var splitCode = '::!!::';
    var myDomainsArr = new Array();
    var websiteUrl, competitorUrl, emailaddress;
    var inputError = 'Input Site is not valid!';
    var inputError1 = 'Your website is either down or unreachable!';
    var inputError2 = 'Competitor website is either down or unreachable!';
    var errWebsite = 'Your website Url not valid!';
    var errCompetitor = 'Your competitor Url not valid!';
    var anCompleted = 'Analysis Completed';
    var processingStr = 'Processing...';
    var oopsStr = 'Oops...';
    var errorStr = 'Error';
    var str1 = 'Collecting "Meta Data" informations';
    var str2 = 'Collecting "H1,H2,H3 Data" informations';
    var str3 = 'Collecting "Image Alt" informations';
    var str4 = 'Collecting "Keywords" information';
    var str5 = 'Collecting "Keyword Consistency" information';
    var str6 = 'Collecting "Text/HTML Ratio" information';
    var str7 = 'Collecting "GZIP Compression" information';
    var str8 = 'Collecting "WWW Resolve" information';
    var str9 = 'Collecting "IP Canonicalization" information';
    var str10 = 'Collecting "In-Page Links" information';
    var str11 = 'Collecting "Broken Links" information';
    var str12 = 'Collecting "XML Sitemap" information';
    var str13 = 'Collecting "Robots.txt" information';
    var str14 = 'Collecting "Embedded Objects" information';
    var str15 = 'Collecting "Iframe" information';
    var str16 = 'Collecting "WHOIS Data" information';
    var str17 = 'Collecting "Indexed Pages" information';
    var str18 = 'Collecting "Backlinks" information';
    var str19 = 'Collecting "Usability" information';
    var str20 = 'Collecting "404 Pages" information';
    var str21 = 'Collecting "Page Size" information';
    var str22 = 'Collecting "PageSpeed Insights" information';
    var str23 = 'Collecting "Domain Availability" information';
    var str24 = 'Collecting "Email Privacy" information';
    var str25 = 'Collecting "Safe Browsing" information';
    var str26 = 'Collecting "Mobile Friendliness" information';
    var str27 = 'Collecting "Mobile Compatibility" information';
    var str28 = 'Collecting "Hosting Server" information';
    var str29 = 'Collecting "Website Speed" information';
    var str30 = 'Collecting "Analytics" information';
    var str31 = 'Collecting "W3C Validity" information';
    var str32 = 'Collecting "Page Encoding" information';
    var str33 = 'Collecting "Social Data" information';
    var str34 = 'Collecting "Visitors Localization" information';
    var seoreview = {
        settings: {
            ajaxurl: seo_review_object.ajax_url,
            apiurl: 'https://example.com/ajax/sitevssite',
            axPath: 'https://example.com/domains',
            reportPath: 'https://example.com/compare/[domain1]/vs/[domain2]'
        },
        initilaize: function () {
            form = this.settings;
            $(document).ready(function () {
                seoreview.onInitMethods();
            });
        },
        onInitMethods: function () {
            $('.close_resuts').on('click', function (e) {
                seoreview.removeresults(e);
            });
            $('.compare_seo_validate').on('click', function (e) {
                e.preventDefault;
                return seoreview.sendverificationemail($(this));
            });
            $('.compare_seo').on('click', function (e) {

            });
        },
        sendverificationemail: function (element) {
            element.preventDefault;
            var form = element.parents('form');
            emailaddress = form.find('.sr_email_id').val();
            websiteUrl = seoreview.cleanUrl(form.find('.website_url').val());
            competitorUrl = seoreview.cleanUrl(form.find('.competitor_url').val());
            var isValidate = seoreview.validateData();
            if (!isValidate)
                return isValidate;
            
            swal({
                title: '<div class="lds-facebook"><div></div><div></div><div></div></div>',
                text: 'sending varification email...',
                html: true,
                showConfirmButton: false
            });

            seoreview.makeCall(seoreview.settings.ajaxurl, {action: '_send_verification', emailaddress: emailaddress}, function (response) {
                response = JSON.parse(response);
                if (response.status == 'success') {

                    swal({
                        title: 'sent',
                        text: 'we sent you an email verification code at ' + emailaddress + '. Please enter the code below.',
                        type: "input",
                        closeOnConfirm: false,
                        showCancelButton: true,
                        buttons: ["Select Patient?", "Speed Case?"],
                        inputPlaceholder: "Enter verification code"
                    },
                    function (inputValue) {
                        if (inputValue === false)
                            return false;
                        if (inputValue === "") {
                            swal.showInputError("You need to write something!");
                            return false
                        }
                        swal({
                            title: '<div class="lds-facebook"><div></div><div></div><div></div></div>',
                            text: 'verifying email...',
                            html: true,
                            showConfirmButton: false
                        });
                        seoreview.makeCall(seoreview.settings.ajaxurl, {action: '_verify_email', code: inputValue, emailaddress: emailaddress}, function (response) {
                            response = JSON.parse(response);
                            if (response.status == 'success') {
                                seoreview.compareseo();
                            } else {
                                sweetAlert(oopsStr, response.message, "error");
                                return false;
                            }
                        });
                    });
                } else {
                    sweetAlert(oopsStr, 'error to send the verification code', "error");
                    return false;
                }
            });

        },
        compareseo: function () {
            
            var postdata = {sitevssite: '1', websiteUrl: websiteUrl, competitorUrl: competitorUrl};
            //var postdata = {sitevssite: '1', websiteUrl: websiteUrl, competitorUrl: competitorUrl};
            var isValidate = seoreview.validateData();
            if (!isValidate)
                return isValidate;
            
            swal({
                title: '<div class="lds-facebook"><div></div><div></div><div></div></div>',
                text: processingStr + '<br><br> <div class="progress"><div id="progress-bar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100" style="width:1%">1%</div></div><div id="progress-label"></div>',
                html: true,
                showConfirmButton: false
            });
            seoreview.makeCall(seoreview.settings.apiurl, postdata, function (response) {
                data = jQuery.trim(response);
                myDomainsArr = data.split(splitCode);
                if (myDomainsArr[0] == 'verificationfail') {
                    //Image Verification Failed
                    sweetAlert("Oops...", myDomainsArr[1], "error");
                } else if (myDomainsArr[0] == 'go') {
                    //Domains found on DB
                    seoreview.updateProgress(100, anCompleted);
                    reportpath = seoreview.settings.reportPath;
                    reportpath = reportpath.replace("[domain1]", websiteUrl).replace("[domain2]", competitorUrl);
                    //window.location.href = comparePath;

                    seoreview.makeCall(reportpath, {}, function (html) {
                        $('#seo_report').html(html);
                        $('#seo_report .main-content, #seo_report footer').remove();
                        $('.seo_result_wrap').show();
                        swal.close();
                    });
                } else if (myDomainsArr[0] == '3') {
                    //Domains not found on DB
                    pendingStats = 1;
                    if (myDomainsArr[1] == '0' && myDomainsArr[2] == '0') {
                        $('#progress-label').html('<span style="color: #c0392b;">' + errorStr + ': ' + inputError1 + '</span>');
                    } else {
                        var hashCodeFirst = myDomainsArr[1];
                        var hashCodeSec = myDomainsArr[2];
                        domainType = 1;
                        seoreview.processUrl(hashCodeFirst, hashCodeSec);
                    }
                } else if (myDomainsArr[0] == '2') {
                    //Competitor domain not found on DB
                    if (myDomainsArr[1] == '0') {
                        $('#progress-label').html('<span style="color: #c0392b;">' + errorStr + ': ' + inputError2 + '</span>');
                    } else {
                        domainCount = 1;
                        var hashCode = myDomainsArr[1];
                        domainType = 2;
                        seoreview.processUrl('0', hashCode);
                    }
                } else if (myDomainsArr[0] == '1') {
                    //User domain not found on DB
                    if (myDomainsArr[1] == '0') {
                        $('#progress-label').html('<span style="color: #c0392b;">' + errorStr + ': ' + inputError1 + '</span>');
                    } else {
                        domainCount = 1;
                        domainType = 1;
                        var hashCode = myDomainsArr[1];
                        seoreview.processUrl(hashCode, '0');
                    }
                } else {
                    //Failed
                    $('#progress-label').html('<span style="color: #c0392b;">' + errorStr + ': ' + data + '</span>');
                }
            });
        },
        validateData: function () {
            var regular = /^([www\.]*)+(([a-zA-Z0-9_\-\.])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!regular.test(websiteUrl)) {
                sweetAlert(oopsStr, errWebsite, "error");
                return false;
            }
            if (!regular.test(competitorUrl)) {
                sweetAlert(oopsStr, errCompetitor, "error");
                return false;
            }
            if (!emailaddress) {
                sweetAlert(oopsStr, 'please enter an email address', "error");
                return false;
            }
            if (!emailaddress.match(re)) {
                sweetAlert(oopsStr, 'please enter an valid email address', "error");
                return false;
            }
            
            return true;
        },
        removeresults: function () {
            location.reload();
        },
        makeCall: function (url, formdata, callback) {
            $.ajax({
                url: url, // server url
                type: 'POST', //POST or GET 
                async: true,
                crossDomain: true,
                data: formdata, // data to send in ajax format or querystring format
                datatype: 'json',
                beforeSend: function () {
                    //alert('sending data');
                    // do some loading options
                },
                success: function (data) {
                    callback(data); // return data in callback
                },

                complete: function () {
                    //alert('ajax call complete');
                    // success alerts
                },

                error: function (xhr, status, error) {
                    swal.close();
                    var errortxt = xhr.responseText ? xhr.responseText : 'Error to complete your request. Please try again.';
                    sweetAlert(oopsStr, errortxt, "error");
                    //alert(xhr.responseText); // error occur 
                }

            });
        },
        updateProgress: function (balaji, str) {
            var color;
            if (domainCount == 1)
                balaji = balaji * 2;
            progressLevel = progressLevel + balaji;
            if (progressLevel < 25)
                color = '#c0392b';
            else if (progressLevel < 50)
                color = '#d35400';
            else if (progressLevel < 75)
                color = '#f39c12';
            else
                color = '#27ae60';
            if (progressLevel > 100)
                progressLevel = 100;

            $("#progress-bar").css({"width": progressLevel + "%"});
            $("#progress-bar").text(progressLevel + "%");
            $('#progress-label').html('<span style="color: ' + color + ';"> ' + str + ' </span>');
        },
        processUrl: function (hashCodeFirst, hashCodeSec) {
            var inputHost;
            if (pendingStats == 1) {
                inputHost = competitorUrl;
                hashCode = hashCodeSec;
            } else {
                if (domainType == 1) {
                    inputHost = websiteUrl;
                    hashCode = hashCodeFirst;
                } else {
                    inputHost = competitorUrl;
                    hashCode = hashCodeSec;
                }
            }
            var myArr = new Array();
            seoreview.makeCall(seoreview.settings.axPath, {meta: '1', metaOut: '1', hashcode: hashCode, url: inputHost}, function (data) {
                seoreview.makeCall(seoreview.settings.axPath + '&getImage&site=' + inputHost, {}, function (data) {
                });
                seoreview.updateProgress(5, str1);
                myArr = data.split('!!!!8!!!!');
                $("#seoBox").html(myArr[0]);
                seoreview.updateScore();
                $("#seoBox").html(myArr[1]);
                seoreview.updateScore();
                seoreview.makeCall(seoreview.settings.axPath, {heading: '1', headingOut: '1', hashcode: hashCode, url: inputHost}, function (data) {
                    seoreview.updateProgress(1, str2);
                    $("#seoBox").html(data);
                    seoreview.updateScore();
                    seoreview.makeCall(seoreview.settings.axPath, {image: '1', loaddom: '1', hashcode: hashCode, url: inputHost}, function (data) {
                        seoreview.updateProgress(1, str3);
                        $("#seoBox").html(data);
                        seoreview.updateScore();
                        seoreview.makeCall(seoreview.settings.axPath, {keycloud: '1', keycloudOut: '1', hashcode: hashCode, url: inputHost}, function (data) {
                            seoreview.updateProgress(1, str4);
                            $("#seoBox").html(data);
                            seoreview.updateScore();
                            seoreview.makeCall(seoreview.settings.axPath, {keyConsistency: '1', meta: '1', heading: '1', keycloud: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                seoreview.updateProgress(1, str5);
                                $("#seoBox").html(data);
                                seoreview.updateScore();
                                seoreview.makeCall(seoreview.settings.axPath, {textRatio: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                    seoreview.updateProgress(1, str6);
                                    $("#seoBox").html(data);
                                    seoreview.updateScore();
                                    seoreview.makeCall(seoreview.settings.axPath, {gzip: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                        seoreview.updateProgress(1, str7);
                                        $("#seoBox").html(data);
                                        seoreview.updateScore();
                                        seoreview.makeCall(seoreview.settings.axPath, {www_resolve: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                            seoreview.updateProgress(1, str8);
                                            $("#seoBox").html(data);
                                            seoreview.updateScore();
                                            seoreview.makeCall(seoreview.settings.axPath, {ip_can: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                seoreview.updateProgress(1, str9);
                                                $("#seoBox").html(data);
                                                seoreview.updateScore();
                                                seoreview.makeCall(seoreview.settings.axPath, {in_page: '1', loaddom: '1', inPageoutput: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                    seoreview.updateProgress(3, str10);
                                                    myArr = data.split('!!!!8!!!!');
                                                    $("#seoBox").html(myArr[0]);
                                                    seoreview.updateScore();
                                                    $("#seoBox").html(myArr[1]);
                                                    seoreview.updateScore();
                                                    $("#seoBox").html(myArr[2]);
                                                    seoreview.updateScore();
                                                    seoreview.makeCall(seoreview.settings.axPath, {in_page: '1', loaddom: '1', brokenlinks: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                        seoreview.updateProgress(1, str11);
                                                        $("#seoBox").html(data);
                                                        seoreview.updateScore();
                                                    });//End of Broken Links
                                                    seoreview.makeCall(seoreview.settings.axPath, {sitemap: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                        seoreview.updateProgress(1, str12);
                                                        $("#seoBox").html(data);
                                                        seoreview.updateScore();
                                                        seoreview.makeCall(seoreview.settings.axPath, {robot: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                            seoreview.updateProgress(1, str13);
                                                            $("#seoBox").html(data);
                                                            seoreview.updateScore();
                                                            seoreview.makeCall(seoreview.settings.axPath, {embedded: '1', loaddom: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                seoreview.updateProgress(1, str14);
                                                                $("#seoBox").html(data);
                                                                seoreview.updateScore();
                                                                seoreview.makeCall(seoreview.settings.axPath, {iframe: '1', loaddom: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                    seoreview.updateProgress(1, str15);
                                                                    $("#seoBox").html(data);
                                                                    seoreview.updateScore();
                                                                    seoreview.makeCall(seoreview.settings.axPath, {whois: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                        seoreview.updateProgress(2, str16);
                                                                        seoreview.makeCall(seoreview.settings.axPath, {indexedPages: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                            seoreview.updateProgress(1, str17);
                                                                            $("#seoBox").html(data);
                                                                            seoreview.updateScore();
                                                                            seoreview.makeCall(seoreview.settings.axPath, {backlinks: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                seoreview.updateProgress(3, str18);
                                                                                myArr = data.split('!!!!8!!!!');
                                                                                $("#seoBox").html(myArr[0]);
                                                                                seoreview.updateScore();
                                                                                seoreview.makeCall(seoreview.settings.axPath, {urlLength: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                    seoreview.updateProgress(2, str19);
                                                                                    myArr = data.split('!!!!8!!!!');
                                                                                    $("#seoBox").html(myArr[0]);
                                                                                    seoreview.updateScore();
                                                                                    seoreview.makeCall(seoreview.settings.axPath, {errorPage: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                        seoreview.updateProgress(1, str20);
                                                                                        $("#seoBox").html(data);
                                                                                        seoreview.updateScore();
                                                                                        seoreview.makeCall(seoreview.settings.axPath, {pageLoad: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                            seoreview.updateProgress(3, str21);
                                                                                            myArr = data.split('!!!!8!!!!');
                                                                                            $("#seoBox").html(myArr[0]);
                                                                                            seoreview.updateScore();
                                                                                            $("#seoBox").html(myArr[1]);
                                                                                            seoreview.updateScore();
                                                                                            $("#seoBox").html(myArr[2]);
                                                                                            seoreview.updateScore();
                                                                                            seoreview.makeCall(seoreview.settings.axPath, {pageSpeedInsightChecker: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                seoreview.updateProgress(2, str22);
                                                                                                myArr = data.split('!!!!8!!!!');
                                                                                                //$("#seoBox").html(myArr[0]);updateScore();
                                                                                                //$("#seoBox").html(myArr[1]);updateScore();
                                                                                                seoreview.makeCall(seoreview.settings.axPath, {availabilityChecker: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                    seoreview.updateProgress(2, str23);
                                                                                                    seoreview.makeCall(seoreview.settings.axPath, {emailPrivacy: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                        seoreview.updateProgress(1, str24);
                                                                                                        $("#seoBox").html(data);
                                                                                                        seoreview.updateScore();
                                                                                                        seoreview.makeCall(seoreview.settings.axPath, {safeBrowsing: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                            seoreview.updateProgress(1, str25);
                                                                                                            $("#seoBox").html(data);
                                                                                                            seoreview.updateScore();
                                                                                                            seoreview.makeCall(seoreview.settings.axPath, {mobileCheck: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                seoreview.updateProgress(2, str26);
                                                                                                                myArr = data.split('!!!!8!!!!');
                                                                                                                $("#seoBox").html(myArr[0]);
                                                                                                                seoreview.updateScore();
                                                                                                                seoreview.makeCall(seoreview.settings.axPath, {mobileCom: '1', loaddom: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                    seoreview.updateProgress(1, str27);
                                                                                                                    $("#seoBox").html(data);
                                                                                                                    seoreview.updateScore();
                                                                                                                    seoreview.makeCall(seoreview.settings.axPath, {serverIP: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                        seoreview.updateProgress(1, str28);
                                                                                                                        seoreview.makeCall(seoreview.settings.axPath, {speedTips: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                            seoreview.updateProgress(1, str29);
                                                                                                                            $("#seoBox").html(data);
                                                                                                                            seoreview.updateScore();
                                                                                                                            seoreview.makeCall(seoreview.settings.axPath, {docType: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                                seoreview.updateProgress(2, str30);
                                                                                                                                myArr = data.split('!!!!8!!!!');
                                                                                                                                $("#seoBox").html(myArr[0]);
                                                                                                                                seoreview.updateScore();
                                                                                                                                $("#seoBox").html(myArr[1]);
                                                                                                                                seoreview.updateScore();
                                                                                                                                seoreview.makeCall(seoreview.settings.axPath, {w3c: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                                    seoreview.updateProgress(1, str31);
                                                                                                                                    seoreview.makeCall(seoreview.settings.axPath, {encoding: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                                        seoreview.updateProgress(1, str32);
                                                                                                                                        $("#seoBox").html(data);
                                                                                                                                        seoreview.updateScore();
                                                                                                                                        seoreview.makeCall(seoreview.settings.axPath, {socialData: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                                            seoreview.updateProgress(1, str33);
                                                                                                                                            seoreview.makeCall(seoreview.settings.axPath, {visitorsData: '1', hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                                                seoreview.updateProgress(1, str34);
                                                                                                                                                //$("a#pdfLink").attr("href", pdfUrl);
                                                                                                                                                //$('#pdfLink').unbind('click');
                                                                                                                                                seoreview.makeCall(seoreview.settings.axPath, {cleanOut: '1', passscore: passScore, improvescore: improveScore, errorscore: errorScore, hashcode: hashCode, url: inputHost}, function (data) {
                                                                                                                                                    if (pendingStats == 0) {
                                                                                                                                                        seoreview.updateProgress(100, anCompleted);
                                                                                                                                                        //comparePath = comparePath.replace("[domain1]", websiteUrl).replace("[domain2]", competitorUrl);
                                                                                                                                                        //window.location.href = comparePath;
                                                                                                                                                        reportpath = seoreview.settings.reportPath;
                                                                                                                                                        reportpath = reportpath.replace("[domain1]", websiteUrl).replace("[domain2]", competitorUrl);
                                                                                                                                                        //window.location.href = comparePath;

                                                                                                                                                        seoreview.makeCall(reportpath, {}, function (html) {
                                                                                                                                                            //var htmllength = html.length;
                                                                                                                                                            //var dataindex = html.indexOf('<div class="container">');
                                                                                                                                                            //var originalcontent = html.slice(dataindex,htmllength);
                                                                                                                                                            $('#seo_report').html(html);
                                                                                                                                                            $('#seo_report .main-content, #seo_report footer').remove();
                                                                                                                                                            $('.seo_result_wrap').show();
                                                                                                                                                            swal.close();
                                                                                                                                                        });
                                                                                                                                                    } else {
                                                                                                                                                        pendingStats = 0;
                                                                                                                                                        passScore = 0;
                                                                                                                                                        improveScore = 0;
                                                                                                                                                        errorScore = 0;
                                                                                                                                                        seoreview.processUrl(hashCodeFirst, hashCodeSec);
                                                                                                                                                    }
                                                                                                                                                });//End Statement
                                                                                                                                            });//End of PageSpeed Insights
                                                                                                                                        });//End of Visitors Localization
                                                                                                                                    });//End of Social Data
                                                                                                                                });//End of Backlink Counter / Traffic / Worth
                                                                                                                            });//End of Indexed Pages
                                                                                                                        });//End of Encoding Type
                                                                                                                    });//End of W3C Validity
                                                                                                                });//End of Analytics & Doc Type
                                                                                                            });//End of Speed Tips
                                                                                                        });//End of Server IP
                                                                                                    });//End of Safe Browsing
                                                                                                });//End of Email Privacy Checker
                                                                                            });//End of Domain & Typo Availability Checker
                                                                                        });//End of Page Size / Load Time / Language
                                                                                    });//End of Custom 404 Page
                                                                                });//End of URL Length & Favicon
                                                                            });//End of Mobile Compatibility
                                                                        });//End of Mobile Friendly Test
                                                                    });//End of WHOIS Data
                                                                });//End of Iframe
                                                            });//End of Embedded Object
                                                        });//End of XML Sitemap
                                                    });//End of Robots.txt
                                                });//End of In-Page Links
                                            });//End of IP Canonicalization
                                        });//End of WWW Resolve
                                    });//End of Gzip
                                });//End of Text/HTML Ratio
                            });
                        });
                    });
                });
            });
        },
        updateScore: function () {
            var score = document.getElementById("seoBox").childNodes[0].className.toLowerCase();
            if (score == 'passedbox') {
                passScore = passScore + 3;
            } else if (score == 'improvebox') {
                improveScore = improveScore + 3;
            } else {
                errorScore = errorScore + 3;
            }
        },
        cleanUrl: function (myURL) {
            myURL = jQuery.trim(myURL);
            if (myURL.indexOf("https://") == 0) {
                myURL = myURL.substring(8);
            }
            if (myURL.indexOf("http://") == 0) {
                myURL = myURL.substring(7);
            }
            if (myURL.indexOf("/") != -1) {
                var xGH = myURL.indexOf("/");
                myURL = myURL.substring(0, xGH);
            }
            if (myURL.indexOf(".") == -1) {
                myURL += ".com";
            }
            if (myURL.indexOf(".") == (myURL.length - 1)) {
                myURL += "com";
            }
            return myURL;
        }
    };
    seoreview.initilaize();
})(jQuery);