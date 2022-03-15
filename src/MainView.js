"ui";
require("./Widget/widget-switch-se7en");
let Config = require("./Common/Config");
let Finder = require("./Common/Finder");
let Engine = require("./Util/Engine");
let { FloatButton, FloatButtonConfig } = require("./Widget/FloatButton/init");
let PrintExceptionStack = require("./Util/PrintExceptionStack");

let _config = new Config();
let _finder = new Finder();
let _floatButton = new FloatButton();
let _engine = new Engine();
let _engineEnabled = false;
let _storage = storages.create("org_l_tts");

// 监听TTS运行状态
events.broadcast.on("EngineEnabled", (status) => {
	_engineEnabled = status;
	_config.EngineEnabled = status;
});

// 加载配置
for (let key in _config) {
	try {
		if (key != "Init") {
			_config[key] = _storage.get(key) || _config[key];
		}
	} catch (error) {
		PrintExceptionStack(error);
	}
}

// 保存配置
events.on("exit", function () {
	try {
		for (let key in _config) {
			if (key != "Init") {
				_storage.put(key, _config[key]);
			}
		}
	} catch (error) {
		PrintExceptionStack(error);
	}
});

_finder.SingleSiteList = _config.SiteCount;
if (_config.EngineEnabled) {
	_engine.SetPitch(_config.Pitch).SetSpeechRate(_config.SpeechRate).Start();
}

let _runnig = false;
let _window_content_changed_event = null;

let _siteCurrId = null;
let _siteOverId = null;

let _filterCurrTime = 0;
let _filterOverTime = 0;

let _sameSiteCurrTime = 0;
let _sameSiteOverTime = 0;

let _thread = threads.currentThread();

//#region UI

ui.layout(
	<drawer>
		<vertical>
			<appbar>
				<toolbar id="Toolbar" title="播报需求" />
				<tabs id="Tabs" />
			</appbar>

			<viewpager id="ViewPager">
				<frame>
					<vertical>
						<card
							h="40dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<widget-switch-se7en
								id="ServiceSwitch"
								text="无障碍服务"
								radius="16"
								margin="16 0"
								checked="{{_config.ServiceEnabled}}"
							/>
						</card>

						<card
							h="40dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<widget-switch-se7en
								id="FloatButtonSwitch"
								text="悬浮按钮"
								radius="16"
								margin="16 0"
								checked="{{_config.FloatButtonShowed}}"
							/>
						</card>

						<card
							h="40dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<widget-switch-se7en
								id="EngineSwitch"
								text="语音引擎"
								radius="16"
								margin="16 0"
								checked="{{_config.EngineEnabled}}"
							/>
						</card>

						<card
							h="64dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<vertical gravity="center">
								<horizontal gravity="center|left">
									<text
										text="站点数量"
										textStyle="bold"
										margin="16 0"
									/>

									<text
										id="SiteCountView"
										text="{{_config.SiteCount}}"
										textStyle="bold"
										layout_weight="1"
										gravity="right"
										margin="16 0"
									/>
								</horizontal>
								<seekbar
									id="SiteCountViewSeekbar"
									progress="{{_config.SiteCount}}"
									max="100"
								/>
							</vertical>
						</card>

						<card
							h="64dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<vertical gravity="center">
								<horizontal gravity="center|left">
									<text
										text="屏幕更新间隔时间"
										textStyle="bold"
										margin="16 0"
									/>

									<text
										id="FilterIntervalTimeView"
										text="{{_config.FilterIntervalTime}}"
										textStyle="bold"
										layout_weight="1"
										gravity="right"
										margin="16 0"
									/>
								</horizontal>
								<seekbar
									id="FilterIntervalTimeViewSeekbar"
									progress="{{_config.FilterIntervalTime}}"
									max="500"
								/>
							</vertical>
						</card>

						<card
							h="64dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<vertical gravity="center">
								<horizontal gravity="center|left">
									<text
										text="相同站点播报间隔时间"
										textStyle="bold"
										margin="16 0"
									/>

									<text
										id="SameSiteIntervalTimeView"
										text="{{_config.SameSiteIntervalTime}}"
										textStyle="bold"
										layout_weight="1"
										gravity="right"
										margin="16 0"
									/>
								</horizontal>
								<seekbar
									id="SameSiteIntervalTimeViewSeekbar"
									progress="{{_config.SameSiteIntervalTime}}"
									max="240"
								/>
							</vertical>
						</card>

						<card
							h="64dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<vertical gravity="center">
								<horizontal gravity="center|left">
									<text
										text="语音播报音高"
										textStyle="bold"
										margin="16 0"
									/>

									<text
										id="PitchView"
										text="{{_config.Pitch}}"
										textStyle="bold"
										layout_weight="1"
										gravity="right"
										margin="16 0"
									/>
								</horizontal>
								<seekbar
									id="PitchViewSeekbar"
									progress="{{_config.Pitch}}"
									max="100"
								/>
							</vertical>
						</card>

						<card
							h="64dp"
							margin="0 8 0 2"
							cardCornerRadius="2dp"
							cardElevation="1dp"
							foreground="?selectableItemBackground"
						>
							<vertical gravity="center">
								<horizontal gravity="center|left">
									<text
										text="语音播报速度"
										textStyle="bold"
										margin="16 0"
									/>

									<text
										id="SpeechRateView"
										text="{{_config.SpeechRate}}"
										textStyle="bold"
										layout_weight="1"
										gravity="right"
										margin="16 0"
									/>
								</horizontal>
								<seekbar
									id="SpeechRateViewSeekbar"
									progress="{{_config.SpeechRate}}"
									max="100"
								/>
							</vertical>
						</card>

						<button
							id="RunningButton"
							text="启 动"
							textColor="#FFFFFF"
							backgroundTint="#41A4F5"
							margin="0 8 0 2"
						/>
					</vertical>
				</frame>
				<frame>
					<text
						text="待定..."
						textStyle="bold"
						textSize="22"
						gravity="center"
					/>
				</frame>
			</viewpager>
		</vertical>
	</drawer>
);

// 创建选项菜单
ui.emitter.on("create_options_menu", (menu) => {
	menu.add("日志");
	menu.add("设置");
	menu.add("关于");
	menu.add("退出");
});

// 监听菜单点击
ui.emitter.on("options_item_selected", (event, item) => {
	switch (item.getTitle()) {
		case "日志":
			app.startActivity("console");
			// console.log(TAG, "console");
			break;
		case "设置":
			app.startActivity("settings");
			// console.log(TAG, "settings");
			break;
		case "关于":
			// console.log(TAG, "about");
			break;
		case "退出":
			exit();
			// console.log(TAG, "exit");
			break;
	}
});
activity.setSupportActionBar(ui.Toolbar);

// 设置滑动页面标题
ui.ViewPager.setTitles(["设置", "记录"]);
// 滑动页面和标签栏联动
ui.Tabs.setupWithViewPager(ui.ViewPager);

// 当用户在本界面点击返回键时, back_pressed事件会被出发
var mCanFinished = false;
var mCanFinishedTimeout = null;
ui.emitter.on("back_pressed", (event) => {
	if (!mCanFinished) {
		mCanFinished = true;
		mCanFinishedTimeout = setTimeout(function () {
			mCanFinished = false;
		}, 1000);
		event.consumed = true;
	} else {
		clearTimeout(mCanFinishedTimeout);
		event.consumed = false;
	}
});

// 当用户离开本界面时, pause事件会被触发
ui.emitter.on("pause", function () {});

// 当用户回到本界面时, resume事件会被触发
ui.emitter.on("resume", function () {
	ui.ServiceSwitch.checked = _config.ServiceEnabled;
});

// 无障碍服务开关
ui.ServiceSwitch.setThumbTexts("on", "off");
ui.ServiceSwitch.setThumbTextColors("#003366", "#999999");
ui.ServiceSwitch.on("check", (checked) => {
	if (checked && !_config.ServiceEnabled) {
		app.startActivity({
			action: "android.settings.ACCESSIBILITY_SETTINGS",
		});
	} else if (!checked && _config.ServiceEnabled) {
		auto.service.disableSelf();
	}
});

// 悬浮按钮开关
ui.FloatButtonSwitch.setThumbTexts("on", "off");
ui.FloatButtonSwitch.setThumbTextColors("#003366", "#999999");
ui.FloatButtonSwitch.on("check", (checked) => {
	if (floaty.checkPermission()) {
		checked ? _floatButton.show() : _floatButton.hide();
		_config.FloatButtonShowed = checked;
	} else {
		ui.FloatButtonSwitch.checked = false;
		floaty.requestPermission();
	}
});

// TTS开关
ui.EngineSwitch.setThumbTexts("on", "off");
ui.EngineSwitch.setThumbTextColors("#003366", "#999999");
ui.EngineSwitch.on("check", (checked) => {
	if (checked && !_engineEnabled) {
		_engine
			.SetPitch(_config.PitchRate)
			.SetSpeechRate(_config.SpeechRate)
			.Start();
	} else if (!checked && _engineEnabled) {
		_engine.Stop();
	}
});

// 站点数量
ui.SiteCountViewSeekbar.setOnSeekBarChangeListener({
	onProgressChanged: function (seekBar, progress, fromUser) {
		ui.SiteCountView.setText(progress.toString());
		_config.SiteCount = progress;
	},
});

// 屏幕更新间隔时间
ui.FilterIntervalTimeViewSeekbar.setOnSeekBarChangeListener({
	onProgressChanged: function (seekBar, progress, fromUser) {
		ui.FilterIntervalTimeView.setText(progress.toString());
		_config.FilterIntervalTime = progress;
	},
});

// 相同站点播报间隔时间
ui.SameSiteIntervalTimeViewSeekbar.setOnSeekBarChangeListener({
	onProgressChanged: function (seekBar, progress, fromUser) {
		ui.SameSiteIntervalTimeView.setText(progress.toString());
		_config.SameSiteIntervalTime = progress;
	},
});

// 语音播报音高
ui.PitchViewSeekbar.setOnSeekBarChangeListener({
	onProgressChanged: function (seekBar, progress, fromUser) {
		ui.PitchView.setText(progress.toString());
		_config.PitchRate = progress;
	},
});

// 语音播报速度
ui.SpeechRateViewSeekbar.setOnSeekBarChangeListener({
	onProgressChanged: function (seekBar, progress, fromUser) {
		ui.SpeechRateView.setText(progress.toString());
		_config.SpeechRate = progress;
	},
});

// 运行按钮
ui.RunningButton.on("click", (view) => {
	try {
		if (_config.ServiceEnabled) {
			let util = _floatButton.getViewUtil("Running");
			let checked = !util.getChecked();
			util.setChecked(checked);
			view.setText(checked ? "停 止" : "启 动");
			view.attr("backgroundTint", checked ? "#ED524E" : "#41A4F5");
			_runnig = checked;
			if (_runnig) {
				app.startActivity({
					action: "VIEW",
					packageName: _finder.PackageName,
					className: _finder.MainActivity,
				});
				if (_window_content_changed_event == null) {
					_window_content_changed_event = auto.registerEvent(
						"window_content_changed",
						(node) => {
							_filterCurrTime = new Date().getTime();
							if (
								_filterCurrTime - _filterOverTime >=
								_config.FilterIntervalTime
							) {
								_thread.setTimeout(
									WindowContentChangedEntry,
									0,
									node
								);
								_filterOverTime = _filterCurrTime;
							}
						}
					);
				}
			}
		}
	} catch (error) {
		PrintExceptionStack(error);
	}
});

// 悬浮按钮
_floatButton.on("create", () => {
	_floatButton.setIcon(
		"https://gd4.alicdn.com/imgextra/i3/3022293926/TB23mJZmrsTMeJjSszdXXcEupXa_!!3022293926.jpg_400x400.jpg"
	);

	_floatButton
		.addItem("Running")
		.toCheckbox((util) => {
			util.icon1("@drawable/ic_play_arrow_black_48dp")
				.tint1("#FFFFFF")
				.color1("#41A4F5");
			util.icon2("@drawable/ic_stop_black_48dp")
				.tint2("#FFFFFF")
				.color2("#ED524E");
		})
		.onClick((view, name, state) => {
			try {
				if (_config.ServiceEnabled) {
					ui.RunningButton.setText(state ? "停 止" : "启 动");
					ui.RunningButton.attr(
						"backgroundTint",
						state ? "#ED524E" : "#41A4F5"
					);
					_runnig = state;
					if (_runnig) {
						app.startActivity({
							action: "VIEW",
							packageName: _finder.PackageName,
							className: _finder.MainActivity,
						});
						if (_window_content_changed_event == null) {
							_window_content_changed_event = auto.registerEvent(
								"window_content_changed",
								(node) => {
									_filterCurrTime = new Date().getTime();
									if (
										_filterCurrTime - _filterOverTime >=
										_config.FilterIntervalTime
									) {
										WindowContentChangedEntry();
										_filterOverTime = _filterCurrTime;
									}
								}
							);
						}
					}
				}
			} catch (error) {
				PrintExceptionStack(error);
			}
		});
});

//#endregion

/**
 * 屏幕更新入口
 */
function WindowContentChangedEntry() {
	try {
		if (_finder.SingleGoodsTitle.findOnce() != null) {
			SingleGoodsEntry();
		} else if (_finder.MultiGoodsTitle.findOnce() != null) {
			MultiGoodsEntry();
		}
	} catch (error) {
		PrintExceptionStack(error);
	}
}

/**
 * 单品分拣入口
 */

function SingleGoodsEntry() {
	try {
		let listNode = _finder.SingleSiteList.findOnce();
		if (listNode != null) {
			let child = 0;
			let siteNode = listNode.child(0);

			// 箱规模式: 真
			let boxMode = true;

			if (siteNode.className() == _finder.ImageView) {
				// 此站点已分拣, 选择下一个
				let info = siteNode.desc();
				let infoList = info.split(/[\r\n]/);
				let siteId = infoList[1];
				siteNode = listNode.child(1);
				child = 1;
			}

			if (
				siteNode.className() == _finder.View &&
				siteNode.childCount() == 1
			) {
				if (child == 0) {
					// 此站点无需分拣, 选择下一个
					siteNode = listNode.child(1);
					child = 1;
				} else {
					return;
				}
			}

			if (siteNode.className() == _finder.EditText) {
				// 箱规模式: 假
				boxMode = false;
			}

			if (boxMode) {
				if (siteNode.childCount() >= 3) {
					if (siteNode.child(2).desc() != "分拣完成") {
						let info = siteNode.desc();
						let infoList = info.split(/[\r\n]/);

						_siteCurrId = infoList[0].replace(/S(0+)/, "");
						let content = "站点" + _siteCurrId + "需要";

						let box = siteNode.child(0).text();
						let num = siteNode.child(1).text();

						content += box == "0" ? "" : box + "箱";
						content += num == "0" ? "" : num + infoList[3];

						if (_siteCurrId == _siteOverId) {
							_sameSiteCurrTime = _filterCurrTime;
							if (
								_sameSiteCurrTime - _sameSiteOverTime >=
								_config.SameSiteIntervalTime
							) {
								_engine.Shutup().Say(content);
								console.info("相同站点", content);
								_sameSiteOverTime = _sameSiteCurrTime;
							}
						} else {
							_engine.Shutup().Say(content);
							console.info("不同站点", content);
							_sameSiteOverTime = _filterCurrTime;
							_siteOverId = _siteCurrId;
						}
					}
				}
			} else {
				if (siteNode.childCount() >= 1) {
					if (siteNode.child(0).desc() != "分拣完成") {
						let info = siteNode.desc();
						let infoList = info.split(/[\r\n]/);

						_siteCurrId = infoList[0]
							.split(", ")[1]
							.replace(/S(0+)/, "");
						let content = "站点" + _siteCurrId + "需要";

						let num = infoList[0].split(", ")[0];

						content += num + infoList[2];

						if (_siteCurrId == _siteOverId) {
							_sameSiteCurrTime = _filterCurrTime;
							if (
								_sameSiteCurrTime - _sameSiteOverTime >=
								_config.SameSiteIntervalTime
							) {
								_engine.Shutup().Say(content);
								console.info("相同站点", content);
								_sameSiteOverTime = _sameSiteCurrTime;
							}
						} else {
							_engine.Shutup().Say(content);
							console.info("不同站点", content);
							_sameSiteOverTime = _filterCurrTime;
							_siteOverId = _siteCurrId;
						}
					}
				}
			}
		}
	} catch (error) {
		PrintExceptionStack(error);
	}
}

/**
 * 多品分拣入口
 */
function MultiGoodsEntry() {
	try {
		if (_finder.MultiGoodsTitle.findOnce() != null) {
			let countNode = _finder.Goods2BeSorted.findOnce();
			if (countNode != null) {
				let goodsCount = countNode.desc().match(/^(\d+)/);
				if (goodsCount != "0") {
					let siteNode = _finder.MultiSite.findOnce();
					if (siteNode != null) {
						let info = siteNode.desc();
						let infoList = info.split(/[\r\n]/);
						if (infoList.length > 3) {
							_siteCurrId = infoList[2].replace(/S(0+)/, "");
						} else {
							_siteCurrId = infoList[1].replace(/S(0+)/, "");
						}
						let goodsListNode = siteNode.child(3).child(0);
						console.log("待拣商品数量: " + goodsCount);
						console.log(
							"商品列表长度: " + goodsListNode.childCount()
						);
					}
				}
			}
		}
	} catch (error) {
		PrintExceptionStack(error);
	}
}
