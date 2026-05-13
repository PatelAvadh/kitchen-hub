import { useState, useEffect } from "react";

// ── Fonts & Global Styles ────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
fl.rel = "stylesheet"; document.head.appendChild(fl);

const gs = document.createElement("style");
gs.textContent = `
  :root {
    --sage:#3d6b35;--sage-l:#f0f5ee;--sage-m:#c6d9c2;
    --terra:#c4622d;--terra-l:#fdf1eb;--terra-m:#f0c4a8;
    --cream:#faf6f0;--gray:#8a8279;--dark:#1e1b18;
    --white:#fff;--border:#ede9e3;--red:#dc2626;--red-l:#fef2f2;--red-m:#fecaca;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--cream);font-family:'DM Sans',sans-serif;-webkit-tap-highlight-color:transparent;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .fu{animation:fadeUp .3s ease both}
  input,select,textarea{font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{display:none;}
  button:active{opacity:0.75;}
`;
document.head.appendChild(gs);

// ── Static Data ──────────────────────────────────────────────────────────────

const DISHES_SEED = [
  {id:1,  name:"Uttapam Sambhar",         cat:"rice",    emoji:"🥘", exp:"medium", tags:["quick"],              protein:false},
  {id:2,  name:"Dal Khichdi",             cat:"rice",    emoji:"🍲", exp:"long",   tags:["quick","freezer"],    protein:true},
  {id:3,  name:"Black Chana Rice Kadhi",  cat:"rice",    emoji:"🍛", exp:"long",   tags:["protein"],            protein:true},
  {id:4,  name:"Pulav",                   cat:"rice",    emoji:"🍚", exp:"long",   tags:["quick"],              protein:false},
  {id:5,  name:"Dal Rice",                cat:"rice",    emoji:"🫕", exp:"long",   tags:["quick"],              protein:true},
  {id:6,  name:"Sev Usal",                cat:"pulses",  emoji:"🥣", exp:"long",   tags:["quick","protein"],    protein:true},
  {id:7,  name:"Dal Bati",                cat:"pulses",  emoji:"🫓", exp:"long",   tags:["weekend"],            protein:true},
  {id:8,  name:"Mag Paratha",             cat:"pulses",  emoji:"🥙", exp:"long",   tags:["quick","protein"],    protein:true},
  {id:9,  name:"Dal Dhokli",              cat:"pulses",  emoji:"🍜", exp:"long",   tags:["protein"],            protein:true},
  {id:10, name:"Bataka Tameta Ras Rotli", cat:"veggie",  emoji:"🍅", exp:"long",   tags:["quick"],              protein:false},
  {id:11, name:"Bhinda Ras Rotli",        cat:"veggie",  emoji:"🥗", exp:"short",  tags:["quick"],              protein:false},
  {id:12, name:"Bhinda Bhakhri",          cat:"veggie",  emoji:"🥗", exp:"short",  tags:[],                     protein:false},
  {id:13, name:"Bataka Tameta",           cat:"veggie",  emoji:"🍅", exp:"long",   tags:["quick"],              protein:false},
  {id:14, name:"Paneer Sabji Paratha",    cat:"veggie",  emoji:"🧀", exp:"short",  tags:["weekend","protein"],  protein:true},
  {id:15, name:"Cauliflower Roti",        cat:"veggie",  emoji:"🥦", exp:"short",  tags:[],                     protein:false},
  {id:16, name:"Muthiya",                 cat:"snack",   emoji:"🟤", exp:"short",  tags:["weekend"],            protein:false},
  {id:17, name:"Dhokla",                  cat:"snack",   emoji:"🟡", exp:"medium", tags:["weekend"],            protein:false},
  {id:18, name:"Methi na Vada",           cat:"snack",   emoji:"🟤", exp:"short",  tags:["weekend"],            protein:false},
  {id:19, name:"Pav Bhaji",               cat:"snack",   emoji:"🍞", exp:"medium", tags:["weekend"],            protein:false},
  {id:20, name:"Bhel Puri",               cat:"snack",   emoji:"🥗", exp:"long",   tags:["quick"],              protein:false},
  {id:21, name:"Mexican Bhel",            cat:"snack",   emoji:"🌮", exp:"long",   tags:["quick"],              protein:false},
  {id:22, name:"Handvo",                  cat:"snack",   emoji:"🟤", exp:"medium", tags:["weekend","protein"],  protein:true},
  {id:23, name:"Paneer Frankie",          cat:"fusion",  emoji:"🌯", exp:"short",  tags:["quick","protein"],    protein:true},
  {id:24, name:"Quesadillas",             cat:"fusion",  emoji:"🫓", exp:"medium", tags:["quick"],              protein:false},
  {id:25, name:"Sandwich",               cat:"fusion",  emoji:"🥪", exp:"medium", tags:["quick"],              protein:false},
  {id:26, name:"Noodles",                 cat:"fusion",  emoji:"🍜", exp:"long",   tags:["quick"],              protein:false},
  {id:27, name:"Pasta",                   cat:"fusion",  emoji:"🍝", exp:"long",   tags:["quick"],              protein:false},
  {id:28, name:"Broccoli Almond Soup",    cat:"soup",    emoji:"🥦", exp:"short",  tags:["quick","protein"],    protein:true},
];

const COSTCO_ITEMS = [
  {id:"co1", name:"Nescafé Instant Coffee",          note:"Buy when almost empty"},
  {id:"co2", name:"One Degree Organic Oats",          note:"Buy when almost empty"},
  {id:"co3", name:"Leanfit Chocolate Protein Powder", note:"Buy when almost empty"},
  {id:"co4", name:"Clementines",                      note:"Bulk box — seasonal"},
  {id:"co5", name:"Apples",                           note:"Better quality here"},
  {id:"co6", name:"Dry Lentils / Chickpeas",          note:"Buy large bags (cheaper)"},
];

const LUNCH_IDEAS = [
  {name:"Moong Dal Cheela",     cal:200, prep:"15 min", pack:true},
  {name:"Egg Salad Wrap",       cal:270, prep:"8 min",  pack:true},
  {name:"Leftover Sabji + Roti",cal:250, prep:"2 min",  pack:true},
  {name:"Oats Upma (savoury)", cal:240, prep:"10 min", pack:true},
  {name:"Cucumber + Hummus",    cal:180, prep:"3 min",  pack:true},
  {name:"Poha (light version)", cal:230, prep:"12 min", pack:true},
  {name:"Greek Yogurt + Fruit", cal:200, prep:"2 min",  pack:true},
  {name:"Avocado Toast (1 sl)", cal:220, prep:"5 min",  pack:false},
  {name:"Boiled Egg + Crackers",cal:200, prep:"5 min",  pack:true},
  {name:"Makhana + Green Tea",  cal:130, prep:"0 min",  pack:true},
];

const CATS = [
  {id:"all",    label:"All",          emoji:"🍽"},
  {id:"rice",   label:"Rice & Grain", emoji:"🍚"},
  {id:"pulses", label:"Pulses",       emoji:"🫘"},
  {id:"veggie", label:"Veggie Sabji", emoji:"🥬"},
  {id:"snack",  label:"Snack-Style",  emoji:"🥟"},
  {id:"fusion", label:"Fusion",       emoji:"🌍"},
  {id:"soup",   label:"Soup",         emoji:"🍜"},
];

const EXP = {
  short:  {bg:"#fef2f2",      bdr:"#fecaca",      txt:"#dc2626",  label:"Days 1–4",   dot:"#dc2626"},
  medium: {bg:"#fff7ed",      bdr:"#fed7aa",      txt:"#c2410c",  label:"Days 5–9",   dot:"#f97316"},
  long:   {bg:"var(--sage-l)",bdr:"var(--sage-m)",txt:"var(--sage)",label:"Days 10–14",dot:"var(--sage)"},
};

const EXP_ORDER = {short:0, medium:1, long:2};

const TABS = [
  {id:"library", icon:"📚", label:"Library"},
  {id:"menu",    icon:"🗓",  label:"Menu"},
  {id:"grocery", icon:"🛒",  label:"Grocery"},
  {id:"prep",    icon:"🥗",  label:"Prep"},
  {id:"recipe",  icon:"🍽",  label:"Recipe"},
];

const KEYS = {
  DISHES:  "hh-dishes-v2",
  MENU:    "hh-menu-v2",
  GROCERY: "hh-grocery-v2",
  COSTCO:  "hh-costco-v2",
  PREP:    "hh-prep-v2",
  CYCLE:   "hh-cycle-v2",
};

// ── Storage — Supabase (permanent, shared between both users) ────────────────
const SB_URL = "https://xxjzlmgauktgkcduznxg.supabase.co/rest/v1";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4anpsbWdhdWt0Z2tjZHV6bnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDgwNjgsImV4cCI6MjA5NDIyNDA2OH0.7XFwEoHWl5G7TnANuurEPSJckFZFH0horYhF3pFFDwI";
const SB_HEADERS = {
  "apikey": SB_KEY,
  "Authorization": `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

const db = {
  async get(key) {
    try {
      const res = await fetch(
        `${SB_URL}/household_data?key=eq.${encodeURIComponent(key)}&select=value`,
        { headers: SB_HEADERS }
      );
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) return JSON.parse(rows[0].value);
      return null;
    } catch (e) { console.error("Supabase get:", e); return null; }
  },
  async set(key, val) {
    try {
      await fetch(`${SB_URL}/household_data`, {
        method: "POST",
        headers: { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates" },
        body: JSON.stringify({ key, value: JSON.stringify(val) }),
      });
    } catch (e) { console.error("Supabase set:", e); }
  },
};

// ── Claude API ───────────────────────────────────────────────────────────────
async function claude(prompt, search = false, tokens = 2000) {
  const body = {
    model: "claude-sonnet-4-20250514", max_tokens: tokens,
    messages: [{ role: "user", content: prompt }],
  };
  if (search) body.tools = [{type:"web_search_20250305", name:"web_search"}];
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body),
  });
  const d = await r.json();
  return (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
}

function parseJSON(text) {
  const s = text.replace(/```json|```/g,"").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a===-1||b===-1) throw new Error("No JSON");
  return JSON.parse(s.slice(a, b+1));
}

// ── Shared Small Components ──────────────────────────────────────────────────
const T = ({f="'DM Sans'",s=13,w=400,c="var(--dark)",children,...p}) => (
  <div style={{fontFamily:f,fontSize:s,fontWeight:w,color:c,...p}}>{children}</div>
);

function Spinner({size=20}) {
  return <div style={{width:size,height:size,borderRadius:"50%",border:`2.5px solid var(--sage-m)`,borderTopColor:"var(--sage)",animation:"spin .7s linear infinite",flexShrink:0}}/>;
}

function Chip({active, color="sage", onClick, children}) {
  const cols = {
    sage:  {a:"var(--sage)",  bg:"var(--sage-l)",  bdr:"var(--sage-m)"},
    terra: {a:"var(--terra)", bg:"var(--terra-l)", bdr:"var(--terra-m)"},
    red:   {a:"var(--red)",   bg:"var(--red-l)",   bdr:"var(--red-m)"},
  };
  const c = cols[color]||cols.sage;
  return (
    <button onClick={onClick} style={{
      flexShrink:0, padding:"5px 13px", borderRadius:20, cursor:"pointer",
      fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600,
      border: active ? `1.5px solid ${c.a}` : "1.5px solid var(--border)",
      background: active ? c.bg : "var(--white)", color: active ? c.a : "var(--gray)",
    }}>{children}</button>
  );
}

function Check({checked, color="sage", size=20, onClick}) {
  const cols = {sage:"var(--sage)", terra:"var(--terra)", red:"var(--red)"};
  const c = cols[color]||cols.sage;
  return (
    <div onClick={onClick} style={{
      width:size,height:size,borderRadius:Math.round(size*0.3),flexShrink:0,cursor:"pointer",
      background:checked?c:"transparent", border:`2px solid ${checked?c:"var(--border)"}`,
      display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"
    }}>
      {checked && <span style={{fontSize:size*0.6,color:"white",fontWeight:700,lineHeight:1}}>✓</span>}
    </div>
  );
}

function EmptyState({emoji, title, sub, children}) {
  return (
    <div style={{textAlign:"center",padding:"40px 20px 24px",color:"var(--gray)"}}>
      <div style={{fontSize:42,marginBottom:12}}>{emoji}</div>
      <div style={{fontFamily:"'Lora',serif",fontSize:17,fontWeight:700,color:"var(--dark)",marginBottom:6}}>{title}</div>
      <div style={{fontSize:13,lineHeight:1.6,maxWidth:240,margin:"0 auto 20px"}}>{sub}</div>
      {children}
    </div>
  );
}

function PrimaryBtn({onClick, disabled, loading, children, color="sage", style:s}) {
  const bg = color==="terra" ? "var(--terra)" : "var(--sage)";
  return (
    <button onClick={onClick} disabled={disabled||loading} style={{
      width:"100%",padding:"14px",borderRadius:14,background:disabled||loading?"var(--sage-m)":bg,
      color:"white",border:"none",fontSize:15,fontWeight:600,cursor:disabled||loading?"not-allowed":"pointer",
      fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,...s
    }}>
      {loading && <Spinner size={16}/>}
      {children}
    </button>
  );
}

// ── LIBRARY TAB ──────────────────────────────────────────────────────────────
function LibraryTab({dishes, menu, onToggle, onAdd}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("veggie");
  const [newExp, setNewExp] = useState("medium");

  const filtered = dishes.filter(d =>
    d.name.toLowerCase().includes(q.toLowerCase()) && (cat==="all" || d.cat===cat)
  );

  const addDish = () => {
    if (!newName.trim()) return;
    onAdd({id:Date.now(), name:newName.trim(), cat:newCat, emoji:"🍽", exp:newExp, tags:[], protein:false});
    setNewName(""); setShowAdd(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Search + filter */}
      <div style={{padding:"12px 16px 10px",background:"white",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--cream)",borderRadius:12,
          padding:"9px 14px",border:"1.5px solid var(--border)",marginBottom:10}}>
          <span style={{fontSize:14}}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search dishes…"
            style={{border:"none",background:"transparent",outline:"none",fontSize:14,color:"var(--dark)",flex:1}}/>
          {q && <button onClick={()=>setQ("")} style={{border:"none",background:"none",cursor:"pointer",fontSize:14,color:"var(--gray)"}}>✕</button>}
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {CATS.map(c=>(
            <Chip key={c.id} active={cat===c.id} onClick={()=>setCat(c.id)}>
              {c.emoji} {c.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Selection count bar */}
      <div style={{
        padding:"8px 16px",
        background: menu.length===14 ? "var(--sage-l)" : "var(--terra-l)",
        borderBottom:`1px solid ${menu.length===14?"var(--sage-m)":"var(--terra-m)"}`,
        display:"flex",justifyContent:"space-between",alignItems:"center"
      }}>
        <span style={{fontSize:13,fontWeight:600,color:menu.length===14?"var(--sage)":"var(--terra)"}}>
          {menu.length}/14 selected for this cycle
        </span>
        {menu.length===14
          ? <span style={{fontSize:11,fontWeight:700,color:"var(--sage)",background:"white",borderRadius:20,padding:"3px 10px",border:"1px solid var(--sage-m)"}}>✓ Ready</span>
          : <span style={{fontSize:11,color:"var(--terra)"}}>Select {14-menu.length} more</span>
        }
      </div>

      {/* Dish list */}
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px"}}>
        {filtered.length===0
          ? <EmptyState emoji="🔍" title="No dishes found" sub="Try a different search or category"/>
          : <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {filtered.map(d => {
                const sel = menu.includes(d.id);
                const ec = EXP[d.exp];
                const maxed = !sel && menu.length>=14;
                return (
                  <div key={d.id} onClick={()=>!maxed && onToggle(d.id)} style={{
                    display:"flex",alignItems:"center",gap:12,
                    background: sel?"var(--sage-l)":maxed?"#fafafa":"white",
                    border:`1.5px solid ${sel?"var(--sage-m)":"var(--border)"}`,
                    borderRadius:14,padding:"11px 14px",cursor:maxed?"not-allowed":"pointer",
                    opacity:maxed?0.5:1,transition:"all .15s"
                  }}>
                    <div style={{fontSize:26,flexShrink:0}}>{d.emoji}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:sel?"var(--sage)":"var(--dark)"}}>{d.name}</div>
                      <div style={{display:"flex",gap:4,marginTop:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:700,
                          background:ec.bg,color:ec.txt,border:`1px solid ${ec.bdr}`}}>
                          {d.exp==="short"?"⚠️ "+ec.label:ec.label}
                        </span>
                        {d.tags.map(t=>(
                          <span key={t} style={{fontSize:10,padding:"2px 7px",borderRadius:20,
                            background:"#f3f4f6",color:"#6b7280",border:"1px solid #e5e7eb",fontWeight:500}}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <Check checked={sel} size={22}/>
                  </div>
                );
              })}
            </div>
        }

        {/* Add dish */}
        {!showAdd
          ? <button onClick={()=>setShowAdd(true)} style={{
              width:"100%",padding:"12px",marginTop:10,borderRadius:14,
              border:"1.5px dashed var(--border)",background:"transparent",
              color:"var(--gray)",fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"
            }}>+ Add a dish to library</button>
          : <div style={{marginTop:12,background:"white",borderRadius:14,border:"1.5px solid var(--sage-m)",padding:16}}>
              <div style={{fontWeight:600,fontSize:14,color:"var(--dark)",marginBottom:12}}>Add New Dish</div>
              <input value={newName} onChange={e=>setNewName(e.target.value)}
                placeholder="Dish name (e.g. Palak Paneer)"
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid var(--border)",
                  fontSize:14,outline:"none",marginBottom:10}}
                onFocus={e=>e.target.style.borderColor="var(--sage)"}
                onBlur={e=>e.target.style.borderColor="var(--border)"}
              />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <select value={newCat} onChange={e=>setNewCat(e.target.value)}
                  style={{padding:"9px",borderRadius:10,border:"1.5px solid var(--border)",fontSize:13,background:"white"}}>
                  {CATS.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <select value={newExp} onChange={e=>setNewExp(e.target.value)}
                  style={{padding:"9px",borderRadius:10,border:"1.5px solid var(--border)",fontSize:13,background:"white"}}>
                  <option value="short">Short expiry</option>
                  <option value="medium">Medium expiry</option>
                  <option value="long">Long shelf life</option>
                </select>
              </div>
              <div style={{display:"flex",gap:8}}>
                <PrimaryBtn onClick={addDish} style={{flex:1}}>Add to Library</PrimaryBtn>
                <button onClick={()=>setShowAdd(false)} style={{
                  padding:"12px 16px",borderRadius:12,background:"transparent",
                  border:"1.5px solid var(--border)",color:"var(--gray)",
                  fontFamily:"'DM Sans',sans-serif",fontSize:14,cursor:"pointer"
                }}>Cancel</button>
              </div>
            </div>
        }
        <div style={{height:20}}/>
      </div>
    </div>
  );
}

// ── MENU TAB ─────────────────────────────────────────────────────────────────
function MenuTab({dishes, menu, cycleStart, onStartCycle}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLunch, setShowLunch] = useState(false);

  const ordered = [...menu]
    .map(id=>dishes.find(d=>d.id===id)).filter(Boolean)
    .sort((a,b)=>EXP_ORDER[a.exp]-EXP_ORDER[b.exp])
    .map((d,i)=>({...d, dayNum:i+1, week:i<7?1:2}));

  const getSuggestions = async () => {
    setLoading(true); setSuggestions([]);
    try {
      const chosen = ordered.map(d=>d.name);
      const notChosen = dishes.filter(d=>!menu.includes(d.id)).map(d=>d.name);
      const txt = await claude(`
You are a meal planning assistant for a Gujarati vegetarian couple in Toronto.
Current 14-day dinner selection: ${chosen.join(", ")}
Available dishes not yet selected: ${notChosen.join(", ")}

Analyze the selection and suggest up to 3 swaps to improve nutritional variety or add an uncommon dish they might enjoy. Keep it Gujarati/Indian context.

Return ONLY valid JSON:
{"gaps":["gap description"],"suggestions":[{"dish":"Dish Name","replaces":"Dish to swap","reason":"short reason"}]}
`, false, 800);
      const p = parseJSON(txt);
      setSuggestions(p.suggestions||[]);
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  if (menu.length===0) return (
    <div style={{flex:1,overflow:"auto",padding:16}}>
      <EmptyState emoji="🗓" title="No dishes selected yet" sub="Go to the Library tab and pick 14 dishes for this cycle"/>
    </div>
  );

  const week1 = ordered.filter(d=>d.week===1);
  const week2 = ordered.filter(d=>d.week===2);

  return (
    <div style={{flex:1,overflowY:"auto",padding:16}}>
      {/* Cycle card */}
      <div style={{background:"white",border:"1px solid var(--border)",borderRadius:16,
        padding:14,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:700,color:"var(--dark)"}}>
            {cycleStart
              ? `${new Date(cycleStart).toLocaleDateString("en-CA",{month:"short",day:"numeric"})} – ${new Date(new Date(cycleStart).getTime()+13*86400000).toLocaleDateString("en-CA",{month:"short",day:"numeric"})}`
              : "Current 2-Week Cycle"}
          </div>
          <div style={{fontSize:12,color:"var(--gray)",marginTop:2}}>{menu.length}/14 dinners planned</div>
        </div>
        <button onClick={onStartCycle} style={{
          padding:"9px 16px",borderRadius:10,background:"var(--sage)",color:"white",
          border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"
        }}>{cycleStart?"↻ Restart":"▶ Start Today"}</button>
      </div>

      {/* Expiry legend */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {["short","medium","long"].map(e=>{
          const ec=EXP[e];
          return (
            <div key={e} style={{display:"flex",alignItems:"center",gap:5,
              background:ec.bg,border:`1px solid ${ec.bdr}`,borderRadius:20,padding:"4px 10px"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:ec.dot}}/>
              <span style={{fontSize:10,color:ec.txt,fontWeight:700}}>{ec.label}</span>
            </div>
          );
        })}
      </div>

      {/* Week 1 */}
      <SectionHead>Week 1 — Days 1–7</SectionHead>
      {week1.map(d=><DayRow key={d.id} dish={d} cycleStart={cycleStart}/>)}

      {/* Week 2 */}
      {week2.length>0 && <>
        <SectionHead style={{marginTop:16}}>Week 2 — Days 8–14</SectionHead>
        {week2.map(d=><DayRow key={d.id} dish={d} cycleStart={cycleStart}/>)}
      </>}

      {/* AI Suggestions */}
      <div style={{background:"white",border:"1px solid var(--border)",borderRadius:16,padding:14,marginTop:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:suggestions.length?12:0}}>
          <div style={{fontFamily:"'Lora',serif",fontSize:15,fontWeight:600,color:"var(--dark)"}}>✨ AI Suggestions</div>
          <button onClick={getSuggestions} disabled={loading} style={{
            display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,
            background:loading?"var(--sage-l)":"var(--sage)",
            color:loading?"var(--sage)":"white",
            border:loading?"1px solid var(--sage-m)":"none",
            fontSize:12,fontWeight:600,cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif"
          }}>
            {loading&&<Spinner size={12}/>} {loading?"Thinking…":"Get Suggestions"}
          </button>
        </div>
        {suggestions.map((s,i)=>(
          <div key={i} style={{background:"var(--sage-l)",border:"1px solid var(--sage-m)",
            borderRadius:10,padding:"10px 12px",marginTop:8}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--sage)"}}>
              + {s.dish} <span style={{fontWeight:400,color:"var(--gray)"}}>instead of {s.replaces}</span>
            </div>
            <div style={{fontSize:12,color:"var(--dark)",marginTop:3,lineHeight:1.5}}>{s.reason}</div>
          </div>
        ))}
      </div>

      {/* Quick lunch ideas toggle */}
      <div style={{marginTop:16}}>
        <button onClick={()=>setShowLunch(p=>!p)} style={{
          width:"100%",padding:"12px 14px",borderRadius:14,
          background:"var(--terra-l)",border:"1px solid var(--terra-m)",
          display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif"
        }}>
          <span style={{fontSize:13,fontWeight:600,color:"var(--terra)"}}>☀️ Quick Lunch Ideas (~250 cal)</span>
          <span style={{fontSize:16,color:"var(--terra)"}}>{showLunch?"▲":"▼"}</span>
        </button>
        {showLunch && (
          <div style={{background:"white",border:"1px solid var(--border)",borderTopWidth:0,
            borderRadius:"0 0 14px 14px",overflow:"hidden"}}>
            {LUNCH_IDEAS.map((l,i)=>(
              <div key={i} style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 14px",borderBottom:i<LUNCH_IDEAS.length-1?"1px solid var(--border)":"none"
              }}>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:"var(--dark)"}}>{l.name}</div>
                  <div style={{fontSize:11,color:"var(--gray)",marginTop:2}}>
                    {l.cal} cal · ⏱ {l.prep} {l.pack?"· 🎒 packable":"· 🏠 home only"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{height:20}}/>
    </div>
  );
}

function DayRow({dish, cycleStart}) {
  const ec = EXP[dish.exp];
  const isToday = cycleStart && Math.floor((Date.now()-new Date(cycleStart).getTime())/86400000)===dish.dayNum-1;
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:10,
      background:isToday?"var(--sage-l)":"white",
      border:`1.5px solid ${isToday?"var(--sage-m)":"var(--border)"}`,
      borderRadius:12,padding:"10px 14px",marginBottom:6
    }}>
      <div style={{width:30,height:30,borderRadius:9,flexShrink:0,
        background:isToday?"var(--sage)":"var(--cream)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:10,fontWeight:700,color:isToday?"white":"var(--gray)"}}>
        D{dish.dayNum}
      </div>
      <div style={{fontSize:20,flexShrink:0}}>{dish.emoji}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600,color:"var(--dark)"}}>{dish.name}</div>
        {isToday && <div style={{fontSize:10,color:"var(--sage)",fontWeight:700,marginTop:2}}>← Tonight</div>}
      </div>
      <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,fontWeight:700,
        background:ec.bg,color:ec.txt,border:`1px solid ${ec.bdr}`,flexShrink:0}}>
        {dish.exp==="short"?"⚠️":""}{"short|medium|long".split("|")[EXP_ORDER[dish.exp]]==="short"?"Early":dish.exp==="medium"?"Mid":"Late"}
      </span>
    </div>
  );
}

function SectionHead({children, style:s}) {
  return (
    <div style={{fontSize:11,fontWeight:700,color:"var(--gray)",textTransform:"uppercase",
      letterSpacing:"0.09em",marginBottom:10,...s}}>{children}</div>
  );
}

// ── GROCERY TAB ──────────────────────────────────────────────────────────────
function GroceryTab({dishes, menu, grocery, setGrocery}) {
  const [sub, setSub] = useState("nofrills");
  const [gen, setGen] = useState(false);
  const [err, setErr] = useState(null);
  const [costcoChk, setCostcoChk] = useState({});

  useEffect(()=>{ db.get(KEYS.COSTCO).then(d=>{if(d)setCostcoChk(d);}); },[]);

  const generate = async () => {
    if (!menu.length){setErr("Select dishes first.");return;}
    setGen(true); setErr(null);
    try {
      const names = menu.map(id=>dishes.find(d=>d.id===id)?.name).filter(Boolean);
      const txt = await claude(`
You are a grocery assistant for a vegetarian Indian household (2 people, generous dinners) in Etobicoke, Toronto.
They shop at Jason's No Frills, 1530 Albion Rd. Price match accepted ONLY from: Walmart, Food Basics, Real Canadian Superstore. NEVER FreshCo.

Generate a complete grocery list for these 14 dinners: ${names.join(", ")}

Fixed items to always include:
- Eggs: 1 × 30-pack (or 2 × 15-pack)
- Greek yogurt: 2 × 650g (snack with fruit)
- Fresh fruit (strawberries or blueberries — whichever is on deal)

Search flipp.com for current deals in Etobicoke from Walmart, Food Basics, or Real Canadian Superstore only.

Rules:
- Onions/potatoes/garlic: flag bulkTip suggesting a larger bag for 2-week supply
- Items with short expiry (bhindi, methi leaves, paneer, broccoli, cauliflower, fresh herbs): set shortExpiry:true
- Consolidate same ingredient across all dishes (e.g. total onions for all dishes combined)
- Group into: Produce, Dairy & Eggs, Dry Goods & Pulses, Bread & Bakery, Frozen, Other

Return ONLY valid JSON:
{
  "categories":[{"name":"Produce","items":[
    {"name":"Onions","qty":"5 lb bag","estimatedPrice":4.49,"shortExpiry":false,"bulkTip":"Consider 10 lb bag for 2-week supply","deal":{"store":"Walmart","salePrice":2.97,"savings":"Save $1.52"}},
    {"name":"Bhindi (Okra)","qty":"1 lb","estimatedPrice":3.49,"shortExpiry":true,"bulkTip":null,"deal":null}
  ]}],
  "totalEstimated":148.00,
  "totalWithDeals":121.00,
  "topDeals":[{"item":"Onions","store":"Walmart","savings":"Save $1.52"}],
  "shortExpiryNote":"Schedule bhindi and cauliflower dishes in Days 1–4"
}`, true, 4000);
      const parsed = parseJSON(txt);
      const withChecked = {
        ...parsed,
        categories: parsed.categories.map(c=>({...c, items:c.items.map(i=>({...i,checked:false}))}))
      };
      setGrocery(withChecked);
      await db.set(KEYS.GROCERY, withChecked);
    } catch(e) { setErr("Failed — please try again."); console.error(e); }
    finally { setGen(false); }
  };

  const toggleItem = async (ci, ii) => {
    if (!grocery) return;
    const updated = {
      ...grocery,
      categories: grocery.categories.map((c,ci2)=>ci2!==ci?c:{
        ...c, items:c.items.map((it,ii2)=>ii2!==ii?it:{...it,checked:!it.checked})
      })
    };
    setGrocery(updated);
    await db.set(KEYS.GROCERY, updated);
  };

  const toggleCostco = async (id) => {
    const updated = {...costcoChk, [id]:!costcoChk[id]};
    setCostcoChk(updated);
    await db.set(KEYS.COSTCO, updated);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Sub-tab bar */}
      <div style={{display:"flex",background:"white",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {[["nofrills","🛒 No Frills"],["costco","🏬 Costco"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setSub(id)} style={{
            flex:1,padding:"12px",border:"none",cursor:"pointer",
            borderBottom:sub===id?"2.5px solid var(--sage)":"2.5px solid transparent",
            background:"transparent",fontSize:13,fontWeight:600,
            color:sub===id?"var(--sage)":"var(--gray)",fontFamily:"'DM Sans',sans-serif"
          }}>{lbl}</button>
        ))}
      </div>
      <div style={{flex:1,overflow:"hidden"}}>
        {sub==="nofrills"
          ? <NoFrillsTab grocery={grocery} gen={gen} err={err} onGenerate={generate} onToggle={toggleItem}/>
          : <CostcoTab checked={costcoChk} onToggle={toggleCostco}/>
        }
      </div>
    </div>
  );
}

function NoFrillsTab({grocery, gen, err, onGenerate, onToggle}) {
  if (gen) return (
    <div style={{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
      <div style={{fontSize:44,marginBottom:14}}>🛒</div>
      <div style={{fontFamily:"'Lora',serif",fontSize:17,fontWeight:700,color:"var(--sage)",marginBottom:6}}>Finding the best deals…</div>
      <div style={{fontSize:13,color:"var(--gray)",marginBottom:20}}>Searching Flipp · Walmart · Food Basics · Real Canadian Superstore</div>
      <Spinner size={26}/>
    </div>
  );

  if (!grocery) return (
    <div style={{height:"100%",overflowY:"auto",padding:16}}>
      {err && <div style={{background:"var(--red-l)",border:"1px solid var(--red-m)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,color:"var(--red)"}}>⚠️ {err}</div>}
      <EmptyState emoji="🛒" title="No grocery list yet" sub="Select your 14 dishes, then generate your list with Flipp deals">
        <PrimaryBtn onClick={onGenerate}>Generate Grocery List + Flipp Deals</PrimaryBtn>
      </EmptyState>
    </div>
  );

  const savings = ((grocery.totalEstimated||0)-(grocery.totalWithDeals||0));
  const total = grocery.categories?.reduce((acc,c)=>acc+(c.items?.filter(i=>!i.checked).length||0),0)||0;
  const done = grocery.categories?.reduce((acc,c)=>acc+(c.items?.filter(i=>i.checked).length||0),0)||0;

  return (
    <div style={{height:"100%",overflowY:"auto",padding:16}}>
      {/* Savings banner */}
      <div style={{background:"linear-gradient(135deg,var(--sage-l),#e2ead f)",border:"1px solid var(--sage-m)",
        borderRadius:14,padding:14,marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",textAlign:"center",marginBottom:8}}>
          {[["Est.`",`$${(grocery.totalEstimated||0).toFixed(2)}`,"var(--gray)"],
            ["With Deals",`$${(grocery.totalWithDeals||0).toFixed(2)}`,"var(--sage)"],
            ["Saved",`$${savings.toFixed(2)}`,"var(--terra)"]].map(([l,v,c])=>(
            <div key={l}>
              <div style={{fontSize:10,color:"var(--gray)",marginBottom:2}}>{l}</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:19,fontWeight:700,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:"var(--gray)",textAlign:"center"}}>
          Jason's No Frills · Price match: Walmart / Food Basics / RCSS
        </div>
        {/* Progress */}
        <div style={{marginTop:10}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--gray)",marginBottom:4}}>
            <span>{done} of {done+total} items checked</span>
            <span>{done+total>0?Math.round(done/(done+total)*100):0}%</span>
          </div>
          <div style={{background:"var(--sage-m)",borderRadius:20,height:5}}>
            <div style={{background:"var(--sage)",borderRadius:20,height:5,
              width:`${done+total>0?Math.round(done/(done+total)*100):0}%`,transition:"width .3s"}}/>
          </div>
        </div>
      </div>

      {/* Short expiry warning */}
      {grocery.shortExpiryNote && (
        <div style={{background:"var(--red-l)",border:"1px solid var(--red-m)",borderRadius:10,
          padding:"9px 14px",marginBottom:14,fontSize:12,color:"var(--red)",fontWeight:500}}>
          ⚠️ {grocery.shortExpiryNote}
        </div>
      )}

      {/* Top deals */}
      {grocery.topDeals?.length>0 && (
        <div style={{marginBottom:16}}>
          <SectionHead>🔥 Top Deals This Week</SectionHead>
          {grocery.topDeals.map((d,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"8px 12px",borderRadius:9,background:"var(--terra-l)",border:"1px solid var(--terra-m)",marginBottom:5}}>
              <span style={{fontSize:13,color:"var(--dark)"}}><strong>{d.item}</strong> <span style={{color:"var(--gray)"}}>@ {d.store}</span></span>
              <span style={{fontSize:12,fontWeight:700,color:"var(--terra)"}}>{d.savings}</span>
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      {grocery.categories?.map((cat,ci)=>(
        <div key={ci} style={{marginBottom:18}}>
          <SectionHead>{cat.name}</SectionHead>
          <div style={{background:"white",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden"}}>
            {cat.items?.map((item,ii)=>(
              <div key={ii} onClick={()=>onToggle(ci,ii)} style={{
                display:"flex",alignItems:"center",gap:10,
                padding:"11px 14px",cursor:"pointer",
                borderBottom:ii<cat.items.length-1?"1px solid var(--border)":"none",
                opacity:item.checked?0.4:1, background:item.checked?"#fafafa":"white",
                transition:"opacity .15s"
              }}>
                <Check checked={item.checked} size={20}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:14,fontWeight:500,color:"var(--dark)",
                      textDecoration:item.checked?"line-through":"none"}}>{item.name}</span>
                    {item.shortExpiry && <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,
                      fontWeight:700,background:"var(--red-l)",color:"var(--red)",border:"1px solid var(--red-m)"}}>⚠️ Short Expiry</span>}
                  </div>
                  <div style={{fontSize:12,color:"var(--gray)",marginTop:2}}>{item.qty}</div>
                  {item.bulkTip && <div style={{fontSize:11,color:"var(--terra)",marginTop:2}}>💡 {item.bulkTip}</div>}
                  {item.deal && <div style={{fontSize:11,color:"var(--sage)",fontWeight:600,marginTop:2}}>
                    🏷 {item.deal.store} · ${item.deal.salePrice} · {item.deal.savings}
                  </div>}
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  {item.deal
                    ? <><div style={{fontFamily:"'Lora',serif",fontSize:15,fontWeight:700,color:"var(--sage)"}}>${item.deal.salePrice}</div>
                        <div style={{fontSize:11,color:"#ccc",textDecoration:"line-through"}}>${item.estimatedPrice}</div></>
                    : <div style={{fontFamily:"'Lora',serif",fontSize:15,fontWeight:600,color:"var(--dark)"}}>${item.estimatedPrice}</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={onGenerate} style={{width:"100%",padding:"11px",borderRadius:12,
        background:"transparent",border:"1.5px dashed var(--border)",color:"var(--gray)",
        fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:4}}>
        ↻ Regenerate List
      </button>
      <div style={{height:20}}/>
    </div>
  );
}

function CostcoTab({checked, onToggle}) {
  return (
    <div style={{height:"100%",overflowY:"auto",padding:16}}>
      <div style={{background:"var(--terra-l)",border:"1px solid var(--terra-m)",borderRadius:12,
        padding:"10px 14px",marginBottom:14,fontSize:12,color:"var(--terra)",fontWeight:500}}>
        🏬 Buy on your next Costco run — not part of the bi-weekly No Frills trip
      </div>
      <div style={{background:"white",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden"}}>
        {COSTCO_ITEMS.map((item,i)=>(
          <div key={item.id} onClick={()=>onToggle(item.id)} style={{
            display:"flex",alignItems:"center",gap:12,padding:"13px 14px",cursor:"pointer",
            borderBottom:i<COSTCO_ITEMS.length-1?"1px solid var(--border)":"none",
            opacity:checked[item.id]?0.4:1
          }}>
            <Check checked={!!checked[item.id]} color="terra" size={20}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500,color:"var(--dark)",
                textDecoration:checked[item.id]?"line-through":"none"}}>{item.name}</div>
              <div style={{fontSize:12,color:"var(--gray)",marginTop:2}}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:20}}/>
    </div>
  );
}

// ── PREP TAB ─────────────────────────────────────────────────────────────────
function PrepTab({dishes, menu}) {
  const [week, setWeek] = useState(1);
  const [prep, setPrep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chk, setChk] = useState({});

  useEffect(()=>{ db.get(KEYS.PREP).then(d=>{if(d)setPrep(d);}); },[]);

  const generate = async () => {
    if (!menu.length) return;
    setLoading(true);
    try {
      const names = menu.map(id=>dishes.find(d=>d.id===id)?.name).filter(Boolean);
      const txt = await claude(`
You are a batch prep assistant for a Gujarati vegetarian couple in Toronto.
Their 14-day dinner plan: ${names.join(", ")}

These are mostly Gujarati dishes. The universal base is: onion, tomato, green chilli, ginger-garlic paste, dhania (coriander).
They have a freezer available.

Generate a Sunday batch prep guide split into Week 1 (first Sunday) and Week 2 (second Sunday).
For each week: list items to chop/prep with exact quantities calculated from the dishes that week, how to store, how long it lasts, and which dishes use it.
Week 1 should also include making a freezer masala base.

Return ONLY valid JSON:
{
  "week1":{
    "estimatedTime":"35 min",
    "savingsPerDay":"saves ~18 min/day",
    "items":[
      {"name":"Onions (finely chopped)","qty":"4 medium (~600g)","how":"Fine dice","storage":"Airtight container, fridge","lasts":"7–10 days","usedIn":["Sev Usal","Dal Bati"]},
      {"name":"Green Chilli (slit)","qty":"12–15 chillies","how":"Slit or rough chop, store in 1 tsp oil","storage":"Small jar, fridge","lasts":"10–12 days","usedIn":["Most dishes"]}
    ],
    "freezerBase":{
      "name":"Onion-Tomato Masala Base",
      "makes":"8–10 portions (ice cube tray)",
      "instructions":"Heat 2 tbsp oil. Add 3 large chopped onions — cook 8 min until golden. Add 1 tbsp ginger-garlic paste, 1 tsp turmeric, 1 tsp cumin powder, 1 tsp coriander powder. Stir 1 min. Add 4 large chopped tomatoes + salt. Cook covered 12–15 min until mushy. Cool completely. Spoon into ice cube tray or zip bags. Freeze.",
      "lasts":"3 months frozen",
      "usedIn":["Sev Usal","Pav Bhaji","Paneer Sabji","Dal Bati"]
    }
  },
  "week2":{
    "estimatedTime":"20 min",
    "savingsPerDay":"saves ~15 min/day",
    "items":[]
  }
}`, false, 2000);
      const parsed = parseJSON(txt);
      setPrep(parsed);
      await db.set(KEYS.PREP, parsed);
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  const toggleChk = (id) => setChk(p=>({...p,[id]:!p[id]}));

  if (!menu.length) return (
    <div style={{flex:1,overflow:"auto",padding:16}}>
      <EmptyState emoji="🥗" title="No dishes selected" sub="Select your 14 dishes in the Library tab first"/>
    </div>
  );

  if (loading) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
      <div style={{fontSize:44,marginBottom:14}}>🥗</div>
      <div style={{fontFamily:"'Lora',serif",fontSize:17,fontWeight:700,color:"var(--sage)",marginBottom:6}}>Calculating prep quantities…</div>
      <Spinner size={26}/>
    </div>
  );

  if (!prep) return (
    <div style={{flex:1,overflow:"auto",padding:16}}>
      <EmptyState emoji="🥗" title="Batch Prep Guide" sub="One Sunday session → saves 15–20 min every single day this week">
        <PrimaryBtn onClick={generate}>Generate Sunday Prep Guide</PrimaryBtn>
      </EmptyState>
    </div>
  );

  const wd = prep[`week${week}`];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Week toggle */}
      <div style={{display:"flex",background:"white",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {[1,2].map(w=>(
          <button key={w} onClick={()=>setWeek(w)} style={{
            flex:1,padding:"12px",border:"none",cursor:"pointer",
            borderBottom:week===w?"2.5px solid var(--sage)":"2.5px solid transparent",
            background:"transparent",fontSize:13,fontWeight:600,
            color:week===w?"var(--sage)":"var(--gray)",fontFamily:"'DM Sans',sans-serif"
          }}>Week {w} · Sunday Prep</button>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:16}}>
        {/* Time banner */}
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,
          padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>⏱️</span>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#92400e"}}>Total today: {wd?.estimatedTime}</div>
            <div style={{fontSize:12,color:"#a16207"}}>{wd?.savingsPerDay}</div>
          </div>
        </div>

        {/* Items */}
        {wd?.items?.map((item,i)=>{
          const id=`w${week}-${i}`;
          return (
            <div key={i} onClick={()=>toggleChk(id)} style={{
              background:chk[id]?"#fafafa":"white",border:"1px solid var(--border)",
              borderRadius:14,padding:"12px 14px",marginBottom:8,cursor:"pointer",opacity:chk[id]?0.45:1
            }}>
              <div style={{display:"flex",gap:12}}>
                <Check checked={!!chk[id]} size={22}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:"var(--dark)"}}>{item.name}</div>
                  <div style={{fontSize:13,color:"var(--terra)",fontWeight:600,marginTop:3}}>{item.qty}</div>
                  <div style={{fontSize:12,color:"var(--gray)",marginTop:3,lineHeight:1.5}}>
                    {item.how} · {item.storage} · Lasts {item.lasts}
                  </div>
                  {item.usedIn?.length>0 && (
                    <div style={{fontSize:11,color:"var(--gray)",marginTop:4}}>Used in: {item.usedIn.join(", ")}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Freezer masala base (Week 1) */}
        {week===1 && wd?.freezerBase && (() => {
          const fb = wd.freezerBase;
          const id = "freezer-base";
          return (
            <div style={{background:"var(--sage-l)",border:"1px solid var(--sage-m)",borderRadius:14,padding:14,marginTop:4}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontFamily:"'Lora',serif",fontSize:15,fontWeight:700,color:"var(--sage)"}}>
                  ❄️ {fb.name}
                </div>
                <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:700,
                  background:"white",color:"var(--sage)",border:"1px solid var(--sage-m)"}}>{fb.lasts}</span>
              </div>
              <div style={{fontSize:12,color:"var(--dark)",lineHeight:1.8,marginBottom:8}}>{fb.instructions}</div>
              <div style={{fontSize:11,fontWeight:600,color:"var(--sage)"}}>Makes: {fb.makes}</div>
              <div style={{fontSize:11,color:"var(--gray)",marginTop:3}}>Use for: {fb.usedIn?.join(", ")}</div>
            </div>
          );
        })()}

        <button onClick={generate} style={{width:"100%",padding:"11px",borderRadius:12,marginTop:16,
          background:"transparent",border:"1.5px dashed var(--border)",color:"var(--gray)",
          fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>↻ Regenerate Prep Guide</button>
        <div style={{height:20}}/>
      </div>
    </div>
  );
}

// ── RECIPE TAB ────────────────────────────────────────────────────────────────
function RecipeTab({dishes, menu, cycleStart}) {
  const [dayIdx, setDayIdx] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const ordered = [...menu]
    .map(id=>dishes.find(d=>d.id===id)).filter(Boolean)
    .sort((a,b)=>EXP_ORDER[a.exp]-EXP_ORDER[b.exp]);

  // auto-select today
  useEffect(()=>{
    if (!cycleStart||!ordered.length) return;
    const d = Math.floor((Date.now()-new Date(cycleStart).getTime())/86400000);
    setDayIdx(Math.min(Math.max(d,0),ordered.length-1));
  },[cycleStart, menu.length]);

  const getRecipe = async (dish) => {
    setLoading(true); setRecipe(null);
    try {
      const txt = await claude(`
Generate a detailed recipe for "${dish.name}" for 2 people (generous dinner portions).
This is a vegetarian ${dish.cat==="fusion"?"fusion":"Gujarati/Indian"} dish. Eggs are allowed.

Mark ingredients typically batch-prepped on Sunday (onion, tomato, green chilli, ginger-garlic) with isBatchPrepped:true.

Return ONLY valid JSON:
{
  "name":"${dish.name}",
  "servings":"2 generous portions",
  "prepTime":"10 min",
  "cookTime":"20 min",
  "totalTime":"30 min",
  "ingredients":[
    {"name":"Onion (chopped)","qty":"1 large","isBatchPrepped":true},
    {"name":"Oil","qty":"2 tbsp","isBatchPrepped":false}
  ],
  "steps":[
    {"step":1,"instruction":"Heat oil in a kadai or pan on medium-high heat.","duration":"1 min","tip":null},
    {"step":2,"instruction":"Add the pre-chopped onion from your Sunday batch prep.","duration":"6 min","tip":"Stir until golden brown — this is the base flavour"}
  ],
  "batchPrepNote":"Onion, tomato, and green chilli are ready from Sunday prep. Pull from fridge. If you made the freezer masala base, use 2 cubes instead of steps 2–4.",
  "storage":"Leftovers keep well for 2 days in fridge. Reheat with a splash of water."
}`, false, 2000);
      setRecipe(parseJSON(txt));
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  useEffect(()=>{
    if (dayIdx!==null && ordered[dayIdx]) getRecipe(ordered[dayIdx]);
  },[dayIdx]);

  if (!menu.length) return (
    <div style={{flex:1,overflow:"auto",padding:16}}>
      <EmptyState emoji="🍽" title="No dishes selected" sub="Select your 14 dishes in the Library tab to see recipes"/>
    </div>
  );

  const todayOffset = cycleStart ? Math.floor((Date.now()-new Date(cycleStart).getTime())/86400000) : -1;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Day picker */}
      <div style={{padding:"12px 16px 10px",background:"white",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div style={{fontSize:10,fontWeight:700,color:"var(--gray)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>
          Pick a Day
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {ordered.map((d,i)=>{
            const isToday = i===todayOffset;
            const isSel = i===dayIdx;
            return (
              <button key={d.id} onClick={()=>setDayIdx(i)} style={{
                flexShrink:0,width:48,height:52,borderRadius:12,cursor:"pointer",
                border:isSel?"none":"1.5px solid var(--border)",
                background:isSel?"var(--sage)":isToday?"var(--sage-l)":"white",
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,
                fontFamily:"'DM Sans',sans-serif"
              }}>
                <span style={{fontSize:18}}>{d.emoji}</span>
                <span style={{fontSize:9,fontWeight:700,color:isSel?"white":isToday?"var(--sage)":"var(--gray)"}}>
                  {isToday?"Today":`D${i+1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipe content */}
      <div style={{flex:1,overflowY:"auto",padding:16}}>
        {dayIdx===null
          ? <EmptyState emoji="👆" title="Select a day" sub="Tap any day above to load that evening's recipe"/>
          : loading
          ? <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:40,marginBottom:14}}>{ordered[dayIdx]?.emoji}</div>
              <div style={{fontFamily:"'Lora',serif",fontSize:16,color:"var(--sage)",fontWeight:600,marginBottom:12}}>
                Loading recipe…
              </div>
              <Spinner size={24}/>
            </div>
          : recipe && (
            <div className="fu">
              {/* Header */}
              <div style={{background:"linear-gradient(135deg,var(--sage),#2d5126)",
                borderRadius:16,padding:16,marginBottom:16,color:"white"}}>
                <div style={{fontSize:11,fontWeight:700,opacity:.75,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>
                  {dayIdx===todayOffset?"Tonight's Dinner":`Day ${dayIdx+1}`}
                </div>
                <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:700,marginBottom:10}}>
                  {recipe.name}
                </div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,opacity:.85}}>⏱ Prep {recipe.prepTime}</span>
                  <span style={{fontSize:12,opacity:.85}}>🔥 Cook {recipe.cookTime}</span>
                  <span style={{fontSize:12,opacity:.85}}>👥 {recipe.servings}</span>
                </div>
              </div>

              {/* Batch prep note */}
              {recipe.batchPrepNote && (
                <div style={{background:"var(--sage-l)",border:"1px solid var(--sage-m)",
                  borderRadius:12,padding:"10px 14px",marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--sage)",marginBottom:4}}>🟢 Batch Prep Shortcut</div>
                  <div style={{fontSize:12,color:"var(--dark)",lineHeight:1.7}}>{recipe.batchPrepNote}</div>
                </div>
              )}

              {/* Ingredients */}
              <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:700,color:"var(--dark)",marginBottom:10}}>
                Ingredients
              </div>
              <div style={{background:"white",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden",marginBottom:20}}>
                {recipe.ingredients?.map((ing,i)=>(
                  <div key={i} style={{
                    display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"10px 14px",
                    borderBottom:i<recipe.ingredients.length-1?"1px solid var(--border)":"none",
                    background:ing.isBatchPrepped?"var(--sage-l)":"white"
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      {ing.isBatchPrepped&&<span style={{fontSize:13}}>🟢</span>}
                      <span style={{fontSize:13,fontWeight:500,color:"var(--dark)"}}>{ing.name}</span>
                      {ing.isBatchPrepped&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:20,
                        fontWeight:700,background:"white",color:"var(--sage)",border:"1px solid var(--sage-m)"}}>Prepped</span>}
                    </div>
                    <span style={{fontSize:12,color:"var(--gray)",flexShrink:0,maxWidth:"45%",textAlign:"right"}}>{ing.qty}</span>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:700,color:"var(--dark)",marginBottom:12}}>
                Method
              </div>
              {recipe.steps?.map((s,i)=>(
                <div key={i} style={{
                  display:"flex",gap:12,marginBottom:14,
                  paddingBottom:14,
                  borderBottom:i<recipe.steps.length-1?"1px solid var(--border)":"none"
                }}>
                  <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                    background:"var(--sage)",color:"white",display:"flex",alignItems:"center",
                    justifyContent:"center",fontWeight:700,fontSize:12,marginTop:1}}>{s.step}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:"var(--dark)",lineHeight:1.65}}>{s.instruction}</div>
                    <div style={{display:"flex",gap:7,marginTop:5,flexWrap:"wrap"}}>
                      {s.duration&&<span style={{fontSize:11,color:"var(--gray)",background:"var(--cream)",
                        padding:"2px 8px",borderRadius:6,border:"1px solid var(--border)"}}>⏱ {s.duration}</span>}
                      {s.tip&&<span style={{fontSize:11,color:"var(--terra)",fontStyle:"italic"}}>💡 {s.tip}</span>}
                    </div>
                  </div>
                </div>
              ))}

              {recipe.storage && (
                <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:10,
                  padding:"10px 14px",fontSize:12,color:"#0369a1",marginTop:4}}>
                  📦 {recipe.storage}
                </div>
              )}
              <div style={{height:20}}/>
            </div>
          )
        }
      </div>
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("library");
  const [dishes, setDishes] = useState([]);
  const [menu, setMenu] = useState([]);
  const [grocery, setGrocery] = useState(null);
  const [cycleStart, setCycleStart] = useState(null);
  const [ready, setReady] = useState(false);

  // Init: load from shared storage or seed defaults
  useEffect(()=>{
    (async()=>{
      const [d,m,g,c] = await Promise.all([
        db.get(KEYS.DISHES), db.get(KEYS.MENU),
        db.get(KEYS.GROCERY), db.get(KEYS.CYCLE),
      ]);
      setDishes(d || DISHES_SEED);
      setMenu(m || []);
      setGrocery(g || null);
      setCycleStart(c || null);
      setReady(true);
    })();
  },[]);

  const toggleMenu = async (id) => {
    const isIn = menu.includes(id);
    if (!isIn && menu.length>=14) return;
    const upd = isIn ? menu.filter(x=>x!==id) : [...menu,id];
    setMenu(upd); await db.set(KEYS.MENU, upd);
  };

  const addDish = async (dish) => {
    const upd = [...dishes, dish];
    setDishes(upd); await db.set(KEYS.DISHES, upd);
  };

  const startCycle = async () => {
    const now = new Date().toISOString();
    setCycleStart(now); await db.set(KEYS.CYCLE, now);
  };

  if (!ready) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      height:"100dvh",background:"var(--cream)"}}>
      <div style={{fontSize:44,marginBottom:16}}>🥗</div>
      <Spinner size={28}/>
      <div style={{fontSize:13,color:"var(--gray)",marginTop:12,fontFamily:"'DM Sans',sans-serif"}}>
        Loading your kitchen…
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:480,margin:"0 auto",height:"100dvh",display:"flex",
      flexDirection:"column",background:"var(--cream)",fontFamily:"'DM Sans',sans-serif"}}>
      {/* Header */}
      <div style={{background:"var(--sage)",padding:"14px 16px 12px",flexShrink:0,
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,color:"white"}}>
            🏠 Kitchen Hub
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.72)",marginTop:1}}>
            Etobicoke · 2 people · Vegetarian
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:12,fontWeight:700,color:"white",background:"rgba(255,255,255,0.18)",
            borderRadius:8,padding:"5px 11px"}}>
            {menu.length}/14 dishes
          </div>
          {cycleStart && (
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:3}}>
              Since {new Date(cycleStart).toLocaleDateString("en-CA",{month:"short",day:"numeric"})}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {tab==="library" && <LibraryTab dishes={dishes} menu={menu} onToggle={toggleMenu} onAdd={addDish}/>}
        {tab==="menu"    && <MenuTab dishes={dishes} menu={menu} cycleStart={cycleStart} onStartCycle={startCycle}/>}
        {tab==="grocery" && <GroceryTab dishes={dishes} menu={menu} grocery={grocery} setGrocery={setGrocery}/>}
        {tab==="prep"    && <PrepTab dishes={dishes} menu={menu}/>}
        {tab==="recipe"  && <RecipeTab dishes={dishes} menu={menu} cycleStart={cycleStart}/>}
      </div>

      {/* Bottom Tab Bar */}
      <div style={{display:"flex",background:"white",flexShrink:0,
        borderTop:"1px solid var(--border)",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:"9px 4px 7px",border:"none",background:"transparent",
            cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3
          }}>
            <span style={{fontSize:20,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
              color:tab===t.id?"var(--sage)":"var(--gray)"}}>
              {t.label}
            </span>
            {tab===t.id && <div style={{width:18,height:2.5,borderRadius:2,background:"var(--sage)"}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
