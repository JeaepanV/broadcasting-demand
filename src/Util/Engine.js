importPackage(android.speech.tts);
importClass(java.util.Locale);

module.exports = (function () {
	const TAG = "Engine";
	let obj = null;
	let enabled = false;
	var TTSEngine = function () {
		this.pitch = 1;
		this.speechRate = 1;
		// 监听语音引擎是否启动成功
		// 启动成功后设置音高和速度
		events.broadcast.on("EngineEnabled", (value) => {
			enabled = value;
			if (enabled) {
				obj.setPitch(this.pitch);
				obj.setSpeechRate(this.speechRate);
			}
		});
	};

	/**
	 * 启动语音引擎
	 * @returns 返回引擎对象, 链式调用
	 */
	TTSEngine.prototype.Start = function () {
		if (obj == null) {
			obj = new TextToSpeech(context, function (status) {
				if (status != obj.SUCCESS) {
					toast("语音引擎: 运行失败");
					console.error(TAG, "语音引擎: 运行失败");
					events.broadcast.emit("EngineEnabled", false);
					return this;
				}

				if (obj.setLanguage(Locale.CHINA) != obj.SUCCESS) {
					toast("语音引擎: 设置中文失败");
					console.error(TAG, "语音引擎: 设置中文失败");
					events.broadcast.emit("EngineEnabled", false);
					return this;
				}
				events.broadcast.emit("EngineEnabled", true);
				toast("语音引擎: 运行成功");
				console.info(TAG, "语音引擎: 运行成功");
			});
		}
		return this;
	};

	/**
	 * 关闭语音引擎
	 * @returns 返回引擎对象, 链式调用
	 */
	TTSEngine.prototype.Stop = function () {
		if (obj) {
			obj.stop();
			obj = null;
			events.broadcast.emit("EngineEnabled", false);
		}
		return this;
	};

	/**
	 * 语音播报
	 * @returns 返回引擎对象, 链式调用
	 */
	TTSEngine.prototype.Say = function (text) {
		if (enabled) {
			obj.speak(text, TextToSpeech.QUEUE_ADD, null);
		}
		return this;
	};

	/**
	 * 停止播报
	 * @returns 返回引擎对象, 链式调用
	 */
	TTSEngine.prototype.Shutup = function () {
		if (enabled) {
			obj.stop();
		}
		return this;
	};

	/**
	 * 设置说话音高
	 * @returns 返回引擎对象, 链式调用
	 */
	TTSEngine.prototype.SetPitch = function (pitch) {
		this.pitch = pitch / 100;
		if (enabled) {
			obj.setPitch(this.pitch);
		}
		return this;
	};

	/**
	 * 设置说话速度
	 * @returns 返回引擎对象, 链式调用
	 */
	TTSEngine.prototype.SetSpeechRate = function (rate) {
		this.speechRate = rate;
		if (enabled) {
			obj.setSpeechRate(this.speechRate);
		}
		return this;
	};

	events.on("exit", function () {
		if (enabled) {
			obj.stop();
			obj.shutdown();
			obj = null;
		}
	});

	return TTSEngine;
})();
