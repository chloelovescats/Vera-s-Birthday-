/* =====================================================================
   art.jsx — the visual language of the garden
   Watercolour hydrangeas (pure CSS florets), beaded motif, and the
   focal line-art figures. Exported to window for the scene + app files.
   ===================================================================== */

const PALETTE = {
  ivory:"#F7F3EE", peri:"#A7B8F5", hydr:"#7E98D6",
  blush:"#E8C9D2", choco:"#4A3428", gold:"#B89B5E",
};

/* deterministic RNG so blooms are stable across renders */
function mulberry32(a){
  return function(){
    a|=0; a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}

/* ---- a single hydrangea floret : four soft petals + gold core ---- */
function Floret({ size, color, rot=0 }){
  const petals=[0,90,180,270];
  return (
    <div className="floret" style={{ "--pc":color, "--ps":size+"px",
        transform:`translate(-50%,-50%) rotate(${rot}deg)` }}>
      {petals.map((d,i)=>(
        <span key={i} className="petal"
          style={{ transform:`translate(-50%,-100%) rotate(${d}deg)` }}/>
      ))}
      <span className="floret-core"/>
    </div>
  );
}

/* ---- a hydrangea mophead : a cluster of florets in a soft disc ---- */
function Hydrangea({ w=180, seed=1, density=27, tones, washColor, style }){
  const rnd=mulberry32(seed);
  const palette = tones || [PALETTE.peri, PALETTE.hydr, PALETTE.peri,
                            "#9AAEEF", PALETTE.blush];
  const rx=w/2, ry=w/2*0.92;
  const florets=[];
  for(let i=0;i<density;i++){
    // random point inside an ellipse, weighted toward centre for fullness
    const a=rnd()*Math.PI*2;
    const r=Math.sqrt(rnd())* (0.5+rnd()*0.5);
    const x=50 + Math.cos(a)*r*48;
    const y=50 + Math.sin(a)*r*46;
    const depth=0.55+rnd()*0.55;            // back florets smaller/dimmer
    const fs=(w*0.118)*depth;
    const col=palette[Math.floor(rnd()*palette.length)];
    florets.push({x,y,fs,col,rot:rnd()*90,depth,key:i});
  }
  // paint back-to-front for soft layering
  florets.sort((a,b)=>a.depth-b.depth);
  return (
    <div className="hydrangea" style={{ width:w, height:w*0.92, ...style }}>
      <div className="hydr-wash" style={{
        left:"50%", top:"52%", width:w*1.2, height:w*1.1,
        background:`radial-gradient(circle, ${washColor||PALETTE.hydr} 0%, transparent 70%)`,
        opacity:.6,
      }}/>
      {florets.map(f=>(
        <div key={f.key} style={{ position:"absolute", left:f.x+"%", top:f.y+"%",
            opacity:0.5+f.depth*0.5, zIndex:Math.round(f.depth*10) }}>
          <Floret size={f.fs} color={f.col} rot={f.rot}/>
        </div>
      ))}
    </div>
  );
}

/* a single drifting leaf/stem of greenery in delicate gold line */
function Sprig({ style, flip=false }){
  return (
    <svg className="art-svg" width="90" height="120" viewBox="0 0 90 120"
         style={{ position:"absolute", transform:flip?"scaleX(-1)":"none", ...style }}>
      <path className="gild" d="M45 118 C 42 80, 40 50, 52 14"/>
      <path className="gild" d="M47 92 C 30 86, 20 74, 16 60" opacity=".75"/>
      <path className="gild" d="M49 70 C 66 64, 74 52, 78 40" opacity=".75"/>
      <path className="gild" d="M50 48 C 36 42, 30 32, 28 20" opacity=".7"/>
    </svg>
  );
}

/* ---- beaded bracelet divider (the way we met) ---- */
function Beads({ count=5, style }){
  const cols=[PALETTE.peri,PALETTE.blush,PALETTE.hydr,PALETTE.blush,PALETTE.peri];
  return (
    <div className="beads" style={style}>
      <span className="thread"/>
      {Array.from({length:count}).map((_,i)=>(
        <span key={i} className="bead" style={{ "--c":cols[i%cols.length] }}/>
      ))}
      <span className="thread r"/>
    </div>
  );
}

/* =====================================================================
   Focal line-art figures
   ===================================================================== */

/* 1 — wrought-iron garden gate, framed by an arch */
function Gate(){
  const bars=[40,68,96,124,152,180].filter(x=>Math.abs(x-110)>6);
  return (
    <div className="art-figure">
      <svg className="art-svg" width="240" height="320" viewBox="0 0 220 320"
           style={{ animation:"sway 9s ease-in-out infinite" }}>
        {/* ground line */}
        <path className="ink-soft" d="M14 300 H206"/>
        {/* arch frame */}
        <path className="ink" d="M26 300 V120 Q26 36 110 36 Q194 36 194 120 V300"/>
        {/* top rail following arch */}
        <path className="ink-soft" d="M30 120 Q110 70 190 120"/>
        {/* mid rail */}
        <path className="ink-soft" d="M28 210 H192"/>
        {/* vertical bars */}
        {bars.map((x,i)=>(
          <line key={i} className="ink" x1={x} y1="120" x2={x} y2="300"/>
        ))}
        {/* the two leaves meeting at centre */}
        <line className="ink" x1="110" y1="56" x2="110" y2="300"/>
        {/* centre scrollwork in gold */}
        <path className="gild" d="M110 150 C 92 150, 92 176, 110 176 C 128 176, 128 150, 110 150"/>
        <path className="gild" d="M110 176 C 92 176, 92 202, 110 202 C 128 202, 128 176, 110 176"/>
        <path className="gild" d="M88 150 q-16 -2 -16 -20" opacity=".85"/>
        <path className="gild" d="M132 150 q16 -2 16 -20" opacity=".85"/>
        {/* finials */}
        {[110].map(x=>(<circle key={x} className="gild-fill" cx={x} cy="50" r="5"/>))}
        <circle className="gild-fill" cx="26" cy="118" r="4"/>
        <circle className="gild-fill" cx="194" cy="118" r="4"/>
      </svg>
    </div>
  );
}

/* a winding garden path */
function Path(){
  return (
    <div className="art-figure">
      <svg className="art-svg" width="260" height="320" viewBox="0 0 260 320">
        {/* the path : two converging soft lines */}
        <path className="ink-soft" d="M70 318 C 96 240, 150 220, 150 150 C 150 96, 120 70, 130 24"/>
        <path className="ink-soft" d="M190 318 C 168 240, 176 210, 168 150 C 160 96, 150 64, 138 24"/>
        {/* stepping stones */}
        {[[130,300,30],[143,262,24],[150,226,19],[153,192,15],[150,162,12]].map(([cx,cy,r],i)=>(
          <ellipse key={i} className="gild" cx={cx} cy={cy} rx={r} ry={r*0.42} opacity=".7"/>
        ))}
      </svg>
    </div>
  );
}

/* 4/5 — antique-gold lantern (glow handled by a halo div behind it) */
function Lantern({ lit=true }){
  return (
    <div className="art-figure">
      {lit && <div className="halo" style={{ width:230, height:230 }}/>}
      <svg className="art-svg" width="150" height="260" viewBox="0 0 150 260"
           style={{ position:"relative", animation:"sway 7s ease-in-out infinite" }}>
        {/* hanging ring + arm */}
        <path className="gild" d="M75 8 a10 10 0 1 1 -0.1 0"/>
        <line className="gild" x1="75" y1="28" x2="75" y2="48"/>
        {/* cap */}
        <path className="gild" d="M48 70 L75 48 L102 70 Z"/>
        <path className="gild" d="M44 74 H106"/>
        {/* body cage */}
        <rect className="gild" x="50" y="78" width="50" height="96" rx="6"/>
        <line className="gild" x1="66" y1="78" x2="66" y2="174" opacity=".7"/>
        <line className="gild" x1="84" y1="78" x2="84" y2="174" opacity=".7"/>
        <path className="gild" d="M50 100 H100" opacity=".55"/>
        <path className="gild" d="M50 152 H100" opacity=".55"/>
        {/* base */}
        <path className="gild" d="M44 178 H106"/>
        <path className="gild" d="M58 182 L62 196 H88 L92 182" />
        {/* flame */}
        {lit && <>
          <path className="gild-fill" d="M75 112 C 68 122, 70 134, 75 140 C 80 134, 82 122, 75 112 Z"
                style={{ filter:"drop-shadow(0 0 6px rgba(184,155,94,.9))" }}/>
          <ellipse cx="75" cy="128" rx="14" ry="20" fill="rgba(184,155,94,.28)" style={{filter:"blur(4px)"}}/>
        </>}
      </svg>
    </div>
  );
}

/* 6 — a quiet garden fountain */
function Fountain(){
  return (
    <div className="art-figure">
      <svg className="art-svg" width="240" height="300" viewBox="0 0 240 300"
           style={{ animation:"sway 10s ease-in-out infinite" }}>
        {/* lower basin */}
        <ellipse className="ink" cx="120" cy="248" rx="92" ry="26"/>
        <path className="ink-soft" d="M28 248 q92 40 184 0"/>
        {/* pedestal */}
        <path className="ink" d="M104 240 C 100 200, 100 188, 112 176 H128 C 140 188, 140 200, 136 240"/>
        {/* upper bowl */}
        <ellipse className="ink" cx="120" cy="172" rx="40" ry="12"/>
        <path className="ink-soft" d="M82 172 q38 22 76 0"/>
        {/* finial */}
        <line className="ink" x1="120" y1="160" x2="120" y2="138"/>
        <circle className="gild-fill" cx="120" cy="132" r="6"/>
        {/* water arcs in gold */}
        <path className="gild" d="M120 138 C 150 150, 158 166, 150 184" opacity=".7"/>
        <path className="gild" d="M120 138 C 90 150, 82 166, 90 184" opacity=".7"/>
        <path className="gild" d="M120 184 C 132 200, 132 220, 122 236" opacity=".5"/>
        {/* ripples */}
        <path className="gild" d="M70 250 q50 16 100 0" opacity=".4"/>
        <path className="gild" d="M86 256 q34 9 68 0" opacity=".3"/>
      </svg>
    </div>
  );
}

/* open meadow horizon glow (final) */
function Meadow(){
  return (
    <div className="art-figure" style={{ overflow:"hidden" }}>
      <div style={{ position:"absolute", left:"50%", top:"34%", transform:"translate(-50%,-50%)",
        width:300, height:300, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(184,155,94,.4), rgba(231,201,210,.18) 45%, transparent 72%)",
        filter:"blur(6px)", animation:"breathe-glow 7s ease-in-out infinite" }}/>
      <svg className="art-svg" width="300" height="200" viewBox="0 0 300 200"
           style={{ position:"absolute", bottom:"4%" }}>
        <path className="ink-soft" d="M0 150 q75 -22 150 -6 q75 16 150 -4" opacity=".5"/>
        <path className="gild" d="M0 168 q75 -16 150 -4 q75 12 150 -6" opacity=".5"/>
      </svg>
    </div>
  );
}

Object.assign(window, {
  PALETTE, Floret, Hydrangea, Sprig, Beads,
  Gate, Path, Lantern, Fountain, Meadow,
});
