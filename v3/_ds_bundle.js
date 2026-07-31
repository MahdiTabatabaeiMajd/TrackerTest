/* @ds-bundle: {"format":4,"namespace":"FlareWatchDesignSystem_d30d0f","components":[{"name":"TrendChart","sourcePath":"components/charts/TrendChart.jsx"},{"name":"CHART_COLORS","sourcePath":"components/charts/TrendChart.jsx"},{"name":"TREATMENT_COLORS","sourcePath":"components/charts/TrendChart.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"SeverityKind","sourcePath":"components/core/Badge.jsx"},{"name":"SeverityLabel","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"SectionHeader","sourcePath":"components/core/SectionHeader.jsx"},{"name":"TabNav","sourcePath":"components/core/TabNav.jsx"},{"name":"Toast","sourcePath":"components/core/Toast.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"TextInput","sourcePath":"components/forms/Field.jsx"},{"name":"Select","sourcePath":"components/forms/Field.jsx"},{"name":"SliderRow","sourcePath":"components/forms/SliderRow.jsx"},{"name":"StepGroup","sourcePath":"components/forms/StepGroup.jsx"},{"name":"ToggleGroup","sourcePath":"components/forms/ToggleGroup.jsx"},{"name":"TriggerSlider","sourcePath":"components/forms/TriggerSlider.jsx"}],"sourceHashes":{"components/charts/TrendChart.jsx":"c44af139264c","components/core/Badge.jsx":"5e2049ef4dee","components/core/Button.jsx":"1a2a7b87b296","components/core/Chip.jsx":"12894d3f9d50","components/core/SectionHeader.jsx":"fb9bfe8f544e","components/core/TabNav.jsx":"a3e9bbf3a0b3","components/core/Toast.jsx":"756164f1ce5a","components/forms/Field.jsx":"4ec48dc7a329","components/forms/SliderRow.jsx":"c307107e7c1e","components/forms/StepGroup.jsx":"08a5e505e552","components/forms/ToggleGroup.jsx":"4ca29f0c4e65","components/forms/TriggerSlider.jsx":"1173f80a4729","ui_kits/flarewatch/HistoryTab.jsx":"da85e2b4b70b","ui_kits/flarewatch/InsightsTab.jsx":"e5dfb9ca6e84","ui_kits/flarewatch/LogTab.jsx":"e946b9619acf","ui_kits/flarewatch/SplashScreen.jsx":"3763de13171c","ui_kits/flarewatch/TreatmentsTab.jsx":"34cb42e45641","ui_kits/flarewatch/TrendsTab.jsx":"f57a7bc460e6","ui_kits/flarewatch/data.js":"5c5b3ce5cbf5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FlareWatchDesignSystem_d30d0f = window.FlareWatchDesignSystem_d30d0f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/charts/TrendChart.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

// Port of buildLineChart from js/v2/trends.js — same geometry, colors, and band treatment.
function TrendChart({
  scores,
  labels,
  maxVal = 10,
  color = "#e11d48",
  bands = [],
  title
}) {
  const W = 280,
    H = 120,
    padL = 24,
    padB = 24,
    padT = 14,
    padR = 6;
  const cW = W - padL - padR,
    cH = H - padT - padB,
    n = scores.length;
  const xOf = i => padL + (n === 1 ? cW / 2 : i / (n - 1) * cW);
  const yOf = v => padT + cH - v / maxVal * cH;
  const segments = [];
  let cur = null;
  scores.forEach((v, i) => {
    if (v !== null && v !== undefined) {
      if (!cur) {
        cur = [];
        segments.push(cur);
      }
      cur.push({
        i,
        v
      });
    } else cur = null;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1.5px solid var(--border-default)",
      borderRadius: 14,
      padding: "12px 14px",
      background: "var(--surface-flat)"
    }
  }, title && /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: "0.82rem",
      fontWeight: 600,
      color: "var(--text-body)",
      margin: "0 0 6px"
    }
  }, title), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    style: {
      display: "block",
      overflow: "visible"
    },
    preserveAspectRatio: "xMidYMid meet"
  }, bands.map((b, k) => {
    const x1 = xOf(b.startIdx),
      x2 = xOf(b.endIdx),
      bw = Math.max(x2 - x1, 4);
    return /*#__PURE__*/React.createElement("g", {
      key: k
    }, /*#__PURE__*/React.createElement("rect", {
      x: x1,
      y: padT,
      width: bw,
      height: cH,
      fill: b.color,
      fillOpacity: "0.13"
    }), /*#__PURE__*/React.createElement("rect", {
      x: x1,
      y: padT,
      width: bw,
      height: 3,
      fill: b.color
    }), /*#__PURE__*/React.createElement("line", {
      x1: x1,
      y1: padT,
      x2: x1,
      y2: padT + cH,
      stroke: b.color,
      strokeWidth: "1",
      strokeDasharray: "2,2",
      opacity: "0.7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: x2,
      y1: padT,
      x2: x2,
      y2: padT + cH,
      stroke: b.color,
      strokeWidth: "1",
      strokeDasharray: "2,2",
      opacity: "0.7"
    }));
  }), [0, Math.round(maxVal / 2), maxVal].map(v => /*#__PURE__*/React.createElement("g", {
    key: v
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: yOf(v),
    x2: W - padR,
    y2: yOf(v),
    stroke: "var(--chart-grid)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 3,
    y: yOf(v) + 3,
    textAnchor: "end",
    fontSize: "8",
    fill: "var(--text-ghost)"
  }, v))), segments.map((seg, k) => seg.length < 2 ? null : /*#__PURE__*/React.createElement("polyline", {
    key: k,
    points: seg.map(p => `${xOf(p.i)},${yOf(p.v)}`).join(" "),
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  })), scores.map((v, i) => v === null || v === undefined ? null : /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("circle", {
    cx: xOf(i),
    cy: yOf(v),
    r: "3",
    fill: "white",
    stroke: color,
    strokeWidth: "1.5"
  }), v > 0 && /*#__PURE__*/React.createElement("text", {
    x: xOf(i),
    y: yOf(v) - 5,
    textAnchor: "middle",
    fontSize: "7.5",
    fill: "var(--text-body)"
  }, v))), scores.map((_, i) => n > 8 && i % 2 !== 0 ? null : /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xOf(i),
    y: padT + cH + 14,
    textAnchor: "middle",
    fontSize: "7.5",
    fill: "var(--text-ghost)"
  }, labels?.[i] || "")), /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: padT,
    x2: padL,
    y2: padT + cH,
    stroke: "var(--chart-axis)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: padT + cH,
    x2: W - padR,
    y2: padT + cH,
    stroke: "var(--chart-axis)",
    strokeWidth: "1"
  })));
}
const CHART_COLORS = {
  itch: "#e11d48",
  pain: "#ea580c",
  redness: "#db2777",
  scaling: "#9333ea",
  stress: "#4f46e5",
  sleep: "#0d9488",
  pm25: "#64748b",
  humidity: "#0284c7"
};
const TREATMENT_COLORS = ["#2a78d6", "#1baf7a", "#eda100", "#008300", "#4a3aa7", "#e34948"];
Object.assign(__ds_scope, { TrendChart, CHART_COLORS, TREATMENT_COLORS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/TrendChart.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

const kinds = {
  clear: {
    background: "var(--severity-clear-bg)",
    color: "var(--severity-clear-fg)"
  },
  mild: {
    background: "var(--severity-mild-bg)",
    color: "var(--severity-mild-fg)"
  },
  moderate: {
    background: "var(--severity-moderate-bg)",
    color: "var(--severity-moderate-fg)"
  },
  severe: {
    background: "var(--severity-severe-bg)",
    color: "var(--severity-severe-fg)"
  },
  flare: {
    background: "var(--severity-severe-bg)",
    color: "var(--severity-severe-fg)",
    fontWeight: 600,
    fontSize: "0.76rem"
  },
  topical: {
    background: "var(--tint-blue-bg)",
    color: "var(--tint-blue-fg)",
    fontWeight: 700,
    fontSize: "0.68rem",
    textTransform: "uppercase",
    letterSpacing: "0.4px"
  },
  biologic: {
    background: "var(--tint-teal-bg)",
    color: "var(--tint-teal-fg)",
    fontWeight: 700,
    fontSize: "0.68rem",
    textTransform: "uppercase",
    letterSpacing: "0.4px"
  },
  type: {
    background: "var(--border-soft)",
    color: "var(--text-slate-mid)",
    fontWeight: 700,
    fontSize: "0.66rem",
    textTransform: "uppercase",
    letterSpacing: "0.4px"
  }
};
function Badge({
  kind = "clear",
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: "0.78rem",
      whiteSpace: "nowrap",
      ...kinds[kind]
    }
  }, children);
}
function SeverityKind(score) {
  if (score === 0) return "clear";
  if (score <= 3) return "mild";
  if (score <= 5) return "moderate";
  return "severe";
}
function SeverityLabel(score) {
  if (score === 0) return "Clear";
  if (score <= 3) return "Mild";
  if (score <= 5) return "Moderate";
  return "Severe";
}
Object.assign(__ds_scope, { Badge, SeverityKind, SeverityLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

const base = {
  fontFamily: "var(--font-ui)",
  cursor: "pointer",
  fontWeight: 600,
  transition: "opacity .15s,transform .1s,background .12s,color .12s,border-color .12s"
};
const variants = {
  primary: {
    ...base,
    fontSize: "0.92rem",
    borderRadius: 50,
    padding: "10px 26px",
    border: "none",
    background: "var(--grad-action)",
    color: "#fff",
    boxShadow: "var(--shadow-action)"
  },
  secondary: {
    ...base,
    fontSize: "0.92rem",
    borderRadius: 50,
    padding: "10px 26px",
    border: "none",
    background: "#e2e8f0",
    color: "var(--text-body)"
  },
  outline: {
    ...base,
    fontSize: "0.92rem",
    borderRadius: 50,
    padding: "10px 26px",
    background: "transparent",
    color: "var(--brand-blue)",
    border: "2px solid var(--brand-blue)"
  },
  fetch: {
    ...base,
    fontSize: "0.82rem",
    borderRadius: 50,
    padding: "6px 14px",
    background: "transparent",
    color: "var(--brand-blue)",
    border: "1.5px solid var(--brand-blue)"
  },
  add: {
    ...base,
    fontSize: "0.84rem",
    borderRadius: 12,
    padding: "9px 18px",
    background: "transparent",
    color: "var(--text-muted)",
    border: "2px dashed var(--border-input)",
    width: "100%"
  },
  "danger-outline": {
    ...base,
    fontSize: "0.78rem",
    borderRadius: 20,
    padding: "6px 14px",
    background: "#fff",
    color: "var(--danger)",
    border: "1.5px solid var(--danger-border)"
  },
  "success-outline": {
    ...base,
    fontSize: "0.78rem",
    borderRadius: 20,
    padding: "6px 14px",
    background: "#fff",
    color: "var(--success)",
    border: "1.5px solid var(--success-border)"
  },
  ghost: {
    ...base,
    fontSize: "0.72rem",
    borderRadius: 20,
    padding: "4px 12px",
    background: "transparent",
    color: "var(--text-faint)",
    border: "1px dashed var(--border-input)"
  },
  mini: {
    ...base,
    fontSize: "0.66rem",
    borderRadius: 20,
    padding: "2px 8px",
    background: "#fff",
    color: "var(--text-slate-mid)",
    border: "1px solid var(--border-input)"
  }
};
function Button({
  variant = "primary",
  disabled = false,
  fullWidth = false,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const v = variants[variant] || variants.primary;
  const lift = ["primary", "secondary", "outline"].includes(variant);
  const hoverStyle = hover && !disabled ? lift ? {
    opacity: .85,
    transform: press ? "translateY(0)" : "translateY(-1px)"
  } : variant === "fetch" ? {
    background: "var(--tint-hover)"
  } : variant === "add" ? {
    borderColor: "var(--brand-blue)",
    color: "var(--brand-blue)"
  } : variant === "danger-outline" ? {
    background: "var(--danger-bg)"
  } : variant === "success-outline" ? {
    background: "var(--success-bg)"
  } : variant === "mini" ? {
    borderColor: "var(--brand-blue)",
    color: "var(--brand-blue)"
  } : {
    opacity: .85
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...v,
      ...(fullWidth ? {
        width: "100%"
      } : {}),
      ...(disabled ? {
        opacity: .5,
        cursor: "default"
      } : {}),
      ...hoverStyle,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

const tones = {
  neutral: {
    background: "var(--surface-rail)",
    color: "var(--text-slate)"
  },
  good: {
    background: "var(--status-good-bg)",
    color: "var(--status-good-fg)"
  },
  moderate: {
    background: "var(--status-moderate-bg)",
    color: "var(--status-moderate-fg)"
  },
  poor: {
    background: "var(--status-poor-bg)",
    color: "var(--status-poor-fg)"
  }
};
function Chip({
  variant = "part",
  tone = "neutral",
  selected = false,
  onRemove,
  onClick,
  children
}) {
  if (variant === "env") return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      borderRadius: 20,
      padding: "5px 12px",
      fontSize: "0.78rem",
      fontWeight: 500,
      ...tones[tone]
    }
  }, children);
  if (variant === "area") return /*#__PURE__*/React.createElement("label", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      fontSize: "0.76rem",
      cursor: "pointer",
      borderRadius: 20,
      padding: "6px 11px",
      background: selected ? "var(--tint-blue-bg)" : "var(--surface-rail)",
      color: selected ? "var(--tint-blue-fg)" : "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    readOnly: true,
    checked: selected,
    style: {
      accentColor: "var(--brand-blue)",
      width: 13,
      height: 13,
      cursor: "pointer"
    }
  }), children);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      background: "var(--tint-chip-bg)",
      color: "var(--tint-chip-fg)",
      borderRadius: 20,
      padding: "4px 10px 4px 11px",
      fontSize: "0.74rem",
      fontWeight: 500
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--tint-chip-fg)",
      fontSize: "0.78rem",
      padding: 0,
      lineHeight: 1,
      display: "flex",
      alignItems: "center"
    },
    onMouseEnter: e => e.currentTarget.style.color = "var(--danger)",
    onMouseLeave: e => e.currentTarget.style.color = "var(--tint-chip-fg)"
  }, "\u2715"));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeader.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function SectionHeader({
  align = "left",
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.78rem",
      fontWeight: 700,
      color: "var(--brand-blue-deep)",
      textTransform: "uppercase",
      letterSpacing: "0.6px",
      margin: "0 0 12px",
      textAlign: align,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/TabNav.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function TabNav({
  tabs,
  active,
  onChange
}) {
  const refs = React.useRef({});
  const navRef = React.useRef(null);
  const [ind, setInd] = React.useState(null);
  const measure = React.useCallback(() => {
    const el = refs.current[active];
    if (el) setInd({
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    });
  }, [active]);
  React.useLayoutEffect(measure, [measure, tabs.join()]);
  React.useLayoutEffect(() => {
    const ro = new ResizeObserver(measure);
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [measure]);
  return /*#__PURE__*/React.createElement("nav", {
    ref: navRef,
    style: {
      display: "flex",
      gap: 5,
      background: "var(--surface-rail)",
      borderRadius: 14,
      padding: 5,
      position: "relative",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, ind && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 5,
      left: 0,
      transform: `translateX(${ind.left}px)`,
      width: ind.width,
      height: ind.height,
      borderRadius: 10,
      background: "#fff",
      boxShadow: "var(--shadow-indicator)",
      transition: "transform .3s cubic-bezier(0.4,0,0.2,1),width .3s cubic-bezier(0.4,0,0.2,1)",
      pointerEvents: "none"
    }
  }), tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    ref: el => refs.current[t] = el,
    onClick: () => onChange && onChange(t),
    style: {
      position: "relative",
      zIndex: 1,
      flex: 1,
      padding: "var(--tab-pad)",
      border: "none",
      borderRadius: 10,
      background: "transparent",
      color: t === active ? "var(--brand-blue-deep)" : "var(--text-muted)",
      fontSize: "var(--tab-font)",
      fontWeight: 600,
      whiteSpace: "nowrap",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "color .2s"
    },
    onMouseEnter: e => {
      if (t !== active) e.currentTarget.style.color = "var(--text-body)";
    },
    onMouseLeave: e => {
      if (t !== active) e.currentTarget.style.color = "var(--text-muted)";
    }
  }, t)));
}
Object.assign(__ds_scope, { TabNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TabNav.jsx", error: String((e && e.message) || e) }); }

// components/core/Toast.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function Toast({
  visible = true,
  children
}) {
  if (!visible) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      background: "var(--brand-blue)",
      color: "#fff",
      padding: "10px 22px",
      borderRadius: 50,
      fontSize: "0.88rem",
      fontWeight: 600,
      boxShadow: "var(--shadow-toast)",
      zIndex: 999,
      fontFamily: "var(--font-ui)"
    }
  }, children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function Field({
  label,
  note,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      flex: 1,
      minWidth: 130
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.74rem",
      fontWeight: 600,
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.4px"
    }
  }, label), children, note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.72rem",
      color: "var(--text-faint)",
      marginTop: 2
    }
  }, note));
}
const inputStyle = {
  padding: "7px 10px",
  border: "1.5px solid var(--border-input)",
  borderRadius: 9,
  background: "#fff",
  color: "var(--text-strong)",
  fontSize: "0.84rem",
  fontFamily: "inherit",
  outline: "none"
};
function TextInput(props) {
  return /*#__PURE__*/React.createElement("input", _extends({}, props, {
    style: {
      ...inputStyle,
      ...props.style
    },
    onFocus: e => e.target.style.borderColor = "var(--brand-blue)",
    onBlur: e => e.target.style.borderColor = "var(--border-input)"
  }));
}
function Select({
  options = [],
  ...props
}) {
  return /*#__PURE__*/React.createElement("select", _extends({}, props, {
    style: {
      ...inputStyle,
      ...props.style
    },
    onFocus: e => e.target.style.borderColor = "var(--brand-blue)",
    onBlur: e => e.target.style.borderColor = "var(--border-input)"
  }), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o)));
}
Object.assign(__ds_scope, { Field, TextInput, Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/SliderRow.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function SliderRow({
  label,
  value,
  onChange,
  max = 10,
  severity
}) {
  const fg = {
    clear: "var(--success)",
    mild: "#eab308",
    moderate: "#ea580c",
    severe: "var(--danger)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: severity ? "60px 1fr 70px" : "60px 1fr 24px",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontWeight: 600,
      fontSize: "0.86rem",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: 0,
    max: max,
    value: value,
    onChange: e => onChange && onChange(+e.target.value),
    style: {
      width: "100%",
      accentColor: "var(--brand-blue)",
      cursor: "pointer"
    }
  }), severity ? /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: "0.95rem",
      color: "var(--brand-blue-deep)"
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: "0.7rem",
      color: fg[__ds_scope.SeverityKind(value)],
      marginLeft: 5
    }
  }, __ds_scope.SeverityLabel(value))) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: "0.95rem",
      color: "var(--brand-blue-deep)",
      textAlign: "right"
    }
  }, value));
}
Object.assign(__ds_scope, { SliderRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SliderRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/StepGroup.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function StepGroup({
  options,
  value,
  onChange,
  tips,
  ramp
}) {
  const [tip, setTip] = React.useState(-1);
  const RAMPS = {
    risk: ["var(--ramp-neutral)", "var(--ramp-risk-1)", "var(--ramp-risk-2)", "var(--ramp-risk-3)"],
    good: ["var(--ramp-good-0)", "var(--ramp-good-1)", "var(--ramp-good-2)", "var(--ramp-good-3)"]
  };
  const sel = i => ramp && RAMPS[ramp] ? RAMPS[ramp][Math.min(i, RAMPS[ramp].length - 1)] : "var(--brand-teal)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      position: "relative"
    }
  }, options.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: o,
    onClick: () => onChange && onChange(i),
    onMouseEnter: () => tips && setTip(i),
    onMouseLeave: () => setTip(-1),
    style: {
      flex: 1,
      padding: "10px 0",
      border: "1.5px solid",
      borderColor: i === value ? sel(i) : "var(--border-input)",
      borderRadius: 8,
      background: i === value ? sel(i) : "var(--surface-input)",
      color: i === value ? "#fff" : "var(--text-muted)",
      fontSize: "0.74rem",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "background .12s",
      position: "relative"
    }
  }, o, tips && tip === i && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: "calc(100% + 7px)",
      ...(i === 0 ? {
        left: 0
      } : i === options.length - 1 ? {
        right: 0
      } : {
        left: "50%",
        transform: "translateX(-50%)"
      }),
      zIndex: 30,
      width: 200,
      padding: "8px 10px",
      borderRadius: 9,
      background: "var(--splash-bg)",
      color: "#fff",
      fontSize: "0.72rem",
      fontWeight: 500,
      lineHeight: 1.5,
      textAlign: "left",
      boxShadow: "0 6px 18px rgba(19,42,49,.35)",
      pointerEvents: "none",
      whiteSpace: "normal"
    }
  }, Array.isArray(tips[i]) ? tips[i].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: "block"
    }
  }, t)) : tips[i], /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "100%",
      ...(i === 0 ? {
        left: 18
      } : i === options.length - 1 ? {
        right: 18
      } : {
        left: "50%",
        transform: "translateX(-50%)"
      }),
      border: "5px solid transparent",
      borderTopColor: "var(--splash-bg)"
    }
  })))));
}
Object.assign(__ds_scope, { StepGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/StepGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/ToggleGroup.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function ToggleGroup({
  value = 0,
  onChange,
  labels = ["No", "Yes"]
}) {
  const styles = [value === 0 ? {
    background: "var(--surface-rail)",
    color: "var(--text-slate)",
    borderColor: "var(--text-faint)"
  } : {
    background: "var(--surface-input)",
    color: "var(--text-muted)",
    borderColor: "var(--border-input)"
  }, value === 1 ? {
    background: "var(--status-moderate-bg)",
    color: "var(--status-moderate-fg)",
    borderColor: "var(--warn-amber)"
  } : {
    background: "var(--surface-input)",
    color: "var(--text-muted)",
    borderColor: "var(--border-input)"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => onChange && onChange(i),
    style: {
      flex: 1,
      padding: "10px 0",
      border: "1.5px solid",
      borderRadius: 8,
      fontSize: "0.82rem",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "background .12s",
      ...styles[i]
    }
  }, l)));
}
Object.assign(__ds_scope, { ToggleGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ToggleGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/TriggerSlider.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences

function TriggerSlider({
  label,
  value,
  display,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  scale = ["None", "Moderate", "Extreme"]
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: "var(--brand-blue-deep)"
    }
  }, display ?? value)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange && onChange(+e.target.value),
    style: {
      width: "100%",
      accentColor: "var(--brand-teal)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.68rem",
      color: "var(--text-ghost)",
      padding: "0 2px"
    }
  }, scale.map(s => /*#__PURE__*/React.createElement("span", {
    key: s
  }, s))));
}
Object.assign(__ds_scope, { TriggerSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TriggerSlider.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flarewatch/HistoryTab.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {
  Button,
  Badge,
  SeverityKind,
  SeverityLabel
} = window.FlareWatchDesignSystem_d30d0f;
function HistoryTab() {
  const [entries, setEntries] = React.useState(window.FW.entries);
  const [archived, setArchived] = React.useState(0);
  const del = i => setEntries(entries.filter((_, j) => j !== i));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginBottom: 16
    }
  }, entries.length > 0 && /*#__PURE__*/React.createElement(Button, {
    variant: "danger-outline",
    onClick: () => {
      setArchived(archived + entries.length);
      setEntries([]);
    }
  }, "Archive all entries"), archived > 0 && /*#__PURE__*/React.createElement(Button, {
    variant: "success-outline",
    onClick: () => {
      setEntries(window.FW.entries);
      setArchived(0);
    }
  }, "\u21A9 Restore ", archived, " archived entries")), entries.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: "0.92rem",
      color: "var(--text-muted)",
      marginBottom: 4
    }
  }, archived > 0 ? "No active entries" : "No entries yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.82rem",
      color: "var(--text-ghost)"
    }
  }, archived > 0 ? `${archived} entries are archived — restore them above.` : "Open the Log tab to record your first day.")), entries.slice().reverse().map((e, ri) => {
    const i = entries.length - 1 - ri;
    const l = e.lifestyle,
      ev = e.environment;
    return /*#__PURE__*/React.createElement("div", {
      key: e.date,
      style: {
        border: "1px solid var(--border-soft)",
        borderRadius: 16,
        padding: "14px 18px",
        marginBottom: 12,
        background: "var(--surface-flat)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: "0.92rem",
        color: "var(--text-strong)",
        flex: 1
      }
    }, e.date), e.isFlareDay && /*#__PURE__*/React.createElement(Badge, {
      kind: "flare"
    }, "Flare day"), /*#__PURE__*/React.createElement("button", {
      onClick: () => del(i),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--border-input)",
        fontSize: "0.95rem",
        padding: "2px 4px",
        borderRadius: 6
      },
      onMouseEnter: ev2 => {
        ev2.currentTarget.style.color = "var(--danger-soft)";
        ev2.currentTarget.style.background = "#fff1f1";
      },
      onMouseLeave: ev2 => {
        ev2.currentTarget.style.color = "var(--border-input)";
        ev2.currentTarget.style.background = "";
      }
    }, "\u2715")), e.symptoms.map((s, si) => /*#__PURE__*/React.createElement("div", {
      key: s.name,
      style: {
        display: "grid",
        gridTemplateColumns: "70px 46px 1fr auto",
        alignItems: "start",
        gap: 9,
        padding: "5px 0",
        borderBottom: si < 3 ? "1px solid var(--border-default)" : "none",
        fontSize: "0.83rem"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: "var(--text-body)"
      }
    }, s.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)"
      }
    }, s.score, "/10"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-strong)",
        lineHeight: 1.6
      }
    }, s.parts.join(", ") || "—"), /*#__PURE__*/React.createElement(Badge, {
      kind: SeverityKind(s.score)
    }, SeverityLabel(s.score)))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "0.74rem",
        color: "var(--text-muted)",
        marginTop: 8,
        lineHeight: 1.7,
        paddingTop: 8,
        borderTop: "1px solid var(--border-hair)",
        whiteSpace: "pre-line"
      }
    }, "🌤 " + ev.weatherDesc + " · " + ev.temperature + "°C · " + ev.humidity + "% RH · PM2.5 " + ev.pm25 + " · PM10 " + ev.pm10 + " · NO₂ " + ev.no2 + " · " + ev.season + "\nStress " + l.stress + "/10 · Sleep " + l.sleepHours + " h · Alcohol: " + window.FW.ALCOHOL_LABELS[l.alcohol] + " · Exercise: " + window.FW.EXERCISE_LABELS[l.exercise] + (l.smoking ? " · Smoking" : "") + (l.infection ? " · Infection" : "") + (l.koebner ? " · Skin trauma" : "")));
  }));
}
window.HistoryTab = HistoryTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flarewatch/HistoryTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flarewatch/InsightsTab.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const FWi = window.FW;
function InsightsTab() {
  const entries = FWi.entries;
  if (entries.length < 3) return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "60px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: "0.92rem",
      color: "var(--text-muted)",
      marginBottom: 4
    }
  }, "Not enough data for insights"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.82rem",
      color: "var(--text-ghost)"
    }
  }, "Correlations need at least 3 logged days \u2014 or press \"Load 30-day demo\" to preview."));
  const triggers = [{
    label: "Stress",
    get: e => e.lifestyle.stress
  }, {
    label: "Sleep (h)",
    get: e => e.lifestyle.sleepHours
  }, {
    label: "Alcohol",
    get: e => e.lifestyle.alcohol
  }, {
    label: "Exercise",
    get: e => e.lifestyle.exercise
  }, {
    label: "Smoking",
    get: e => e.lifestyle.smoking ? 1 : 0,
    binary: true
  }, {
    label: "Infection",
    get: e => e.lifestyle.infection ? 1 : 0,
    binary: true
  }, {
    label: "Skin trauma",
    get: e => e.lifestyle.koebner ? 1 : 0,
    binary: true
  }, {
    label: "Temperature",
    get: e => e.environment.temperature
  }, {
    label: "Humidity",
    get: e => e.environment.humidity
  }, {
    label: "PM2.5",
    get: e => e.environment.pm25
  }, {
    label: "PM10",
    get: e => e.environment.pm10
  }, {
    label: "NO₂",
    get: e => e.environment.no2
  }];
  const symptoms = ["Itch", "Pain", "Redness", "Scaling", "Flare"];
  const score = (e, n) => n === "Flare" ? e.isFlareDay ? 1 : 0 : e.symptoms.find(s => s.name === n)?.score ?? null;
  const cells = [];
  triggers.forEach(t => symptoms.forEach(sym => {
    const pairs = entries.map(e => ({
      x: t.get(e),
      y: score(e, sym)
    })).filter(p => p.x != null && p.y != null);
    const r = pairs.length >= 3 ? FWi.pearsonR(pairs.map(p => p.x), pairs.map(p => p.y)) : null;
    cells.push({
      trig: t,
      sym,
      r,
      n: pairs.length
    });
  }));
  const corrStyles = {
    sp: {
      background: "#fee2e2",
      color: "#991b1b"
    },
    mp: {
      background: "#fef3c7",
      color: "#92400e"
    },
    w: {
      background: "#f1f5f9",
      color: "#64748b"
    },
    mn: {
      background: "#dcfce7",
      color: "#166534"
    },
    sn: {
      background: "#bbf7d0",
      color: "#14532d"
    },
    nil: {
      background: "#f8fafc",
      color: "#cbd5e0"
    }
  };
  const findings = cells.filter(c => c.r !== null && Math.abs(c.r) >= 0.3).sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
  const per = {},
    chosen = [];
  for (const f of findings) {
    if ((per[f.trig.label] || 0) >= 2) continue;
    per[f.trig.label] = (per[f.trig.label] || 0) + 1;
    chosen.push(f);
    if (chosen.length >= 5) break;
  }
  const flareDays = entries.filter(e => e.isFlareDay),
    calmDays = entries.filter(e => !e.isFlareDay);
  const avg = (days, get) => {
    const v = days.map(get).filter(x => x != null);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  const flareR = {};
  cells.forEach(c => {
    if (c.sym === "Flare") flareR[c.trig.label] = c.r;
  });
  const fcRows = triggers.map(t => {
    const f = avg(flareDays, t.get),
      c = avg(calmDays, t.get);
    if (f == null || c == null) return null;
    const all = entries.map(t.get).filter(x => x != null);
    const dataMax = all.length ? Math.max(...all, 0.0001) : 1;
    return {
      trig: t,
      f,
      c,
      dataMax,
      rank: Math.abs(flareR[t.label] || 0)
    };
  }).filter(Boolean).filter(r => Math.abs(r.f - r.c) > 0.001).sort((a, b) => b.rank - a.rank).slice(0, 6);
  const secTitle = (t, sub) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: "0.9rem",
      fontWeight: 700,
      color: "var(--text-strong)",
      margin: "0 0 3px"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.76rem",
      color: "var(--text-faint)",
      lineHeight: 1.5,
      margin: "0 0 12px"
    }
  }, sub));
  const meter = r => {
    const w = Math.max(Math.min(Math.abs(r), 1) * 120, 2);
    return /*#__PURE__*/React.createElement("svg", {
      width: "120",
      height: "8",
      style: {
        flexShrink: 0,
        display: "block"
      }
    }, /*#__PURE__*/React.createElement("rect", {
      width: "120",
      height: "8",
      rx: "4",
      fill: "#eef2f6"
    }), /*#__PURE__*/React.createElement("rect", {
      width: w,
      height: "8",
      rx: "4",
      fill: r >= 0 ? "#ef4444" : "#10b981"
    }));
  };
  const hbar = (v, max, color) => {
    const w = v > 0 ? Math.max(v / max * 150, 3) : 0;
    return /*#__PURE__*/React.createElement("svg", {
      width: "150",
      height: "12",
      style: {
        flexShrink: 0,
        display: "block"
      }
    }, /*#__PURE__*/React.createElement("rect", {
      width: "150",
      height: "12",
      rx: "6",
      fill: "#eef2f6"
    }), /*#__PURE__*/React.createElement("rect", {
      width: w,
      height: "12",
      rx: "6",
      fill: color
    }));
  };
  const fmt = (t, v) => t.binary ? Math.round(v * 100) + "% of days" : String(Math.round(v * 10) / 10);
  const dLabel = n => n + " day" + (n === 1 ? "" : "s");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--warn-bg)",
      border: "1.5px solid var(--warn-border)",
      borderRadius: 12,
      padding: "10px 16px",
      fontSize: "0.78rem",
      color: "var(--status-moderate-fg)",
      marginBottom: 18,
      lineHeight: 1.6
    }
  }, "\u26A0\uFE0F These are statistical patterns in ", /*#__PURE__*/React.createElement("em", null, "your own data"), ", not clinical findings. Correlation does not prove causation. Discuss any concerns with your dermatologist."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 26
    }
  }, secTitle("What your data suggests", "Your strongest day-to-day patterns, in plain language."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, chosen.map((f, i) => {
    const pos = f.r > 0;
    const strong = Math.abs(f.r) >= 0.5;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        border: "1.5px solid var(--border-default)",
        borderRadius: 14,
        padding: "14px 16px",
        background: "#fff"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "0.86rem",
        color: "var(--text-strong)",
        lineHeight: 1.5,
        margin: "0 0 10px"
      }
    }, f.sym === "Flare" ? /*#__PURE__*/React.createElement("span", null, "On days with more ", /*#__PURE__*/React.createElement("b", null, f.trig.label), ", you tend ", pos ? "" : "not ", "to have a ", /*#__PURE__*/React.createElement("b", null, "flare"), ".") : /*#__PURE__*/React.createElement("span", null, "On days with more ", /*#__PURE__*/React.createElement("b", null, f.trig.label), ", your ", /*#__PURE__*/React.createElement("b", null, f.sym.toLowerCase()), " tends to be ", pos ? "higher" : "lower", ".")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8
      }
    }, meter(f.r), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        color: pos ? "#dc2626" : "#059669"
      }
    }, strong ? "strong link" : "moderate link")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "0.72rem",
        color: "var(--text-ghost)",
        margin: 0
      }
    }, "Seen across ", f.n, " logged days"));
  }))), fcRows.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 26
    }
  }, secTitle("Flare days vs calm days", `Your average trigger levels on the ${dLabel(flareDays.length)} you flared, compared with the ${dLabel(calmDays.length)} you didn’t.`), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.72rem",
      fontWeight: 600,
      padding: "3px 12px",
      borderRadius: 20,
      background: "#fee2e2",
      color: "#991b1b"
    }
  }, "Flare days"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.72rem",
      fontWeight: 600,
      padding: "3px 12px",
      borderRadius: 20,
      background: "#dcfce7",
      color: "#166534"
    }
  }, "Calm days")), fcRows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      border: "1.5px solid var(--border-default)",
      borderRadius: 14,
      background: "var(--surface-flat)",
      padding: "12px 16px",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.84rem",
      fontWeight: 700,
      color: "var(--text-body)"
    }
  }, r.trig.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.68rem",
      fontWeight: 600,
      padding: "2px 10px",
      borderRadius: 20,
      background: r.f > r.c ? "#fef2f2" : "#f0fdf4",
      color: r.f > r.c ? "#dc2626" : "#059669"
    }
  }, r.f > r.c ? "higher on flare days" : "higher on calm days")), [["Flare", r.f, "#ef4444"], ["Calm", r.c, "#10b981"]].map(([k, v, col]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.74rem",
      color: "var(--text-muted)",
      width: 38,
      flexShrink: 0
    }
  }, k), hbar(v, r.dataMax, col), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.78rem",
      fontWeight: 600,
      color: "var(--text-body)"
    }
  }, fmt(r.trig, v))))))), /*#__PURE__*/React.createElement("div", null, secTitle("Full correlation matrix", "Every trigger against every symptom. Each number is a correlation from −1 to +1 — the further from 0, the stronger the link; red = symptom rises with the trigger, green = symptom falls."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 14,
      fontSize: "0.74rem"
    }
  }, [["Strong +", "sp"], ["Moderate +", "mp"], ["Weak / none", "w"], ["Moderate −", "mn"], ["Strong −", "sn"]].map(([l, c]) => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      padding: "3px 10px",
      borderRadius: 20,
      fontWeight: 600,
      ...corrStyles[c]
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.8rem"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["Trigger", ...symptoms].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: "8px 10px",
      fontSize: "0.72rem",
      fontWeight: 700,
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
      background: "var(--surface-panel)",
      borderBottom: "2px solid var(--border-default)",
      whiteSpace: "nowrap"
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, triggers.map(t => /*#__PURE__*/React.createElement("tr", {
    key: t.label
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 10px",
      borderBottom: "1px solid var(--border-hair)",
      fontWeight: 500,
      color: "var(--text-body)",
      whiteSpace: "nowrap"
    }
  }, t.label), symptoms.map(sym => {
    const c = cells.find(x => x.trig === t && x.sym === sym);
    const cls = FWi.corrClass(c.r);
    return /*#__PURE__*/React.createElement("td", {
      key: sym,
      style: {
        padding: "8px 10px",
        borderBottom: "1px solid var(--border-hair)",
        fontWeight: 600,
        textAlign: "center",
        whiteSpace: "nowrap",
        ...corrStyles[cls]
      }
    }, c.r !== null ? c.r.toFixed(2) : "—");
  }))))))));
}
window.InsightsTab = InsightsTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flarewatch/InsightsTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flarewatch/LogTab.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {
  Button,
  Chip,
  Badge,
  SectionHeader,
  SliderRow,
  TriggerSlider,
  StepGroup,
  ToggleGroup,
  SeverityKind,
  SeverityLabel
} = window.FlareWatchDesignSystem_d30d0f;
const FW = window.FW;
const panel = bg => ({
  padding: "16px 20px",
  border: "1px solid var(--border-soft)",
  borderRadius: 18,
  background: bg,
  marginBottom: 16
});
const FieldMark = ({
  req
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: "inline-block",
    verticalAlign: "middle",
    marginLeft: 8,
    padding: "1px 8px",
    borderRadius: 10,
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    background: req ? "var(--tint-blue-bg)" : "var(--surface-rail)",
    color: req ? "var(--tint-blue-fg)" : "var(--text-faint)"
  }
}, req ? "Required" : "Optional");
function SymptomCard({
  name,
  value,
  onChange,
  parts,
  setParts
}) {
  const [open, setOpen] = React.useState(false);
  const toggle = p => setParts(parts.includes(p) ? parts.filter(x => x !== p) : [...parts, p]);
  const pill = on => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 11px",
    borderRadius: 20,
    fontSize: "0.72rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    border: "1px solid",
    borderColor: on ? "var(--brand-teal)" : "var(--border-default)",
    background: on ? "var(--tint-teal-bg)" : "var(--surface-rail)",
    color: on ? "var(--tint-teal-fg)" : "var(--text-slate)",
    transition: "background 0.12s"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "1px solid var(--border-soft)",
      borderRadius: 14,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(SliderRow, {
    label: name,
    value: value,
    onChange: onChange,
    severity: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 5,
      alignItems: "center"
    }
  }, !open && parts.map(p => /*#__PURE__*/React.createElement(Chip, {
    key: p,
    variant: "part",
    onRemove: () => toggle(p)
  }, p)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "6px 12px",
      borderRadius: 20,
      fontSize: "0.72rem",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      border: open ? "1px solid var(--brand-teal)" : "1px dashed var(--border-input)",
      background: open ? "var(--tint-teal-bg)" : "transparent",
      color: open ? "var(--tint-teal-fg)" : "var(--text-muted)"
    }
  }, open ? "Done" : parts.length ? "Edit body parts" : "+ Add body parts")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-hair)",
      paddingTop: 8,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, FW.bodyPartGroups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.64rem",
      fontWeight: 700,
      color: "var(--text-ghost)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: 3
    }
  }, g.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4
    }
  }, g.parts.map(p => {
    const on = parts.includes(p);
    return /*#__PURE__*/React.createElement("button", {
      key: p,
      onClick: () => toggle(p),
      style: pill(on)
    }, on ? "✓ " : "", p);
  }))))));
}
function LogTab({
  onSaved
}) {
  const names = ["Itch", "Pain", "Redness", "Scaling"];
  const [scores, setScores] = React.useState([0, 0, 0, 0]);
  const [parts, setPartsAll] = React.useState([[], [], [], []]);
  const [stress, setStress] = React.useState(0);
  const [sleep, setSleep] = React.useState(7);
  const [alcohol, setAlcohol] = React.useState(0);
  const [exercise, setExercise] = React.useState(0);
  const [smoking, setSmoking] = React.useState(0);
  const [infection, setInfection] = React.useState(0);
  const [koebner, setKoebner] = React.useState(0);
  const [env, setEnv] = React.useState(null);
  const [fetching, setFetching] = React.useState(false);
  const [reviewed, setReviewed] = React.useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = React.useState(today);
  const flare = Math.max(...scores) >= 7;
  const fetchEnv = () => {
    setFetching(true);
    setTimeout(() => {
      setEnv({
        weatherDesc: "Partly cloudy",
        temperature: 24,
        humidity: 58,
        pm25: 12.4,
        pm10: 28,
        no2: 18,
        season: "Summer"
      });
      setFetching(false);
    }, 900);
  };
  const aq = (v, g, m) => v <= g ? "good" : v <= m ? "moderate" : "poor";
  const save = () => {
    onSaved();
    setReviewed(false);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: date,
    onChange: e => setDate(e.target.value),
    style: {
      fontSize: "0.92rem",
      padding: "8px 14px",
      borderRadius: 10,
      border: "1.5px solid var(--border-input)",
      background: "var(--surface-input)",
      color: "var(--text-strong)",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: panel("var(--surface-tint-primary)")
  }, /*#__PURE__*/React.createElement(SectionHeader, null, "Symptom Severity", /*#__PURE__*/React.createElement(FieldMark, {
    req: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, names.map((n, i) => /*#__PURE__*/React.createElement(SymptomCard, {
    key: n,
    name: n,
    value: scores[i],
    onChange: v => setScores(scores.map((s, j) => j === i ? v : s)),
    parts: parts[i],
    setParts: p => setPartsAll(parts.map((x, j) => j === i ? p : x))
  })))), /*#__PURE__*/React.createElement("div", {
    style: panel("var(--surface-tint-sky)")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    style: {
      margin: 0
    }
  }, "Environment", /*#__PURE__*/React.createElement(FieldMark, null)), /*#__PURE__*/React.createElement(Button, {
    variant: "fetch",
    disabled: fetching,
    onClick: fetchEnv
  }, fetching ? "Fetching…" : "📍 Fetch weather & air quality")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.72rem",
      color: "var(--text-faint)",
      margin: "0 0 10px",
      lineHeight: 1.5
    }
  }, "Your location is rounded to ~10 km before being sent to Open-Meteo (open-source API). Only the fetched measurements are saved \u2014 your coordinates are never stored."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center"
    }
  }, env ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Chip, {
    variant: "env"
  }, env.weatherDesc), /*#__PURE__*/React.createElement(Chip, {
    variant: "env"
  }, "\uD83C\uDF21\uFE0F ", env.temperature, "\xB0C"), /*#__PURE__*/React.createElement(Chip, {
    variant: "env"
  }, "\uD83D\uDCA7 ", env.humidity, "% RH"), /*#__PURE__*/React.createElement(Chip, {
    variant: "env",
    tone: aq(env.pm25, 15, 35)
  }, "PM2.5 ", env.pm25), /*#__PURE__*/React.createElement(Chip, {
    variant: "env",
    tone: aq(env.pm10, 45, 75)
  }, "PM10 ", env.pm10), /*#__PURE__*/React.createElement(Chip, {
    variant: "env",
    tone: aq(env.no2, 25, 50)
  }, "NO\u2082 ", env.no2), /*#__PURE__*/React.createElement(Chip, {
    variant: "env"
  }, env.season)) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.82rem",
      color: "var(--text-faint)",
      fontStyle: "italic"
    }
  }, "Click Fetch to load today's conditions"))), /*#__PURE__*/React.createElement("div", {
    style: panel("var(--surface-tint-teal)")
  }, /*#__PURE__*/React.createElement(SectionHeader, null, "Lifestyle & Context", /*#__PURE__*/React.createElement(FieldMark, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(TriggerSlider, {
    label: "Stress level",
    value: stress,
    display: stress + " / 10",
    onChange: setStress
  }), /*#__PURE__*/React.createElement(TriggerSlider, {
    label: "Sleep last night",
    value: sleep,
    display: sleep + " h",
    min: 2,
    max: 12,
    step: 0.5,
    scale: ["2 h", "7 h", "12 h"],
    onChange: setSleep
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "var(--text-body)",
      marginBottom: 6
    }
  }, "Alcohol"), /*#__PURE__*/React.createElement(StepGroup, {
    options: FW.ALCOHOL_LABELS,
    value: alcohol,
    onChange: setAlcohol,
    tips: FW.ALCOHOL_TIPS,
    ramp: "risk"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "var(--text-body)",
      marginBottom: 6
    }
  }, "Smoking"), /*#__PURE__*/React.createElement(StepGroup, {
    options: FW.SMOKING_LABELS,
    value: smoking,
    onChange: setSmoking,
    tips: FW.SMOKING_TIPS,
    ramp: "risk"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "var(--text-body)",
      marginBottom: 6
    }
  }, "Exercise"), /*#__PURE__*/React.createElement(StepGroup, {
    options: FW.EXERCISE_LABELS,
    value: exercise,
    onChange: setExercise,
    ramp: "good"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-default)",
      borderRadius: 12,
      background: "#fff",
      overflow: "hidden"
    }
  }, [["Infection", infection, setInfection], ["Skin trauma", koebner, setKoebner]].map(([l, v, f], i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "9px 14px",
      borderTop: i ? "1px solid var(--border-hair)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "var(--text-body)"
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 132
    }
  }, /*#__PURE__*/React.createElement(ToggleGroup, {
    value: v,
    onChange: f
  }))))))), reviewed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-tint-primary)",
      border: "1px solid var(--border-soft)",
      borderRadius: 16,
      padding: "16px 22px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "0.8rem",
      fontWeight: 700,
      color: "var(--brand-blue-deep)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: "0 0 12px"
    }
  }, "Summary \u2014 ", date), names.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "grid",
      gridTemplateColumns: "72px 48px 1fr auto",
      alignItems: "start",
      gap: 9,
      padding: "8px 0",
      borderBottom: i < 3 ? "1px solid var(--border-default)" : "none",
      fontSize: "0.86rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "var(--text-body)"
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)"
    }
  }, scores[i], "/10"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-strong)",
      lineHeight: 1.6
    }
  }, parts[i].join(", ") || "—"), /*#__PURE__*/React.createElement(Badge, {
    kind: SeverityKind(scores[i])
  }, SeverityLabel(scores[i])))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.78rem",
      color: "var(--text-muted)",
      margin: "10px 0 0",
      lineHeight: 1.7
    }
  }, "Stress ", stress, "/10 \xB7 Sleep ", sleep, " h \xB7 Alcohol: ", FW.ALCOHOL_LABELS[alcohol], " \xB7 Exercise: ", FW.EXERCISE_LABELS[exercise], smoking ? " · Smoking: " + FW.SMOKING_LABELS[smoking] : "", infection ? " · Infection" : "", koebner ? " · Skin trauma" : "")), flare && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "var(--warn-bg)",
      border: "1.5px solid var(--warn-border)",
      borderRadius: 12,
      padding: "9px 16px",
      color: "var(--warn-fg)",
      fontWeight: 600,
      fontSize: "0.86rem",
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/warning.png",
    alt: "Warning",
    style: {
      width: 20
    }
  }), "High severity today \u2014 this will be marked as a flare day."))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      bottom: 0,
      zIndex: 20,
      display: "flex",
      justifyContent: "center",
      gap: 12,
      padding: "12px 0",
      margin: "18px -2px 0",
      background: "rgba(255,255,255,.92)",
      backdropFilter: "blur(6px)",
      borderTop: "1px solid var(--border-default)"
    }
  }, !reviewed && /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setReviewed(true)
  }, "Review Entry"), reviewed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setReviewed(false)
  }, "Clear"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: save
  }, "Save"))));
}
window.LogTab = LogTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flarewatch/LogTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flarewatch/SplashScreen.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
// Port of js/v2/splash.js — trend-line splash, recolored to the FlareWatch two-tone wordmark (white + teal on deep navy).
function SplashScreen({
  onDone
}) {
  const ref = React.useRef(null),
    canvasRef = React.useRef(null),
    done = React.useRef(false);
  const dismiss = React.useCallback(() => {
    if (done.current) return;
    done.current = true;
    const el = ref.current;
    if (el) {
      el.style.opacity = "0";
      setTimeout(() => onDone && onDone(), 1000);
    } else onDone && onDone();
  }, [onDone]);
  React.useEffect(() => {
    const canvas = canvasRef.current,
      host = ref.current,
      ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => {
      W = canvas.width = host.offsetWidth;
      H = canvas.height = host.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const series = [0.30, 0.42, 0.55, 0.68, 0.80, 0.72, 0.60, 0.66, 0.48, 0.34, 0.26, 0.20, 0.14, 0.12],
      n = series.length;
    const geom = () => {
      const padX = W * 0.12,
        chartW = W - padX * 2,
        baseY = H * 0.62,
        amp = Math.min(H * 0.17, 150);
      return {
        padX,
        chartW,
        baseY,
        amp
      };
    };
    const xOf = (i, g) => g.padX + i / (n - 1) * g.chartW;
    const yOf = (v, g) => g.baseY - (v - 0.5) * 2 * g.amp;
    const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    // Catmull-Rom smoothing: sample a dense smooth curve through the data points
    const sampleCurve = (g, M) => {
      const P = series.map((v, i) => ({
        x: xOf(i, g),
        y: yOf(v, g)
      }));
      const out = [];
      for (let s = 0; s < M; s++) {
        const t = s / (M - 1) * (n - 1),
          i = Math.min(Math.floor(t), n - 2),
          u = t - i;
        const p0 = P[Math.max(i - 1, 0)],
          p1 = P[i],
          p2 = P[i + 1],
          p3 = P[Math.min(i + 2, n - 1)];
        const u2 = u * u,
          u3 = u2 * u;
        out.push({
          x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
          y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3)
        });
      }
      return out;
    };
    const DRAW_DUR = 3.2;
    let start = null;
    function frame(ts) {
      if (start === null) start = ts;
      const p = easeInOut(Math.min((ts - start) / 1000 / DRAW_DUR, 1)),
        g = geom();
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      for (let k = 0; k <= 4; k++) {
        const y = g.baseY - g.amp + k / 4 * (2 * g.amp);
        ctx.beginPath();
        ctx.moveTo(g.padX, y);
        ctx.lineTo(g.padX + g.chartW, y);
        ctx.stroke();
      }
      for (let i = 0; i < n; i++) {
        const x = xOf(i, g);
        ctx.beginPath();
        ctx.moveTo(x, g.baseY - g.amp);
        ctx.lineTo(x, g.baseY + g.amp);
        ctx.stroke();
      }
      const fIndex = p * (n - 1),
        whole = Math.floor(fIndex);
      const M = 240,
        curve = sampleCurve(g, M),
        drawn = Math.max(2, Math.round(p * M));
      const pts = curve.slice(0, drawn);
      const tipX = pts[pts.length - 1].x,
        tipY = pts[pts.length - 1].y;
      if (pts.length > 1) {
        const areaGrad = ctx.createLinearGradient(0, g.baseY - g.amp, 0, g.baseY + g.amp);
        areaGrad.addColorStop(0, "rgba(110,216,204,0.22)");
        areaGrad.addColorStop(1, "rgba(46,115,150,0.02)");
        ctx.beginPath();
        ctx.moveTo(pts[0].x, g.baseY + g.amp);
        pts.forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.lineTo(pts[pts.length - 1].x, g.baseY + g.amp);
        ctx.closePath();
        ctx.fillStyle = areaGrad;
        ctx.fill();
        const lineGrad = ctx.createLinearGradient(g.padX, 0, g.padX + g.chartW, 0);
        lineGrad.addColorStop(0, "#8ec9dd");
        lineGrad.addColorStop(0.5, "#7fdcd2");
        lineGrad.addColorStop(1, "#aef0e6");
        ctx.save();
        ctx.shadowColor = "rgba(33,166,149,0.55)";
        ctx.shadowBlur = 16;
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 3.5;
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.beginPath();
        pts.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
        ctx.restore();
      }
      for (let i = 0; i <= whole && i < n; i++) {
        const x = xOf(i, g),
          y = yOf(series[i], g);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(58,183,191,0.8)";
        ctx.stroke();
      }
      const pulse = 1 + 0.35 * Math.sin(ts / 180);
      ctx.beginPath();
      ctx.arc(tipX, tipY, 9 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(110,216,204,0.25)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tipX, tipY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    const t = setTimeout(dismiss, 5000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", resize);
    };
  }, [dismiss]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--splash-bg)",
      transition: "opacity 1s ease"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      display: "block",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 10,
      textAlign: "center",
      pointerEvents: "none",
      marginTop: "-9vh",
      animation: "splashFadeUp 1.1s ease 0.4s both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "clamp(2.4rem,8vw,4.2rem)",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      textShadow: "0 0 40px rgba(255,255,255,0.2), 0 0 90px rgba(58,183,191,0.4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff"
    }
  }, "Flare"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brand-teal-bright)"
    }
  }, "Watch")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "0.55em",
      fontSize: "clamp(0.9rem,2.4vw,1.2rem)",
      color: "#b9e6e3",
      fontWeight: 500
    }
  }, "Know your triggers. Prevent the flare."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "1.7em",
      fontSize: "0.68rem",
      letterSpacing: "0.16em",
      color: "#7f929a",
      textTransform: "uppercase",
      fontWeight: 600
    }
  }, "By INIA Biosciences \xB7 Mahdi Tabatabaei")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: 2,
      width: "100%",
      transformOrigin: "left",
      transform: "scaleX(0)",
      background: "linear-gradient(90deg,#2e7396,#6ed8cc)",
      animation: "splashProg 5s linear forwards"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: dismiss,
    style: {
      position: "absolute",
      top: 18,
      right: 18,
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.14)",
      color: "rgba(255,255,255,0.45)",
      padding: "5px 14px",
      borderRadius: 20,
      fontSize: "0.78rem",
      cursor: "pointer",
      fontFamily: "inherit",
      letterSpacing: "0.05em",
      zIndex: 20,
      transition: "all 0.2s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "rgba(255,255,255,0.18)";
      e.currentTarget.style.color = "#fff";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
      e.currentTarget.style.color = "rgba(255,255,255,0.45)";
    }
  }, "Skip \u2192"));
}
window.SplashScreen = SplashScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flarewatch/SplashScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flarewatch/TreatmentsTab.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {
  Button,
  Badge,
  Field,
  TextInput,
  Select
} = window.FlareWatchDesignSystem_d30d0f;
const FWd = window.FW;
function swatchSvg(color) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 12 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "10",
    height: "10",
    rx: "3",
    fill: color,
    fillOpacity: "0.25"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "10",
    height: "3.2",
    rx: "1.6",
    fill: color
  }));
}
function TreatmentCard({
  t,
  idx,
  onStop,
  onDel
}) {
  const topical = t.type === "topical";
  const color = FWd.treatmentColor(idx);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      padding: "13px 16px",
      marginBottom: 10,
      borderLeft: "4px solid " + color,
      background: topical ? "#eaf3f9" : "#e3f7f2"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 5
    }
  }, swatchSvg(color), /*#__PURE__*/React.createElement(Badge, {
    kind: topical ? "topical" : "biologic"
  }, topical ? "Topical" : "Biologic"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: "0.9rem",
      color: "var(--text-strong)",
      flex: 1
    }
  }, t.drug), /*#__PURE__*/React.createElement("button", {
    onClick: onDel,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--border-input)",
      fontSize: "0.95rem",
      padding: "2px 4px"
    }
  }, "\u2715")), t.bodyAreas.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.76rem",
      color: "var(--text-body)",
      marginBottom: 3
    }
  }, "Areas: ", t.bodyAreas.join(", ")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.76rem",
      color: "var(--text-muted)",
      fontStyle: "italic",
      marginBottom: 4
    }
  }, "Started ", t.startDate, t.stopDate ? "  →  Stopped " + t.stopDate : "  →  Ongoing"), t.notes && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.76rem",
      color: "var(--text-faint)",
      borderTop: "1px solid var(--border-default)",
      marginTop: 6,
      paddingTop: 5
    }
  }, t.notes), !t.stopDate && /*#__PURE__*/React.createElement(Button, {
    variant: "danger-outline",
    style: {
      marginTop: 8,
      fontSize: "0.76rem",
      padding: "4px 12px"
    },
    onClick: onStop
  }, "Mark as stopped today"));
}
function TreatmentsTab() {
  const [treatments, setTreatments] = React.useState(FWd.treatments);
  const [form, setForm] = React.useState(null); // null | "topical" | "biologic"
  const [areas, setAreas] = React.useState([]);
  const areaOpts = ["Scalp", "Head", "Neck", "Torso", "L. forearm", "R. forearm", "L. hand", "R. hand", "L. knee", "R. knee", "L. lower leg", "R. lower leg"];
  const today = new Date().toISOString().slice(0, 10);
  const active = treatments.filter(t => !t.stopDate),
    past = treatments.filter(t => t.stopDate);
  const head = txt => /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.72rem",
      fontWeight: 700,
      color: "var(--text-ghost)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: "14px 0 8px"
    }
  }, txt);
  const stop = t => setTreatments(treatments.map(x => x === t ? {
    ...x,
    stopDate: today
  } : x));
  const del = t => setTreatments(treatments.filter(x => x !== t));
  const topicalDrugs = FWd.TOPICAL_CLASSES.flatMap(c => c.drugs),
    biologicDrugs = FWd.BIOLOGIC_CLASSES.flatMap(c => c.drugs);
  return /*#__PURE__*/React.createElement("div", null, !form && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "add",
    onClick: () => setForm("topical")
  }, "\uFF0B Topical steroid"), /*#__PURE__*/React.createElement(Button, {
    variant: "add",
    onClick: () => setForm("biologic")
  }, "\uFF0B Biologic")), form && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-tint-primary)",
      border: "1.5px solid var(--border-default)",
      borderRadius: 16,
      padding: "18px 20px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginBottom: 14
    }
  }, ["topical", "biologic"].map(ty => /*#__PURE__*/React.createElement("label", {
    key: ty,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: "0.85rem",
      fontWeight: 600,
      color: "var(--text-body)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    checked: form === ty,
    onChange: () => setForm(ty),
    style: {
      accentColor: "var(--brand-blue)"
    }
  }), ty === "topical" ? "Topical steroid" : "Biologic"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Drug"
  }, /*#__PURE__*/React.createElement(Select, {
    options: form === "topical" ? topicalDrugs : biologicDrugs
  }))), form === "topical" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.74rem",
      fontWeight: 600,
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.4px"
    }
  }, "Body areas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 4
    }
  }, areaOpts.map(a => /*#__PURE__*/React.createElement("label", {
    key: a,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      fontSize: "0.76rem",
      cursor: "pointer",
      borderRadius: 20,
      padding: "3px 9px",
      background: areas.includes(a) ? "var(--tint-blue-bg)" : "var(--surface-rail)",
      color: areas.includes(a) ? "var(--tint-blue-fg)" : "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: areas.includes(a),
    onChange: () => setAreas(areas.includes(a) ? areas.filter(x => x !== a) : [...areas, a]),
    style: {
      accentColor: "var(--brand-blue)",
      width: 13,
      height: 13
    }
  }), a)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Start date"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "date",
    defaultValue: today
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Stop date (leave blank if ongoing)"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "date"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Notes (optional)"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "text",
    placeholder: "Dose, frequency, side effects\u2026"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    style: {
      padding: "9px 20px",
      fontSize: "0.88rem"
    },
    onClick: () => setForm(null)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      flex: 1,
      padding: "9px 0",
      fontSize: "0.88rem",
      background: "var(--brand-blue)",
      boxShadow: "none"
    },
    onClick: () => setForm(null)
  }, "Save treatment"))), treatments.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--text-ghost)",
      fontSize: "0.88rem",
      padding: "36px 0"
    }
  }, "No treatments logged yet."), active.length > 0 && head("Active"), active.map(t => /*#__PURE__*/React.createElement(TreatmentCard, {
    key: t.id,
    t: t,
    idx: treatments.indexOf(t),
    onStop: () => stop(t),
    onDel: () => del(t)
  })), past.length > 0 && head("Past"), past.map(t => /*#__PURE__*/React.createElement(TreatmentCard, {
    key: t.id,
    t: t,
    idx: treatments.indexOf(t),
    onStop: () => stop(t),
    onDel: () => del(t)
  })));
}
window.TreatmentsTab = TreatmentsTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flarewatch/TreatmentsTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flarewatch/TrendsTab.jsx
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
const {
  TrendChart,
  CHART_COLORS,
  Button
} = window.FlareWatchDesignSystem_d30d0f;
const FWt = window.FW;
function TrendsTab() {
  const entries = FWt.entries.slice(-14);
  if (entries.length === 0) return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "60px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: "0.92rem",
      color: "var(--text-muted)",
      marginBottom: 4
    }
  }, "No data to chart yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.82rem",
      color: "var(--text-ghost)"
    }
  }, "Log a few days in the Log tab \u2014 or press \"Load 30-day demo\" to preview."));
  const dates = entries.map(e => e.date.slice(5));
  const defs = [{
    key: "itch",
    title: "Itch",
    cat: "symptom",
    max: 10,
    color: CHART_COLORS.itch,
    scores: entries.map(e => e.symptoms[0].score)
  }, {
    key: "pain",
    title: "Pain",
    cat: "symptom",
    max: 10,
    color: CHART_COLORS.pain,
    scores: entries.map(e => e.symptoms[1].score)
  }, {
    key: "redness",
    title: "Redness",
    cat: "symptom",
    max: 10,
    color: CHART_COLORS.redness,
    scores: entries.map(e => e.symptoms[2].score)
  }, {
    key: "scaling",
    title: "Scaling",
    cat: "symptom",
    max: 10,
    color: CHART_COLORS.scaling,
    scores: entries.map(e => e.symptoms[3].score)
  }, {
    key: "stress",
    title: "Stress",
    cat: "trigger",
    max: 10,
    color: CHART_COLORS.stress,
    scores: entries.map(e => e.lifestyle.stress)
  }, {
    key: "sleep",
    title: "Sleep (h)",
    cat: "trigger",
    max: 12,
    color: CHART_COLORS.sleep,
    scores: entries.map(e => e.lifestyle.sleepHours)
  }, {
    key: "pm25",
    title: "PM2.5",
    cat: "trigger",
    max: 60,
    color: CHART_COLORS.pm25,
    scores: entries.map(e => e.environment.pm25)
  }, {
    key: "humidity",
    title: "Humidity (%)",
    cat: "trigger",
    max: 100,
    color: CHART_COLORS.humidity,
    scores: entries.map(e => e.environment.humidity)
  }];
  const bands = FWt.treatments.map((t, ti) => {
    const end = t.stopDate || "9999-12-31";
    let s = entries.findIndex(e => e.date >= t.startDate);
    if (s < 0) return null;
    let e2 = -1;
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].date <= end) {
        e2 = i;
        break;
      }
    }
    if (e2 < 0 || s > e2) return null;
    return {
      id: t.id,
      startIdx: s,
      endIdx: e2,
      color: FWt.treatmentColor(ti),
      fullName: t.drug,
      isTopical: t.type === "topical",
      startDate: t.startDate,
      stopDate: t.stopDate
    };
  }).filter(Boolean);
  const [metrics, setMetrics] = React.useState(new Set(defs.map(d => d.key)));
  const [treats, setTreats] = React.useState(new Set(bands.map(b => b.id)));
  const toggleSet = (set, setFn, k) => {
    const n = new Set(set);
    n.has(k) ? n.delete(k) : n.add(k);
    setFn(n);
  };
  const group = (title, items, set, setFn, hint, dot) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0",
      borderBottom: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.72rem",
      fontWeight: 700,
      color: dot ? "var(--brand-teal)" : "var(--text-slate)",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }
  }, title), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.7rem",
      color: "var(--text-ghost)",
      fontStyle: "italic",
      flex: 1
    }
  }, hint), /*#__PURE__*/React.createElement(Button, {
    variant: "mini",
    style: {
      marginLeft: hint ? 0 : "auto"
    },
    onClick: () => setFn(new Set(items.map(i => i.k)))
  }, "All"), /*#__PURE__*/React.createElement(Button, {
    variant: "mini",
    onClick: () => setFn(new Set())
  }, "None")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px 14px"
    }
  }, items.map(i => /*#__PURE__*/React.createElement("label", {
    key: i.k,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: "0.82rem",
      color: "var(--text-body)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: set.has(i.k),
    onChange: () => toggleSet(set, setFn, i.k),
    style: {
      accentColor: "var(--brand-blue)",
      width: 14,
      height: 14,
      cursor: "pointer"
    }
  }), i.color && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "10",
    height: "10",
    rx: "3",
    fill: i.color,
    fillOpacity: "0.25"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "10",
    height: "3.2",
    rx: "1.6",
    fill: i.color
  })), i.label))));
  const visible = defs.filter(d => metrics.has(d.key));
  const activeBands = bands.filter(b => treats.has(b.id));
  const anySymptom = visible.some(d => d.cat === "symptom");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-panel)",
      border: "1.5px solid var(--border-default)",
      borderRadius: 14,
      padding: "12px 16px",
      marginBottom: 18
    }
  }, group("Symptoms", defs.filter(d => d.cat === "symptom").map(d => ({
    k: d.key,
    label: d.title
  })), metrics, k => setMetrics(new Set([...defs.filter(d => d.cat === "trigger" && metrics.has(d.key)).map(d => d.key), ...k]))), group("Triggers", defs.filter(d => d.cat === "trigger").map(d => ({
    k: d.key,
    label: d.title
  })), metrics, k => setMetrics(new Set([...defs.filter(d => d.cat === "symptom" && metrics.has(d.key)).map(d => d.key), ...k]))), bands.length > 0 && group("Treatments", bands.map(b => ({
    k: b.id,
    label: b.fullName,
    color: b.color
  })), treats, setTreats, "shown on symptom charts only", true)), visible.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--text-ghost)",
      fontSize: "0.88rem",
      padding: "36px 0"
    }
  }, "Select at least one metric above to see charts.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, visible.map(d => /*#__PURE__*/React.createElement(TrendChart, {
    key: d.key,
    title: d.title,
    scores: d.scores,
    labels: dates,
    maxVal: d.max,
    color: d.color,
    bands: d.cat === "symptom" ? activeBands : []
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.74rem",
      color: "var(--text-ghost)",
      textAlign: "center",
      marginTop: 14
    }
  }, "Last ", entries.length, " logged entries \xB7 gaps = no data that day"), anySymptom && activeBands.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "12px 16px",
      background: "var(--surface-panel)",
      border: "1.5px solid var(--border-default)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "0.72rem",
      fontWeight: 700,
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      margin: "0 0 10px"
    }
  }, "Treatments shown on charts"), activeBands.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 0",
      fontSize: "0.8rem",
      borderBottom: i < activeBands.length - 1 ? "1px solid var(--border-soft)" : "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "14",
    viewBox: "0 0 26 14"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "26",
    height: "14",
    rx: "3",
    fill: b.color,
    fillOpacity: "0.18"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "26",
    height: "3.5",
    rx: "1.5",
    fill: b.color
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "var(--text-strong)",
      flex: 1
    }
  }, b.fullName), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.66rem",
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 20,
      textTransform: "uppercase",
      letterSpacing: "0.4px",
      background: "var(--border-soft)",
      color: "var(--text-slate-mid)"
    }
  }, b.isTopical ? "Topical" : "Biologic"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.74rem",
      color: "var(--text-faint)"
    }
  }, b.startDate, " \u2192 ", b.stopDate || "ongoing")))));
}
window.TrendsTab = TrendsTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flarewatch/TrendsTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flarewatch/data.js
try { (() => {
// FlareWatch v3 — © 2026 Mahdi Tabatabaei · INIA Biosciences
// Demo dataset + pure helpers (ports of js/v2/data.js + scoring.js)
(function () {
  const bodyPartGroups = [{
    label: "Head & Neck",
    parts: ["Head", "Neck", "Scalp"]
  }, {
    label: "Arms & Hands",
    parts: ["Left upper arm", "Right upper arm", "Left forearm", "Right forearm", "Left hand", "Right hand"]
  }, {
    label: "Torso",
    parts: ["Torso", "Hips"]
  }, {
    label: "Legs & Feet",
    parts: ["Left thigh", "Right thigh", "Left knee", "Right knee", "Left lower leg", "Right lower leg", "Left foot", "Right foot"]
  }];
  const TREATMENT_COLORS = ["#2a78d6", "#1baf7a", "#eda100", "#008300", "#4a3aa7", "#e34948"];
  function pearsonR(xs, ys) {
    const n = xs.length;
    if (n < 3) return null;
    const mx = xs.reduce((a, b) => a + b) / n,
      my = ys.reduce((a, b) => a + b) / n;
    const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
    const dx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0)),
      dy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
    return dx * dy === 0 ? 0 : num / (dx * dy);
  }
  function corrClass(r) {
    if (r === null) return "nil";
    if (r >= 0.5) return "sp";
    if (r >= 0.2) return "mp";
    if (r <= -0.5) return "sn";
    if (r <= -0.2) return "mn";
    return "w";
  }
  // 14-day demo log removed — app starts empty; FW.generateDemo() below provides demo data on demand
  // Start EMPTY — users enter their own data; "Load 30-day demo" fills it on demand
  const entries = [];
  const treatments = [];
  window.FW = {
    bodyPartGroups,
    TREATMENT_COLORS,
    treatmentColor: i => TREATMENT_COLORS[i % TREATMENT_COLORS.length],
    pearsonR,
    corrClass,
    entries,
    treatments,
    TOPICAL_CLASSES: [{
      label: "Mild — Class VII",
      note: "Safe for face/skin folds; long-term use",
      drugs: ["Hydrocortisone 1%", "Hydrocortisone 2.5%"]
    }, {
      label: "Low–Moderate — Class V–VI",
      note: "Thin or sensitive skin; mild psoriasis",
      drugs: ["Desonide 0.05%", "Fluocinolone acetonide 0.01%"]
    }, {
      label: "Medium — Class IV–V",
      note: "Most common for body plaques",
      drugs: ["Mometasone furoate 0.1%", "Triamcinolone acetonide 0.1%", "Fluticasone propionate 0.05%"]
    }, {
      label: "High — Class II–III",
      note: "Thick plaques on trunk/limbs",
      drugs: ["Fluocinonide 0.05%", "Betamethasone dipropionate 0.05%"]
    }, {
      label: "Ultra-High — Class I",
      note: "Short-term only; scalp/palms/soles",
      drugs: ["Clobetasol propionate 0.05%", "Halobetasol propionate 0.05%"]
    }],
    BIOLOGIC_CLASSES: [{
      label: "TNF-α inhibitors",
      drugs: ["Adalimumab (Humira)", "Etanercept (Enbrel)"]
    }, {
      label: "IL-12/23 inhibitor (anti-p40)",
      drugs: ["Ustekinumab (Stelara)"]
    }, {
      label: "IL-17A inhibitors",
      drugs: ["Secukinumab (Cosentyx)", "Ixekizumab (Taltz)"]
    }, {
      label: "IL-17A/F inhibitor",
      drugs: ["Bimekizumab (Bimzelx)"]
    }, {
      label: "IL-23 inhibitors (anti-p19)",
      drugs: ["Guselkumab (Tremfya)", "Risankizumab (Skyrizi)"]
    }],
    ALCOHOL_LABELS: ["None", "Light", "Moderate", "Heavy"],
    EXERCISE_LABELS: ["None", "Light", "Moderate", "Intense"],
    ALCOHOL_TIPS: ["No alcohol", "≤3 standard drinks/week (~0.1–0.4/day)", ["Women: ≤7 drinks/week (≤1/day)", "Men: ≤14 drinks/week (≤2/day)"], ["Women: 8+ drinks/week or 4+ on any day", "Men: 15+ drinks/week or 5+ on any day"]],
    SMOKING_LABELS: ["None", "Light", "Moderate", "Heavy"],
    SMOKING_TIPS: ["No cigarettes", "1–10 cigarettes/day", "11–20 cigarettes/day (≤1 pack)", "More than 20 cigarettes/day (>1 pack)"]
  };
  // Port of js/v2/demo.js — 30-day dataset with planted correlations (stress→itch, sleep→itch, infection spike, PM2.5→redness) + 3 staggered treatments
  window.FW.generateDemo = function () {
    const daysAgo = n => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return d.toISOString().split("T")[0];
    };
    const bp = {
      itch: ["Scalp", "Left forearm"],
      pain: ["Right knee"],
      redness: ["Scalp", "Torso"],
      scaling: ["Left forearm"]
    };
    const WMO = ["Clear sky", "Partly cloudy", "Overcast", "Mainly clear"];
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));
    const rand = (lo, hi) => lo + Math.random() * (hi - lo);
    const randInt = (lo, hi) => Math.round(rand(lo, hi));
    const entries = [];
    let itch = 4,
      pain = 2,
      redness = 3,
      scaling = 2;
    for (let d = 29; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const isStressWeek = d >= 18 && d <= 22,
        isInfected = d >= 10 && d <= 12,
        isHighAQ = d >= 5 && d <= 8,
        isRecovery = d <= 4;
      const stress = isStressWeek ? randInt(7, 10) : isInfected ? randInt(5, 8) : randInt(1, 5);
      const sleepHours = isStressWeek ? rand(4, 6) : isRecovery ? rand(7, 9) : rand(5.5, 8.5);
      const alcohol = d % 7 === 0 ? 2 : d % 7 === 6 ? 1 : 0;
      const exercise = isStressWeek || isInfected ? 0 : randInt(0, 2);
      const stressEffect = (stress - 3) * 0.4,
        sleepEffect = (7 - sleepHours) * 0.3,
        infectEffect = isInfected ? 3 : 0,
        koebner = d === 15;
      itch = clamp(itch + stressEffect + sleepEffect + infectEffect + (koebner ? 2 : 0) + rand(-1, 1), 0, 10);
      pain = clamp(pain + infectEffect * 0.5 + rand(-0.5, 0.5), 0, 10);
      redness = clamp(redness + (isHighAQ ? 1.5 : 0) + infectEffect * 0.4 + rand(-0.8, 0.8), 0, 10);
      scaling = clamp(scaling + stressEffect * 0.3 + rand(-0.6, 0.6), 0, 10);
      if (isRecovery) {
        itch = clamp(itch - rand(0.5, 1.5), 0, 10);
        redness = clamp(redness - rand(0.3, 1.0), 0, 10);
      }
      const symptoms = [{
        name: "Itch",
        score: itch,
        parts: itch > 3 ? bp.itch : []
      }, {
        name: "Pain",
        score: pain,
        parts: pain > 3 ? bp.pain : []
      }, {
        name: "Redness",
        score: redness,
        parts: redness > 3 ? bp.redness : []
      }, {
        name: "Scaling",
        score: scaling,
        parts: scaling > 3 ? bp.scaling : []
      }];
      entries.push({
        date: date.toISOString().split("T")[0],
        symptoms,
        isFlareDay: symptoms.some(s => s.score >= 7),
        lifestyle: {
          stress,
          sleepHours: Math.round(sleepHours * 10) / 10,
          alcohol,
          exercise,
          smoking: false,
          infection: isInfected,
          koebner
        },
        environment: {
          temperature: Math.round(rand(isRecovery ? 22 : 15, 30) * 10) / 10,
          humidity: randInt(40, 80),
          weatherDesc: WMO[randInt(0, 3)],
          pm25: Math.round((isHighAQ ? rand(30, 55) : rand(5, 18)) * 10) / 10,
          pm10: Math.round((isHighAQ ? rand(50, 80) : rand(10, 35)) * 10) / 10,
          no2: Math.round((isHighAQ ? rand(30, 55) : rand(5, 20)) * 10) / 10,
          season: "Summer"
        }
      });
    }
    const treatments = [{
      id: "demo-t1",
      type: "topical",
      potencyClass: "High — Class II–III",
      biologicClass: null,
      drug: "Betamethasone dipropionate 0.05%",
      bodyAreas: ["Scalp", "Torso"],
      startDate: daysAgo(24),
      stopDate: daysAgo(10),
      notes: "Demo — initial flare management"
    }, {
      id: "demo-t2",
      type: "topical",
      potencyClass: "Ultra-High — Class I",
      biologicClass: null,
      drug: "Clobetasol propionate 0.05%",
      bodyAreas: ["Left forearm", "Right forearm"],
      startDate: daysAgo(9),
      stopDate: daysAgo(4),
      notes: "Demo — short-course for forearm flare"
    }, {
      id: "demo-t3",
      type: "biologic",
      potencyClass: null,
      biologicClass: "IL-17A inhibitors",
      drug: "Secukinumab (Cosentyx)",
      bodyAreas: [],
      startDate: daysAgo(3),
      stopDate: null,
      notes: "Demo — loading dose initiated"
    }];
    return {
      entries,
      treatments
    };
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flarewatch/data.js", error: String((e && e.message) || e) }); }

__ds_ns.TrendChart = __ds_scope.TrendChart;

__ds_ns.CHART_COLORS = __ds_scope.CHART_COLORS;

__ds_ns.TREATMENT_COLORS = __ds_scope.TREATMENT_COLORS;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.SeverityKind = __ds_scope.SeverityKind;

__ds_ns.SeverityLabel = __ds_scope.SeverityLabel;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.TabNav = __ds_scope.TabNav;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.SliderRow = __ds_scope.SliderRow;

__ds_ns.StepGroup = __ds_scope.StepGroup;

__ds_ns.ToggleGroup = __ds_scope.ToggleGroup;

__ds_ns.TriggerSlider = __ds_scope.TriggerSlider;

})();
