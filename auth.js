$(function(){
 if(Auth.user()){location.replace('profile.html');return}
 const bad=(id,e,m)=>{$('#'+e).text(m);$('#'+id).toggleClass('bad',!!m);return !m};
 const hash=s=>{let h=5381;for(const c of s)h=((h<<5)+h+c.charCodeAt(0))|0;return String(h)};
 function tab(up){$('#loginForm').prop('hidden',up);$('#signForm').prop('hidden',!up);$('#tabIn').attr('aria-pressed',!up);$('#tabUp').attr('aria-pressed',up)}
 $('#tabIn').on('click',()=>tab(false));$('#tabUp').on('click',()=>tab(true));if(location.hash==='#signup')tab(true);
 $('#signForm').on('submit',function(e){e.preventDefault();
  const n=$('#sName').val().trim(),m=$('#sEmail').val().trim().toLowerCase(),p=$('#sPass').val(),p2=$('#sPass2').val(),users=Store.get('liara_users',[]);let ok=true;
  ok&=bad('sName','esName',n.length<2?'Please enter your name.':'');
  ok&=bad('sEmail','esEmail',!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)?'Enter a valid email.':users.some(u=>u.email===m)?'This email is already registered.':'');
  ok&=bad('sPass','esPass',p.length<6||!/\d/.test(p)?'Use at least 6 characters including a digit.':'');
  ok&=bad('sPass2','esPass2',p!==p2?'Passwords do not match.':'');
  if(!ok)return;
  users.push({name:n,email:m,pass:hash(p),since:new Date().toISOString()});Store.set('liara_users',users);
  $('#sOk').html('<div class="msg-ok mb-2" role="status">Account created! You can now log in.</div>');
  this.reset();setTimeout(()=>{tab(false);$('#lEmail').val(m).trigger('focus')},1200)});
 $('#loginForm').on('submit',function(e){e.preventDefault();$('#elForm').text('');
  const m=$('#lEmail').val().trim().toLowerCase(),p=$('#lPass').val();let ok=true;
  ok&=bad('lEmail','elEmail',m?'':'Please enter your email.');ok&=bad('lPass','elPass',p?'':'Please enter your password.');if(!ok)return;
  const u=Store.get('liara_users',[]).find(x=>x.email===m&&x.pass===hash(p));
  if(!u){$('#elForm').text('Wrong email or password.');$('#loginForm').fadeOut(80).fadeIn(80);return}
  Store.set('liara_session',u.email);location.href='profile.html'});
});
