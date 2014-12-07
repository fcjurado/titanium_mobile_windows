function FontAwesome() {
    switch (Ti.Platform.osname) {
      case "iphone":
      case "ipad":
        this.fontfamily = "FontAwesome";
        break;

      case "android":
        this.fontfamily = "fontawesome-webfont";
    }
    this.charcode = {
        glass: 61440,
        music: 61441,
        search: 61442,
        envelope: 61443,
        heart: 61444,
        star: 61445,
        starEmpty: 61446,
        user: 61447,
        film: 61448,
        thLarge: 61449,
        th: 61450,
        thList: 61451,
        ok: 61452,
        remove: 61453,
        zoomIn: 61454,
        zoomOut: 61456,
        off: 61457,
        signal: 61458,
        cog: 61459,
        trash: 61460,
        home: 61461,
        file: 61462,
        time: 61463,
        road: 61464,
        downloadAlt: 61465,
        download: 61466,
        upload: 61467,
        inbox: 61468,
        playCircle: 61469,
        repeat: 61470,
        refresh: 61473,
        listAlt: 61474,
        lock: 61475,
        flag: 61476,
        headphones: 61477,
        volumeOff: 61478,
        volumeDown: 61479,
        volumeUp: 61480,
        qrcode: 61481,
        barcode: 61482,
        tag: 61483,
        tags: 61484,
        book: 61485,
        bookmark: 61486,
        print: 61487,
        camera: 61488,
        font: 61489,
        bold: 61490,
        italic: 61491,
        textHeight: 61492,
        textWidth: 61493,
        alignLeft: 61494,
        alignCenter: 61495,
        alignRight: 61496,
        alignJustify: 61497,
        list: 61498,
        indentLeft: 61499,
        indentRight: 61500,
        facetimeVideo: 61501,
        picture: 61502,
        pencil: 61504,
        mapMarker: 61505,
        adjust: 61506,
        tint: 61507,
        edit: 61508,
        share: 61509,
        check: 61510,
        move: 61511,
        stepBackward: 61512,
        fastBackward: 61513,
        backward: 61514,
        play: 61515,
        pause: 61516,
        stop: 61517,
        forward: 61518,
        fastForward: 61520,
        stepForward: 61521,
        eject: 61522,
        chevronLeft: 61523,
        chevronRight: 61524,
        plusSign: 61525,
        minusSign: 983126,
        removeSign: 61527,
        okSign: 61528,
        questionSign: 61529,
        infoSign: 61530,
        screenshot: 61531,
        removeCircle: 61532,
        okCircle: 61533,
        banCircle: 61534,
        arrowLeft: 61536,
        arrowRight: 61537,
        arrowUp: 61538,
        arrowDown: 61539,
        shareAlt: 61540,
        resizeFull: 61541,
        resizeSmall: 61542,
        plus: 61543,
        minus: 61544,
        asterisk: 61545,
        exclamationSign: 61546,
        gift: 61547,
        leaf: 61548,
        fire: 61549,
        eyeOpen: 61550,
        eyeClose: 61552,
        warningSign: 61553,
        plane: 61554,
        calendar: 61555,
        random: 61556,
        comment: 61557,
        magnet: 61558,
        chevronUp: 61559,
        chevronDown: 61560,
        retweet: 61561,
        shoppingCart: 61562,
        folderClose: 61563,
        folderOpen: 61564,
        resizeVertical: 61565,
        resizeHorizontal: 61566,
        barChart: 61568,
        twitterSign: 61569,
        facebookSign: 61570,
        cameraRetro: 61571,
        key: 61572,
        cogs: 61573,
        comments: 61574,
        thumbsUp: 61575,
        thumbsDown: 61576,
        starHalf: 61577,
        heartEmpty: 61578,
        signout: 61579,
        linkedinSign: 61580,
        pushpin: 61581,
        externalLink: 61582,
        signin: 61584,
        trophy: 61585,
        githubSign: 61586,
        uploadAlt: 61587,
        lemon: 61588,
        phone: 61589,
        checkEmpty: 61590,
        bookmarkEmpty: 61591,
        phoneSign: 61592,
        twitter: 61593,
        facebook: 61594,
        github: 61595,
        unlock: 61596,
        creditCard: 61597,
        rss: 61598,
        hdd: 61600,
        bullhorn: 61601,
        bell: 61602,
        certificate: 61603,
        handRight: 61604,
        handLeft: 61605,
        handUp: 61606,
        handDown: 61607,
        circleArrowLeft: 61608,
        circleArrowRight: 61609,
        circleArrowUp: 61610,
        circleArrowDown: 61611,
        globe: 61612,
        wrench: 61613,
        tasks: 61614,
        filter: 61616,
        briefcase: 61617,
        fullscreen: 61618,
        group: 61632,
        link: 61633,
        cloud: 61634,
        beaker: 61635,
        cut: 61636,
        copy: 61637,
        paperClip: 61638,
        save: 61639,
        signBlank: 61640,
        reorder: 61641,
        listUl: 61642,
        listOl: 61643,
        strikethrough: 61644,
        underline: 61645,
        table: 61646,
        magic: 61648,
        truck: 61649,
        pinterest: 61650,
        pinterestSign: 61651,
        googlePlusSign: 61652,
        googlePlus: 61653,
        money: 61654,
        caretDown: 61655,
        caretUp: 61656,
        caretLeft: 61657,
        caretRight: 61658,
        columns: 61659,
        sort: 61660,
        sortDown: 61661,
        sortUp: 61662,
        envelopeAlt: 61664,
        linkedin: 61665,
        undo: 61666,
        legal: 61667,
        dashboard: 61668,
        commentAlt: 61669,
        commentsAlt: 61670,
        bolt: 61671,
        sitemap: 61672,
        umbrella: 61673,
        paste: 61674,
        userMd: 61952
    };
}

FontAwesome.prototype.getCharcode = function(options) {
    return this.charcode[options];
};

module.exports = FontAwesome;