function FileManager() {
    "use strict";

    this.logger = new MegaLogger('FileManager');
    this.columnsWidth = {
        cloud: Object.create(null),
        inshare: Object.create(null),
        outshare: Object.create(null)
    };

    this.columnsWidth.cloud.fav = { max: 50, min: 50, curr: 50, viewed: true };
    this.columnsWidth.cloud.fname = { max: 5000, min: 180, curr: 'calc(100% - 560px)', viewed: true };
    this.columnsWidth.cloud.label = { max: 130, min: 80, curr: 80, viewed: false };
    this.columnsWidth.cloud.size = { max: 160, min: 100, curr: 100, viewed: true };
    this.columnsWidth.cloud.type = { max: 180, min: 130, curr: 130, viewed: true };
    this.columnsWidth.cloud.timeAd = { max: 180, min: 130, curr: 130, viewed: true };
    this.columnsWidth.cloud.timeMd = { max: 180, min: 130, curr: 130, viewed: false };
    this.columnsWidth.cloud.versions = { max: 180, min: 130, curr: 130, viewed: false };
    this.columnsWidth.cloud.extras = { max: 140, min: 93, curr: 93, viewed: true };

    this.columnsWidth.makeNameColumnStatic = function() {
        var $header = $('.files-grid-view.fm .grid-table-header th[megatype="fname"]');
        // check if it's still dynamic
        var colStyle = $header.attr('style');

        if (colStyle && colStyle.indexOf('calc(100% -') !== -1) {
            var currWidth = $header.outerWidth();
            M.columnsWidth.cloud['fname'].curr = currWidth;
            $(".grid-table td[megatype='fname']").
                outerWidth(currWidth);
            $('.files-grid-view.fm .grid-table-header th[megatype="fname"]').
                outerWidth(currWidth);
        }
    };

}
FileManager.prototype.constructor = FileManager;

FileManager.prototype.showExpiredBusiness = function() {
    'use strict';
    M.require('businessAcc_js', 'businessAccUI_js').done(function() {
        var business_ui = new BusinessAccountUI();
        business_ui.showExpiredDialog(u_attr.b.m);
    });
};

/** Check if this is a business expired account, or ODW paywall. */
FileManager.prototype.isInvalidUserStatus = function() {
    'use strict';
    if (mega.paywall) {
        if (u_attr.b && u_attr.b.s === -1) {
            if ($.hideContextMenu) {
                $.hideContextMenu();
            }
            M.showExpiredBusiness();
            return true;
        }
        if (u_attr.uspw) {
            if ($.hideContextMenu) {
                $.hideContextMenu();
            }
            M.showOverStorageQuota(EPAYWALL);
            return true;
        }
    }
    return false;
};

/**
 * Initialize the rendering of the cloud/file-manager
 * @details Former renderfm()
 * @returns {MegaPromise}
 */
FileManager.prototype.initFileManager = function() {
    "use strict";

    var promise = new MegaPromise();
    var tpromise;

    if (d) {
        console.time('renderfm');
    }

    this.initFileManagerUI();
    this.sortByName();

    if (is_mobile) {
        tpromise = MegaPromise.resolve();
    }
    else {
        tpromise = this.renderTree();
        tpromise.always(function() {
            delay('render:path_breadcrumbs', () => M.renderPathBreadcrumbs());
        });
    }

    tpromise
        .always(function() {
            var $treesub = $('#treesub_' + M.RootID);
            if (!$treesub.hasClass('opened')) {
                $treesub.addClass('opened');
            }

            var path = $.autoSelectNode && M.getNodeByHandle($.autoSelectNode).p || M.currentdirid || getLandingPage();

            if (path) {
                mBroadcaster.once('fm:initialized', SoonFc(fmLeftMenuUI));
            }

            M.openFolder(path, true)
                .always(function() {
                    if (megaChatIsReady) {
                        megaChat.renderMyStatus();
                    }

                    if (d) {
                        console.timeEnd('renderfm');
                    }

                    promise.resolve.apply(promise, arguments);
                });
        });
    return promise;
};

/**
 * Invoke callback once the fm has been initialized
 * @param {Boolean} [ifMaster] Invoke callback if running under a master tab
 * @param {Function} callback The function to invoke
 */
FileManager.prototype.onFileManagerReady = function(ifMaster, callback) {
    'use strict';

    if (typeof ifMaster === 'function') {
        callback = ifMaster;
        ifMaster = false;
    }

    callback = (function(callback) {
        return function() {
            if (!ifMaster || mBroadcaster.crossTab.master) {
                onIdle(callback);
            }
        };
    })(callback);

    if (fminitialized) {
        onIdle(callback);
    }
    else {
        mBroadcaster.once('fm:initialized', callback);
    }
};

/**
 * Initialize the cloud/file-manager UI components
 * @details Former initUI()
 */
FileManager.prototype.initFileManagerUI = function() {
    "use strict";

    if (d) {
        console.time('initUI');
    }
    $('.not-logged .fm-not-logged-button.create-account').rebind('click', function() {
        loadSubPage('register');
    });

    $('.fm-main').removeClass('l-pane-collapsed');
    $('button.l-pane-visibility').removeClass('active');

    $('.fm-dialog-overlay').rebind('click.fm', function(ev) {
        if ($.dialog === 'pro-login-dialog'
            || $.dialog === 'share'
            || $.dialog === 'share-add'
            || $.dialog === 'cookies-dialog'
            || $.dialog === 'affiliate-redeem-dialog'
            || $.dialog === 'discount-offer'
            || $.dialog === 'voucher-info-dlg'
            || String($.dialog).startsWith('verify-email')
            || localStorage.awaitingConfirmationAccount) {

            return false;
        }
        showLoseChangesWarning().done(function() {
            closeDialog(ev);
        });
        $.hideContextMenu();

        // For ephemeral session redirect to 'fm' page
        // if user clicks overlay instead Yes/No or close icon 'x'
        // One situation when this is used, is when ephemeral user
        //  trying to access settings directly via url
        if (u_type === 0 && !folderlink) {
            loadSubPage('fm');
        }
    });

    if (folderlink) {
        $('.nw-fm-left-icons-panel .logo').removeClass('hidden');
        $('.fm-main').addClass('active-folder-link');
        $('.activity-status-block').hide();

        var $prodNav = $('.fm-products-nav').text('');
        if (!u_type) {
            $prodNav.safeHTML(translate(pages['pagesmenu']));
            onIdle(clickURLs);
        }

        $('button.l-pane-visibility').rebind('click.leftpane', function() {
            var $this = $(this);
            var $breadcrumbs = $('.fm-right-header .fm-breadcrumbs-block');

            if ($this.hasClass('active')) {
                if (M.currentdirid === M.RootID) {
                    $breadcrumbs.addClass('deactivated');
                }
                $this.removeClass('active');
                $('.fm-main').removeClass('l-pane-collapsed');
            }
            else {
                $this.addClass('active');
                $('.fm-main').addClass('l-pane-collapsed');

                M.onFileManagerReady(function() {
                    if (M.currentdirid === M.RootID) {
                        $breadcrumbs.removeClass('deactivated')
                            .find('.folder-link .right-arrow-bg')
                            .safeHTML('<span>@@</span>', M.getNameByHandle(M.RootID));
                    }
                });
            }

            // reposition click hint, if opened
            if (mega.cttHintTimer) {
                M.showClickHint(true);
            }
            $.tresizer();
        });

        if (!M.tree[M.RootID]) {
            $('button.l-pane-visibility').trigger('click');
        }
    }
    else {
        $('.nw-fm-left-icons-panel .logo').addClass('hidden');
        $('.fm-main').removeClass('active-folder-link');
        $('.fm-products-nav').text('');
    }

    $.doDD = function(e, ui, a, type) {

        function nRevert(r) {
            try {
                $(ui.draggable).draggable("option", "revert", false);
                if (r) {
                    $(ui.draggable).remove();
                }
            }
            catch (e) {
            }
        }

        var c = $(ui.draggable).attr('class');
        var t, ids, dd;


        if (c && c.indexOf('nw-fm-tree-item') > -1) {
            // tree dragged:
            var id = $(ui.draggable).attr('id');
            if (id.indexOf('treea_') > -1) {
                ids = [id.replace('treea_', '')];
            }
            else if (id.indexOf('contact_') > -1) {
                ids = [id.replace('contact_', '')];
            }
        }
        else {
            if ($.dragSelected && $.dragSelected.length > 0) {
                ids = $.dragSelected;
            }
            else if ($.selected && $.selected.length > 0) {
                // grid dragged:
                ids = $.selected;
            }
        }

        // Workaround a problem where we get over[1] -> over[2] -> out[1]
        if (a === 'out' && $.currentOver !== $(e.target).attr('id')) {
            a = 'noop';
        }

        if (type == 1) {
            // tree dropped:
            var c = $(e.target).attr('class');
            if (c && c.indexOf('nw-fm-left-icon') > -1) {
                dd = 'nw-fm-left-icon';
                if (a === 'drop') {
                    if (c.indexOf('cloud') > -1) {
                        t = M.RootID;
                    }
                    else if (c.indexOf('rubbish-bin') > -1) {
                        t = M.RubbishID;
                    }
                    else if (c.indexOf('transfers') > -1) {
                        dd = 'download';
                    }
                }
            }
            else if (c && c.indexOf('nw-fm-tree-item') > -1 && !$(e.target).visible(!0)) {
                dd = 'download';
            }
            else if (
                $(e.target).is('ul.conversations-pane > li') ||
                $(e.target).closest('ul.conversations-pane > li').length > 0 ||
                $(e.target).is('.messages-block')
            ) {
                if (M.isFile(ids)) {
                    dd = 'chat-attach';
                }
                else {
                    dd = 'noop';
                }
            }
            else {
                var t = $(e.target).attr('id');
                if (t && t.indexOf('treea_') > -1) {
                    t = t.replace('treea_', '');
                }
                else if (t && t.indexOf('path_') > -1) {
                    t = t.replace('path_', '');
                }
                else if (t && t.indexOf('contact2_') > -1) {
                    t = t.replace('contact2_', '');
                }
                else if (t && t.indexOf('contact_') > -1) {
                    t = t.replace('contact_', '');
                }
                else if (M.currentdirid !== 'shares' || !M.d[t] || M.getNodeRoot(t) !== 'shares') {
                    t = undefined;
                }
            }
        }
        else {
            // grid dropped:
            var c = $(e.target).attr('class');
            if (c && c.indexOf('folder') > -1) {
                t = $(e.target).attr('id');
            }
        }

        var setDDType = function() {
            if (ids && ids.length && t) {
                dd = ddtype(ids, t, e.altKey);
                if (dd === 'move' && e.altKey) {
                    dd = 'copy';
                }
            }
        };

        if (a !== 'noop') {
            if ($.liTimerK) {
                clearTimeout($.liTimerK);
            }
            $('body').removeClassWith('dndc-');
            $('.hide-settings-icon').removeClass('hide-settings-icon');
        }
        setDDType();

        if (a === 'drop' || a === 'out' || a === 'noop') {
            $(e.target).removeClass('dragover');
            // if (a !== 'noop') $('.dragger-block').addClass('drag');
        }
        else if (a === 'over') {
            var id = $(e.target).attr('id');
            if (!id) {
                $(e.target).uniqueId();
                id = $(e.target).attr('id');
            }

            $.currentOver = id;
            setTimeout(function() {
                if ($.currentOver === id) {
                    var h;
                    if (id.indexOf('treea_') > -1) {
                        h = id.replace('treea_', '');
                    }
                    else {
                        var c = $(id).attr('class');
                        if (c && c.indexOf('cloud-drive-item') > -1) {
                            h = M.RootID;
                        }
                        else if (c && c.indexOf('recycle-item') > -1) {
                            h = M.RubbishID;
                        }
                        else if (c && c.indexOf('contacts-item') > -1) {
                            h = 'contacts';
                        }
                    }
                    if (h) {
                        M.onTreeUIExpand(h, 1);
                    }
                    else if ($(e.target).hasClass('nw-conversations-item')) {
                        $(e.target).click();
                    }
                    else if ($(e.target).is('ul.conversations-pane > li')) {
                        $(e.target).click();
                    }
                }
            }, 890);

            if (dd === 'move') {
                $.draggingClass = ('dndc-move');
            }
            else if (dd === 'copy') {
                $.draggingClass = ('dndc-copy');
            }
            else if (dd === 'download') {
                $.draggingClass = ('dndc-download');
            }
            else if (dd === 'nw-fm-left-icon') {
                var c = '' + $(e.target).attr('class');

                $.draggingClass = ('dndc-warning');
                if (c.indexOf('rubbish-bin') > -1) {
                    $.draggingClass = ('dndc-to-rubbish');
                }
                else if (c.indexOf('conversations') > -1) {
                    $.draggingClass = ('dndc-to-conversations');
                }
                else if (c.indexOf('shared-with-me') > -1) {
                    $.draggingClass = ('dndc-to-shared');
                }
                else if (c.indexOf('transfers') > -1) {
                    $.draggingClass = ('dndc-download');
                }
                else if (c.indexOf('cloud-drive') > -1) {
                    $.draggingClass = ('dndc-move');
                }
                else {
                    c = null;
                }

                if (c) {
                    if ($.liTooltipTimer) {
                        clearTimeout($.liTooltipTimer);
                    }
                    $.liTimerK = setTimeout(function() {
                        $(e.target).click()
                    }, 920);
                }
            }
            else if (dd === 'chat-attach') {
                $.draggingClass = ('dndc-to-conversations');
            }
            else {
                $.draggingClass = M.d[t] ? 'dndc-warning' : 'dndc-move';
            }

            $('body').addClass($.draggingClass);

            $(e.target).addClass('dragover');
            $($.selectddUIgrid + ' ' + $.selectddUIitem).removeClass('ui-selected');
            if ($(e.target).hasClass('folder')) {
                $(e.target).addClass('ui-selected').find('.file-settings-icon, .grid-url-arrow').addClass('hide-settings-icon');
            }
        }
        // if (d) console.log('!a:'+a, dd, $(e.target).attr('id'), (M.d[$(e.target).attr('id').split('_').pop()]||{}).name, $(e.target).attr('class'), $(ui.draggable.context).attr('class'));

        var onMouseDrop = function() {
            if (dd === 'nw-fm-left-icon') {
                // do nothing
            }
            else if ($(e.target).hasClass('nw-conversations-item') || dd === 'chat-attach') {
                nRevert();

                // drop over a chat window
                var currentRoom = megaChat.getCurrentRoom();
                assert(currentRoom, 'Current room missing - this drop action should be impossible.');
                currentRoom.attachNodes(ids);
            }
            else if (dd === 'move') {
                nRevert();
                $.moveids = ids;
                $.movet = t;
                var $ddelm = $(ui.draggable);
                setTimeout(function() {
                    if ($.movet === M.RubbishID) {
                        fmremove($.moveids);
                        if (selectionManager) {
                            selectionManager.clear_selection();
                        }
                    }
                    else {
                        M.moveNodes($.moveids, $.movet)
                            .done(function(moves) {
                                if (moves && M.currentdirid !== 'out-shares' && M.currentdirid !== 'public-links') {
                                    $ddelm.remove();
                                }
                            });
                        if (window.selectionManager) {
                            selectionManager.resetTo($.movet);
                        }
                    }
                }, 50);
            }
            else if ((dd === 'copy') || (dd === 'copydel')) {
                nRevert();
                $.copyids = ids;
                $.copyt = t;
                setTimeout(function() {
                    M.copyNodes($.copyids, $.copyt, (dd === 'copydel'), new MegaPromise())
                        .done(function() {

                            // Update files count...
                            if (M.currentdirid === 'shares' && !M.viewmode) {
                                M.openFolder('shares', 1);
                            }
                        })
                        .fail(function(error) {
                            if (error === EOVERQUOTA) {
                                return msgDialog('warninga', l[135], l[8435]);
                            }
                            // Tell the user there was an error unless he cancelled the file-conflict dialog
                            if (error !== EINCOMPLETE) {
                                msgDialog('warninga', l[135], l[47], api_strerror(error));
                            }
                        });
                }, 50);
            }
            else if (dd === 'download') {
                nRevert();
                var as_zip = e.altKey;
                M.addDownload(ids, as_zip);
            }
            $('.dragger-block').hide();
        };

        if (a === 'drop' && dd !== undefined) {
            dbfetch.get(t).always(function() {
                setDDType();
                if (dd) {
                    onMouseDrop();
                }
            });
        }
    };
    InitFileDrag();
    M.createFolderUI();
    M.treeSearchUI();
    M.treeFilterUI();
    M.treeSortUI();
    M.initTreePanelSorting();
    M.initContextUI();
    initShareDialog();
    M.addTransferPanelUI();
    M.initUIKeyEvents();
    M.onFileManagerReady(topmenuUI);
    M.initMegaSwitchUI();

    // disabling right click, default contextmenu.
    var alwaysShowContextMenu = Boolean(localStorage.contextmenu);
    $(document).rebind('contextmenu.doc', function(ev) {
        var target = ev.target;
        var ALLOWED_IDS = {'embed-code-field': 1};
        var ALLOWED_NODES = {INPUT: 1, TEXTAREA: 1, VIDEO: 1};
        var ALLOWED_CLASSES = [
            'contact-details-user-name',
            'contact-details-email',
            'nw-conversations-name'
        ];
        var ALLOWED_PARENTS =
            '#startholder, .fm-account-main, .export-link-item, .contact-fingerprint-txt, .fm-breadcrumbs, ' +
            '.fm-affiliate, .text-editor-container';
        var ALLOWED_CLOSEST =
            '.multiple-input, .create-folder-input-bl, .content-panel.conversations, ' +
            '.messages.content-area, .chat-right-pad .user-card-data';

        if (ALLOWED_NODES[target.nodeName] || ALLOWED_IDS[target.id] || alwaysShowContextMenu) {
            return;
        }

        for (var i = ALLOWED_CLASSES.length; i--;) {
            if (target.classList.contains(ALLOWED_CLASSES[i])) {
                return;
            }
        }

        var $target = $(target);
        if (!is_fm() || $target.parents(ALLOWED_PARENTS).length || $target.closest(ALLOWED_CLOSEST).length) {
            return;
        }

        $.hideContextMenu();
        return false;
    });

    var $fmholder = $('#fmholder');
    $('.grid-table-header .grid-view-resize').rebind('mousedown.colresize', function(col) {
        var $me = $(this);
        var th = $me.closest('th');
        var thElm = th;
        var startOffset = th.outerWidth() - col.pageX;

        $fmholder.rebind('mousemove.colresize', function(col) {
            var newWidth = startOffset + col.pageX;

            var colType = thElm.attr('megatype');
            if (colType) {
                if (newWidth < M.columnsWidth.cloud[colType].min) {
                    return;
                }
                if (newWidth > M.columnsWidth.cloud[colType].max) {
                    return;
                }
                thElm.outerWidth(newWidth);
                M.columnsWidth.cloud[colType].curr = thElm.outerWidth();
                $(".grid-table td[megatype='" + colType + "']").
                    outerWidth(M.columnsWidth.cloud[colType].curr);

                if (M.megaRender && M.megaRender.megaList) {
                    if (M.megaRender.megaList._scrollIsInitialized) {
                        M.megaRender.megaList.scrollUpdate();
                    }
                    else {
                        M.megaRender.megaList.resized();
                    }
                }
            }
            else {
                thElm.outerWidth(newWidth);
            }

            $('#fmholder').css('cursor', 'col-resize');
        });

        $fmholder.rebind('mouseup.colresize', function() {
            M.columnsWidth.makeNameColumnStatic();
            initGridScrolling();
            $('#fmholder').css('cursor', '');
            $fmholder.off('mouseup.colresize');
            $fmholder.off('mousemove.colresize');
        });
    });


    $fmholder
        .rebind('ps-scroll-left.fm-x-scroll ps-scroll-right.fm-x-scroll', function(e) {
            if (!e || !e.target) {
                console.warn('no scroll event info...!');
                console.warn(e);
                return;
            }
            var $target = $(e.target);
            if (!$target.hasClass('grid-scrolling-table megaListContainer')) {
                return;
            }


            var scroller = $('.files-grid-view.fm .grid-table-header');
            scroller.css('left', -1 * e.target.scrollLeft);

        });

    $('.fm-files-view-icon').rebind('click', function() {
        $.hideContextMenu();

        var viewValue = $(this).hasClass('listing-view') ? 0 : 1;

        if (fmconfig.uiviewmode | 0) {
            mega.config.set('viewmode', viewValue);
        }
        else {
            fmviewmode(M.currentdirid, viewValue);
        }

        if (folderlink && M.currentdirid.substr(0, 6) === 'search') {
            M.viewmode = viewValue;
            M.renderMain();
        }
        else {
            M.openFolder(M.currentdirid, true).then(reselect.bind(null, 1));
        }

        return false;
    });

    $('.fm-folder-upload, .fm-file-upload').rebind('click', (element) => {
        $.hideContextMenu();
        if (element.currentTarget.classList.contains('fm-folder-upload')) {
            $('#fileselect2').click();
        }
        else {
            $('#fileselect1').click();
        }
    });

    $.hideContextMenu = function(event) {

        var a, b, currentNodeClass;

        if (event && event.target) {

            a = event.target.parentNode;
            currentNodeClass = event.target.classList;
            if (!currentNodeClass.length) {
                currentNodeClass = a.classList;
            }
            if (currentNodeClass && currentNodeClass.contains('dropdown')
                && (currentNodeClass.contains('download-item')
                || currentNodeClass.contains('move-item'))
                && currentNodeClass.contains('active')) {
                return false;
            }

            if (!(a && a.classList.contains('breadcrumb-dropdown-link'))) {
                $('.breadcrumb-dropdown').removeClass('active');
            }
        }

        $('.grid-url-arrow').removeClass('active');
        $('.nw-sorting-menu').addClass('hidden');
        $('.colour-sorting-menu').addClass('hidden');
        $('.fm-start-chat-dropdown').addClass('hidden').removeClass('active');
        $('.start-chat-button').removeClass('active');
        $('.nw-tree-panel-arrows').removeClass('active');
        $('.dropdown-item.dropdown').removeClass('active');
        $('.nw-fm-tree-item').removeClass('dragover');
        $('.nw-fm-tree-item.hovered').removeClass('hovered');
        $('.data-block-view .file-settings-icon').removeClass('active');
        $('.grid-table-header-container-sc .column-settings.overlap').removeClass('c-opened');
        $('.js-statusbarbtn.options').removeClass('c-opened');

        // Set to default
        a = $('.dropdown.body.files-menu,.dropdown.body.download');
        a.addClass('hidden');
        b = a.find('.dropdown.body.submenu');
        b.attr('style', '');
        b.removeClass('active left-position overlap-right overlap-left mega-height');
        a.find('.disabled,.context-scrolling-block').removeClass('disabled context-scrolling-block');
        a.find('.dropdown-item.contains-submenu.opened').removeClass('opened');

        // Cleanup for scrollable context menu
        var cnt = $('#cm_scroll').contents();
        $('#cm_scroll').replaceWith(cnt);// Remove .context-scrollable-block
        a.removeClass('mega-height');
        a.find('> .context-top-arrow').remove();
        a.find('> .context-bottom-arrow').remove();
        a.css({ 'height': 'auto' });// In case that window is enlarged

        // Remove all sub-menues from context-menu move-item
        $('#csb_' + M.RootID).empty();

        $(window).off('resize.ccmui');
        $('.jspContainer', '#bodyel').off('mousewheel.context');

        // enable scrolling
        if ($.disabledContianer) {
            Ps.enable($.disabledContianer[0]);
            delete $.disabledContianer;
        }
    };

    $fmholder.rebind('click.contextmenu', function(e) {
        $.hideContextMenu(e);
        if ($.hideTopMenu) {
            $.hideTopMenu(e);
        }
        if (M.chat) {
            // chat can handle its own links..no need to return false on every "click" and "element" :O
            // halt early, to save some CPU cycles if in chat.
            return;
        }
        var $target = $(e.target);
        var exclude = '.upgradelink, .campaign-logo, .resellerbuy, .linkified, a.red, a.mailto, a.top-social-button';

        if ($target.attr('type') !== 'file'
            && !$target.is(exclude)
            && !$target.parent().is(exclude)) {
            return false;
        }
    });

    $('.fm-back-button').rebind('click', function() {

        if (!M.currentdirid) {
            return;
        }

        if (M.currentdirid === 'notifications'
            || M.currentdirid.substr(0, 7) === 'search/'
            || M.currentdirid.substr(0, 5) === 'chat/') {
            window.history.back();
        }
        else {
            var n = M.d[M.currentdirid];
            if ((n && n.p && M.d[n.p]) || (n && n.p === 'contacts')) {
                M.openFolder(n.p);
            }
        }
    });

    if (page !== "chat") {
        $('.fm-right-header.fm').removeClass('hidden');
    }

    folderlink = folderlink || 0;

    if ((typeof dl_import !== 'undefined') && dl_import) {
        M.onFileManagerReady(importFile);
    }

    $('.dropdown.body.context').rebind('contextmenu.dropdown', function(e) {
        if (!localStorage.contextmenu) {
            e.preventDefault();
        }
    });

    $('.nw-fm-left-icon, .js-lpbtn').rebind('contextmenu', (ev) => {
        M.contextMenuUI(ev, 1);
        return false;
    });

    // stop sort and filter dialog clicking close itself
    $('.nw-sorting-menu').on('click', function(e) {
        e.stopPropagation();
    });

    var self = this;

    if (!this.fmTabState || this.fmTabState['cloud-drive'].root !== M.RootID) {
        this.fmTabState = {
            'cloud-drive': { // My-files
                root: M.RootID,
                prev: null,
                subpages: [M.InboxID, M.RubbishID, 'recents', 'shares', 'out-shares', 'public-links']
            },
            'folder-link':     {root: M.RootID,    prev: null},
            'conversations':   {root: 'chat',      prev: null, subpages: ['contacts']},
            'transfers':       {root: 'transfers', prev: null},
            'account':         {root: 'account',   prev: null},
            'dashboard':       {root: 'dashboard', prev: null, subpages: ['refer']},
            'user-management': {root: 'user-management', prev: null},
            'shared-with-me':  {root: 'shares',    prev: null, subpages: ['out-shares']},
            'public-links':    {root: 'public-links',    prev: null},
            'recents':         {root: 'recents',   prev: null},
            'inbox':           {root: M.InboxID,   prev: null},
            'rubbish-bin':     {root: M.RubbishID, prev: null},
            'contacts':        {root: 'contacts',  prev: null}
        };
    }

    var isMegaSyncTransfer = true;
    $('.js-fm-tab').rebind('click.fmTabState', function() {

        treesearch = false;
        var clickedClass = this.className;

        if (!clickedClass) {
            return;
        }

        if ((ul_queue && ul_queue.length) || (dl_queue && dl_queue.length)) {
            isMegaSyncTransfer = false;
        }
        if (clickedClass.indexOf('transfers') > -1) {
            if (isMegaSyncTransfer && window.useMegaSync === 2) {
                megasync.transferManager();
                return;
            }
            else {
                // reset - to ckeck again next time
                isMegaSyncTransfer = true;
                if (!mega.tpw.isWidgetVisibile()) {
                    mega.tpw.showWidget();
                    if (mega.tpw.isWidgetVisibile()) {
                        // do if there's no transfers, we will allow going to transfers page
                        return false;
                    }

                }
                else {
                    mega.tpw.hideWidget();
                }
            }
        }

        var activeClass = this.classList.contains('btn-myfiles') ? '.btn-myfiles' : '.js-fm-tab';

        activeClass = ('' + $(activeClass + '.active:visible')
            .attr('class')).split(" ").filter(function(c) {
            return !!self.fmTabState[c];
        })[0];

        var activeTab = self.fmTabState[activeClass];

        if (activeTab) {
            if (activeTab.root === M.currentrootid || activeTab.root === 'chat' ||
                activeTab.subpages && activeTab.subpages.indexOf(M.currentrootid || M.currentdirid) !== -1) {
                activeTab.prev = M.currentdirid;
                M.lastActiveTab = activeClass;
            }
            else if (d) {
                console.warn('Root mismatch', M.currentrootid, M.currentdirid, activeTab);
            }
        }

        if (this.classList.contains('account') || this.classList.contains('dashboard')) {
            if (u_type === 0) {
                if (this.classList.contains('account')) {
                    ephemeralDialog(l[7687]);
                }
                else {
                    // Show message 'This page is for registered users only'
                    ephemeralDialog(l[17146]);
                }
            }
            else if (this.classList.contains('dashboard')) {
                if (M.currentdirid !== 'refer' && self.fmTabState.dashboard.prev === 'refer') {
                    loadSubPage('fm/refer');
                    return false;
                }
                self.fmTabState.dashboard.prev = null;
                loadSubPage('fm/dashboard');
            }
            else {
                loadSubPage('fm/account');
                const accountPageJsp = $('.fm-account-main').data('jsp');
                if (accountPageJsp) {
                    $accountPageJsp.scrollToY(0, false);
                }
            }
            return false;
        }

        for (var tab in self.fmTabState) {
            if (~clickedClass.indexOf(tab)) {
                tab = self.fmTabState[tab];

                var targetFolder = null;

                // Clicked on the currently active tab, should open the root (e.g. go back)
                if (~clickedClass.indexOf(activeClass)) {
                    targetFolder = tab.root;

                    // special case handling for the chat, re-render current conversation
                    if (tab.root === 'chat' && String(M.currentdirid).substr(0, 5) === 'chat/' &&
                        !M.currentdirid.startsWith('chat/contacts')) {
                        targetFolder = M.currentdirid;
                    }
                }
                else if (tab.prev && (M.d[tab.prev] || M.isCustomView(tab.prev) ||
                    tab.subpages.indexOf(tab.prev) > -1)) {
                    targetFolder = tab.prev;
                }
                else {
                    targetFolder = tab.root;
                }

                M.openFolder(targetFolder, true);

                break;
            }
        }
    });

    if (dlMethod.warn) {
        window.onerror = null;
        console.error('This browser is using an outdated download method, good luck...', '' + window.ua);
    }

    // chat can handle the left-panel resizing on its own
    var lPane = $('.fm-left-panel').filter(":not(.chat-left-panel)");
    $.leftPaneResizable = new FMResizablePane(lPane, {
        'direction': 'e',
        'minWidth': 200,
        'maxWidth': 400,
        'persistanceKey': 'leftPaneWidth',
        'handle': '.left-pane-drag-handle'
    });

    if (fmconfig.leftPaneWidth) {
        lPane.width(Math.min(
            $.leftPaneResizable.options.maxWidth,
            Math.max($.leftPaneResizable.options.minWidth, fmconfig.leftPaneWidth)
        ));
    }

    $($.leftPaneResizable).on('resize', function() {
        var w = lPane.width();
        if (w >= $.leftPaneResizable.options.maxWidth) {
            $('.left-pane-drag-handle').css('cursor', 'w-resize');
            $('body').css('cursor', 'w-resize');
        }
        else if (w <= $.leftPaneResizable.options.minWidth) {
            $('.left-pane-drag-handle').css('cursor', 'e-resize');
            $('body').css('cursor', 'e-resize');
        }
        else {
            $('.left-pane-drag-handle').css('cursor', 'ew-resize');
            $('body').css('cursor', 'ew-resize');
        }

        if (!this.element.hasClass('ui-resizable-resizing')) {
            $('body').css('cursor', 'auto');
        }

        if (lPane.width() < $.leftPaneResizable.options.updateWidth + 60) {
            lPane.addClass('small-left-panel');
        }
        else {
            lPane.removeClass('small-left-panel');
        }

        $.tresizer();
    });

    $(window).rebind('resize.fmrh hashchange.fmrh', fm_resize_handler);

    if (ua.details.os === "Apple") {

        $(window).rebind('blur.ps-unfocus', function() {

            $(document).rebind('ps-scroll-y.ps-unfocus', function(e) {

                $(e.target).addClass('ps-outfocused-scrolling');

                delay('ps-out-focused-' + $(e.target).data('ps-id'), function __psOutFocused() {
                    $(e.target).removeClass('ps-outfocused-scrolling');
                }, 1000);
            });
        });

        if (!document.hasFocus()) {
            $(window).trigger('blur.ps-unfocus');
        }

        $(window).rebind('focus.ps-unfocus', function() {

            $(document).off('ps-scroll-y.ps-unfocus');
        });
    }

    if (d) {
        console.timeEnd('initUI');
    }
};

/**
 * A FileManager related method for (re)initializing the shortcuts and selection managers.
 *
 * @param container
 * @param aUpdate
 */
FileManager.prototype.initShortcutsAndSelection = function (container, aUpdate) {
    'use strict';

    if (!window.fmShortcuts) {
        window.fmShortcuts = new FMShortcuts();
    }

    if (!aUpdate) {
        if (window.selectionManager) {
            window.selectionManager.destroy();
        }

        if (M.previousdirid !== M.currentdirid) {
            // do not retain selected nodes unless re-rendering the same view
            $.selected = [];
        }

        /**
         * (Re)Init the selectionManager, because the .selectable() is reinitialized and we need to
         * reattach to its events.
         *
         * @type {SelectionManager}
         */
        window.selectionManager = new SelectionManager2_DOM(
            $(container),
            {
                'onSelectedUpdated': (selected_list) => {
                    $.selected = selected_list;
                }
            }
        );
    }
};


/**
 * Update FileManager on new nodes availability
 * @details Former rendernew()
 * @returns {MegaPromise}
 */
// eslint-disable-next-line complexity
FileManager.prototype.updFileManagerUI = promisify(function(resolve) {
    "use strict";

    var treebuild = Object.create(null);
    var UImain = false;
    var UItree = false;
    var newcontact = false;
    var newpath = false;
    var newshare = false;
    var selnode;
    var buildtree = function(n) {
        delay('updFileManagerUI:buildtree:' + n.h, function() {
            M.buildtree(n, M.buildtree.FORCE_REBUILD);
            M.addTreeUIDelayed();
        }, 2600);
    };

    if (d) {
        console.debug('updFileManagerUI for %d nodes.', newnodes.length);
        console.time('rendernew');
    }

    for (var i = newnodes.length; i--;) {
        var newNode = newnodes[i];

        if (newNode.h.length === 11) {
            newcontact = true;
        }
        if (newNode.su) {
            newshare = true;
        }
        if (newNode.p && newNode.t) {
            treebuild[newNode.p] = 1;
        }
        if (newNode.p === this.currentdirid
            || newNode.h === this.currentdirid
            || newNode.p === this.currentCustomView.nodeID
            || newNode.h === this.currentCustomView.nodeID) {

            UImain = true;

            if ($.onRenderNewSelectNode === newNode.h) {
                delete $.onRenderNewSelectNode;
                selnode = newNode.h;
            }
        }
        if (!newpath && document.getElementById('path_' + newNode.h)) {
            newpath = true;
        }
    }

    for (var h in treebuild) {
        var tb = this.d[h];
        if (tb) {
            // If this is out-shares or public-links page, build both cloud-drive tree and it's own
            if (this.currentCustomView) {
                this.buildtree(tb, this.buildtree.FORCE_REBUILD, 'cloud-drive');
                this.buildtree({h: this.currentCustomView.type}, this.buildtree.FORCE_REBUILD);
            }
            else {
                buildtree(tb);
            }
            UItree = true;
        }
    }

    if (d) {
        console.log('rendernew, dir=%s, root=%s, mode=%d', this.currentdirid, this.currentrootid, this.viewmode);
        console.log('rendernew.stat', newcontact, newshare, UImain, newpath);
        console.log('rendernew.tree', Object.keys(treebuild));
    }

    var renderPromise = MegaPromise.resolve();
    if (UImain) {
        if (UItree || this.v.length) {
            var emptyBeforeUpd = !M.v.length;
            this.filterByParent(this.currentCustomView.nodeID || this.currentdirid);
            this.sort();
            this.renderMain(!emptyBeforeUpd);
        }
        else {
            renderPromise = this.openFolder(this.currentdirid, true);
        }

        UImain = this.currentdirid;
    }

    if (this.currentdirid === "recents" && this.recentsRender) {
        this.recentsRender.updateState();
    }

    if (UItree) {
        if (this.currentrootid === 'shares') {
            renderPromise = this.renderTree();
        }
        else if (this.currentCustomView) {
            this.addTreeUIDelayed(90);
        }

        if (this.currentdirid === 'shares' && !this.viewmode) {
            // @TODO deprecate MegaPromise.pipe()!
            renderPromise.pipe(function() {
                return M.openFolder('shares', 1);
            });
        }

        renderPromise.always(function() {
            if (M.nodeRemovalUIRefresh.pending !== M.currentdirid) {
                M.onTreeUIOpen(M.currentdirid);
            }
        });
    }

    renderPromise.always(function() {
        if (newcontact) {
            M.avatars();
            M.contacts();
            M.addTreeUI();

            if (megaChatIsReady) {
                megaChat.renderMyStatus();
            }
        }
        if (newshare) {
            M.buildtree({h: 'shares'}, M.buildtree.FORCE_REBUILD);
        }
        if (newpath) {
            delay('render:path_breadcrumbs', () => M.renderPathBreadcrumbs());
        }

        if (UImain === M.currentdirid) {
            if (selnode) {
                Soon(function() {
                    $.selected = [selnode];
                    reselect(1);
                });
            }

            if (window.selectionManager) {
                // update the total count of nodes
                var tmp = selectionManager.vSelectionBar;
                if (tmp) {
                    var mm = String(tmp.textContent).split('/').map(Number);
                    tmp.textContent = mm[0] + ' / ' + M.v.length;
                }
            }

        }

        if (u_type === 0) {
            // Show "ephemeral session warning"
            topmenuUI();
        }

        delay('dashboard:upd', function() {
            if (M.currentdirid === 'dashboard') {
                dashboardUI();
            }
            else if (UImain === M.currentdirid) {
                delay('rendernew:mediainfo:collect', function() {
                    mBroadcaster.sendMessage('mediainfo:collect');
                    $.tresizer();
                }, 3200);
            }
        }, 2000);

        if (d) {
            console.timeEnd('rendernew');
        }

        resolve();
    });

    newnodes = [];
});

/**
 * Initialize context-menu related user interface
 */
FileManager.prototype.initContextUI = function() {
    "use strict";

    var c = '.dropdown.body.context .dropdown-item';

    $('.dropdown-section').off('mouseover', '.dropdown-item');
    $('.dropdown-section').on('mouseover', '.dropdown-item', function() {
        var $this = $(this),
            pos = $this.offset(),
            menuPos,
            currentId;

        if ($this.hasClass('disabled') && $this.parents('#sm_move').length === 0) {
            return false;
        }

        // Hide opened submenus
        if (!$this.parent().parent().hasClass('submenu')) {
            $('.dropdown-item').removeClass('opened');
            $('.dropdown.body.submenu').removeClass('active');
        }
        else {
            $this.parent().find('.dropdown-item').removeClass('opened');
            $this.parent().find('.submenu').removeClass('active');
        }

        currentId = $this.attr('id');
        if (currentId || $this.hasClass('move-item')) {
            M.buildSubMenu(String(currentId).replace('fi_', ''));
        }

        // Show necessary submenu
        if (!$this.hasClass('opened') && $this.hasClass('contains-submenu')) {
            menuPos = M.reCalcMenuPosition($this, pos.left, pos.top, 'submenu');

            $this.next('.submenu')
                .css({'top': menuPos.top})
                .addClass('active');

            $this.addClass('opened');
        }
    });

    var safeMoveNodes = function() {
        if (!$(this).hasClass('disabled')) {
            $.hideContextMenu();
            M.safeMoveNodes(String($(this).attr('id')).replace('fi_', ''));
        }
        return false;
    };

    $(c + '.cloud-item').rebind('click', safeMoveNodes);

    $('.dropdown.body.files-menu').off('click', '.folder-item');
    $('.dropdown.body.files-menu').on('click', '.folder-item', safeMoveNodes);
    safeMoveNodes = undefined;

    $(c + '.download-item').rebind('click', function() {
        var c = this.className;
        if (c && (c.indexOf('contains-submenu') > -1 || c.indexOf('msync-found') > -1)) {
            M.addDownload($.selected);
        }
    });

    $(c + '.download-standart-item').rebind('click', function() {
        M.addDownload($.selected);
    });

    $(c + '.zipdownload-item').rebind('click', function() {
        M.addDownload($.selected, true);
    });


    $(c + '.syncmegasync-item').rebind('click', function () {
        // check if this is a business expired account
        if (M.isInvalidUserStatus()) {
            return;
        }

        megasync.isInstalled(function (err, is) {
            if (!err || is) {
                if (megasync.currUser === u_handle) {
                    // i know the selection is 1 item [otherwise option in menu wont be visible]
                    megasync.syncFolder($.selected[0]);
                }
            }
                // no need to do anything, something wierd happened, next time
                // the option wont be visible.
        });
        $.hideContextMenu();
    });

    $(c + '.getlink-item, ' + c + '.embedcode-item').rebind('click', this.getLinkAction);

    $(c + '.removelink-item').rebind('click', function() {
        // check if this is a business expired account
        if (M.isInvalidUserStatus()) {
            return;
        }

        if (u_type === 0) {
            ephemeralDialog(l[1005]);
        }
        else {
            var media = false;
            var handles = Array.isArray($.selected) && $.selected.concat();
            var removeLink = function() {
                var exportLink = new mega.Share.ExportLink({'updateUI': true, 'nodesToProcess': handles});
                exportLink.removeExportLink();
            };

            for (var i = handles.length; i--;) {
                if (is_video(M.d[handles[i]]) === 1) {
                    media = true;
                    break;
                }
            }

            if (media) {
                msgDialog('confirmation', l[882], l[17824], 0, function(e) {
                    if (e) {
                        removeLink();
                    }
                });
            }
            else {
                removeLink();
            }
        }
    });

    $(c + '.dispute-item').rebind('click', function() {
        // Find the first takendown node in the list. This is the item we will use to prefill with.
        localStorage.removeItem('takedownDisputeNodeURL');
        for (var i = 0; i < $.selected.length; i++) {
            var node = M.getNodeByHandle($.selected[i]);
            if (node.t & M.IS_TAKENDOWN || M.getNodeShare(node).down === 1) {
                var disputeURL = mega.getPublicNodeExportLink(node);
                if (disputeURL) {
                    localStorage.setItem('takedownDisputeNodeURL', disputeURL);
                }
                break;
            }
        }
        loadSubPage('dispute');
    });

    $(c + '.rename-item').rebind('click', function() {
        // check if this is a business expired account
        if (M.isInvalidUserStatus()) {
            return;
        }
        renameDialog();
    });

    $(c + '.sh4r1ng-item').rebind('click', function() {
        M.openSharingDialog();
    });

    // Move Dialog
    $(c + '.advanced-item, ' + c + '.move-item').rebind('click', openMoveDialog);

    $(c + '.copy-item').rebind('click', openCopyDialog);

    $(c + '.revert-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        loadingDialog.pshow();
        M.revertRubbishNodes($.selected).always(loadingDialog.phide.bind(loadingDialog));
    });

    $(c + '.import-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        ASSERT(folderlink, 'Import needs to be used in folder links.');

        M.importFolderLinkNodes($.selected);
    });

    $(c + '.newfolder-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        createFolderDialog();
    });
    // eslint-disable-next-line local-rules/jquery-scopes
    $(c + '.newfile-item').rebind('click', function() {
        createFileDialog();
    });

    $(c + '.fileupload-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        $('#fileselect3').click();
    });

    $(c + '.folderupload-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        $('#fileselect4').click();
    });

    $(c + '.remove-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        if ($(this).hasClass('disabled')) {
            return false;
        }
        closeDialog();
        fmremove();
    });

    $(c + '.addcontact-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        contactAddDialog();
    });

    $(c + '.startchat-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var $this = $(this);
        var user_handle = $.selected;

        if (user_handle.length === 1) {
            if (!$this.is('.disabled') && user_handle[0]) {
                loadSubPage('fm/chat/p/' + user_handle[0]);
            }
        }
        else {
            megaChat.createAndShowGroupRoomFor(user_handle, "", true, false);
        }
    });

    $(c + '.startaudio-item,' + c + '.startaudiovideo-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var $this = $(this);
        var user_handle = $.selected && $.selected[0];

        if (!$this.is('.disabled') && user_handle) {
            megaChat.createAndShowPrivateRoom(user_handle)
                .then(function(room) {
                    room.setActive();
                    room.startAudioCall();
                });
        }
    });

    $(c + '.startvideo-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var $this = $(this);
        var user_handle = $.selected && $.selected[0];

        if (!$this.is('.disabled') && user_handle) {
            megaChat.createAndShowPrivateRoom(user_handle)
                .then(function(room) {
                    room.setActive();
                    room.startVideoCall();
                });
        }
    });

    $(c + '.view-profile-item').rebind('click', function(e) {
        var $this = $(this);
        var user_handle = $.selected && $.selected[0];

        if (!$this.is('.disabled') && user_handle) {
            loadSubPage('fm/chat/contacts/' + user_handle);
            // there seem to be some duplicated callbacks triggered by menus.js, but since I'm not sure what would the
            // side effects of that can be, I'm stopping propagation here to reduce risk of those causing double
            // loadSubPage calls (which breaks fm/$contact -> fm/chat/contacts/$contact redirects, because it triggers
            // a race in openFolder)
            e.stopPropagation();
        }
    });

    $(c + '.send-files-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var $this = $(this);
        var user_handle = $.selected && $.selected[0];

        if (!$this.is('.disabled') && user_handle) {
            megaChat.openChatAndSendFilesDialog(user_handle);
        }
    });

    $(c + '.share-folder-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var $this = $(this);
        var user_handle = $.selected && $.selected[0];

        if (!$this.is('.disabled') && user_handle) {
            openCopyShareDialog(user_handle);
        }
    });


    $(c + '.removeshare-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        fmremove();
    });

    // Bind Set Nickname context menu button
    $(c + '.set-nickname').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var userHandle = $.selected && $.selected[0];
        userHandle = userHandle.replace('contact_', '');

        $.hideContextMenu();
        nicknames.setNicknameDialog.init(userHandle);
    });

    $(c + '.remove-contact').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        if ($(this).hasClass('disabled')) {
            return;
        }
        var user_handle = $.selected && $.selected[0];

        user_handle =user_handle .replace('contact_', '');
        fmremove(user_handle);
    });

    $(c + '.properties-item').rebind('click', function() {
        propertiesDialog();
    });

    // eslint-disable-next-line local-rules/jquery-scopes
    $(c + '.edit-file-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var nodeHandle = $.selected && $.selected[0];
        if (!nodeHandle) {
            return;
        }

        // Close properties dialog if context menu was triggered there
        if ($.dialog === 'properties') {
            propertiesDialog(true);
        }

        loadingDialog.show('common', l[23130]);

        mega.fileTextEditor.getFile(nodeHandle).done(
            function(data) {
                loadingDialog.hide();
                mega.textEditorUI.setupEditor(M.d[nodeHandle].name, data, nodeHandle);
            }
        ).fail(function() {
            loadingDialog.hide();
        });
    });

    $(c + '.properties-versions').rebind('click', function() {
        fileversioning.fileVersioningDialog();
    });

    $(c + '.clearprevious-versions').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        if ($.selected && $.selected[0]) {
            var fh = $.selected[0];
            msgDialog('remove', l[1003], l[17154], l[1007], function(e) {
                if (e) {
                    fileversioning.clearPreviousVersions(fh);
                }
            });
        }

    });

    $(c + '.findupes-item').rebind('click', M.findDupes);

    $(c + '.add-star-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var newFavState = Number(!M.isFavourite($.selected));

        M.favourite($.selected, newFavState);
    });

    $(c + '.send-to-contact-item').rebind('click', function () {
        openCopyDialog('conversations');
    });

    $('.submenu.labels .dropdown-colour-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var labelId = parseInt(this.dataset.labelId);

        if (labelId && (M.getNodeRights($.selected[0]) > 1)) {
            M.labeling($.selected, labelId);
        }
    });

    $('.colour-sorting-menu .filter-by .dropdown-colour-item').rebind('click', function(e) {
        if (d){
            console.log('label color selected');
        }
        var labelId = parseInt(this.dataset.labelId);
        var parent = $(this).parents('.labels');

        if (labelId && !parent.hasClass("disabled")) {
            // init M.filterLabel[type] if not exist.
            if (!M.currentLabelFilter) {
                M.filterLabel[M.currentLabelType] = Object.create(null);
            }

            M.applyLabelFilter(e);
        }
    });

    $('.filter-block.body .close').rebind('click', function() {
        delete M.filterLabel[M.currentLabelType];
        $('.colour-sorting-menu .dropdown-colour-item').removeClass('active');
        $(this).parent().addClass('hidden')// Hide 'Filter:' DOM elements
            .find('.colour-label-ind').remove();// Remove all colors from it

        $.hideContextMenu();
        M.openFolder(M.currentdirid, true);
    });

    $('.filter-block.rubbish .filter-block.close').rebind('click', function() {
        delete M.filterLabel[M.currentLabelType];
        $('.colour-sorting-menu .dropdown-colour-item').removeClass('active');
        $('.filter-block.rubbish.body')
        .addClass('hidden')// Hide 'Filter:' DOM elements
        .find('.colour-label-ind').remove();// Remove all colors from it

        $.hideContextMenu();
        M.openFolder(M.currentdirid, true);
    });

    $('.submenu.labels .dropdown-colour-item').rebind('mouseover.clrSort', function() {
        var labelTxt = this.dataset.labelTxt;
        if ($(this).hasClass('active')) {
            switch (labelTxt) {
                case "Red":
                    labelTxt = l[19569];
                    break;
                case "Orange":
                    labelTxt = l[19573];
                    break;
                case "Yellow":
                    labelTxt = l[19577];
                    break;
                case "Green":
                    labelTxt = l[19581];
                    break;
                case "Blue":
                    labelTxt = l[19585];
                    break;
                case "Purple":
                    labelTxt = l[19589];
                    break;
                case "Grey":
                    labelTxt = l[19593];
                    break;
            }
        }
        else {
            switch (labelTxt) {
                case "Red":
                    labelTxt = l[19568];
                    break;
                case "Orange":
                    labelTxt = l[19572];
                    break;
                case "Yellow":
                    labelTxt = l[19576];
                    break;
                case "Green":
                    labelTxt = l[19580];
                    break;
                case "Blue":
                    labelTxt = l[19584];
                    break;
                case "Purple":
                    labelTxt = l[19588];
                    break;
                case "Grey":
                    labelTxt = l[19592];
                    break;
            }
        }
        $('.labels .dropdown-color-info').safeHTML(labelTxt).addClass('active');
    });

    $('.colour-sorting-menu .labels .dropdown-colour-item').rebind('mouseover.clrSort', function(e) {
        if (!$(this).parents('.labels').hasClass('disabled')){
            M.updateLabelInfo(e);
        }
    });

    $('.labels .dropdown-colour-item').rebind('mouseout', function() {
        $('.labels .dropdown-color-info').removeClass('active');
    });

    $(c + '.open-item').rebind('click', function() {
        var target = $.selected[0];
        if (M.currentrootid === 'out-shares' || M.currentrootid === 'public-links') {
            target = M.currentrootid + '/' + target;
        }
        $('.js-lpbtn').removeClass('active');
        M.openFolder(target);
    });

    $(c + '.open-cloud-item').rebind('click', function() {
        M.openFolder($.selected[0]);
    });

    $(c + '.preview-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        closeDialog();
        slideshow($.selected[0]);
    });

    $(c + '.play-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        var n = $.selected[0];

        closeDialog();

        $.autoplay = n;
        slideshow(n);
    });

    $(c + '.clearbin-item').rebind('click', function() {
        if (M.isInvalidUserStatus()) {
            return;
        }
        doClearbin(true);
    });

    $(c + '.move-up').rebind('click', function() {
        $('.transfer-table tr.ui-selected')
            .attrs('id')
            .map(function(id) {
                fm_tfsmove(id, -1);
            });
        $('.transfer-table tr.ui-selected').removeClass('ui-selected');
        delay('fm_tfsupdate', fm_tfsupdate);
    });

    $(c + '.move-down').rebind('click', function() {
        $('.transfer-table tr.ui-selected')
            .attrs('id')
            .reverse()
            .map(function(id) {
                fm_tfsmove(id, 1);
            });
        $('.transfer-table tr.ui-selected').removeClass('ui-selected');
        delay('fm_tfsupdate', fm_tfsupdate);
    });

    $(c + '.transfer-play, ' + c + '.transfer-pause').rebind('click', function() {
        var $trs = $('.transfer-table tr.ui-selected');

        if ($(this).hasClass('transfer-play')) {
            if ($trs.filter('.transfer-upload').length && ulmanager.ulOverStorageQuota) {
                ulmanager.ulShowOverStorageQuotaDialog();
                return;
            }

            if (dlmanager.isOverQuota) {
                dlmanager.showOverQuotaDialog();
                return;
            }
        }

        var ids = $trs.attrs('id');

        if ($(this).hasClass('transfer-play')) {
            ids.map(fm_tfsresume);
        }
        else {
            ids.map(fm_tfspause);
        }

        $trs.removeClass('ui-selected');
    });

    $(c + '.canceltransfer-item,' + c + '.transfer-clear').rebind('click', function() {
        var $trs = $('.transfer-table tr.ui-selected');
        var toabort = $trs.attrs('id');
        $trs.remove();
        dlmanager.abort(toabort);
        ulmanager.abort(toabort);
        $.clearTransferPanel();
        fm_tfsupdate();
        mega.tpw.removeRow(toabort);

        onIdle(function() {
            // XXX: better way to stretch the scrollbar?
            $(window).trigger('resize');
        });
        $('.transfer-table tr.ui-selected').removeClass('ui-selected');
    });

    if (localStorage.folderLinkImport) {
        onIdle(M.importFolderLinkNodes.bind(M, false));
    }
};

FileManager.prototype.createFolderUI = function() {
    "use strict";

    var doCreateFolder = function() {
        var $inputWrapper = $('.create-new-folder.popup .fm-dialog-body');
        var $input = $inputWrapper.find('input');
        var name = $input.val();
        var errorMsg = '';

        if (name === '' || !M.isSafeName(name)) {
            errorMsg = l[24708];
        }
        else if (duplicated(name)) { // Check if folder name already exists
            errorMsg = l[23219];
        }

        if (errorMsg !== '') {
            $('.duplicated-input-warning span', $inputWrapper).text(errorMsg);
            $inputWrapper.addClass('duplicate');
            $input.addClass('error');

            setTimeout(function () {
                $inputWrapper.removeClass('duplicate');
                $input.removeClass('error');
                $input.trigger("focus");
            }, 2000);

            return;
        }

        loadingDialog.pshow();
        var currentdirid = M.currentCustomView.nodeID || M.currentdirid;

        M.createFolder(currentdirid, name)
            .then(function(h) {
                if (d) {
                    console.log('Created new folder %s->%s.', currentdirid, h);
                }
                loadingDialog.phide();
            })
            .catch(function(ex) {
                loadingDialog.phide();
                msgDialog('warninga', l[135], l[47], ex < 0 ? api_strerror(ex) : ex);
            });

        return false;
    };

    $('.fm-new-folder').rebind('click', function(e) {

        if (M.isInvalidUserStatus()) {
            return;
        }

        var $me = $(this);
        var $nFolderDialog = $('.create-new-folder', 'body').removeClass('filled-input');

        var $nameInput = $('input', $nFolderDialog).val('');

        if ($me.hasClass('active')) {
            $me.removeClass('active filled-input');
            $nFolderDialog.addClass('hidden');
        }
        else {
            $me.addClass('active');
            $nFolderDialog.removeClass('hidden');
            topPopupAlign(this, '.dropdown.create-new-folder');
            $nameInput.focus();
        }
        $.hideContextMenu();
        return false;
    });

    $('.create-folder-button').rebind('click', doCreateFolder);

    $('.create-folder-button-cancel').rebind('click', function() {
        $('.fm-new-folder').removeClass('active');
        $('.create-new-folder').addClass('hidden');
        $('.create-new-folder').removeClass('filled-input');
        $('.create-new-folder input').val('');
    });

    $('.create-folder-size-icon.full-size').rebind('click', function() {

        var v = $('.create-new-folder input').val();

        if (v !== l[157] && v !== '') {
            $('.create-folder-dialog input').val(v);
        }

        $('.create-new-folder input').trigger("focus");
        $('.create-new-folder').removeClass('filled-input');
        $('.create-new-folder').addClass('hidden');
        $('.fm-new-folder').removeClass('active');
        createFolderDialog(0);
        $('.create-new-folder input').val('');
    });

    $('.create-folder-size-icon.short-size').rebind('click', function() {

        var v = $('.create-folder-dialog input').val();

        if (v !== l[157] && v !== '') {
            $('.create-new-folder input').val(v);
            $('.create-new-folder').addClass('filled-input');
        }

        $('.fm-new-folder').addClass('active');
        $('.create-new-folder').removeClass('hidden');
        topPopupAlign('.link-button.fm-new-folder', '.create-folder-dialog');

        createFolderDialog(1);
        $('.create-folder-dialog input').val('');
        $('.create-new-folder input').trigger("focus");
    });

    $('.create-new-folder input').rebind('keyup.create-new-f', function(e) {
        $('.create-new-folder').addClass('filled-input');
        if ($(this).val() === '') {
            $('.create-new-folder').removeClass('filled-input');
        }
        if (e.which == 13) {
            doCreateFolder();
        }
    });

    $('.create-new-folder input').rebind('focus.create-new-f', function() {
        if ($(this).val() === l[157]) {
            $(this).val('');
        }
        $('.create-new-folder').addClass('focused');
    });

    $('.create-new-folder input').rebind('blur.create-new-f', function() {
        $('.create-new-folder').removeClass('focused');
    });

    $('.fm-new-shared-folder').rebind('click', function() {
        if (u_type === 0) {
            ephemeralDialog(l[997]);
        }
        else {
            openNewSharedFolderDialog();
        }
    });

    $('.fm-new-link').rebind('click', function() {
        if (u_type === 0) {
            ephemeralDialog(l[1005]);
        }
        else {
            M.safeShowDialog('create-new-link', function () {
                M.initFileAndFolderSelectDialog('create-new-link');
            });
        }
    });
};

/**
 * Initialize file and folder select dialog from chat.
 * This will fill up $.selected with what user selected on the dialog.
 * @param {String} type Type of dialog for select default options, e.g. newLink for New public link
 */
FileManager.prototype.initFileAndFolderSelectDialog = function(type, OnSelectCallback) {
    'use strict';
    /* eslint-enable id-length */
    // If chat is not ready.
    if (!megaChatIsReady) {
        if (megaChatIsDisabled) {
            console.error('Mega Chat is disabled, cannot proceed');
        }
        else {
            // Waiting for chat_initialized broadcaster.
            loadingDialog.show();
            mBroadcaster.once('chat_initialized', this.initFileAndFolderSelectDialog.bind(this, type));
        }
        return false;
    }

    loadingDialog.hide();

    // Using existing File selector dialog from chat.
    var dialogPlacer = document.createElement('div');
    var selected = [];
    var constructor;
    var doClose = function(noClearSelected) {
        ReactDOM.unmountComponentAtNode(dialogPlacer);
        constructor.domNode.remove();
        dialogPlacer.remove();
        if (!noClearSelected) {
            selected = [];
        }
        closeDialog();
    };

    var options = {
        'create-new-link': {
            title: l[20667],
            classes: 'no-incoming', // Hide incoming share tab
            selectLabel: l[1523],
            folderSelectable: true, // Can select folder(s)
            onAttach: function() {
                doClose(true);
                $.selected = selected;
                M.getLinkAction();
            }
        },
        'openFile': {
            title: l[22666],
            classes: 'no-incoming', // Hide incoming share tab
            selectLabel: l[865],
            folderSelectNotAllowed: true,
            folderSelectable: false, // Can select folder(s)
            customFilterFn: function(node) {
                if (node.t) {
                    return true;
                }
                if (node.s >= 20971520) {
                    return false;
                }

                if (is_text(node)) {
                    return true;
                }
                return false;
            },
            onAttach: function() {
                doClose(true);
                $.selected = selected;
                if (OnSelectCallback) {
                    OnSelectCallback(selected);
                }
            }
        }
    };

    var prop = {
        title: options[type].title,
        folderSelectable: options[type].folderSelectable,
        selectLabel: options[type].selectLabel,
        className: options[type].classes,
        onClose: function() {
            doClose();
        },
        onSelected: function(node) {
            selected = node;
        },
        onAttachClicked: options[type].onAttach,
    };
    if (options[type].folderSelectNotAllowed) {
        prop.folderSelectNotAllowed = options[type].folderSelectNotAllowed;
    }
    if (options[type].customFilterFn) {
        prop.customFilterFn = options[type].customFilterFn;
    }

    var dialog = React.createElement(CloudBrowserModalDialogUI.CloudBrowserDialog, prop);

    constructor = ReactDOM.render(dialog, dialogPlacer);
};

FileManager.prototype.initNewChatlinkDialog = function() {
    'use strict';

    // If chat is not ready.
    if (!megaChatIsReady) {
        if (megaChatIsDisabled) {
            console.error('Mega Chat is disabled, cannot proceed');
        }
        else {
            // Waiting for chat_initialized broadcaster.
            loadingDialog.show();
            mBroadcaster.once('chat_initialized', this.initNewChatlinkDialog.bind(this));
        }
        return false;
    }

    loadingDialog.hide();

    var dialogPlacer = document.createElement('div');

    var dialog = React.createElement(StartGroupChatDialogUI.StartGroupChatWizard, {
        name: "start-group-chat",
        flowType: 2,
        onClose: function() {
            ReactDOM.unmountComponentAtNode(dialogPlacer);
            dialogPlacer.remove();
            closeDialog();
        }
    });

    ReactDOM.render(dialog, dialogPlacer);
};

FileManager.prototype.initUIKeyEvents = function() {
    "use strict";

    $(window).rebind('keydown.uikeyevents', function(e) {
        if (M.chat && !$.dialog) {
            return true;
        }

        if (e.keyCode == 9 && !$(e.target).is("input,textarea,select")) {
            return false;
        }
        if ($(e.target).filter("input,textarea,select").is(":focus")) {
            // when the user is typing in the "New folder dialog", if the current viewMode is grid/icons view, then
            // left/right navigation in the input field may cause the selection manager to trigger selection changes.
            // Note: I expected that the dialog would set $.dialog, but it doesn't.
            if (e.keyCode !== 27) {
                return true;
            }
        }

        var is_transfers_or_accounts = (
            M.currentdirid && (M.currentdirid.substr(0, 7) === 'account' || M.currentdirid === 'transfers')
        );

        // selection manager may not be available on empty folders.
        var is_selection_manager_available = !!window.selectionManager;

        var sl = false;
        var s = [];

        var selPanel = $('.fm-transfers-block tr.ui-selected');

        if (selectionManager && selectionManager.selected_list && selectionManager.selected_list.length > 0) {
            s = clone(selectionManager.selected_list);
        }
        else {
            var tempSel;

            if (M.viewmode) {
                tempSel = $('.data-block-view.ui-selected');
            }
            else {
                tempSel = $('.grid-table tr.ui-selected');
            }

            s = tempSel.attrs('id');
        }


        if (!is_fm() && page !== 'login' && page.substr(0, 3) !== 'pro') {
            return true;
        }

        /**
         * Because of te .unbind, this can only be here... it would be better if its moved to iconUI(), but maybe some
         * other day :)
         */
        if (
            is_selection_manager_available &&
            !is_transfers_or_accounts &&
            !$.dialog &&
            !slideshowid &&
            M.viewmode == 1
        ) {
            if (e.keyCode == 37) {
                // left
                selectionManager.select_prev(e.shiftKey, true);
            }
            else if (e.keyCode == 39) {
                // right
                selectionManager.select_next(e.shiftKey, true);
            }

            // up & down
            else if (e.keyCode == 38 || e.keyCode == 40) {
                if (e.keyCode === 38) {
                    selectionManager.select_grid_up(e.shiftKey, true);
                }
                else {
                    selectionManager.select_grid_down(e.shiftKey, true);
                }

            }
        }

        if (
            is_selection_manager_available &&
            !is_transfers_or_accounts &&
            e.keyCode == 38 &&
            String($.selectddUIgrid).indexOf('.grid-scrolling-table') > -1 &&
            !$.dialog
        ) {
            // up in grid/table
            selectionManager.select_prev(e.shiftKey, true);
            quickFinder.disable_if_active();
        }
        else if (
            is_selection_manager_available &&
            !is_transfers_or_accounts &&
            e.keyCode == 40 &&
            String($.selectddUIgrid).indexOf('.grid-scrolling-table') > -1 &&
            !$.dialog
        ) {
            // down in grid/table
            selectionManager.select_next(e.shiftKey, true);
            quickFinder.disable_if_active();
        }
        else if (
            !is_transfers_or_accounts &&
            e.keyCode == 46 &&
            s.length > 0 &&
            !$.dialog &&
            (M.getNodeRights(M.currentdirid) > 1 || M.currentCustomView)
        ) {
            // delete
            fmremove(s);
        }
        else if ((e.keyCode === 46) && (selPanel.length > 0)
            && !$.dialog && M.getNodeRights(M.currentdirid) > 1) {
            msgDialog('confirmation', l[1003], l[17092].replace('%1', s.length), false, function(e) {

                // we should encapsule the click handler
                // to call a function rather than use this hacking
                if (e) {
                    $('.transfer-clear').trigger('click');
                }
            });
        }
        else if (
            !is_transfers_or_accounts &&
            e.keyCode == 13
            && s.length > 0
            && !$.dialog
            && !$.msgDialog
            && !$('.fm-new-folder').hasClass('active')
            && !$('.top-search-bl').hasClass('active')
        ) {
            $.selected = s;

            if ($.selected && $.selected.length > 0) {
                var n = M.d[$.selected[0]];
                if (n && n.t) {
                    M.openFolder(n.h);
                }
                else if ($.selected.length < 2 && (is_image2(n) || is_video(n))) {
                    slideshow($.selected[0]);
                }
                else {
                    M.addDownload($.selected);
                }
            }
        }
        else if ((e.keyCode === 13) && ($.dialog === 'share')) {
            addNewContact($('.add-user-popup-button'), false).done(function() {
                var share = new mega.Share();
                share.updateNodeShares();
                $('.token-input-token-mega').remove();
            });
        }
        else if ((e.keyCode === 13) && ($.dialog === 'add-contact-popup')) {
            addNewContact($('.add-user-popup-button'));
        }
        else if ((e.keyCode === 13) && ($.dialog === 'rename')) {
            $('.rename-dialog-button.rename').trigger('click');
        }

        // If the Esc key is pressed while the payment address dialog is visible, close it
        else if ((e.keyCode === 27) && !$('.payment-address-dialog').hasClass('hidden')) {
            addressDialog.closeDialog();
        }
        else if (e.keyCode === 27 && ($.copyDialog || $.moveDialog || $.selectFolderDialog
            || $.copyrightsDialog || $.saveAsDialog)) {
            closeDialog();
        }
        else if (e.keyCode == 27 && $.topMenu) {
            topMenu(1);
        }
        else if (e.keyCode == 27 && $.dialog) {
            if ($.dialog === 'share-add' || $.dialog === 'share') {
                return false;
            }
            closeDialog();
        }
        else if (e.keyCode == 27 && $('.default-select.active').length) {
            var $selectBlock = $('.default-select.active');
            $selectBlock.find('.default-select-dropdown').fadeOut(200);
            $selectBlock.removeClass('active');
        }
        else if (e.keyCode == 27 && $.msgDialog) {
            closeMsg();
            if ($.warningCallback) {
                $.warningCallback(false);
                $.warningCallback = null;
            }
        }
        else if (e.keyCode === 13 && ($.msgDialog === 'confirmation' || $.msgDialog === 'remove')) {
            closeMsg();
            if ($.warningCallback) {
                $.warningCallback(true);
                $.warningCallback = null;
            }
        }
        else if (
            !is_transfers_or_accounts &&
            (e.keyCode === 113 /* F2 */) &&
            (s.length > 0) &&
            !$.dialog && M.getNodeRights(M.d[s[0]] && M.d[s[0]].h) > 1
        ) {
            renameDialog();
        }
        else if (
            is_selection_manager_available &&
            e.keyCode == 65 &&
            e.ctrlKey &&
            !$.dialog
        ) {
            if (is_transfers_or_accounts) {
                return;
            }
            // ctrl+a/cmd+a - select all
            selectionManager.select_all();
        }
        else if (e.keyCode == 27) {
            if ($.hideTopMenu) {
                $.hideTopMenu();
            }
            if ($.hideContextMenu) {
                $.hideContextMenu();
            }
        }

        if (sl && String($.selectddUIgrid).indexOf('.grid-scrolling-table') > -1) {
            // if something is selected, scroll to that item
            var jsp = $($.selectddUIgrid).data('jsp');
            if (jsp) {
                jsp.scrollToElement(sl);
            }
            else if (M.megaRender && M.megaRender.megaList && M.megaRender.megaList._wasRendered) {
                M.megaRender.megaList.scrollToItem(sl.data('id'));
            }
        }

        delay('render:search_breadcrumbs', () => M.renderSearchBreadcrumbs());
    });
};

FileManager.prototype.addTransferPanelUI = function() {
    "use strict";

    var transferPanelContextMenu = function(target) {
        var file;
        var tclear;

        $('.dropdown.body.files-menu .dropdown-item').hide();
        var $menuitems = $('.dropdown.body.files-menu .dropdown-item');

        $menuitems.filter('.transfer-pause,.transfer-play,.move-up,.move-down,.transfer-clear').show();

        tclear = $menuitems.filter('.transfer-clear').contents('span').get(0) || {};
        tclear.textContent = l[103];

        if (target === null && (target = $('.transfer-table tr.ui-selected')).length > 1) {
            var ids = target.attrs('id');
            var finished = 0;
            var paused = 0;
            var started = false;

            ids.forEach(function(id) {
                file = GlobalProgress[id];
                if (!file) {
                    finished++;
                }
                else {
                    if (file.paused) {
                        paused++;
                    }
                    if (file.started) {
                        started = true;
                    }
                }
            });

            if (finished === ids.length) {
                $menuitems.hide()
                    .filter('.transfer-clear').show();
                tclear.textContent = l[7218];
            }
            else {
                if (started) {
                    $menuitems.filter('.move-up,.move-down').hide();
                }
                if (paused === ids.length) {
                    $menuitems.filter('.transfer-pause').hide();
                }

                var prev = target.first().prev();
                var next = target.last().next();

                if (prev.length === 0 || !prev.hasClass('transfer-queued')) {
                    $menuitems.filter('.move-up').hide();
                }
                if (next.length === 0) {
                    $menuitems.filter('.move-down').hide();
                }
            }
        }
        else if (!(file = GlobalProgress[$(target).attr('id')])) {
            /* no file, it is a finished operation */
            $menuitems.hide()
                .filter('.transfer-clear')
                .show();
            tclear.textContent = l[7218];
        }
        else {
            if (file.started) {
                $menuitems.filter('.move-up,.move-down').hide();
            }
            if (file.paused) {
                $menuitems.filter('.transfer-pause').hide();
            }
            else {
                $menuitems.filter('.transfer-play').hide();
            }

            if (!target.prev().length || !target.prev().hasClass('transfer-queued')) {
                $menuitems.filter('.move-up').hide();
            }
            if (target.next().length === 0) {
                $menuitems.filter('.move-down').hide();
            }
        }

        // XXX: Hide context-menu's menu-up/down items for now to check if that's the
        // origin of some problems, users can still use the new d&d logic to move transfers
        $menuitems.filter('.move-up,.move-down').hide();

        var parent = $menuitems.parent();
        parent
            .children('hr').addClass('hidden').end()
            .children('hr.pause').removeClass('hidden').end();

        if (parent.height() < 56) {
            parent.find('hr.pause').addClass('hidden');
        }
    };


    $.transferHeader = function(tfse) {
        tfse = tfse || M.getTransferElements();
        var domTableEmptyTxt = tfse.domTableEmptyTxt;
        var domTableHeader = tfse.domTableHeader;
        var domScrollingTable = tfse.domScrollingTable;
        var domTable = tfse.domTable;
        tfse = undefined;

        // Show/Hide header if there is no items in transfer list
        if (domTable.querySelector('tr')) {
            domTableEmptyTxt.classList.add('hidden');
            domScrollingTable.style.display = '';
            domTableHeader.style.display = '';
        }
        else {
            domTableEmptyTxt.classList.remove('hidden');
            domScrollingTable.style.display = 'none';
            domTableHeader.style.display = 'none';
        }

        $(domScrollingTable).rebind('click.tst contextmenu.tst', function(e) {
            if (!$(e.target).closest('.transfer-table').length) {
                $('.ui-selected', domTable).removeClass('ui-selected');
            }
        });

        var $tmp = $('.grid-url-arrow, .clear-transfer-icon, .link-transfer-status', domTable);
        $tmp.rebind('click', function(e) {
            var target = $(this).closest('tr');
            e.preventDefault();
            e.stopPropagation(); // do not treat it as a regular click on the file
            $('tr', domTable).removeClass('ui-selected');

            if ($(this).hasClass('link-transfer-status')) {

                var $trs = $(this).closest('tr');

                if ($(this).hasClass('transfer-play')) {
                    if ($trs.filter('.transfer-upload').length && ulmanager.ulOverStorageQuota) {
                        ulmanager.ulShowOverStorageQuotaDialog();
                        return;
                    }

                    if (dlmanager.isOverQuota) {
                        dlmanager.showOverQuotaDialog();
                        return;
                    }
                }

                var ids = $trs.attrs('id');

                if ($(this).hasClass('transfer-play')) {
                    ids.map(fm_tfsresume);
                }
                else {
                    ids.map(fm_tfspause);
                }
            }
            else {
                if (!target.hasClass('.transfer-completed')) {
                    var toabort = target.attr('id');
                    dlmanager.abort(toabort);
                    ulmanager.abort(toabort);
                }
                target.fadeOut(function() {
                    $(this).remove();
                    mega.tpw.removeRow(target.attr('id'));
                    $.clearTransferPanel();
                    fm_tfsupdate();
                    $.tresizer();
                });
            }

            return false;
        });

        $tmp = $('tr', domTable);
        $tmp.rebind('dblclick', function() {
            if ($(this).hasClass('transfer-completed')) {
                var id = String($(this).attr('id'));
                if (id[0] === 'd') {
                    id = id.split('_').pop();
                }
                else if (id[0] === 'u') {
                    id = String(ulmanager.ulIDToNode[id]);
                }
                var path = M.getPath(id);
                if (path.length > 1) {
                    M.openFolder(path[1], true)
                        .always(function() {
                            $.selected = [id];
                            reselect(1);
                        });
                }
            }
            return false;
        });

        $tmp.rebind('click contextmenu', function(e) {
            if (e.type === 'contextmenu') {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    $('.ui-selected', domTable).removeClass('ui-selected');
                }
                $(this).addClass('ui-selected dragover');
                transferPanelContextMenu(null);
                return !!M.contextMenuUI(e);
            }
            else {
                var domNode = domTable.querySelector('tr');
                if (e.shiftKey && domNode) {
                    var start = domNode;
                    var end = this;
                    if ($.TgridLastSelected && $($.TgridLastSelected).hasClass('ui-selected')) {
                        start = $.TgridLastSelected;
                    }
                    if ($(start).index() > $(end).index()) {
                        end = start;
                        start = this;
                    }
                    $('.ui-selected', domTable).removeClass('ui-selected');
                    $([start, end]).addClass('ui-selected');
                    $(start).nextUntil($(end)).each(function(i, e) {
                        $(e).addClass('ui-selected');
                    });
                }
                else if (!e.ctrlKey && !e.metaKey) {
                    $('.ui-selected', domTable).removeClass('ui-selected');
                    $(this).addClass('ui-selected');
                    $.TgridLastSelected = this;
                }
                else {
                    if ($(this).hasClass("ui-selected")) {
                        $(this).removeClass("ui-selected");
                    }
                    else {
                        $(this).addClass("ui-selected");
                        $.TgridLastSelected = this;
                    }
                }
            }

            return false;
        });
        $tmp = undefined;

        // initTransferScroll(domScrollingTable);
        delay('tfs-ps-update', function() {
            // XXX: This update will fire ps-y-reach-end, set a flag to ignore it...

            $.isTfsPsUpdate = true;
            Ps.update(domScrollingTable);

            onIdle(function() {
                $.isTfsPsUpdate = false;
            });
        });
    };

    $.transferClose = function() {
        $('.nw-fm-left-icon.transfers').removeClass('active');
        $('#fmholder').removeClass('transfer-panel-opened');
    };

    $.transferOpen = function(force) {
        if (force || !$('.nw-fm-left-icon.transfers').hasClass('active')) {
            $('.nw-fm-left-icon').removeClass('active');
            $('.nw-fm-left-icon.transfers').addClass('active');
            $('#fmholder').addClass('transfer-panel-opened');
            var domScrollingTable = M.getTransferElements().domScrollingTable;
            if (!domScrollingTable.classList.contains('ps-container')) {
                Ps.initialize(domScrollingTable, {suppressScrollX: true});
            }
            fm_tfsupdate(); // this will call $.transferHeader();
        }
    };

    $.clearTransferPanel = function() {
        var obj = M.getTransferElements();
        if (obj.domTable && !obj.domTable.querySelector('tr')) {
            $('.transfer-clear-all-icon').addClass('disabled');
            $('.transfer-pause-icon').addClass('disabled');
            $('.transfer-clear-completed').addClass('disabled');
            obj.domTableHeader.style.display = 'hidden';
            obj.domTableEmptyTxt.classList.remove('hidden');
            obj.domUploadBlock.classList.add('hidden');
            obj.domDownloadBlock.classList.add('hidden');
            $('.nw-fm-left-icon.transfers').removeClass('transfering').find('p').removeAttr('style');
            if (M.currentdirid === 'transfers') {
                fm_tfsupdate();
                $.tresizer();
            }
        }
    };

    $.removeTransferItems = function($trs) {
        var type = null;
        if (!$trs) {
            $trs = $('.transfer-table tr.transfer-completed');
            type = mega.tpw.DONE;
        }
        var $len = $trs.length;
        if ($len && $len < 100) {
            $trs.fadeOut(function() {
                $(this).remove();
                if (!--$len) {
                    $.clearTransferPanel();
                }
            });
        }
        else {
            $trs.remove();
            Soon($.clearTransferPanel);
        }
        mega.tpw.clearRows(type);
    };

    $('.transfer-clear-all-icon').rebind('click', function() {
        if (!$(this).hasClass('disabled')) {
            msgDialog('confirmation', 'clear all transfers', l[7225], '', function(e) {
                if (!e) {
                    return;
                }

                const time = (tag, cb) => {
                    if (d) {
                        console.time(tag);
                    }
                    cb();

                    if (d) {
                        console.timeEnd(tag);
                    }
                };

                uldl_hold = true;
                time('dlm:abort', () => dlmanager.abort(null));
                time('ulm:abort', () => ulmanager.abort(null));
                time('tfs:abort', () => $.removeTransferItems($('.transfer-table tr')));

                later(function() {
                    if (uldl_hold) {
                        uldl_hold = false;
                        ulQueue.resume();
                        dlQueue.resume();
                        let $icon = $('.transfer-pause-icon').removeClass('active');
                        $('span', $icon).text(l[6993]);
                        $('i', $icon).removeClass('icon-play-small').addClass('icon-pause');
                    }
                });
            });
        }
    });

    $('.transfer-clear-completed').rebind('click', function() {
        if (!$(this).hasClass('disabled')) {
            $.removeTransferItems();
        }
    });

    $('.transfer-pause-icon').rebind('click', function() {

        if ($(this).hasClass('active')) {
            if (dlmanager.isOverQuota) {
                return dlmanager.showOverQuotaDialog();
            }

            if (ulmanager.ulOverStorageQuota) {
                ulmanager.ulShowOverStorageQuotaDialog();
                return false;
            }
        }

        if (!$(this).hasClass('disabled')) {

            let $elm;

            if ($(this).hasClass('active')) {
                // terms of service
                if (u_type || folderlink || Object(u_attr).terms) {
                    [dlQueue, ulQueue].forEach(function(queue) {
                        Object.keys(queue._qpaused).map(fm_tfsresume);
                    });
                    uldl_hold = false;
                    ulQueue.resume();
                    dlQueue.resume();

                    $(this).removeClass('active').find('span').text(l[6993]);
                    $('i', this).addClass('icon-pause').removeClass('icon-play-small');

                    $elm = $('.transfer-table-wrapper tr').removeClass('transfer-paused');
                    $elm = $('.link-transfer-status', $elm).removeClass('transfer-play').addClass('transfer-pause');
                    $('i', $elm).removeClass('icon-play-small').addClass('icon-pause');
                    $('.nw-fm-left-icon').removeClass('paused');
                }
                else {
                    alert(l[214]);
                    if (d) {
                        console.debug(l[214]);
                    }
                }
            }
            else {
                var $trs = $('.transfer-table tr:not(.transfer-completed)');

                $trs.attrs('id')
                    .concat(Object.keys(M.tfsdomqueue))
                    .map(fm_tfspause);

                dlQueue.pause();
                ulQueue.pause();
                uldl_hold = true;

                $(this).addClass('active').find('span').text(l[7101]);
                $('i', this).removeClass('icon-pause').addClass('icon-play-small');

                $trs.addClass('transfer-paused');
                $elm = $('.link-transfer-status', $trs).removeClass('transfer-pause').addClass('transfer-play');
                $('i', $elm).removeClass('icon-pause').addClass('icon-play-small');
                $('.nw-fm-left-icon').addClass('paused');
            }
        }
    });
};

/**
 * Depending the viewmode this fires either addIconUI or addGridUI, plus addTreeUI
 * @param {Boolean} aNoTreeUpdate Omit the call to addTreeUI
 */
FileManager.prototype.addViewUI = function(aNoTreeUpdate, refresh) {
    if (this.viewmode) {
        this.addIconUI(undefined, refresh);
    }
    else {
        this.addGridUI(refresh);
    }

    if (!aNoTreeUpdate) {
        this.addTreeUI();
    }
};

FileManager.prototype.addIconUI = function(aQuiet, refresh) {
    "use strict";
    if (d) {
        console.time('iconUI');
    }

    // Change title for Public link page
    if (page === 'fm/public-links') {
        $('.files-menu.context .dropdown-item.sort-timeAd span').safeHTML(l[20694]);
    }
    else {
        $('.files-menu.context .dropdown-item.sort-timeAd span').safeHTML(l[17445]);
    }

    $('.fm-files-view-icon.block-view').addClass('active');
    $('.fm-files-view-icon.listing-view').removeClass('active');
    $('.shared-grid-view').addClass('hidden');
    $('.out-shared-grid-view').addClass('hidden');
    $('.files-grid-view.fm').addClass('hidden');
    $('.fm-blocks-view.fm').addClass('hidden');
    $('.fm-blocks-view.contacts-view').addClass('hidden');
    $('.files-grid-view.contacts-view').addClass('hidden');
    $('.contacts-details-block').addClass('hidden');
    $('.files-grid-view.contact-details-view').addClass('hidden');
    $('.fm-blocks-view.contact-details-view').addClass('hidden');

    if (this.currentdirid === 'contacts') {
        $('.fm-blocks-view.contacts-view').removeClass('hidden');
        initContactsBlocksScrolling();
    }
    else if (this.currentdirid === 'shares') {
        $('.shared-blocks-view').removeClass('hidden');
        initShareBlocksScrolling();
    }
    else if (this.currentdirid === 'out-shares') {
        $('.out-shared-blocks-view').removeClass('hidden');
        initOutShareBlocksScrolling();
    }
    else if (String(this.currentdirid).length === 11 && this.currentrootid === 'contacts') {
        $('.contacts-details-block').removeClass('hidden');
        if (this.v.length > 0) {
            $('.fm-blocks-view.contact-details-view').removeClass('hidden');
            initFileblocksScrolling2();
        }
    }
    else if (this.currentdirid !== 'user-management' &&
        (this.currentdirid === this.InboxID || this.getNodeRoot(this.currentdirid) === this.InboxID)) {
        if (this.v.length > 0) {
            $('.fm-blocks-view.fm').removeClass('hidden');
            initFileblocksScrolling();
        }
    }
    else if (this.currentrootid === 'shares' && !this.v.length) {
        const viewModeClass = (M.viewmode ? '.fm-blocks-view' : '.files-grid-view') + '.fm.shared-folder-content';

        if (M.viewmode) {
            $(viewModeClass).removeClass('hidden');
        }
        else {
            $('.grid-table-header-container-sc', viewModeClass).addClass('hidden');
            $(viewModeClass).removeClass('hidden');
        }
    }
    // user management ui update is handled in Business Account classes.
    else if (this.v.length && this.currentdirid.substr(0, 15) !== 'user-management') {
        $('.fm-blocks-view.fm').removeClass('hidden');
        if (this.currentCustomView) {
            $('.fm-blocks-view.fm').addClass(this.currentCustomView.type + '-view');
        }
        else {
            $('.fm-blocks-view.fm').removeClass('out-shares-view public-links-view');
        }
        if (!aQuiet) {
            initFileblocksScrolling();
        }
    }

    $('.fm-blocks-view, .fm-empty-cloud, .fm-empty-folder,.shared-blocks-view, .out-shared-blocks-view')
        .rebind('contextmenu.fm', function(e) {
            if (page === "fm/links") { // Remove context menu option from filtered view
                return false;
            }
            $(this).find('.data-block-view').removeClass('ui-selected');
            // is this required? don't we have a support for a multi-selection context menu?
            if (selectionManager) {
                selectionManager.clear_selection();
            }
            $.selected = [];
            $.hideTopMenu();
            return !!M.contextMenuUI(e, 2);
        });

    $('.files-menu.context .submenu.sorting .dropdown-item.sort-grid-item').rebind('click', function(e) {
        var sortType;
        var $me = $(this);

        if ($me.hasClass('sort-size')) {
            sortType = 'size';
        }
        else if ($me.hasClass('sort-name')) {
            sortType = 'name';
        }
        else if ($me.hasClass('sort-label')) {
            sortType = 'label';
        }
        else if ($me.hasClass('sort-type')) {
            sortType = 'type';
        }
        else if ($me.hasClass('sort-timeAd')) {
            sortType = 'ts';
        }
        else if ($me.hasClass('sort-timeMd')) {
            sortType = 'mtime';
        }
        else if ($me.hasClass('sort-fav')) {
            sortType = 'fav';
        }
        else if ($me.hasClass('sort-owner')) {
            sortType = 'owner';
        }
        else if ($me.hasClass('sort-access')) {
            sortType = 'access';
        }
        else if ($me.hasClass('sort-sharedwith')) {
            sortType = 'sharedwith';
        }
        else if ($me.hasClass('sort-sharecreated')) {
            sortType = 'date';
        }

        var classToAdd = 'selected';
        var iconClassToAdd = 'icon-up';
        var sortDir = 1;

        if ($me.hasClass('selected') && !$me.hasClass('inverted') ) {
            classToAdd += ' inverted';
            iconClassToAdd = 'icon-down';
            sortDir = -1;
        }

        $('.files-menu.context .submenu.sorting .dropdown-item.sort-grid-item').removeClass('selected inverted');
        $('i.sprite-fm-mono', $me).removeClass('icon-up icon-down').addClass(iconClassToAdd);
        $me.addClass(classToAdd);

        M.doSort(sortType, sortDir);
        M.renderMain();
    });

    if (this.currentdirid === 'contacts') {
        $.selectddUIgrid = '.contacts-blocks-scrolling';
        $.selectddUIitem = 'a';
    }
    else if (this.currentdirid === 'shares') {
        $.selectddUIgrid = '.shared-blocks-scrolling';
        $.selectddUIitem = 'a';
    }
    else if (this.currentdirid === 'out-shares') {
        $.selectddUIgrid = '.out-shared-blocks-scrolling';
        $.selectddUIitem = 'a';
    }
    else if (String(this.currentdirid).length === 11 && this.currentrootid === 'contacts') {
        $.selectddUIgrid = '.contact-details-view .file-block-scrolling';
        $.selectddUIitem = 'a';
    }
    else {
        $.selectddUIgrid = '.file-block-scrolling';
        $.selectddUIitem = 'a';
    }
    this.addSelectDragDropUI(refresh);
    if (d) {
        console.timeEnd('iconUI');
    }

};

FileManager.prototype.addGridUI = function(refresh) {
    "use strict";

    if (this.chat) {
        return;
    }
    if (d) {
        console.time('gridUI');
    }

    // Change title for Public link page
    if (page === 'fm/public-links') {
        $('.fm .grid-table-header .ts').text(l[20694]);
        $('.fm .grid-table-header .date').text(l[20694]);
        $('.dropdown.body.files-menu .dropdown-item.visible-col-select[megatype="timeAd"] span').text(l[20694]);
    }
    else {
        $('.fm .grid-table-header .ts').text(l[17445]);
        $('.fm .grid-table-header .date').text(l[17445]);
        $('.dropdown.body.files-menu .dropdown-item.visible-col-select[megatype="timeAd"] span').text(l[17445]);
    }

    // $.gridDragging=false;
    $.gridLastSelected = false;
    $('.fm-files-view-icon.listing-view').addClass('active');
    $('.fm-files-view-icon.block-view').removeClass('active');

    $.gridHeader = function() {
        if (folderlink) {
            M.columnsWidth.cloud.versions.viewed = false;
            M.columnsWidth.cloud.versions.disabled = true;
            M.columnsWidth.cloud.fav.viewed = false;
            M.columnsWidth.cloud.fav.disabled = true;
            M.columnsWidth.cloud.label.viewed = false;
            M.columnsWidth.cloud.label.disabled = true;
        }
        else {
            if (M.columnsWidth.cloud.fav.disabled) {
                // came from folder-link
                M.columnsWidth.cloud.fav.viewed = true;
            }
            M.columnsWidth.cloud.versions.disabled = false;
            M.columnsWidth.cloud.fav.disabled = false;
            M.columnsWidth.cloud.label.disabled = false;

            // if we have FM configuration
            var storedColumnsPreferences = mega.config.get('fmColPrefs');
            if (storedColumnsPreferences !== undefined) {
                var prefs = getFMColPrefs(storedColumnsPreferences);
                for (var colPref in prefs) {
                    if (Object.prototype.hasOwnProperty.call(prefs, colPref)) {
                        M.columnsWidth.cloud[colPref].viewed =
                            prefs[colPref] > 0;
                    }
                }
            }
        }

        if (M && M.columnsWidth && M.columnsWidth.cloud) {

            // fname is special since it might be dynamic width
            var $fnameCol = $('.files-grid-view.fm .grid-table.fm td[megatype="fname"]').first();

            // check if it's still dynamic
            var colStyle = $fnameCol.attr('style');
            if (colStyle && colStyle.indexOf('calc(100% -') !== -1) {
                M.columnsWidth.cloud['fname'].max = Math.max($fnameCol.outerWidth(), 5000);
            }

            for (var col in M.columnsWidth.cloud) {
                var $header = $('.files-grid-view.fm .grid-table-header th[megatype="' + col + '"]');
                if (!$header) {
                    continue;
                }

                if (M.columnsWidth.cloud[col]) {
                    if (M.columnsWidth.cloud[col].curr) {
                        if (typeof M.columnsWidth.cloud[col].curr === 'number') {
                            if (M.columnsWidth.cloud[col].curr !== $header.outerWidth()) {
                                $header.outerWidth(M.columnsWidth.cloud[col].curr);
                            }
                        }
                        else {
                            $header.outerWidth(M.columnsWidth.cloud[col].curr);
                            M.columnsWidth.cloud[col].currpx = $header.outerWidth();
                            if ($header.outerWidth() < M.columnsWidth.cloud[col].min) {
                                $header.outerWidth(M.columnsWidth.cloud[col].min);
                            }
                        }
                    }

                    if (!M.columnsWidth.cloud[col].viewed && $header.is(':visible')) {
                        $header.hide();
                        $('.grid-table.fm td[megatype="' + col + '"]').hide();
                    }
                    else if (M.columnsWidth.cloud[col].viewed && !$header.is(':visible')) {
                        $header.show();
                        $('.grid-table.fm td[megatype="' + col + '"]').show();
                    }
                }
            }
            if (M.megaRender && M.megaRender.megaList) {
                if (!M.megaRender.megaList._scrollIsInitialized) {
                    M.megaRender.megaList.resized();
                }
                else {
                    M.megaRender.megaList.scrollUpdate();
                }
            }
        }
    };


    $.detailsGridHeader = function() {
        $('.contact-details-view .grid-table tr:first-child td').each(function(i, e) {
            var headerColumn = $('.contact-details-view .grid-table-header th').get(i);
            $(headerColumn).width($(e).width());
        });
    };

    $.contactGridHeader = function() {
        $('.files-grid-view.contacts-view .grid-scrolling-table tr:first-child td').each(function(i, e) {
            var headerColumn = $('.files-grid-view.contacts-view .grid-table-header th').get(i);
            $(headerColumn).width($(e).width());
        });
    };

    $.opcGridHeader = function() {
        $('.sent-requests-grid .grid-scrolling-table tr:first-child td').each(function(i, e) {
            var headerColumn = $('.sent-requests-grid .grid-table-header th').get(i);
            $(headerColumn).width($(e).width());
        });
    };

    $.ipcGridHeader = function() {
        $('.contact-requests-grid .grid-scrolling-table tr:first-child td').each(function(i, e) {
            var headerColumn = $('.contact-requests-grid .grid-table-header th').get(i);
            $(headerColumn).width($(e).width());
        });
    };

    $.sharedGridHeader = function() {
        $('.shared-grid-view .grid-scrolling-table tr:first-child td').each(function(i, e) {
            var headerColumn = $('.shared-grid-view .grid-table-header th').get(i);
            $(headerColumn).width($(e).width());
        });
    };

    $.outSharedGridHeader = function() {
        $('.out-shared-grid-view .grid-scrolling-table tr:first-child td').each(function(i, e) {
            var headerColumn = $('.out-shared-grid-view .grid-table-header th').get(i);
            $(headerColumn).width($(e).width());
        });
    };

    $('.fm-blocks-view.fm').addClass('hidden');
    $('.fm-chat-block').addClass('hidden');
    $('.shared-blocks-view').addClass('hidden');
    $('.shared-grid-view').addClass('hidden');
    $('.out-shared-blocks-view').addClass('hidden');
    $('.out-shared-grid-view').addClass('hidden');
    $('.files-grid-view.fm').addClass('hidden');
    $('.fm-blocks-view.contacts-view').addClass('hidden');
    $('.files-grid-view.contacts-view').addClass('hidden');
    $('.contacts-details-block').addClass('hidden');
    $('.files-grid-view.contact-details-view').addClass('hidden');
    $('.fm-blocks-view.contact-details-view').addClass('hidden');
    $('.files-grid-view.user-management-view').addClass('hidden');

    if (this.currentdirid === 'shares') {
        $('.shared-grid-view').removeClass('hidden');
        $.sharedGridHeader();
        initGridScrolling();
    }
    else if (this.currentdirid === 'out-shares') {
        $('.out-shared-grid-view').removeClass('hidden');
        $.outSharedGridHeader();
        initGridScrolling();
    }
    else if (String(this.currentdirid).length === 11 && this.currentrootid === 'contacts') {// Cloud-drive/File manager
        $('.contacts-details-block').removeClass('hidden');
        if (this.v.length > 0) {
            $('.files-grid-view.contact-details-view').removeClass('hidden');
            $.detailsGridHeader();
            initGridScrolling();
        }
    }
    else if (this.currentdirid === 'user-management') {
        $('.files-grid-view.user-management-view').removeClass('hidden');
        initGridScrolling();
    }
    else if (this.currentrootid === 'shares' && !this.v.length) {
        const viewModeClass = (M.viewmode ? '.fm-blocks-view' : '.files-grid-view') + '.fm.shared-folder-content';

        if (M.viewmode) {
            $(viewModeClass).removeClass('hidden');
        }
        else {
            $('.grid-table-header-container-sc', viewModeClass).addClass('hidden');
            $(viewModeClass).removeClass('hidden');
        }
    }
    else if (this.v.length) {

        $('.files-grid-view.fm').removeClass('hidden');
        $('.grid-table-header-container-sc', '.files-grid-view.fm').removeClass('hidden');
        if (this.currentCustomView) {
            $('.files-grid-view.fm').addClass(this.currentCustomView.type + '-view');
        }
        else {
            $('.files-grid-view.fm').removeClass('out-shares-view public-links-view');
        }
        initGridScrolling();
        $.gridHeader();

        // if there is any node that already rendered before getting correct value, update with resize handler.
        fm_resize_handler();
    }



    $('.grid-url-arrow').show();
    $('.grid-url-header').text('');

    $('.files-grid-view.fm .grid-scrolling-table,.files-grid-view.fm .file-block-scrolling,' +
        '.fm-empty-cloud,.fm-empty-folder,.fm.shared-folder-content,' +
        '.files-grid-view.contacts-view').rebind('contextmenu.fm', function(e) {
            if (page === "fm/links") { // Remove context menu option from filtered view
                return false;
            }
            $('.fm-blocks-view .data-block-view').removeClass('ui-selected');
            if (selectionManager) {
                selectionManager.clear_selection();
            }
            $.selected = [];
            $.hideTopMenu();
            return !!M.contextMenuUI(e, 2);
    });

    // enable add star on first column click (make favorite)
    $('.grid-table.shared-with-me tr td:first-child').add('.grid-table.out-shares tr td:first-child')
        .add('.grid-table.fm tr td:nth-child(2)').rebind('click', function() {
            if (M.isInvalidUserStatus()) {
                return;
            }
            var id = [$(this).parent().attr('id')];
            var newFavState = Number(!M.isFavourite(id));

            // Handling favourites is allowed for full permissions shares only
            if (M.getNodeRights(id) > 1) {
                M.favourite(id, newFavState);
                return false;
            }
        });

    $('.grid-table-header .arrow').rebind('click', function(e) {
        // this grid-table is used in the chat - in Archived chats. It won't work there, so - skip doing anything.
        if (M.chat) {
            return;
        }
        var cls = $(this).attr('class');
        var dir = 1;

        // Excludes colour sorting dialog for contacts
        if (cls.indexOf('name') !== -1 && $(this).parents('.files-grid-view.contacts-view').length === 0) {
            return M.labelSortMenuUI(e);
        }
        else {
            M.resetLabelSortMenuUI();

            if (cls && cls.indexOf('desc') > -1) {
                dir = -1;
            }
            for (var sortBy in M.sortRules) {
                if (cls.indexOf(sortBy) !== -1) {

                    var dateColumns = ['ts', 'mtime', 'date'];

                    if (dir !== -1 && dateColumns.indexOf(sortBy) !== -1) {
                        if (cls.indexOf('asc') === -1) {
                            dir = -1;
                        }
                    }

                    var scrollVal = 0;
                    if (M.megaRender && M.megaRender.megaList) {
                        scrollVal = M.megaRender.megaList.getScrollLeft();
                    }

                    M.doSort(sortBy, dir);
                    M.renderMain();

                    if (scrollVal) {
                        M.megaRender.megaList.scrollTo(0, scrollVal);
                        var tableHeader = $('.files-grid-view.fm .grid-table-header');
                        tableHeader.css('left', -1 * scrollVal);
                    }

                    break;
                }
            }
        }
    });

    var showColumnsContextMenu = function(e) {
        var notAllowedTabs = ['shares', 'out-shares'];
        if (notAllowedTabs.indexOf(M.currentdirid) !== -1) {
            return false;
        }
        M.contextMenuUI(e, 7);
        return false;
    };

    $('.grid-table-header').rebind('contextmenu', function(e) {
        return showColumnsContextMenu(e);
    });

    $('.grid-table-header-container-sc .column-settings.overlap').rebind('click',
        function(e) {
            var $me = $(this);
            if ($me.hasClass('c-opened')) {
                $.hideContextMenu();
                return false;
            }
            showColumnsContextMenu(e);
            $me.addClass('c-opened');
            return false;
        });

    $('.files-menu.context .dropdown-item.visible-col-select').rebind('click', function(e) {
        var $me = $(this);
        if ($me.hasClass('notactive')) {
            return false;
        }

        var targetCol = $me.attr('megatype');

        if ($me.attr('isviewed')) {
            $me.removeAttr('isviewed');
            $('i', $me).removeClass('icon-check').addClass('icon-add');
            M.columnsWidth.cloud[targetCol].viewed = false;
            $('.grid-table-header th[megatype="' + targetCol + '"]').hide();
            $('.grid-table.fm td[megatype="' + targetCol + '"]').hide();
        }
        else {
            $me.attr('isviewed', 'y');
            $('i', $me).removeClass('icon-add').addClass('icon-check');
            M.columnsWidth.cloud[targetCol].viewed = true;
            $('.grid-table-header th[megatype="' + targetCol + '"]').show();
            $('.grid-table.fm td[megatype="' + targetCol + '"]').show();
        }

        M.columnsWidth.makeNameColumnStatic();

        var columnPreferences = mega.config.get('fmColPrefs');
        if (columnPreferences === undefined) {
            columnPreferences = 108; // default
        }
        var colConfigNb = getNumberColPrefs(targetCol);
        if (colConfigNb) {
            if (M.columnsWidth.cloud[targetCol].viewed) {
                columnPreferences |= colConfigNb;
            }
            else {
                columnPreferences &= ~colConfigNb;
            }
        }
        mega.config.set('fmColPrefs', columnPreferences);

        if (M.megaRender && M.megaRender.megaList) {
            if (!M.megaRender.megaList._scrollIsInitialized) {
                M.megaRender.megaList.resized();
            }
            else {
                M.megaRender.megaList.scrollUpdate();
            }
        }
        $.hideContextMenu && $.hideContextMenu();
        return false;
    });


    $('.grid-first-th').rebind('click', function() {
        var $el = $(this).children().first();
        var c = $el.attr('class');
        var d = 1;

        if (c && (c.indexOf('desc') > -1)) {
            d = -1;
            $el.removeClass('desc').addClass('asc');
        }
        else {
            $el.removeClass('asc').addClass('desc');
        }

        var fav = function(el) {
            return el.fav;
        };

        if (M.v.some(fav)) {
            for (var f in M.sortRules) {
                if (c.indexOf(f) !== -1) {
                    M.doSort(f, d);
                    M.renderMain();
                    break;
                }
            }
        }
    });

    if (this.currentdirid === 'shares') {
        $.selectddUIgrid = '.shared-grid-view .grid-scrolling-table';
    }
    else if (this.currentdirid === 'out-shares') {
        $.selectddUIgrid = '.out-shared-grid-view .grid-scrolling-table';
    }
    else if (String(this.currentdirid).length === 11 && this.currentrootid === 'contacts') {
        $.selectddUIgrid = '.files-grid-view.contact-details-view .grid-scrolling-table';
    }
    else {
        $.selectddUIgrid = '.files-grid-view.fm .grid-scrolling-table';
    }

    $.selectddUIitem = 'tr';
    this.addSelectDragDropUIDelayed(refresh);

    if (d) {
        console.timeEnd('gridUI');
    }
};

FileManager.prototype.addGridUIDelayed = function(refresh) {
    delay('GridUI', function() {
        M.addGridUI(refresh);
    }, 20);
};

// Todo Enhance this or probably make this into MegaInput?
FileManager.prototype.initMegaSwitchUI = function() {

    'use strict';

    if (this.switchObserver) {
        this.switchObserver.disconnect();
    }

    const callback = function(mutationsList) {

        for (const mutation of mutationsList) {

            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {

                mutation.target.setAttribute('aria-checked', mutation.target.classList.contains('toggle-on'));
            }
        }
    };

    this.switchObserver = new MutationObserver(callback);

    const switches = document.getElementsByClassName('mega-switch');

    for (let i = switches.length; i--;) {

        switches[i].setAttribute('role', 'switch');
        switches[i].setAttribute('aria-checked', switches[i].classList.contains('toggle-on'));
        switches[i].setAttribute('tabindex', '0');
        // Todo: We need to add label for accessibilty support. we need to update all label to label tag for this.
        // switches[i].setAttribute('aria-labelledby', '');

        this.switchObserver.observe(switches[i], {attributes: true});
    }
};

FileManager.prototype.getDDhelper = function getDDhelper() {
    'use strict';

    var id = '#fmholder';
    if (page === 'start') {
        id = '#startholder';
    }
    $('.dragger-block').remove();
    $(id).append(
        '<div class="dragger-block drag" id="draghelper">' +
        '<div class="dragger-content"></div>' +
        '<div class="dragger-files-number">1</div>' +
        '</div>'
    );
    $('.dragger-block').show();
    $('.dragger-files-number').hide();
    return $('.dragger-block')[0];
};

FileManager.prototype.addSelectDragDropUI = function(refresh) {
    "use strict";

    if (this.currentdirid && this.currentdirid.substr(0, 7) === 'account') {
        return false;
    }


    if (d) {
        console.time('selectddUI');
    }

    var mainSel = $.selectddUIgrid + ' ' + $.selectddUIitem;
    var dropSel = $.selectddUIgrid + ' ' + $.selectddUIitem + '.folder';
    if (this.currentrootid === 'contacts') {
        dropSel = mainSel;
    }

    $(dropSel).droppable({
        tolerance: 'pointer',
        drop: function(e, ui) {
            $.doDD(e, ui, 'drop', 0);
        },
        over: function(e, ui) {
            $.doDD(e, ui, 'over', 0);
        },
        out: function(e, ui) {
            $.doDD(e, ui, 'out', 0);
        }
    });

    if ($.gridDragging) {
        $('body').addClass('dragging ' + ($.draggingClass || ''));
    }

    var $ddUIitem = $(mainSel);
    var $ddUIgrid = $($.selectddUIgrid);
    $ddUIitem.draggable({
        start: function(e, u) {
            if (d) {
                console.log('draggable.start');
            }
            $.hideContextMenu(e);
            $.gridDragging = true;
            $('body').addClass('dragging');
            if (!$(this).hasClass('ui-selected')) {
                selectionManager.resetTo($(this).attr('id'));
            }
            var max = ($(window).height() - 96) / 24;
            var html = [];
            $.selected.forEach(function(id, i) {
                var n = M.d[id];
                if (n) {
                    if (max > i) {
                        html.push(
                            '<div class="transfer-filetype-icon ' + fileIcon(n) + '"></div>' +
                            '<div class="tranfer-filetype-txt dragger-entry">' +
                            escapeHTML(n.name) + '</div>'
                        );
                    }
                }
            });
            if ($.selected.length > max) {
                $('.dragger-files-number').text($.selected.length);
                $('.dragger-files-number').show();
            }
            $('#draghelper .dragger-content').html(html.join(""));
            $.draggerHeight = $('#draghelper .dragger-content').outerHeight();
            $.draggerWidth = $('#draghelper .dragger-content').outerWidth();
            $.draggerOrigin = M.currentdirid;
            $.dragSelected = clone($.selected);
        },
        drag: function(e, ui) {
            if (ui.position.top + $.draggerHeight - 28 > $(window).height()) {
                ui.position.top = $(window).height() - $.draggerHeight + 26;
            }
            if (ui.position.left + $.draggerWidth - 58 > $(window).width()) {
                ui.position.left = $(window).width() - $.draggerWidth + 56;
            }
        },
        refreshPositions: true,
        containment: 'document',
        scroll: false,
        distance: 10,
        revertDuration: 200,
        revert: true,
        cursorAt: {right: 90, bottom: 56},
        helper: function(e, ui) {
            $(this).draggable("option", "containment", [72, 42, $(window).width(), $(window).height()]);
            return M.getDDhelper();
        },
        stop: function(event) {
            if (d) {
                console.log('draggable.stop');
            }
            $.gridDragging = $.draggingClass = false;
            $('body').removeClass('dragging').removeClassWith("dndc-");
            var origin = $.draggerOrigin;
            setTimeout(function __onDragStop() {
                if (M.currentdirid === 'contacts') {
                    if (origin !== 'contacts') {
                        M.openFolder(origin, true);
                    }
                }
                else {
                    M.onTreeUIOpen(M.currentdirid, false, true);
                }
            }, 200);
            delete $.dragSelected;
        }
    });

    $('.ui-selectable-helper').remove();

    if (this.currentdirid && this.currentdirid.substr(0, 8) !== 'contacts') {
        $ddUIgrid.selectable({
            filter: $.selectddUIitem,
            cancel: '.ps-scrollbar-y-rail, .ps-scrollbar-x-rail',
            start: function (e, u) {
                $.hideContextMenu(e);
                $.hideTopMenu();
            },
            stop: function (e, u) {
                delay('render:search_breadcrumbs', () => M.renderSearchBreadcrumbs());
            }
        });
        // Since selectablecreate is triggered only on first creation of the selectable widget, we need to find a way
        // to notify any code (selectionManager) that it can now hook selectable events after the widget is created
        $ddUIgrid.trigger('selectablereinitialized');
    }

    $ddUIitem.rebind('contextmenu', function(e) {
        if (e.shiftKey) {
            selectionManager.shift_select_to($(this).attr('id'), false, true, true);
        }
        else if (e.ctrlKey !== false || e.metaKey !== false) {
            selectionManager.add_to_selection($(this).attr('id'));
            $.gridLastSelected = this;
        }
        else {
            var id = $(this).attr('id');

            if (selectionManager.selected_list.indexOf(id) === -1) {
                selectionManager.resetTo(id);
            }
            else {
                selectionManager.add_to_selection(id);
                $.gridLastSelected = this;
            }

            // Show sort menu for FM, block view only
            // if (fmconfig.viewmodes && fmconfig.viewmodes[M.currentdirid]) {
            //     return M.labelSortMenuUI(e, true);
            // }
        }

        delay('render:search_breadcrumbs', () => M.renderSearchBreadcrumbs());
        $.hideTopMenu();
        M.hideClickHint();

        return !!M.contextMenuUI(e, 1);
    });

    $ddUIitem.rebind('click', function(e) {
        if ($.gridDragging) {
            return false;
        }
        var s = e.shiftKey;
        if (e.shiftKey) {
            selectionManager.shift_select_to($(this).attr('id'), false, true, true);
        }
        else if (e.ctrlKey == false && e.metaKey == false)
        {
            $($.selectddUIgrid + ' ' + $.selectddUIitem).removeClass('ui-selected');
            $(this).addClass('ui-selected');
            $.gridLastSelected = this;
            selectionManager.clear_selection();
            selectionManager.add_to_selection($(this).attr('id'));
        }
        else
        {
            if ($(this).hasClass("ui-selected")) {
                $(this).removeClass("ui-selected");
                selectionManager.remove_from_selection($(this).attr('id'));
            }
            else
            {
                $(this).addClass("ui-selected");
                $.gridLastSelected = this;
                selectionManager.add_to_selection($(this).attr('id'));
            }
        }

        if (!mega.cttHintTimer) {
            M.showClickHint();
        }
        delay('render:search_breadcrumbs', () => M.renderSearchBreadcrumbs());
        $.hideContextMenu(e);
        if ($.hideTopMenu) {
            $.hideTopMenu();
        }

        return false;

    });

    $ddUIitem.rebind('dblclick', function(e) {
        var h = $(e.currentTarget).attr('id');
        var n = M.d[h] || {};
        if (n.t) {
            if (e.ctrlKey) {
                $.ofShowNoFolders = true;
            }
            $('.top-context-menu').hide();
            if (M.currentrootid === 'out-shares' || M.currentrootid === 'public-links') {
                h = M.currentrootid + '/' + h;
            }
            M.openFolder(h);
        }
        else if (is_image2(n) || is_video(n)) {
            if (is_video(n)) {
                $.autoplay = h;
            }
            slideshow(h);
        }
        else if (is_text(n)) {
            $.selected = [h];
            // there's no jquery parent for this container.
            // eslint-disable-next-line local-rules/jquery-scopes
            $('.dropdown.body.context .dropdown-item.edit-file-item').trigger('click');
        }
        else {
            M.addDownload([h]);
        }
        M.hideClickHint();
    });

    if ($.rmInitJSP) {
        var jsp = $($.rmInitJSP).data('jsp');
        if (jsp) {
            jsp.reinitialise();
        }
        if (d) {
            console.log('jsp:!u', !!jsp);
        }
        delete $.rmInitJSP;
    }
    if (!refresh) {
        $.tresizer();
    }

    if (d) {
        console.timeEnd('selectddUI');
    }

    $ddUIitem = $ddUIgrid = undefined;
};

FileManager.prototype.addSelectDragDropUIDelayed = function(refresh) {
    delay('selectddUI', function() {
        M.addSelectDragDropUI(refresh);
    });
};

FileManager.prototype.onSectionUIOpen = function(id) {
    "use strict";

    var tmpId;
    var $fmholder = $('#fmholder', 'body');

    if (d) {
        console.log('sectionUIopen', id, folderlink);
    }
    if (!anonymouschat && $.hideContextMenu) {
       $.hideContextMenu();
    }

    $('.nw-fm-left-icon', $fmholder).removeClass('active');
    if (this.hasInboxItems() === true) {
        $('.nw-fm-left-icon.inbox', $fmholder).removeClass('hidden');
    }
    else {
        $('.nw-fm-left-icon.inbox', $fmholder).addClass('hidden');
    }

    // view or hide left icon for business account, confirmed and payed
    if (u_attr && u_attr.b && u_attr.b.m && (u_attr.b.s === 1 || u_attr.b.s === 2) && u_privk) {
        $('.nw-fm-left-icon.user-management', $fmholder).removeClass('hidden');
    }
    else {
        $('.nw-fm-left-icon.user-management', $fmholder).addClass('hidden');
    }


    switch (id) {
        case 'opc':
        case 'ipc':
        case 'contacts':
            tmpId = 'conversations';
            break;
        case 'recents':
        case 'search':
        case 'shared-with-me':
        case 'out-shares':
        case 'public-links':
        case 'inbox':
        case 'rubbish-bin':
            tmpId = 'cloud-drive';
            break;
        case 'affiliate':
            tmpId = 'dashboard';
            break;
        default:
            tmpId = id;
    }

    let tempId = String(tmpId).replace(/[^\w-]/g, '');
    let fmLeftIcons = document.getElementsByClassName('nw-fm-left-icon');

    if (fmLeftIcons[tempId] && !fmLeftIcons[tempId].classList.contains('active')) {
        fmLeftIcons[tempId].classList.add('active');
    }

    let contentPanels = document.getElementsByClassName('content-panel');

    for (let i = contentPanels.length; i--;) {

        if (contentPanels[i].classList.contains(tempId)) {

            if (!contentPanels[i].classList.contains('active')) {
                contentPanels[i].classList.add('active');
            }
        }
        else if (contentPanels[i].classList.contains('active')) {
            contentPanels[i].classList.remove('active');
        }
    }

    this.currentTreeType = M.treePanelType();

    $('.fm-left-menu', $fmholder).removeClass(
        'cloud-drive folder-link shared-with-me rubbish-bin contacts out-shares public-links ' +
        'conversations opc ipc inbox account dashboard transfers recents user-management affiliate'
    ).addClass(tmpId);
    $('.fm.fm-right-header, .fm-import-to-cloudrive, .fm-download-as-zip', $fmholder).addClass('hidden');
    $('.fm-import-to-cloudrive, .fm-download-as-zip', $fmholder).off('click');

    $fmholder.removeClass('affiliate-program');
    $('.fm-main', $fmholder).removeClass('active-folder-link');
    $('.nw-fm-left-icons-panel .logo', $fmholder).addClass('hidden');
    $('.fm-products-nav', $fmholder).text('');
    $('.nw-fm-tree-header.folder-link', $fmholder).addClass('hidden');
    $('.nw-fm-left-icon.folder-link', $fmholder).removeClass('active');

    // Prevent autofill prevent fake form to be submitted
    $('#search-fake-form-2', $fmholder).rebind('submit', function() {
        return false;
    });

    if (folderlink) {
        // XXX: isValidShareLink won't work properly when navigating from/to a folderlink
        /*if (!isValidShareLink()) {
         $('.fm-breadcrumbs.folder-link .right-arrow-bg').text('Invalid folder');
         } else*/
        if (id === 'cloud-drive' || id === 'transfers') {
            $('.nw-fm-left-icons-panel .logo', $fmholder).removeClass('hidden');
            $('.fm-main', $fmholder).addClass('active-folder-link');
            $('.fm-right-header', $fmholder).addClass('folder-link');
            $('.fm-left-menu', $fmholder).addClass('folder-link');
            $('.nw-fm-tree-header.folder-link', $fmholder).removeClass('hidden');

            var $prodNav = $('.fm-products-nav').text('');
            if (!u_type) {
                $prodNav.safeHTML(translate(pages['pagesmenu']));
                onIdle(function() {
                    clickURLs();
                    bottompage.initNavButtons($fmholder);
                });
            }

            // remove this two buttons from search result.
            if (M.currentdirid.substr(0, 6) !== 'search') {
                $('.fm-import-to-cloudrive, .fm-download-as-zip', $fmholder)
                    .removeClass('hidden')
                    .rebind('click', function() {
                        var c = $(this).attr('class');

                        if (c.indexOf('fm-import-to-cloudrive') > -1) {
                            M.importFolderLinkNodes([M.currentdirid]);
                        }
                        else if (c.indexOf('fm-download-as-zip') > -1) {
                            M.addDownload([M.currentdirid], true);
                        }
                    });
            }
            // if (!u_type) {
            // $('.fm-import-to-cloudrive').addClass('hidden');
            // }
        }
    }

    if (id !== 'conversations' || id !== "archivedchats") {
        if (id !== 'user-management') {
            $('.fm-right-header').removeClass('hidden');
            $('.fm-right-header-user-management').addClass('hidden');
        }
        else {
            $('.fm-right-header').addClass('hidden');
            $('.fm-right-header-user-management').removeClass('hidden');
            M.hideEmptyGrids();
        }
        $('.fm-chat-block').addClass('hidden');
    }

    if (
        (id !== 'cloud-drive') &&
        (id !== 'rubbish-bin') &&
        (id !== 'inbox') &&
        (
            (id !== 'shared-with-me') &&
            (M.currentdirid !== 'shares')
        ) &&
        (
            (id !== 'out-shares') &&
            (M.currentdirid !== 'out-shares')
        ) &&
        (
            (id !== 'public-links') &&
            (M.currentdirid !== 'public-links')
        )
    ) {
        $('.files-grid-view.fm').addClass('hidden');
        $('.fm-blocks-view.fm').addClass('hidden');
    }

    if (id !== 'contacts') {
        $('.contacts-details-block').addClass('hidden');
        $('.files-grid-view.contacts-view').addClass('hidden');
        $('.fm-blocks-view.contacts-view').addClass('hidden');
    }
    if (id !== 'user-management') {
        $('.fm-left-panel').removeClass('user-management');
        $('.user-management-tree-panel-header').addClass('hidden');
        $('.files-grid-view.user-management-view').addClass('hidden');
        $('.fm-blocks-view.user-management-view').addClass('hidden');
        $('.user-management-overview-bar').addClass('hidden');
    }

    if (id !== 'shared-with-me' && M.currentdirid !== 'shares') {
        $('.shared-blocks-view').addClass('hidden');
        $('.shared-grid-view').addClass('hidden');
    }

    if (id !== 'out-shares') {
        $('.out-shared-blocks-view').addClass('hidden');
        $('.out-shared-grid-view').addClass('hidden');
    }

    if (id !== 'shared-with-me' && id !== 'out-shares') {
        $('.shares-tabs-bl').addClass('hidden');
    }

    if (id !== 'contacts') {
        $('.contacts-tabs-bl').addClass('hidden');
    }

    $(".fm-left-panel").removeClass('hidden');

    if (id !== "recents") {
        $(".fm-recents.container").addClass('hidden');
        $('.top-head').find(".recents-tab-link").addClass("hidden").removeClass('active');
    }
    if (id !== 'transfers') {
        if ($.transferClose) {
            $.transferClose();
        }
    }
    else {
        if (!$.transferOpen) {
            M.addTransferPanelUI();
        }
        $.transferOpen(true);
    }

    if (id === 'affiliate') {
        $('#fmholder').addClass('affiliate-program');
    }

    // required tricks to make the conversations work with the old UI HTML/css structure
    if (id === "conversations") {
        // moving the control of the headers in the tree panel to chat.js + ui/conversations.jsx
        $('.fm-main.default > .fm-left-panel').addClass('hidden');

        if (!is_mobile) {
            window.mega.ui.searchbar.refresh();
        }
    }
    else if (id !== "recents") {
        $('.fm-main.default > .fm-left-panel').removeClass('hidden');
    }

    // new sections UI
    let sections = document.getElementsByClassName('section');

    for (let i = sections.length; i--;) {

        if (sections[i].classList.contains(tmpId)) {
            sections[i].classList.remove('hidden');
        }
        else {
            sections[i].classList.add('hidden');
        }
    }

    // Revamp Implementation Begin
    $('.js-fm-left-panel').children('section').addClass('hidden');

    let panel;

    if ((id === 'cloud-drive' && !folderlink) || id === 'shared-with-me' || id === 'out-shares' ||
        id === 'public-links' || id === 'inbox' || id === 'rubbish-bin' || id === 'recents') {
        M.initLeftPanel();
    }
    else if (id === 'cloud-drive' || id === 'dashboard' || id === 'account') {

        panel = document.getElementsByClassName('js-other-tree-panel').item(0);

        if (panel) {
            panel.classList.remove('hidden');
        }
    }
    else if (id === 'user-management') {

        panel = document.getElementsByClassName('js-other-tree-panel').item(0);

        if (panel) {
            panel.classList.remove('hidden');
        }

        panel = document.getElementsByClassName('js-lp-usermanagement').item(0);

        if (panel) {
            panel.classList.remove('hidden');
        }

        if (selectionManager) {
            selectionManager.clear_selection();
        }
    }

    // Revamp Implementation End
};


FileManager.prototype.getLinkAction = function() {
    'use strict';

    if (M.isInvalidUserStatus()) {
        return;
    }

    // ToDo: Selected can be more than one folder $.selected
    // Avoid multiple referencing $.selected instead use event
    // add new translation message '... for multiple folders.'
    // cancel descendant MEGAdrops after copyRights are accepted
    if (u_type === 0) {
        ephemeralDialog(l[1005]);
    }
    else {
        var isEmbed = $(this).hasClass('embedcode-item');
        var selNodes = Array.isArray($.selected) ? $.selected.concat() : [];
        var showDialog = function() {
            mega.Share.initCopyrightsDialog(selNodes, isEmbed);
        };

        var mdList = mega.megadrop.isDropExist(selNodes);
        if (mdList.length) {
            var fldName = mdList.length > 1 ? l[17626] : l[17403].replace('%1', escapeHTML(M.d[mdList[0]].name));

            msgDialog('confirmation', l[1003], fldName, l[18229], function(e) {
                if (e) {
                    mega.megadrop.pufRemove(mdList);
                    // set showDialog as callback for after delete puf.
                    mega.megadrop.pufCallbacks[selNodes[0]] = {del: showDialog};
                }
            });
        }
        else {
            showDialog();
        }
    }
};

/**
 * Initialize Statusbar Links related user interface
 */
FileManager.prototype.initStatusBarLinks = function() {
    "use strict";

    $('.js-statusbarbtn').rebind('click', function(e){

        if (this.classList.contains('download')) {
            M.addDownload($.selected);
        }
        else if (this.classList.contains('share')) {
            M.openSharingDialog();
        }
        else if (this.classList.contains('sendto')) {
            openCopyDialog('conversations');
        }
        else if (this.classList.contains('link')) {
            M.getLinkAction();
        }
        else if (this.classList.contains('delete')) {

            if (M.isInvalidUserStatus() || this.classList.contains('disabled')) {
                return false;
            }

            closeDialog();
            fmremove();
        }
        else if (this.classList.contains('options')) {

            if (this.classList.contains('c-opened')) {

                this.classList.remove('c-opened');
                $.hideContextMenu();
                return false;
            }
            showFilesOptionContextMenu(e);
            this.classList.add('c-opened');
        }

        return false;
    });

    function showFilesOptionContextMenu(e) {

        // These pages are not support file option context menu
        if (Object.assign(Object.create(null), {'contacts': 1, 'ipc': 1, 'opc': 1})[M.currentdirid]) {
            return false;
        }
        return !!M.contextMenuUI(e, 1);
    }
};

FileManager.prototype.initLeftPanel = function() {
    'use strict';

    let elements = document.getElementsByClassName('js-lpbtn');

    for (var i = elements.length; i--;) {
        elements[i].classList.remove('active');
    }

    elements = document.getElementsByClassName('js-lp-myfiles');

    for (var j = elements.length; j--;) {
        elements[j].classList.remove('hidden');
    }

    this.checkLeftStorageBlock();

    if (M.currentdirid === M.RootID) {
        $('.js-clouddrive-btn').addClass('active');
    }
    else if (M.currentrootid === M.InboxID) {
        $('.js-lpbtn[data-link="inbox"]').addClass('active');
    }
    else if (M.currentrootid === 'shares' || M.currentrootid === 'out-shares') {
        $('.js-lpbtn[data-link="shares"]').addClass('active');
    }
    else if (M.currentdirid === 'recents') {
        $('.js-lpbtn[data-link="recents"]').addClass('active');
    }
    else if (M.currentrootid === 'public-links') {
        $('.js-lpbtn[data-link="links"]').addClass('active');
    }
    else if (M.currentrootid === M.RubbishID) {
        $('.js-lpbtn[data-link="bin"]').addClass('active');
    }

    $('.js-lpbtn').rebind('click.openSubTab', function(e) {

        let link = $(this).attr('data-link');

        if (link === 'clouddrive') {

            let $el = $(this);

            if (M.currentdirid === M.RootID || $(e.target).hasClass('js-cloudtree-expander')) {
                $el.toggleClass('collapse');
                $('.content-panel.active').toggleClass('collapse');
                $.tresizer();
            }
            else {
                M.openFolder(M.RootID, true);
            }
            return;
        }
        else if (link === 'upgrade') {
            loadSubPage('pro');
        }
    });
};


(function(global) {
    'use strict';

    var _cdialogq = Object.create(null);

    // Define what dialogs can be opened from other dialogs
    var diagInheritance = {
        'recovery-key-dialog': ['recovery-key-info'],
        properties: ['links', 'rename', 'copyrights', 'copy', 'move', 'share', 'saveAs'],
        copy: ['createfolder'],
        move: ['createfolder'],
        register: ['terms'],
        selectFolder: ['createfolder'],
        saveAs: ['createfolder'],
        share: ['share-add'],
        'stripe-pay': ['stripe-pay-success', 'stripe-pay-failure']
    };

    var _openDialog = function(name, dsp) {
        if (d > 1) {
            console.log('safeShowDialog::_openDialog', name, typeof dsp, $.dialog);
        }

        onIdle(function() {
            if (typeof $.dialog === 'string') {
                if ($.dialog === name) {
                    if (d > 1) {
                        console.log('Reopening same dialog...', name);
                    }
                }

                // There are a few dialogs that can be opened from others, deal it.
                else if (!diagInheritance[$.dialog] || diagInheritance[$.dialog].indexOf(name) < 0) {
                    _cdialogq[name] = dsp;
                    return;
                }
            }

            dsp();
        });
    };

    mBroadcaster.addListener('closedialog', function() {
        var name = Object.keys(_cdialogq).shift();

        if (name) {
            _openDialog(name, _cdialogq[name]);
            delete _cdialogq[name];
        }
    });

    if (d) {
        global._cdialogq = _cdialogq;
    }

    /**
     * Prevent dispatching several dialogs in top on each other
     * @param {String} dialogName The dialog name to set on $.dialog
     * @param {Function|Object} dispatcher The dispatcher, either a jQuery's node/selector or a function
     */
    FileManager.prototype.safeShowDialog = function(dialogName, dispatcher) {

        dispatcher = (function(name, dsp) {
            return tryCatch(function() {
                var $dialog;

                if (d > 1) {
                    console.warn('Dispatching queued dialog.', name);
                }

                if (typeof dsp === 'function') {
                    $dialog = dsp();
                }
                else {
                    $dialog = $(dsp);
                }

                if ($dialog) {
                    if (!$dialog.hasClass('mega-dialog') &&
                        !$dialog.hasClass('fm-dialog-mobile') &&
                        !$dialog.hasClass('fm-dialog')) {

                        throw new Error('Unexpected dialog type...');
                    }

                    // arrange to back any non-controlled dialogs,
                    // this class will be removed on the next closeDialog()
                    $('.mega-dialog:visible, .overlay:visible').addClass('arrange-to-back');

                    fm_showoverlay();
                    $dialog.removeClass('hidden arrange-to-back');
                }
                $.dialog = String(name);
            }, function(ex) {
                // There was an exception dispatching the above code, move to the next queued dialog...
                if (d) {
                    console.warn(ex);
                }
                mBroadcaster.sendMessage('closedialog', ex);
            });
        })(dialogName, dispatcher);

        _openDialog(dialogName, dispatcher);
    };

    Object.defineProperty(FileManager.prototype.safeShowDialog, 'abort', {
        value: function _abort() {
            if (d && $.dialog) {
                console.info('Aborting dialogs dispatcher while on %s, queued: ', $.dialog, _cdialogq);
            }

            delete $.dialog;
            loadingDialog.hide('force');
            _cdialogq = Object.create(null);

            $('html, body').removeClass('overlayed');
            $('.fm-dialog-overlay').addClass('hidden');
            $('.mega-dialog:visible, .overlay:visible').addClass('hidden');
        }
    });

})(self);
