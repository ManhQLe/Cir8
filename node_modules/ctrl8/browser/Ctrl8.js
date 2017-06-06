function Ctrl8(init) {
    this._ = {};
    this._.Props = init ? init : {};
    this._.Ctrls = {}
}

Ctrl8.ExtendsTo = function (SubClass) {
    function inheritance() { }
    var Root = this;
    inheritance.prototype = Root.prototype;
    SubClass.prototype = new inheritance();
    SubClass.prototype.constructor = SubClass;
    SubClass.baseConstructor = Root;
    SubClass.superClass = Root.prototype;
    SubClass.ExtendsTo = Root.ExtendsTo;
}

Ctrl8.prototype.Prop = function (name, def, readonly, changefx, compfx, conf, CustomStorage, enumerable) {
    Ctrl8.CreateProp(this, CustomStorage || this._.Props, name, def, readonly, compfx, changefx, conf, enumerable);
};

Ctrl8.prototype.EProp = function (name, def, readonly, changefx, compfx, conf, CustomStorage) {
    Ctrl8.CreateProp(this, CustomStorage || this._.Props, name, def, readonly, compfx, changefx, conf, 1);
}

Ctrl8.prototype.DrillProp = function (name, Storage, CtrlType) {
    CtrlType ? 1 : CtrlType = Ctrl8;
    Ctrl8.CreateProp(this, this._.Ctrls, name, new CtrlType(Storage), true);
}

Ctrl8.prototype.CpxProp = function (name, CtrlType, ReadOnly) {

    Ctrl8.CalcProp(this, this._.Props, name, function (name, Storage) {
        return new CtrlType(Storage[name] || (Storage[name] = {}));
    }, ReadOnly ? null : function (nval, name, Storage) {
        Storage[name] = nval;
    }, false)
}

Ctrl8.prototype.CalcProp = function (name, getfx, setfx, conf, CustomStorage, enumerable) {
    Ctrl8.CalcProp(this, CustomStorage || this._.Props, name, getfx, setfx, conf, enumerable);
}

Ctrl8.prototype.ECalcProp = function (name, getfx, setfx, conf, CustomStorage) {
    Ctrl8.CalcProp(this, CustomStorage || this._.Props, name, getfx, setfx, conf, 1);
}

Ctrl8.prototype.CalcOnceProp = function (name, getfx, conf, CustomStorage, enumerable) {
    Ctrl8.CalcProp(this, CustomStorage || this._.Props, name, function (name, Storage) {
        return Storage[name] || (Storage[name] = getfx.call(this, name, Storage));
    }, null, conf, enumerable);
}

Ctrl8.prototype.ECalcOnceProp = function (name, getfx, conf, CustomStorage) {
    Ctrl8.CalcProp(this, CustomStorage || this._.Props, name, function (name, Storage) {
        return Storage[name] || (Storage[name] = getfx.call(this, name, Storage));
    }, null, conf, 1);
}

Ctrl8.DefCompareFx = function (val1, val2) {
    return val1 === val2;
}

Ctrl8.DefChangeFx = function (newval) { }

Ctrl8.CreateProp = function (O, Storage, name, def, readonly, CompareFx, ChangeFx, conf, enumerable) {
    CompareFx ? 1 : CompareFx = Ctrl8.DefCompareFx;
    ChangeFx ? 1 : ChangeFx = Ctrl8.DefChangeFx;
    var Pair = {
        get: function () {
            return Storage[name];
        },
        configurable: conf ? true : false,
        eenumerable: enumerable ? true : false
    }
    !readonly ? Pair.set = function (val) {
        var yn = CompareFx.call(this, Storage[name], val);
        yn ? 0 : (Storage[name] = val, ChangeFx.call(this, val));
    } : 1;
    Object.defineProperty(O, name, Pair);
    !Storage.hasOwnProperty(name) && def !== undefined ? Storage[name] = def : 1;
}

Ctrl8.CalcProp = function (O, Storage, name, gfx, sfx, conf, enumerable) {
    var Pair = {
        get: function () {
            return gfx.call(this, name, Storage);
        },
        configurable: conf ? true : false,
        enumerable: enumerable ? true : false
    }
    sfx ? Pair.set = function (nval) {
        sfx.call(this, nval, name, Storage);
    } : 1;
    Object.defineProperty(O, name, Pair);
}

function DrillCtrl(init) {
    DrillCtrl.baseConstructor.call(this, init);
    for (var n in this._.Props) {
        var o = this._.Props[n];
        if (typeof o == 'object')
            this.DrillProp(n, DrillCtrl, o)
        else
            this.Prop(n);
    }
}

Ctrl8.ExtendsTo(DrillCtrl);

function EventCtrl(int) {
    EventCtrl.baseConstructor.call(this, int);
    this._.Events = {};
}

Ctrl8.ExtendsTo(EventCtrl);

EventCtrl.prototype.Emit = function () {
    var Args = Array.prototype.slice.call(arguments);
    var event = Args[0];
    Args.splice(0, 1);
    var A = this._.Events[event];
    A ? A.forEach(function (fx) {
        fx.apply(this, Args);
    }, this) : 1;
}

EventCtrl.prototype.On = function (event, fx) {
    var A = this._.Events[event] || (this._.Events[event] = []);
    A.indexOf(fx) < 0 ? A.push(fx) : 1;
}

EventCtrl.prototype.Off = function (event, fx) {
    var A = this._.Events[event] || (this._.Events[event] = []);
    var idx = A.indexOf(fx)
    idx >= 0 ? A.splice(idx, 1) : 1;
}

function WebCtrl(c, init) {
    WebCtrl.baseConstructor.call(this, init);
    this.DOM = typeof c == 'string' ? document.querySelector(c) : c;
    var markupinit = WebCtrl.GetInit(this.DOM)
    var P = this._.Props;
    for (var n in markupinit) {
        //Respect init properties
        !P.hasOwnProperty(n) ? P[n] = markupinit[n] : 1;
    }
}
EventCtrl.ExtendsTo(WebCtrl);

WebCtrl.GetInit = function (DOM) {
    var init = DOM.getAttribute("init");
    init = init && init.length ? eval("(" + init + ")") || {} : {};
    return init;
}

var _8 = function (s) {
    return new DOMCtrl(s);
}

function DOMCtrl(c) {
    this.DOM = typeof c == 'string' ? document.querySelector(c) : c;
    var me = this;
}

DOMCtrl.prototype.attr = function (a, val) {
    var me = this;
    var un;
    var t = Array.isArray(a) ? "array" : (typeof a);
    if (t == "string") {
        if (val === undefined)
            return this.DOM.getAttribute(a);
        else {
            val == null ? this.DOM.removeAttribute(a) : this.DOM.setAttribute(a, val);

        }
        return me;
    }

    if (t == "array") {
        if (val === undefined) {
            var x = {}
            a.forEach(function (n) {
                x[n] = me.DOM.getAttribute(n);
            })
            return x;
        }

        if (val == null)
            a.forEach(function (n) {
                me.DOM.removeAttribute(n);
            })
        else
            a.forEach(function (n) {
                me.DOM.setAttribute(n, val);
            })
        return me;

    }

    if (t == "object") {
        for (var n in a) {
            un = a[n];
            un == null ? me.DOM.removeAttribute(n) :
                me.DOM.setAttribute(n, un.call ? un(n) : un)
        }
    }

    return me;
}

DOMCtrl.prototype.prop = function (a, val) {
    var o = this.DOM;
    var me = this;
    var un;
    var t = Array.isArray(a) ? "array" : (typeof a);
    if (t == "string") {
        if (val === undefined)
            return o[a];
        else
            val == null ? (delete o[a]) : o[a] = val;
        return me;
    }

    if (t == "array") {
        if (val === undefined) {
            var x = {}
            a.forEach(function (n) {
                x[n] = o[n];
            })
            return x;
        }

        if (val == null)
            a.forEach(function (n) {
                delete o[n];
            })
        else
            a.forEach(function (n) {
                o[n] = val;
            })
        return me;

    }

    if (t == "object") {
        for (var n in a) {
            un = a[n];
            un == null ? delete o[n] :
                o[n] = un.call ? un(n) : un;
        }
    }

    return me;

}

DOMCtrl.prototype.css = function (a, val) {
    var o = this.DOM.style;
    var me = this;
    var un;
    var t = Array.isArray(a) ? "array" : (typeof a);
    if (t == "string") {
        if (val === undefined)
            return o.getPropertyValue(a)
        else
            val == null ? o.removeProperty(a) : o.setProperty(a, val);
        return me;
    }

    if (t == "array") {
        if (val === undefined) {
            var x = {}
            a.forEach(function (n) {
                x[n] = o.getPropertyValue(n)
            })
            return x;
        }

        if (val == null)
            a.forEach(function (n) {
                o.removeProperty(n)
            })
        else
            a.forEach(function (n) {
                o.setProperty(n, val)
            })
        return me;

    }

    if (t == "object") {
        for (var n in a) {
            un = a[n];
            un == null ? o.removeProperty(n) :
                o.setProperty(n, un.call ? un(n) : un);
        }
    }

    return me;
}



DOMCtrl.prototype.on = function (e, fx) {
    this.DOM.addEventListener(e, fx);
    return this;
}

DOMCtrl.prototype.sel = function (s) {
    return new DOMCtrl(this.DOM.querySelector(s));
}

DOMCtrl.prototype.append = function (s) {
    var k = document.createElement(s);
    this.DOM.append(k);
    return new DOMCtrl(k);
}

DOMCtrl.prototype.remove = function (s) {
    var Es = this.DOM.querySelectorAll(s);
    for (var i = 0; i < Es.length; i++) {
        this.DOM.removeChild(Es[i]);
    }
}

DOMCtrl.prototype.text = function (v) {
    if (v === undefined)
        return this.DOM.textContent
    this.DOM.textContent = v;
    return this;
}

DOMCtrl.prototype.html = function (v) {
    if (v === undefined)
        return this.DOM.innerHTML;
    this.DOM.innerHTML = v;
    return this;
}

DOMCtrl.prototype.rm = function (s) {
    var E = this.DOM.querySelectorAll(s);
    for (var i = 0; i < E.length; i++) {
        this.DOM.removeChild(E[i]);
    }
    return this;
}

DOMCtrl.Utils = {
    MouseXY: function (DOM, e) {
        var b = DOM.getBoundingClientRect();
        return [e.clientX - b.left, e.clientY - b.top];
    },
    EnableSpan: function (dom, fx) {
        var m1;
        dom.addEventListener("mousemove", function (e) {
            e = window.event || e;
            if (e.buttons == 1) {
                var m2 = DOMCtrl.Utils.MouseXY(dom, e);
                fx.call(dom, e, {
                    "dx": m2[0] - m1[0],
                    "dy": m2[1] - m1[1],
                    "m1": [m1[0], m1[1]],
                    "m2": [m2[0], m2[1]]
                });
                m1 = m2;
            }
            else
                m1 = DOMCtrl.Utils.MouseXY(dom, e);
            e.stopPropagation();
            e.preventDefault();
        })
    },
    EnableDrag: function (dom, fx, Span, Ofx) {
        var m1;
        dom.addEventListener("mousemove", function (e) {
            e = window.event || e;
            if (e.buttons == 1) {
                var m2 = DOMCtrl.Utils.MouseXY(dom, e);
                O = Ofx ? Ofx() : [0, 0];
                m2[0] += O[0];
                m2[1] += O[1];

                fx.call(dom, e, {
                    "dx": m2[0] - m1[0],
                    "dy": m2[1] - m1[1],
                    "m1": [m1[0], m1[1]],
                    "m2": [m2[0], m2[1]]
                });
                Span ? m1 = m2 : 0;
            }
            else {
                var O = Ofx ? Ofx() : [0, 0]
                m1 = DOMCtrl.Utils.MouseXY(dom, e);
                m1[0] += O[0];
                m1[1] += O[1];
            }
            e.stopPropagation();
            e.preventDefault();
        })
    }
}