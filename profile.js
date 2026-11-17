$(function(){
 const u=Auth.user();if(!u){location.replace('login.html');return}
 $('#hello').text('Hello, '+u.name.split(' ')[0]);$('#pName').text(u.name);$('#pEmail').text(u.email);
 $('#pSince').text(new Date(u.since).toLocaleDateString('en-GB'));
 const q=Store.get('liara_quiz',null);$('#pQuiz').empty().append(q?$('<a>').attr('href','classes.html?q='+encodeURIComponent(q.name)).text(q.name):'Not taken yet');
 function draw(){const b=Store.get('liara_bookings',[]),$l=$('#bookList').empty();
  $('#pCount').text(b.length);$('#pTotal').text(b.reduce((s,x)=>s+x.spots,0)+' spots');$('#clearAll').prop('disabled',!b.length);refreshCount();
  if(!b.length){$l.html('<div class="cardx empty">No bookings yet. <a href="classes.html#schedule">Find a class</a></div>');return}
  b.forEach(x=>{const $c=$('<div class="cardx mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2" style="height:auto">').attr('data-id',x.id);
   $c.append($('<div>').append($('<strong>').text(x.name),$('<div class="muted small">').text(x.day+' '+x.time+' · '+x.date+' · '+x.spots+(x.spots>1?' spots':' spot')+' · '+x.who)));
   $c.append($('<button type="button" class="btn-line btn-sm">').text('Cancel').attr('aria-label','Cancel '+x.name+' on '+x.date));$l.append($c)})}
 $('#bookList').on('click','button',function(){const $c=$(this).closest('[data-id]');if($c.is(':animated'))return;const id=+$c.data('id');
  $c.slideUp(250,()=>{Store.set('liara_bookings',Store.get('liara_bookings',[]).filter(x=>x.id!==id));draw()})});
 $('#clearAll').on('click',()=>{if(confirm('Cancel all bookings?')){Store.set('liara_bookings',[]);draw()}});
 draw();
});
