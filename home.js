$(function(){
 const Q=[{q:'How does your body feel at the end of the workday?',a:[['Stiff neck and sore back','mob'],['Tired, but my mind keeps racing','rest'],['Restless, I need to burn energy','pow'],['Fine, I just want to keep moving','flow']]},
 {q:'How much yoga experience do you have?',a:[['None yet','rest'],['A few classes','mob'],['I practise regularly','pow'],['Years of practice','adv']]},
 {q:'When do you prefer to practise?',a:[['Early morning','flow'],['After work','rest'],['Weekend','flow'],['Whenever it fits','mob']]},
 {q:'What do you want most?',a:[['Calm and sleep','rest'],['Strength','pow'],['Pain-free back','mob'],['A challenge','adv']]}];
 const R={mob:['Mobility for Desk Workers','Targeted stretches for neck, shoulders and lower back.'],rest:['Evening Restore','Soft light and breathwork to release the day.'],pow:['Power Hatha','Longer holds and strong standing poses.'],flow:['Morning Flow','A gentle vinyasa that wakes up the spine.'],adv:['Advanced Vinyasa','Inversions, arm balances, flowing sequences.']};
 let i=0,ans=[];
 function show(){const q=Q[i],sel=ans[i];
  $('#quiz').html(`<div class="eyebrow" style="font-size:.7rem">Question ${i+1} of ${Q.length}</div><div class="bar my-2" role="progressbar" aria-valuenow="${i+1}" aria-valuemin="1" aria-valuemax="4"><div style="width:${(i+1)*25}%"></div></div>
  <h3 class="h5 my-3">${q.q}</h3>`+q.a.map((a,k)=>`<button type="button" class="opt ${sel===k?'sel':''}" data-k="${k}"><kbd>${k+1}</kbd>${a[0]}</button>`).join('')+
  `<div class="err" id="qErr" role="alert"></div><button type="button" class="btn-line btn-sm" id="back" ${i?'':'disabled'}>Back</button> <button type="button" class="btn-liara btn-sm" id="next">${i===3?'See my class':'Next'}</button>`);}
 function result(){const t={};ans.forEach((k,n)=>{const key=Q[n].a[k][1];t[key]=(t[key]||0)+1});
  const best=Object.keys(t).sort((a,b)=>t[b]-t[a])[0],r=R[best];Store.set('liara_quiz',{name:r[0],date:new Date().toISOString()});
  $('#quiz').html(`<div class="eyebrow">Your match</div><h3 class="my-2">${r[0]}</h3><p class="muted">${r[1]}</p><a class="btn-liara btn-sm" href="classes.html?q=${encodeURIComponent(r[0])}#schedule">See times</a> <button type="button" class="btn-line btn-sm" id="again">Start again</button>`).hide().fadeIn(300);}
 $('#quiz').on('click','.opt',function(){ans[i]=+$(this).data('k');show()}).on('click','#next',()=>{if(ans[i]===undefined){$('#qErr').text('Please choose an answer.');return}i<3?(i++,show()):result()})
  .on('click','#back',()=>{i--;show()}).on('click','#again',()=>{i=0;ans=[];show()});
 $(document).on('keydown',e=>{if($(e.target).is('input,textarea,select,button'))return;if(/^[1-4]$/.test(e.key)&&$('.opt').length){ans[i]=+e.key-1;show()}if(e.key==='Enter'&&$('#next').length)$('#next').click()});
 show();
 const ph=['Inhale','Hold','Exhale','Hold'];let p=1,run=true;
 setInterval(()=>{if(run){$('#breathTxt').stop(true,true).fadeOut(150,function(){$(this).text(ph[p++%4]).fadeIn(150)})}},4000);
 $('#pauseBreath').on('click',function(){run=!run;$('.breath').toggleClass('paused',!run);$(this).text(run?'Pause breathing guide':'Resume breathing guide')});
 $('.cardx').on('mouseenter',function(){$(this).find('.ico').stop(true).animate({marginTop:'-4px'},150)}).on('mouseleave',function(){$(this).find('.ico').stop(true).animate({marginTop:0},150)});
 const RV=[['Alina','Slow Sunday Flow is the best part of my week.'],['Timur','My neck pain is gone after a month of Mobility classes.'],['Saule','No mirrors, no pressure — finally a studio that feels calm.'],['Daniyar','Power Hatha is tough but friendly. Highly recommend.']];let r=0;
 function rv(){$('#review').stop(true,true).fadeOut(200,function(){$(this).html(`<p class="h5 fst-italic">“${RV[r][1]}”</p><p class="muted">— ${RV[r][0]}</p>`).fadeIn(200)})}
 $('#rvNext').on('click',()=>{r=(r+1)%RV.length;rv()});$('#rvPrev').on('click',()=>{r=(r+RV.length-1)%RV.length;rv()});rv();
});
