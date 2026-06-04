/* =====================================================================
   scenes.jsx - the seven screens of the garden, in order.
   Blooms frame the borders only; the center is kept clear for the text.
   ===================================================================== */

/* a border frame of hydrangeas - anchored to the corners, bleeding off
   the edges, sitting behind the text so it never blocks a word */
function CornerBlooms({ seed = 1, a, b }){
  const warm = a || [PALETTE.peri, PALETTE.hydr, "#9AAEEF", PALETTE.blush];
  const cool = b || [PALETTE.hydr, PALETTE.peri, "#9AAEEF"];

  return (
    <div className="scene-deco">
      <Hydrangea
        w={186}
        seed={seed * 7 + 1}
        tones={warm}
        style={{ position: "absolute", right: "-10%", bottom: "-8%" }}
      />
      <Hydrangea
        w={158}
        seed={seed * 7 + 3}
        tones={cool}
        style={{ position: "absolute", left: "-9%", bottom: "-9%" }}
      />
      <Hydrangea
        w={92}
        seed={seed * 7 + 5}
        tones={[PALETTE.blush, PALETTE.peri]}
        style={{ position: "absolute", right: "-6%", top: "1%" }}
      />
      <Hydrangea
        w={80}
        seed={seed * 7 + 9}
        tones={warm}
        style={{ position: "absolute", left: "-6%", top: "3%" }}
      />
    </div>
  );
}

/* a glow halo helper for the art band */
function Glow({ size = 200, top = "42%", left = "50%" }){
  return (
    <div
      className="halo"
      style={{ width: size, height: size, position: "absolute", left, top, transform: "translate(-50%,-50%)" }}
    />
  );
}

/* gold-framed keepsake photo */
function Keepsake({ id, oval, w, h, placeholder, src }){
  return (
    <div className={"keepsake" + (oval ? " keepsake-oval" : "")} style={{ borderRadius: oval ? "50%" : "10px" }}>
      <image-slot
        id={id}
        shape={oval ? "circle" : "rounded"}
        radius={oval ? undefined : "6"}
        style={{ width: w + "px", height: h + "px", borderRadius: oval ? "50%" : "6px" }}
        src={src}
        placeholder={placeholder}
      ></image-slot>
    </div>
  );
}

/* a real watercolor painting as the focal art */
function SceneImg({ src, alt, tall }){
  return <img className={"scene-img" + (tall ? " tall" : "")} src={src} alt={alt}/>;
}

const H = () => <span className="heart">{"\u2661"}</span>;

const SCENES = [
  {
    key: "gate",
    eyebrow: "Dearest Vera",
    btn: "Open the Gate",
    Deco: () => <CornerBlooms seed={2}/>,
    Art: () => <SceneImg src="images/gate.png" alt="A flower-draped garden gate" tall/>,
    Copy: () => (
      <div className="scene-text">
        <p className="opener">Happy 24th Birthday, precious bubbieboo <H/></p>
        <p>It is a pity we don&apos;t live in two side-by-side dollhouses connected by a giant flowerbed.</p>
        <p>Since we can&apos;t have that, I made you a little garden instead.</p>
        <p>I filled it with hydrangeas because they remind me of us. Each bloom is made up of many small petals, the same way our friendship has been built from little conversations, shared memories, prayers, and the way we&apos;ve held each other through hardship and anxieties.</p>
      </div>
    ),
  },
  {
    key: "path",
    eyebrow: "journeying with you",
    btn: "Follow the Path",
    Deco: () => <CornerBlooms seed={5} b={[PALETTE.peri, PALETTE.blush, PALETTE.hydr]}/>,
    Art: () => <SceneImg src="images/path.png" alt="A winding garden path between blooms"/>,
    Copy: () => (
      <div className="scene-text">
        <p>As you follow the path, I want you to know how grateful I am that our paths crossed.</p>
        <p>It has been four years since we met, and I am so thankful for the privilege of growing alongside you. I love that we have been able to experience adulting and womanhood together. Even when we are apart, I feel you cheering me on, and I hope you feel the same from me.</p>
        <Beads style={{ marginTop: "16px" }}/>
      </div>
    ),
  },
  {
    key: "hydrangeas",
    eyebrow: "Awwwwww!",
    btn: "Continue",
    Deco: () => <CornerBlooms seed={8}/>,
    Art: () => <Keepsake id="photo-bloom" oval w={150} h={186} placeholder="A photo of her" src="images/photo-bloom.jpg"/>,
    Copy: () => (
      <div className="scene-text">
        <p>Looking at us here makes me smile.</p>
        <p>Time really flies. Insane. I buy beads, and now I get to be part of your life, from random catch-ups to watching you love baby Raphael so wholeheartedly.</p>
        <p>Even though we barely get time to meet properly, I am really grateful I still get a front-row seat in your life. Being his godma is honestly awesome and I hope we get to do family vacays as aunties one day.</p>
      </div>
    ),
  },
  {
    key: "lantern",
    eyebrow: "your courage inspires me",
    btn: "Pick Up the Lantern",
    Deco: () => <CornerBlooms seed={11} b={[PALETTE.hydr, PALETTE.peri]}/>,
    Art: () => (
      <>
        <Glow size={232}/>
        <SceneImg src="images/lantern-bird.png" alt="A glowing lantern with a dove" tall/>
      </>
    ),
    Copy: () => (
      <div className="scene-text">
        <p>I&apos;ve had the privilege of watching you navigate seasons that would have tested anyone&apos;s faith and spirit.</p>
        <p>I know there were days that asked a lot of you. I wish I could be there more often for you. Just as you cheer me on in everything I do, I hope you know the door is always open for you to come and rest here whenever you need to.</p>
      </div>
    ),
  },
  {
    key: "fountain",
    eyebrow: "life has its surprises",
    btn: "Follow the Kitten",
    Deco: () => <CornerBlooms seed={14}/>,
    Art: () => <SceneImg src="images/bush.png" alt="A flowering garden bush with a kitten peeking through the leaves"/>,
    Copy: () => (
      <div className="scene-text">
        <p className="opener">Oh look, a kitte!</p>
        <p>I just thought the garden needed one.</p>
        <p>Also, every secret garden deserves a tiny guardian. I hope that even in busy, tiring seasons, there is always room for a little joy.</p>
      </div>
    ),
  },
  {
    key: "clearing",
    eyebrow: "Oh? A fountain!",
    btn: "One Last Discovery",
    Deco: () => <CornerBlooms seed={17} b={[PALETTE.peri, PALETTE.hydr, PALETTE.blush]}/>,
    Art: () => (
      <>
        <div className="warm-wash"/>
        <Glow size={188} top="40%"/>
        <SceneImg src="images/clearing.png" alt="A garden clearing with a gazebo and winding path" tall/>
      </>
    ),
    Copy: () => (
      <div className="scene-text">
        <p>As you celebrate another year of life, my prayer is that God reminds you that He sees every sacrifice, every tear, every prayer.</p>
        <p>May you find places to pause, breathe, and remember that life is still full of beautiful things worth savoring.</p>
        <p>May this season bring you rest for your heart, and renewed hope for the road ahead.</p>
      </div>
    ),
  },
  {
    key: "meadow",
    eyebrow: "for the road ahead",
    btn: "Replay the Garden",
    Deco: () => <CornerBlooms seed={21}/>,
    Art: () => (
      <>
        <Glow size={230} top="46%"/>
        <Keepsake id="photo-meadow" w={196} h={132} placeholder="A photo of us" src="images/photo-meadow.jpg"/>
      </>
    ),
    Copy: () => (
      <div className="scene-text final-text">
        <div className="verse">
          <p>"The Lord will fight for you; you need only to be still."</p>
          <span className="ref">Exodus 14:14</span>
        </div>
        <p>May this year be one where you experience God&apos;s faithfulness in new ways, find rest in His presence, and discover that even greater blessings are waiting ahead than you could have imagined.</p>
        <p>Thank you for letting me walk alongside you through these years. I cannot imagine my life without your friendship, your wisdom, your laughter, and your beautiful heart.</p>
        <div className="final-divider"></div>
        <div className="final-sign">
          <span className="small">You are deeply loved, and I am so proud of you. <H/></span>
          <span className="by">Love,<br/>Chloe</span>
        </div>
      </div>
    ),
  },
];

window.SCENES = SCENES;
window.CornerBlooms = CornerBlooms;
