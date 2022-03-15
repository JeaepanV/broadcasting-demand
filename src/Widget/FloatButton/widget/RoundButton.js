/*
 * @Author: 大柒
 * @QQ: 531310591@qq.com
 * @Date: 2021-04-18 04:34:46
 * @Version: Auto.Js Pro
 * @Description: 自定义控件 按钮
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-17 15:41:21
 */
const { dp2px, CreateShape } = require('../js/__util__');

var RoundButton = (function () {
    util.extend(RoundButton, ui.Widget);

    function RoundButton() {
        ui.Widget.call(this);
        this.defineAttr("backgroundTint", (view, attr, value, defineSetter) => {
            view.widget.__gd__.setTint(colors.parseColor(value));
        });
    }

    RoundButton.prototype.__gd__ = new Object;

    RoundButton.prototype.render = function () {
        return <img
            padding='8'
            layout_gravity='center_vertical'
        />;
    }

    RoundButton.prototype.onViewCreated = function (view) {
        view.widget.__gd__ = new CreateShape(dp2px(99), 0, '#FFFFFF');
        view.setBackground(view.widget.__gd__);
    }

    ui.registerWidget("Widget-RoundButton", RoundButton);
    return RoundButton;
})();

module.exports = RoundButton;