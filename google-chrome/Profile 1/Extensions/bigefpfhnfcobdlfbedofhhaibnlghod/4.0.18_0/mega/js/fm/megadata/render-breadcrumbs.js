(function() {
    'use strict';

    /**
     * A helper function which can be used to render breadcrumbs anywhere in the application.
     * Relies on having the same HTML structure as the main cloud drive breadcrumbs.
     *
     * @param {Array} items - a list of breadcrumbs
     * @param {HTMLElement} scope - the wrapper/parent element of the breadcrumbs, used for scoping selectors
     * @param {function} dictionary - a function which will convert a folder id into a breadcumb datun
     * @param {function} clickAction - the function that will be called on clicking a breadcrumb
     * @return {undefined}
     */
    MegaData.prototype.renderBreadcrumbs = function(items, scope, dictionary, clickAction) {
        const block = scope.querySelector('.fm-breadcrumbs-block');
        const $block = $(block);
        const dropdown = scope.querySelector('.breadcrumb-dropdown');

        let { html, extraItems } = getPathHTML(items, dictionary, block);

        if (html && html !== '') {
            $block.safeHTML(html);
        }

        removeSimpleTip($('.fm-breadcrumbs', $block));
        showHideBreadcrumbDropdown(extraItems, scope, dropdown);
        applyBreadcrumbEventHandlers(scope, dropdown, clickAction);
    };

    /**
     * Render the breadcrumbs at the top of the cloud drive, shares, public links and rubbish bin pages.
     *
     * @param {string} fileHandle - the id of the selected file or folder
     * @return {undefined}
     */
    MegaData.prototype.renderPathBreadcrumbs = function(fileHandle) {
        const scope = document.querySelector('.fm-right-files-block .fm-right-header .fm-breadcrumbs-wrapper');
        const items = this.getPath(this.currentdirid);

        const dictionary = handle => {
            let name = '';
            let typeClass = '';

            const cases = {
                [this.RootID]: () => {
                    if (folderlink && this.d[this.RootID]) {
                        name = this.d[this.RootID].name;
                        typeClass = 'folder';
                    }
                    else {
                        typeClass = 'cloud-drive';
                        name = l[164];
                    }
                },
                contacts: () => {
                    typeClass = 'contacts';
                    name = l[165];
                },
                opc: () => {
                    typeClass = 'sent-requests';
                    name = l[5862];
                },
                ipc: () => {
                    typeClass = 'received-requests';
                    name = l[5863];
                },
                shares: () => {
                    typeClass = 'shared-with-me';
                    name = l[5542];
                },
                'out-shares': () => {
                    typeClass = 'out-shares';
                    name = l[5543];
                },
                'public-links': () => {
                    typeClass = 'pub-links';
                    name = l[16516];
                },
                [this.RubbishID]: () => {
                    typeClass = 'rubbish-bin';
                    name = l[167];
                },
                messages: () => {
                    typeClass = 'messages';
                    name = l[166];
                },
                [this.InboxID]: () => {
                    typeClass = 'messages';
                    name = l[166];
                }
            };

            if (cases[handle]) {
                cases[handle]();
            }
            else {
                const n = this.d[handle];
                if (n) {
                    if (n.name) {
                        name = n.name;
                    }
                    if (n.t) {
                        typeClass = 'folder';
                    }
                }
                if (handle.length === 11) {
                    typeClass = 'contact';

                    // Contact should not appears on other than chat/contact pages
                    if (M.currentrootid !== 'chat') {
                        name = '';
                    }
                }
                else if (folderlink) {
                    typeClass = 'folder-link';
                }
                else {
                    typeClass = 'folder';
                }
            }

            return {
                name,
                typeClass,
                id: handle
            };
        };

        this.renderBreadcrumbs(items, scope, dictionary, id => {
            breadcrumbClickHandler.call(this, id);
        });

        if (!is_mobile && fileHandle) {
            fileversioning.fileVersioningDialog(fileHandle);
        }
    };

    /**
     * Render the breadcrumbs at the bottom of the search page.
     * TODO: unify this with MegaData.renderPathBreadcrumbs
     *
     * @return {undefined}
     */
    MegaData.prototype.renderSearchBreadcrumbs = function() {
        const block = document.querySelector('.fm-main .fm-right-files-block:not(.in-chat)');

        if (this.currentdirid && this.currentdirid.substr(0, 7) === 'search/') {
            let sel;

            if (this.viewmode) {
                sel = document.querySelector('.fm-blocks-view .ui-selected');
            }
            else {
                sel = document.querySelector('.grid-table .ui-selected');
            }

            if (sel) {
                if (block) {
                    block.classList.add('search');
                }

                const scope = document.querySelector('.fm-right-files-block.search .search-bottom-wrapper');
                const items = this.getPath(sel.id);

                const dictionary = handle => {
                    let id = '';
                    let typeClass = '';
                    let name = '';

                    if (handle.length === 11 && this.u[handle]) {
                        id = handle;
                        typeClass = 'contacts-item';
                        name = this.u[handle].m;
                    }
                    else if (handle === this.RootID && !folderlink) {
                        id = this.RootID;
                        typeClass = 'cloud-drive';
                        name = l[164];
                    }
                    else if (handle === this.RubbishID) {
                        id = this.RubbishID;
                        typeClass = 'recycle-item';
                        name = l[168];
                    }
                    else if (handle === this.InboxID) {
                        id = this.InboxID;
                        typeClass = 'inbox-item';
                        name = l[166];
                    }
                    else {
                        const n = this.d[handle];
                        if (n) {
                            id = n.h;
                            typeClass = '';
                            name = n.name;
                            if (n.t) {
                                typeClass = 'folder';
                            }
                        }
                    }

                    return {
                        id,
                        typeClass,
                        name
                    };
                };

                this.renderBreadcrumbs(items, scope, dictionary, id => {
                    breadcrumbClickHandler.call(this, id);
                });

                return;
            }
        }

        if (block) {
            block.classList.remove('search');
        }
    };

    /* Private methods */

    /** Gets the HTML to populate a dropdown of breadcrumbs
     * @param {Array} items - an array of breadcrumb items
     * @return {string} - the HTML to represent the items
     */
    function getBreadcrumbDropdownHTML(items) {
        let contents = '';

        for (let item of items) {

            let icon = '';

            if (item.type === 'cloud-drive') {
                icon = 'icon-cloud';
            }
            else if (item.type === 'folder' || item.type === 'folder-link') {
                icon = 'icon-folder-filled';
            }

            contents +=
                `<a class="crumb-drop-link" data-id="${escapeHTML(item.id)}">
                    ${icon === '' ? '' : `<i class="sprite-fm-mono ${icon} icon24"></i>`}
                    <span>${escapeHTML(item.name)}</span>
                </a>`;
        }

        return contents;
    }

    /**
     * Show or hide the breadcrumb dropdown, depending on whether there are items to show in it
     *
     * @param {Array} extraItems - the items to be shown in the dropdown
     * @param {HTMLElement} scope - the wrapper element for the breadcrumbs
     * @param {HTMLElement} dropdown - the dropdown for breadcrumbs which are not shown
     * @return {undefined}
     */
    function showHideBreadcrumbDropdown(extraItems, scope, dropdown) {
        // if we're not displaying the full path, show the dropdown button
        if (extraItems.length) {
            scope.querySelector('.crumb-overflow-link').classList.remove('hidden');
            $(dropdown).safeHTML(getBreadcrumbDropdownHTML(extraItems));
        }
        // otherwise, hide the dropdown button
        else {
            scope.querySelector('.crumb-overflow-link').classList.add('hidden');
        }
    }

    /**
     * Apply events to the main breadcrumbs and any in the overflow dropdown.
     *
     * @param {HTMLElement} scope - the wrapper element for the breadcrumbs
     * @param {HTMLElement} dropdown - the dropdown for breadcrumbs which are not shown
     * @param {function} clickAction - what to do when a breadcrumb is clicked
     * @return {undefined}
     */
    function applyBreadcrumbEventHandlers(scope, dropdown, clickAction) {
        $('.breadcrumb-dropdown-link', scope)
            .rebind('click.breadcrumb-dropdown', () => {
                dropdown.classList.toggle('active');
            });

        $('.crumb-drop-link, .fm-breadcrumbs', scope).rebind('click.breadcrumb', function(e) {
            dropdown.classList.remove('active');
            let id = $(e.currentTarget).data('id');

            if (id) {
                clickAction(id);
            }
        });

        $('.fm-breadcrumbs', scope).rebind('contextmenu.breadcrumb', () => {
            return false;
        });
    }

    /**
     * Returns the HTML for a full set of breadcrumbs.
     *
     * @param {Array} items - the items in the path
     * @param {function} dictionary - a function which will convert the item id into a full breadcrumb datum
     * @param {HTMLElement} container - the HTMLElement that contains the breadcrumbs
     * @return {object} - the HTML for the breadcrumbs and the list of parent folders not in the breadcrumbs
     */
    function getPathHTML(items, dictionary, container) {
        let html = '';
        let currentPathLength = 0;
        const maxPathLength = getMaxPathLength(14, container);
        let extraItems = [];

        for (let i = 0; i < items.length; i++) {

            let {name, typeClass, id} = dictionary(items[i]);

            // Some items are not shown, so if we don't have a name, don't show this breadcrumb
            // Don't include the contact name (can be removed later if you want it back)
            if (name !== '') {

                const isLastItem = i === 0;
                const isRoot = i === items.length - 1;
                let item;
                // if we won't have space, add it to the dropdown, but always render the current folder,
                // and root if there are no extraItems
                if ((!isLastItem && !isRoot || isRoot && extraItems.length > 0) && currentPathLength > maxPathLength) {
                    extraItems.push({
                        name,
                        type: typeClass,
                        id
                    });
                }
                // otherwise, add it to the main breadcrumb
                else {
                    name = escapeHTML(name);
                    item = escapeHTML(items[i]);
                    html =
                        `<a class="fm-breadcrumbs ${escapeHTML(typeClass)} ${isRoot ? 'root' : ''} ui-droppable"
                            data-id="${item}" id="pathbc-${item}">
                            <span
                                class="right-arrow-bg simpletip"
                                data-simpletip="${name}">
                                ${isRoot ?
                                    `<span class="not-loading">
                                        ${name}
                                    </span>
                                    <i class="loading sprite-fm-theme icon-loading-spinner"></i>` : name}
                            </span>
                            ${isLastItem ? '' : '<i class="next-arrow sprite-fm-mono icon-arrow-right icon16"></i>'}
                        </a>` + html;

                    // add on some space for the arrow
                    if (isLastItem) {
                        currentPathLength += 6;
                    }
                }
                currentPathLength += name.length;
            }
        }

        return { html, extraItems };
    }

    function removeSimpleTip($breadCrumbs) {
        let $currentBreadcrumb;
        for (let i = 0; i < $breadCrumbs.length; i++) {
            $currentBreadcrumb = $($breadCrumbs[i]);
            if ($('span', $currentBreadcrumb).get(0).offsetWidth >= $('span', $currentBreadcrumb).get(0).scrollWidth) {
                $('.right-arrow-bg', $currentBreadcrumb).removeClass('simpletip');
            }
        }
    }

    /**
     * Get the (approximate) maximum number of cahracters that can be shown in the breadcrumb container
     *
     * @param {number} fontSize - the font size used for the breadcrumbs
     * @param {HTMLElement} container - the breadcrumbs' container
     * @return {number} - the maximum number of characters
     */
    function getMaxPathLength(fontSize, container) {
        // ~= font size / 2 - fudge factor for approximate average character width
        const maxCharacterWidth = fontSize / 1.5;

        // Assume the largest character is ~square (W/M/etc.), and calc the max number of characters we can show
        return container.offsetWidth / maxCharacterWidth;
    }

    /**
     * Handles clicks on the cloud drive and search breadcrumbs.
     * Note: Must be called with context for `this` to work.
     *
     * @param {string} id - the folder ID, or special ID of the destination
     * @return {undefined}
     */
    function breadcrumbClickHandler(id) {
        const n = this.d[id];
        const specialCases = [
            'shares',
            'out-shares',
            'public-links'
        ];

        // super special case (contact)
        if (id in M.u) {
            loadSubPage("chat/contacts/" + id);
        }
        else if (n) {
            id = n.h;
            $.selected = [];

            if (!n.t) {
                $.selected.push(id);
                id = n.p;
            }

            if (M.currentCustomView) {
                id = M.currentCustomView.prefixPath + id;
            }

            this.openFolder(id)
                .always(() => {
                    if ($.selected.length) {
                        reselect(1);
                    }
                });
        }
        else if (specialCases.includes(id)) {
            this.openFolder(id);
        }
    }
})();
