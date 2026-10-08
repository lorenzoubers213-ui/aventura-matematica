const GRADES=Array.from({length:11},(_,i)=>i+1),LEVELS=10,QUESTIONS=20;
let state=JSON.parse(localStorage.getItem('aventuraMatematica')||'{}');
state.xp??=0;state.coins??=0;state.streak??=0;state.completed??={};state.correct??=0;state.total??=0;
let grade=1,level=1,qIndex=0,score=0,current=null;
const $=id=>document.getElementById(id);
const ANIMALS=['🐰 Conejo','🐱 Gato','🐶 Perro','🦊 Zorro','🐼 Panda','🐯 Tigre','🦁 León','🐺 Lobo','🦅 Águila','🐉 Dragón','🦄 Unicornio'];
const BOSSES=['👹 Rey de las Sumas','🐲 Dragón de las Operaciones','🧙‍♂️ Mago de la Multiplicación','🐉 Dragón de las Divisiones','🤖 Guardián de los Decimales','🦖 Titán de los Porcentajes','👑 Rey del Álgebra','🐲 Dragón de las Ecuaciones','🧛 Maestro de las Potencias','🧙‍♂️ Hechicero de las Funciones','🐉 Dragón Matemático Supremo'];
const ANIMAL_TIPS=['💡 Cuenta con calma y revisa cada paso.','💡 Busca primero la operación que necesitas.','💡 Divide el problema en pasos pequeños.','💡 Revisa la operación antes de responder.','💡 Usa lo que ya aprendiste en los niveles anteriores.'];
function save(){localStorage.setItem('aventuraMatematica',JSON.stringify(state));updateStats()}
function updateStats(){$('xp').textContent=state.xp;$('coins').textContent=state.coins;$('streak').textContent=state.streak}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$(id).classList.add('active');window.scrollTo(0,0)}
function showHome(){renderGrades();show('home')}
function showStats(){show('credits');$('credits').innerHTML=`<div class="card center"><h2>📊 Estadísticas</h2><p>⭐ XP: <b>${state.xp}</b></p><p>🪙 Monedas: <b>${state.coins}</b></p><p>🔥 Racha: <b>${state.streak}</b></p><p>✅ Aciertos: <b>${state.correct}/${state.total}</b></p><button class="primary" onclick="showHome()">Volver a jugar</button></div>`}
function showCredits(){show('credits');$('credits').innerHTML='<div class="card center"><h2>🏆 ¡Sigue aprendiendo!</h2><p>Completa niveles para ganar XP y monedas.</p></div>'}
function renderGrades(){$('grades').innerHTML=GRADES.map(g=>`<button class="grade" type="button" onclick="selectGrade(${g})"><b>📚 ${g}° grado</b><span>10 niveles · 20 preguntas</span><small>▶ Entrar al grado</small></button>`).join('')}
function selectGrade(g){grade=g;renderLevels();show('levels')}
function completed(g,l){return !!state.completed[`${g}-${l}`]}
function unlocked(l){return l===1||completed(grade,l-1)}
function renderLevels(){$('gradeTitle').textContent=`${grade}° grado`;$('levelGrid').innerHTML=Array.from({length:LEVELS},(_,i)=>{const l=i+1,done=completed(grade,l),open=unlocked(l);return `<button type="button" class="level ${open?'':'locked'}" ${open&&!done?`onclick="startLevel(${l})"`: 'disabled'}><b>${done?'✅ ':open?'▶️ ':'🔒 '}Nivel ${l}${l===10?' 👑':''}</b><span>${done?'Completado':open?(l===10?'20 preguntas · 👑 Jefe final':'20 preguntas · '+ANIMALS[(gIndex(grade,l))%ANIMALS.length]):'Completa el nivel anterior'}</span></button>`}).join('')}
function gIndex(g,l){return ((g-1)*LEVELS+(l-1))}
function animalFor(g,l){return ANIMALS[gIndex(g,l)%ANIMALS.length]}
function startLevel(l){level=l;qIndex=0;score=0;show('quiz');nextQuestion()}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function makeQuestion(g){let a,b,type;if(g<=2){a=rand(1,20);b=rand(1,20);return Math.random()<.55?mk(`${a} + ${b} = ?`,a+b,'Suma'):mk(`${Math.max(a,b)} - ${Math.min(a,b)} = ?`,Math.abs(a-b),'Resta')}if(g<=4){type=rand(0,2);a=rand(2,20);b=rand(2,12);if(type===0)return mk(`${a} × ${b} = ?`,a*b,'Multiplicación');if(type===1)return mk(`${a*b} ÷ ${b} = ?`,a,'División');return mk(`¿Cuál es ${a}²?`,a*a,'Potencias')}if(g<=6){a=rand(10,99);b=rand(2,30);type=rand(0,2);if(type===0)return mk(`${a} + ${b} = ?`,a+b,'Números naturales');if(type===1)return mk(`${a} - ${b} = ?`,a-b,'Números naturales');return mk(`¿Cuál es el 10% de ${a*10}?`,a,'Porcentajes')}if(g<=8){a=rand(2,12);b=rand(2,12);type=rand(0,2);if(type===0)return mk(`Resuelve: ${a}x = ${a*b}`,b,'Ecuaciones');if(type===1)return mk(`Simplifica: ${a}/${b} + ${a}/${b}`,2*a/b,'Fracciones');return mk(`Si x = ${a}, ¿cuánto vale 2x + ${b}?`,2*a+b,'Álgebra')}if(g<=10){a=rand(2,12);b=rand(2,12);type=rand(0,2);if(type===0)return mk(`Resuelve: x + ${a} = ${a+b}`,b,'Ecuaciones lineales');if(type===1)return mk(`¿Cuánto es ${a}² + ${b}²?`,a*a+b*b,'Álgebra');return mk(`Pendiente entre (0,0) y (${a},${b}) = ?`,b/a,'Geometría analítica')}a=rand(2,12);b=rand(2,12);type=rand(0,2);if(type===0)return mk(`Derivada de x² en x=${a}`,2*a,'Cálculo');if(type===1)return mk(`Si 2x + ${a} = ${b+a}, x = ?`,b,'Álgebra avanzada');return mk('Probabilidad de sacar un número par en un dado justo',0.5,'Probabilidad')}
function mk(q,a,t){const answer=Number.isInteger(a)?String(a):String(Math.round(a*100)/100);const opts=new Set([answer]);while(opts.size<4){const d=rand(-Math.max(3,Math.ceil(Math.abs(a)*.3)),Math.max(3,Math.ceil(Math.abs(a)*.3)));opts.add(String(Math.round((Number(a)+d)*100)/100))}return{q,a:answer,opts:[...opts].sort(()=>Math.random()-.5),t}}
function nextQuestion(){if(qIndex>=QUESTIONS){finishLevel();return}current=makeQuestion(grade);const animal=animalFor(grade,level);$('progress').textContent=`Pregunta ${qIndex+1} de ${QUESTIONS}`;$('topic').textContent=current.t;$('question').textContent=current.q;$('feedback').textContent='Elige una respuesta';$('feedback').className='feedback waiting';$('next').disabled=true;$('next').hidden=true;$('answers').innerHTML=current.opts.map(x=>`<button type="button" class="answer" onclick="answer(this,${JSON.stringify(x)})">${x}</button>`).join('');if($('animal'))$('animal').textContent=animal.split(' ')[0];if($('animalName'))$('animalName').textContent=animal.split(' ').slice(1).join(' ')+' · compañero del nivel '+level;if($('animalMsg'))$('animalMsg').textContent=level===10?'👑 ¡Prepárate para el jefe final!':'¡Tu compañero te acompaña en este nivel!';if($('tip'))$('tip').textContent=ANIMAL_TIPS[(gIndex(grade,level)+qIndex)%ANIMAL_TIPS.length]}
function answer(btn,val){if(!current||btn.disabled)return;document.querySelectorAll('.answer').forEach(x=>x.disabled=true);state.total++;const good=String(val)===current.a;if(good){score++;state.correct++;state.xp+=10;state.coins+=2;state.streak++;btn.classList.add('correct');$('feedback').className='feedback correct-feedback';$('feedback').textContent='✅ ¡Correcto! +10 XP y +2 monedas'}else{state.streak=0;btn.classList.add('wrong');document.querySelectorAll('.answer').forEach(x=>{if(x.textContent===current.a)x.classList.add('correct')});$('feedback').className='feedback wrong-feedback';$('feedback').textContent=`❌ Incorrecto. La respuesta correcta es ${current.a}.`}save();$('next').disabled=false;$('next').hidden=false;$('next').textContent=qIndex===QUESTIONS-1?'🏆 Terminar nivel':'➡️ Siguiente pregunta'}
$('next').onclick=()=>{qIndex++;nextQuestion()};
function showLevels(){renderLevels();show('levels')}
function finishLevel(){state.completed[`${grade}-${level}`]=true;state.xp+=50;state.coins+=10;save();if(level===10){alert(`👑 ¡JEFE FINAL DE ${grade}° GRADO!\n${BOSSES[grade-1]}\n\n¡Has derrotado al jefe completando el nivel 10!\nAciertos: ${score}/${QUESTIONS}\n+50 XP y +10 monedas`)}else{alert(`🏆 ¡Nivel ${level} completado!\nAciertos: ${score}/${QUESTIONS}\n+50 XP y +10 monedas`)}showLevels()}
updateStats();renderGrades();show('home');
if('serviceWorker'in navigator)navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});

/* Modo oscuro: usa captura para no depender de otros listeners y queda completamente aislado de Inicio. */
(function(){
  const initTheme=()=>{
    const btn=document.getElementById('themeBtn');
    if(!btn)return;
    const getDark=()=>document.documentElement.classList.contains('dark')||document.body.classList.contains('dark');
    const apply=dark=>{
      document.documentElement.classList.toggle('dark',!!dark);
      document.body.classList.toggle('dark',!!dark);
      btn.textContent=dark?'☀️ Claro':'🌙 Oscuro';
      btn.setAttribute('aria-pressed',dark?'true':'false');
    };
    let dark=false;
    try{dark=localStorage.getItem('aventuraTemaOscuro')==='1'}catch(_){dark=false}
    apply(dark);
    btn.type='button';
    document.addEventListener('click',function(e){
      const target=e.target&&e.target.closest?e.target.closest('#themeBtn'):null;
      if(target!==btn)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      const next=!getDark();
      try{localStorage.setItem('aventuraTemaOscuro',next?'1':'0')}catch(_){ }
      apply(next);
    },true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initTheme,{once:true});else initTheme();
})();

/* Inicio: completamente independiente del modo oscuro. */
(function(){
  const initHome=()=>document.addEventListener('click',function(e){
    const b=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!b)return;
    const text=(b.textContent||'').trim().toLowerCase();
    if(!text.includes('inicio'))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
    const home=document.getElementById('home');
    if(home)home.classList.add('active');
    window.scrollTo(0,0);
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initHome,{once:true});else initHome();
})();