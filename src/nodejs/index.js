const Ctrl8 = require("ctrl8").Ctrl8;

var Cir8 = {
    Count: 0,
    Pack: function (init) {
        return new CPack(init);
    },
    Wire: function (name) {
        return new CConduit({
            "Name": name ? name : ("Wire" + Cir8.Count++)
        })
    },
    Connect: function (A, B, Contact) {
        A.Connect(B, Contact);
        B.Connect(A, Contact);
    },
    Disconnect: function (A, B, Contact) {
        A.DisconnectWith(B, Contact);
        B.DisconnectWith(A, Contact);
    },
    Link: function (A, Contact1, Contact2, B) {
        var Conduit = new CConduit();
        this.Connect(A, Conduit, Contact1);
        this.Connect(B, Conduit, Contact2);
        return Conduit;
    },
    MultiLink: function () {
        var A = arguments
        var X = A.length;
        if ((X & 1) > 0) {
            throw "Both Component and Contact are required"
        }
        var Conn = new CConduit();

        for (var i = 0; i < X; i += 2) {
            Conn.Connect(A[i], A[i + 1]);
        }
        return Conn;
    }
}

function CComp(Init) {
    CComp.baseConstructor.call(this, Init);
    this.Prop("Name", (Date.now() + (CComp.CCount++)));
}

CComp.Count = 0;

Ctrl8.ExtendsTo(CComp);

CComp.prototype.Connect = function (A, Contact) {
}

CComp.prototype.OnVibration = function (FromComp, Contact, Val) {
}

CComp.prototype.DisconnectWith = function (A, Contact) {
}

//--------------------------------------
function C1Way(Init) {
    C1Way.baseConstructor.call(this, Init);
    this._.Contacts = {};
}
CComp.ExtendsTo(C1Way);

C1Way.prototype.Connect = function (A, Contact) {
    if (Contact !== "A" && Contact !== "B")
        throw "Only contacts available are A and B";
    var C = this._.Contacts[Contact];
    if (C) {
        C === A ? 1 : C.Comp.Contact(A, Contact);
    }
    else {
        this._.Contacts[Contact] = A;
    }
}

C1Way.prototype.OnVibration = function (A, Contact, Val) {
    //throw Contact +" " + A.Name;
    if (this._.Contacts["A"] !== A)
        return;

    if (this._.Contacts["B"]) {

        this._.Contacts["B"].OnVibration(this, "B", Val);
    }
}

C1Way.prototype.DisconnectWith = function (A, Contact) {
    var C = this._.Contacts[Contact];
    if (C) {
        delete this._.Contacts[Contact];
        A.DisconnectWith(this, Contact);
    }
}

//--------------------------------------
function CConduit(Init) {
    CConduit.baseConstructor.call(this, Init);
    this._.Contacts = [];

    this.Prop("ParallelTrx", true);

    this.CalcProp("Signal", function (name, storage) {
        return null
    }, function (nval, name, storage) {
        this.OnVibration(null, null, nval);
    })
}

CComp.ExtendsTo(CConduit);

CConduit.prototype.Connect = function (A, Contact) {
    this._.Contacts.every(function (Pair) {
        return Pair.Comp !== A || Pair.Contact !== Contact
    }) ?
        (
            this._.Contacts.push({
                "Contact": Contact,
                "Comp": A
            }),
            A.Connect(this, Contact)
        )
        : 0;
}

CConduit.prototype.OnVibration = function (FromComp, Contact, Val) {
    var me = this;
    this._.Contacts.forEach(function (Pair) {
        if (Pair.Comp !== FromComp && Pair.Contact !== Contact) //Prevent bouncing OnVibration
            me.ParallelTrx ? setTimeout(CConduit.PVibrate, 0, Pair.Comp, me, Pair.Contact, Val)
                : Pair.Comp.OnVibration(me, Pair.Contact, Val);
    });
}


CConduit.prototype.DisconnectWith = function (A, Contact) {
    var idx;
    this._.Contacts.every(function (Pair, i) {
        idx = i;
        return Pair.Comp !== A || Pair.Contact !== Contact
    }) ? 1 : (this._.Contacts.splice(idx, 1), A.DisconnectWith(this, Contact));
}

CConduit.PVibrate = function (chip, conduit, Contact, Val) {
    chip.OnVibration(conduit, Contact, Val);
}

//-----------------------------------------

function CPort(Init) {
    CPort.baseConstructor.call(this, Init);
    this._.Contacts = {};
}

CComp.ExtendsTo(CPort);

CPort.Get = function (name, Storage) {
    var Pair = this._.Contacts[name]
    return Pair ? Pair.v : undefined;
}

CPort.Set = function (val, name, Storage) {
    var Pair = this._.Contacts[name]
    if (Pair) {
        //We use Vibrate as instead of Signal becoz not every
        Pair.c.OnVibration(this, name, val);
    }
}
//--------------------------------------

function CPack(Init) {
    CPack.baseConstructor.call(this, Init);
    this._.Collected = 0;
    this._.HasInputs = {};

    this.Prop("Ins", []);
    this.Prop("Props", {});
    this.Prop("FX", function () { });
    this.DrillProp("Ports", this._.Props["Ports"], CPort);

    this.Prop("Staged", false, 0, function (nval) {
        this._.Collected = 0;
        this._.HasInputs = {};
    });

    this.Prop("InitFX", function () { });
    this.InitFX.call(this);
}
CComp.ExtendsTo(CPack);

CPack.prototype.Connect = function (A, Contact) {

    var Ports = this.Ports;

    //We need to handle connections with existing contact
    //We will connect the contact component with the new Component;

    var C = Ports._.Contacts[Contact];
    if (C) {
        if (C.c == A) //Already connected 
            return
        else {
            C.c.Connect(A, Contact);
        }
    }
    else {
        Ports._.Contacts[Contact] = { "c": A };
        if (!Ports.hasOwnProperty(Contact)) //Do not yet have port contact
            Ports.CalcProp(Contact, CPort.Get, CPort.Set, 1, undefined, 1);
        A.Connect(this, Contact);
    }
}

CPack.prototype.OnVibration = function (FromComp, Contact, Val) {
    if (!this.Ins.length)
        this.FX();

    var idx = this.Ins.indexOf(Contact);
    if (idx >= 0) {
        var K = this._.HasInputs[Contact];
        this._.HasInputs[Contact] = 1;
        this.Ports._.Contacts[Contact].v = Val;

        //For Staged inputs
        //Eventually K will be defined
        (K === undefined) && ++this._.Collected == this.Ins.length ? this.FX() : 1;

        if (this.Staged) {
            if (this._.Collected >= this.Ins.length) {
                this._.Collected = 0,
                    this._.HasInputs = {}
            }
        }
        else
            K && this._.Collected >= this.Ins.length ? this.FX() : 1;
    }
}

CPack.prototype.DisconnectWith = function (A, Contact) {
    var Ports = this.Ports;
    var C = Ports._.Contacts[Contact];
    if (C && C.c == A) {
        delete Ports._.Contacts[Contact];
        delete Ports[Contact];
        A.DisconnectWith(this, Contact);
    }
}

module.exports = {
    "Cir8": Cir8,
    "CComp": CComp,
    "CPack": CPack,
    "CConduit": CConduit,
    "C1Way": C1Way
}