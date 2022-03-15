module.exports = (function () {
	function Finder() {}

	const mPackageName = "com.xunmeng.tms";
	Object.defineProperty(Finder.prototype, "PackageName", {
		get: function () {
			return mPackageName;
		},
		configurable: true,
		// enumerable: true,
	});

	const mMainActivity = "com.xunmeng.tms.activity.FlutterMainActivity";
	Object.defineProperty(Finder.prototype, "MainActivity", {
		get: function () {
			return mMainActivity;
		},
		configurable: true,
		// enumerable: true,
	});

	let mEditText = "android.widget.EditText";
	Object.defineProperty(Finder.prototype, "EditText", {
		get: function () {
			return mEditText;
		},
		configurable: true,
		// enumerable: true,
	});

	let mImageView = "android.widget.ImageView";
	Object.defineProperty(Finder.prototype, "ImageView", {
		get: function () {
			return mImageView;
		},
		configurable: true,
		// enumerable: true,
	});

	let mSwitch = "android.widget.Switch";
	Object.defineProperty(Finder.prototype, "Switch", {
		get: function () {
			return mSwitch;
		},
		configurable: true,
		// enumerable: true,
	});

	let mTextView = "android.widget.TextView";
	Object.defineProperty(Finder.prototype, "TextView", {
		get: function () {
			return mTextView;
		},
		configurable: true,
		// enumerable: true,
	});

	let mView = "android.view.View";
	Object.defineProperty(Finder.prototype, "View", {
		get: function () {
			return mView;
		},
		configurable: true,
		// enumerable: true,
	});

	/**
	 * 单品标题选择器
	 */
	var mSingleGoodsTitle = packageName(mPackageName)
		.className(mView)
		.descMatches(/商品播种拣货详情/);
	Object.defineProperty(Finder.prototype, "SingleGoodsTitle", {
		/**
		 * 单品标题选择器
		 */
		get: function () {
			return mSingleGoodsTitle;
		},
		configurable: true,
		enumerable: true,
	});

	/**
	 * 单品站点列表选择器
	 */
	var mSingleSiteList = packageName(mPackageName)
		.className(mView)
		.rowCount(51)
		.scrollable();
	Object.defineProperty(Finder.prototype, "SingleSiteList", {
		/**
		 * 单品站点列表选择器
		 */
		get: function () {
			return mSingleSiteList;
		},
		set: function (count) {
			if (count != null && count != "") {
				mSingleSiteList = packageName(mPackageName)
					.className(mView)
					.rowCount(count)
					.scrollable();
			}
		},
		configurable: true,
		enumerable: true,
	});

    /**
     * 多品标题选择器
     */
    var mMultiGoodsTitle = packageName(mPackageName)
        .className(mView)
        .descMatches(/多品合并分拣详情/);
    Object.defineProperty(Finder.prototype, "MultiGoodsTitle", {
        /**
         * 多品标题选择器
         */
        get: function () {
            return mMultiGoodsTitle;
        },
        configurable: true,
        enumerable: true,
    });

    /**
     * 多品站点选择器
     */
    var mMultiSite = packageName(mPackageName)
        .className(mView)
        .descMatches(/(.*)([\r\n]*)(\d+)个商品正在同时分拣[\r\n]S(\d+)[\r\n](.+)/)
    Object.defineProperty(Finder.prototype, "MultiSite", {
        /**
         * 多品分拣站点选择器
         */
        get: function () {
            return mMultiSite;
        },
        configurable: true,
        enumerable: true,
    });

    /**
     * 待分拣货物数量选择器
     */
    var mGoods2BeSorted = packageName(mPackageName)
        .className(mView)
        .descMatches(/(\d)+个商品待分拣/)
    Object.defineProperty(Finder.prototype, "Goods2BeSorted", {
        /**
         * 待分拣货物数量选择器
         */
        get: function () {
            return mGoods2BeSorted;
        },
        configurable: true,
        enumerable: true,
    });

	return Finder;
})();
