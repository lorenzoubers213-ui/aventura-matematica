from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
if 'data-fix="stable-interaction-v3"' in s and 'data-fix="navigation-v4"' not in s:
    fix=r'''<script data-fix="navigation-v4">(function(){'use strict';
function q4(id){return document.getElementById(id)}
function go4(id){document.querySelectorAll('.screen').forEach(function(x){x.classList.remove('active')});var e=q4(id);if(e)e.classList.add('active');window.scrollTo(0,0)}
function safe4(id,fn){var e=q4(id);if(e)e.onclick=fn}
function home4(){if(typeof fgrades==='function')fgrades();go4('home')}
safe4('backExplore',home4);safe4('backExploreGrades',function(){go4('explore')});safe4('backExploreClasses',function(){go4('exploreGrades')});safe4('backExploreDifficulty',function(){go4('exploreClasses')});safe4('backExploreLesson',function(){go4('exploreDifficulty')});safe4('backQuick',function(){if(typeof quickGrades==='function')quickGrades();else go4('explore')});safe4('backQuickGame',function(){if(typeof quickDiff==='function')quickDiff();else go4('quickChallenges')});safe4('backMental',function(){go4('explore')});safe4('backMentalGame',function(){if(typeof mentalGrades==='function')mentalGrades();else go4('mental')});
['homeNav','homeBtn','backHome','footerHome'].forEach(function(id){safe4(id,home4)});
function bind4(){document.querySelectorAll('[data-home]').forEach(function(e){e.onclick=home4});document.querySelectorAll('.screen .back').forEach(function(b){var t=(b.textContent||'').toLowerCase();if(t.indexOf('inicio')>=0)b.onclick=home4});}
try{bind4()}catch(e){console.error('navigation v4',e)}
})();</script>'''
    s=s.replace('</body>',fix+'</body>',1)
p.write_text(s,encoding='utf-8')