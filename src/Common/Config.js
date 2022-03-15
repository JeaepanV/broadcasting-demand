module.exports = (function () {
	function Config() {}

	Config.prototype.Init = function () {
		mSiteCount = 51;
		mFilterIntervalTime = 125;
		mSameSiteIntervalTime = 45;
		mPitch = 100;
		mSpeechRate = 1;
	};

	/**
	 * 无障碍服务状态
	 */
	Object.defineProperty(Config.prototype, "ServiceEnabled", {
		/**
		 * 无障碍服务状态
		 */
		get: function () {
			return auto.service != null;
		},
		configurable: true,
		// enumerable: true,
	});

	/**
	 * 开发者模式
	 */
	let mDebugMode = false;
	Object.defineProperty(Config.prototype, "DebugMode", {
		/**
		 * 开发者模式
		 */
		get: function () {
			return mDebugMode;
		},
		configurable: true,
		// enumerable: true,
	});

	/**
	 * TTS状态
	 */
	let mEngineEnabled = false;
	Object.defineProperty(Config.prototype, "EngineEnabled", {
		/**
		 * TTS状态
		 */
		get: function () {
			return mEngineEnabled;
		},
		set: function (value) {
			mEngineEnabled = value;
		},
		configurable: true,
		enumerable: true,
	});

	/**
	 * 悬浮按钮显示状态
	 */
	let mFloatButtonShow = false;
	Object.defineProperty(Config.prototype, "FloatButtonShowed", {
		/**
		 * 悬浮按钮显示状态
		 */
		get: function () {
			return mFloatButtonShow;
		},
		set: function (value) {
			mFloatButtonShow = value;
		},
		configurable: true,
		enumerable: true,
	});

	/**
	 * 站点数量
	 */
	let mSiteCount = 51;
	Object.defineProperty(Config.prototype, "SiteCount", {
		/**
		 * 站点数量
		 */
		get: function () {
			return mSiteCount;
		},
		set: function (value) {
			mSiteCount = value;
		},
		configurable: true,
		enumerable: true,
	});

	/**
	 * 屏幕更新间隔时间
	 */
	let mFilterIntervalTime = 125;
	Object.defineProperty(Config.prototype, "FilterIntervalTime", {
		/**
		 * 屏幕更新间隔时间
		 */
		get: function () {
			return mFilterIntervalTime;
		},
		set: function (value) {
			mFilterIntervalTime = value;
		},
		configurable: true,
		enumerable: true,
	});

	/**
	 * 站点播报间隔时间
	 */
	let mSameSiteIntervalTime = 45;
	Object.defineProperty(Config.prototype, "SameSiteIntervalTime", {
		/**
		 * 站点播报间隔时间
		 */
		get: function () {
			return mSameSiteIntervalTime;
		},
		set: function (value) {
			mSameSiteIntervalTime = value;
		},
		configurable: true,
		enumerable: true,
	});

	/**
	 * 语音播报音高
	 */
	let mPitch = 100;
	Object.defineProperty(Config.prototype, "Pitch", {
		/**
		 * 语音播报音高
		 */
		get: function () {
			return mPitch;
		},
		set: function (value) {
			mPitch = value;
		},
		configurable: true,
		enumerable: true,
	});

	/**
	 * 语音播报速度
	 */
	let mSpeechRate = 1;
	Object.defineProperty(Config.prototype, "SpeechRate", {
		/**
		 * 语音播报速度
		 */
		get: function () {
			return mSpeechRate;
		},
		set: function (value) {
			mSpeechRate = value;
		},
		configurable: true,
		enumerable: true,
	});

	return Config;
})();
