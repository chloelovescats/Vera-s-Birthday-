/* =====================================================================
   app.jsx - orchestration: scaling, scene flow, petals, glow, sound.
   ===================================================================== */
const { useState, useRef, useCallback } = React;

/* ---- paper grain texture (soft feTurbulence) ---- */
const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

/* ---- gentle ambient pad (Web Audio, muted by default) ---- */
function useAmbient(){
  const ref = useRef(null);
  const start = useCallback(()=>{
    if(ref.current) return ref.current;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return null;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    lp.Q.value = 0.4;
    master.connect(lp);
    lp.connect(ctx.destination);

    const freqs = [110.0, 164.81, 220.0, 277.18];
    freqs.forEach((f, i)=>{
      const oscillator = ctx.createOscillator();
      oscillator.type = i === 0 ? "sine" : "triangle";
      oscillator.frequency.value = f;
      oscillator.detune.value = i % 2 ? 4 : -4;

      const gain = ctx.createGain();
      gain.gain.value = i === 0 ? 0.16 : 0.09 - i * 0.012;
      oscillator.connect(gain);
      gain.connect(master);

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.03 + i * 0.017;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      oscillator.start();
      lfo.start();
    });

    ref.current = { ctx, master };
    return ref.current;
  }, []);

  return useCallback((on)=>{
    const ambient = start();
    if(!ambient) return;

    const { ctx, master } = ambient;
    if(ctx.state === "suspended") ctx.resume();

    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
    master.gain.exponentialRampToValueAtTime(on ? 0.09 : 0.0001, t + (on ? 1.6 : 0.8));
  }, [start]);
}

/* ---- drifting petals + gold motes overlay (subtle) ---- */
function Atmosphere(){
  const petals = useRef(null);
  if(!petals.current){
    const cols = [PALETTE.peri, PALETTE.blush, PALETTE.hydr, "#B9C6F7"];
    petals.current = Array.from({ length: 9 }).map((_, i)=>({
      left: (8 + (i * 73) % 84) + "%",
      dur: 22 + (i * 3.3) % 16,
      delay: -(i * 4.1) % 26,
      size: 9 + (i % 3) * 3,
      col: cols[i % cols.length],
      drift: (i % 2 ? 1 : -1) * (24 + (i * 7) % 40),
      rot: 160 + (i * 30) % 140,
    }));
  }

  const motes = useRef(null);
  if(!motes.current){
    motes.current = Array.from({ length: 10 }).map((_, i)=>({
      left: (6 + (i * 61) % 88) + "%",
      top: (10 + (i * 47) % 72) + "%",
      dur: 3.5 + (i % 4) * 1.3,
      delay: -(i * 0.9) % 6,
    }));
  }

  return (
    <div id="petals">
      {petals.current.map((p, i)=>(
        <span
          key={i}
          className="drift"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.15,
            background: `radial-gradient(70% 80% at 50% 75%, color-mix(in oklab, ${p.col} 88%, white), ${p.col})`,
            animationDuration: p.dur + "s",
            animationDelay: p.delay + "s",
            "--dx": p.drift + "px",
          }}
        />
      ))}
      {motes.current.map((m, i)=>(
        <span
          key={"m" + i}
          className="mote"
          style={{
            left: m.left,
            top: m.top,
            animationDuration: m.dur + "s",
            animationDelay: m.delay + "s",
          }}
        />
      ))}
    </div>
  );
}

const SoundOn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9v6h4l5 4V5L8 9H4z"/>
    <path d="M16.5 8.5a5 5 0 0 1 0 7"/>
    <path d="M19 6a8 8 0 0 1 0 12"/>
  </svg>
);

const SoundOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9v6h4l5 4V5L8 9H4z"/>
    <path d="M22 9l-6 6"/>
    <path d="M16 9l6 6"/>
  </svg>
);

function App(){
  const [cur, setCur] = useState(0);
  const [sound, setSound] = useState(false);
  const setAmbient = useAmbient();

  const advance = ()=> setCur((c)=>(c + 1) % SCENES.length);
  const replay = ()=> setCur(0);
  const onBtn = (i)=> (i === SCENES.length - 1 ? replay() : advance());
  const toggleSound = ()=>{
    setSound((s)=>{
      const next = !s;
      setAmbient(next);
      return next;
    });
  };

  return (
    <>
      {SCENES.map((s, i)=>(
        <section
          key={s.key}
          className={"scene" + (i === cur ? " active" : "")}
          data-screen-label={s.eyebrow}
          aria-hidden={i !== cur}
        >
          <s.Deco/>
          <div className="scene-art"><s.Art/></div>
          <div className="scene-copy">
            <div className="copy-inner">
              <div className="eyebrow">{s.eyebrow}</div>
              <s.Copy/>
            </div>
          </div>
          <div className="scene-action">
            <button className="btn" onClick={()=>onBtn(i)}>
              <span className="btn-flourish"/>
              <span className="label">{s.btn}</span>
            </button>
          </div>
        </section>
      ))}

      <Atmosphere/>

      <div id="chrome">
        <button
          id="sound-btn"
          onClick={toggleSound}
          aria-label={sound ? "Mute ambient sound" : "Play ambient sound"}
        >
          {sound ? <SoundOn/> : <SoundOff/>}
        </button>
        <div id="progress">
          {SCENES.map((_, i)=>(
            <span key={i} className={"dot" + (i === cur ? " on" : (i < cur ? " done" : ""))}/>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---- scaling: fit the fixed 9:16 card into any viewport ---- */
function fit(){
  const W = 480;
  const H = 854;
  const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
  const el = document.getElementById("scaler");
  if(el) el.style.transform = "scale(" + scale + ")";
}

window.addEventListener("resize", fit);
document.documentElement.style.setProperty("--paper", PAPER);
ReactDOM.createRoot(document.getElementById("card")).render(<App/>);
fit();
window.requestAnimationFrame(fit);
