const CLASSES=[
{id:1,day:1,time:'07:30',name:'Morning Flow',min:60,teacher:'Aigerim',level:'All levels',left:5},
{id:2,day:1,time:'19:30',name:'Evening Restore',min:60,teacher:'Madina',level:'Beginner',left:3},
{id:3,day:2,time:'19:00',name:'Power Hatha',min:75,teacher:'Dana',level:'Intermediate',left:2},
{id:4,day:3,time:'07:30',name:'Morning Flow',min:60,teacher:'Aigerim',level:'All levels',left:7},
{id:5,day:3,time:'19:30',name:'Evening Restore',min:60,teacher:'Madina',level:'Beginner',left:6},
{id:6,day:4,time:'19:00',name:'Power Hatha',min:75,teacher:'Dana',level:'Intermediate',left:4},
{id:7,day:5,time:'07:30',name:'Morning Flow',min:60,teacher:'Aigerim',level:'All levels',left:8},
{id:8,day:5,time:'18:30',name:'Advanced Vinyasa',min:90,teacher:'Aigerim',level:'Advanced',left:0},
{id:9,day:6,time:'10:00',name:'Power Hatha',min:75,teacher:'Dana',level:'Intermediate',left:1},
{id:10,day:6,time:'12:00',name:'Mobility for Desk Workers',min:60,teacher:'Dana',level:'Beginner',left:9},
{id:11,day:0,time:'11:00',name:'Slow Sunday Flow',min:75,teacher:'Madina',level:'All levels',left:6},
{id:12,day:0,time:'18:00',name:'Evening Restore',min:60,teacher:'Madina',level:'Beginner',left:10}];
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function nextDate(c){const n=new Date(),d=new Date(n);d.setHours(...c.time.split(':').map(Number),0,0);const k=(c.day-n.getDay()+7)%7;d.setDate(n.getDate()+k);if(d<n)d.setDate(d.getDate()+7);return d}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function fmt(d){return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}
function spotsLeft(c){const b=Store.get('liara_bookings',[]).filter(x=>x.classId===c.id).reduce((s,x)=>s+x.spots,0);return Math.max(0,c.left-b)}
function levelTag(l){return `<span class="tag ${l==='Advanced'?'adv':l==='Beginner'?'beg':''}">${l}</span>`}
