/* shared: storage, theme, navigation, footer, jQuery effects */
const Store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v===null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const Auth={user(){const e=Store.get('liara_session',null);return Store.get('liara_users',[]).find(u=>u.email===e)||null},logout(){localStorage.removeItem('liara_session')}};
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);Store.set('liara_theme',t);$('#themeBtn').attr('aria-pressed',t==='dark').text(t==='dark'?'☀ Light mode':'☾ Dark mode')}
function buildNav(){
  const page=location.pathname.split('/').pop()||'index.html',u=Auth.user(),n=Store.get('liara_bookings',[]).length;
  const l=(h,t)=>`<a class="lnk ${page===h?'active':''}" href="${h}" ${page===h?'aria-current="page"':''}>${t}</a>`;
  $('#site-header').html(`<a class="skip" href="#main">Skip to content</a><nav class="site-nav" aria-label="Main"><div class="wrap">
  <a class="brand" href="index.html"><span class="dot"></span>Liara</a><div class="nav-links">${l('index.html','Home')}${l('classes.html','Classes &amp; Booking')}
  ${u?l('profile.html','My bookings <span class="badge-n" id="navCount">'+n+'</span>')+'<a class="lnk" href="#" id="logoutBtn">Log out ('+$('<i>').text(u.name.split(' ')[0]).html()+')</a>':l('login.html','Log in')}
  <button class="toggle" id="themeBtn" type="button"></button><a class="btn-liara btn-sm" href="classes.html#booking">Book a class</a></div></div></nav>`);
  applyTheme(Store.get('liara_theme',matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
  $('#themeBtn').on('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
  $('#logoutBtn').on('click',e=>{e.preventDefault();Auth.logout();location.href='index.html'});
}
function buildFooter(){$('#site-footer').html(`<div class="wrap"><div class="row g-4"><div class="col-md-4"><h2>Liara Yoga Studio</h2><p>A quiet place in the middle of a busy city. Student project, all names and prices are fictional.</p></div>
<div class="col-md-4"><h2>Pages</h2><a href="index.html">Home</a><br><a href="classes.html">Classes &amp; Booking</a><br><a href="login.html">Log in / Sign up</a></div>
<div class="col-md-4"><h2>Visit us</h2><p>Example Street 24<br>Astana, Kazakhstan<br>hello@liara-yoga.example</p></div></div>
<hr><small>© 2026 Liara Yoga Studio · Credits: Google Fonts (Fraunces, Manrope), Bootstrap 5.3, jQuery 3.7, code written with help of Claude (Anthropic AI), emoji icons are system emoji.</small></div><button id="toTop" type="button" aria-label="Back to top">↑</button>`);
  $('#toTop').on('click',()=>$('html,body').animate({scrollTop:0},400));
  $(window).on('scroll',()=>$('#toTop')[$(window).scrollTop()>400?'fadeIn':'fadeOut'](150));}
function refreshCount(){$('#navCount').text(Store.get('liara_bookings',[]).length)}
$(function(){buildNav();buildFooter();
  $('.reveal').hide().each(function(i){$(this).delay(i*90).fadeIn(450)});
});
