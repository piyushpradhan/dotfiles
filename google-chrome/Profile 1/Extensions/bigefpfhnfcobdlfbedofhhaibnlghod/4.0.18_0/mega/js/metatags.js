mega.metatags = new function() {
    'use strict';

    /**
     * Private function to check if the page is excluded and not missing
     * @param {String} page     Page name
     * @returns {Boolean}       true/false is excluded.
     */
    var isPageExcluded = function(page) {
        // XXX: add new items sorted alphabetically.
        var excludedPages = [
            'backup', 'businessinvite', 'businesssignup', 'cancel', 'confirm', 'debug',
            'discount', 'download', 'emailverify', 'key', 'megadrop', 'payment', 'recover',
            'recoverybykey', 'recoverybypark', 'recoveryenterkey',
            'recoverykeychangepass', 'recoveryparkchangepass',
            'redeem', 'repay', 'reset', 'sms', 'start', 'test', 'thanks', 'twofactor',
            'unsub', 'verify', 'voucher', 'wiretransfer'
        ];

        if (!page) {
            return true;
        }

        for (var i = excludedPages.length; i--;) {
            var ep = excludedPages[i];

            if (page.substr(0, ep.length) === ep) {
                return ep.length === page.length ? -1 : ep.length;
            }
        }

        return false;
    };

    var stopBots = function(metaRobots, noReporting) {
        if (!noReporting && !isPageExcluded(page) && !is_fm() && !is_extension) {
            if (d) {
                console.error('A page without title. Please handle. Page: ' + page);
            }
            api_req({ a: 'log', e: 99735, m: 'page without title: ' + page });
        }

        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        metaRobots.content = 'noindex';
        document.head.appendChild(metaRobots);
    };

    var setMeta = function(attr, val, content) {
        var meta = document.head.querySelector('meta[' + attr + '="' + val + '"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attr, val);
            document.head.appendChild(meta);
        }
        meta.content = content;
    };

    var insertOgTwitterMetas = function(title, desc, url, image) {
        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', desc);
        setMeta('property', 'og:url', url);
        setMeta('property', 'og:image', image);
        // ----- Twitter
        var meta = document.head.querySelector('meta[property="twitter:card"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', 'twitter:card');
            meta.content = 'summary';
            document.head.appendChild(meta);
        }
        setMeta('property', 'twitter:title', title);
        setMeta('property', 'twitter:description', desc);
        setMeta('property', 'twitter:url', url);
        setMeta('property', 'twitter:image', image);
    };

    var addCanonical = function(link) {
        if (lang && lang !== 'en') {
            link += `/lang_${lang}`;
        }
        var canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', link);
        document.head.appendChild(canonical);
    };

    var ucFirst = function(s) {
        s = String(s || '');
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    /* eslint-disable complexity */
    this.addStrucuturedData = function(type, data) {

        if (!type || !data) {
            return;
        }

        var supportedTypes = ['Product', 'SoftwareApplication', 'FAQPage', 'NewsArticle', 'Organization'];
        if (supportedTypes.indexOf(type) === -1) {
            return;
        }

        if (
            !(type === 'Product' && data.offers && data.description && data.name) &&
            !(type === 'SoftwareApplication' && data.offers && data.operatingSystem && data.name) &&
            !(type === 'FAQPage' && data.mainEntity && Object.keys(data.mainEntity).length) &&
            !(type === 'NewsArticle' && data.headline && data.image && data.datePublished && data.dateModified) &&
            !(type === 'Organization' && data.url && data.logo)
        ) {
            return;
        }

        var prepareMetaStruct = function() {
            var structData = document.head.querySelector('script[type="application/ld+json"]');
            if (!structData) {
                structData = document.createElement('script');
                structData.setAttribute('type', 'application/ld+json');
                document.head.appendChild(structData);
            }
            return structData;
        };

        var metaStruct = prepareMetaStruct();
        if (!metaStruct) {
            return;
        }

        var structContent = Object.create(null);
        structContent['@context'] = 'https://schema.org/';
        structContent['@type'] = type;

        if (type === 'Product') {
            structContent['name'] = data.name;
            structContent['image'] = [data.image || 'https://cms2.mega.nz/b41537c0eae056cfe5ab05902fca322b.png'];
            structContent['description'] = data.description;
            structContent['brand'] = { '@type': 'Brand', 'name': 'MEGA' };
            structContent['offers'] = {
                '@type': 'Offer',
                'url': data.offers.url || '',
                'priceCurrency': 'EUR',
                'price': data.offers.price
            };

        }
        else if (type === 'SoftwareApplication') {
            structContent['name'] = data.name;
            structContent['operatingSystem'] = data.operatingSystem;
            if (data.applicationCategory) {
                structContent['applicationCategory'] = data.applicationCategory;
            }
            structContent['offers'] = {
                '@type': 'Offer',
                'priceCurrency': 'EUR',
                'price': data.offers.price
            };
        }
        else if (type === 'FAQPage') {
            var mainE = [];
            for (var entity in data.mainEntity) {
                if (data.mainEntity[entity]) {
                    var temp = {
                        '@type': 'Question',
                        'name': entity,
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': data.mainEntity[entity]
                        }
                    };
                    mainE.push(temp);
                }
            }
            if (mainE.length) {
                structContent['mainEntity'] = mainE;
            }
            else {
                document.head.removeChild(metaStruct);
                return;
            }
        }
        else if (type === 'NewsArticle') {
            structContent['headline'] = data.headline;
            structContent['image'] = [data.image];
            structContent['datePublished'] = data.datePublished;
            structContent['dateModified'] = data.dateModified;
        }
        else if (type === 'Organization') {
            structContent['url'] = data.url;
            structContent['logo'] = data.logo;
        }
        else {
            return;
        }
        metaStruct.textContent = JSON.stringify(structContent, null, 3);
    };

    this.disableBots = function() {
        var metaRobots = document.head.querySelector('meta[name="robots"]');
        if (!metaRobots) {
            metaRobots = document.createElement('meta');
            document.head.appendChild(metaRobots);
        }
        metaRobots.name = 'robots';
        metaRobots.content = 'noindex';
    };

    /**
     * Get Page meta tags.
     * @param {String} page     Page name
     * @returns {Object}        Object contains needed tags
     */
    this.getPageMetaTags = function(page) {
        var mTags = Object.create(null);
        var metaRobots = document.head.querySelector('meta[name="robots"]');
        if (metaRobots) {
            document.head.removeChild(metaRobots);
        }
        var metaCanonical = document.head.querySelector('link[rel="canonical"]');
        if (metaCanonical) {
            document.head.removeChild(metaCanonical);
        }
        var metaStruct = document.head.querySelector('script[type="application/ld+json"]');
        if (metaStruct) {
            document.head.removeChild(metaStruct);
        }

        if (page === 'refer') {
            mTags.en_title = 'MEGA Referral Program - MEGA';
            mTags.en_desc = 'Earn 20% of the revenue from each purchase made by a user you have referred to MEGA';
            mTags.mega_title = l[23963] || mTags.en_title;
            mTags.mega_desc = l[22712] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/07834c8d2b3b05bc352966fe02fe597b.png';
        }
        else if (page === 'mobileapp' || page === 'mobile'
            || page === 'android' || page === 'ios' || page === 'uwp' || page === 'wp') {

            mTags.en_title = 'MEGA Mobile Apps - MEGA';
            mTags.en_desc = 'Securely manage your files and collaborate with everyone from anywhere.';
            mTags.mega_title = l[23965] || mTags.en_title;
            mTags.mega_desc = l[19683] || mTags.en_desc;
            if (page !== 'mobile') {
                addCanonical(getBaseUrl() + '/mobile');
            }
        }
        else if (page === 'nas') {
            mTags.en_title = 'MEGA on NAS - MEGA';
            mTags.en_desc = 'A command line tool to interact with MEGA from your Network Attached Storage device.';
            mTags.mega_title = l[23966] || mTags.en_title;
            mTags.mega_desc = l[23331] || mTags.en_desc;
        }
        else if (page === 'sync') {
            mTags.en_title = 'MEGA Desktop App - MEGA';
            mTags.en_desc = 'Easy automated synchronisation between your computer and your MEGA cloud';
            mTags.mega_title = l[23967] || mTags.en_title;
            mTags.mega_desc = l[16580] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/0723d3ca8f856c90f39480c66b4f2646.png';
        }
        else if (page === 'extensions' || page === 'chrome' || page === 'firefox' || page === 'edge') {
            mTags.en_title = 'Browser Extensions - MEGA';
            mTags.en_desc = 'Reduce loading times, improve download performance, strengthen security';
            mTags.mega_title = l[23968] || mTags.en_title;
            mTags.mega_desc = l[20921] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/b9a5ee1bd8935e2eb8659b1b7b87f0ae.png';
            if (page !== 'extensions') {
                addCanonical(getBaseUrl() + '/extensions');
            }
        }
        else if (page === 'bird') {
            mTags.en_title = 'MEGAbird - MEGA';
            mTags.en_desc = 'Send large files by email through MEGA';
            mTags.mega_title = l[23969] || mTags.en_title;
            mTags.mega_desc = l[20931] || mTags.en_desc;
        }
        else if (page === 'cmd') {
            mTags.en_title = 'MEGAcmd - MEGA';
            mTags.en_desc = 'A command line tool to work with your MEGA account and files.';
            mTags.mega_title = l[23970] || mTags.en_title;
            mTags.mega_desc = l[18775] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/75bc1e26149f8962b723a42205434feb.png';
        }
        else if (page === 'pro' || page.substr(0, 6) === 'propay') {
            mTags.en_title = 'Plans & pricing - MEGA';
            mTags.en_desc = 'Upgrade to a MEGA PRO account for additional storage and transfer quota. '
                + 'MEGA provides one of the cheapest cloud storage deals on the Internet.';
            mTags.mega_title = l[23971] || mTags.en_title;
            mTags.mega_desc = l[23972] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/559d084a50ad7283acb6f1c433136952.png';
        }
        else if (page === 'register') {
            mTags.en_title = 'Register - MEGA';
            mTags.en_desc = 'Create your MEGA account and get up to 50 GB free!';
            mTags.mega_title = l[23973] || mTags.en_title;
            mTags.mega_desc = l[23974] || mTags.en_desc;
        }
        else if (page === 'login') {
            mTags.en_title = 'Login - MEGA';
            mTags.en_desc = 'Login to your MEGA account';
            mTags.mega_title = l[23975] || mTags.en_title;
            mTags.mega_desc = l[1768] || mTags.en_desc;
        }
        else if (page === 'recovery') {
            mTags.en_title = 'Recovery - MEGA';
            mTags.en_desc = 'Forgot your MEGA password? Start your recovery process here.';
            mTags.mega_title = l[23976] || mTags.en_title;
            mTags.mega_desc = l[23977] || mTags.en_desc;
        }
        else if (page === 'terms') {
            mTags.en_title = 'Terms of Service - MEGA';
            mTags.en_desc = 'Want to know what your rights are when using MEGA\'s services?';
            mTags.mega_title = l[23978] || mTags.en_title;
            mTags.mega_desc = l[23979] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/4548c0ab90a611b8b7c5a940811e23b5975b4ba8.png';
        }
        else if (page === 'dispute') {
            mTags.en_title = 'Copyright Dispute - MEGA';
            mTags.en_desc = 'Counter-notification process of copyright dispute';
            mTags.mega_title = l[24967] || mTags.en_title;
            mTags.mega_desc = l[24968] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/4548c0ab90a611b8b7c5a940811e23b5975b4ba8.png';
        }
        else if (page === 'privacy' || page === 'gdpr') {
            mTags.en_title = 'Privacy Policy - MEGA';
            mTags.en_desc = 'Find out how MEGA protects your privacy.';
            mTags.mega_title = l[23980] || mTags.en_title;
            mTags.mega_desc = l[23981] || mTags.en_desc;
            if (page !== 'privacy') {
                addCanonical(getBaseUrl() + '/privacy');
            }
        }
        else if (page === 'copyright') {
            mTags.en_title = 'Copyright - MEGA';
            mTags.en_desc = 'Copyright. Notice of Alleged Infringement "Notice"';
            mTags.mega_title = l[23983] || mTags.en_title;
            mTags.mega_desc = l[23984] || mTags.en_desc;
        }
        else if (page === 'copyrightnotice') {
            mTags.en_title = 'Copyright Notice - MEGA';
            mTags.en_desc = 'Copyright. Notice of Alleged Infringement "Notice" submit';
            mTags.mega_title = l[23985] || mTags.en_title;
            mTags.mega_desc = l[23986] || mTags.en_desc;
        }
        else if (page === 'disputenotice') {
            mTags.en_title = 'Copyright Counter-Notification - MEGA';
            mTags.en_desc = 'Copyright Counter-Notification';
            mTags.mega_title = l[23987] || mTags.en_title;
            mTags.mega_desc = l[8789] || mTags.en_desc;
        }
        else if (page === 'takedown') {
            mTags.en_title = 'Takedown Guidance Policy - MEGA';
            mTags.en_desc = 'MEGA has special policies and procedures in place for anyone wanting access to user data' +
                            ' and information.';
            mTags.mega_title = l[23988] || mTags.en_title;
            mTags.mega_desc = l[23989] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/c449150b27444c9cc8eb3cad8ab02319744dd61d.png';
        }
        else if (page === 'cookie') {
            mTags.en_title = 'Cookie Policy - MEGA';
            mTags.en_desc = 'Understand how MEGA collects data from you using Cookies and similar technologies';
            mTags.mega_title = l[24639] || mTags.en_title;
            mTags.mega_desc = l[24640] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/e5cebb274552eb5e5408db5e834d5ff3ec8c66ef.png'
        }
        else if (page === 'contact') {
            mTags.en_title = 'Contact Us - MEGA';
            mTags.en_desc = 'Contact MEGA';
            mTags.mega_title = l[23990] || mTags.en_title;
            mTags.mega_desc = l[23991] || mTags.en_desc;
        }
        else if (page === 'resellers') {
            mTags.en_title = 'Resellers - MEGA';
            mTags.en_desc =
                'You can conveniently purchase your MEGA PRO membership from one of our authorized resellers.';
            mTags.mega_title = l[23992] || mTags.en_title;
            mTags.mega_desc = l[23993] || mTags.en_desc;
        }
        else if (page === 'securechat') {
            mTags.en_title = 'Secure Chat - MEGA';
            mTags.en_desc = 'With MEGA all chat messages, audio and video call are fully encrypted and 100% private';
            mTags.mega_title = l[24608] || mTags.en_title;
            mTags.mega_desc = l[24611] || mTags.en_desc;
        }
        else if (page === 'storage') {
            mTags.en_title = 'Secure Cloud Storage - MEGA';
            mTags.en_desc =
                'MEGA provides generous user-controlled end-to-end encrypted cloud storage and fast transfer';
            mTags.mega_title = l[24606] || mTags.en_title;
            mTags.mega_desc = l[24609] || mTags.en_desc;
        }
        else if (page === 'collaboration') {
            mTags.en_title = 'Collaboration - MEGA';
            mTags.en_desc =
                'With MEGA you can work with your stored files, stay connected and communicate all in one easy place';
            mTags.mega_title = l[24607] || mTags.en_title;
            mTags.mega_desc = l[24610] || mTags.en_desc;
        }
        else if (page === 'security') {
            mTags.en_title = 'Security - MEGA';
            mTags.en_desc = 'Security and why it matters';
            mTags.mega_title = l[23994] || mTags.en_title;
            mTags.mega_desc = l[20004] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/c964ddb7dd27f1acd727747862787486.png';
        }
        else if (page === 'privacycompany') {
            mTags.en_title = 'Privacy Company - MEGA';
            mTags.en_desc = 'MEGA is Cloud Storage with Powerful Always-On Privacy.';
            mTags.mega_title = l[23995] || mTags.en_title;
            mTags.mega_desc = l[676] || mTags.en_desc;
        }
        else if (page === 'dev' || page === 'developers') {
            mTags.en_title = 'MEGA Software Development Kit - MEGA';
            mTags.en_desc = 'Developers - MEGA Software Development Kit';
            mTags.mega_title = l[23996] || mTags.en_title;
            mTags.mega_desc = l[23997] || mTags.en_desc;
            if (page === 'developers') {
                addCanonical(getBaseUrl() + '/dev');
            }
        }
        else if (page === 'doc') {
            mTags.en_title = 'Documentation - MEGA';
            mTags.en_desc = 'Developers - Documentation';
            mTags.mega_title = l[23998] || mTags.en_title;
            mTags.mega_desc = l[23999] || mTags.en_desc;
        }
        else if (page === 'sdk') {
            mTags.en_title = 'SDK - MEGA';
            mTags.en_desc =
                'MEGA SDK for C++, providing essential abstraction to your application\'s secure cloud storage access.';
            mTags.mega_title = l[24000] || mTags.en_title;
            mTags.mega_desc = l[24001] || mTags.en_desc;
        }
        else if (page === 'sdkterms') {
            mTags.en_title = 'SDK Terms of Service - MEGA';
            mTags.en_desc = 'In addition to MEGA\'s Terms of Service and Privacy Policy, which are '
                + 'incorporated by reference into these terms, these terms apply to applications to '
                + 'use, and all subsequent use of, MEGA\'s API and SDK.';
            mTags.mega_title = l[24002] || mTags.en_title;
            mTags.mega_desc = l[24003] || mTags.en_desc;
        }
        else if (page === 'about/main' || page === 'about') {
            mTags.en_title = 'About - MEGA';
            mTags.en_desc = 'MEGA - The Privacy Company';
            mTags.mega_title = l[24004] || mTags.en_title;
            mTags.mega_desc = l[23065] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/0fcca13fc3baaf74cd6bdc51850c19c3.png';
            if (page === 'about') {
                addCanonical(getBaseUrl() + '/about/main');
            }
            this.addStrucuturedData('Organization', {
                url: getBaseUrl(),
                logo: 'https://cms2.mega.nz/b41537c0eae056cfe5ab05902fca322b.png',
            });
        }
        else if (page === 'about/jobs') {
            mTags.en_title = 'Jobs - MEGA';
            mTags.en_desc = 'MEGA career opportunities start right here!';
            mTags.mega_title = l[24005] || mTags.en_title;
            mTags.mega_desc = l[23082] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/659cd40a308f29a025c2d3b42944a0c9.png';
        }
        else if (page === 'about/privacy') {
            mTags.en_title = 'Privacy - MEGA';
            mTags.en_desc = 'MEGA is the Privacy Company';
            mTags.mega_title = l[24006] || mTags.en_title;
            mTags.mega_desc = l[23115] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/753f59a51ed56feda0644a1be74c1671.png';
        }
        else if (page === 'about/reliability') {
            mTags.en_title = 'Reliability - MEGA';
            mTags.en_desc = 'MEGA\'s mission is not limited to just keeping your valuable data private:'
                + ' safeguarding it is equally important to us.';
            mTags.mega_title = l[24007] || mTags.en_title;
            mTags.mega_desc = l[23122] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/f1d60e5822b4d755de9be2d0441b9a3b.png';
        }
        else if (page === 'sourcecode') {
            mTags.en_title = 'Source Code - MEGA';
            mTags.en_desc = 'Source Code Transparency';
            mTags.mega_title = l[24008] || mTags.en_title;
            mTags.mega_desc = l[8438] || mTags.en_desc;
            mTags.image = 'https://cms2.mega.nz/147ddec6fa35a6084030513d1ccd2eed.png';
        }
        else if (page === 'credits') {
            mTags.en_title = 'Credits - MEGA';
            mTags.en_desc = 'MEGA would like to thank the authors of the following open source '
                + 'components that contributed essential functionality to our site.';
            mTags.mega_title = l[24009] || mTags.en_title;
            mTags.mega_desc = l[24010] || mTags.en_desc;
        }
        else if (page === 'business') {
            mTags.en_title = 'Business - MEGA';
            mTags.en_desc = 'The secure solution for your business';
            mTags.mega_title = l[24011] || 'Business - MEGA';
            mTags.mega_desc = l[19531] || 'The secure solution for your business';
            mTags.image = 'https://cms2.mega.nz/730b119f030d91dacb5dc349726e6c17.png';
        }
        else if (page === 'registerb') {
            mTags.en_title = 'Business Account - MEGA';
            mTags.en_desc = 'Create Business Account';
            mTags.mega_title = l[24012] || mTags.en_title;
            mTags.mega_desc = l[19517] || mTags.en_desc;
        }
        else if (page === 'corporate' || page === 'corporate/media') {
            mTags.en_title = 'Media - MEGA';
            mTags.en_desc = 'MEGA Media';
            mTags.mega_title = l[24015] || mTags.en_title;
            mTags.mega_desc = l[24089] || mTags.en_desc;
            if (page === 'corporate') {
                addCanonical(getBaseUrl() + '/corporate/media');
            }
        }
        else if (page === 'corporate/reviews') {
            mTags.en_title = 'Reviews - MEGA';
            mTags.en_desc = 'MEGA reviews';
            mTags.mega_title = l[24086] || mTags.en_title;
            mTags.mega_desc = l[24087] || mTags.en_desc;
        }
        else if (typeof Object(window.dlmanager).isStreaming === 'object') {
            mTags.mega_title = dlmanager.isStreaming._megaNode.name + ' - MEGA';
            mTags.dynamic = true;
        }
        else if (page === 'recoveryparkchangepass') {
            mTags.mega_title = 'Park Change Password - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'recoverykeychangepass') {
            mTags.mega_title = 'Key Change Password - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'recoveryenterkey') {
            mTags.mega_title = 'Recovery Key - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'recoverybypark') {
            mTags.mega_title = 'Park Recovery - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'recoverybykey') {
            mTags.mega_title = 'Recover by Key - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'wiretransfer') {
            mTags.mega_title = 'Wire Transfer - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'twofactor') {
            mTags.mega_title = 'Two Factor - MEGA';
            stopBots(metaRobots);
        }
        else if (page.substr(0, 11) === 'emailverify') {
            mTags.mega_title = 'Email Verify - MEGA';
            mTags.mega_desc = 'Email verification';
            stopBots(metaRobots, true);
        }
        else if (page === 'businessinvite') {
            mTags.mega_title = 'Business Invite - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'businesssignup') {
            mTags.mega_title = 'Business Signup - MEGA';
            stopBots(metaRobots);
        }
        else if (page === 'blog') {
            mTags.en_title = 'Blog - MEGA';
            mTags.en_desc = 'MEGA\'s Blog';
            mTags.mega_title = l[24019] || mTags.en_title;
            mTags.mega_desc = l[24020] || mTags.en_desc;
            if (blogmonth || blogsearch) {
                stopBots(metaRobots, true);
            }
        }
        else if (page.substr(0, 10) === 'blogsearch') {
            mTags.mega_title = 'Blog search - MEGA';
            mTags.mega_desc = 'MEGA\'s Blog';
            stopBots(metaRobots, true);
        }
        else if (page === 'blogarticle') {
            mTags.mega_title = 'Blog article - MEGA';
            mTags.mega_desc = 'Blog article from MEGA';
            stopBots(metaRobots, true);
        }
        else if (page === 'achievements') {
            mTags.mega_title = 'Achievements - MEGA';
            mTags.mega_desc = 'Increase your cloud storage';
            stopBots(metaRobots, true);
        }
        else if (page.substr(0, 5) === 'blog/') {
            var notSet = true;
            if (blogHeaders && blogposts) {
                var bHeader = page.substr(page.lastIndexOf('/') + 1);
                if (blogHeaders[bHeader]) {
                    var post = blogposts[blogHeaders[bHeader]];
                    mTags.mega_title = post.h + ' - MEGA';
                    mTags.mega_desc = post.introtxt;
                    notSet = false;
                }
            }
            if (notSet) {
                mTags.mega_title = 'Blog article - MEGA';
                mTags.mega_desc = 'Blog article from MEGA';
                stopBots(metaRobots, true);
            }
        }
        else if (page === 'help') {
            mTags.en_title = 'Help - MEGA';
            mTags.en_desc = 'MEGA\'s Help Centre';
            mTags.mega_title = l[24021] || mTags.en_title;
            mTags.mega_desc = l[24022] || mTags.en_desc;
        }
        else if (page.substr(0, 11) === 'help/search') {
            var term = ucFirst(page.substr(12)).replace(/\+/g, ' ');
            mTags.en_title = term + ' - Search Help - MEGA';
            mTags.en_desc = 'MEGA\'s Search - Help Centre - ' + term;
            mTags.mega_title = l[24033].replace('$1', term).replace('$2', l[102]);
            mTags.mega_desc = l[24034].replace('$1', l[102]).replace('$2', term);
            mTags.section = 'help';
        }
        else if (page.indexOf('help/') > -1 && page.length > 5) {
            var linkParts = page.split('/');
            if (linkParts.length <= 2 || linkParts.length > 4) {
                stopBots(metaRobots);
            }
            else if (linkParts.length === 3) {
                var sectionTitle = (linkParts[2].charAt(0).toUpperCase() + linkParts[2].slice(1)).replace(/-/g, ' ');
                mTags.en_title = sectionTitle + ' Help - MEGA';
                mTags.en_desc = 'MEGA\'s ' + sectionTitle + ' Help Centre';
                mTags.mega_title = (l[24027] ? l[24027].replace('$1', sectionTitle) : '') || mTags.en_title;
                mTags.mega_desc = (l[24028] ? l[24028].replace('$1', sectionTitle) : '') || mTags.en_desc;
            }
            else if (linkParts.length === 4) {
                var secTitle = (linkParts[2].charAt(0).toUpperCase() + linkParts[2].slice(1)).replace(/-/g, ' ');
                var articleTitle = linkParts[3].charAt(0).toUpperCase() + linkParts[3].slice(1);
                var hashPos = articleTitle.lastIndexOf('#');
                if (hashPos > 0) {
                    articleTitle = articleTitle.substring(0, hashPos);
                }
                articleTitle = articleTitle.replace(/-/g, ' ');
                mTags.en_title = articleTitle + ' - ' + secTitle + ' Help - MEGA';
                mTags.en_desc = 'MEGA\'s ' + secTitle + ' - Help Centre - ' + articleTitle;
                mTags.mega_title = (l[24033] ? l[24033].replace('$1', articleTitle).replace('$2', secTitle) : '') ||
                    mTags.en_title;
                mTags.mega_desc = (l[24034] ? l[24034].replace('$1', secTitle).replace('$2', articleTitle) : '') ||
                    mTags.en_desc;
            }
            else {
                stopBots(metaRobots);
            }

            mTags.section = 'help';
        }
        else if (page === 'start') {
            mTags.mega_title = 'MEGA';
            if (getCleanSitePath().substr(0, 5) === 'start') {
                addCanonical(getBaseUrl());
            }
        }
        else if (page === 'downloadapp') {
            mTags.mega_title = 'Desktop Onboarding - MEGA';
            stopBots(metaRobots);
        }
        else if (page.startsWith('troy-hunt')) {
            mTags.mega_title = 'Troy Hunt - MEGA';
            mTags.mega_desc = 'MEGA\'s Troy Hunt Page';

            if (page.endsWith('/pro')) {
                mTags.mega_title = 'Troy Hunt - PRO - MEGA';
            }
            else if (page.endsWith('/business')) {
                mTags.mega_title = 'Troy Hunt - Business - MEGA';
            }

            stopBots(metaRobots);
        }
        else if (page && (mTags.excluded = isPageExcluded(page))) {
            mTags.mega_title = page.charAt(0).toUpperCase() + page.slice(1) + ' - MEGA';
            stopBots(metaRobots);
        }
        else {
            mTags.mega_title = 'MEGA';
            stopBots(metaRobots);
        }
        if (!mTags.mega_desc) {
            mTags.mega_desc = l[24023] || mega.whoami;
            if (!isPageExcluded(page) && !is_fm() && !is_extension) {
                if (d) {
                    console.error('A page without Description. Please handle. Page: ' + page);
                }
                api_req({ a: 'log', e: 99736, m: 'page without desc: ' + page });
            }
        }

        mTags.image = mTags.image || 'https://cms2.mega.nz/b41537c0eae056cfe5ab05902fca322b.png';
        insertOgTwitterMetas(
            mTags.mega_title,
            mTags.mega_desc,
            getBaseUrl() + (page && page !== 'start' ? '/' + page : ''),
            mTags.image
        );

        mTags.page = page;
        this.lastSetMetaTags = mTags;

        return mTags;
    };
    /* eslint-enable complexity */

    this.checkPageMatchesURL = function() {
        if (page !== (getCleanSitePath() || 'start')) {
            var metaRobots = document.head.querySelector('meta[name="robots"]');
            if (!metaRobots) {
                stopBots(metaRobots);
            }
        }
    };
};
