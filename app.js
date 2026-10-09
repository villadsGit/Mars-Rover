/* Mars-roveren på dansk. Skulpt afvikler et sikkert udvalg af Python i browseren. */
const missions = [
 {title:"Afgræns området",difficulty:"BEGYNDER",description:"Roveren skal undersøge et kvadratisk område på Mars. Hjælp den med at følge hele områdets kant og vende tilbage til udgangspunktet.",objective:"Kør 400 meter frem, drej 90 grader, og gentag, indtil roveren har kørt hele vejen rundt om kvadratet.",hint:"Et kvadrat har fire lige lange sider og fire rette vinkler. Du kan skrive instruktionerne fire gange eller bruge en for-løkke.",code:"for i in range(4):\n    rover.forward(400)\n    rover.right(90)",test:"Roveren skal ende tæt på startpunktet efter at have kørt fire sider."},
 {title:"Optimér koden",difficulty:"BEGYNDER",description:"En god programmør skriver ikke den samme instruktion igen og igen, hvis en løkke kan gøre arbejdet.",objective:"Skriv en kortere version af ruten rundt om kvadratet ved hjælp af en for-løkke.",hint:"Brug for i in range(4): og indryk de to instruktioner, der skal gentages.",code:"for i in range(4):\n    rover.forward(400)\n    rover.right(90)",test:"Kør programmet og kontrollér, at ruten stadig danner et kvadrat."},
 {title:"Kortlæg området",difficulty:"ØVET",description:"Roveren skal kortlægge et større rektangulært område ved at køre frem og tilbage i parallelle baner.",objective:"Lav et systematisk zigzag-mønster, der dækker terrænet uden at forlade kortet.",hint:"Kombinér fremadkørsel, korte sidebevægelser og drejninger. Test ruten i små dele.",code:"for i in range(4):\n    rover.forward(180)\n    rover.right(90)\n    rover.forward(80)\n    rover.right(90)",test:"Kontrollér, om din rute dækker flere parallelle baner."},
 {title:"Find en alternativ rute",difficulty:"ØVET",description:"Der kan være flere måder at kortlægge et område på. Prøv at lave en anden effektiv rute.",objective:"Lav en alternativ rute, som systematisk dækker det markerede område.",hint:"Brug løkker til gentagne bevægelser. En lille ændring i rækkefølgen kan give et helt andet mønster.",code:"for i in range(3):\n    rover.forward(180)\n    rover.right(90)\n    rover.forward(70)\n    rover.right(90)",test:"Se på sporene på kortet, og vurder selv, om området er dækket."},
 {title:"Besøg tre kratere",difficulty:"ØVET",description:"Forskere har udpeget tre interessante kratere. Før roveren hen til hvert af dem for at undersøge dem.",objective:"Kør hen til alle tre markerede kratere uden at forlade det sikre område.",hint:"Planlæg ruten fra roverens startposition. Brug drejninger og korte bevægelser, og test én del ad gangen.",code:"# Eksempel – tilpas ruten til kortet\nrover.forward(100)\nrover.left(45)\nrover.forward(120)",test:"Sammenlign roverens spor med de tre kratermarkeringer."},
 {title:"Undgå kløften",difficulty:"ØVET",description:"Tre kratere ligger i nærheden af en dyb kløft. Roveren må ikke krydse det farlige område.",objective:"Besøg de tre kratere, mens du holder roveren væk fra kløften.",hint:"Læg mærke til kløftens placering. Brug korte bevægelser og nulstil, hvis du vil prøve en ny rute.",code:"# Planlæg en sikker rute\nrover.forward(100)\nrover.right(90)\nrover.forward(80)",test:"Kontrollér, at ruten når kraterne og ikke krydser kløften."},
 {title:"Udforsk kæmpekrateret",difficulty:"UDFORDRING",description:"Din sidste mission er at udforske kanten af et stort krater. Find en effektiv rute rundt om det.",objective:"Følg kraterets omkreds så præcist som muligt og vend tilbage til startområdet.",hint:"Du kan bruge en løkke og justere længden af siderne og drejevinklerne, så de passer til kortet.",code:"for i in range(8):\n    rover.forward(100)\n    rover.right(45)",test:"Undersøg, om ruten følger kraterkanten og vender tilbage nær startpunktet."}
];

const canvas = document.getElementById("mars-canvas");
const ctx = canvas.getContext("2d");
const editor = document.getElementById("code-editor");
const output = document.getElementById("console-output");
const logState = document.getElementById("log-state");
const lineNumbers = document.getElementById("line-numbers");
const testResult = document.getElementById("test-result");
let currentMission = 0;
let rover = {x:95,y:425,angle:0};
let start = {x:95,y:425,angle:0};
let trail = [];
let visited = new Set();
let running = false;
const scale = 0.78;

function drawTerrain(){
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#b96b4c";ctx.fillRect(0,0,w,h);
  // Mars dust and surface variations
  for(let i=0;i<100;i++){
    const x=(i*127+31)%w,y=(i*83+17)%h,r=5+(i%17);
    ctx.fillStyle=i%2?"rgba(80,37,37,.10)":"rgba(255,190,130,.09)";
    ctx.beginPath();ctx.ellipse(x,y,r*1.4,r*.7,(i%5)*.3,0,Math.PI*2);ctx.fill();
  }
  // subtle navigation grid
  ctx.strokeStyle="rgba(255,224,190,.13)";ctx.lineWidth=1;
  for(let x=25;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
  for(let y=20;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
  // terrain obstacles and craters
  if(currentMission>=4){
    [[430,110,28],[580,330,34],[320,270,22]].forEach((c,i)=>drawCrater(...c,i+1));
  } else {
    [[490,120,25],[620,395,31]].forEach(c=>drawCrater(...c,0));
  }
  if(currentMission===5){
    ctx.fillStyle="#3e3036";ctx.beginPath();ctx.moveTo(500,0);ctx.lineTo(565,0);ctx.lineTo(450,180);ctx.lineTo(520,280);ctx.lineTo(440,400);ctx.lineTo(470,520);ctx.lineTo(405,520);ctx.lineTo(390,400);ctx.lineTo(465,280);ctx.lineTo(400,180);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#e8a17d";ctx.lineWidth=3;ctx.setLineDash([7,6]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle="#ffd0a4";ctx.font="bold 12px sans-serif";ctx.fillText("FARLIG KLØFT",475,455);
  }
  // mission boundary
  if(currentMission<=1){
    ctx.strokeStyle="#ffd4a4";ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.strokeRect(95,105,312,312);ctx.setLineDash([]);
    ctx.fillStyle="#ffe2c7";ctx.font="12px sans-serif";ctx.fillText("UNDERSØGELSESOMRÅDE",95,90);
  } else if(currentMission===6){
    ctx.strokeStyle="#f7c19a";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(410,260,155,118,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle="#7e3f38";ctx.beginPath();ctx.ellipse(410,260,130,96,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ffd5b5";ctx.font="12px sans-serif";ctx.fillText("KRATERKANT",370,125);
  }
  // trail
  if(trail.length){
    ctx.strokeStyle="#7df0bd";ctx.lineWidth=3;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();
    ctx.moveTo(trail[0].x,trail[0].y);for(const p of trail.slice(1))ctx.lineTo(p.x,p.y);ctx.stroke();
    trail.forEach((p,i)=>{if(i%Math.max(1,Math.floor(trail.length/16))===0){ctx.fillStyle="#e8fff2";ctx.beginPath();ctx.arc(p.x,p.y,2.4,0,Math.PI*2);ctx.fill()}});
  }
  // start marker
  ctx.strokeStyle="#fff0dc";ctx.lineWidth=2;ctx.beginPath();ctx.arc(start.x,start.y,11,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle="#fff0dc";ctx.font="bold 10px sans-serif";ctx.fillText("START",start.x-17,start.y+27);
  drawRover();
}
function drawCrater(x,y,r,n){
  ctx.fillStyle="#7d4038";ctx.beginPath();ctx.ellipse(x,y,r*1.25,r*.9,-.3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#5d3534";ctx.beginPath();ctx.ellipse(x,y,r*.78,r*.55,-.3,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#df9270";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,r*1.05,r*.72,-.3,Math.PI,Math.PI*1.85);ctx.stroke();
  if(n){ctx.fillStyle="#ffe3cb";ctx.font="bold 12px sans-serif";ctx.fillText("K"+n,x-r*.25,y+4)}
}
function drawRover(){
  ctx.save();ctx.translate(rover.x,rover.y);ctx.rotate(rover.angle);
  ctx.fillStyle="#2a2726";ctx.fillRect(-14,-17,7,11);ctx.fillRect(7,-17,7,11);ctx.fillRect(-14,6,7,11);ctx.fillRect(7,6,7,11);
  ctx.fillStyle="#d8d4c9";ctx.fillRect(-10,-19,20,38);
  ctx.fillStyle="#f4a46f";ctx.fillRect(-7,-12,14,12);
  ctx.fillStyle="#323c47";ctx.fillRect(-6,-9,12,7);
  ctx.strokeStyle="#e8e0ce";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(0,-25);ctx.stroke();
  ctx.fillStyle="#f4d1a6";ctx.beginPath();ctx.arc(0,-26,3,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function redraw(){drawTerrain()}
function resetRover(clear=true){
  rover={...start};if(clear)trail=[];trail.push({x:rover.x,y:rover.y});redraw();
}
function setLog(message,state="AFVENTER INPUT"){output.textContent=message;logState.textContent=state}
function updateLines(){
  const n=editor.value.split("\n").length;
  lineNumbers.textContent=Array.from({length:n},(_,i)=>i+1).join("\n");
  document.getElementById("line-count").textContent=n+" linje"+(n===1?"":"r");
}
editor.addEventListener("input",updateLines);
editor.addEventListener("keydown",e=>{
  if(e.key==="Tab"){e.preventDefault();const a=editor.selectionStart,b=editor.selectionEnd;editor.setRangeText("    ",a,b,"end");updateLines()}
  if(e.key==="Enter"){const a=editor.selectionStart;const line=editor.value.slice(0,a).split("\n").pop();const indent=(line.match(/^\s*/)||[""])[0]+(line.trimEnd().endsWith(":")?"    ":"");e.preventDefault();editor.setRangeText("\n"+indent,a,editor.selectionEnd,"end");updateLines()}
});
function renderMission(){
  const m=missions[currentMission];
  document.getElementById("mission-tag").textContent="MISSION "+String(currentMission+1).padStart(2,"0");
  document.getElementById("mission-title").textContent=m.title;
  document.getElementById("mission-description").textContent=m.description;
  document.getElementById("mission-objective").textContent=m.objective;
  document.getElementById("mission-hint").textContent=m.hint;
  document.getElementById("test-prompt").textContent=m.test;
  document.querySelector(".difficulty").textContent=m.difficulty;
  document.getElementById("mission-count").textContent=(currentMission+1)+" af 7 valgt";
  document.querySelectorAll(".mission-tab").forEach((b,i)=>b.classList.toggle("active",i===currentMission));
  editor.value=m.code;updateLines();testResult.textContent="Ikke testet endnu.";
  start={x:95,y:425,angle:0};resetRover();setLog("Roveren afventer dine instruktioner. Skriv kode og tryk på “Kør min kode”.");
}
function makeMissionTabs(){
  const list=document.getElementById("mission-list");
  missions.forEach((m,i)=>{
    const b=document.createElement("button");b.className="mission-tab"+(i===0?" active":"");
    b.innerHTML=`<strong>MISSION ${String(i+1).padStart(2,"0")}</strong><span>${m.title}</span>`;
    b.addEventListener("click",()=>{if(running)return;currentMission=i;renderMission()});list.appendChild(b);
  });
}
function moveForward(distance){
  if(!Number.isFinite(distance)||Math.abs(distance)>1500)throw new Error("Afstanden skal være et tal mellem -1500 og 1500 meter.");
  const d=distance*scale;
  const nx=rover.x+Math.sin(rover.angle)*d,ny=rover.y-Math.cos(rover.angle)*d;
  const steps=Math.max(1,Math.ceil(Math.abs(d)/5));
  for(let i=1;i<=steps;i++){const t=i/steps;trail.push({x:rover.x+(nx-rover.x)*t,y:rover.y+(ny-rover.y)*t})}
  rover.x=nx;rover.y=ny;redraw();
}
function turn(degrees,dir){
  if(!Number.isFinite(degrees)||Math.abs(degrees)>1440)throw new Error("Drejningen skal være mellem -1440 og 1440 grader.");
  rover.angle+=degrees*Math.PI/180*dir;redraw();
}
function outputFn(text){setLog(String(text),"PROGRAMMEDDELELSE")}
function builtinRead(x){if(Sk.builtinFiles===undefined||Sk.builtinFiles["files"][x]===undefined)throw "Kan ikke finde filen: '"+x+"'";return Sk.builtinFiles["files"][x]}
async function runCode(){
  if(running)return;running=true;
  document.getElementById("run-code").disabled=true;resetRover();setLog("Kører din Python-kode…","KØRER");
  Sk.configure({output:outputFn,read:builtinRead, __future__:Sk.python3});
  Sk.timeoutMsg="Programmet tog for lang tid. Prøv en enklere løsning.";
  const roverModule=`class RoverAPI:\n    def forward(self, distance):\n        __forward(distance)\n    def left(self, degrees):\n        __left(degrees)\n    def right(self, degrees):\n        __right(degrees)\nrover = RoverAPI()\n`;
  Sk.builtins.__forward=new Sk.builtin.func(x=>{moveForward(Sk.ffi.remapToJs(x));return Sk.builtin.none.none$});
  Sk.builtins.__left=new Sk.builtin.func(x=>{turn(Sk.ffi.remapToJs(x),-1);return Sk.builtin.none.none$});
  Sk.builtins.__right=new Sk.builtin.func(x=>{turn(Sk.ffi.remapToJs(x),1);return Sk.builtin.none.none$});
  const code=roverModule+"\n"+editor.value;
  try{
    await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<stdin>",false,code,true));
    setLog("Programmet er færdigt. Undersøg ruten, og brug “Test min løsning”, når du er klar.","FÆRDIG");
  }catch(e){setLog("Fejl i programmet: "+(e.toString?e.toString():e),"FEJL")}
  finally{running=false;document.getElementById("run-code").disabled=false}
}
function testSolution(){
  const dist=Math.hypot(rover.x-start.x,rover.y-start.y);
  const inside=rover.x>=0&&rover.x<=canvas.width&&rover.y>=0&&rover.y<=canvas.height;
  const moved=trail.length>1;
  let msg="";
  if(!moved)msg="Roveren er ikke kørt endnu. Kør din kode først.";
  else if(!inside)msg="Roveren er kørt uden for kortet. Prøv at nulstille og justere ruten.";
  else if(currentMission===0||currentMission===1){
    if(dist<24&&trail.length>150)msg="Roveren er tilbage tæt på startpunktet. Godt arbejde – undersøg, om alle fire sider følger områdets kant.";
    else msg="Ruten er tegnet. Kontrollér, om du har kørt fire sider og drejet 90 grader ved hvert hjørne.";
  } else if(currentMission===5 && trail.some(p=>p.x>390&&p.x<565&&p.y>0&&p.y<520))msg="Tjek ruten igen: den ser ud til at komme tæt på kløften. Prøv at holde større afstand.";
  else msg="Din rute er klar til inspektion. Sammenlign den med missionens mål, og ret koden, hvis nødvendigt.";
  testResult.textContent=msg;
  setLog(msg,"ELEVTEST");
}
document.getElementById("run-code").addEventListener("click",runCode);
document.getElementById("reset-rover").addEventListener("click",()=>{if(!running){resetRover();setLog("Roveren er nulstillet til startpunktet.");testResult.textContent="Ikke testet endnu."}});
document.getElementById("clear-trail").addEventListener("click",()=>{if(!running){trail=[];redraw();setLog("Ruten er ryddet. Roverens position er uændret.")}});
document.getElementById("test-mission").addEventListener("click",testSolution);
document.getElementById("show-example").addEventListener("click",()=>{editor.value=missions[currentMission].code;updateLines();setLog("Eksempelkoden er sat ind. Læs den igennem, og tilpas den selv.")});
document.getElementById("clear-code").addEventListener("click",()=>{editor.value="";updateLines();editor.focus()});
document.getElementById("restore-code").addEventListener("click",()=>{editor.value=missions[currentMission].code;updateLines()});
makeMissionTabs();renderMission();updateLines();
