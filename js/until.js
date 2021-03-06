var _GET = getGETArray();
//var g_s_api = 'php/';
var g_s_api = 'https://syosetsu.glitch.me/';
var g_localKey = 'syosetsu';
// 本地储存前缀
var g_config = local_readJson('config', {
    lastRead: '',
    patch: 1,
    rate: 1
});

function _s1(s, j = '') {
    s = parseInt(s);
    return (s == 0 ? '' : (s < 10 ? '0' + s : s) + j);
}

function _s2(s, j = '') {
    s = parseInt(s);
    return (s == 0 ? '' : s + j);
}


function _s(i) {
    return i < 10 ? '0' + i : i;
}


function getTime(s) {
    s = Number(s);
    var h = 0,
        m = 0;
    if (s >= 3600) {
        h = parseInt(s / 3600);
        s %= 3600;
    }
    if (s >= 60) {
        m = parseInt(s / 60);
        s %= 60;
    }
    return _s1(h, ':') + _s1(m, ':') + _s1(s);
}


function getTimeString(s) {
    s = Number(s);
    var h = 0,
        m = 0,
        d = 0;
    if (s >= 86400) {
        d = parseInt(s / 86400);
        s %= 86400;
    }
    if (s >= 3600) {
        h = parseInt(s / 3600);
        s %= 3600;
    }
    if (s >= 60) {
        m = parseInt(s / 60);
        s %= 60;
    }
    if (m <= 0) m = 1;
    return _s2(d, '日') + _s2(h, '时') + _s2(m, '分') + '前';
}

function getGETArray() {
    var a_result = [],
        a_exp;
    var a_params = window.location.search.slice(1).split('&');
    for (var k in a_params) {
        a_exp = a_params[k].split('=');
        if (a_exp.length > 1) {
            a_result[a_exp[0]] = decodeURIComponent(a_exp[1]);
        }
    }
    return a_result;
}

function local_saveJson(key, data) {
    if (window.localStorage) {
        key = g_localKey + key;
        data = JSON.stringify(data);
        if (data == undefined) data = '[]';
        return localStorage.setItem(key, data);
    }
    return false;
}

function local_readJson(key, defaul = '') {
    if (!window.localStorage) return defaul;
    key = g_localKey + key;
    var r = JSON.parse(localStorage.getItem(key));
    return r === null ? defaul : r;
}

function getLocalItem(key, defaul = '') {
    var r = null;
    if (window.localStorage) {
        r = localStorage.getItem(g_localKey + key);
    }
    return r === null ? defaul : r;
}

function setLocalItem(key, value) {
    if (window.localStorage) {
        return localStorage.setItem(g_localKey + key, value);
    }
    return false;
}

function randNum(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
}

function getNow() {
    return parseInt(new Date().getTime());
}