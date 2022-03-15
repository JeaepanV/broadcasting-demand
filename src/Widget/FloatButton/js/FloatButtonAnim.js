/*
 * @Author: 大柒
 * @QQ: 531310591@qq.com
 * @Date: 2021-04-18 06:14:13
 * @Version: Auto.Js Pro
 * @Description: 动画模块
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-17 19:18:11
 */
importClass(android.animation.ValueAnimator)
importClass(android.animation.ObjectAnimator);
importClass(android.animation.AnimatorSet);
importClass(android.view.animation.BounceInterpolator);

const { iStatusBarHeight, ColorEvaluator } = require('./__util__');

let mAnimList = { left: [], right: [] };
let fb = fbc = new Object;;

const FloatButtonAnim = function (_fb_, _config_) {
    fb = _fb_;
    fbc = _config_
}

FloatButtonAnim.prototype.show = function (action) {
    action = action || new Function();
    ui.run(() => {
        fbc.state.anim = true;
        let mx = fbc.state.direction ? [fbc.size, 0] : [-fbc.size, 0];
        fb.getView('logo').attr("visibility", "visible");
        fb.getView('logo').setTranslationX(mx);
        fbc.isShow = true;
        aAl(aPt([aTx(fb.getView('logo'), mx)], fbc.time.show), () => {
            fb.getWindow('logo').setTouchable(true);
            fbc.state.anim = false;
            fbc.isShow = true;
            action();
        })
    });
}

FloatButtonAnim.prototype.hide = function (action) {
    action = action || new Function();
    let lw = fb.getWindow('logo');
    let __this__ = this;
    let arr;
    let mAction = function () {
        arr = (fbc.state.direction ? [0, fbc.size] : [0, -fbc.size]);
        aPt([aTx(fb.getView('logo'), arr)], fbc.time.show);;
        fbc.isShow = false;
    }
    ui.run(() => {
        lw.setTouchable(false);
        if (fbc.state.menuOpen) {
            __this__.menu(!fbc.state.menuOpen, mAction);
            fbc.state.menuOpen = false;
        } else {
            mAction();
        }
    });
}

/**
 * 停靠动画
 * 修复 悬浮球停靠时超出屏幕问题
 * @param {*} x 
 * @param {*} y 
 */
FloatButtonAnim.prototype.direction = function (x, y, action) {
    action = action || new Function();
    fbc.state.anim = true;
    let d = fbc.state.direction
    let width = fb.getWidth();
    let x1 = (d ? width - fbc.size + fbc.padding : -fbc.padding);
    let y1 = 0;
    let lw = fb.getWindow('logo');
    let lbv = fb.getView('logo');
    ui.run(() => {
        lbv.attr('alpha', fbc.logoAlpha);
        let f;
        let h = fb.getHeight();
        let w = Math.abs(x - x1);
        //计算Y值是否超出屏幕
        let mAnimationUpdate;
        if (y < iStatusBarHeight) {
            //超出上方屏幕
            y1 = Math.abs(y - iStatusBarHeight);
            fbc.y = (Math.round((y + y1) / h * 100) / 100.00);
            mAnimationUpdate = (x > x1)
                ? (animator) => {
                    f = animator.getAnimatedValue();
                    lw.setPosition(x - w * f, y + y1 * f);
                }
                : (animator) => {
                    f = animator.getAnimatedValue();
                    lw.setPosition(x + w * f, y + y1 * f);
                }
        } else if (lw.getY() > h - fbc.size) {
            //超出下方屏幕
            y1 = Math.abs(y - (h - fbc.size - iStatusBarHeight));
            fbc.y = (Math.round((y - y1) / h * 100) / 100.00);
            mAnimationUpdate = (x > x1)
                ? (animator) => {
                    f = animator.getAnimatedValue();
                    lw.setPosition(x - w * f, y - y1 * f);
                }
                : (animator) => {
                    f = animator.getAnimatedValue();
                    lw.setPosition(x + w * f, y - y1 * f);
                }
        } else {
            //正常
            fbc.y = (Math.round(y / h * 100) / 100.00);
            mAnimationUpdate = (x > x1)
                ? (animator) => {
                    f = animator.getAnimatedValue();
                    lw.setPosition(x - w * f, y);
                }
                : (animator) => {
                    f = animator.getAnimatedValue();
                    lw.setPosition(x + w * f, y);
                }
        }
        //动画
        let anim = ValueAnimator.ofFloat(0, 1);
        anim.setDuration(fbc.time.direction);
        anim.setInterpolator(new BounceInterpolator());
        anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener({
            onAnimationUpdate: mAnimationUpdate
        }));
        anim.addListener({
            onAnimationEnd: function () {
                fbc.state.anim = false;
                action();
            }
        });
        anim.start();
    });
}

//菜单动画
FloatButtonAnim.prototype.menu = function (value, action) {
    action = action || new Function();
    if (fbc.isMenuOpen == value || fbc.state.anim) {
        action();
        return;
    };
    fbc.state.anim = true;//开启动画占用防止动画多开
    let mw = fb.getWindow('menu');
    let lbv = fb.getView('logo');
    ui.run(() => {
        value ? mw.content.attr("visibility", "visible") : mw.setTouchable(false);
        //移除定时器
        if (fbc.timer != null) {
            clearTimeout(fbc.timer);
            fbc.timer = null;
        };
        lbv.attr('alpha', 1);
        //获取要执行的动画集合
        let mAnim = mAnimList[fbc.state.direction ? 'right' : 'left'][value ? 0 : 1];
        aAl(aPt(mAnim, fbc.time.menu), () => {
            if (value) {
                mw.setTouchable(true);
                if (fbc.time.autoCloseMenu != 0) {
                    fbc.timer = setTimeout(() => {
                        fbc.state.menuOpen = false;
                        fbc.timer = null;
                    }, fbc.time.autoCloseMenu);
                }
            } else {
                lbv.attr('alpha', fbc.logoAlpha);
                mw.setTouchable(false);
                mw.content.attr('visibility', 'invisible');
            }
            fbc.state.anim = false;
            fbc.isMenuOpen = value;
            action();
        });
    });
}

FloatButtonAnim.prototype.stateChanged = function (state, fbcs, view) {
    //强制执行动画 
    // fbc.state.anim = true;
    let e = state ? ['2', '1'] : ['1', '2'];
    let time = fbc.time.buttonAnim;
    let mColorEvaluator = function (value, colorstr) {
        view.attr("backgroundTint", colorstr);//改变背景着色
    }
    let mColorEvaluator1 = function (value, colorstr) {
        view.attr("tint", colorstr);//改变背景着色
    }
    ui.run(() => {
        let mColorAnim = ObjectAnimator.ofObject(view, "color", new ColorEvaluator(true, mColorEvaluator), fbcs['color' + e[0]], fbcs['color' + e[1]]);
        let mColorAnim1 = ObjectAnimator.ofObject(view, "color", new ColorEvaluator(true, mColorEvaluator1), fbcs['tint' + e[0]], fbcs['tint' + e[1]]);
        var mScaleXAnim = ObjectAnimator.ofFloat(view, "scaleX", [1, 0.7, 1]);
        var mScaleYAnim = ObjectAnimator.ofFloat(view, "scaleY", [1, 0.7, 1]);
        let anims = new AnimatorSet();
        anims.playTogether(mColorAnim, mColorAnim1, mScaleXAnim, mScaleYAnim);
        anims.setDuration(time);
        anims.start();
        setTimeout(() => {
            view.attr('src', fbcs['icon' + e[1]]);
        }, time / 2);
    });
}

//创建动画
FloatButtonAnim.prototype.createAnim = function (fbc, views) {
    mAnimList = { left: [], right: [] };
    mAnimList.left[0] = getAnim(1, true);
    mAnimList.left[1] = getAnim(1, false);
    mAnimList.right[0] = getAnim(0, true);
    mAnimList.right[1] = getAnim(0, false);
    function getAnim(e, isShow) {
        let arr = [];
        let value, view;
        for (i in views) {
            view = views[i];
            value = Object.keys(views).indexOf(i);
            arr.push(aTx(view, isShow ? [0, fbc.x[e][value]] : [fbc.x[e][value], 0]));
            arr.push(aTy(view, isShow ? [0, fbc.y[e][value]] : [fbc.y[e][value], 0]));
            arr.push(aSx(view, isShow ? [0, 1] : [1, 0]));
            arr.push(aSy(view, isShow ? [0, 1] : [1, 0]));
        }
        return arr;
    }
}

module.exports = FloatButtonAnim;

const aInt = (n, v, a) => ObjectAnimator.ofInt(v, n, colors.parseColor(a[0]), colors.parseColor(a[1]));
const aTx = (v, a) => ObjectAnimator.ofFloat(v, "translationX", a);
const aTy = (v, a) => ObjectAnimator.ofFloat(v, "translationY", a);
const aTz = (v, a) => ObjectAnimator.ofFloat(v, "translationZ", a);
const aAp = (v, a) => ObjectAnimator.ofFloat(v, "alpha", a);
const aSx = (v, a) => ObjectAnimator.ofFloat(v, "scaleX", a);
const aSy = (v, a) => ObjectAnimator.ofFloat(v, "scaleY", a);
const aAl = (a, f) => a.addListener({ onAnimationEnd: f });
const aPt = (a, t, d) => {
    let s = new AnimatorSet();
    s.playTogether(a);
    s.setStartDelay(d = d || 0);
    s.setDuration(t = t || 300);
    s.start();
    return s;
};