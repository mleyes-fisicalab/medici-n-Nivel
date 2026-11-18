'use strict';
/* ====================================================================
   Esquemas SVG de los tanques
   ==================================================================== */
const SV = { wall: 'stroke:var(--axis);fill:none;stroke-width:2.2;stroke-linejoin:round', thin: 'stroke:var(--axis);fill:none;stroke-width:1.4',
  tx: 'fill:var(--fg-2);font:600 11px Manrope,system-ui,sans-serif', mono: 'fill:var(--fg);font:500 11.5px "JetBrains Mono",monospace', tag: 'fill:var(--gold);font:700 10.5px "JetBrains Mono",monospace' };
const TK = { X0: 120, X1: 260, Y0: 44, Y1: 250, W: 340, H: 330 };
function tankBase(frac, color, closed, extra = '', o = {}) {
  const { X0, X1, Y0, Y1, W, H } = TK; frac = clamp(frac, 0, 1); const yL = Y1 - (Y1 - Y0) * frac;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria || 'Esquema del tanque'}">`;
  s += `<rect x="${X0}" y="${yL}" width="${X1 - X0}" height="${Y1 - yL}" style="fill:${color};opacity:.30"/>`;
  s += `<line x1="${X0}" y1="${yL}" x2="${X1}" y2="${yL}" style="stroke:${color};stroke-width:2.4"/>`;
  s += `<path d="M${X0} ${Y0} V${Y1} H${X1} V${Y0}${closed ? ` H${X0}` : ''}" style="${SV.wall}"/>`;
  for (let i = 0; i <= 10; i++) { const y = Y1 - (Y1 - Y0) * i / 10; s += `<line x1="${X1 - (i % 5 ? 6 : 12)}" y1="${y}" x2="${X1}" y2="${y}" style="stroke:var(--tick);stroke-width:1"/>`; }
  return s + extra + '</svg>';
}
const arrow = (x1, y1, x2, y2, st) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 7; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="${st}"/><path d="M${x2} ${y2} L${x2 - L * Math.cos(a - .45)} ${y2 - L * Math.sin(a - .45)} L${x2 - L * Math.cos(a + .45)} ${y2 - L * Math.sin(a + .45)}Z" style="fill:var(--axis)"/>`; };
function tankDP(o) {
  const { X0, X1, Y0, Y1 } = TK, yT = Y1 + clamp(o.dpx, 6, 58), xT = 64, tapY = Y1 - 8, closed = o.mode !== 'abierto';
  let e = `<path d="M${X0} ${tapY} H${xT} V${yT - 13}" style="${SV.thin}"/>`;
  if (o.mode === 'abierto') e += `<path d="M${xT - 23} ${yT} H${xT - 50}" style="${SV.thin}"/><text x="${xT - 52}" y="${yT - 18}" style="${SV.tx}">L · atm</text>`;
  else { const wet = o.mode === 'humeda'; e += `<path d="M${xT - 23} ${yT} H${xT - 44} V${Y0 - 22} H${(X0 + X1) / 2} V${Y0}" style="stroke:${wet ? o.color : 'var(--axis)'};fill:none;stroke-width:${wet ? 4.5 : 1.4};${wet ? 'opacity:.75' : 'stroke-dasharray:5 4'}"/>`;
    e += `<text x="${(X0 + X1) / 2 + 6}" y="${Y0 - 26}" style="${SV.tx}">${wet ? 'pierna húmeda' : 'pierna seca'}</text><text x="${X0 + 8}" y="${Y0 + 16}" style="${SV.tx}">P₀</text>`; }
  e += `<rect x="${xT - 23}" y="${yT - 13}" width="46" height="26" rx="5" style="fill:var(--panel-solid);stroke:var(--gold);stroke-width:1.6"/><text x="${xT}" y="${yT + 4}" text-anchor="middle" style="${SV.tag}">LT</text>`;
  e += `<text x="${X0 - 4}" y="${tapY - 5}" text-anchor="end" style="${SV.tx}">H</text>`;
  if (o.dpx > 10) e += `<line x1="${X1 + 14}" y1="${Y1}" x2="${X1 + 14}" y2="${yT}" style="stroke:var(--tick);stroke-dasharray:3 3"/><line x1="${xT + 23}" y1="${yT}" x2="${X1 + 18}" y2="${yT}" style="stroke:var(--tick);stroke-dasharray:3 3"/><text x="${X1 + 20}" y="${(Y1 + yT) / 2 + 4}" style="${SV.tx}">d</text>`;
  if (o.I != null) e += `<text x="${xT}" y="${yT + 30}" text-anchor="middle" style="${SV.mono}">${o.I}</text>`;
  if (o.label) e += `<text x="${(X0 + X1) / 2}" y="${Y1 - 10}" text-anchor="middle" style="${SV.tx}">${o.label}</text>`;
  return tankBase(o.frac, o.color, closed, e, { aria: 'Tanque con transmisor de presión diferencial' });
}
function tankUS(o) {
  const { X0, X1, Y0, Y1 } = TK, xc = (X0 + X1) / 2, yL = Y1 - (Y1 - Y0) * clamp(o.frac, 0, 1), yz = Y0 + (Y1 - Y0) * o.z;
  let e = `<rect x="${xc - 17}" y="${Y0 - 4}" width="34" height="14" rx="3" style="fill:var(--panel-solid);stroke:var(--gold);stroke-width:1.6"/><text x="${xc}" y="${Y0 - 9}" text-anchor="middle" style="${SV.tag}">LT · US</text>`;
  e += `<line x1="${X0}" y1="${yz}" x2="${X1}" y2="${yz}" style="stroke:var(--bad);stroke-width:1.2;stroke-dasharray:5 4"/><text x="${X0 - 6}" y="${yz + 4}" text-anchor="end" style="fill:var(--bad);font:600 10.5px Manrope,sans-serif">zona muerta</text>`;
  e += `<path d="M${xc - 8} ${Y0 + 12} L${xc - 46} ${yL - 2} M${xc + 8} ${Y0 + 12} L${xc + 46} ${yL - 2}" style="stroke:var(--c-tc);stroke-width:1;opacity:.55"/>`;
  e += arrow(xc - 10, Y0 + 14, xc - 10, yL - 3, 'stroke:var(--c-tc);stroke-width:1.8') + arrow(xc + 10, yL - 3, xc + 10, Y0 + 14, 'stroke:var(--c-tc);stroke-width:1.8');
  e += `<line x1="${X1 + 14}" y1="${Y0 + 10}" x2="${X1 + 14}" y2="${yL}" style="stroke:var(--tick)"/><text x="${X1 + 18}" y="${(Y0 + yL) / 2 + 4}" style="${SV.tx}">d</text>`;
  e += `<line x1="${X1 + 14}" y1="${yL}" x2="${X1 + 14}" y2="${Y1}" style="stroke:var(--c-rtd)"/><text x="${X1 + 18}" y="${(yL + Y1) / 2 + 4}" style="${SV.tx}">h</text>`;
  if (o.T != null) e += `<text x="${X0 - 6}" y="${Y0 + 44}" text-anchor="end" style="${SV.mono}">aire ${o.T}</text>`;
  if (o.read) e += `<text x="${xc}" y="${Y1 + 26}" text-anchor="middle" style="${SV.mono}">${o.read}</text>`;
  return tankBase(o.frac, o.color, true, e, { aria: 'Tanque con sensor ultrasónico' });
}
function tankCap(o) {
  const { X0, X1, Y0, Y1 } = TK, xc = (X0 + X1) / 2, yL = Y1 - (Y1 - Y0) * clamp(o.frac, 0, 1), yt = Y0 + 4, yb = Y1 - 6;
  let e = `<rect x="${xc - 13}" y="${yt}" width="26" height="${yb - yt}" style="fill:none;stroke:var(--fg-2);stroke-width:1.6"/>`;
  e += `<rect x="${xc - 12}" y="${Math.max(yL, yt)}" width="24" height="${Math.max(0, yb - Math.max(yL, yt))}" style="fill:${o.color};opacity:.45"/>`;
  e += `<line x1="${xc}" y1="${Y0 - 18}" x2="${xc}" y2="${yb - 4}" style="stroke:var(--gold);stroke-width:4;stroke-linecap:round"/>`;
  e += `<rect x="${xc - 26}" y="${Y0 - 34}" width="52" height="18" rx="4" style="fill:var(--panel-solid);stroke:var(--gold);stroke-width:1.6"/><text x="${xc}" y="${Y0 - 21}" text-anchor="middle" style="${SV.tag}">555</text>`;
  e += `<text x="${xc + 34}" y="${Y0 - 21}" style="${SV.tx}">sonda coaxial</text>`;
  if (o.read) e += `<text x="${xc}" y="${Y1 + 26}" text-anchor="middle" style="${SV.mono}">${o.read}</text>`;
  return tankBase(o.frac, o.color, true, e, { aria: 'Tanque con sonda capacitiva' });
}
function tankCtl(o) {
  const { X0, X1, Y0, Y1 } = TK, yA = p => Y1 - (Y1 - Y0) * p / 100, xv = 62, yv = 22;
  let e = `<path d="M8 ${yv} H${X0 + 26} V${Y0 + 8}" style="stroke:var(--c-rtd);fill:none;stroke-width:3"/>`;
  e += `<path d="M${xv - 13} ${yv - 9} L${xv + 13} ${yv + 9} V${yv - 9} L${xv - 13} ${yv + 9}Z" style="fill:${o.fail ? 'var(--bad)' : 'var(--panel-solid)'};stroke:var(--axis);stroke-width:1.5"/>`;
  e += `<text x="${xv}" y="${yv + 26}" text-anchor="middle" style="${SV.tag}">LV-301 · ${o.fa}</text><text x="${xv}" y="${yv + 40}" text-anchor="middle" style="${SV.mono}">${o.u}</text>`;
  if (o.qin > 0.05) e += arrow(X0 + 26, Y0 + 8, X0 + 26, Y0 + 30, 'stroke:var(--c-rtd);stroke-width:2');
  e += `<path d="M${X1} ${Y1 - 10} H${TK.W - 8}" style="stroke:var(--c-rtd);fill:none;stroke-width:3"/>` + arrow(X1 + 30, Y1 + 6, X1 + 60, Y1 + 6, 'stroke:var(--axis);stroke-width:1.4');
  e += `<text x="${X1 + 30}" y="${Y1 + 22}" style="${SV.tx}">Q sal</text>`;
  [[90, 'LSH'], [10, 'LSL']].forEach(([p, t]) => { e += `<line x1="${X0}" y1="${yA(p)}" x2="${X0 + 22}" y2="${yA(p)}" style="stroke:var(--bad);stroke-width:1.4"/><text x="${X0 - 4}" y="${yA(p) + 4}" text-anchor="end" style="fill:var(--bad);font:700 10.5px 'JetBrains Mono',monospace">${t}</text>`; });
  e += `<line x1="${X0}" y1="${yA(o.sp)}" x2="${X1}" y2="${yA(o.sp)}" style="stroke:var(--gold);stroke-width:1.2;stroke-dasharray:6 4"/><text x="${X1 - 4}" y="${yA(o.sp) - 4}" text-anchor="end" style="fill:var(--gold);font:700 10.5px 'JetBrains Mono',monospace">SP</text>`;
  e += `<circle cx="${X1 + 34}" cy="${Y0 + 40}" r="17" style="fill:var(--panel-solid);stroke:var(--gold);stroke-width:1.6"/><line x1="${X1 + 17}" y1="${Y0 + 40}" x2="${X1 + 51}" y2="${Y0 + 40}" style="stroke:var(--gold);stroke-width:1"/><text x="${X1 + 34}" y="${Y0 + 37}" text-anchor="middle" style="${SV.tag}">LIC</text><text x="${X1 + 34}" y="${Y0 + 51}" text-anchor="middle" style="${SV.tag}">301</text>`;
  return tankBase(o.frac, 'var(--c-rtd)', true, e, { aria: 'Lazo de control de nivel' });
}

/* ====================================================================
   I · Cadena de medición y lazo
   ==================================================================== */
MOUNT.cadena = () => {
  const desc = [
    'El proceso: un tanque abierto de agua de 4 m. El nivel es la variable de proceso (PV) que queremos conocer y controlar.',
    'Elemento primario LE: el diafragma del transmisor recibe la presión de la columna, ΔP = ρ g h. Con agua en Cartago son 9,76 kPa por cada metro.',
    'El transmisor LT escala la presión calibrada de 0 a 39,0 kPa (0 a 4 m) a 4–20 mA. La corriente no se degrada con la resistencia del cable.',
    'El LIC convierte la corriente en % de nivel, la compara con la consigna de 2,5 m (62,5 %) y calcula la salida con un controlador proporcional de ganancia 2.',
    'El convertidor I/P transforma la salida de 4–20 mA en 3–15 psi y el actuador abre la válvula de entrada. Si el nivel sube, la válvula cierra: acción inversa.'
  ];
  const up = () => {
    const h = +$('#ch-T').value; $('#ch-To').textContent = fmt(h, 2) + ' m';
    const dp = RHO_W * G * h / 1000, I = 4 + 16 * h / 4, pv = h / 4 * 100, u = clamp(50 + 2 * (62.5 - pv), 0, 100);
    $('#ch-v0').innerHTML = `${fmt(h, 2)}<i> m</i>`;
    $('#ch-v1').innerHTML = `${fmt(dp, 2)}<i> kPa</i>`;
    $('#ch-v2').innerHTML = `${fmt(I, 2)}<i> mA</i>`;
    $('#ch-v3').innerHTML = `${fmt(pv, 1)}<i> %</i> → ${fmt(u, 0)}<i> %</i>`;
    $('#ch-v4').innerHTML = `${fmt(3 + 12 * u / 100, 1)}<i> psi</i> · ${fmt(u, 0)}<i> %</i>`;
  };
  const show = i => { $$('#chain .node').forEach((n, k) => n.classList.toggle('on', k === i)); $('#ch-desc').textContent = desc[i]; };
  $('#chain').addEventListener('click', e => { const n = e.target.closest('.node'); if (n) show(+n.dataset.i); });
  $('#ch-T').addEventListener('input', up); up(); show(0);
};

/* ---------- aforo: nivel, volumen y masa ---------- */
MOUNT.metodos = () => {
  let g = 'v';
  $('#vg-f').innerHTML = LIQ.map((l, i) => `<option value="${i}" ${l.k === 'acpm' ? 'selected' : ''}>${l.n} · ${fmt(l.rho, 0)} kg/m³</option>`).join('');
  const pl = new Plane($('#vg-plot'), { xmin: -6, xmax: 108, ymin: -6, ymax: 108, xlabel: 'Nivel (%)', ylabel: 'Volumen (%)', title: 'Curva de aforo', xd: 1, yd: 1, h: 360 });
  const up = () => {
    const D = +$('#vg-D').value, L = +$('#vg-L').value, pc = +$('#vg-h').value, liq = LIQ[+$('#vg-f').value];
    $('#vg-Do').textContent = fmt(D, 1) + ' m'; $('#vg-Lo').textContent = fmt(L, 1) + ' m'; $('#vg-ho').textContent = fmt(pc, 1) + ' %';
    $('#vg-L').closest('.ctrl').hidden = g === 'e';
    const Hm = g === 'v' ? L : D, h = pc / 100 * Hm;
    const V = x => g === 'v' ? Math.PI * D * D / 4 * x : g === 'h' ? volH(D, L, x) : volE(D, x);
    const Vt = V(Hm), v = V(h), dvdh = (V(Math.min(Hm, h + 0.002)) - V(Math.max(0, h - 0.002))) / (Math.min(Hm, h + 0.002) - Math.max(0, h - 0.002));
    kpis($('#vg-k'), [{ l: 'Nivel', v: fmt(h, 3), u: 'm' }, { l: 'Volumen', v: fmt(v, 3), u: 'm³' }, { l: '% del volumen', v: fmt(v / Vt * 100, 1), u: '%' },
      { l: 'Masa', v: fmt(liq.rho * v / 1000, 2), u: 't' }, { l: 'Capacidad total', v: fmt(Vt, 2), u: 'm³' }, { l: 'Litros por cm', v: fmt(dvdh * 10, 1), u: 'L/cm' }]);
    pl.set([
      { id: 'id', type: 'line', label: 'Tanque vertical (lineal)', color: 'var(--tick)', dash: 'dot', width: 1.6, pts: [[0, 0], [100, 100]] },
      { id: 'af', type: 'fn', label: g === 'v' ? 'Tanque vertical' : g === 'h' ? 'Cilindro horizontal' : 'Esfera', color: 'var(--c-rtd)', width: 2.6, fn: x => V(x / 100 * Hm) / Vt * 100, dom: [0, 100] },
      { id: 'p', type: 'point', x: pc, y: v / Vt * 100, color: 'var(--gold)', tag: `${fmt(v / Vt * 100, 1)} % · ${fmt(v, 2)} m³` }
    ]);
  };
  seg('#vg-g', v => { g = v; up(); });
  ['#vg-D', '#vg-L', '#vg-h', '#vg-f'].forEach(s => $(s).addEventListener('input', up));
  up();
};

/* ====================================================================
   II · Hidrostático
   ==================================================================== */
MOUNT.hidro = () => { $('#h-dens').innerHTML = LIQ.map(l => `<tr><td>${l.n}</td><td class="num">${fmt(l.rho, 0)}</td><td class="num">${fmt(l.rho * G / 1000, 3)}</td></tr>`).join(''); };

MOUNT.simdp = () => {
  let m = 'abierto';
  const opts = LIQ.map((l, i) => `<option value="${i}">${l.n} · ${fmt(l.rho, 0)} kg/m³</option>`).join('');
  $('#dp-fc').innerHTML = opts; $('#dp-f').innerHTML = opts;
  const iw = LIQ.findIndex(l => l.k === 'agua'); $('#dp-fc').value = iw; $('#dp-f').value = LIQ.findIndex(l => l.k === 'salm');
  const pl = new Plane($('#dp-plot'), { xmin: -0.3, xmax: 3.3, ymin: 0, ymax: 24, xlabel: 'h real (m)', ylabel: 'I (mA)', title: 'Corriente del lazo frente al nivel real', xd: 2, yd: 2 });
  const up = rehome => {
    const lc = LIQ[+$('#dp-fc').value], lr = LIQ[+$('#dp-f').value], rc = lc.rho, r = lr.rho;
    const H = +$('#dp-H').value, h = +$('#dp-h').value / 100 * H, d = +$('#dp-d').value, p0 = +$('#dp-p0').value, brk = $('#dp-brk').checked;
    $('#dp-hw').min = H; const hw = Math.max(H, +$('#dp-hw').value);
    $('#dp-Ho').textContent = fmt(H, 1) + ' m'; $('#dp-ho').textContent = fmt(h, 2) + ' m'; $('#dp-do').textContent = fmt(d, 2) + ' m'; $('#dp-p0o').textContent = fmt(p0, 0) + ' kPa'; $('#dp-hwo').textContent = fmt(hw, 1) + ' m';
    $('#dp-p0').closest('.ctrl').hidden = m === 'abierto'; $('#dp-hw').closest('.ctrl').hidden = m !== 'humeda';
    const wet = m === 'humeda', P0 = m === 'abierto' ? 0 : p0;
    const dP = (rho, x) => (rho * G * (x + d) - (wet ? rho * G * (hw + d) : 0)) / 1000;
    const PH = P0 + r * G * (h + d) / 1000, PL = P0 + (wet ? r * G * (hw + d) / 1000 : 0);
    const LRV = dP(rc, 0), URV = dP(rc, H), span = URV - LRV;
    const cur = x => clamp(4 + 16 * (dP(r, x) - LRV) / span, 3.8, 20.5);
    let I = cur(h), st = 'ok'; if (brk) { I = 3.6; st = 'bad'; }
    const hind = brk ? NaN : (I - 4) / 16 * H, err = hind - h;
    kpis($('#dp-k'), [{ l: 'Presión lado H', v: fmt(PH, 2), u: 'kPa' }, { l: 'Presión lado L', v: fmt(PL, 2), u: 'kPa' }, { l: 'ΔP medida', v: fmt(PH - PL, 2), u: 'kPa' },
      { l: 'LRV', v: fmt(LRV, 2), u: 'kPa', c: LRV < -0.005 ? 'warn' : '' }, { l: 'URV', v: fmt(URV, 2), u: 'kPa' }, { l: 'Corriente', v: fmt(I, 2), u: 'mA', c: brk ? 'bad' : (I >= 20.5 || I <= 3.8) ? 'warn' : 'ok' },
      { l: 'Nivel indicado', v: brk ? 'Falla' : fmt(hind, 3), u: brk ? '' : 'm', c: st }, { l: 'Error', v: brk ? '—' : (err >= 0 ? '+' : '') + fmt(err * 100, 1), u: brk ? '' : 'cm', c: brk ? 'bad' : Math.abs(err) <= 0.005 * H ? 'ok' : 'bad' }]);
    if (rehome) pl.setHome({ xmin: -0.1 * H, xmax: 1.1 * H, ymin: 0, ymax: 24 });
    pl.set([
      { id: 'id', type: 'line', label: 'Calibración correcta', color: 'var(--tick)', dash: 'dot', width: 1.6, pts: [[0, 4], [H, 20]] },
      { id: 'i', type: 'fn', label: `I con ${lr.n.toLowerCase()}`, color: 'var(--c-rtd)', width: 2.6, fn: cur, dom: [0, H] },
      { id: 'h4', type: 'hline', y: 4, color: 'var(--tick)', tag: '4 mA' }, { id: 'h20', type: 'hline', y: 20, color: 'var(--tick)', tag: '20 mA' },
      { id: 'f1', type: 'hline', y: 3.6, color: 'var(--bad)', tag: '3,6 mA falla' },
      { id: 'p', type: 'point', x: h, y: I, color: brk ? 'var(--bad)' : 'var(--gold)', tag: fmt(I, 2) + ' mA' }
    ]);
    $('#dp-svg').innerHTML = tankDP({ frac: h / H, color: 'var(--c-rtd)', mode: m, dpx: d / H * 206, I: brk ? 'falla' : fmt(I, 2) + ' mA', label: lr.n });
  };
  seg('#dp-m', v => { m = v; up(true); });
  ['#dp-h', '#dp-d', '#dp-p0', '#dp-hw', '#dp-f', '#dp-fc'].forEach(s => $(s).addEventListener('input', () => up(false)));
  $('#dp-H').addEventListener('input', () => up(true)); $('#dp-brk').addEventListener('change', () => up(false));
  up(true);
};

/* ====================================================================
   III · Ultrasónico
   ==================================================================== */
MOUNT.simus = () => {
  let fw = 'fija';
  const pl = new Plane($('#us-plot'), { xmin: -12, xmax: 72, ymin: -40, ymax: 160, xlabel: 'T aire (°C)', ylabel: 'Error (mm)', title: 'Error del nivel indicado', xd: 1, yd: 1 });
  const up = rehome => {
    const Hs = +$('#us-H').value, z = +$('#us-z').value, hmax = Hs - z, h = +$('#us-h').value / 100 * hmax, T = +$('#us-T').value;
    $('#us-Ho').textContent = fmt(Hs, 1) + ' m'; $('#us-ho').textContent = fmt(h, 2) + ' m'; $('#us-To').textContent = T + ' °C'; $('#us-zo').textContent = fmt(z, 2) + ' m';
    const d = Hs - h, c = cs(T), t = 2 * d / c, cu = fw === 'fija' ? 343 : csl(T), dc = cu * t / 2, hi = Hs - dc, err = (hi - h) * 1000;
    kpis($('#us-k'), [{ l: 'Distancia real', v: fmt(d, 3), u: 'm' }, { l: 'Tiempo de eco', v: fmt(t * 1000, 3), u: 'ms' }, { l: 'c real', v: fmt(c, 2), u: 'm/s' },
      { l: 'c del firmware', v: fmt(cu, 2), u: 'm/s' }, { l: 'Nivel indicado', v: fmt(hi, 3), u: 'm' }, { l: 'Error', v: (err >= 0 ? '+' : '') + fmt(err, 1), u: 'mm', c: Math.abs(err) < 5 ? 'ok' : 'bad' },
      { l: 'pulseIn() del Arduino', v: fmt(t * 1e6, 0), u: 'µs' }, { l: 'Nivel máximo medible', v: fmt(hmax, 2), u: 'm' }]);
    const ef = TT => (d - 343 * d / cs(TT)) * 1000, ec = TT => (d - csl(TT) * d / cs(TT)) * 1000;
    if (rehome) { const a = ef(-10), b = ef(70), pad = (b - a) * .12 + 5; pl.setHome({ xmin: -14, xmax: 74, ymin: Math.min(a, 0) - pad, ymax: Math.max(b, 0) + pad }); }
    pl.set([
      { id: 'f', type: 'fn', label: 'Firmware con c fija (343 m/s)', color: 'var(--c-tc)', width: 2.6, fn: ef, dom: [-10, 70] },
      { id: 'c', type: 'fn', label: 'Firmware compensado', color: 'var(--c-ntc)', width: 2.6, fn: ec, dom: [-10, 70] },
      { id: 'p', type: 'point', x: T, y: err, color: 'var(--gold)', tag: `${err >= 0 ? '+' : ''}${fmt(err, 1)} mm` }
    ]);
    $('#us-svg').innerHTML = tankUS({ frac: h / Hs, z: z / Hs, color: 'var(--c-rtd)', T: T + ' °C', read: `h = ${fmt(hi, 3)} m` });
  };
  seg('#us-fw', v => { fw = v; up(false); });
  ['#us-h', '#us-T'].forEach(s => $(s).addEventListener('input', () => up(false)));
  ['#us-H', '#us-z'].forEach(s => $(s).addEventListener('input', () => up(true)));
  up(true);
};

/* ====================================================================
   IV · Capacitivo
   ==================================================================== */
MOUNT.simcap = () => {
  $('#cp-f').innerHTML = CAPL.map((l, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${l.n} · εr = ${fmt(l.er, 2)}</option>`).join('');
  const p1 = new Plane($('#cp-plot1'), { xmin: -0.1, xmax: 1.3, ymin: 0, ymax: 200, xlabel: 'h (m)', ylabel: 'C (pF)', title: 'Capacitancia: lineal', xd: 2, yd: 2, h: 290 });
  const p2 = new Plane($('#cp-plot2'), { xmin: -0.1, xmax: 1.3, ymin: 0, ymax: 120, xlabel: 'h (m)', ylabel: 'f (kHz)', title: 'Frecuencia del 555: no lineal', xd: 2, yd: 2, h: 290 });
  const up = rehome => {
    const er = CAPL[+$('#cp-f').value].er, Lp = +$('#cp-L').value, D = +$('#cp-D').value;
    let d = +$('#cp-d').value; if (d > D - 2) { d = D - 2; $('#cp-d').value = d; }
    const Cp = +$('#cp-p').value, R = +$('#cp-r').value * 1e3, h = +$('#cp-h').value / 100 * Lp, K = Kcoax(D, d);
    $('#cp-ho').textContent = fmt(h, 2) + ' m'; $('#cp-Lo').textContent = fmt(Lp, 2) + ' m'; $('#cp-Do').textContent = D + ' mm'; $('#cp-do').textContent = fmt(d, 1) + ' mm'; $('#cp-po').textContent = Cp + ' pF'; $('#cp-ro').textContent = fmt(R / 1000, 0) + ' kΩ';
    const C = x => Cp + K * (er * x + (Lp - x)), f = x => 1.44 / (R * C(x) * 1e-12) / 1000;
    const dfdh = -1.44 / (R * Math.pow(C(h) * 1e-12, 2)) * K * (er - 1) * 1e-12;
    kpis($('#cp-k'), [{ l: 'K de la sonda', v: fmt(K, 2), u: 'pF/m' }, { l: 'C vacío', v: fmt(C(0), 1), u: 'pF' }, { l: 'C lleno', v: fmt(C(Lp), 1), u: 'pF' },
      { l: 'C actual', v: fmt(C(h), 1), u: 'pF' }, { l: 'Frecuencia', v: fmt(f(h), 2), u: 'kHz' }, { l: 'Sensibilidad', v: fmt(K * (er - 1), 1), u: 'pF/m' },
      { l: 'Sensibilidad local', v: fmt(dfdh, 0), u: 'Hz/m' }, { l: 'Parásita / C vacío', v: fmt(Cp / C(0) * 100, 0), u: '%', c: Cp / C(0) > .5 ? 'warn' : '' }]);
    if (rehome) { p1.setHome({ xmin: -0.08 * Lp, xmax: 1.1 * Lp, ymin: 0, ymax: C(Lp) * 1.15 }); p2.setHome({ xmin: -0.08 * Lp, xmax: 1.1 * Lp, ymin: 0, ymax: f(0) * 1.15 }); }
    p1.set([{ id: 'c', type: 'fn', label: 'C(h)', color: 'var(--c-ntc)', width: 2.6, fn: C, dom: [0, Lp] }, { id: 'p', type: 'point', x: h, y: C(h), color: 'var(--gold)', tag: fmt(C(h), 1) + ' pF' }]);
    p2.set([{ id: 'l', type: 'line', label: 'Recta entre extremos', color: 'var(--tick)', dash: 'dot', width: 1.6, pts: [[0, f(0)], [Lp, f(Lp)]] },
      { id: 'f', type: 'fn', label: 'f(h)', color: 'var(--c-tc)', width: 2.6, fn: f, dom: [0, Lp] }, { id: 'p', type: 'point', x: h, y: f(h), color: 'var(--gold)', tag: fmt(f(h), 2) + ' kHz' }]);
    $('#cp-svg').innerHTML = tankCap({ frac: h / Lp * 0.96, color: 'var(--c-ntc)', read: `C = ${fmt(C(h), 1)} pF · f = ${fmt(f(h), 2)} kHz` });
  };
  $('#cp-h').addEventListener('input', () => up(false));
  ['#cp-f', '#cp-L', '#cp-D', '#cp-d', '#cp-p', '#cp-r'].forEach(s => $(s).addEventListener('input', () => up(true)));
  up(true);
};

/* ====================================================================
   V · Lazo de control de nivel
   ==================================================================== */
MOUNT.control = el => {
  const A = 2, Hm = 4, QMAX = 0.012, DT = 0.5, WIN = 600;
  let mode = 'p', fa = 'FC', h = 0.4 * Hm, t = 0, on = false, hist = [], last = { u: 0, qin: 0, qout: 0 };
  const p1 = new Plane($('#ct-plot1'), { xmin: -WIN, xmax: 60, ymin: -5, ymax: 108, xlabel: 't (s)', ylabel: 'Nivel (%)', title: 'Nivel del tanque (últimos 10 min)', xd: 0, yd: 1, h: 260 });
  const p2 = new Plane($('#ct-plot2'), { xmin: -WIN, xmax: 60, ymin: -5, ymax: 108, xlabel: 't (s)', ylabel: '%', title: 'Apertura de LV-301 y demanda', xd: 0, yd: 1, h: 220 });
  const outs = () => { $('#ct-spo').textContent = $('#ct-sp').value + ' %'; $('#ct-kco').textContent = fmt(+$('#ct-kc').value, 1); $('#ct-uo').textContent = $('#ct-u').value + ' %'; $('#ct-qo').textContent = fmt(+$('#ct-q').value, 1) + ' L/s';
    $('#ct-kc').closest('.ctrl').hidden = mode !== 'p'; $('#ct-u').closest('.ctrl').hidden = mode !== 'man'; };
  const step = () => {
    const sp = +$('#ct-sp').value, kc = +$('#ct-kc').value, fail = $('#ct-fail').checked, pv = h / Hm * 100;
    let u;
    if (fail) u = fa === 'FC' ? 0 : 100;
    else if (mode === 'man') u = +$('#ct-u').value;
    else if (mode === 'onoff') { if (pv < sp - 2.5) on = true; if (pv > sp + 2.5) on = false; u = on ? 100 : 0; }
    else u = clamp(50 + kc * (sp - pv), 0, 100);
    const qin = QMAX * u / 100, qout = h > 0.001 ? +$('#ct-q').value / 1000 : 0;
    h = clamp(h + (qin - qout) / A * DT, 0, Hm); t += DT; last = { u, qin, qout, sp };
  };
  const render = () => {
    const pv = h / Hm * 100, sp = +$('#ct-sp').value, fail = $('#ct-fail').checked;
    let st = 'Normal', c = 'ok';
    if (pv >= 99.9) { st = 'REBOSE'; c = 'bad'; } else if (pv <= 0.1) { st = 'VACÍO · bomba en seco'; c = 'bad'; } else if (pv >= 90) { st = 'Alarma LSH'; c = 'warn'; } else if (pv <= 10) { st = 'Alarma LSL'; c = 'warn'; }
    kpis($('#ct-k'), [{ l: 'Nivel', v: fmt(pv, 1), u: '%' }, { l: 'Error SP − PV', v: fmt(sp - pv, 1), u: '%' }, { l: 'Apertura LV-301', v: fmt(last.u, 0), u: '%', c: fail ? 'bad' : '' },
      { l: 'Q entrada', v: fmt(last.qin * 1000, 2), u: 'L/s' }, { l: 'Q salida', v: fmt(last.qout * 1000, 2), u: 'L/s' }, { l: 'Estado', v: st, c }]);
    $('#ct-svg').innerHTML = tankCtl({ frac: h / Hm, sp, u: fmt(last.u, 0) + ' %', fa, fail, qin: last.qin * 1000 });
    const pts = k => hist.map(q => [q.t - t, q[k]]);
    p1.set([{ id: 'sp', type: 'line', label: 'Consigna', color: 'var(--gold)', dash: 'dash', width: 1.6, pts: hist.length ? hist.map(q => [q.t - t, q.sp]) : [[-WIN, sp], [0, sp]] },
      { id: 'lsh', type: 'hline', y: 90, color: 'var(--bad)', tag: 'LSH 90 %' }, { id: 'lsl', type: 'hline', y: 10, color: 'var(--bad)', tag: 'LSL 10 %' },
      { id: 'pv', type: 'line', label: 'Nivel (PV)', color: 'var(--c-rtd)', width: 2.4, pts: pts('pv') }]);
    p2.set([{ id: 'u', type: 'line', label: 'Apertura de la válvula', color: 'var(--c-tc)', width: 2.2, pts: pts('u') },
      { id: 'q', type: 'line', label: 'Demanda (% de Q máx.)', color: 'var(--c-ref)', width: 1.8, dash: 'dash', pts: pts('qo') }]);
  };
  let acc = 0;
  const tick = () => {
    if (el.hidden) return;
    for (let i = 0; i < 8; i++) { step(); acc += DT; if (acc >= 2) { acc = 0; hist.push({ t, pv: h / Hm * 100, u: last.u, qo: last.qout / QMAX * 100, sp: last.sp }); } }
    hist = hist.filter(q => q.t > t - WIN); render();
  };
  seg('#ct-m', v => { mode = v; on = h / Hm * 100 < +$('#ct-sp').value; outs(); });
  seg('#ct-fa', v => { fa = v; });
  ['#ct-sp', '#ct-kc', '#ct-u', '#ct-q'].forEach(s => $(s).addEventListener('input', outs));
  $('#ct-reset').onclick = () => { h = 0.4 * Hm; t = 0; hist = []; acc = 0; $('#ct-fail').checked = false; render(); };
  outs(); render(); setInterval(tick, 200);
};

/* ---------- comparativa ---------- */
MOUNT.compara = () => {
  const O = ['Presión diferencial', 'Ultrasónico', 'Radar', 'Capacitivo'];
  const S = [
    { q: 'Tanque de melaza a 60 °C en un ingenio, con espuma en la superficie y vapores. Se necesita medición continua sin contacto.', a: 'Radar', why: 'La espuma y los vapores atenúan y desvían el ultrasonido. El radar de 80 GHz atraviesa los vapores, no depende de la temperatura del gas y no toca la melaza viscosa.' },
    { q: 'Domo de una caldera con agua y vapor a 10 bar. Se requiere la medición para el control de nivel y las protecciones.', a: 'Presión diferencial', why: 'Es la solución clásica: transmisor de presión diferencial con pierna húmeda (columna de referencia llena de condensado) y compensación por densidad del agua saturada.' },
    { q: 'Pozo abierto de aguas residuales de 5 m de profundidad. Presupuesto bajo y sin contacto con el agua.', a: 'Ultrasónico', why: 'Tanque abierto, sin presión ni vapores densos: el ultrasonido con compensación de temperatura es económico y evita que los sólidos ensucien el sensor.' },
    { q: 'Tanque pequeño de aceite dieléctrico para transformadores, medición continua de bajo costo leída por un microcontrolador.', a: 'Capacitivo', why: 'El aceite no es conductor y tiene εr estable (≈ 2,2). Una sonda coaxial con un oscilador da una medición continua barata y sin partes móviles.' }
  ];
  $('#scen').innerHTML = S.map((s, i) => `<div class="card"><p style="margin:0">${s.q}</p><div class="opts">${O.map(o => `<button class="btn sm" data-i="${i}" data-o="${o}">${o}</button>`).join('')}</div><p class="fb" hidden></p></div>`).join('');
  $('#scen').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const s = S[+b.dataset.i], card = b.closest('.card'), fb = $('.fb', card), ok = b.dataset.o === s.a;
    fb.hidden = false; fb.className = 'fb ' + (ok ? 'ok' : 'bad'); fb.style.marginTop = '10px'; fb.textContent = (ok ? 'Correcto. ' : `Mejor opción: ${s.a}. `) + s.why; });
};

/* ====================================================================
   VI · Laboratorio virtual
   ==================================================================== */
const getId = () => store.get('id', {});
const getBench = () => { const id = getId(); return id.code ? bench(id.code) : null; };
MOUNT.labid = () => {
  const id = getId(), f = ['name', 'code', 'mates', 'group', 'date'];
  f.forEach(k => { const el = $('#id-' + k); el.value = id[k] || (k === 'date' ? new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : ''); el.addEventListener('input', () => { const o = getId(); if (k !== 'code') { o[k] = el.value; store.set('id', o); } }); });
  const show = () => { const b = getBench(), o = getId(); if (!b) return;
    $('#id-bench').className = ''; $('#id-bench').innerHTML = `<div class="row" style="margin-bottom:10px"><span class="pill ok">Banco ${b.id} asignado</span><span class="tag">código ${esc(o.code)}</span></div>
      <ul style="margin:0"><li>Tanque de 1,6 m con un producto desconocido y transmisor LT-101 de presión diferencial montado bajo la toma.</li><li>Sensor ultrasónico a 1,600 m del fondo, con calefactor y sensor de temperatura del aire.</li><li>Sonda capacitiva coaxial de 1,20 m en un producto no conductor, leída con un 555.</li></ul>`; };
  $('#id-go').onclick = () => {
    const code = $('#id-code').value.trim(); if (!code) { toast('Escribe tu código estudiantil.'); return; }
    const o = getId(); if (o.code && o.code !== code) ['lab1', 'lab2', 'lab3'].forEach(k => store.set('lab:' + k, []));
    f.forEach(k => o[k] = $('#id-' + k).value.trim()); store.set('id', o); show(); toast('Banco asignado. Ya puedes ir a la práctica 1.');
  };
  show();
};

function makeLab(o) {
  let rows = store.get('lab:' + o.key, []), until = 0, last = null;
  const el = $('#' + o.key), P = o.p, sps = o.sps.map(s => $('#' + s.id));
  o.sps.forEach(s => bindOut('#' + s.id, '#' + s.id + 'o', s.f));
  sps.forEach(e => e.addEventListener('input', () => { until = Date.now() + 1500; }));
  until = Date.now() + 700;
  const tick = () => {
    if (el.hidden) return; const b = getBench(), v = sps.map(e => +e.value);
    if (!b) { $('#' + P + '-st').textContent = 'Sin banco asignado'; o.d.forEach(d => $('#' + d).textContent = '—'); $('#' + P + '-svg').innerHTML = o.svg(null, v, null); return; }
    const frac = Math.max(0, (until - Date.now()) / 1500);
    $('#' + P + '-st').textContent = frac > 0 ? 'Estabilizando…' : 'Estable · listo para registrar';
    const vj = v.map((x, i) => x + (Math.random() - .5) * (o.jit[i] || 0) * frac);
    last = o.read(b, vj, v); o.disp(last).forEach((s, i) => $('#' + o.d[i]).textContent = s);
    $('#' + P + '-svg').innerHTML = o.svg(b, vj, last);
  };
  setInterval(tick, 420); tick();
  const render = () => {
    $('#' + P + '-tb').innerHTML = rows.length ? rows.map((r, i) => `<tr><td class="num">${i + 1}</td>${o.cells(r).map(c => `<td class="num">${c}</td>`).join('')}<td><button class="btn sm" data-del="${i}" aria-label="Borrar lectura ${i + 1}">Quitar</button></td></tr>`).join('')
      : `<tr><td colspan="${o.ncol + 2}" class="muted">Aún no hay lecturas. Necesitas al menos ${o.min}.</td></tr>`;
  };
  $('#' + P + '-tb').addEventListener('click', e => { const b = e.target.closest('[data-del]'); if (!b) return; rows.splice(+b.dataset.del, 1); store.set('lab:' + o.key, rows); render(); });
  $('#' + P + '-rec').onclick = () => {
    if (!getBench()) { toast('Primero asigna tu banco en «Ingreso al laboratorio».'); return; }
    if (Date.now() < until) { toast('Espera a que la lectura se estabilice.'); return; }
    { const b0 = getBench(), v0 = sps.map(e => +e.value); last = o.read(b0, v0, v0); o.disp(last).forEach((t, i) => $('#' + o.d[i]).textContent = t); }
    rows.push({ ...last }); rows.sort((a, b) => a.h - b.h); store.set('lab:' + o.key, rows); render();
  };
  $('#' + P + '-clr').onclick = () => { if (!rows.length) return; const b = $('#' + P + '-clr'); if (b.dataset.sure) { rows = []; store.set('lab:' + o.key, rows); render(); $('#' + P + '-res').innerHTML = ''; b.textContent = 'Borrar tabla'; delete b.dataset.sure; } else { b.dataset.sure = 1; b.textContent = '¿Seguro? Pulsa otra vez'; setTimeout(() => { b.textContent = 'Borrar tabla'; delete b.dataset.sure; }, 3000); } };
  $('#' + P + '-an').onclick = () => {
    if (rows.length < o.min) { toast(`Necesitas al menos ${o.min} lecturas; llevas ${rows.length}.`); return; }
    const msg = o.check && o.check(rows); if (msg) { toast(msg); return; }
    const A = o.analyze(rows), box = $('#' + P + '-res');
    box.innerHTML = `<h3>Resultados del análisis</h3><div class="kpis">${A.kpis.map(k => `<div class="kpi ${k.c || ''}"><small>${nc(k.l)}</small><b>${k.v}${k.u ? `<i>${k.u}</i>` : ''}</b></div>`).join('')}</div>
      <div class="tbl"><table><thead><tr>${A.head.map(h => `<th class="num">${nc(h)}</th>`).join('')}</tr></thead><tbody>${A.body.map(r => `<tr>${r.map(c => `<td class="num">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      ${A.plots.map((_, i) => `<div id="${P}-pl${i}" style="margin-top:14px"></div>`).join('')}`;
    A.plots.forEach((pc, i) => { const pl = new Plane($(`#${P}-pl${i}`), pc.o); pl.set(pc.layers); });
  };
  const ta = $('#' + P + '-txt'); ta.value = store.get('txt:' + o.key, ''); ta.addEventListener('input', () => store.set('txt:' + o.key, ta.value));
  render();
  if (rows.length >= o.min && !(o.check && o.check(rows))) $('#' + P + '-an').click();
}

/* --- análisis de cada práctica (también los usa el informe) --- */
const nearest = (list, key, v) => list.reduce((a, b) => Math.abs(b[key] - v) < Math.abs(a[key] - v) ? b : a);
function an1(rows) {
  const f = linfit(rows.map(r => r.h), rows.map(r => r.dP)), rho = f.m * 1000 / G, d = f.b * 1000 / (rho * G);
  const liq = nearest(L1_LIQ, 'rho', rho), LRV = rho * G * d / 1000, URV = rho * G * (1.5 + d) / 1000;
  const det = rows.map(r => { const sat = r.I >= 20.45, Ip = 4 + 16 * r.dP / SPAN1, hc = (r.dP - LRV) / (URV - LRV) * 1.5; return { ...r, sat, e: r.hl - r.h, eT: r.I - Ip, hc, ec: hc - r.h }; });
  const ok = det.filter(x => !x.sat), emax = Math.max(...det.map(x => Math.abs(x.e))), e0 = rho / RHO_W * d;
  const eT = ok.length ? ok.reduce((s, x) => s + x.eT, 0) / ok.length : NaN, hsat = SPAN1 * 16.5 / 16 * 1000 / (rho * G) - d, ecmax = Math.max(...det.map(x => Math.abs(x.ec)));
  return { f, rho, d, liq, LRV, URV, det, emax, e0, eT, hsat, ecmax, nsat: det.length - ok.length };
}
function an2(rows) {
  const X = rows.map(r => [r.t / 1000, r.T * r.t / 1e5, 1, r.T / 100]), y = rows.map(r => 2 * (HS2 - r.h));
  const q = lsq(X, y), c0 = q[0] * 1000, k = q[1] * 10, t0 = -q[2] / c0;
  const ym = y.reduce((s, v) => s + v, 0) / y.length; let ssr = 0, sst = 0;
  X.forEach((x, i) => { const p = x.reduce((s, v, j) => s + v * q[j], 0); ssr += (y[i] - p) ** 2; sst += (y[i] - ym) ** 2; });
  const det = rows.map(r => { const hc = HS2 - (c0 + k * r.T) * (r.t * 1e-6 - t0) / 2; return { ...r, ef: (r.hf - r.h) * 1000, hc, ec: (hc - r.h) * 1000 }; });
  const rms = key => Math.sqrt(det.reduce((s, x) => s + x[key] ** 2, 0) / det.length);
  const Ts = rows.map(r => r.T);
  return { c0, k, t0: t0 * 1e6, r2: 1 - ssr / sst, det, rmsf: rms('ef'), rmsc: rms('ec'), maxf: Math.max(...det.map(x => Math.abs(x.ef))), Tmin: Math.min(...Ts), Tmax: Math.max(...Ts) };
}
const capC = f => 1.44 / (R555 * f) * 1e12;
function an3(rows) {
  const Cs = rows.map(r => capC(r.f)), f = linfit(rows.map(r => r.h), Cs), er = 1 + f.m / K_LAB, Cp = f.b - K_LAB * LP_LAB, liq = nearest(L3_LIQ, 'er', er);
  const det = rows.map((r, i) => { const hc = (Cs[i] - f.b) / f.m; return { ...r, C: Cs[i], hc, e: (hc - r.h) * 1000 }; });
  const fz = 1.44 / (R555 * f.b * 1e-12), ff = 1.44 / (R555 * (f.b + f.m * LP_LAB) * 1e-12), sl = C => -1.44 / (R555 * Math.pow(C * 1e-12, 2)) * f.m * 1e-12;
  return { f, er, Cp, liq, det, C0: f.b, S: f.m, s0: sl(f.b), s1: sl(f.b + f.m * LP_LAB), fz, ff, emax: Math.max(...det.map(x => Math.abs(x.e))) };
}

const LAB1 = { key: 'lab1', p: 'l1', min: 8, ncol: 4, jit: [0.04], d: ['l1-d1', 'l1-d2', 'l1-d3', 'l1-d4'],
  sps: [{ id: 'l1-sp', f: v => fmt(v, 2) + ' m' }],
  read: (b, vj, v) => { const hp = clamp(vj[0], 0, 1.6), P = b.dp.rho * G * (hp + b.dp.d) / 1000, I = clamp(4 + 16 * P / SPAN1 * b.dp.g + b.dp.z + noise(.003), 3.8, 20.5);
    return { h: Math.max(0, v[0] + noise(.0005)), dP: P + noise(.004), I, hl: (I - 4) / 16 * 1.5 }; },
  disp: r => [fmt(r.h, 3) + ' m', fmt(r.dP, 3) + ' kPa', fmt(r.I, 3) + ' mA', fmt(r.hl, 3) + ' m'],
  cells: r => [fmt(r.h, 3), fmt(r.dP, 3), fmt(r.I, 3), fmt(r.hl, 3)],
  svg: (b, vj, r) => tankDP({ frac: clamp(vj[0], 0, 1.6) / 1.6, color: 'var(--c-tc)', mode: 'abierto', dpx: b ? b.dp.d / 1.6 * 206 : 20, I: r ? fmt(r.I, 2) + ' mA' : '—', label: 'producto desconocido' }),
  analyze: rows => { const a = an1(rows);
    return { kpis: [{ l: 'Densidad ρ', v: fmt(a.rho, 1), u: 'kg/m³' }, { l: 'Producto probable', v: a.liq.n }, { l: 'R² de ΔP(h)', v: fmt(a.f.r2, 6) },
        { l: 'Transmisor bajo la toma, d', v: fmt(a.d * 100, 1), u: 'cm' }, { l: 'LIC con tanque vacío', v: fmt(a.e0, 3), u: 'm', c: 'bad' }, { l: 'Error máx. del LIC', v: fmt(a.emax, 3), u: 'm', c: 'bad' },
        { l: 'Saturación desde', v: a.hsat < 1.5 ? fmt(a.hsat, 3) : 'no satura', u: a.hsat < 1.5 ? 'm' : '', c: a.hsat < 1.5 ? 'warn' : 'ok' }, { l: 'Error del transmisor', v: fmt(a.eT / 16 * 100, 2), u: '% span', c: Math.abs(a.eT / 16 * 100) <= .25 ? 'ok' : 'warn' },
        { l: 'Nuevo LRV', v: fmt(a.LRV, 3), u: 'kPa', c: 'ok' }, { l: 'Nuevo URV', v: fmt(a.URV, 3), u: 'kPa', c: 'ok' }],
      head: ['h regla (m)', 'ΔP (kPa)', 'I (mA)', 'h LIC (m)', 'Error LIC (m)', 'h recalibrado (m)', 'Error nuevo (mm)'],
      body: a.det.map(x => [fmt(x.h, 3), fmt(x.dP, 3), fmt(x.I, 3) + (x.sat ? ' sat.' : ''), fmt(x.hl, 3), fmt(x.e, 3), fmt(x.hc, 3), fmt(x.ec * 1000, 1)]),
      plots: [{ o: { xmin: -0.08, xmax: 1.62, ymin: -1, ymax: 21, xlabel: 'h (m)', ylabel: 'ΔP (kPa)', title: 'Presión diferencial frente al nivel', xd: 3, yd: 3 }, layers: [
          { id: 'w', type: 'fn', label: 'Agua sin supresión (calibración)', color: 'var(--c-ref)', dash: 'dash', width: 1.6, fn: x => RHO_W * G * x / 1000, dom: [0, 1.6] },
          { id: 'fit', type: 'fn', label: `Ajuste: ΔP = ${fmt(a.f.m, 4)}·h + ${fmt(a.f.b, 4)}`, color: 'var(--gold)', width: 2.2, fn: x => a.f.m * x + a.f.b, dom: [0, 1.6] },
          { id: 'd', type: 'scatter', label: 'Lecturas', color: 'var(--c-tc)', pts: rows.map(r => [r.h, r.dP]) }] },
        { o: { xmin: -0.08, xmax: 1.62, ymin: -0.1, ymax: 1.75, xlabel: 'h regla (m)', ylabel: 'h indicado (m)', title: 'Nivel del controlador antes y después de recalibrar', xd: 3, yd: 3, h: 300 }, layers: [
          { id: 'id', type: 'line', label: 'Ideal', color: 'var(--tick)', dash: 'dot', width: 1.6, pts: [[0, 0], [1.6, 1.6]] },
          { id: 'l', type: 'scatter', label: 'LIC calibrado para agua', color: 'var(--bad)', pts: a.det.map(x => [x.h, x.hl]) },
          { id: 'c', type: 'scatter', label: 'Con el nuevo LRV/URV', color: 'var(--c-ntc)', pts: a.det.map(x => [x.h, x.hc]) }] }] }; } };
MOUNT.lab1 = () => makeLab(LAB1);

const LAB2 = { key: 'lab2', p: 'l2', min: 8, ncol: 4, jit: [0.03, 0], d: ['l2-d1', 'l2-d2', 'l2-d3', 'l2-d4'],
  sps: [{ id: 'l2-sp', f: v => fmt(v, 2) + ' m' }, { id: 'l2-sp2', f: v => v + ' °C' }],
  read: (b, vj, v) => { const hp = vj[0], T = v[1], t = Math.round((2 * (HS2 - hp) / cs(T) * 1e6 + b.us.t0) * b.us.g + noise(1.2));
    return { h: Math.max(0, v[0] + noise(.0005)), T: T + noise(.08), t, hf: HS2 - 343 * t * 1e-6 / 2 }; },
  disp: r => [fmt(r.h, 3) + ' m', fmt(r.T, 1) + ' °C', r.t + ' µs', fmt(r.hf, 3) + ' m'],
  cells: r => [fmt(r.h, 3), fmt(r.T, 1), String(r.t), fmt(r.hf, 3)],
  svg: (b, vj, r) => tankUS({ frac: vj[0] / HS2, z: 0.25 / HS2, color: 'var(--c-rtd)', T: fmt(vj[1], 0) + ' °C', read: r ? `eco ${r.t} µs` : '' }),
  check: rows => { const Ts = rows.map(r => r.T); return Math.max(...Ts) - Math.min(...Ts) < 15 ? 'Necesitas lecturas con al menos 15 °C de diferencia en la temperatura del aire.' : (new Set(rows.map(r => Math.round(r.h * 100)))).size < 4 ? 'Toma lecturas en al menos 4 niveles distintos.' : null; },
  analyze: rows => { const a = an2(rows);
    return { kpis: [{ l: 'c₀ ajustada', v: fmt(a.c0, 2), u: 'm/s', c: Math.abs(a.c0 - 331.3) < 2 ? 'ok' : 'warn' }, { l: 'k ajustada', v: fmt(a.k, 3), u: 'm/s/°C', c: a.k > .5 && a.k < .66 ? 'ok' : 'warn' }, { l: 'Retardo t₀', v: fmt(a.t0, 1), u: 'µs' },
        { l: 'c a 20 °C', v: fmt(a.c0 + 20 * a.k, 2), u: 'm/s' }, { l: 'R² del modelo', v: fmt(a.r2, 7) }, { l: 'Rango de T', v: `${fmt(a.Tmin, 0)}–${fmt(a.Tmax, 0)}`, u: '°C' },
        { l: 'RMS firmware de fábrica', v: fmt(a.rmsf, 1), u: 'mm', c: 'bad' }, { l: 'RMS firmware compensado', v: fmt(a.rmsc, 1), u: 'mm', c: a.rmsc < 2 ? 'ok' : 'warn' }],
      head: ['h regla (m)', 'T aire (°C)', 't eco (µs)', 'h fábrica (m)', 'Error fábrica (mm)', 'h compensado (m)', 'Error comp. (mm)'],
      body: a.det.map(x => [fmt(x.h, 3), fmt(x.T, 1), String(x.t), fmt(x.hf, 3), fmt(x.ef, 1), fmt(x.hc, 3), fmt(x.ec, 1)]),
      plots: [{ o: { xmin: 10, xmax: 65, ymin: Math.min(-5, ...a.det.map(x => x.ef)) - 5, ymax: Math.max(5, ...a.det.map(x => x.ef)) + 8, xlabel: 'T aire (°C)', ylabel: 'Error (mm)', title: 'Error del nivel frente a la temperatura del aire', xd: 1, yd: 1 }, layers: [
          { id: 'f', type: 'scatter', label: 'Firmware de fábrica (343 m/s)', color: 'var(--c-tc)', pts: a.det.map(x => [x.T, x.ef]) },
          { id: 'c', type: 'scatter', label: 'Compensado con c₀ + k·T y t₀ ajustados', color: 'var(--c-ntc)', pts: a.det.map(x => [x.T, x.ec]) }] },
        { o: { xmin: 0, xmax: 10, ymin: 0, ymax: 3.4, xlabel: 't (ms)', ylabel: '2(Hₛ − h) (m)', title: 'Recorrido del eco frente al tiempo', xd: 3, yd: 3, h: 300 }, layers: [
          { id: 'lo', type: 'fn', label: `Modelo a ${fmt(a.Tmin, 0)} °C`, color: 'var(--c-rtd)', width: 2, fn: x => (a.c0 + a.k * a.Tmin) * (x / 1000 - a.t0 * 1e-6), dom: [0, 10] },
          { id: 'hi', type: 'fn', label: `Modelo a ${fmt(a.Tmax, 0)} °C`, color: 'var(--c-tc)', width: 2, fn: x => (a.c0 + a.k * a.Tmax) * (x / 1000 - a.t0 * 1e-6), dom: [0, 10] },
          { id: 'd', type: 'scatter', label: 'Lecturas', color: 'var(--gold)', pts: rows.map(r => [r.t / 1000, 2 * (HS2 - r.h)]) }] }] }; } };
MOUNT.lab2 = () => makeLab(LAB2);

const LAB3 = { key: 'lab3', p: 'l3', min: 7, ncol: 3, jit: [0.03], d: ['l3-d1', 'l3-d2', 'l3-d3'],
  sps: [{ id: 'l3-sp', f: v => fmt(v, 2) + ' m' }],
  read: (b, vj, v) => { const hp = clamp(vj[0], 0, LP_LAB), C = b.cap.Cp + K_LAB * (b.cap.er * hp + (LP_LAB - hp)), f = b.cap.k / (R555 * C * 1e-12) * (1 + noise(.0003));
    return { h: Math.max(0, v[0] + noise(.0005)), f, P: 1e6 / f }; },
  disp: r => [fmt(r.h, 3) + ' m', fmt(r.f / 1000, 3) + ' kHz', fmt(r.P, 3) + ' µs'],
  cells: r => [fmt(r.h, 3), fmt(r.f / 1000, 3), fmt(capC(r.f), 2)],
  svg: (b, vj, r) => tankCap({ frac: clamp(vj[0], 0, LP_LAB) / LP_LAB * 0.96, color: 'var(--c-tc)', read: r ? `f = ${fmt(r.f / 1000, 3)} kHz` : '' }),
  analyze: rows => { const a = an3(rows);
    return { kpis: [{ l: 'Permitividad εr', v: fmt(a.er, 3) }, { l: 'Producto probable', v: a.liq.n }, { l: 'R² de C(h)', v: fmt(a.f.r2, 6) },
        { l: 'C vacío', v: fmt(a.C0, 2), u: 'pF' }, { l: 'Capacitancia parásita', v: fmt(a.Cp, 2), u: 'pF' }, { l: 'Parásita / C vacío', v: fmt(a.Cp / a.C0 * 100, 1), u: '%' },
        { l: 'Sensibilidad', v: fmt(a.S, 2), u: 'pF/m' }, { l: 'Sensibilidad vacío', v: fmt(a.s0, 0), u: 'Hz/m' }, { l: 'Sensibilidad lleno', v: fmt(a.s1, 0), u: 'Hz/m' }, { l: 'Error máx. de nivel', v: fmt(a.emax, 1), u: 'mm', c: a.emax < 5 ? 'ok' : 'warn' }],
      head: ['h regla (m)', 'f (kHz)', 'C (pF)', 'h calculado (m)', 'Error (mm)'],
      body: a.det.map(x => [fmt(x.h, 3), fmt(x.f / 1000, 3), fmt(x.C, 2), fmt(x.hc, 3), fmt(x.e, 1)]),
      plots: [{ o: { xmin: -0.06, xmax: 1.3, ymin: 0, ymax: (a.C0 + a.S * 1.2) * 1.15, xlabel: 'h (m)', ylabel: 'C (pF)', title: 'Capacitancia de la sonda frente al nivel', xd: 3, yd: 2 }, layers: [
          { id: 'fit', type: 'fn', label: `Ajuste: C = ${fmt(a.C0, 2)} + ${fmt(a.S, 2)}·h`, color: 'var(--gold)', width: 2.2, fn: x => a.f.b + a.f.m * x, dom: [0, 1.2] },
          { id: 'd', type: 'scatter', label: 'Lecturas', color: 'var(--c-ntc)', pts: a.det.map(x => [x.h, x.C]) }] },
        { o: { xmin: -0.06, xmax: 1.3, ymin: 0, ymax: a.fz / 1000 * 1.15, xlabel: 'h (m)', ylabel: 'f (kHz)', title: 'Frecuencia del 555 frente al nivel', xd: 3, yd: 3, h: 300 }, layers: [
          { id: 'm', type: 'fn', label: 'Modelo 1,44/((R₁+2R₂)C)', color: 'var(--c-tc)', width: 2.2, fn: x => 1.44 / (R555 * (a.f.b + a.f.m * x) * 1e-12) / 1000, dom: [0, 1.2] },
          { id: 'd', type: 'scatter', label: 'Lecturas', color: 'var(--c-rtd)', pts: rows.map(r => [r.h, r.f / 1000]) }] }] }; } };
MOUNT.lab3 = () => makeLab(LAB3);

/* ====================================================================
   VII · Ejercicios
   ==================================================================== */
const ANS = (() => {
  const t8 = 2 * 2 / (331.3 + 0.606 * 40), e8 = ((3 - 343 * t8 / 2) - 1) * 1000;
  return { e1: [998 * 9.81 * 3.2 / 1000, 2], e2: [18000 / (850 * 9.81), 3], e3: [4 + 16 * 3.1 / 5, 2], e4: [998 * 9.81 * 4.8 / 1000, 2], e5: [-998 * 9.81 * 5 / 1000, 2], e6: [2 * 1150 / 998, 3],
    e7: [(331.3 + 0.606 * 25) * 0.008 / 2, 4], e8: [e8, 1], e9: [2 * Math.PI * 8.854 / Math.log(25 / 8), 2], e10: [30 + 46 * 1.5 + 46 * 1.2 * 0.9, 2], e11: [1.44 / (210e3 * 150e-12) / 1000, 2], e12: [5 * (Math.acos(0.5) - 0.5 * Math.sqrt(0.75)), 3] };
})();
const EX_KEYS = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12'];
const EX_TEMA = ['Hidrostática', 'Hidrostática', 'Lazo 4–20 mA', 'Supresión de cero', 'Pierna húmeda', 'Densidad', 'Tiempo de vuelo', 'Temperatura', 'Capacitivo', 'Capacitivo', 'Oscilador 555', 'Aforo'];
MOUNT.ejer = el => {
  $$('.ans', el).forEach(s => { const a = ANS[s.dataset.k]; s.textContent = fmt(a[0], a[1]); });
  let st = store.get('ex', {});
  const score = () => { const n = EX_KEYS.filter(k => st[k] && st[k].ok).length; $('#ex-score').textContent = `${n} / ${EX_KEYS.length} correctos`; $('#ex-score').className = 'pill' + (n === EX_KEYS.length ? ' ok' : ''); };
  const paint = (box, k) => { const s = st[k], fb = $('.fb', box); box.classList.remove('ok', 'bad'); fb.className = 'fb'; fb.textContent = '';
    if (!s) return; box.classList.add(s.ok ? 'ok' : 'bad'); fb.classList.add(s.ok ? 'ok' : 'bad'); fb.textContent = s.ok ? 'Correcto' : 'Revisa tu cálculo'; };
  $$('.ex', el).forEach(box => {
    const k = box.dataset.k, tol = +box.dataset.tol, inp = $('input', box);
    if (st[k]) inp.value = st[k].v;
    const check = () => { const v = num(inp.value); if (!isFinite(v)) { toast('Escribe un número.'); return; } st[k] = { v: inp.value, ok: Math.abs(v - ANS[k][0]) <= tol }; store.set('ex', st); paint(box, k); score(); };
    $('button', box).onclick = check; inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    paint(box, k);
  });
  $('#ex-reset').onclick = () => { st = {}; store.set('ex', st); $$('.ex', el).forEach(b => { $('input', b).value = ''; paint(b, b.dataset.k); }); score(); };
  score();
};

/* ====================================================================
   VIII · Generador del informe
   ==================================================================== */
const OBJ = 'Caracterizar experimentalmente tres métodos de medición continua de nivel (presión diferencial, tiempo de vuelo ultrasónico y sonda capacitiva), determinar la densidad y la permitividad del producto, cuantificar el efecto de la temperatura del aire y recalibrar el transmisor de presión diferencial para el producto real.';
const PROC = ['Práctica 1: el tanque se llenó por etapas entre 0 y 1,50 m con un producto desconocido; se registraron el nivel en la regla, la presión diferencial del manómetro digital y la corriente del transmisor LT-101, calibrado para agua de 0 a 1,50 m e instalado bajo la toma del fondo.',
  'Práctica 2: el sensor ultrasónico, a 1,600 m del fondo, midió el tiempo de eco a distintos niveles y temperaturas del aire fijadas con un calefactor; la temperatura se midió con un sensor dentro del tanque.',
  'Práctica 3: una sonda capacitiva coaxial de 1,20 m (tubo de 20 mm, varilla de 6 mm) conectada a un 555 astable con R1 = 10 kΩ y R2 = 100 kΩ se sumergió a distintos niveles en un producto no conductor; la frecuencia se midió con un frecuencímetro.'];
const REFS = ['ANSI/ISA-5.1-2009. Instrumentation Symbols and Identification. International Society of Automation.', 'NAMUR NE 43. Standardization of the signal level for the failure information of digital transmitters.',
  'Creus Solé, A. (2010). Instrumentación industrial (8.ª ed.). Marcombo.', 'Bentley, J. P. (2005). Principles of Measurement Systems (4.ª ed.). Pearson.',
  'Lipták, B. G. (Ed.) (2003). Instrument Engineers\' Handbook, Vol. 1: Process Measurement and Analysis (4.ª ed.). CRC Press.', 'Pallás Areny, R. (2003). Sensores y acondicionadores de señal (4.ª ed.). Marcombo.',
  'Texas Instruments. NE555, SA555, SE555 Precision Timers. Hoja de datos.'];
function reportData() {
  const id = getId(), b = getBench(), L = k => store.get('lab:' + k, []);
  const r1 = L('lab1'), r2 = L('lab2'), r3 = L('lab3'), ex = store.get('ex', {});
  return { id, b, r1, r2, r3, a1: r1.length >= LAB1.min ? an1(r1) : null, a2: r2.length >= LAB2.min && !LAB2.check(r2) ? an2(r2) : null, a3: r3.length >= LAB3.min ? an3(r3) : null,
    t1: store.get('txt:lab1', ''), t2: store.get('txt:lab2', ''), t3: store.get('txt:lab3', ''), res: store.get('txt:res', ''), con: store.get('txt:con', ''),
    ex, nex: EX_KEYS.filter(k => ex[k] && ex[k].ok).length };
}
const S1 = (a, F) => `Ajuste lineal: ΔP = ${F(a.f.m, 4)} kPa/m · h + ${F(a.f.b, 4)} kPa (R² = ${F(a.f.r2, 6)}). Densidad del producto: ${F(a.rho, 1)} kg/m³, compatible con ${a.liq.n.toLowerCase()}. El transmisor está ${F(a.d * 100, 1)} cm bajo la toma, por lo que el controlador indica ${F(a.e0, 3)} m con el tanque vacío. Error máximo del nivel indicado: ${F(a.emax, 3)} m${a.nsat ? `; ${a.nsat} lecturas con el transmisor saturado (saturación desde ${F(a.hsat, 3)} m)` : ''}. Calibración corregida: LRV = ${F(a.LRV, 3)} kPa y URV = ${F(a.URV, 3)} kPa; con ella el error máximo baja a ${F(a.ecmax * 1000, 1)} mm.`;
const S2 = (a, F) => `Modelo ajustado: 2(Hs − h) = (c0 + k·T)(t − t0) con c0 = ${F(a.c0, 2)} m/s, k = ${F(a.k, 3)} m/s/°C y t0 = ${F(a.t0, 1)} µs (R² = ${F(a.r2, 7)}), entre ${F(a.Tmin, 0)} y ${F(a.Tmax, 0)} °C. Error RMS del firmware de fábrica (343 m/s fijos, sin corregir t0): ${F(a.rmsf, 1)} mm; error RMS con el modelo ajustado (c0 + k·T y t0): ${F(a.rmsc, 1)} mm.`;
const S3 = (a, F) => `Ajuste lineal: C = ${F(a.C0, 2)} pF + ${F(a.S, 2)} pF/m · h (R² = ${F(a.f.r2, 6)}). Permitividad relativa del producto: εr = ${F(a.er, 3)}, compatible con ${a.liq.n.toLowerCase()}. Capacitancia parásita: ${F(a.Cp, 2)} pF (${F(a.Cp / a.C0 * 100, 1)} % de la capacitancia en vacío). Sensibilidad en frecuencia: ${F(a.s0, 0)} Hz/m con el tanque vacío y ${F(a.s1, 0)} Hz/m lleno. Error máximo del nivel calculado: ${F(a.emax, 1)} mm.`;
function buildReport() {
  const D = reportData(), ph = s => `<span class="pm">[${s}]</span>`, para = (t, p) => t.trim() ? t.trim().split(/\n+/).map(x => `<p>${esc(x)}</p>`).join('') : `<p>${ph(p)}</p>`;
  const tbl = (head, rows) => `<div class="tbl"><table><thead><tr>${head.map(h => `<th class="num">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td class="num">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const T = [], line = s => T.push(s), ttab = (head, rows) => { line(head.join('\t')); rows.forEach(r => line(r.join('\t'))); line(''); };
  const id = D.id, title = 'Informe de laboratorio: medición de nivel por presión diferencial, ultrasonido y capacitancia';
  let h = `<div class="cover"><p class="pm" style="margin:0 0 6px;max-width:none">Universidad del Valle · Sede Cartago · Tecnología en Electrónica</p><h1>${title}</h1><p class="pm" style="margin:6px 0 0;max-width:none">Instrumentación Industrial · Docente: Dra. María Elena Leyes</p>
    <div class="meta"><div><b>Estudiante:</b> ${esc(id.name) || ph('nombre')}</div><div><b>Código:</b> ${esc(id.code) || ph('código')}</div><div><b>Compañeros:</b> ${esc(id.mates) || '—'}</div><div><b>Grupo:</b> ${esc(id.group) || ph('grupo')}</div><div><b>Fecha:</b> ${esc(id.date) || ph('fecha')}</div><div><b>Banco:</b> ${D.b ? D.b.id : ph('sin asignar')}</div></div></div>`;
  line('UNIVERSIDAD DEL VALLE · SEDE CARTAGO · TECNOLOGÍA EN ELECTRÓNICA'); line(title.toUpperCase()); line('Instrumentación Industrial · Docente: Dra. María Elena Leyes');
  line(`Estudiante: ${id.name || ''}\tCódigo: ${id.code || ''}\tGrupo: ${id.group || ''}`); line(`Compañeros: ${id.mates || '—'}\tFecha: ${id.date || ''}\tBanco: ${D.b ? D.b.id : ''}`); line('');
  h += `<h2>1. Resumen</h2>${para(D.res, 'Escribe el resumen en el generador')}`; line('1. RESUMEN'); line(D.res || '[Escribe el resumen]'); line('');
  h += `<h2>2. Objetivos</h2><p>${OBJ}</p>`; line('2. OBJETIVOS'); line(OBJ); line('');
  h += `<h2>3. Marco teórico</h2><p>${ph('Presenta el principio hidrostático con la supresión y elevación de cero, el tiempo de vuelo con la velocidad del sonido en función de la temperatura, el condensador coaxial y el oscilador 555, citando las referencias')}</p>`; line('3. MARCO TEÓRICO'); line('[Principio hidrostático, tiempo de vuelo, condensador coaxial y oscilador 555, con citas]'); line('');
  h += `<h2>4. Montaje y procedimiento</h2>${PROC.map(p => `<p>${p}</p>`).join('')}<p>${ph('Inserta el P&ID del montaje con simbología ISA-5.1')}</p>`; line('4. MONTAJE Y PROCEDIMIENTO'); PROC.forEach(line); line('');
  h += `<h2>5. Resultados</h2>`; line('5. RESULTADOS');
  const sec = (tt, rows, hd, rw, a, S, min) => { h += `<h3>${tt}</h3>`; line(tt); if (rows.length) { h += tbl(hd, rw); ttab(hd, rw); } if (a) { const s = S(a, fmtc); h += `<p>${s}</p>`; line(s); } else { h += `<p>${ph(min)}</p>`; line('[' + min + ']'); } line(''); };
  sec('5.1 Medición hidrostática', D.r1, ['h (m)', 'ΔP (kPa)', 'I (mA)', 'h LIC (m)'], D.r1.map(r => [fmtc(r.h, 3), fmtc(r.dP, 3), fmtc(r.I, 3), fmtc(r.hl, 3)]), D.a1, S1, 'Faltan lecturas: se requieren al menos 8');
  sec('5.2 Sensor ultrasónico', D.r2, ['h (m)', 'T aire (°C)', 't eco (µs)', 'h fábrica (m)'], D.r2.map(r => [fmtc(r.h, 3), fmtc(r.T, 1), r.t, fmtc(r.hf, 3)]), D.a2, S2, 'Faltan lecturas: se requieren al menos 8 con 15 °C de diferencia');
  sec('5.3 Sonda capacitiva', D.r3, ['h (m)', 'f (kHz)', 'C (pF)'], D.r3.map(r => [fmtc(r.h, 3), fmtc(r.f / 1000, 3), fmtc(capC(r.f), 2)]), D.a3, S3, 'Faltan lecturas: se requieren al menos 7');
  h += `<p>${ph('El PDF incluye las gráficas de cada práctica con ejes rotulados y numeración de figuras')}</p>`;
  h += `<h2>6. Análisis de resultados</h2><h3>6.1 Medición hidrostática</h3>${para(D.t1, 'Escribe el análisis en la página de la práctica 1')}<h3>6.2 Sensor ultrasónico</h3>${para(D.t2, 'Escribe el análisis en la página de la práctica 2')}<h3>6.3 Sonda capacitiva</h3>${para(D.t3, 'Escribe el análisis en la página de la práctica 3')}`;
  line('6. ANÁLISIS DE RESULTADOS'); line('6.1 Medición hidrostática'); line(D.t1 || '[Análisis práctica 1]'); line('6.2 Sensor ultrasónico'); line(D.t2 || '[Análisis práctica 2]'); line('6.3 Sonda capacitiva'); line(D.t3 || '[Análisis práctica 3]'); line('');
  const exr = EX_KEYS.map((k, i) => [String(i + 1), EX_TEMA[i], D.ex[k] ? esc(D.ex[k].v) : '—', D.ex[k] ? (D.ex[k].ok ? 'Correcto' : 'Incorrecto') : 'Sin responder']);
  h += `<h2>7. Ejercicios</h2><p>Puntaje: <b>${D.nex} de ${EX_KEYS.length}</b> ejercicios correctos.</p>${tbl(['Ejercicio', 'Tema', 'Respuesta', 'Estado'], exr)}`;
  line('7. EJERCICIOS'); line(`Puntaje: ${D.nex} de ${EX_KEYS.length} correctos`); ttab(['Ejercicio', 'Tema', 'Respuesta', 'Estado'], exr);
  h += `<h2>8. Conclusiones</h2>${para(D.con, 'Escribe las conclusiones en el generador')}`; line('8. CONCLUSIONES'); line(D.con || '[Conclusiones]'); line('');
  h += `<h2>9. Referencias</h2><ol>${REFS.map(r => `<li>${esc(r)}</li>`).join('')}</ol>`; line('9. REFERENCIAS'); REFS.forEach((r, i) => line(`[${i + 1}] ${r}`));
  $('#paper').innerHTML = h;
  return T.join('\n');
}
function buildCSV() {
  const D = reportData(), o = [];
  o.push('Practica 1 - Hidrostatico'); o.push('h_m;dP_kPa;I_mA;h_LIC_m'); D.r1.forEach(r => o.push([fmtc(r.h, 3), fmtc(r.dP, 3), fmtc(r.I, 3), fmtc(r.hl, 3)].join(';'))); o.push('');
  o.push('Practica 2 - Ultrasonico'); o.push('h_m;T_aire_C;t_eco_us;h_firmware_m'); D.r2.forEach(r => o.push([fmtc(r.h, 3), fmtc(r.T, 1), r.t, fmtc(r.hf, 3)].join(';'))); o.push('');
  o.push('Practica 3 - Capacitivo'); o.push('h_m;f_Hz;C_pF'); D.r3.forEach(r => o.push([fmtc(r.h, 3), fmtc(r.f, 1), fmtc(capC(r.f), 2)].join(';')));
  return o.join('\n');
}
MOUNT.informe = () => {
  [['#inf-res', 'txt:res'], ['#inf-con', 'txt:con']].forEach(([s, k]) => { const t = $(s); t.value = store.get(k, ''); t.addEventListener('input', () => store.set(k, t.value)); });
  DL_PROMISE = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null);
  $('#inf-pdf').onclick = e => savePDF(e.currentTarget);
  let txt = buildReport();
  $('#inf-gen').onclick = () => { txt = buildReport(); toast('Borrador actualizado.'); };
  $('#inf-copy').onclick = () => { txt = buildReport(); copyText(txt, 'Informe copiado. Pégalo en tu procesador de texto.'); };
  $('#inf-csv').onclick = () => copyText(buildCSV(), 'Datos copiados en formato CSV con separador «;».');
};


/* ====================================================================
   Informe en PDF (jsPDF + AutoTable)
   ==================================================================== */
const PDFMAP = [[/Ω/g, 'ohm'], [/α/g, 'alfa'], [/β/g, 'beta'], [/τ/g, 'tau'], [/δ/g, 'delta'], [/₂₅/g, '25'], [/₀/g, '0'], [/₂/g, '2'], [/ₕ/g, 'h'],
  [/⁻¹/g, '^-1'], [/⁻³/g, '^-3'], [/⁻⁷/g, '^-7'], [/⁻/g, '-'], [/≈/g, '~'], [/²/g, '^2'], [/³/g, '^3'], [/µ/g, 'u'], [/≤/g, '<='], [/≥/g, '>='], [/→/g, '->'], [/−/g, '-'], [/[^\x00-\xff–—‘’“”•…]/g, '']];
const pdfTxt = s => PDFMAP.reduce((t, [r, v]) => t.replace(r, v), String(s ?? ''));
function chartImage(pc) {
  const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-12000px;top:0;width:900px'; document.body.appendChild(host);
  const pl = new Plane(host, { ...pc.o, fixed: true, h: 430, scale: 2 }); pl.resize(); pl.set(pc.layers);
  const url = pl.cv.toDataURL('image/png'), ratio = pl.H / pl.W; pl.ro.disconnect(); LIVE.delete(pl); host.remove(); return { url, ratio };
}

PDFMAP.unshift([/ρ/g, 'rho'], [/Δ/g, 'Delta '], [/ε/g, 'eps'], [/₁/g, '1'], [/ₛ/g, 's'], [/₃/g, '3'], [/ₚ/g, 'p']);
function buildPDF() {
  const { jsPDF } = window.jspdf, doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const D = reportData(), id = D.id, PW = 215.9, PH = 279.4, M = 20, CW = PW - 2 * M, RED = [181, 18, 27], INK = [29, 26, 31], MUTE = [94, 90, 99];
  let y = 22, fig = 0, tab = 0;
  const need = h => { if (y + h > PH - 20) { doc.addPage(); y = 24; } };
  const H2 = t => { need(16); y += 3; doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); doc.setTextColor(...RED); doc.text(pdfTxt(t), M, y); y += 2; doc.setDrawColor(...RED); doc.setLineWidth(.4); doc.line(M, y, PW - M, y); y += 6.5; };
  const H3 = t => { need(32); doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(...INK); doc.text(pdfTxt(t), M, y); y += 5.5; };
  const P = (t, it = false, color = INK) => { doc.setFont('helvetica', it ? 'italic' : 'normal'); doc.setFontSize(10); doc.setTextColor(...color);
    String(t).split(/\n+/).filter(x => x.trim()).forEach(par => { doc.splitTextToSize(pdfTxt(par.trim()), CW).forEach(l => { need(5); doc.text(l, M, y); y += 4.8; }); y += 1.8; }); };
  const PH_ = t => P('[' + t + ']', true, MUTE);
  const TXT = (t, p) => t && t.trim() ? P(t) : PH_(p);
  const T = (cap, head, body) => { tab++; need(20); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...MUTE); doc.text(pdfTxt(`Tabla ${tab}. ${cap}`), M, y); y += 2;
    doc.autoTable({ startY: y, head: [head.map(pdfTxt)], body: body.map(r => r.map(c => pdfTxt(c))), margin: { left: M, right: M, top: 24, bottom: 22 }, theme: 'grid',
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 1.6, halign: 'right', lineColor: [221, 214, 216], lineWidth: .2, textColor: INK },
      headStyles: { fillColor: RED, textColor: 255, fontStyle: 'bold', halign: 'center' }, alternateRowStyles: { fillColor: [250, 245, 246] } });
    y = doc.lastAutoTable.finalY + 7; };
  const F = (pc, cap) => { const im = chartImage(pc), h = CW * im.ratio; fig++; need(h + 12); doc.addImage(im.url, 'PNG', M, y, CW, h); doc.setDrawColor(221, 214, 216); doc.setLineWidth(.2); doc.rect(M, y, CW, h); y += h + 4.5;
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(...MUTE); doc.splitTextToSize(pdfTxt(`Figura ${fig}. ${cap}`), CW).forEach(l => { doc.text(l, M, y); y += 4.3; }); y += 4; };

  // Portada
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...RED); doc.text('INFORME DE LABORATORIO', M, y); y += 7;
  doc.setFontSize(17); doc.setTextColor(...INK); doc.splitTextToSize(pdfTxt('Medición de nivel por presión diferencial, ultrasonido y capacitancia'), CW).forEach(l => { doc.text(l, M, y); y += 7.4; });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(...MUTE); doc.text(pdfTxt('Instrumentación Industrial · Tecnología en Electrónica · Universidad del Valle, sede Cartago'), M, y); y += 5;
  doc.autoTable({ startY: y, theme: 'plain', margin: { left: M, right: M }, styles: { font: 'helvetica', fontSize: 10, cellPadding: { top: 1.4, bottom: 1.4, left: 0, right: 2 }, textColor: INK },
    columnStyles: { 0: { fontStyle: 'bold', textColor: RED, cellWidth: 34 } },
    body: [['Estudiante', id.name || '—'], ['Código', id.code || '—'], ['Compañeros', id.mates || '—'], ['Grupo', id.group || '—'], ['Fecha', id.date || '—'], ['Banco', D.b ? D.b.id : '—'], ['Docente', 'Dra. María Elena Leyes']].map(r => r.map(pdfTxt)) });
  y = doc.lastAutoTable.finalY + 4; doc.setDrawColor(...RED); doc.setLineWidth(.8); doc.line(M, y, PW - M, y); y += 8;

  H2('1. Resumen'); TXT(D.res, 'Escribe el resumen en el generador del informe');
  H2('2. Objetivos'); P(OBJ);
  H2('3. Marco teórico'); PH_('Presenta el principio hidrostático con la supresión y elevación de cero, el tiempo de vuelo con la velocidad del sonido en función de la temperatura, el condensador coaxial y el oscilador 555, con citas');
  H2('4. Montaje y procedimiento'); PROC.forEach(p => P(p)); PH_('Inserta el P&ID del montaje con simbología ISA-5.1');

  H2('5. Resultados');
  H3('5.1 Medición hidrostática');
  if (D.r1.length) T('Lecturas del tanque con el transmisor de presión diferencial.', ['h regla (m)', 'ΔP (kPa)', 'I (mA)', 'h LIC (m)'], D.r1.map(r => [fmt(r.h, 3), fmt(r.dP, 3), fmt(r.I, 3), fmt(r.hl, 3)]));
  if (D.a1) { const a = D.a1, pl = LAB1.analyze(D.r1).plots; P(S1(a, fmt));
    T('Error del nivel indicado antes y después de recalibrar el transmisor.', ['h regla (m)', 'h LIC (m)', 'Error LIC (m)', 'h recalibrado (m)', 'Error nuevo (mm)'], a.det.map(x => [fmt(x.h, 3), fmt(x.hl, 3), fmt(x.e, 3), fmt(x.hc, 3), fmt(x.ec * 1000, 1)]));
    F(pl[0], 'Presión diferencial frente al nivel: lecturas, recta de ajuste y recta de calibración para agua sin supresión de cero.');
    F(pl[1], 'Nivel indicado por el controlador frente al nivel de la regla, con la calibración original y con el nuevo LRV/URV.');
  } else PH_('Faltan lecturas de la práctica 1: se requieren al menos 8');
  H3('5.2 Sensor ultrasónico');
  if (D.r2.length) T('Lecturas del sensor ultrasónico.', ['h regla (m)', 'T aire (°C)', 't eco (µs)', 'h fábrica (m)'], D.r2.map(r => [fmt(r.h, 3), fmt(r.T, 1), String(r.t), fmt(r.hf, 3)]));
  if (D.a2) { const a = D.a2, pl = LAB2.analyze(D.r2).plots; P(S2(a, fmt));
    T('Error del nivel con el firmware de fábrica y con el compensado.', ['h regla (m)', 'T aire (°C)', 'Error fábrica (mm)', 'h comp. (m)', 'Error comp. (mm)'], a.det.map(x => [fmt(x.h, 3), fmt(x.T, 1), fmt(x.ef, 1), fmt(x.hc, 3), fmt(x.ec, 1)]));
    F(pl[0], 'Error del nivel frente a la temperatura del aire con el firmware de fábrica y con el compensado.');
    F(pl[1], 'Recorrido del eco frente al tiempo con el modelo ajustado a la menor y a la mayor temperatura.');
  } else PH_('Faltan lecturas de la práctica 2: se requieren al menos 8 con 15 °C de diferencia');
  H3('5.3 Sonda capacitiva');
  if (D.r3.length) T('Lecturas de la sonda capacitiva.', ['h regla (m)', 'f (kHz)', 'C (pF)'], D.r3.map(r => [fmt(r.h, 3), fmt(r.f / 1000, 3), fmt(capC(r.f), 2)]));
  if (D.a3) { const a = D.a3, pl = LAB3.analyze(D.r3).plots; P(S3(a, fmt));
    F(pl[0], 'Capacitancia de la sonda frente al nivel con la recta de ajuste.');
    F(pl[1], 'Frecuencia del oscilador 555 frente al nivel: la relación no es lineal.');
  } else PH_('Faltan lecturas de la práctica 3: se requieren al menos 7');

  H2('6. Análisis de resultados');
  H3('6.1 Medición hidrostática'); TXT(D.t1, 'Escribe el análisis en la página de la práctica 1');
  H3('6.2 Sensor ultrasónico'); TXT(D.t2, 'Escribe el análisis en la página de la práctica 2');
  H3('6.3 Sonda capacitiva'); TXT(D.t3, 'Escribe el análisis en la página de la práctica 3');
  H2('7. Ejercicios'); P(`Puntaje: ${D.nex} de ${EX_KEYS.length} ejercicios correctos.`);
  T('Respuestas a los ejercicios de verificación.', ['Ejercicio', 'Tema', 'Respuesta', 'Estado'], EX_KEYS.map((k, i) => [String(i + 1), EX_TEMA[i], D.ex[k] ? D.ex[k].v : '—', D.ex[k] ? (D.ex[k].ok ? 'Correcto' : 'Incorrecto') : 'Sin responder']));
  H2('8. Conclusiones'); TXT(D.con, 'Escribe las conclusiones en el generador del informe');
  H2('9. Referencias'); REFS.forEach((r, i) => P(`[${i + 1}] ${r}`));

  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i); doc.setFillColor(...RED); doc.rect(0, 0, PW, 12, 'F');
    doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.text('UNIVERSIDAD DEL VALLE · SEDE CARTAGO', M, 7.6);
    doc.setFont('helvetica', 'normal'); doc.text(pdfTxt('Instrumentación Industrial · Tecnología en Electrónica'), PW - M, 7.6, { align: 'right' });
    doc.setDrawColor(221, 214, 216); doc.setLineWidth(.3); doc.line(M, PH - 13, PW - M, PH - 13);
    doc.setFontSize(8); doc.setTextColor(...MUTE); doc.text(pdfTxt(`Informe de laboratorio · ${id.name || 'Estudiante'} · ${id.code || ''}`), M, PH - 8.5);
    doc.text(`Página ${i} de ${n}`, PW - M, PH - 8.5, { align: 'right' });
  }
  return doc;
}


let DL_PROMISE = null;
async function savePDF(btn) {
  if (!(window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API.autoTable)) { toast('El generador de PDF aún está cargando. Intenta de nuevo en unos segundos.'); return; }
  btn.disabled = true; const label = btn.textContent; btn.textContent = 'Generando PDF…';
  try {
    await new Promise(r => setTimeout(r, 30));
    const id = getId(), doc = buildPDF(), blob = doc.output('blob');
    const fn = `Informe_Nivel_${String(id.code || 'estudiante').replace(/[^\w-]/g, '')}.pdf`;
    const dl = await (DL_PROMISE || Promise.resolve(null));
    if (dl) {
      try { await dl.save({ filename: fn, data: blob }); toast('Informe guardado en PDF.'); }
      catch (e) { toast(e && e.code === 'declined' ? 'Descarga cancelada.' : e && e.code === 'rate_limited' ? 'Ya hay una descarga pendiente; espera un momento.' : 'No fue posible guardar el PDF en esta vista.'); }
    } else {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000); toast('Informe descargado en PDF.');
    }
  } catch (err) { console.error(err); toast('No se pudo generar el PDF.'); }
  finally { btn.disabled = false; btn.textContent = label; }
}

/* ====================================================================
   Arranque
   ==================================================================== */
buildToc(); initTheme();
$('#prevBtn').onclick = () => goToPage(cur - 1); $('#nextBtn').onclick = () => goToPage(cur + 1);
$('#pager').addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) goToPage(+b.dataset.go); });
$('#menuBtn').onclick = openDrawer; $('#scrim').onclick = closeDrawer;
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
  if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
  if (e.key === 'ArrowRight' && !e.altKey) goToPage(cur + 1); if (e.key === 'ArrowLeft' && !e.altKey) goToPage(cur - 1);
});
(function start() {
  const h = (location.hash || '').slice(1), k = BOOK_DATA.findIndex(p => p.id === h);
  goToPage(k >= 0 ? k : clamp(store.get('page', 0), 0, BOOK_DATA.length - 1), k < 0);
})();
