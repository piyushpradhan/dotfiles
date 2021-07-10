/** @function window.trk */
lazy(self, 'trk', function() {
    'use strict';
    const queue = [];
    const storage = localStorage;
    const nav = Object.create(null);
    const apipath = storage.bap || window.apipath;
    const parse = tryCatch(JSON.parse.bind(JSON));
    const stringify = tryCatch(JSON.stringify.bind(JSON));
    const encode = tryCatch(s => base64urlencode(to8(s)));
    const log = console.debug.bind(console, '[trk.debug]');
    const res = tryCatch(() => screen.width + 'x' + screen.height);
    const utm = storage.utm && parse(storage.utm) || {};
    const urx = /^(file|folder|chat|embed|download|megadrop|fm\/(?:contacts|[\w-]{12,}|[\w-]{9,10}|[\w-]{3,7})|fm)\b/;
    const epx = [
        'businessinvite', 'businesssignup', 'cancel', 'confirm',
        'discount', 'emailverify', 'newsignup', 'payment', 'pwrevert', 'recover',
        'unsub', 'verify', 'voucher'
    ];
    const idsite = location.host === 'mega.io' ? 2 : 1;
    let disabled = !storage.trk && (!is_livesite || !mega.flags.sra);

    const send = async(data) => {
        // @notice Dear user, don't hesitate to disable sendBeacon in your browser if you feel concerned about this.
        if (typeof navigator.sendBeacon !== 'function') {
            return EACCESS;
        }
        const s = stringify([data]);
        if (d) {
            log(s.length, data);
        }
        let url = apipath + 'cs?id=0&utm=1';
        if (storage.sid) url += '&sid=' + storage.sid;
        url += mega.urlParams();
        return navigator.sendBeacon(url, s);
    };

    const save = async(lts) => {
        storage.utm = stringify(Object.assign(utm, {lts: lts || Math.floor(Date.now() / 1e3)})) || storage.utm;
        return utm.lts;
    };

    const sra = async() => utm.cid || mega.flags.sra || M.req('sra');

    const uri = tryCatch((page = '', pex = /[^\d/_a-z-].*$/) => {
        let i = epx.length;

        page = mURIDecode(page);
        while (i--) {
            if (page.startsWith(epx[i])) {
                break;
            }
        }

        if (i >= 0) {
            page = page.substr(0, epx[i].length);
        }
        const map = {'download': 'file'};
        const uri = urx.test(page) && RegExp.$1 || page[0] === '!' && 'embed';

        console.assert(nav.id);
        return String(map[uri] || uri || page).replace(pex, '~');
    });

    const ref = tryCatch((url) => {
        url = new URL(url && url.href || url || document.referrer);
        let result = url.origin;

        if (/(?:^|\.)mega\.(?:co\.nz|nz|io)$/.test(url.host)) {
            // our site, include the path with any private data removed.
            result += '/' + uri(url.pathname.substr(1), '<>').split(/[!#?]/)[0];
        }

        return result;
    }, false);

    const dsp = async() => {
        delay.cancel('trk:dsp');
        if (!queue.length || navigator.onLine === false) {
            return null;
        }

        const q = [];
        const k = Object.create(null);
        for (let i = queue.length; i--;) {
            let e = queue[i];
            let o = Object.create(null);

            o.ts = e[0];
            o.uri = e[4];
            o.res = res();
            o.pv_id = e[5];
            o.urlref = ref();
            o._viewts = e[3];
            o.action_name = e[1];
            q.push(Object.assign(o, e[2]));

            // eslint-disable-next-line guard-for-in
            for (let x in o) {
                if (typeof o[x] === 'string') {
                    o[x] = encode(o[x]) || o[x];
                }
                x = x + '!' + o[x];
                k[x] = (k[x] | 0) + 1;
            }
        }
        const r = {a: 'ra', q: q, cid: utm.cid, idsite, _idts: utm.fts};

        if (queue.length > 1) {
            // deduplicate
            for (let j in k) {
                if (k[j] === queue.length) {
                    [j] = j.split('!');
                    r[j] = q[0][j];
                    for (let u = q.length; u--;) {
                        delete q[u][j];
                    }
                }
            }
        }

        queue.length = 0;
        if (d) {
            console.table(q);
        }
        return send(r);
    };

    const pf = async() => {
        const res = {};
        const ptm = window.performance && performance.timing || false;
        const add = (k, v) => {
            res[k] = v > 0 ? v : res[k];
        };

        add('gt_ms', window.pageLoadTime);
        add('pf_net', ptm.connectEnd - ptm.fetchStart);
        add('pf_tfr', ptm.responseEnd - ptm.responseStart);
        add('pf_dm1', ptm.domInteractive - ptm.domLoading);
        add('pf_dm2', ptm.domComplete - ptm.domInteractive);
        add('pf_srv', ptm.responseStart - ptm.requestStart);
        add('pf_onl', ptm.loadEventEnd - ptm.loadEventStart);

        return res;
    };

    const gClickHandler = async(ev) => {
        const t = ev.target || false;

        if (M.chat || $.dialog === 'cookies-dialog') {
            return;
        }
        let a = t;
        while (a && a.nodeName !== 'A') {
            a = a.parentNode;
        }

        if (a && a.target === '_blank') {
            let link = ref(a.href);
            if (link) {
                console.assert(nav.pv);
                await trk(nav.pv, {link: link});
            }
        }
    };

    const disable = async(reason) => {
        window.removeEventListener('online', dsp);
        window.removeEventListener('pagehide', dsp);
        window.removeEventListener('beforeunload', dsp);
        window.removeEventListener('visibilitychange', dsp);
        window.removeEventListener('click', gClickHandler, true);
        if (d) {
            log('disabled', reason);
        }
        disabled = true;
        queue.length = 0;
        delete window.trk;
        window.trk = () => Promise.resolve(EACCESS);
        return EACCESS;
    };

    const enqueue = async(action, data) => {
        let ca = 1;
        const now = new Date();
        const ts = Math.floor(now.getTime() / 1e3);

        if (!utm.cid) {
            const cid = await sra().catch(echo);
            if (typeof cid !== 'string' || cid.length !== 16) {
                return disable(cid);
            }
            // onIdle(dsp);
            utm.fts = ts;
            utm.cid = cid;
        }

        if (typeof action !== 'string') {
            data = action;
            action = undefined;
        }
        else if (action.startsWith('nav')) {
            if (!nav.id) {
                data = Object.assign({}, window.uTagUTM, window.uTagMTM, data, await pf().catch(nop));
            }

            if (action.indexOf('^page:') > 0) {
                action = action.replace(/\^page: \/\s*([^/]+)/, (m,p) => uri(p));
            }

            if (nav.pv !== action) {
                nav.pv = action;
                nav.ev = new Set();
                nav.id = Math.random().toString(28).slice(-6);
            }
            ca = 0;
        }

        data = Object.assign({
            h: now.getHours(),
            m: now.getMinutes(),
            s: now.getSeconds(),
            lang: mega.intl.locale
        }, data);

        if (data.e_c) {
            const ev = [data.e_c, data.e_a].join('/');
            if (nav.ev.has(ev)) {
                if (d) {
                    log('ev.de-dup', ev, [data]);
                }
                return EEXIST;
            }
            nav.ev.add(ev);
        }
        if (data.ec_id) {
            data.idgoal = 0;
            data._ects = utm.ets;
            utm.ets = ts;
        }
        if (ca) {
            data.ca = ca;
        }

        queue.push([ts, action, data, utm.lts, uri(page), nav.id]);
        delay('trk:dsp', dsp, 2e5);
        return save(ts);
    };

    window.addEventListener('online', dsp);
    window.addEventListener('pagehide', dsp);
    window.addEventListener('beforeunload', dsp);
    window.addEventListener('visibilitychange', dsp);
    window.addEventListener('click', gClickHandler, true);

    if (disabled) {
        disable('ctx').always(nop);
        return () => Promise.resolve(EACCESS);
    }

    let allow;
    return async(action, data) => {
        if (!allow && 'csp' in window) {
            await csp.init();
            if (!csp.has('analytics')) {
                return disable('csp');
            }
            allow = true;
        }
        if (action === 'd1sab1e!') {
            return disable(action);
        }
        return disabled ? EACCESS : enqueue(action, data);
    };
});


(function trkEventHandler() {
    'use strict';
    const bev = [];
    const log = console.debug.bind(console, '[trk.debug]');
    const split = (t, s) => String(s).split(t).map(String.trim).filter(String);
    const filter = (s, p, r) => String(s || '').replace(p || /["'<=>]/g, r || '');
    const pubLinkMap = {'!': 'embed', 'F!': 'folder', 'P!': 'pp', 'E!': 'embed', 'D!': 'drop'};
    const pubLinkRex = /^(?:chat|file|folder|embed|drop|pp)\b/;
    let lastMetaTags = null;

    const isPubLink = (page) => {
        page = getCleanSitePath(page).replace(/^[D-FP]?!/, m => pubLinkMap[m] + '/');
        return pubLinkRex.test(page) ? page.split(/\W/)[0] : false;
    };

    const shutdown = (v) => {
        if (v === EACCESS || v === ENOENT) {
            delay.cancel('trk.ping');
            delay.cancel('trk.live-loop');
            for (let i = bev.length; i--;) {
                mBroadcaster.removeListener(bev[i]);
            }
            if (d) {
                log('shutdown');
            }
            trk('d1sab1e!').always(nop);
        }
        return v;
    };

    const getCleanPath = (page) => {
        let last;
        let leap = {
            chat: {p: 'private', g: 'group', c: 'public'}
        };
        const path = split('/', page).map(p => {

            if (p === M.RootID) {
                return 'root';
            }
            if (p === M.InboxID) {
                return 'inbox';
            }
            if (p === M.RubbishID) {
                return 'rubbish-bin';
            }
            if (last === 'fm' && p.length === 8 && p !== 'contacts') {
                return M.currentrootid === 'shares' ? 'shared-folder' : 'folder';
            }
            if (p.length === 11) {
                return 'contact';
            }
            if (leap[last]) {
                p = leap[last][p] || p;
            }

            last = p;
            return p;
        });

        if (path[0] === 'fm') {
            path[0] = 'cloud-drive';

            if (path[1] === 'out-shares' || path[1] === 'public-links') {
                path.splice(2);
            }
        }

        if (path[1] === 'chat' && path.length > 3) {
            // remove room-id
            path.splice(path.length - 1, 1);
        }

        return path.map(String.trim).filter(String);
    };

    const siteSearchData = (term, section, count) => {
        if (section !== 'help') {
            // anonymize search term/keyword
            term = Array(1 + Math.min(32, term.length)).join('a');
        }
        const res = {search: filter(term), search_cat: filter(section), search_count: count | 0};
        if (d) {
            log(res);
        }
        return res;
    };

    const nav = async(sections) => {
        if (!sections || !sections.length) {
            let link = isPubLink();

            if (link) {
                sections = ['public-link', link];
            }
            else if (page.startsWith('fm')) {
                sections = getCleanPath(page);
            }
            else if (/^\w+$/.test(page)) {
                sections = ['^page:', page];
            }
            else {
                log('unhandled page', page);
                return;
            }
        }

        let last = sections.join('/');
        if (last === nav.last) {
            if (d) {
                log('nav.de-dup', last);
            }
            return EEXIST;
        }
        nav.last = last;

        (function _(v) {
            if (v !== EACCESS) {
                delay('trk.ping', () => trk({ping: 1}).then(_), 9e4);
            }
        })();

        let data = {};
        if ((sections[0] === 'cloud-drive' || sections[0] === 'help') && sections[1] === 'search') {
            data = sections[2] && siteSearchData(sections[2], sections[0], M.v.length) || data;
            sections = sections.slice(0, 2);
        }

        if (d) {
            log('nav', sections, data);
        }
        return trk(['nav'].concat(sections).join(' / '), data).then(shutdown);
    };
    nav.last = null;

    const onPageMetaData = (meta) => {
        if (isPubLink() || page.startsWith('fm')) {
            lastMetaTags = null;
            return;
        }
        lastMetaTags = meta;

        if (meta.dynamic) {
            return;
        }

        let title =
            split(' - ', String(!meta.excluded && (meta.en_title || meta.mega_title) || '').replace(/MEGA('s)?/g, ''));

        if (title.length) {
            if (meta.section === 'help') {
                title = title.reverse();
                console.assert(title[0].endsWith('Help'));
                title[0] = title[0].replace(/\s*Help/, '');
                title.unshift('Help');
            }
        }
        else {
            let idx = meta.excluded > 1 ? meta.excluded : page.length;
            title = split('_', page.substr(0, idx).replace(/\//g, '_').replace(/\W.*$/, ''));
        }

        title = title.map(s => s.toLowerCase());

        nav(title).catch(log);
    };

    // these pages will perform an straight redirection and/or are being lazy-loaded, so we will log them later
    const pageChangeExclude = {
        'help': 1,
        'chat': 1,
        'fm/chat': 1,
    };

    const onPageChange = (page) => {
        if (window.jsl && jsl.length > 0) {
            mBroadcaster.once('startMega', () => {
                onIdle(() => onPageChange(page));
            });
            return;
        }

        if ((!lastMetaTags || lastMetaTags.page !== page) && !pageChangeExclude[page]) {
            return nav().catch(log);
        }

        if (d > 1) {
            log('Ignoring page-change event...', page, [lastMetaTags]);
        }
    };

    const onSiteEvent = async(category, action, name, value) => {
        if (d) {
            log('event', category, action, name, value);
        }

        if (['download', 'upload', 'videostream'].indexOf(category) > -1) {
            return EINTERNAL;
        }

        if (category === 'download' && action === 'completed' && page === category) {
            return trk({download: getBaseUrl() + '/file/' + dlpage_ph});
        }
        if (action === 'started' && (category === 'download' || category === 'upload')) {
            // @todo decide whether disabling completely.
            return EAGAIN;
        }

        trk({
            e_c: filter(category),
            e_a: filter(action),
            e_n: filter(name) || undefined,
            e_v: parseFloat(value) || undefined
        });
    };

    const onSiteSearch = (term, section, count) => {
        trk(siteSearchData(term, section, count)).then(shutdown).catch(dump);
    };

    const onTreeSearch = (term, section, count) => {
        if (count === undefined) {
            const tsp = '.content-panel.active :not(.tree-item-on-search-hidden) > .nw-fm-tree-item.ui-draggable';
            count = document.querySelectorAll(tsp).length;
        }
        onSiteSearch(term, 'ts:' + section, count);
    };

    bev.push(mBroadcaster.addListener('trk:event', onSiteEvent));
    bev.push(mBroadcaster.addListener('sitesearch', SoonFc(40, onSiteSearch)));
    bev.push(mBroadcaster.addListener('treesearch', SoonFc(60, onTreeSearch)));
    bev.push(mBroadcaster.addListener('pagechange', SoonFc(80, onPageChange)));
    bev.push(mBroadcaster.addListener('pagemetadata', tryCatch(onPageMetaData)));

    mBroadcaster.once('startMega', () => {
        if (!/help|chat/.test(page)) {
            onIdle(() => onPageChange(page));
        }

        (function _() {
            delay('trk.live-loop', () => M.req('sra').then(_).catch(shutdown), 7e6);
        })();
    });
})();
