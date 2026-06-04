/* =====================================================================
   app.jsx - orchestration: scaling, scene flow, petals, glow, sound.
   ===================================================================== */
const { useState, useRef, useCallback } = React;
const MUSIC_TRACK = "music/the-moon-song.mp3?v=20260605";

/* ---- paper grain texture (soft feTurbulence) ---- */
const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

/* ---- looping background music ---- */
function useAmbient(){
  const ref = useRef(null);
  const ensureAudio = useCallback(()=>{
    if(ref.current) return ref.current;
    const audio = new Audio(MUSIC_TRACK);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.32;
    ref.current = audio;
    return audio;
  }, []);

  const play = useCallback(()=>{
    const audio = ensureAudio();
    return audio.play();
  }, [ensureAudio]);

  const stop = useCallback(()=>{
    const audio = ensureAudio();
    audio.pause();
    audio.currentTime = 0;
  }, [ensureAudio]);

  return { play, stop };
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
  const ambient = useAmbient();

  const advance = ()=> setCur((c)=>(c + 1) % SCENES.length);
  const replay = ()=> setCur(0);
  const onBtn = (i)=> (i === SCENES.length - 1 ? replay() : advance());
  const toggleSound = ()=>{
    if(sound){
      ambient.stop();
      setSound(false);
      return;
    }

    ambient.play()
      .then(()=> setSound(true))
      .catch(()=> setSound(false));
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
          aria-label={sound ? "Stop music" : "Play music"}
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
