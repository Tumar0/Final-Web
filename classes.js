$(function(){
 const PRICE={drop:4000,pass:32000,unl:28000};
 const $rows=$('#rows');
 DAYS.forEach((d,i)=>$('#fDay').append(`<option value="${i}">${d}</option>`));
 const qs=new URLSearchParams(location.search).get('q');if(qs)$('#fSearch').val(qs);
 CLASSES.forEach(c=>$('#bClass').append(`<option value="${c.id}">${DAYS[c.day]} ${c.time} · ${c.name}</option>`));
 function render(){
  const s=$('#fSearch').val().toLowerCase().trim(),d=$('#fDay').val(),l=$('#fLevel').val(),free=$('#fFree').is(':checked'),sort=$('#fSort').val();
  let list=CLASSES.filter(c=>(!s||(c.name+' '+c.teacher+' '+DAYS[c.day]).toLowerCase().includes(s))&&(d===''||c.day===+d)&&(!l||c.level===l)&&(!free||spotsLeft(c)>0));
  const key=c=>(c.day||7)*10000+parseInt(c.time);
  list.sort((a,b)=>sort==='spots'?spotsLeft(b)-spotsLeft(a):sort==='name'?a.name.localeCompare(b.name):key(a)-key(b));
  $rows.empty();let total=0;
  list.forEach(c=>{const n=spotsLeft(c),nd=nextDate(c);total+=n;
   $rows.append(`<tr><td><strong>${DAYS[c.day]}</strong><br><small class="muted">Next: ${fmt(nd)}</small></td><td>${c.time}</td><td>${c.name} · ${c.min} min</td><td>${c.teacher}</td><td>${levelTag(c.level)}</td>
   <td>${n?n+' left':'Full'}<span class="meter" aria-hidden="true"><b style="width:${100-n/12*100}%"></b></span></td><td><button type="button" class="btn-liara btn-sm book" data-id="${c.id}" ${n?'':'disabled'}>${n?'Book':'Full'}</button></td></tr>`)});
  $('#count').text(`Showing ${list.length} of ${CLASSES.length} classes · ${total} free spots in the next sessions`);
  $('#noRes').prop('hidden',list.length>0);
 }
 $('#filters').on('input change',render).on('submit',e=>e.preventDefault());
 $('#fClear').on('click',()=>{$('#filters')[0].reset();render()});
 $rows.on('click','.book',function(){const c=CLASSES.find(x=>x.id===+$(this).data('id'));$('#bClass').val(c.id);$('#bDate').val(iso(nextDate(c)));
  $('html,body').animate({scrollTop:$('#booking').offset().top-70},500,()=>$('#bName').trigger('focus'))});
 $('#bClass').on('change',function(){const c=CLASSES.find(x=>x.id===+this.value);if(c)$('#bDate').val(iso(nextDate(c)))});
 $('#bDate').attr('min',iso(new Date()));
 // calculator
 function calc(){const n=+$('#calcN').val();$('#calcOut').text(n);
  const opts=[['Drop-in',n*PRICE.drop],['10-class pass',Math.ceil(n/10)*PRICE.pass],['Unlimited',PRICE.unl]],min=Math.min(...opts.map(o=>o[1]));
  const f=v=>v.toLocaleString('ru-RU')+' ₸ / month';
  let h=opts.map(o=>`<div class="row-p ${o[1]===min?'best':''}"><span>${o[0]}${o[1]===min?' <span class="tag">BEST VALUE</span>':''}</span><strong>${f(o[1])}</strong></div>`).join('');
  const save=opts[0][1]-PRICE.unl;h+=`<p class="small muted m-0">${save>0?'With Unlimited you save '+save.toLocaleString('ru-RU')+' ₸ a month compared with drop-in.':'At this pace drop-in is cheaper than Unlimited.'}</p>`;$('#calcRes').html(h)}
 $('#calcN').on('input',calc);
 // FAQ
 const FAQ=[['Do I need to be flexible?','Not at all. Flexibility is a result of yoga, not a requirement. Teachers offer easier options for every pose.'],['What should I bring?','Just comfortable clothes and a water bottle. Mats, blocks and blankets are provided.'],['Can I cancel a booking?','Yes, up to 3 hours before class from your profile page. Later cancellations count as a visit.'],['How does the free first class work?','Book any class as a new student. Your first class is free; pay only if you decide to continue.'],['What if a class is full?','Choose another time. Full classes are shown as "Full" and cannot be booked.']];
 FAQ.forEach(f=>$('#faq').append(`<button type="button" class="faq-q" aria-expanded="false"><span>${f[0]}</span><span aria-hidden="true">+</span></button><div class="faq-a">${f[1]}</div>`));
 $('#faq').on('click','.faq-q',function(){const $q=$(this),$a=$q.next(),open=$q.attr('aria-expanded')==='true';
  if($a.is(':animated'))return;$q.attr('aria-expanded',!open).find('span:last').text(open?'+':'×');$a.slideToggle(200)});
 // form
 const u=Auth.user();if(u){$('#bName').val(u.name);$('#bEmail').val(u.email)}
 $('#bNote').on('input',function(){$('#noteCnt').text(this.value.length+' / 300')});
 const bad=(id,e,m)=>{$('#'+e).text(m);$('#'+id).toggleClass('bad',!!m);return !m};
 $('#bookForm').on('submit',function(ev){ev.preventDefault();$('#bookOk').empty();
  const v={name:$('#bName').val().trim(),email:$('#bEmail').val().trim(),phone:$('#bPhone').val().trim(),cid:+$('#bClass').val(),date:$('#bDate').val(),spots:+$('#bSpots').val(),exp:$('[name=exp]:checked').val(),note:$('#bNote').val().trim()};
  const c=CLASSES.find(x=>x.id===v.cid);let ok=true;
  ok&=bad('bName','eName',v.name.length<2?'Please enter your full name.':'');
  ok&=bad('bEmail','eEmail',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)?'':'Enter a valid email, e.g. name@mail.com.');
  ok&=bad('bPhone','ePhone',/^\+?[\d\s()-]{10,16}$/.test(v.phone)?'':'Enter a valid phone, e.g. +7 700 123 45 67.');
  ok&=bad('bClass','eClass',c?'':'Please choose a class.');
  let de='';if(!v.date)de='Please choose a date.';else if(v.date<iso(new Date()))de='The date cannot be in the past.';else if(c&&new Date(v.date+'T12:00').getDay()!==c.day)de='This class is held on '+DAYS[c.day]+'s.';
  ok&=bad('bDate','eDate',de);
  ok&=bad('bSpots','eSpots',Number.isInteger(v.spots)&&v.spots>=1&&v.spots<=3?(c&&v.spots>spotsLeft(c)?'Only '+spotsLeft(c)+' spots left.':''):'Choose from 1 to 3 spots.');
  $('#eExp').text(v.exp?'':'Please choose your experience.');ok&=!!v.exp;
  $('#eAgree').text($('#bAgree').is(':checked')?'':'Please agree to be contacted.');ok&=$('#bAgree').is(':checked');
  if(!ok){$('.bad:first,#bookForm :focus').first().trigger('focus');return}
  const b=Store.get('liara_bookings',[]);b.push({id:Date.now(),classId:c.id,name:c.name,day:DAYS[c.day],time:c.time,date:v.date,spots:v.spots,who:v.name,email:v.email});Store.set('liara_bookings',b);
  refreshCount();render();this.reset();$('#noteCnt').text('0 / 300');
  $('#bookOk').html(`<div class="msg-ok" role="status">Thank you, ${$('<i>').text(v.name.split(' ')[0]).html()}! Your spot in ${c.name} on ${v.date} is reserved. <a href="profile.html">See my bookings</a></div>`).hide().slideDown(250);
 });
 render();calc();
});
