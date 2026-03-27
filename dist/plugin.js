import e, { useEffect as t, useMemo as n, useRef as r, useState as i } from "react";
import { createRoot as a } from "react-dom/client";
Object.freeze({ status: "aborted" });
function o(e, t, n) {
	function r(n, r) {
		if (n._zod || Object.defineProperty(n, "_zod", {
			value: {
				def: r,
				constr: o,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: !1
		}), n._zod.traits.has(e)) return;
		n._zod.traits.add(e), t(n, r);
		let i = o.prototype, a = Object.keys(i);
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			t in n || (n[t] = i[t].bind(n));
		}
	}
	let i = n?.Parent ?? Object;
	class a extends i {}
	Object.defineProperty(a, "name", { value: e });
	function o(e) {
		var t;
		let i = n?.Parent ? new a() : this;
		r(i, e), (t = i._zod).deferred ?? (t.deferred = []);
		for (let e of i._zod.deferred) e();
		return i;
	}
	return Object.defineProperty(o, "init", { value: r }), Object.defineProperty(o, Symbol.hasInstance, { value: (t) => n?.Parent && t instanceof n.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(o, "name", { value: e }), o;
}
var s = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, c = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
}, l = {};
function u(e) {
	return e && Object.assign(l, e), l;
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function d(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function f(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
function p(e) {
	return { get value() {
		{
			let t = e();
			return Object.defineProperty(this, "value", { value: t }), t;
		}
		throw Error("cached value already set");
	} };
}
function m(e) {
	return e == null;
}
function h(e) {
	let t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function ee(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = t.toString(), i = (r.split(".")[1] || "").length;
	if (i === 0 && /\d?e-\d?/.test(r)) {
		let e = r.match(/\d?e-(\d?)/);
		e?.[1] && (i = Number.parseInt(e[1]));
	}
	let a = n > i ? n : i;
	return Number.parseInt(e.toFixed(a).replace(".", "")) % Number.parseInt(t.toFixed(a).replace(".", "")) / 10 ** a;
}
var te = Symbol("evaluating");
function g(e, t, n) {
	let r;
	Object.defineProperty(e, t, {
		get() {
			if (r !== te) return r === void 0 && (r = te, r = n()), r;
		},
		set(n) {
			Object.defineProperty(e, t, { value: n });
		},
		configurable: !0
	});
}
function _(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function v(...e) {
	let t = {};
	for (let n of e) Object.assign(t, Object.getOwnPropertyDescriptors(n));
	return Object.defineProperties({}, t);
}
function ne(e) {
	return JSON.stringify(e);
}
function re(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var ie = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function y(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var ae = p(() => {
	if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function b(e) {
	if (y(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return !(y(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function oe(e) {
	return b(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
var se = new Set([
	"string",
	"number",
	"symbol"
]);
function x(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function S(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function C(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function ce(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
var le = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function ue(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	return S(e, v(e._zod.def, {
		get shape() {
			let e = {};
			for (let r in t) {
				if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
				t[r] && (e[r] = n.shape[r]);
			}
			return _(this, "shape", e), e;
		},
		checks: []
	}));
}
function de(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	return S(e, v(e._zod.def, {
		get shape() {
			let r = { ...e._zod.def.shape };
			for (let e in t) {
				if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
				t[e] && delete r[e];
			}
			return _(this, "shape", r), r;
		},
		checks: []
	}));
}
function fe(e, t) {
	if (!b(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = e._zod.def.shape;
		for (let e in t) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return S(e, v(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return _(this, "shape", n), n;
	} }));
}
function pe(e, t) {
	if (!b(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return S(e, v(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return _(this, "shape", n), n;
	} }));
}
function me(e, t) {
	return S(e, v(e._zod.def, {
		get shape() {
			let n = {
				...e._zod.def.shape,
				...t._zod.def.shape
			};
			return _(this, "shape", n), n;
		},
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: []
	}));
}
function he(e, t, n) {
	let r = t._zod.def.checks;
	if (r && r.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
	return S(t, v(t._zod.def, {
		get shape() {
			let r = t._zod.def.shape, i = { ...r };
			if (n) for (let t in n) {
				if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
				n[t] && (i[t] = e ? new e({
					type: "optional",
					innerType: r[t]
				}) : r[t]);
			}
			else for (let t in r) i[t] = e ? new e({
				type: "optional",
				innerType: r[t]
			}) : r[t];
			return _(this, "shape", i), i;
		},
		checks: []
	}));
}
function ge(e, t, n) {
	return S(t, v(t._zod.def, { get shape() {
		let r = t._zod.def.shape, i = { ...r };
		if (n) for (let t in n) {
			if (!(t in i)) throw Error(`Unrecognized key: "${t}"`);
			n[t] && (i[t] = new e({
				type: "nonoptional",
				innerType: r[t]
			}));
		}
		else for (let t in r) i[t] = new e({
			type: "nonoptional",
			innerType: r[t]
		});
		return _(this, "shape", i), i;
	} }));
}
function w(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function _e(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function T(e) {
	return typeof e == "string" ? e : e?.message;
}
function E(e, t, n) {
	let r = {
		...e,
		path: e.path ?? []
	};
	return e.message || (r.message = T(e.inst?._zod.def?.error?.(e)) ?? T(t?.error?.(e)) ?? T(n.customError?.(e)) ?? T(n.localeError?.(e)) ?? "Invalid input"), delete r.inst, delete r.continue, t?.reportInput || delete r.input, r;
}
function ve(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function D(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
var ye = (e, t) => {
	e.name = "$ZodError", Object.defineProperty(e, "_zod", {
		value: e._zod,
		enumerable: !1
	}), Object.defineProperty(e, "issues", {
		value: t,
		enumerable: !1
	}), e.message = JSON.stringify(t, f, 2), Object.defineProperty(e, "toString", {
		value: () => e.message,
		enumerable: !1
	});
}, be = o("$ZodError", ye), xe = o("$ZodError", ye, { Parent: Error });
function Se(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? (n[i.path[0]] = n[i.path[0]] || [], n[i.path[0]].push(t(i))) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function Ce(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e) => {
		for (let i of e.issues) if (i.code === "invalid_union" && i.errors.length) i.errors.map((e) => r({ issues: e }));
		else if (i.code === "invalid_key") r({ issues: i.issues });
		else if (i.code === "invalid_element") r({ issues: i.issues });
		else if (i.path.length === 0) n._errors.push(t(i));
		else {
			let e = n, r = 0;
			for (; r < i.path.length;) {
				let n = i.path[r];
				r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
var we = (e) => (t, n, r, i) => {
	let a = r ? Object.assign(r, { async: !1 }) : { async: !1 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise) throw new s();
	if (o.issues.length) {
		let t = new (i?.Err ?? e)(o.issues.map((e) => E(e, a, u())));
		throw ie(t, i?.callee), t;
	}
	return o.value;
}, Te = (e) => async (t, n, r, i) => {
	let a = r ? Object.assign(r, { async: !0 }) : { async: !0 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise && (o = await o), o.issues.length) {
		let t = new (i?.Err ?? e)(o.issues.map((e) => E(e, a, u())));
		throw ie(t, i?.callee), t;
	}
	return o.value;
}, O = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new s();
	return a.issues.length ? {
		success: !1,
		error: new (e ?? be)(a.issues.map((e) => E(e, i, u())))
	} : {
		success: !0,
		data: a.value
	};
}, Ee = /* @__PURE__ */ O(xe), k = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { async: !0 }) : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? {
		success: !1,
		error: new e(a.issues.map((e) => E(e, i, u())))
	} : {
		success: !0,
		data: a.value
	};
}, De = /* @__PURE__ */ k(xe), Oe = (e) => (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return we(e)(t, n, i);
}, ke = (e) => (t, n, r) => we(e)(t, n, r), Ae = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return Te(e)(t, n, i);
}, je = (e) => async (t, n, r) => Te(e)(t, n, r), Me = (e) => (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return O(e)(t, n, i);
}, Ne = (e) => (t, n, r) => O(e)(t, n, r), Pe = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return k(e)(t, n, i);
}, Fe = (e) => async (t, n, r) => k(e)(t, n, r), Ie = /^[cC][^\s-]{8,}$/, Le = /^[0-9a-z]+$/, Re = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, ze = /^[0-9a-vA-V]{20}$/, Be = /^[A-Za-z0-9]{27}$/, Ve = /^[a-zA-Z0-9_-]{21}$/, He = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Ue = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, We = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Ge = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Ke = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function qe() {
	return new RegExp(Ke, "u");
}
var Je = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Ye = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Xe = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Ze = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Qe = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, $e = /^[A-Za-z0-9_-]*$/, et = /^\+[1-9]\d{6,14}$/, tt = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", nt = /* @__PURE__ */ RegExp(`^${tt}$`);
function rt(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function it(e) {
	return RegExp(`^${rt(e)}$`);
}
function at(e) {
	let t = rt({ precision: e.precision }), n = ["Z"];
	e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let r = `${t}(?:${n.join("|")})`;
	return RegExp(`^${tt}T(?:${r})$`);
}
var ot = (e) => {
	let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
	return RegExp(`^${t}$`);
}, st = /^-?\d+$/, ct = /^-?\d+(?:\.\d+)?$/, lt = /^(?:true|false)$/i, ut = /^[^A-Z]*$/, dt = /^[^a-z]*$/, A = /* @__PURE__ */ o("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), ft = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, pt = /* @__PURE__ */ o("$ZodCheckLessThan", (e, t) => {
	A.init(e, t);
	let n = ft[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? Infinity;
		t.value < r && (t.inclusive ? n.maximum = t.value : n.exclusiveMaximum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), mt = /* @__PURE__ */ o("$ZodCheckGreaterThan", (e, t) => {
	A.init(e, t);
	let n = ft[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? -Infinity;
		t.value > r && (t.inclusive ? n.minimum = t.value : n.exclusiveMinimum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), ht = /* @__PURE__ */ o("$ZodCheckMultipleOf", (e, t) => {
	A.init(e, t), e._zod.onattach.push((e) => {
		var n;
		(n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
	}), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : ee(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), gt = /* @__PURE__ */ o("$ZodCheckNumberFormat", (e, t) => {
	A.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = le[t.format];
	e._zod.onattach.push((e) => {
		let r = e._zod.bag;
		r.format = t.format, r.minimum = i, r.maximum = a, n && (r.pattern = st);
	}), e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), _t = /* @__PURE__ */ o("$ZodCheckMaxLength", (e, t) => {
	var n;
	A.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !m(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.maximum ?? Infinity;
		t.maximum < n && (e._zod.bag.maximum = t.maximum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length <= t.maximum) return;
		let i = ve(r);
		n.issues.push({
			origin: i,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), vt = /* @__PURE__ */ o("$ZodCheckMinLength", (e, t) => {
	var n;
	A.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !m(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.minimum ?? -Infinity;
		t.minimum > n && (e._zod.bag.minimum = t.minimum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length >= t.minimum) return;
		let i = ve(r);
		n.issues.push({
			origin: i,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), yt = /* @__PURE__ */ o("$ZodCheckLengthEquals", (e, t) => {
	var n;
	A.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !m(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.minimum = t.length, n.maximum = t.length, n.length = t.length;
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if (i === t.length) return;
		let a = ve(r), o = i > t.length;
		n.issues.push({
			origin: a,
			...o ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), j = /* @__PURE__ */ o("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	A.init(e, t), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.format = t.format, t.pattern && (n.patterns ??= /* @__PURE__ */ new Set(), n.patterns.add(t.pattern));
	}), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), bt = /* @__PURE__ */ o("$ZodCheckRegex", (e, t) => {
	j.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), xt = /* @__PURE__ */ o("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= ut, j.init(e, t);
}), St = /* @__PURE__ */ o("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= dt, j.init(e, t);
}), Ct = /* @__PURE__ */ o("$ZodCheckIncludes", (e, t) => {
	A.init(e, t);
	let n = x(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
	t.pattern = r, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(r);
	}), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), wt = /* @__PURE__ */ o("$ZodCheckStartsWith", (e, t) => {
	A.init(e, t);
	let n = RegExp(`^${x(t.prefix)}.*`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Tt = /* @__PURE__ */ o("$ZodCheckEndsWith", (e, t) => {
	A.init(e, t);
	let n = RegExp(`.*${x(t.suffix)}$`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Et = /* @__PURE__ */ o("$ZodCheckOverwrite", (e, t) => {
	A.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), Dt = class {
	constructor(e = []) {
		this.content = [], this.indent = 0, this && (this.args = e);
	}
	indented(e) {
		this.indent += 1, e(this), --this.indent;
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.args, n = [...(this?.content ?? [""]).map((e) => `  ${e}`)];
		return new e(...t, n.join("\n"));
	}
}, Ot = {
	major: 4,
	minor: 3,
	patch: 6
}, M = /* @__PURE__ */ o("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Ot;
	let r = [...e._zod.def.checks ?? []];
	e._zod.traits.has("$ZodCheck") && r.unshift(e);
	for (let t of r) for (let n of t._zod.onattach) n(e);
	if (r.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (e, t, n) => {
			let r = w(e), i;
			for (let a of t) {
				if (a._zod.def.when) {
					if (!a._zod.def.when(e)) continue;
				} else if (r) continue;
				let t = e.issues.length, o = a._zod.check(e);
				if (o instanceof Promise && n?.async === !1) throw new s();
				if (i || o instanceof Promise) i = (i ?? Promise.resolve()).then(async () => {
					await o, e.issues.length !== t && (r ||= w(e, t));
				});
				else {
					if (e.issues.length === t) continue;
					r ||= w(e, t);
				}
			}
			return i ? i.then(() => e) : e;
		}, n = (n, i, a) => {
			if (w(n)) return n.aborted = !0, n;
			let o = t(i, r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new s();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (i, a) => {
			if (a.skipChecks) return e._zod.parse(i, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: i.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, i, a)) : n(t, i, a);
			}
			let o = e._zod.parse(i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new s();
				return o.then((e) => t(e, r, a));
			}
			return t(o, r, a);
		};
	}
	g(e, "~standard", () => ({
		validate: (t) => {
			try {
				let n = Ee(e, t);
				return n.success ? { value: n.data } : { issues: n.error?.issues };
			} catch {
				return De(e, t).then((e) => e.success ? { value: e.data } : { issues: e.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
}), kt = /* @__PURE__ */ o("$ZodString", (e, t) => {
	M.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? ot(e._zod.bag), e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), N = /* @__PURE__ */ o("$ZodStringFormat", (e, t) => {
	j.init(e, t), kt.init(e, t);
}), At = /* @__PURE__ */ o("$ZodGUID", (e, t) => {
	t.pattern ??= Ue, N.init(e, t);
}), jt = /* @__PURE__ */ o("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= We(e);
	} else t.pattern ??= We();
	N.init(e, t);
}), Mt = /* @__PURE__ */ o("$ZodEmail", (e, t) => {
	t.pattern ??= Ge, N.init(e, t);
}), Nt = /* @__PURE__ */ o("$ZodURL", (e, t) => {
	N.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = new URL(r);
			t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(i.hostname) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(i.protocol.endsWith(":") ? i.protocol.slice(0, -1) : i.protocol) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.normalize ? n.value = i.href : n.value = r;
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), Pt = /* @__PURE__ */ o("$ZodEmoji", (e, t) => {
	t.pattern ??= qe(), N.init(e, t);
}), Ft = /* @__PURE__ */ o("$ZodNanoID", (e, t) => {
	t.pattern ??= Ve, N.init(e, t);
}), It = /* @__PURE__ */ o("$ZodCUID", (e, t) => {
	t.pattern ??= Ie, N.init(e, t);
}), Lt = /* @__PURE__ */ o("$ZodCUID2", (e, t) => {
	t.pattern ??= Le, N.init(e, t);
}), Rt = /* @__PURE__ */ o("$ZodULID", (e, t) => {
	t.pattern ??= Re, N.init(e, t);
}), zt = /* @__PURE__ */ o("$ZodXID", (e, t) => {
	t.pattern ??= ze, N.init(e, t);
}), Bt = /* @__PURE__ */ o("$ZodKSUID", (e, t) => {
	t.pattern ??= Be, N.init(e, t);
}), Vt = /* @__PURE__ */ o("$ZodISODateTime", (e, t) => {
	t.pattern ??= at(t), N.init(e, t);
}), Ht = /* @__PURE__ */ o("$ZodISODate", (e, t) => {
	t.pattern ??= nt, N.init(e, t);
}), Ut = /* @__PURE__ */ o("$ZodISOTime", (e, t) => {
	t.pattern ??= it(t), N.init(e, t);
}), Wt = /* @__PURE__ */ o("$ZodISODuration", (e, t) => {
	t.pattern ??= He, N.init(e, t);
}), Gt = /* @__PURE__ */ o("$ZodIPv4", (e, t) => {
	t.pattern ??= Je, N.init(e, t), e._zod.bag.format = "ipv4";
}), Kt = /* @__PURE__ */ o("$ZodIPv6", (e, t) => {
	t.pattern ??= Ye, N.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
		try {
			new URL(`http://[${n.value}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), qt = /* @__PURE__ */ o("$ZodCIDRv4", (e, t) => {
	t.pattern ??= Xe, N.init(e, t);
}), Jt = /* @__PURE__ */ o("$ZodCIDRv6", (e, t) => {
	t.pattern ??= Ze, N.init(e, t), e._zod.check = (n) => {
		let r = n.value.split("/");
		try {
			if (r.length !== 2) throw Error();
			let [e, t] = r;
			if (!t) throw Error();
			let n = Number(t);
			if (`${n}` !== t || n < 0 || n > 128) throw Error();
			new URL(`http://[${e}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
});
function Yt(e) {
	if (e === "") return !0;
	if (e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var Xt = /* @__PURE__ */ o("$ZodBase64", (e, t) => {
	t.pattern ??= Qe, N.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
		Yt(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function Zt(e) {
	if (!$e.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return Yt(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var Qt = /* @__PURE__ */ o("$ZodBase64URL", (e, t) => {
	t.pattern ??= $e, N.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
		Zt(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), $t = /* @__PURE__ */ o("$ZodE164", (e, t) => {
	t.pattern ??= et, N.init(e, t);
});
function en(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var tn = /* @__PURE__ */ o("$ZodJWT", (e, t) => {
	N.init(e, t), e._zod.check = (n) => {
		en(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), nn = /* @__PURE__ */ o("$ZodNumber", (e, t) => {
	M.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? ct, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : "Infinity" : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), rn = /* @__PURE__ */ o("$ZodNumberFormat", (e, t) => {
	gt.init(e, t), nn.init(e, t);
}), an = /* @__PURE__ */ o("$ZodBoolean", (e, t) => {
	M.init(e, t), e._zod.pattern = lt, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = !!n.value;
		} catch {}
		let i = n.value;
		return typeof i == "boolean" || n.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
	};
}), on = /* @__PURE__ */ o("$ZodUnknown", (e, t) => {
	M.init(e, t), e._zod.parse = (e) => e;
}), sn = /* @__PURE__ */ o("$ZodNever", (e, t) => {
	M.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function cn(e, t, n) {
	e.issues.length && t.issues.push(..._e(n, e.issues)), t.value[n] = e.value;
}
var ln = /* @__PURE__ */ o("$ZodArray", (e, t) => {
	M.init(e, t), e._zod.parse = (n, r) => {
		let i = n.value;
		if (!Array.isArray(i)) return n.issues.push({
			expected: "array",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
		n.value = Array(i.length);
		let a = [];
		for (let e = 0; e < i.length; e++) {
			let o = i[e], s = t.element._zod.run({
				value: o,
				issues: []
			}, r);
			s instanceof Promise ? a.push(s.then((t) => cn(t, n, e))) : cn(s, n, e);
		}
		return a.length ? Promise.all(a).then(() => n) : n;
	};
});
function P(e, t, n, r, i) {
	if (e.issues.length) {
		if (i && !(n in r)) return;
		t.issues.push(..._e(n, e.issues));
	}
	e.value === void 0 ? n in r && (t.value[n] = void 0) : t.value[n] = e.value;
}
function un(e) {
	let t = Object.keys(e.shape);
	for (let n of t) if (!e.shape?.[n]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${n}": expected a Zod schema`);
	let n = ce(e.shape);
	return {
		...e,
		keys: t,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(n)
	};
}
function dn(e, t, n, r, i, a) {
	let o = [], s = i.keySet, c = i.catchall._zod, l = c.def.type, u = c.optout === "optional";
	for (let i in t) {
		if (s.has(i)) continue;
		if (l === "never") {
			o.push(i);
			continue;
		}
		let a = c.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => P(e, n, i, t, u))) : P(a, n, i, t, u);
	}
	return o.length && n.issues.push({
		code: "unrecognized_keys",
		keys: o,
		input: t,
		inst: a
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var fn = /* @__PURE__ */ o("$ZodObject", (e, t) => {
	if (M.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
		let e = t.shape;
		Object.defineProperty(t, "shape", { get: () => {
			let n = { ...e };
			return Object.defineProperty(t, "shape", { value: n }), n;
		} });
	}
	let n = p(() => un(t));
	g(e._zod, "propValues", () => {
		let e = t.shape, n = {};
		for (let t in e) {
			let r = e[t]._zod;
			if (r.values) {
				n[t] ?? (n[t] = /* @__PURE__ */ new Set());
				for (let e of r.values) n[t].add(e);
			}
		}
		return n;
	});
	let r = y, i = t.catchall, a;
	e._zod.parse = (t, o) => {
		a ??= n.value;
		let s = t.value;
		if (!r(s)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: s,
			inst: e
		}), t;
		t.value = {};
		let c = [], l = a.shape;
		for (let e of a.keys) {
			let n = l[e], r = n._zod.optout === "optional", i = n._zod.run({
				value: s[e],
				issues: []
			}, o);
			i instanceof Promise ? c.push(i.then((n) => P(n, t, e, s, r))) : P(i, t, e, s, r);
		}
		return i ? dn(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
	};
}), pn = /* @__PURE__ */ o("$ZodObjectJIT", (e, t) => {
	fn.init(e, t);
	let n = e._zod.parse, r = p(() => un(t)), i = (e) => {
		let t = new Dt([
			"shape",
			"payload",
			"ctx"
		]), n = r.value, i = (e) => {
			let t = ne(e);
			return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
		};
		t.write("const input = payload.value;");
		let a = Object.create(null), o = 0;
		for (let e of n.keys) a[e] = `key_${o++}`;
		t.write("const newResult = {};");
		for (let r of n.keys) {
			let n = a[r], o = ne(r), s = e[r]?._zod?.optout === "optional";
			t.write(`const ${n} = ${i(r)};`), s ? t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `) : t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `);
		}
		t.write("payload.value = newResult;"), t.write("return payload;");
		let s = t.compile();
		return (t, n) => s(e, t, n);
	}, a, o = y, s = !l.jitless, c = s && ae.value, u = t.catchall, d;
	e._zod.parse = (l, f) => {
		d ??= r.value;
		let p = l.value;
		return o(p) ? s && c && f?.async === !1 && f.jitless !== !0 ? (a ||= i(t.shape), l = a(l, f), u ? dn([], p, l, f, d, e) : l) : n(l, f) : (l.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), l);
	};
});
function mn(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !w(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => E(e, r, u())))
	}), t);
}
var hn = /* @__PURE__ */ o("$ZodUnion", (e, t) => {
	M.init(e, t), g(e._zod, "optin", () => t.options.some((e) => e._zod.optin === "optional") ? "optional" : void 0), g(e._zod, "optout", () => t.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), g(e._zod, "values", () => {
		if (t.options.every((e) => e._zod.values)) return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
	}), g(e._zod, "pattern", () => {
		if (t.options.every((e) => e._zod.pattern)) {
			let e = t.options.map((e) => e._zod.pattern);
			return RegExp(`^(${e.map((e) => h(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1, r = t.options[0]._zod.run;
	e._zod.parse = (i, a) => {
		if (n) return r(i, a);
		let o = !1, s = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: i.value,
				issues: []
			}, a);
			if (t instanceof Promise) s.push(t), o = !0;
			else {
				if (t.issues.length === 0) return t;
				s.push(t);
			}
		}
		return o ? Promise.all(s).then((t) => mn(t, i, e, a)) : mn(s, i, e, a);
	};
}), gn = /* @__PURE__ */ o("$ZodIntersection", (e, t) => {
	M.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => vn(e, t, n)) : vn(e, i, a);
	};
});
function _n(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (b(e) && b(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = _n(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = _n(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function vn(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i;
	for (let n of t.issues) if (n.code === "unrecognized_keys") {
		i ??= n;
		for (let e of n.keys) r.has(e) || r.set(e, {}), r.get(e).l = !0;
	} else e.issues.push(n);
	for (let t of n.issues) if (t.code === "unrecognized_keys") for (let e of t.keys) r.has(e) || r.set(e, {}), r.get(e).r = !0;
	else e.issues.push(t);
	let a = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (a.length && i && e.issues.push({
		...i,
		keys: a
	}), w(e)) return e;
	let o = _n(t.value, n.value);
	if (!o.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
	return e.value = o.data, e;
}
var yn = /* @__PURE__ */ o("$ZodEnum", (e, t) => {
	M.init(e, t);
	let n = d(t.entries), r = new Set(n);
	e._zod.values = r, e._zod.pattern = RegExp(`^(${n.filter((e) => se.has(typeof e)).map((e) => typeof e == "string" ? x(e) : e.toString()).join("|")})$`), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), bn = /* @__PURE__ */ o("$ZodTransform", (e, t) => {
	M.init(e, t), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new c(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new s();
		return n.value = i, n;
	};
});
function xn(e, t) {
	return e.issues.length && t === void 0 ? {
		issues: [],
		value: void 0
	} : e;
}
var Sn = /* @__PURE__ */ o("$ZodOptional", (e, t) => {
	M.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", g(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, void 0]) : void 0), g(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${h(e.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (t.innerType._zod.optin === "optional") {
			let r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then((t) => xn(t, e.value)) : xn(r, e.value);
		}
		return e.value === void 0 ? e : t.innerType._zod.run(e, n);
	};
}), Cn = /* @__PURE__ */ o("$ZodExactOptional", (e, t) => {
	Sn.init(e, t), g(e._zod, "values", () => t.innerType._zod.values), g(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), wn = /* @__PURE__ */ o("$ZodNullable", (e, t) => {
	M.init(e, t), g(e._zod, "optin", () => t.innerType._zod.optin), g(e._zod, "optout", () => t.innerType._zod.optout), g(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${h(e.source)}|null)$`) : void 0;
	}), g(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), Tn = /* @__PURE__ */ o("$ZodDefault", (e, t) => {
	M.init(e, t), e._zod.optin = "optional", g(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => En(e, t)) : En(r, t);
	};
});
function En(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Dn = /* @__PURE__ */ o("$ZodPrefault", (e, t) => {
	M.init(e, t), e._zod.optin = "optional", g(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), On = /* @__PURE__ */ o("$ZodNonOptional", (e, t) => {
	M.init(e, t), g(e._zod, "values", () => {
		let e = t.innerType._zod.values;
		return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => kn(t, e)) : kn(i, e);
	};
});
function kn(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
var An = /* @__PURE__ */ o("$ZodCatch", (e, t) => {
	M.init(e, t), g(e._zod, "optin", () => t.innerType._zod.optin), g(e._zod, "optout", () => t.innerType._zod.optout), g(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((r) => (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => E(e, n, u())) },
			input: e.value
		}), e.issues = []), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => E(e, n, u())) },
			input: e.value
		}), e.issues = []), e);
	};
}), jn = /* @__PURE__ */ o("$ZodPipe", (e, t) => {
	M.init(e, t), g(e._zod, "values", () => t.in._zod.values), g(e._zod, "optin", () => t.in._zod.optin), g(e._zod, "optout", () => t.out._zod.optout), g(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => F(e, t.in, n)) : F(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => F(e, t.out, n)) : F(r, t.out, n);
	};
});
function F(e, t, n) {
	return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var Mn = /* @__PURE__ */ o("$ZodReadonly", (e, t) => {
	M.init(e, t), g(e._zod, "propValues", () => t.innerType._zod.propValues), g(e._zod, "values", () => t.innerType._zod.values), g(e._zod, "optin", () => t.innerType?._zod?.optin), g(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(Nn) : Nn(r);
	};
});
function Nn(e) {
	return e.value = Object.freeze(e.value), e;
}
var Pn = /* @__PURE__ */ o("$ZodCustom", (e, t) => {
	A.init(e, t), M.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => Fn(t, n, r, e));
		Fn(i, n, r, e);
	};
});
function Fn(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(D(e));
	}
}
//#endregion
//#region node_modules/zod/v4/core/registries.js
var In, Ln = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function Rn() {
	return new Ln();
}
(In = globalThis).__zod_globalRegistry ?? (In.__zod_globalRegistry = Rn());
var I = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function zn(e, t) {
	return new e({
		type: "string",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Bn(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Vn(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Hn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Un(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Wn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Gn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Kn(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function qn(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Jn(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Yn(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Xn(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Zn(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Qn(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function $n(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function er(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function tr(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function nr(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function rr(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ir(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ar(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function or(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function sr(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function cr(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function lr(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ur(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function dr(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function fr(e, t) {
	return new e({
		type: "number",
		checks: [],
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function pr(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function mr(e, t) {
	return new e({
		type: "boolean",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function hr(e) {
	return new e({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function gr(e, t) {
	return new e({
		type: "never",
		...C(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _r(e, t) {
	return new pt({
		check: "less_than",
		...C(t),
		value: e,
		inclusive: !1
	});
}
/* @__NO_SIDE_EFFECTS__ */
function vr(e, t) {
	return new pt({
		check: "less_than",
		...C(t),
		value: e,
		inclusive: !0
	});
}
/* @__NO_SIDE_EFFECTS__ */
function yr(e, t) {
	return new mt({
		check: "greater_than",
		...C(t),
		value: e,
		inclusive: !1
	});
}
/* @__NO_SIDE_EFFECTS__ */
function br(e, t) {
	return new mt({
		check: "greater_than",
		...C(t),
		value: e,
		inclusive: !0
	});
}
/* @__NO_SIDE_EFFECTS__ */
function xr(e, t) {
	return new ht({
		check: "multiple_of",
		...C(t),
		value: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Sr(e, t) {
	return new _t({
		check: "max_length",
		...C(t),
		maximum: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function L(e, t) {
	return new vt({
		check: "min_length",
		...C(t),
		minimum: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Cr(e, t) {
	return new yt({
		check: "length_equals",
		...C(t),
		length: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function wr(e, t) {
	return new bt({
		check: "string_format",
		format: "regex",
		...C(t),
		pattern: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Tr(e) {
	return new xt({
		check: "string_format",
		format: "lowercase",
		...C(e)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Er(e) {
	return new St({
		check: "string_format",
		format: "uppercase",
		...C(e)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Dr(e, t) {
	return new Ct({
		check: "string_format",
		format: "includes",
		...C(t),
		includes: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Or(e, t) {
	return new wt({
		check: "string_format",
		format: "starts_with",
		...C(t),
		prefix: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function kr(e, t) {
	return new Tt({
		check: "string_format",
		format: "ends_with",
		...C(t),
		suffix: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function R(e) {
	return new Et({
		check: "overwrite",
		tx: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Ar(e) {
	return /* @__PURE__ */ R((t) => t.normalize(e));
}
/* @__NO_SIDE_EFFECTS__ */
function jr() {
	return /* @__PURE__ */ R((e) => e.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function Mr() {
	return /* @__PURE__ */ R((e) => e.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function Nr() {
	return /* @__PURE__ */ R((e) => e.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function Pr() {
	return /* @__PURE__ */ R((e) => re(e));
}
/* @__NO_SIDE_EFFECTS__ */
function Fr(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...C(n)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Ir(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...C(n)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Lr(e) {
	let t = /* @__PURE__ */ Rr((n) => (n.addIssue = (e) => {
		if (typeof e == "string") n.issues.push(D(e, n.value, t._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", r.input ??= n.value, r.inst ??= t, r.continue ??= !t._zod.def.abort, n.issues.push(D(r));
		}
	}, e(n.value, n)));
	return t;
}
/* @__NO_SIDE_EFFECTS__ */
function Rr(e, t) {
	let n = new A({
		check: "custom",
		...C(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function zr(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? I,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		external: e?.external ?? void 0
	};
}
function z(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o);
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, z(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Object.assign(o.schema, c), t.io === "input" && B(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && o.schema._prefault && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Br(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${a}`
			};
		}
		if (t[1] === n) return { ref: "#" };
		let i = `#/${r}/`, a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + a
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) {
			a(n);
			continue;
		}
		if (e.external) {
			let r = e.external.registry.get(n[0])?.id;
			if (t !== n[0] && r) {
				a(n);
				continue;
			}
		}
		if (e.metadataRegistry.get(n[0])?.id) {
			a(n);
			continue;
		}
		if (r.cycle) {
			a(n);
			continue;
		}
		if (r.count > 1 && e.reused === "ref") {
			a(n);
			continue;
		}
	}
}
function Vr(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Object.assign(i, s), Object.assign(i, a), t._zod.parent === o) for (let e in i) e === "$ref" || e === "allOf" || e in a || delete i[e];
			if (s.$ref && n.def) for (let e in i) e === "$ref" || e === "allOf" || e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e === "$ref" || e === "allOf" || e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	for (let t of [...e.seen.entries()].reverse()) r(t[0]);
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Object.assign(i, n.def ?? n.schema);
	let a = e.external?.defs ?? {};
	for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (a[e.defId] = e.def);
	}
	e.external || Object.keys(a).length > 0 && (e.target === "draft-2020-12" ? i.$defs = a : i.definitions = a);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: V(t, "input", e.processors),
					output: V(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function B(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return B(r.element, n);
	if (r.type === "set") return B(r.valueType, n);
	if (r.type === "lazy") return B(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault") return B(r.innerType, n);
	if (r.type === "intersection") return B(r.left, n) || B(r.right, n);
	if (r.type === "record" || r.type === "map") return B(r.keyType, n) || B(r.valueType, n);
	if (r.type === "pipe") return B(r.in, n) || B(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (B(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (B(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (B(e, n)) return !0;
		return !!(r.rest && B(r.rest, n));
	}
	return !1;
}
var Hr = (e, t = {}) => (n) => {
	let r = zr({
		...n,
		processors: t
	});
	return z(e, r), Br(r, e), Vr(r, e);
}, V = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = zr({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return z(e, o), Br(o, e), Vr(o, e);
}, Ur = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, Wr = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = Ur[s] ?? s, i.format === "" && delete i.format, s === "time" && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c];
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, Gr = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, format: s, multipleOf: c, exclusiveMaximum: l, exclusiveMinimum: u } = e._zod.bag;
	typeof s == "string" && s.includes("int") ? i.type = "integer" : i.type = "number", typeof u == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (i.minimum = u, i.exclusiveMinimum = !0) : i.exclusiveMinimum = u), typeof a == "number" && (i.minimum = a, typeof u == "number" && t.target !== "draft-04" && (u >= a ? delete i.minimum : delete i.exclusiveMinimum)), typeof l == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (i.maximum = l, i.exclusiveMaximum = !0) : i.exclusiveMaximum = l), typeof o == "number" && (i.maximum = o, typeof l == "number" && t.target !== "draft-04" && (l <= o ? delete i.maximum : delete i.exclusiveMaximum)), typeof c == "number" && (i.multipleOf = c);
}, Kr = (e, t, n, r) => {
	n.type = "boolean";
}, qr = (e, t, n, r) => {
	n.not = {};
}, Jr = (e, t, n, r) => {
	let i = e._zod.def, a = d(i.entries);
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, Yr = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
}, Xr = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
}, Zr = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = e._zod.bag;
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = z(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
}, Qr = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object", i.properties = {};
	let o = a.shape;
	for (let e in o) i.properties[e] = z(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	});
	let s = new Set(Object.keys(o)), c = new Set([...s].filter((e) => {
		let n = a.shape[e]._zod;
		return t.io === "input" ? n.optin === void 0 : n.optout === void 0;
	}));
	c.size > 0 && (i.required = Array.from(c)), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = z(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, $r = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => z(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, ei = (e, t, n, r) => {
	let i = e._zod.def, a = z(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = z(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1;
	n.allOf = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
}, ti = (e, t, n, r) => {
	let i = e._zod.def, a = z(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, ni = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, ri = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.default = JSON.parse(JSON.stringify(i.defaultValue));
}, ii = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue)));
}, ai = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		throw Error("Dynamic catch values are not supported in JSON Schema");
	}
	n.default = o;
}, oi = (e, t, n, r) => {
	let i = e._zod.def, a = t.io === "input" ? i.in._zod.def.type === "transform" ? i.out : i.in : i.out;
	z(a, t, r);
	let o = t.seen.get(e);
	o.ref = a;
}, si = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, ci = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, li = /* @__PURE__ */ o("ZodISODateTime", (e, t) => {
	Vt.init(e, t), G.init(e, t);
});
function ui(e) {
	return /* @__PURE__ */ cr(li, e);
}
var di = /* @__PURE__ */ o("ZodISODate", (e, t) => {
	Ht.init(e, t), G.init(e, t);
});
function fi(e) {
	return /* @__PURE__ */ lr(di, e);
}
var pi = /* @__PURE__ */ o("ZodISOTime", (e, t) => {
	Ut.init(e, t), G.init(e, t);
});
function mi(e) {
	return /* @__PURE__ */ ur(pi, e);
}
var hi = /* @__PURE__ */ o("ZodISODuration", (e, t) => {
	Wt.init(e, t), G.init(e, t);
});
function gi(e) {
	return /* @__PURE__ */ dr(hi, e);
}
//#endregion
//#region node_modules/zod/v4/classic/errors.js
var _i = (e, t) => {
	be.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
		format: { value: (t) => Ce(e, t) },
		flatten: { value: (t) => Se(e, t) },
		addIssue: { value: (t) => {
			e.issues.push(t), e.message = JSON.stringify(e.issues, f, 2);
		} },
		addIssues: { value: (t) => {
			e.issues.push(...t), e.message = JSON.stringify(e.issues, f, 2);
		} },
		isEmpty: { get() {
			return e.issues.length === 0;
		} }
	});
};
o("ZodError", _i);
var H = o("ZodError", _i, { Parent: Error }), vi = /* @__PURE__ */ we(H), yi = /* @__PURE__ */ Te(H), bi = /* @__PURE__ */ O(H), xi = /* @__PURE__ */ k(H), Si = /* @__PURE__ */ Oe(H), Ci = /* @__PURE__ */ ke(H), wi = /* @__PURE__ */ Ae(H), Ti = /* @__PURE__ */ je(H), Ei = /* @__PURE__ */ Me(H), Di = /* @__PURE__ */ Ne(H), Oi = /* @__PURE__ */ Pe(H), ki = /* @__PURE__ */ Fe(H), U = /* @__PURE__ */ o("ZodType", (e, t) => (M.init(e, t), Object.assign(e["~standard"], { jsonSchema: {
	input: V(e, "input"),
	output: V(e, "output")
} }), e.toJSONSchema = Hr(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(v(t, { checks: [...t.checks ?? [], ...n.map((e) => typeof e == "function" ? { _zod: {
	check: e,
	def: { check: "custom" },
	onattach: []
} } : e)] }), { parent: !0 }), e.with = e.check, e.clone = (t, n) => S(e, t, n), e.brand = () => e, e.register = ((t, n) => (t.add(e, n), e)), e.parse = (t, n) => vi(e, t, n, { callee: e.parse }), e.safeParse = (t, n) => bi(e, t, n), e.parseAsync = async (t, n) => yi(e, t, n, { callee: e.parseAsync }), e.safeParseAsync = async (t, n) => xi(e, t, n), e.spa = e.safeParseAsync, e.encode = (t, n) => Si(e, t, n), e.decode = (t, n) => Ci(e, t, n), e.encodeAsync = async (t, n) => wi(e, t, n), e.decodeAsync = async (t, n) => Ti(e, t, n), e.safeEncode = (t, n) => Ei(e, t, n), e.safeDecode = (t, n) => Di(e, t, n), e.safeEncodeAsync = async (t, n) => Oi(e, t, n), e.safeDecodeAsync = async (t, n) => ki(e, t, n), e.refine = (t, n) => e.check(Fa(t, n)), e.superRefine = (t) => e.check(Ia(t)), e.overwrite = (t) => e.check(/* @__PURE__ */ R(t)), e.optional = () => _a(e), e.exactOptional = () => ya(e), e.nullable = () => xa(e), e.nullish = () => _a(xa(e)), e.nonoptional = (t) => Da(e, t), e.array = () => q(e), e.or = (t) => ua([e, t]), e.and = (t) => fa(e, t), e.transform = (t) => ja(e, ha(t)), e.default = (t) => Ca(e, t), e.prefault = (t) => Ta(e, t), e.catch = (t) => ka(e, t), e.pipe = (t) => ja(e, t), e.readonly = () => Na(e), e.describe = (t) => {
	let n = e.clone();
	return I.add(n, { description: t }), n;
}, Object.defineProperty(e, "description", {
	get() {
		return I.get(e)?.description;
	},
	configurable: !0
}), e.meta = (...t) => {
	if (t.length === 0) return I.get(e);
	let n = e.clone();
	return I.add(n, t[0]), n;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (t) => t(e), e)), Ai = /* @__PURE__ */ o("_ZodString", (e, t) => {
	kt.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Wr(e, t, n, r);
	let n = e._zod.bag;
	e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...t) => e.check(/* @__PURE__ */ wr(...t)), e.includes = (...t) => e.check(/* @__PURE__ */ Dr(...t)), e.startsWith = (...t) => e.check(/* @__PURE__ */ Or(...t)), e.endsWith = (...t) => e.check(/* @__PURE__ */ kr(...t)), e.min = (...t) => e.check(/* @__PURE__ */ L(...t)), e.max = (...t) => e.check(/* @__PURE__ */ Sr(...t)), e.length = (...t) => e.check(/* @__PURE__ */ Cr(...t)), e.nonempty = (...t) => e.check(/* @__PURE__ */ L(1, ...t)), e.lowercase = (t) => e.check(/* @__PURE__ */ Tr(t)), e.uppercase = (t) => e.check(/* @__PURE__ */ Er(t)), e.trim = () => e.check(/* @__PURE__ */ jr()), e.normalize = (...t) => e.check(/* @__PURE__ */ Ar(...t)), e.toLowerCase = () => e.check(/* @__PURE__ */ Mr()), e.toUpperCase = () => e.check(/* @__PURE__ */ Nr()), e.slugify = () => e.check(/* @__PURE__ */ Pr());
}), ji = /* @__PURE__ */ o("ZodString", (e, t) => {
	kt.init(e, t), Ai.init(e, t), e.email = (t) => e.check(/* @__PURE__ */ Bn(Mi, t)), e.url = (t) => e.check(/* @__PURE__ */ Kn(Pi, t)), e.jwt = (t) => e.check(/* @__PURE__ */ sr(Yi, t)), e.emoji = (t) => e.check(/* @__PURE__ */ qn(Fi, t)), e.guid = (t) => e.check(/* @__PURE__ */ Vn(Ni, t)), e.uuid = (t) => e.check(/* @__PURE__ */ Hn(K, t)), e.uuidv4 = (t) => e.check(/* @__PURE__ */ Un(K, t)), e.uuidv6 = (t) => e.check(/* @__PURE__ */ Wn(K, t)), e.uuidv7 = (t) => e.check(/* @__PURE__ */ Gn(K, t)), e.nanoid = (t) => e.check(/* @__PURE__ */ Jn(Ii, t)), e.guid = (t) => e.check(/* @__PURE__ */ Vn(Ni, t)), e.cuid = (t) => e.check(/* @__PURE__ */ Yn(Li, t)), e.cuid2 = (t) => e.check(/* @__PURE__ */ Xn(Ri, t)), e.ulid = (t) => e.check(/* @__PURE__ */ Zn(zi, t)), e.base64 = (t) => e.check(/* @__PURE__ */ ir(Ki, t)), e.base64url = (t) => e.check(/* @__PURE__ */ ar(qi, t)), e.xid = (t) => e.check(/* @__PURE__ */ Qn(Bi, t)), e.ksuid = (t) => e.check(/* @__PURE__ */ $n(Vi, t)), e.ipv4 = (t) => e.check(/* @__PURE__ */ er(Hi, t)), e.ipv6 = (t) => e.check(/* @__PURE__ */ tr(Ui, t)), e.cidrv4 = (t) => e.check(/* @__PURE__ */ nr(Wi, t)), e.cidrv6 = (t) => e.check(/* @__PURE__ */ rr(Gi, t)), e.e164 = (t) => e.check(/* @__PURE__ */ or(Ji, t)), e.datetime = (t) => e.check(ui(t)), e.date = (t) => e.check(fi(t)), e.time = (t) => e.check(mi(t)), e.duration = (t) => e.check(gi(t));
});
function W(e) {
	return /* @__PURE__ */ zn(ji, e);
}
var G = /* @__PURE__ */ o("ZodStringFormat", (e, t) => {
	N.init(e, t), Ai.init(e, t);
}), Mi = /* @__PURE__ */ o("ZodEmail", (e, t) => {
	Mt.init(e, t), G.init(e, t);
}), Ni = /* @__PURE__ */ o("ZodGUID", (e, t) => {
	At.init(e, t), G.init(e, t);
}), K = /* @__PURE__ */ o("ZodUUID", (e, t) => {
	jt.init(e, t), G.init(e, t);
}), Pi = /* @__PURE__ */ o("ZodURL", (e, t) => {
	Nt.init(e, t), G.init(e, t);
}), Fi = /* @__PURE__ */ o("ZodEmoji", (e, t) => {
	Pt.init(e, t), G.init(e, t);
}), Ii = /* @__PURE__ */ o("ZodNanoID", (e, t) => {
	Ft.init(e, t), G.init(e, t);
}), Li = /* @__PURE__ */ o("ZodCUID", (e, t) => {
	It.init(e, t), G.init(e, t);
}), Ri = /* @__PURE__ */ o("ZodCUID2", (e, t) => {
	Lt.init(e, t), G.init(e, t);
}), zi = /* @__PURE__ */ o("ZodULID", (e, t) => {
	Rt.init(e, t), G.init(e, t);
}), Bi = /* @__PURE__ */ o("ZodXID", (e, t) => {
	zt.init(e, t), G.init(e, t);
}), Vi = /* @__PURE__ */ o("ZodKSUID", (e, t) => {
	Bt.init(e, t), G.init(e, t);
}), Hi = /* @__PURE__ */ o("ZodIPv4", (e, t) => {
	Gt.init(e, t), G.init(e, t);
}), Ui = /* @__PURE__ */ o("ZodIPv6", (e, t) => {
	Kt.init(e, t), G.init(e, t);
}), Wi = /* @__PURE__ */ o("ZodCIDRv4", (e, t) => {
	qt.init(e, t), G.init(e, t);
}), Gi = /* @__PURE__ */ o("ZodCIDRv6", (e, t) => {
	Jt.init(e, t), G.init(e, t);
}), Ki = /* @__PURE__ */ o("ZodBase64", (e, t) => {
	Xt.init(e, t), G.init(e, t);
}), qi = /* @__PURE__ */ o("ZodBase64URL", (e, t) => {
	Qt.init(e, t), G.init(e, t);
}), Ji = /* @__PURE__ */ o("ZodE164", (e, t) => {
	$t.init(e, t), G.init(e, t);
}), Yi = /* @__PURE__ */ o("ZodJWT", (e, t) => {
	tn.init(e, t), G.init(e, t);
}), Xi = /* @__PURE__ */ o("ZodNumber", (e, t) => {
	nn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Gr(e, t, n, r), e.gt = (t, n) => e.check(/* @__PURE__ */ yr(t, n)), e.gte = (t, n) => e.check(/* @__PURE__ */ br(t, n)), e.min = (t, n) => e.check(/* @__PURE__ */ br(t, n)), e.lt = (t, n) => e.check(/* @__PURE__ */ _r(t, n)), e.lte = (t, n) => e.check(/* @__PURE__ */ vr(t, n)), e.max = (t, n) => e.check(/* @__PURE__ */ vr(t, n)), e.int = (t) => e.check($i(t)), e.safe = (t) => e.check($i(t)), e.positive = (t) => e.check(/* @__PURE__ */ yr(0, t)), e.nonnegative = (t) => e.check(/* @__PURE__ */ br(0, t)), e.negative = (t) => e.check(/* @__PURE__ */ _r(0, t)), e.nonpositive = (t) => e.check(/* @__PURE__ */ vr(0, t)), e.multipleOf = (t, n) => e.check(/* @__PURE__ */ xr(t, n)), e.step = (t, n) => e.check(/* @__PURE__ */ xr(t, n)), e.finite = () => e;
	let n = e._zod.bag;
	e.minValue = Math.max(n.minimum ?? -Infinity, n.exclusiveMinimum ?? -Infinity) ?? null, e.maxValue = Math.min(n.maximum ?? Infinity, n.exclusiveMaximum ?? Infinity) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? .5), e.isFinite = !0, e.format = n.format ?? null;
});
function Zi(e) {
	return /* @__PURE__ */ fr(Xi, e);
}
var Qi = /* @__PURE__ */ o("ZodNumberFormat", (e, t) => {
	rn.init(e, t), Xi.init(e, t);
});
function $i(e) {
	return /* @__PURE__ */ pr(Qi, e);
}
var ea = /* @__PURE__ */ o("ZodBoolean", (e, t) => {
	an.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Kr(e, t, n, r);
});
function ta(e) {
	return /* @__PURE__ */ mr(ea, e);
}
var na = /* @__PURE__ */ o("ZodUnknown", (e, t) => {
	on.init(e, t), U.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function ra() {
	return /* @__PURE__ */ hr(na);
}
var ia = /* @__PURE__ */ o("ZodNever", (e, t) => {
	sn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => qr(e, t, n, r);
});
function aa(e) {
	return /* @__PURE__ */ gr(ia, e);
}
var oa = /* @__PURE__ */ o("ZodArray", (e, t) => {
	ln.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Zr(e, t, n, r), e.element = t.element, e.min = (t, n) => e.check(/* @__PURE__ */ L(t, n)), e.nonempty = (t) => e.check(/* @__PURE__ */ L(1, t)), e.max = (t, n) => e.check(/* @__PURE__ */ Sr(t, n)), e.length = (t, n) => e.check(/* @__PURE__ */ Cr(t, n)), e.unwrap = () => e.element;
});
function q(e, t) {
	return /* @__PURE__ */ Fr(oa, e, t);
}
var sa = /* @__PURE__ */ o("ZodObject", (e, t) => {
	pn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Qr(e, t, n, r), g(e, "shape", () => t.shape), e.keyof = () => J(Object.keys(e._zod.def.shape)), e.catchall = (t) => e.clone({
		...e._zod.def,
		catchall: t
	}), e.passthrough = () => e.clone({
		...e._zod.def,
		catchall: ra()
	}), e.loose = () => e.clone({
		...e._zod.def,
		catchall: ra()
	}), e.strict = () => e.clone({
		...e._zod.def,
		catchall: aa()
	}), e.strip = () => e.clone({
		...e._zod.def,
		catchall: void 0
	}), e.extend = (t) => fe(e, t), e.safeExtend = (t) => pe(e, t), e.merge = (t) => me(e, t), e.pick = (t) => ue(e, t), e.omit = (t) => de(e, t), e.partial = (...t) => he(ga, e, t[0]), e.required = (...t) => ge(Ea, e, t[0]);
});
function ca(e, t) {
	return new sa({
		type: "object",
		shape: e ?? {},
		...C(t)
	});
}
var la = /* @__PURE__ */ o("ZodUnion", (e, t) => {
	hn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => $r(e, t, n, r), e.options = t.options;
});
function ua(e, t) {
	return new la({
		type: "union",
		options: e,
		...C(t)
	});
}
var da = /* @__PURE__ */ o("ZodIntersection", (e, t) => {
	gn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ei(e, t, n, r);
});
function fa(e, t) {
	return new da({
		type: "intersection",
		left: e,
		right: t
	});
}
var pa = /* @__PURE__ */ o("ZodEnum", (e, t) => {
	yn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Jr(e, t, n, r), e.enum = t.entries, e.options = Object.values(t.entries);
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new pa({
			...t,
			checks: [],
			...C(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new pa({
			...t,
			checks: [],
			...C(r),
			entries: i
		});
	};
});
function J(e, t) {
	return new pa({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...C(t)
	});
}
var ma = /* @__PURE__ */ o("ZodTransform", (e, t) => {
	bn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Xr(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new c(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(D(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", t.input ??= n.value, t.inst ??= e, n.issues.push(D(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function ha(e) {
	return new ma({
		type: "transform",
		transform: e
	});
}
var ga = /* @__PURE__ */ o("ZodOptional", (e, t) => {
	Sn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ci(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function _a(e) {
	return new ga({
		type: "optional",
		innerType: e
	});
}
var va = /* @__PURE__ */ o("ZodExactOptional", (e, t) => {
	Cn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ci(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ya(e) {
	return new va({
		type: "optional",
		innerType: e
	});
}
var ba = /* @__PURE__ */ o("ZodNullable", (e, t) => {
	wn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ti(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function xa(e) {
	return new ba({
		type: "nullable",
		innerType: e
	});
}
var Sa = /* @__PURE__ */ o("ZodDefault", (e, t) => {
	Tn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ri(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Ca(e, t) {
	return new Sa({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : oe(t);
		}
	});
}
var wa = /* @__PURE__ */ o("ZodPrefault", (e, t) => {
	Dn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ii(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ta(e, t) {
	return new wa({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : oe(t);
		}
	});
}
var Ea = /* @__PURE__ */ o("ZodNonOptional", (e, t) => {
	On.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ni(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Da(e, t) {
	return new Ea({
		type: "nonoptional",
		innerType: e,
		...C(t)
	});
}
var Oa = /* @__PURE__ */ o("ZodCatch", (e, t) => {
	An.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => ai(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function ka(e, t) {
	return new Oa({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : () => t
	});
}
var Aa = /* @__PURE__ */ o("ZodPipe", (e, t) => {
	jn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => oi(e, t, n, r), e.in = t.in, e.out = t.out;
});
function ja(e, t) {
	return new Aa({
		type: "pipe",
		in: e,
		out: t
	});
}
var Ma = /* @__PURE__ */ o("ZodReadonly", (e, t) => {
	Mn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => si(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Na(e) {
	return new Ma({
		type: "readonly",
		innerType: e
	});
}
var Pa = /* @__PURE__ */ o("ZodCustom", (e, t) => {
	Pn.init(e, t), U.init(e, t), e._zod.processJSONSchema = (t, n, r) => Yr(e, t, n, r);
});
function Fa(e, t = {}) {
	return /* @__PURE__ */ Ir(Pa, e, t);
}
function Ia(e) {
	return /* @__PURE__ */ Lr(e);
}
//#endregion
//#region src/styles.css?inline
var La = "@import \"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;600&display=swap\";#plugin-davinci .plugin-shell{--bg:radial-gradient(circle at 12% 16%, #ffe4ba 0%, #ffe4ba 12%, #fff8eb 55%, #fef7e8 100%);--surface:#fffef8;--ink:#1f1c16;--muted:#6d6455;--line:#eadcc3;--accent:#0f8b8d;--accent-2:#ff7a59;--danger:#c92a2a;--shadow:0 18px 48px #452c1124;min-height:100%;color:var(--ink);background:var(--bg);padding:18px;font-family:Space Grotesk,Segoe UI,sans-serif}#plugin-davinci .plugin-card{border:1px solid var(--line);background:color-mix(in srgb, var(--surface) 85%, #fff 15%);box-shadow:var(--shadow);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);border-radius:18px;padding:18px}#plugin-davinci .plugin-grid{grid-template-columns:1fr;gap:16px;display:grid}#plugin-davinci .plugin-heading{letter-spacing:.01em;margin:0 0 6px;font-size:clamp(1.25rem,1.5vw,1.65rem);line-height:1.2}#plugin-davinci .plugin-subtitle{color:var(--muted);margin:0;font-size:.95rem}#plugin-davinci .plugin-form{gap:12px;margin-top:16px;display:grid}#plugin-davinci .plugin-row{grid-template-columns:1fr;gap:10px;display:grid}#plugin-davinci .plugin-row-2{grid-template-columns:1fr}#plugin-davinci .plugin-label{gap:6px;font-size:.92rem;font-weight:600;display:grid}#plugin-davinci .plugin-input,#plugin-davinci .plugin-select,#plugin-davinci .plugin-textarea{border:1px solid var(--line);width:100%;min-height:44px;color:var(--ink);font:inherit;background:#fffcf5;border-radius:10px;padding:10px 12px}#plugin-davinci .plugin-textarea{resize:vertical;min-height:96px}#plugin-davinci .plugin-check{align-items:center;gap:10px;min-height:44px;display:flex}#plugin-davinci .plugin-check input{width:20px;height:20px}#plugin-davinci .plugin-step-builder{border:1px dashed var(--line);background:#fffdfa;border-radius:12px;gap:10px;padding:12px;display:grid}#plugin-davinci .plugin-row-3{grid-template-columns:1fr}#plugin-davinci .plugin-step-list{gap:8px;display:grid}#plugin-davinci .plugin-step-item{border:1px solid var(--line);background:#fffef8;border-radius:10px;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;padding:8px 10px;display:flex}#plugin-davinci .plugin-step-text{color:var(--muted);margin:0;font-family:JetBrains Mono,Consolas,monospace;font-size:.8rem}#plugin-davinci .plugin-actions{flex-wrap:wrap;gap:10px;display:flex}#plugin-davinci .plugin-btn{letter-spacing:.01em;cursor:pointer;border:0;border-radius:12px;min-height:44px;padding:10px 14px;font-family:Space Grotesk,Segoe UI,sans-serif;font-weight:700;transition:transform .18s,box-shadow .18s,opacity .18s}#plugin-davinci .plugin-btn:hover{transform:translateY(-1px)}#plugin-davinci .plugin-btn:active{transform:translateY(0)}#plugin-davinci .plugin-btn-primary{color:#fff;background:linear-gradient(135deg, var(--accent), #1fa39f);box-shadow:0 10px 24px #0f8b8d4d}#plugin-davinci .plugin-btn-alt{color:#fff;background:linear-gradient(135deg, var(--accent-2), #ff9a60);box-shadow:0 10px 24px #ff7a5947}#plugin-davinci .plugin-btn-danger{color:#fff;background:linear-gradient(135deg, var(--danger), #dc5f5f)}#plugin-davinci .plugin-muted{color:var(--muted);font-size:.9rem}#plugin-davinci .plugin-list{gap:10px;margin-top:14px;display:grid}#plugin-davinci .plugin-task{border:1px solid var(--line);background:#fffef8;border-radius:12px;padding:12px;animation:.22s rise-in}#plugin-davinci .plugin-task-head{justify-content:space-between;align-items:start;gap:8px;display:flex}#plugin-davinci .plugin-task-title{margin:0;font-size:1rem}#plugin-davinci .plugin-task-meta{color:var(--muted);margin:6px 0 0;font-family:JetBrains Mono,Consolas,monospace;font-size:.82rem}#plugin-davinci .plugin-empty{border:1px dashed var(--line);color:var(--muted);text-align:center;border-radius:12px;padding:14px}@keyframes rise-in{0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@media (width>=820px){#plugin-davinci .plugin-grid{grid-template-columns:1.05fr .95fr}#plugin-davinci .plugin-row-2{grid-template-columns:repeat(2,minmax(0,1fr))}#plugin-davinci .plugin-row-3{grid-template-columns:repeat(3,minmax(0,1fr))}}", Ra = "Davinvi", Y = "davinci", za = "1", Ba = "tasks", Va = "TASK_COUNT_CHANGED", Ha = "DAVINVI_IMPORT_TASKS", Ua = `plugin-${Y}`, Wa = ca({
	modifier: J([
		"none",
		"alt",
		"ctrl",
		"shift"
	]),
	key: W().min(1),
	delayAfterMs: Zi().int().nonnegative(),
	isRawSendKeys: ta().optional().default(!1)
}), Ga = ca({
	id: W().min(1),
	title: W().min(1),
	steps: q(Wa).min(1),
	requireInput: ta(),
	inputMode: J(["manual", "list"]),
	manualValue: W(),
	listValues: q(W())
}), Ka = ca({
	id: W().min(1),
	title: W().min(1),
	hotkey: W().min(1),
	delayMs: Zi().int().nonnegative(),
	requireInput: ta(),
	inputMode: J(["manual", "list"]),
	manualValue: W(),
	listValues: q(W())
}), qa = q(Ga), Ja = [
	{
		label: "空白",
		value: "none"
	},
	{
		label: "Alt",
		value: "alt"
	},
	{
		label: "Ctrl",
		value: "ctrl"
	},
	{
		label: "Shift",
		value: "shift"
	}
], Ya = {
	none: "None",
	alt: "Alt",
	ctrl: "Ctrl",
	shift: "Shift"
}, Xa = {
	enter: "ENTER",
	tab: "TAB",
	esc: "ESC",
	escape: "ESC",
	space: "SPACE",
	backspace: "BACKSPACE",
	delete: "DELETE",
	del: "DELETE",
	insert: "INSERT",
	home: "HOME",
	end: "END",
	pgup: "PGUP",
	pageup: "PGUP",
	pgdn: "PGDN",
	pagedown: "PGDN",
	up: "UP",
	down: "DOWN",
	left: "LEFT",
	right: "RIGHT"
}, Za = {
	none: "",
	alt: "%",
	ctrl: "^",
	shift: "+"
}, Qa = {
	title: "",
	stepModifier: "none",
	stepKey: "",
	stepDelayAfterMs: 1e3,
	steps: [],
	requireInput: !0,
	inputMode: "manual",
	manualValue: "",
	listText: ""
};
function $a(e) {
	let t = e.trim();
	if (!t) return "";
	if (t.startsWith("{") && t.endsWith("}")) return t;
	let n = Xa[t.toLowerCase()];
	return n ? `{${n}}` : /^f\d{1,2}$/i.test(t) ? `{${t.toUpperCase()}}` : t.length === 1 ? t : `{${t.toUpperCase()}}`;
}
function eo(e) {
	if (e.isRawSendKeys) return e.key;
	let t = $a(e.key);
	return `${Za[e.modifier]}${t}`;
}
function to(e) {
	return e.isRawSendKeys ? `Raw: ${e.key}` : `${Ya[e.modifier]} + ${e.key}`;
}
function no(e) {
	return {
		id: e.id,
		title: e.title,
		steps: [{
			modifier: "none",
			key: e.hotkey,
			delayAfterMs: e.delayMs,
			isRawSendKeys: !0
		}],
		requireInput: e.requireInput,
		inputMode: e.inputMode,
		manualValue: e.manualValue,
		listValues: e.listValues
	};
}
function ro(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let n of e) {
		let e = Ga.safeParse(n);
		if (e.success) {
			t.push(e.data);
			continue;
		}
		let r = Ka.safeParse(n);
		r.success && t.push(no(r.data));
	}
	return t;
}
function io(e) {
	if (typeof e == "string") return e.slice(0, 220);
	try {
		return JSON.stringify(e).slice(0, 220);
	} catch {
		return String(e).slice(0, 220);
	}
}
function ao(e) {
	let t = e, n = typeof e == "string" ? "json-string" : "object";
	for (let e = 0; e < 3 && typeof t == "string"; e += 1) {
		let e = t.trim();
		if (!e) break;
		try {
			t = JSON.parse(e), n = "json-string";
		} catch {
			break;
		}
	}
	return {
		value: t,
		source: n
	};
}
function oo(e) {
	let t = ao(e), n = t.value;
	if (Array.isArray(n)) return {
		extractedPath: "root",
		value: n,
		source: t.source
	};
	if (n && typeof n == "object") {
		let e = n;
		for (let t of [
			"data",
			"value",
			"payload",
			"tasks"
		]) {
			if (!(t in e)) continue;
			let n = ao(e[t]);
			if (Array.isArray(n.value)) return {
				extractedPath: `root.${t}`,
				value: n.value,
				source: n.source
			};
		}
	}
	return {
		extractedPath: "fallback-empty",
		value: [],
		source: t.source
	};
}
function so(e) {
	let t = io(e), n = oo(e);
	return {
		tasks: ro(n.value),
		extractedPath: n.extractedPath,
		source: n.source,
		preview: t
	};
}
function co(e) {
	return e.split(/\r?\n/).map((e) => e.trim()).filter((e) => e.length > 0);
}
function X(e) {
	return e.replace(/'/g, "''");
}
function lo(e, t, n) {
	let r = e.map((e) => {
		let t = e.steps.map((e) => [
			"@{",
			`  sendKeys='${X(eo(e))}'`,
			`  delayAfterMs=${Math.max(0, Math.floor(e.delayAfterMs || 0))}`,
			"}"
		].join("\n")).join(",\n"), n = e.listValues.map((e) => `'${X(e)}'`).join(", ");
		return [
			"@{",
			`  id='${X(e.id)}'`,
			`  title='${X(e.title)}'`,
			"  steps=@(",
			t,
			"  )",
			`  requireInput=$${e.requireInput ? "true" : "false"}`,
			`  inputMode='${e.inputMode}'`,
			`  manualValue='${X(e.manualValue)}'`,
			`  listValues=@(${n})`,
			"}"
		].join("\n");
	}).join(",\n");
	return [
		"# Davinvi generated script",
		"# Auto-run action sequence based on configured tasks",
		"",
		"$ErrorActionPreference = \"Stop\"",
		`$initialDelayMs = ${Math.max(0, t)}`,
		"$tasks = @(",
		r,
		")",
		"",
		"if ($tasks.Count -eq 0) {",
		"  Write-Error \"No tasks configured.\"",
		"  exit 1",
		"}",
		"",
		"Write-Host \"Starting in $($initialDelayMs / 1000) seconds...\"",
		"Write-Host \"Focus the target app/window now.\"",
		"Start-Sleep -Milliseconds $initialDelayMs",
		"",
		"$wshell = New-Object -ComObject WScript.Shell",
		"",
		n === 0 ? "while ($true) {" : `for ($r = 0; $r -lt ${Math.max(0, n)}; $r++) {`,
		"  foreach ($task in $tasks) {",
		"    if ($task.inputMode -eq \"list\") {",
		"      foreach ($item in $task.listValues) {",
		"        if ($task.requireInput) {",
		"          Set-Clipboard -Value $item",
		"          Start-Sleep -Milliseconds 200",
		"        }",
		"        foreach ($action in $task.steps) {",
		"          $wshell.SendKeys($action.sendKeys)",
		"          Start-Sleep -Milliseconds $action.delayAfterMs",
		"        }",
		"      }",
		"    } else {",
		"      if ($task.requireInput) {",
		"        Set-Clipboard -Value $task.manualValue",
		"        Start-Sleep -Milliseconds 200",
		"      }",
		"      foreach ($action in $task.steps) {",
		"        $wshell.SendKeys($action.sendKeys)",
		"        Start-Sleep -Milliseconds $action.delayAfterMs",
		"      }",
		"    }",
		"  }",
		"}",
		"",
		"Write-Host \"Done.\"",
		""
	].join("\n");
}
function uo(e) {
	return [
		"@echo off",
		"setlocal",
		"",
		"set \"SCRIPT_DIR=%~dp0\"",
		`powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%${e}" %*`,
		"",
		"endlocal",
		""
	].join("\n");
}
function fo(e) {
	let t = (512 - e.length % 512) % 512;
	if (t === 0) return e;
	let n = new Uint8Array(e.length + t);
	return n.set(e, 0), n;
}
function po(e) {
	return new TextEncoder().encode(e);
}
function mo(e, t, n = 420) {
	let r = new Uint8Array(512);
	function i(e, t, n) {
		let i = po(n);
		r.set(i.subarray(0, Math.min(i.length, t)), e);
	}
	i(0, 100, e), i(100, 8, (n | 0).toString(8).padStart(7, "0") + "\0"), i(108, 8, "0".padStart(7, "0") + "\0"), i(116, 12, t.toString(8).padStart(11, "0") + "\0"), i(148, 12, Math.floor(Date.now() / 1e3).toString(8).padStart(11, "0") + "\0"), r[156] = 48, i(257, 6, "ustar\0"), i(263, 2, "00");
	for (let e = 148; e < 156; e += 1) r[e] = 32;
	let a = 0;
	for (let e = 0; e < 512; e += 1) a += r[e];
	return i(148, 8, a.toString(8).padStart(6, "0") + "\0 "), r;
}
function ho(e) {
	let t = [];
	for (let n of e) {
		let e = po(n.content), r = mo(n.name, e.length);
		t.push(r), t.push(fo(e));
	}
	t.push(new Uint8Array(512)), t.push(new Uint8Array(512));
	let n = t.reduce((e, t) => e + t.length, 0), r = new Uint8Array(n), i = 0;
	for (let e of t) r.set(e, i), i += e.length;
	return new Blob([r], { type: "application/x-tar" });
}
function go({ context: a }) {
	let [o, s] = i([]), [c, l] = i(!1), [u, d] = i(5e3), [f, p] = i(1), [m, h] = i(Qa), ee = r(!0);
	t(() => {
		let e = !0;
		return (async () => {
			console.info("[task-board] restore start");
			try {
				let t = so(await a.storage.get(Ba));
				if (console.info("[task-board] restore payload", {
					preview: t.preview,
					extractedPath: t.extractedPath
				}), !e) return;
				s(t.tasks), console.info("[task-board] restore success", {
					count: t.tasks.length,
					source: t.source
				});
			} catch (t) {
				console.error("[task-board] restore failed", t), e && s([]);
			} finally {
				e && l(!0);
			}
		})(), () => {
			e = !1;
		};
	}, [a]), t(() => {
		if (c) {
			if (ee.current) {
				ee.current = !1;
				return;
			}
			(async () => {
				try {
					let e = qa.parse(o), t = {
						pluginId: Y,
						version: za,
						timestamp: Date.now(),
						type: "PERSIST",
						payload: e
					};
					console.info("[task-board] save triggered", { count: e.length }), await a.storage.save(Ba, t, za), a.eventBus.emit(Va, {
						pluginId: Y,
						count: e.length,
						updatedAt: Date.now()
					});
				} catch (e) {
					console.error("[task-board] save failed", e);
				}
			})();
		}
	}, [
		a,
		c,
		o
	]), t(() => {
		let e = (e) => {
			s(so(e).tasks);
		};
		return a.eventBus.on(Ha, e), () => {
			a.eventBus.off(Ha, e);
		};
	}, [a]);
	let te = n(() => {
		let e = $a(m.stepKey);
		return e ? `${Za[m.stepModifier]}${e}` : "";
	}, [m.stepKey, m.stepModifier]), g = () => {
		let e = m.stepKey.trim();
		if (!e) return;
		let t = {
			modifier: m.stepModifier,
			key: e,
			delayAfterMs: Math.max(0, Math.floor(m.stepDelayAfterMs || 0)),
			isRawSendKeys: !1
		}, n = Wa.safeParse(t);
		n.success && h((e) => ({
			...e,
			steps: [...e.steps, n.data],
			stepKey: ""
		}));
	}, _ = (e) => {
		h((t) => ({
			...t,
			steps: t.steps.filter((t, n) => n !== e)
		}));
	}, v = () => {
		if (!m.title.trim() || m.steps.length === 0) return;
		let e = m.inputMode === "list" ? co(m.listText) : [], t = {
			id: crypto.randomUUID(),
			title: m.title.trim(),
			steps: m.steps,
			requireInput: m.requireInput,
			inputMode: m.inputMode,
			manualValue: m.manualValue,
			listValues: e
		}, n = Ga.safeParse(t);
		n.success && (s((e) => [...e, n.data]), h((e) => ({
			...e,
			title: "",
			steps: [],
			manualValue: "",
			listText: ""
		})));
	}, ne = (e) => {
		s((t) => t.filter((t) => t.id !== e));
	}, re = () => {
		s([]);
	}, ie = () => {
		let e = qa.safeParse(o);
		if (!e.success || e.data.length === 0) return;
		let t = [];
		if (e.data.length === 1) {
			let n = e.data[0], r = n.title.replace(/[^a-zA-Z0-9_\-\. ]/g, "_") || "task", i = `${r}.ps1`, a = `${r}.bat`, o = lo([n], u, f), s = uo(i);
			t.push({
				name: i,
				content: o
			}), t.push({
				name: a,
				content: s
			});
			let c = ho(t), l = URL.createObjectURL(c), d = document.createElement("a");
			d.href = l, d.download = `${r}.tar`, d.click(), URL.revokeObjectURL(l);
			return;
		}
		for (let n of e.data) {
			let e = n.title.replace(/[^a-zA-Z0-9_\-\. ]/g, "_") || `task_${n.id.slice(0, 6)}`, r = `${e}.ps1`, i = `${e}.bat`, a = lo([n], u, f), o = uo(r);
			t.push({
				name: r,
				content: a
			}), t.push({
				name: i,
				content: o
			});
		}
		let n = ho(t), r = URL.createObjectURL(n), i = document.createElement("a");
		i.href = r, i.download = "davinvi_tasks.tar", i.click(), URL.revokeObjectURL(r);
	}, y = (e, t) => {
		h((n) => ({
			...n,
			[e]: t
		}));
	};
	return /* @__PURE__ */ e.createElement("section", {
		className: "plugin-shell",
		"aria-label": "Davinvi Task Builder"
	}, /* @__PURE__ */ e.createElement("div", { className: "plugin-grid" }, /* @__PURE__ */ e.createElement("article", { className: "plugin-card" }, /* @__PURE__ */ e.createElement("h1", { className: "plugin-heading" }, "Davinvi Script Builder"), /* @__PURE__ */ e.createElement("p", { className: "plugin-subtitle" }, "設定按鍵組合、每步間隔、是否貼上輸入值，完成後一鍵下載 PowerShell 和 BAT。"), /* @__PURE__ */ e.createElement("div", { className: "plugin-form" }, /* @__PURE__ */ e.createElement("div", { className: "plugin-row plugin-row-2" }, /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "任務名稱", /* @__PURE__ */ e.createElement("input", {
		className: "plugin-input",
		value: m.title,
		onChange: (e) => y("title", e.target.value),
		placeholder: "例如：登入後送出"
	})), /* @__PURE__ */ e.createElement("div", { style: {
		display: "grid",
		gap: 8
	} }, /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "啟動前延遲（ms）", /* @__PURE__ */ e.createElement("input", {
		className: "plugin-input",
		type: "number",
		min: 0,
		value: u,
		onChange: (e) => d(Number(e.target.value || 0))
	})), /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "重複次數（0 = 無限）", /* @__PURE__ */ e.createElement("input", {
		className: "plugin-input",
		type: "number",
		min: 0,
		value: f,
		onChange: (e) => p(Number(e.target.value || 0))
	})))), /* @__PURE__ */ e.createElement("div", { className: "plugin-step-builder" }, /* @__PURE__ */ e.createElement("div", { className: "plugin-row plugin-row-3" }, /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "修飾鍵（x）", /* @__PURE__ */ e.createElement("select", {
		className: "plugin-select",
		value: m.stepModifier,
		onChange: (e) => y("stepModifier", e.target.value)
	}, Ja.map((t) => /* @__PURE__ */ e.createElement("option", {
		value: t.value,
		key: t.value
	}, t.label)))), /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "按鍵（input）", /* @__PURE__ */ e.createElement("input", {
		className: "plugin-input",
		value: m.stepKey,
		onChange: (e) => y("stepKey", e.target.value),
		placeholder: "例如：a、Enter、Tab、F6"
	})), /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "該步驟後等待（ms）", /* @__PURE__ */ e.createElement("input", {
		className: "plugin-input",
		type: "number",
		min: 0,
		value: m.stepDelayAfterMs,
		onChange: (e) => y("stepDelayAfterMs", Number(e.target.value || 0))
	}))), /* @__PURE__ */ e.createElement("div", { className: "plugin-actions" }, /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: "plugin-btn plugin-btn-alt",
		onClick: g
	}, "新增步驟")), /* @__PURE__ */ e.createElement("p", { className: "plugin-muted" }, "SendKeys 預覽：", te || "(尚未輸入按鍵)"), m.steps.length === 0 ? /* @__PURE__ */ e.createElement("div", { className: "plugin-empty" }, "尚未加入任何步驟，請先設定 x + input 後按「新增步驟」。") : /* @__PURE__ */ e.createElement("div", { className: "plugin-step-list" }, m.steps.map((t, n) => /* @__PURE__ */ e.createElement("div", {
		className: "plugin-step-item",
		key: `${t.modifier}-${t.key}-${n}`
	}, /* @__PURE__ */ e.createElement("p", { className: "plugin-step-text" }, n + 1, ". ", to(t), " | wait=", t.delayAfterMs, "ms | sendKeys=", eo(t)), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: "plugin-btn plugin-btn-danger",
		onClick: () => _(n)
	}, "移除步驟"))))), /* @__PURE__ */ e.createElement("div", { className: "plugin-row plugin-row-2" }, /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "輸入來源", /* @__PURE__ */ e.createElement("select", {
		className: "plugin-select",
		value: m.inputMode,
		onChange: (e) => y("inputMode", e.target.value)
	}, /* @__PURE__ */ e.createElement("option", { value: "manual" }, "單筆輸入"), /* @__PURE__ */ e.createElement("option", { value: "list" }, "清單逐筆執行"))), /* @__PURE__ */ e.createElement("label", { className: "plugin-check" }, /* @__PURE__ */ e.createElement("input", {
		type: "checkbox",
		checked: m.requireInput,
		onChange: (e) => y("requireInput", e.target.checked)
	}), "此任務需要先把資料複製到剪貼簿")), m.inputMode === "manual" ? /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "輸入值", /* @__PURE__ */ e.createElement("textarea", {
		className: "plugin-textarea",
		value: m.manualValue,
		onChange: (e) => y("manualValue", e.target.value),
		placeholder: "例如：A-10021"
	})) : /* @__PURE__ */ e.createElement("label", { className: "plugin-label" }, "清單資料（每行一筆）", /* @__PURE__ */ e.createElement("textarea", {
		className: "plugin-textarea",
		value: m.listText,
		onChange: (e) => y("listText", e.target.value),
		placeholder: "001\n002\n003"
	})), /* @__PURE__ */ e.createElement("div", { className: "plugin-actions" }, /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: "plugin-btn plugin-btn-primary",
		onClick: v
	}, "新增任務"), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: "plugin-btn plugin-btn-alt",
		onClick: ie
	}, "下載 PS1 + BAT"), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: "plugin-btn plugin-btn-danger",
		onClick: re
	}, "清空任務")), /* @__PURE__ */ e.createElement("p", { className: "plugin-muted" }, "可透過 eventBus 送出 ", /* @__PURE__ */ e.createElement("strong", null, Ha), " 事件匯入任務，儲存時會 emit", /* @__PURE__ */ e.createElement("strong", null, " ", Va), "。"))), /* @__PURE__ */ e.createElement("article", { className: "plugin-card" }, /* @__PURE__ */ e.createElement("h2", { className: "plugin-heading" }, "已建立任務 (", o.length, ")"), o.length === 0 ? /* @__PURE__ */ e.createElement("div", { className: "plugin-empty" }, "目前沒有任務，先在左側新增一筆。") : /* @__PURE__ */ e.createElement("div", { className: "plugin-list" }, o.map((t) => /* @__PURE__ */ e.createElement("div", {
		className: "plugin-task",
		key: t.id
	}, /* @__PURE__ */ e.createElement("div", { className: "plugin-task-head" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h3", { className: "plugin-task-title" }, t.title), /* @__PURE__ */ e.createElement("p", { className: "plugin-task-meta" }, "steps=", t.steps.length, " (", t.steps.map((e, t) => `${t + 1}:${to(e)}@${e.delayAfterMs}ms`).join(" -> "), ") | inputMode=", t.inputMode, " | requireInput=", String(t.requireInput))), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: "plugin-btn plugin-btn-danger",
		onClick: () => ne(t.id)
	}, "刪除"))))))));
}
var Z = null, Q = null, $ = null;
function _o(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.id === Ua) return t;
	return null;
}
function vo(e) {
	let t = _o(e);
	if (t) return t.innerHTML = "", t;
	let n = document.createElement("div");
	return n.id = Ua, e.appendChild(n), n;
}
function yo() {
	$ || ($ = document.createElement("style"), $.setAttribute("data-plugin-style", Ua), $.textContent = La, document.head.appendChild($));
}
function bo() {
	$?.remove(), $ = null;
}
var xo = {
	id: Y,
	name: Ra,
	version: za,
	mount(t, n) {
		Q = vo(t), yo(), Z = a(Q), Z.render(/* @__PURE__ */ e.createElement(go, { context: n }));
	},
	unmount(e) {
		Z?.unmount(), Z = null;
		let t = _o(e);
		t && (t.innerHTML = ""), bo(), Q = null;
	}
};
//#endregion
export { xo as default };
