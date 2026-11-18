/* ============================================================
   THE NESBITT CODEX — APP
   ============================================================ */
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/&(?![a-z#]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const TERMMAP={};TERMS.forEach(t=>TERMMAP[t[0]]=t);
const CATCLS={spec:"ir",inst:"inst",species:"ir",struct:"theory",quantum:"nano",theory:"theory",iface:"dyn",nano:"nano",bio:"bio",you:"you",hub:"inst","pil-ir":"ir","pil-dyn":"dyn","pil-nano":"nano","pil-bio":"bio"};
const CATNAME={spec:"Spectroscopy method",inst:"Instrumentation",species:"Molecular species",struct:"Structure & dynamics",quantum:"Quantum & symmetry",theory:"Theory & computation",iface:"Interfaces",nano:"Nanoscience",bio:"Biophysics",you:"Your expertise",hub:"Core","pil-ir":"Research pillar","pil-dyn":"Research pillar","pil-nano":"Research pillar","pil-bio":"Research pillar"};

/* ---------- term linkification ---------- */
const ALIASES=[["slit-jet supersonic expansion","slitjet"],["slit jet","slitjet"],["slit-jet","slitjet"],
["sub-Doppler","subdoppler"],["concentration modulation","concmod"],["discharge slit jet","dischargejet"],
["difference-frequency generation","dfg"],["difference frequency generation","dfg"],
["optical parametric oscillator","opo"],["periodically-poled lithium niobate","ppln"],["periodically poled lithium niobate","ppln"],
["frequency comb","comb"],["buffer-gas cooling","buffergas"],["buffer gas cooling","buffergas"],
["laser desorption","laserdesorb"],["velocity map imaging","vmi"],["time-correlated single photon counting","tcspc"],
["smFRET","smfret"],["stroboscopic smFRET","strobe"],["total-internal-reflection","tirf"],
["van der Waals","vdw"],["hydrogen bond","hbond"],["potential energy surface","pes"],["potential energy surfaces","pes"],
["three-body","threebody"],["non-additivity","threebody"],["internal-rotor","internalrotor"],["internal rotor","internalrotor"],
["large-amplitude","lam"],["ring puckering","puckering"],["puckering","puckering"],["tunneling splitting","tunneling"],
["tunneling splittings","tunneling"],["predissociation","predissoc"],["IVR","ivr"],["Coriolis","coriolis"],
["Fermi resonance","fermi"],["Watson asymmetric-top Hamiltonian","watson"],["Watson asymmetric top Hamiltonian","watson"],
["Watson Hamiltonian","watson"],["rotational constants","rotconst"],["centrifugal distortion","centrifugal"],
["spherical top","tops"],["nuclear spin statistics","nss"],["Bose-Einstein statistics","bosestat"],
["icosahedral symmetry","icosahedral"],["icosahedral","icosahedral"],["ergodicity","ergodicity"],
["nuclear quadrupole coupling","eqq"],["quadrupole coupling","eqq"],["eQq","eqq"],["spin-rotation","spinrot"],
["spin-orbit","spinorbit"],["zero-point","zpe"],["isotopologue","isotopologue"],["isotopologues","isotopologue"],
["Kraitchman","kraitchman"],["rigid-bender","rigidbender"],["rigid bender","rigidbender"],
["effective Hamiltonian","effham"],["effective Hamiltonians","effham"],["band origin","bandorigin"],
["combination differences","combdiff"],["dissociation energy","d0"],["carbene","carbene"],
["resonance-stabilized","resstab"],["trans-HOCO","hoco"],["CH2OH","ch2oh"],["ammonium cation","ammonium"],
["ammonium cations","ammonium"],["C60","c60"],["combustion","combustion"],["interstellar","ism"],
["gas-liquid interface","gasliquid"],["impulsive scattering","is_td"],["trapping-desorption","is_td"],
["subthermal impulsive scattering","stis"],["hot-spot","hotspot"],["lever arm","leverarm"],
["ionic liquid","rtil"],["ionic liquids","rtil"],["liquid microjet","microjet"],["self-assembled monolayer","sam"],
["Landau-Teller","landauteller"],["accommodation coefficient","accommodation"],["non-adiabatic","nonadiabatic"],
["quantum dot","qdot"],["quantum dots","qdot"],["blinking","blinking"],["power law","powerlaw"],
["power-law","powerlaw"],["Auger","auger"],["biexciton","auger"],["biexcitons","auger"],["plasmon","plasmon"],
["plasmonic","plasmon"],["near-field enhancement","nearfield"],["hot electron","hotcarrier"],
["hot-electron","hotcarrier"],["hot carrier","hotcarrier"],["hot carriers","hotcarrier"],
["Rabi splitting","strongcoupling"],["strong coupling","strongcoupling"],["graphene","graphene"],
["Forster","fret"],["riboswitch","riboswitch"],["riboswitches","riboswitch"],["tetraloop","tetraloop"],
["pseudoknot","pseudoknot"],["pseudoknotted","pseudoknot"],["molecular crowding","crowding"],
["crowding","crowding"],["depletion-force","depletion"],["depletion force","depletion"],
["induced fit","inducedfit"],["conformational selection","inducedfit"],["osmolyte","osmolyte"],
["osmolytes","osmolyte"],["van 't Hoff","vanthoff"],["Eyring","vanthoff"],["Maxwell relation","maxwell"],
["heat capacities","heatcap"],["heat capacity","heatcap"],["activation volume","activationvolume"],
["activation volumes","activationvolume"],["hidden-Markov","hmm"],["lock-in","lockin"],
["transfer cavity","transfercavity"],["finesse","finesse"],["noise-equivalent absorption","neas"],
["NITROGEN","nitrogen"],["ab initio","abinitio"],["breath","breath"],["cavity-enhanced direct frequency comb","cedfcs"],
["Fourier-transform microwave","ftmw"],["jet-FTMW","ftmw"],["chirped-pulse","cpftmw"],["radical","radical"],
["radicals","radical"],["T-rot","trot"],["rotational temperature","trot"],["direct absorption","directabs"],
["Doppler broadening","doppler"],["stereodynamics","stereo"],["Renner-Teller","rennerteller"],
["Born-Oppenheimer","bornopp"],["P, Q and R branches","branches"],["R-branch","branches"],["P-branch","branches"]
].filter(a=>TERMMAP[a[1]]).sort((a,b)=>b[0].length-a[0].length);

function linkify(html){
  const parts=String(html).split(/(<[^>]*>)/);
  const used={};
  return parts.map(p=>{
    if(p.startsWith("<"))return p;
    let out=p;
    for(const [phrase,id] of ALIASES){
      if(used[id])continue;
      const rx=new RegExp("(^|[^A-Za-z0-9-])("+phrase.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")(?![A-Za-z0-9-])");
      if(rx.test(out)){out=out.replace(rx,(m,a,b)=>a+'<span class="clickterm" data-t="'+id+'">'+b+'</span>');used[id]=1;}
    }
    return out;
  }).join("");
}

/* ---------- navigation ---------- */
function go(p){
  $$(".page").forEach(s=>s.classList.toggle("on",s.id==="p-"+p));
  $$(".navlink").forEach(n=>n.classList.toggle("on",n.dataset.p===p));
  $("#main").scrollTop=0;$("#sidebar").classList.remove("open");
}
$$(".navlink").forEach(n=>n.addEventListener("click",()=>go(n.dataset.p)));
$("#menubtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));

/* ---------- modal ---------- */
function openTerm(id){
  const t=TERMMAP[id];if(!t)return;
  $("#modalChip").className="chip "+(CATCLS[t[2]]||"");
  $("#modalChip").textContent=CATNAME[t[2]]||t[2];
  $("#modalTitle").innerHTML=esc(t[1]);
  let h="";
  if(t[3])h+='<div class="layer"><div class="lh">Intuition</div><p>'+t[3]+'</p></div>';
  if(t[4])h+='<div class="layer analogy"><div class="lh">Analogy</div><p>'+t[4]+'</p></div>';
  if(t[5])h+='<div class="layer formal"><div class="lh">Formal statement</div><p>'+t[5]+'</p></div>';
  if(t[6])h+='<div class="layer why"><div class="lh">Why it matters in his lab</div><p>'+t[6]+'</p></div>';
  $("#modalBody").innerHTML=h;
  $("#modal").classList.add("on");
}
$("#modalX").addEventListener("click",()=>$("#modal").classList.remove("on"));
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")$("#modal").classList.remove("on");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#modal").classList.remove("on");$("#gresults").classList.remove("on");}});
document.addEventListener("click",e=>{
  const c=e.target.closest(".clickterm");
  if(c){openTerm(c.dataset.t);}
});

/* ---------- counts ---------- */
$("#n-terms").textContent=TERMS.length;
$("#n-pubs").textContent=PUBS.length;
$("#n-people").textContent=ALUMNI.length;
$("#n-map").textContent=NODES.length;
$("#n-qa").textContent=QA.length;
$("#pubCount").textContent=PUBS.length;

/* ---------- pillars ---------- */
$("#pillarMini").innerHTML=PILLARS.map(p=>
 '<div class="pillar '+p[1]+'"><div class="ph2"><div class="num">'+p[2]+'</div><div><h4>'+esc(p[3])+
 '</h4><p>'+esc(p[4])+'</p></div></div><div class="pbody" style="font-size:13.8px;color:var(--tx2)">'+
 linkify(p[5])+'</div></div>').join("");

$("#pillarsFull").innerHTML=PILLARS.map((p,i)=>{
 const sec=(ttl,arr,cls)=>'<h4>'+ttl+'</h4><ul class="tight">'+arr.map(x=>'<li>'+linkify(x)+'</li>').join("")+'</ul>';
 return '<div class="acc'+(i===0?" open":"")+'"><div class="hd"><span class="chip '+p[1]+'">'+p[2]+'</span>'+
 esc(p[3])+'<span class="caret">▶</span></div><div class="bd">'+
 '<div class="note" style="margin-top:14px"><b>The organizing question:</b> '+linkify(p[5])+'</div>'+
 '<div class="grid g2"><div>'+sec("Methods &amp; instruments",p[6])+'</div><div>'+sec("Systems studied",p[7])+'</div></div>'+
 sec("Landmark findings",p[8])+sec("Open questions you could ask about",p[9])+
 '</div></div>';}).join("");

/* ---------- accordions ---------- */
document.addEventListener("click",e=>{
  const hd=e.target.closest(".acc > .hd");
  if(hd&&!e.target.closest(".clickterm"))hd.parentElement.classList.toggle("open");
  const q=e.target.closest(".qa > .q");
  if(q)q.parentElement.classList.toggle("open");
});

/* ---------- timeline + awards ---------- */
$("#tlTrain").innerHTML=TRAIN.map(t=>'<div class="tlitem"><div class="yr">'+esc(t[0])+
 '</div><div class="ti">'+esc(t[1])+'</div><div class="td">'+esc(t[2])+'</div></div>').join("");
$("#awardTbl tbody").innerHTML=AWARDS.map(a=>'<tr><td class="mono">'+esc(a[0])+'</td><td><b>'+esc(a[1])+
 '</b></td><td>'+esc(a[2])+'</td></tr>').join("");

/* ---------- lineage svg ---------- */
$("#lineageSvg").innerHTML=`<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
<path d="M0,0 L6,3 L0,6 z" fill="#2e3f52"/></marker></defs>
<g font-family="system-ui" font-size="11" fill="#a8b8ca">
<rect x="20" y="16" width="150" height="34" rx="8" fill="#161f2d" stroke="#22303f"/>
<text x="95" y="30" text-anchor="middle" fill="#e6edf5" font-size="11.5" font-weight="600">Harvard B.A.</text>
<text x="95" y="43" text-anchor="middle" font-size="10">Chemistry + Physics, 1975</text>
<rect x="20" y="74" width="150" height="34" rx="8" fill="#161f2d" stroke="#22303f"/>
<text x="95" y="88" text-anchor="middle" fill="#e6edf5" font-size="11.5" font-weight="600">Colorado Academy</text>
<text x="95" y="101" text-anchor="middle" font-size="10">High-school teacher, 1975-77</text>
<rect x="20" y="132" width="150" height="34" rx="8" fill="#1c2736" stroke="#ff9e3d"/>
<text x="95" y="146" text-anchor="middle" fill="#ff9e3d" font-size="11.5" font-weight="700">CU Boulder / JILA</text>
<text x="95" y="159" text-anchor="middle" font-size="10">PhD Chemical Physics, 1981</text>
<rect x="20" y="190" width="150" height="34" rx="8" fill="#161f2d" stroke="#22303f"/>
<text x="95" y="204" text-anchor="middle" fill="#e6edf5" font-size="11.5" font-weight="600">NBS (now NIST)</text>
<text x="95" y="217" text-anchor="middle" font-size="10">NRC Postdoc, 1981-82</text>
<rect x="20" y="248" width="150" height="34" rx="8" fill="#161f2d" stroke="#22303f"/>
<text x="95" y="262" text-anchor="middle" fill="#e6edf5" font-size="11.5" font-weight="600">UC Berkeley</text>
<text x="95" y="275" text-anchor="middle" font-size="10">Miller Fellow, 1982-84</text>
<path d="M95,50 L95,74" stroke="#2e3f52" stroke-width="1.5" marker-end="url(#ar)"/>
<path d="M95,108 L95,132" stroke="#2e3f52" stroke-width="1.5" marker-end="url(#ar)"/>
<path d="M95,166 L95,190" stroke="#2e3f52" stroke-width="1.5" marker-end="url(#ar)"/>
<path d="M95,224 L95,248" stroke="#2e3f52" stroke-width="1.5" marker-end="url(#ar)"/>
<path d="M170,265 C300,265 300,160 300,160" stroke="#56b8ff" stroke-width="1.6" fill="none" marker-end="url(#ar)"/>
<rect x="310" y="128" width="190" height="64" rx="10" fill="#1c2736" stroke="#56b8ff"/>
<text x="405" y="150" text-anchor="middle" fill="#56b8ff" font-size="13" font-weight="750">JILA · 1984 - present</text>
<text x="405" y="166" text-anchor="middle" font-size="10">Fellow of JILA · NIST Physicist</text>
<text x="405" y="180" text-anchor="middle" font-size="10">Professor of Chemistry AND Physics</text>
<rect x="310" y="214" width="190" height="52" rx="9" fill="#161f2d" stroke="#22303f"/>
<text x="405" y="233" text-anchor="middle" fill="#7CFF8F" font-size="10.5" font-weight="650">70+ PhD alumni</text>
<text x="405" y="248" text-anchor="middle" font-size="10">12 now faculty · 13 national labs</text>
<text x="405" y="260" text-anchor="middle" font-size="10">29 industry &amp; photonics</text>
<rect x="310" y="36" width="190" height="66" rx="9" fill="#161f2d" stroke="#22303f"/>
<text x="405" y="55" text-anchor="middle" fill="#ffd84d" font-size="10.5" font-weight="650">Intellectual environment</text>
<text x="405" y="70" text-anchor="middle" font-size="10">S. R. Leone · J. T. Hynes</text>
<text x="405" y="83" text-anchor="middle" font-size="10">Berkeley chemical dynamics</text>
<text x="405" y="96" text-anchor="middle" font-size="10">C. B. Moore lineage</text>
<path d="M405,102 L405,128" stroke="#2e3f52" stroke-width="1.5" marker-end="url(#ar)"/>
<path d="M405,192 L405,214" stroke="#2e3f52" stroke-width="1.5" marker-end="url(#ar)"/>
</g></svg>`;

/* ---------- unity svg ---------- */
$("#unitySvg").innerHTML=`<svg viewBox="0 0 980 420" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ar2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
<path d="M0,0 L6,3 L0,6 z" fill="#4ddbc4"/></marker>
<linearGradient id="gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#56b8ff"/><stop offset="1" stop-color="#4ddbc4"/></linearGradient></defs>
<g font-family="system-ui">
<rect x="330" y="150" width="320" height="120" rx="14" fill="#0b1017" stroke="url(#gc)" stroke-width="2"/>
<text x="490" y="180" text-anchor="middle" fill="#4ddbc4" font-size="11" font-weight="700" letter-spacing="1.4">THE SHARED ENGINE</text>
<text x="490" y="205" text-anchor="middle" fill="#e6edf5" font-size="14" font-weight="650">Prepare a single well-defined state</text>
<text x="490" y="226" text-anchor="middle" fill="#e6edf5" font-size="14" font-weight="650">Perturb it · Read out the rate</text>
<text x="490" y="250" text-anchor="middle" fill="#6f8299" font-size="11">quantum state, or single molecule — the same idea</text>

<rect x="40" y="36" width="250" height="84" rx="11" fill="#161f2d" stroke="#ff9e3d"/>
<text x="56" y="58" fill="#ff9e3d" font-size="11" font-weight="700">1 · SPECTROSCOPY</text>
<text x="56" y="76" fill="#a8b8ca" font-size="10.5">State purity via: slit-jet cooling to 10-30 K</text>
<text x="56" y="91" fill="#a8b8ca" font-size="10.5">Readout: sub-Doppler line positions</text>
<text x="56" y="106" fill="#a8b8ca" font-size="10.5">and predissociation linewidths</text>

<rect x="40" y="300" width="250" height="84" rx="11" fill="#161f2d" stroke="#4ddbc4"/>
<text x="56" y="322" fill="#4ddbc4" font-size="11" font-weight="700">2 · INTERFACES</text>
<text x="56" y="340" fill="#a8b8ca" font-size="10.5">State purity via: jet-cooled molecular beam</text>
<text x="56" y="355" fill="#a8b8ca" font-size="10.5">Readout: scattered quantum-state</text>
<text x="56" y="370" fill="#a8b8ca" font-size="10.5">and velocity distributions</text>

<rect x="690" y="36" width="250" height="84" rx="11" fill="#161f2d" stroke="#a98bff"/>
<text x="706" y="58" fill="#a98bff" font-size="11" font-weight="700">3 · NANOSCIENCE</text>
<text x="706" y="76" fill="#a8b8ca" font-size="10.5">State purity via: one particle at a time</text>
<text x="706" y="91" fill="#a8b8ca" font-size="10.5">Readout: photon arrival statistics,</text>
<text x="706" y="106" fill="#a8b8ca" font-size="10.5">photoelectron energy and angle</text>

<rect x="690" y="300" width="250" height="84" rx="11" fill="#161f2d" stroke="#ff6b9d"/>
<text x="706" y="322" fill="#ff6b9d" font-size="11" font-weight="700">4 · BIOPHYSICS</text>
<text x="706" y="340" fill="#a8b8ca" font-size="10.5">State purity via: one immobilized molecule</text>
<text x="706" y="355" fill="#a8b8ca" font-size="10.5">Readout: FRET dwell times,</text>
<text x="706" y="370" fill="#a8b8ca" font-size="10.5">varied with T and P</text>

<path d="M290,80 C340,80 350,150 365,160" stroke="#4ddbc4" stroke-width="1.6" fill="none" opacity=".65" marker-end="url(#ar2)"/>
<path d="M290,340 C340,340 350,270 365,260" stroke="#4ddbc4" stroke-width="1.6" fill="none" opacity=".65" marker-end="url(#ar2)"/>
<path d="M690,80 C640,80 630,150 615,160" stroke="#4ddbc4" stroke-width="1.6" fill="none" opacity=".65" marker-end="url(#ar2)"/>
<path d="M690,340 C640,340 630,270 615,260" stroke="#4ddbc4" stroke-width="1.6" fill="none" opacity=".65" marker-end="url(#ar2)"/>
<text x="490" y="330" text-anchor="middle" fill="#6f8299" font-size="11.5">Four instruments. One experimental philosophy.</text>
<text x="490" y="350" text-anchor="middle" fill="#6f8299" font-size="11.5">Say this out loud in the interview.</text>
</g></svg>`;

/* ---------- slit jet apparatus ---------- */
$("#slitSvg").innerHTML=`<svg viewBox="0 0 980 390" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="exp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9e3d" stop-opacity=".55"/><stop offset="1" stop-color="#ff9e3d" stop-opacity="0"/></linearGradient>
<marker id="ar3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#56b8ff"/></marker>
</defs>
<g font-family="system-ui" font-size="11">
<rect x="0" y="0" width="980" height="390" fill="#0b1017"/>
<!-- vacuum chamber -->
<rect x="150" y="40" width="700" height="300" rx="12" fill="none" stroke="#22303f" stroke-dasharray="6 5"/>
<text x="840" y="60" text-anchor="end" fill="#6f8299" font-size="10.5">vacuum chamber · roots pumps</text>
<!-- gas line -->
<rect x="30" y="150" width="96" height="56" rx="8" fill="#161f2d" stroke="#2e3f52"/>
<text x="78" y="172" text-anchor="middle" fill="#e6edf5" font-size="10.5" font-weight="650">precursor</text>
<text x="78" y="186" text-anchor="middle" fill="#6f8299" font-size="9.5">0.5% in Ne/He</text>
<text x="78" y="199" text-anchor="middle" fill="#6f8299" font-size="9.5">~1 atm backing</text>
<path d="M126,178 L186,178" stroke="#2e3f52" stroke-width="3"/>
<!-- pulsed valve -->
<rect x="186" y="140" width="52" height="76" rx="7" fill="#1c2736" stroke="#ffd84d"/>
<text x="212" y="134" text-anchor="middle" fill="#ffd84d" font-size="10" font-weight="650">slit pulsed valve</text>
<text x="212" y="184" text-anchor="middle" fill="#ffd84d" font-size="16">⬛</text>
<!-- slit jaws + discharge -->
<rect x="246" y="146" width="16" height="26" rx="3" fill="#56b8ff"/>
<rect x="246" y="184" width="16" height="26" rx="3" fill="#56b8ff"/>
<text x="254" y="236" text-anchor="middle" fill="#56b8ff" font-size="10" font-weight="650">slit jaws</text>
<text x="254" y="249" text-anchor="middle" fill="#56b8ff" font-size="9.5">4 cm x 300 microns</text>
<text x="254" y="262" text-anchor="middle" fill="#ff6b9d" font-size="9.5">~500 V discharge</text>
<text x="254" y="275" text-anchor="middle" fill="#ff6b9d" font-size="9.5">(modulated)</text>
<path d="M254,172 L254,184" stroke="#ff6b9d" stroke-width="2" stroke-dasharray="2 2"/>
<!-- expansion fan -->
<path d="M262,150 L560,96 L560,262 L262,206 Z" fill="url(#exp)"/>
<text x="400" y="128" fill="#ff9e3d" font-size="10.5" font-weight="650">supersonic expansion — density falls as 1/r</text>
<text x="400" y="144" fill="#6f8299" font-size="10">many cooling collisions → T-rot = 10-30 K</text>
<!-- laser beam along slit (into page, drawn as horizontal) -->
<rect x="150" y="296" width="700" height="4" rx="2" fill="#4ddbc4" opacity=".9"/>
<text x="300" y="290" fill="#4ddbc4" font-size="10.5" font-weight="650">probe beam propagates ALONG the slit, perpendicular to the expansion → sub-Doppler</text>
<!-- light source -->
<rect x="30" y="274" width="96" height="48" rx="8" fill="#161f2d" stroke="#56b8ff"/>
<text x="78" y="293" text-anchor="middle" fill="#56b8ff" font-size="10.5" font-weight="650">mid-IR source</text>
<text x="78" y="306" text-anchor="middle" fill="#6f8299" font-size="9.5">DFG · Pb-salt diode</text>
<text x="78" y="317" text-anchor="middle" fill="#7CFF8F" font-size="9.5">2025: 2.5 W OPO</text>
<path d="M126,298 L150,298" stroke="#4ddbc4" stroke-width="3"/>
<!-- detector -->
<rect x="860" y="274" width="96" height="48" rx="8" fill="#161f2d" stroke="#2e3f52"/>
<text x="908" y="293" text-anchor="middle" fill="#e6edf5" font-size="10.5" font-weight="650">detector</text>
<text x="908" y="306" text-anchor="middle" fill="#6f8299" font-size="9.5">+ reference beam</text>
<text x="908" y="317" text-anchor="middle" fill="#6f8299" font-size="9.5">lock-in demod.</text>
<path d="M850,298 L860,298" stroke="#4ddbc4" stroke-width="3"/>
<!-- transfer cavity -->
<rect x="600" y="60" width="150" height="60" rx="8" fill="#161f2d" stroke="#ffd84d"/>
<text x="675" y="79" text-anchor="middle" fill="#ffd84d" font-size="10.5" font-weight="650">transfer cavity</text>
<text x="675" y="93" text-anchor="middle" fill="#6f8299" font-size="9.5">locked to stabilized HeNe</text>
<text x="675" y="107" text-anchor="middle" fill="#6f8299" font-size="9.5">→ absolute frequency axis</text>
<path d="M640,120 C470,170 300,225 152,292" stroke="#ffd84d" stroke-width="1.2" fill="none" opacity=".45" stroke-dasharray="4 4"/>
<!-- spectrum -->
<g transform="translate(596,162)">
<text x="0" y="0" fill="#e6edf5" font-size="10.5" font-weight="650">resulting spectrum</text>
<line x1="0" y1="80" x2="230" y2="80" stroke="#2e3f52"/>
<g stroke="#4ddbc4" stroke-width="1.6">
<line x1="14" y1="80" x2="14" y2="56"/><line x1="30" y1="80" x2="30" y2="44"/>
<line x1="46" y1="80" x2="46" y2="30"/><line x1="62" y1="80" x2="62" y2="48"/>
<line x1="78" y1="80" x2="78" y2="62"/><line x1="104" y1="80" x2="104" y2="22"/>
<line x1="120" y1="80" x2="120" y2="38"/><line x1="136" y1="80" x2="136" y2="52"/>
<line x1="160" y1="80" x2="160" y2="66"/><line x1="176" y1="80" x2="176" y2="42"/>
<line x1="192" y1="80" x2="192" y2="58"/><line x1="208" y1="80" x2="208" y2="70"/>
</g>
<text x="0" y="96" fill="#6f8299" font-size="9.5">individual rovibrational lines · ~60 MHz · assignable</text>
<text x="0" y="110" fill="#6f8299" font-size="9.5">band origin fitted to 4 decimals, in cm-1</text>
</g>
</g></svg>`;

/* ---------- FRET diagram ---------- */
$("#fretSvg").innerHTML=`<svg viewBox="0 0 980 330" xmlns="http://www.w3.org/2000/svg">
<g font-family="system-ui" font-size="11">
<rect x="0" y="0" width="980" height="330" fill="#0b1017"/>
<!-- unfolded -->
<text x="40" y="34" fill="#ff6b9d" font-size="11.5" font-weight="700">UNFOLDED — low FRET</text>
<path d="M40,110 C90,70 140,150 190,105 C240,60 290,140 330,100" stroke="#6f8299" stroke-width="3" fill="none"/>
<circle cx="40" cy="110" r="9" fill="#4ddbc4"/><circle cx="330" cy="100" r="9" fill="#ff6b9d"/>
<text x="40" y="136" fill="#4ddbc4" font-size="10">Cy3 donor</text>
<text x="330" y="126" text-anchor="middle" fill="#ff6b9d" font-size="10">Cy5 acceptor</text>
<text x="185" y="166" text-anchor="middle" fill="#6f8299" font-size="10">dyes far apart → little energy transfer → donor emits</text>
<!-- arrow -->
<path d="M352,100 L404,100" stroke="#ffd84d" stroke-width="2"/>
<path d="M404,100 L394,95 L394,105 Z" fill="#ffd84d"/>
<path d="M404,124 L352,124" stroke="#ffd84d" stroke-width="2"/>
<path d="M352,124 L362,119 L362,129 Z" fill="#ffd84d"/>
<text x="378" y="92" text-anchor="middle" fill="#ffd84d" font-size="9.5">k-fold</text>
<text x="378" y="143" text-anchor="middle" fill="#ffd84d" font-size="9.5">k-unfold</text>
<!-- folded -->
<text x="430" y="34" fill="#7CFF8F" font-size="11.5" font-weight="700">FOLDED — high FRET</text>
<path d="M470,110 C510,60 560,60 580,100 C600,140 540,150 500,118" stroke="#6f8299" stroke-width="3" fill="none"/>
<circle cx="470" cy="110" r="9" fill="#4ddbc4"/><circle cx="500" cy="118" r="9" fill="#ff6b9d"/>
<text x="520" y="166" text-anchor="middle" fill="#6f8299" font-size="10">dyes close → efficient transfer → acceptor emits</text>
<!-- trajectory -->
<g transform="translate(640,40)">
<text x="0" y="0" fill="#e6edf5" font-size="11" font-weight="650">E-FRET trajectory</text>
<line x1="0" y1="20" x2="0" y2="120" stroke="#2e3f52"/><line x1="0" y1="120" x2="300" y2="120" stroke="#2e3f52"/>
<text x="-6" y="26" text-anchor="end" fill="#6f8299" font-size="9">1</text>
<text x="-6" y="122" text-anchor="end" fill="#6f8299" font-size="9">0</text>
<text x="150" y="140" text-anchor="middle" fill="#6f8299" font-size="9.5">time →</text>
<polyline points="0,100 30,100 30,40 70,40 70,100 95,100 95,40 160,40 160,100 195,100 195,40 225,40 225,100 265,100 265,40 300,40"
 stroke="#ffd84d" stroke-width="1.8" fill="none"/>
<text x="310" y="44" fill="#7CFF8F" font-size="9">folded</text>
<text x="310" y="104" fill="#ff6b9d" font-size="9">unfolded</text>
<text x="0" y="162" fill="#6f8299" font-size="10">dwell times in each state → k-fold and k-unfold directly</text>
</g>
<!-- knobs -->
<g transform="translate(40,206)">
<rect x="0" y="0" width="900" height="100" rx="11" fill="#161f2d" stroke="#2e3f52"/>
<text x="18" y="24" fill="#e6edf5" font-size="11.5" font-weight="700">The Nesbitt additions — turning a movie into thermodynamics</text>
<text x="18" y="46" fill="#ff9e3d" font-size="10.5" font-weight="650">vary T</text>
<text x="80" y="46" fill="#a8b8ca" font-size="10.5">→ van 't Hoff / Eyring → enthalpy, entropy, activation barriers, excess heat capacity</text>
<text x="18" y="66" fill="#56b8ff" font-size="10.5" font-weight="650">vary P</text>
<text x="80" y="66" fill="#a8b8ca" font-size="10.5">→ activation and reaction volumes; DNA hairpin hybridization under extreme pressure</text>
<text x="18" y="86" fill="#7CFF8F" font-size="10.5" font-weight="650">vary both</text>
<text x="80" y="86" fill="#a8b8ca" font-size="10.5">→ the 2025 two-dimensional P/T study: a Maxwell relation validated one molecule at a time</text>
</g>
</g></svg>`;

/* ---------- venn ---------- */
$("#vennSvg").innerHTML=`<svg viewBox="0 0 980 440" xmlns="http://www.w3.org/2000/svg">
<g font-family="system-ui">
<rect x="0" y="0" width="980" height="440" fill="#0b1017"/>
<circle cx="370" cy="210" r="185" fill="#ff9e3d" fill-opacity=".09" stroke="#ff9e3d" stroke-width="1.6"/>
<circle cx="610" cy="210" r="185" fill="#7CFF8F" fill-opacity=".09" stroke="#7CFF8F" stroke-width="1.6"/>
<text x="215" y="56" fill="#ff9e3d" font-size="13" font-weight="750">NESBITT — infrared</text>
<text x="740" y="56" text-anchor="end" fill="#7CFF8F" font-size="13" font-weight="750">YOU — microwave</text>
<g font-size="10.8" fill="#a8b8ca">
<text x="236" y="112">Sub-Doppler IR, ~60 MHz</text>
<text x="236" y="132">Vibrational band origins</text>
<text x="236" y="152">Excited-state constants</text>
<text x="236" y="172">Predissociation linewidths</text>
<text x="236" y="192">Discharge source: radicals, ions</text>
<text x="236" y="212">Large-amplitude motion in radicals</text>
<text x="236" y="232">Ar2HF, Ar2CO2 three-body forces</text>
<text x="236" y="252">ArH2O, H2-H2O internal rotors</text>
<text x="236" y="272">Builds his own light sources</text>
<text x="236" y="292">Interfaces · nano · biophysics</text>
<text x="752" y="112" text-anchor="end">Jet-FTMW, 2-8 GHz, kHz lines</text>
<text x="752" y="132" text-anchor="end">Ground-state A, B, C constants</text>
<text x="752" y="152" text-anchor="end">Nuclear quadrupole coupling eQq</text>
<text x="752" y="172" text-anchor="end">Chlorine &amp; nitrogen hyperfine</text>
<text x="752" y="192" text-anchor="end">Eight N2-HCl isotopologues</text>
<text x="752" y="212" text-anchor="end">Ne2HCl, Ne3HCl trimers</text>
<text x="752" y="232" text-anchor="end">HCl-water clusters</text>
<text x="752" y="252" text-anchor="end">NITROGEN variational calculations</text>
<text x="752" y="272" text-anchor="end">Qian-Howard open-shell Hamiltonian</text>
<text x="752" y="292" text-anchor="end">ML / data-analysis pipelines</text>
</g>
<rect x="398" y="118" width="184" height="192" rx="12" fill="#0b1017" fill-opacity=".72"/>
<text x="490" y="140" text-anchor="middle" fill="#ffd84d" font-size="11" font-weight="750" letter-spacing=".8">SHARED GROUND</text>
<g font-size="10.6" fill="#e6edf5" text-anchor="middle">
<text x="490" y="164">van der Waals complexes</text>
<text x="490" y="182">Hydrogen-bonded clusters</text>
<text x="490" y="200">Rg-HCl and Rg-HF systems</text>
<text x="490" y="218">Rg2 / Rg3-HX trimers</text>
<text x="490" y="236">Three-body non-additivity</text>
<text x="490" y="254">Internal-rotor dynamics</text>
<text x="490" y="272">Effective Hamiltonians</text>
<text x="490" y="290">Potential energy surfaces</text>
</g>
<rect x="150" y="356" width="680" height="62" rx="11" fill="#161f2d" stroke="#ffd84d"/>
<text x="490" y="380" text-anchor="middle" fill="#ffd84d" font-size="12" font-weight="700">The argument is the non-overlap, not the overlap.</text>
<text x="490" y="400" text-anchor="middle" fill="#a8b8ca" font-size="11">Same molecules, four orders of magnitude apart in resolution, on different degrees of freedom.</text>
</g></svg>`;

/* ---------- concept map ---------- */
(function(){
  const W=1400,H=890;
  const byId={};NODES.forEach(n=>byId[n[0]]=n);
  const colorOf=c=>({spec:"#ff9e3d",inst:"#56b8ff",species:"#ffb066",struct:"#ffd84d",quantum:"#c9a9ff",
    theory:"#ffe88a",iface:"#4ddbc4",nano:"#a98bff",bio:"#ff6b9d",you:"#7CFF8F",hub:"#ffffff",
    "pil-ir":"#ff9e3d","pil-dyn":"#4ddbc4","pil-nano":"#a98bff","pil-bio":"#ff6b9d"}[c]||"#6f8299");
  let s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  s+='<g id="edges">';
  EDGES.forEach((e,i)=>{const a=byId[e[0]],b=byId[e[1]];if(!a||!b)return;
    s+='<line class="edge" data-a="'+e[0]+'" data-b="'+e[1]+'" x1="'+a[3]+'" y1="'+a[4]+'" x2="'+b[3]+'" y2="'+b[4]+'"/>';});
  s+='</g><g id="nodes">';
  NODES.forEach(n=>{
    const col=colorOf(n[2]);
    const fs=n[2]==="hub"?12:(n[2].startsWith("pil")?10.6:9.6);
    const label=wrapLabel(n[1],n[3],n[4]+n[5]+13);
    s+='<g class="nodeg" data-id="'+n[0]+'" data-cat="'+n[2]+'">'+
       '<circle cx="'+n[3]+'" cy="'+n[4]+'" r="'+n[5]+'" fill="'+col+'" fill-opacity="'+(n[2]==="you"?.22:.16)+
       '" stroke="'+col+'" stroke-width="'+(n[2]==="you"||n[2]==="hub"?2.2:1.5)+'"/>'+
       '<text x="'+n[3]+'" y="'+(n[4]+n[5]+13)+'" text-anchor="middle" font-size="'+fs+
       '" fill="'+(n[2]==="you"?"#cfffd6":"#a8b8ca")+'" font-weight="650">'+label+'</text></g>';
  });
  s+='</g></svg>';
  $("#mapSvg").innerHTML=s;

  function wrapLabel(txt,x,y){
    const words=String(txt).split(" ");const lines=[];let cur="";
    words.forEach(w=>{if((cur+" "+w).trim().length>17){lines.push(cur.trim());cur=w;}else cur+=" "+w;});
    if(cur.trim())lines.push(cur.trim());
    return lines.map((l,i)=>'<tspan x="'+x+'" dy="'+(i===0?0:11)+'">'+esc(l)+'</tspan>').join("");
  }

  // legend
  $("#mapLegend").innerHTML=MAPCATS.map(c=>'<span><i style="background:'+
    ({spec:"#ff9e3d",inst:"#56b8ff",species:"#ffb066",struct:"#ffd84d",quantum:"#c9a9ff",theory:"#ffe88a",
      iface:"#4ddbc4",nano:"#a98bff",bio:"#ff6b9d",you:"#7CFF8F"}[c[0]])+'"></i>'+c[1]+'</span>').join("");

  // filters
  const F=[["all","Show everything"],["you","Your overlap"],["spec","Spectroscopy"],["inst","Instruments"],
           ["quantum","Quantum &amp; symmetry"],["theory","Theory"],["iface","Interfaces"],["nano","Nano"],["bio","Biophysics"]];
  $("#mapFilters").innerHTML=F.map((f,i)=>'<button class="btn'+(i===0?" on":"")+'" data-f="'+f[0]+'">'+f[1]+'</button>').join("");
  $$("#mapFilters .btn").forEach(b=>b.addEventListener("click",()=>{
    $$("#mapFilters .btn").forEach(x=>x.classList.remove("on"));b.classList.add("on");
    const f=b.dataset.f;
    $$("#mapSvg .nodeg").forEach(g=>{
      const c=g.dataset.cat;
      const keep=f==="all"||c===f||c==="hub"||c.startsWith("pil")||(f==="spec"&&c==="species")||(f==="theory"&&c==="struct");
      g.classList.toggle("dim",!keep);
    });
    $$("#mapSvg .edge").forEach(e=>e.classList.remove("hot","dim"));
  }));

  // node click
  $$("#mapSvg .nodeg").forEach(g=>g.addEventListener("click",()=>{
    const id=g.dataset.id,n=byId[id];
    const nb=new Set([id]);
    EDGES.forEach(e=>{if(e[0]===id)nb.add(e[1]);if(e[1]===id)nb.add(e[0]);});
    $$("#mapSvg .nodeg").forEach(x=>x.classList.toggle("dim",!nb.has(x.dataset.id)));
    $$("#mapSvg .edge").forEach(e=>{
      const hot=e.dataset.a===id||e.dataset.b===id;
      e.classList.toggle("hot",hot);e.classList.toggle("dim",!hot);
    });
    const conn=Array.from(nb).filter(x=>x!==id).map(x=>byId[x]).filter(Boolean)
      .map(x=>'<span class="chip '+(CATCLS[x[2]]||"")+'" style="cursor:pointer" data-jump="'+x[0]+'">'+
      String(x[1]).replace(/<[^>]*>/g,"").replace(/\s+/g," ")+'</span>').join(" ");
    $("#mapdetail").innerHTML='<h5>'+String(n[1]).replace(/<[^>]*>/g,"").replace(/\s+/g," ")+
      ' <span class="chip '+(CATCLS[n[2]]||"")+'">'+(CATNAME[n[2]]||n[2])+'</span></h5>'+
      '<p style="margin:0 0 11px">'+n[7]+'</p>'+
      (n[6]?'<p style="margin:0 0 11px"><span class="clickterm" data-t="'+n[6]+'">Open the full layered definition →</span></p>':'')+
      '<div style="display:flex;flex-wrap:wrap;gap:6px"><span class="tx3" style="font-size:11.5px;margin-right:4px">Connects to:</span>'+conn+'</div>';
    $$("#mapdetail [data-jump]").forEach(c=>c.addEventListener("click",()=>{
      const t=$$("#mapSvg .nodeg").find(x=>x.dataset.id===c.dataset.jump);if(t)t.dispatchEvent(new Event("click"));
    }));
  }));
})();

/* ---------- publications ---------- */
(function(){
  const PF=[["all","All papers"],["spec","Spectroscopy"],["dyn","Dynamics &amp; interfaces"],["nano","Nanoscience"],
            ["bio","Biophysics"],["recent","2020 onward"],["classic","Pre-2000 classics"]];
  $("#pubFilters").innerHTML=PF.map((f,i)=>'<button class="btn'+(i===0?" on":"")+'" data-f="'+f[0]+'">'+f[1]+'</button>').join("");
  let filter="all",q="",sortKey="y",sortDir=-1;
  const PN={spec:["ir","Spectroscopy"],dyn:["dyn","Dynamics"],nano:["nano","Nanoscience"],bio:["bio","Biophysics"]};
  function pass(p){
    if(filter==="recent"&&p[0]<2020)return false;
    if(filter==="classic"&&p[0]>=2000)return false;
    if(["spec","dyn","nano","bio"].includes(filter)&&p[4]!==filter)return false;
    if(q){const hay=(p[1]+" "+p[2]+" "+p[3]+" "+p[5]+" "+p[0]).toLowerCase();if(!hay.includes(q))return false;}
    return true;
  }
  function render(){
    const rows=PUBS.filter(pass).sort((a,b)=>{
      const k={y:0,t:1,a:2,j:3,p:4}[sortKey];
      let A=a[k],B=b[k];
      if(typeof A==="string"){A=A.toLowerCase();B=B.toLowerCase();}
      return (A<B?-1:A>B?1:0)*sortDir;
    });
    $("#pubTbl tbody").innerHTML=rows.map(p=>
      '<tr><td class="mono" style="white-space:nowrap">'+p[0]+'</td>'+
      '<td><b>'+esc(p[1])+'</b><div style="color:var(--tx3);font-size:12.4px;margin-top:4px">'+linkify(p[5])+'</div></td>'+
      '<td style="font-size:12.3px;min-width:140px">'+esc(p[2])+'</td>'+
      '<td style="font-size:12.3px;min-width:120px">'+esc(p[3])+'</td>'+
      '<td><span class="chip '+PN[p[4]][0]+'">'+PN[p[4]][1]+'</span></td></tr>').join("")||
      '<tr><td colspan="5" style="text-align:center;padding:26px;color:var(--tx3)">No papers match.</td></tr>';
  }
  $$("#pubFilters .btn").forEach(b=>b.addEventListener("click",()=>{
    $$("#pubFilters .btn").forEach(x=>x.classList.remove("on"));b.classList.add("on");filter=b.dataset.f;render();}));
  $("#pubSearch").addEventListener("input",e=>{q=e.target.value.toLowerCase().trim();render();});
  $$("#pubTbl th").forEach(th=>th.addEventListener("click",()=>{
    const k=th.dataset.s;if(sortKey===k)sortDir*=-1;else{sortKey=k;sortDir=k==="y"?-1:1;}render();}));
  render();

  // era bars
  const eras=[["1982-1989","Instrument-building and the Chem. Rev. review",0],["1990-1999","Rg-HX potentials, trimers, three-body forces",0],
    ["2000-2009","Quantum dots and blinking",0],["2010-2019","Radicals, ions, interfaces, biophysics",0],["2020-2025","C60, the OPO, P/T thermodynamics",0]];
  PUBS.forEach(p=>{const y=p[0];
    if(y<1990)eras[0][2]++;else if(y<2000)eras[1][2]++;else if(y<2010)eras[2][2]++;else if(y<2020)eras[3][2]++;else eras[4][2]++;});
  const mx=Math.max.apply(null,eras.map(e=>e[2]));
  $("#eraBars").innerHTML=eras.map(e=>'<div class="bar"><div class="lbl mono">'+e[0]+
    '</div><div class="track"><div class="fill" style="width:'+(e[2]/mx*100)+'%"></div></div><div class="num">'+e[2]+
    '</div><div style="flex:0 0 auto;font-size:11.8px;color:var(--tx3)">'+e[1]+'</div></div>').join("")+
    '<p class="srcnote" style="margin-top:12px">Counts are of papers indexed in this platform, not of his total output. His JILA listing shows 340 entries and broader indexes about 615 works, so these bars show the shape of the curated spine, not the real productivity curve.</p>';
})();

/* ---------- terms ---------- */
(function(){
  const TF=[["all","All"],["spec","Spectroscopy"],["inst","Instrumentation"],["struct","Structure"],
    ["quantum","Quantum"],["theory","Theory"],["species","Species"],["iface","Interfaces"],["nano","Nano"],["bio","Biophysics"]];
  $("#termFilters").innerHTML=TF.map((f,i)=>'<button class="btn'+(i===0?" on":"")+'" data-f="'+f[0]+'">'+f[1]+'</button>').join("");
  let filter="all",q="";
  function render(){
    const rows=TERMS.filter(t=>{
      if(filter!=="all"&&t[2]!==filter)return false;
      if(q){const hay=(t[1]+" "+t[3]+" "+t[5]+" "+t[6]).toLowerCase();if(!hay.includes(q))return false;}
      return true;});
    $("#termGrid").innerHTML=rows.map(t=>
      '<div class="card" style="cursor:pointer;padding:15px 16px" data-t="'+t[0]+'">'+
      '<span class="chip '+(CATCLS[t[2]]||"")+'">'+(CATNAME[t[2]]||t[2])+'</span>'+
      '<h4 style="margin:9px 0 6px;font-size:14.6px">'+esc(t[1])+'</h4>'+
      '<p style="margin:0;font-size:12.9px;color:var(--tx3);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">'+
      String(t[3]).replace(/<[^>]*>/g,"")+'</p></div>').join("")||
      '<p class="tx3">No terms match that search.</p>';
    $$("#termGrid [data-t]").forEach(c=>c.addEventListener("click",()=>openTerm(c.dataset.t)));
  }
  $$("#termFilters .btn").forEach(b=>b.addEventListener("click",()=>{
    $$("#termFilters .btn").forEach(x=>x.classList.remove("on"));b.classList.add("on");filter=b.dataset.f;render();}));
  $("#termSearch").addEventListener("input",e=>{q=e.target.value.toLowerCase().trim();render();});
  render();
})();

/* ---------- people ---------- */
(function(){
  const counts={};ALUMNI.forEach(a=>counts[a[2]]=(counts[a[2]]||0)+1);
  $("#peopleStats").innerHTML=
    '<div class="stat"><div class="v" style="color:var(--dyn)">'+ALUMNI.length+'</div><div class="l">Alumni Listed</div></div>'+
    '<div class="stat"><div class="v" style="color:var(--ir)">'+(counts.faculty||0)+'</div><div class="l">Now Faculty</div></div>'+
    '<div class="stat"><div class="v" style="color:var(--nano)">'+(counts.natlab||0)+'</div><div class="l">National Labs &amp; Gov</div></div>'+
    '<div class="stat"><div class="v" style="color:var(--bio)">'+(counts.industry||0)+'</div><div class="l">Industry</div></div>';
  const order=["industry","natlab","faculty","unknown","academic","medical","education"];
  const mx=Math.max.apply(null,order.map(k=>counts[k]||0));
  $("#sectorBars").innerHTML=order.filter(k=>counts[k]).map(k=>
    '<div class="bar"><div class="lbl">'+SECTORLBL[k]+'</div><div class="track"><div class="fill" style="width:'+
    ((counts[k]||0)/mx*100)+'%"></div></div><div class="num">'+(counts[k]||0)+'</div></div>').join("");

  $("#currentTbl tbody").innerHTML=CURRENT.map(c=>'<tr><td><b>'+esc(c[0])+'</b></td><td style="min-width:150px">'+
    linkify(c[1])+'</td><td>'+linkify(c[2])+'</td></tr>').join("");

  const SF=[["all","All sectors"],["faculty","Faculty"],["natlab","National labs"],["industry","Industry"],
    ["academic","Academic"],["medical","Medicine"],["unknown","Not listed"]];
  $("#peopleFilters").innerHTML=SF.map((f,i)=>'<button class="btn'+(i===0?" on":"")+'" data-f="'+f[0]+'">'+f[1]+'</button>').join("");
  let filter="all",q="",sortKey="n",sortDir=1;
  function render(){
    const rows=ALUMNI.filter(a=>{
      if(filter!=="all"&&a[2]!==filter)return false;
      if(q&&!(a[0]+" "+a[1]).toLowerCase().includes(q))return false;return true;})
      .sort((a,b)=>{const k={n:0,a:1,s:2}[sortKey];return (a[k].toLowerCase()<b[k].toLowerCase()?-1:1)*sortDir;});
    const CH={faculty:"ir",natlab:"inst",industry:"dyn",academic:"nano",medical:"bio",education:"theory",unknown:""};
    $("#peopleTbl tbody").innerHTML=rows.map(a=>'<tr><td><b>'+esc(a[0])+'</b></td><td>'+esc(a[1])+
      '</td><td><span class="chip '+CH[a[2]]+'">'+SECTORLBL[a[2]]+'</span></td></tr>').join("")||
      '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--tx3)">No matches.</td></tr>';
  }
  $$("#peopleFilters .btn").forEach(b=>b.addEventListener("click",()=>{
    $$("#peopleFilters .btn").forEach(x=>x.classList.remove("on"));b.classList.add("on");filter=b.dataset.f;render();}));
  $("#peopleSearch").addEventListener("input",e=>{q=e.target.value.toLowerCase().trim();render();});
  $$("#peopleTbl th").forEach(th=>th.addEventListener("click",()=>{
    const k=th.dataset.s;if(sortKey===k)sortDir*=-1;else{sortKey=k;sortDir=1;}render();}));
  render();
})();

/* ---------- collaborators ---------- */
$("#bridgeNote").innerHTML='<b>The bridge you already have.</b> <span class="clickterm" data-t="nitrogen">Bryan Changala</span> '+
  'is a co-author on your Ne<sub>2</sub>HCl and Ne<sub>3</sub>HCl work <em>and</em> a co-author on Nesbitt\'s C<sub>60</sub> ergodicity-breaking paper in <em>Science</em> '+
  'and on the PRX Quantum collisional-relaxation paper. He also wrote NITROGEN, the code you use. '+
  'That is one person who can vouch for you to Nesbitt and who understands exactly what you would bring. '+
  '<b>If you do one thing before contacting Nesbitt, it is talking to Changala.</b>';
$("#collabGrid").innerHTML=COLLABS.map(c=>
  '<div class="card"><h4 style="margin:0 0 3px;font-size:15.4px">'+esc(c[0])+'</h4>'+
  '<p class="tx3" style="margin:0 0 9px;font-size:12.2px" class="mono">'+esc(c[1])+'</p>'+
  '<p style="margin:0 0 9px;font-size:13.4px;color:var(--tx2)"><b>Brings:</b> '+linkify(c[2])+'</p>'+
  '<p style="margin:0;font-size:13.4px;color:var(--tx2)">'+linkify(c[3])+'</p></div>').join("");

/* ---------- fit ---------- */
$("#fitTbl tbody").innerHTML=FITROWS.map(r=>'<tr><td style="min-width:200px">'+linkify(r[0])+'</td><td style="min-width:200px">'+
  linkify(r[1])+'</td><td style="min-width:240px;color:var(--you)">'+r[2]+'</td></tr>').join("");

$("#assetAcc").innerHTML=ASSETS.map((a,i)=>'<div class="acc'+(i===0?" open":"")+'"><div class="hd">'+
  '<span class="chip you">'+esc(a[1])+'</span>'+esc(a[0])+'<span class="caret">▶</span></div>'+
  '<div class="bd"><p style="margin:14px 0 0;font-size:14.2px;color:var(--tx2)">'+linkify(a[2])+'</p></div></div>').join("");

$("#gapAcc").innerHTML=GAPS.map(g=>'<div class="acc"><div class="hd"><span class="chip ir">Gap</span>'+
  esc(g[0])+'<span class="caret">▶</span></div><div class="bd">'+
  '<p style="margin:14px 0 10px;font-size:13.8px;color:var(--tx3)"><b style="color:var(--tx)">Why it is a real gap:</b> '+esc(g[1])+'</p>'+
  '<p style="margin:0;font-size:14.2px;color:var(--tx2)"><b>How to answer it:</b> '+g[2]+'</p></div></div>').join("");

const PITCH=[
 ["Who you are and what you measure","I'm Sams Zubayer Mridha — I go by Zubayer. I do rotational spectroscopy of weakly bound complexes: jet-cooled Fourier-transform microwave, two to eight gigahertz, kilohertz linewidths."],
 ["The specific overlap with his own systems","My systems are your systems. Eight isotopologues of N<sub>2</sub>-HCl including the nitrogen-14 quadrupole coupling analysis. Ne<sub>2</sub>HCl and Ne<sub>3</sub>HCl trimers — the neon analogue of your Ar<sub>2</sub>HF three-body-forces work. Hydrohalic-acid-water clusters. And I've been implementing the Qian-Howard effective Hamiltonian for open-shell O<sub>2</sub> complexes."],
 ["The complementary capability","What I don't have is vibrational dynamics — I measure ground states beautifully and can say nothing about what happens on excitation. What you don't have is kilohertz precision or hyperfine structure. Those are four orders of magnitude apart on different degrees of freedom. Put both into one global fit for the same complex and the potential is better determined than either dataset gives alone. I also run NITROGEN, Bryan Changala's variational nuclear-motion code — which is the tool your cyclobutyl and cyclopentyl papers both stop just short of needing."],
 ["The concrete ask","So what I'd want to do here is two things: learn the slit jet properly from whoever runs it, and in parallel try a combined microwave-plus-infrared global fit on a complex where both datasets already exist. Low risk, and it uses what I already have while I learn what I don't. Is that the kind of thing that would be useful to you?"]
];
$("#pitchBox").innerHTML=PITCH.map(p=>'<div class="ln"><b>'+esc(p[0])+' — </b>'+p[1]+'</div>').join("");

const EMAIL=`<p class="mono tx3" style="margin:0 0 4px;font-size:12px">SUBJECT</p>
<p style="margin:0 0 16px;font-weight:650">Microwave hyperfine data on Rg&ndash;HCl and Ne<sub>2,3</sub>HCl complexes &mdash; possible complement to your slit-jet IR work</p>
<p class="mono tx3" style="margin:0 0 4px;font-size:12px">BODY</p>
<p style="margin:0 0 11px">Dear Professor Nesbitt,</p>
<p style="margin:0 0 11px">I'm a graduate student working on rotational spectroscopy of weakly bound complexes &mdash; jet-cooled FTMW, 2&ndash;8 GHz. I'm writing because my systems turn out to be yours, measured with a different instrument.</p>
<p style="margin:0 0 11px">I've studied eight isotopologues of N<sub>2</sub>&ndash;HCl, including the <sup>14</sup>N quadrupole coupling, where the averaged constant shifts from about &minus;4.529 MHz to a fitted average near &minus;4.581 MHz on deuteration &mdash; a fairly direct readout of how zero-point amplitude changes the angular averaging. I'm also working on Ne<sub>2</sub>HCl and Ne<sub>3</sub>HCl, which are the neon analogue of your Ar<sub>2</sub>HF and Ar<sub>2</sub>CO<sub>2</sub> three-body-force measurements, with surfaces and wavefunctions computed in NITROGEN (Bryan Changala, who is a co-author on that work, wrote the code).</p>
<p style="margin:0 0 11px">The reason I'm contacting you specifically: my technique reaches kHz precision but only on the ground state, and yours reaches the vibrational dynamics that mine cannot see. I've not found anyone who has put microwave ground-state constants and slit-jet IR band origins for the same complex into a single global fit, and I'd like to try. I'd also be glad to put NITROGEN to work on the double-minimum puckering problem your cyclobutyl and cyclopentyl papers both leave open.</p>
<p style="margin:0 0 11px">Would you be willing to talk for twenty minutes? I'm happy to send the N<sub>2</sub>&ndash;HCl manuscript draft and the simulated-versus-observed overlays in advance.</p>
<p style="margin:0">With thanks,<br>Sams Zubayer Mridha<br><span class="tx3">MS, Industrial &amp; Systems Engineering, Texas Tech University &mdash; rotational spectroscopy</span></p>`;
$("#emailBox").innerHTML=EMAIL;

function plain(el){const d=document.createElement("div");d.innerHTML=el.innerHTML;
  d.querySelectorAll("sub,sup").forEach(s=>s.replaceWith(s.textContent));
  return d.innerText.replace(/\n{3,}/g,"\n\n").trim();}
function copy(txt,btn){const old=btn.textContent;
  const done=()=>{btn.textContent="✓ Copied";setTimeout(()=>btn.textContent=old,1600);};
  try{navigator.clipboard.writeText(txt).then(done,()=>fallback());}catch(e){fallback();}
  function fallback(){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);
    ta.select();try{document.execCommand("copy");done();}catch(e){btn.textContent="Select manually";setTimeout(()=>btn.textContent=old,1600);}
    document.body.removeChild(ta);}}
$("#copyPitch").addEventListener("click",e=>copy(plain($("#pitchBox")),e.target));
$("#copyEmail").addEventListener("click",e=>copy(plain($("#emailBox")),e.target));

/* ---------- interview ---------- */
(function(){
  $("#qaFilters").innerHTML=QACATS.map((c,i)=>'<button class="btn'+(i===0?" on":"")+'" data-f="'+c[0]+'">'+c[1]+'</button>').join("");
  let filter="all";
  const CN={sci:["ir","Science"],tech:["inst","Technique"],you:["you","About you"],strat:["theory","Plans"],curve:["bio","Curveball"]};
  function render(){
    const rows=QA.filter(q=>filter==="all"||q[0]===filter);
    $("#qaList").innerHTML=rows.map((q,i)=>'<div class="qa"><div class="q"><span class="qn">Q'+(i+1)+'</span>'+
      '<span>'+esc(q[1])+'</span></div><div class="a">'+
      '<span class="chip '+CN[q[0]][0]+'">'+CN[q[0]][1]+'</span>'+
      '<p style="margin:10px 0 0"><b style="color:var(--tx)">Why he asks it:</b> '+esc(q[2])+'</p>'+
      '<div class="say">'+linkify(q[3])+'</div></div></div>').join("");
  }
  $$("#qaFilters .btn").forEach(b=>b.addEventListener("click",()=>{
    $$("#qaFilters .btn").forEach(x=>x.classList.remove("on"));b.classList.add("on");filter=b.dataset.f;render();}));
  render();
})();

$("#askList").innerHTML=ASKS.map(a=>'<div class="acc"><div class="hd">'+
  (a[0]?'<span class="chip you">★ high value</span>':'<span class="chip">safe</span>')+
  '<span style="font-weight:600">'+esc(a[1])+'</span><span class="caret">▶</span></div>'+
  '<div class="bd"><p style="margin:14px 0 0;font-size:14px;color:var(--tx2)">'+esc(a[2])+'</p></div></div>').join("");

$("#trapGrid").innerHTML=TRAPS.map(t=>'<div class="card" style="border-left:3px solid var(--ir)">'+
  '<h4 style="margin:0 0 7px;font-size:14.6px">'+esc(t[0])+'</h4>'+
  '<p style="margin:0;font-size:13.5px;color:var(--tx2)">'+esc(t[1])+'</p></div>').join("");

/* ---------- learning plan ---------- */
(function(){
  const KEY="nesbitt-codex-progress-v1";
  let done={};
  try{const raw=localStorage.getItem(KEY);if(raw)done=JSON.parse(raw)||{};}catch(e){done={};}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(done));}catch(e){}}
  const TIER=[[1,"Tier 1 — before any conversation","ir"],[2,"Tier 2 — before a formal interview","inst"],[3,"Tier 3 — to look like you already work there","you"]];
  function render(){
    $("#learnList").innerHTML=TIER.map(t=>
      '<h4 style="margin-top:24px"><span class="chip '+t[2]+'">'+esc(t[1])+'</span></h4>'+
      LEARN.filter(l=>l[0]===t[0]).map(l=>{
        const id="L"+LEARN.indexOf(l);
        return '<div class="chk'+(done[id]?" done":"")+'" data-id="'+id+'">'+
          '<div class="box">'+(done[id]?"✓":"")+'</div><div><div class="t">'+esc(l[1])+
          '</div><div class="d">'+linkify(l[2])+'</div></div></div>';}).join("")).join("");
    $$("#learnList .chk").forEach(c=>c.addEventListener("click",e=>{
      if(e.target.closest(".clickterm"))return;
      done[c.dataset.id]=!done[c.dataset.id];save();render();}));
    const n=LEARN.length,k=LEARN.filter((l,i)=>done["L"+i]).length;
    $("#progLabel").textContent=k+" / "+n+" complete";
    $("#progBar").style.width=(k/n*100)+"%";
  }
  $("#resetProg").addEventListener("click",()=>{done={};save();render();});
  render();
})();

$("#readTbl tbody").innerHTML=READING.map(r=>'<tr><td class="mono" style="color:var(--ir);font-weight:700">'+r[0]+
  '</td><td style="min-width:260px"><b>'+esc(r[1])+'</b></td><td>'+linkify(r[2])+'</td></tr>').join("");

$("#skillGrid").innerHTML=SKILLS.map(s=>'<div class="card"><h4 style="margin:0 0 7px;font-size:15px">'+esc(s[0])+
  '</h4><p style="margin:0;font-size:13.6px;color:var(--tx2)">'+linkify(s[1])+'</p></div>').join("");

/* ---------- future ---------- */
$("#futureList").innerHTML=FUTURE.map((f,i)=>'<div class="acc'+(i===0?" open":"")+'"><div class="hd">'+
  '<span class="chip '+(f[1]==="spec"?"ir":"nano")+'">Idea '+(i+1)+'</span>'+esc(f[0])+'<span class="caret">▶</span></div>'+
  '<div class="bd"><p style="margin:14px 0 10px;font-size:14.2px;color:var(--tx2)"><b>The pitch:</b> '+linkify(f[2])+'</p>'+
  '<p style="margin:0 0 10px;font-size:13.8px;color:var(--tx2)"><b>What you would measure:</b> '+linkify(f[3])+'</p>'+
  '<div class="note good" style="margin:0"><b>Why it works on him:</b> '+linkify(f[4])+'</div></div></div>').join("");

$("#trendGrid").innerHTML=TRENDS.map(t=>'<div class="card"><h4 style="margin:0 0 7px;font-size:15px">'+esc(t[0])+
  '</h4><p style="margin:0;font-size:13.6px;color:var(--tx2)">'+linkify(t[1])+'</p></div>').join("");

/* ---------- global search ---------- */
(function(){
  const idx=[];
  TERMS.forEach(t=>idx.push({k:"term",t:t[1],s:String(t[3]).replace(/<[^>]*>/g,"").slice(0,110),id:t[0],p:"glossary"}));
  PUBS.forEach(p=>idx.push({k:"paper",t:p[1],s:p[0]+" · "+p[3],p:"pubs"}));
  ALUMNI.forEach(a=>idx.push({k:"person",t:a[0],s:a[1],p:"people"}));
  CURRENT.forEach(c=>idx.push({k:"person",t:c[0],s:c[1],p:"people"}));
  COLLABS.forEach(c=>idx.push({k:"collab",t:c[0],s:c[1],p:"network"}));
  QA.forEach(q=>idx.push({k:"question",t:q[1],s:"Interview question",p:"interview"}));
  ASKS.forEach(a=>idx.push({k:"ask",t:a[1],s:"Question to ask him",p:"interview"}));
  FUTURE.forEach(f=>idx.push({k:"idea",t:f[0],s:"Research proposal",p:"future"}));
  LEARN.forEach(l=>idx.push({k:"todo",t:l[1],s:"Learning plan · tier "+l[0],p:"learn"}));
  AWARDS.forEach(a=>idx.push({k:"award",t:a[1],s:a[0]+" · "+a[2],p:"bio"}));
  NODES.forEach(n=>idx.push({k:"node",t:String(n[1]).replace(/<[^>]*>/g,"").replace(/\s+/g," "),s:String(n[7]).slice(0,110),p:"map"}));
  const inp=$("#gsearch"),box=$("#gresults");
  inp.addEventListener("input",()=>{
    const q=inp.value.toLowerCase().trim();
    if(q.length<2){box.classList.remove("on");return;}
    const hits=idx.filter(h=>(h.t+" "+h.s).toLowerCase().includes(q)).slice(0,34);
    box.innerHTML=hits.length?hits.map(h=>'<div class="rhit" data-p="'+h.p+'"'+(h.id?' data-id="'+h.id+'"':'')+'>'+
      '<b><span class="tag">'+h.k+'</span>'+esc(h.t)+'</b><span>'+esc(h.s)+'</span></div>').join("")
      :'<div class="rhit"><b>No matches</b><span>Try a different term.</span></div>';
    box.classList.add("on");
    $$(".rhit",box).forEach(r=>r.addEventListener("click",()=>{
      if(r.dataset.id)openTerm(r.dataset.id);
      if(r.dataset.p)go(r.dataset.p);
      box.classList.remove("on");inp.value="";}));
  });
  inp.addEventListener("blur",()=>setTimeout(()=>box.classList.remove("on"),180));
  document.addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();inp.focus();}});
})();
$("#clock").textContent=TERMS.length+" terms · "+PUBS.length+" papers · "+ALUMNI.length+" alumni";
