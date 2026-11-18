const products=window.BITE_PRODUCTS||[];
const grid=document.getElementById('productGrid'),search=document.getElementById('searchInput');
let active='all',cart=[],lang='uz';
const money=n=>new Intl.NumberFormat('uz-UZ').format(n)+' so‘m';
const translations={
uz:{menu:'Menyu',experience:'Tajriba',delivery:'Yetkazish',about:'Biz haqimizda',search:'Taom qidirish...',cart:'Savat',tag:'HOZIR MAVJUD',add:'Savatga',ready:'Hozir mavjud',soon:'Keyinroq mavjud'},
en:{menu:'Menu',experience:'Experience',delivery:'Delivery',about:'About us',search:'Search food...',cart:'Cart',tag:'AVAILABLE NOW',add:'Add',ready:'Available now',soon:'Available later'},
ru:{menu:'Меню',experience:'Впечатления',delivery:'Доставка',about:'О нас',search:'Поиск блюда...',cart:'Корзина',tag:'СЕЙЧАС ДОСТУПНО',add:'Добавить',ready:'Сейчас доступно',soon:'Позже'},
tr:{menu:'Menü',experience:'Deneyim',delivery:'Teslimat',about:'Hakkımızda',search:'Yemek ara...',cart:'Sepet',tag:'ŞİMDİ MEVCUT',add:'Ekle',ready:'Şimdi mevcut',soon:'Daha sonra'},
ar:{menu:'القائمة',experience:'التجربة',delivery:'التوصيل',about:'معلومات عنا',search:'ابحث عن طعام...',cart:'السلة',tag:'متاح الآن',add:'أضف',ready:'متاح الآن',soon:'متاح لاحقاً'}
};
function render(){
 let list=products.filter(p=>(active==='all'||p.category===active)&&(`${p.name} ${p.category} ${p.desc}`).toLowerCase().includes(search.value.toLowerCase()));
 const sort=document.getElementById('sortSelect').value;if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);
 document.getElementById('resultCount').textContent=list.length;document.getElementById('noResults').hidden=list.length>0;
 grid.innerHTML=list.map((p,i)=>`<article class="food-card" style="--delay:${(i%6)*.06}s"><div class="food-img"><img loading="lazy" src="https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=760&q=85" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=760&q=80'"><span class="food-flag">${p.flag} ${p.category}</span><button class="heart" aria-label="Sevimli">♡</button><span class="availability ${p.hours==='Hozir mavjud'?'yes':'later'}">${p.hours==='Hozir mavjud'?'● '+translations[lang].ready:'◷ '+p.hours}</span></div><div class="food-info"><div class="food-title"><h3>${p.name}</h3><span>★ ${(4.6+(p.id%4)*.1).toFixed(1)}</span></div><p>${p.desc}</p><div class="food-foot"><strong>${money(p.price)}</strong><button class="add" data-add="${p.id}">+ <span>${translations[lang].add}</span></button></div></div></article>`).join('');
}
function updateLang(){document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.textContent=translations[lang][key]});search.placeholder=translations[lang].search;render()}
document.getElementById('language').addEventListener('change',e=>{lang=e.target.value;document.documentElement.dir=lang==='ar'?'rtl':'ltr';updateLang()});
document.getElementById('categories').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active'));b.classList.add('active');active=b.dataset.cat;render()});
search.addEventListener('input',render);document.getElementById('sortSelect').addEventListener('change',render);
const toast=document.getElementById('toast');let toastTimer;
function showToast(t){toast.textContent=t;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1700)}
grid.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add){const p=products.find(x=>x.id===+add.dataset.add);const old=cart.find(x=>x.id===p.id);old?old.qty++:cart.push({...p,qty:1});updateCart();showToast('Savatga qo‘shildi ✨')}const heart=e.target.closest('.heart');if(heart){heart.classList.toggle('liked');heart.textContent=heart.classList.contains('liked')?'♥':'♡'}});
function updateCart(){document.getElementById('cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0);document.getElementById('cartTotal').textContent=money(cart.reduce((s,x)=>s+x.qty*x.price,0));document.getElementById('cartItems').innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><img src="https://images.unsplash.com/${x.image}?auto=format&fit=crop&w=120&q=70"><div><b>${x.name}</b><small>${money(x.price)}</small><div class="qty"><button data-minus="${x.id}">−</button>${x.qty}<button data-plus="${x.id}">+</button></div></div><button class="remove" data-remove="${x.id}">×</button></div>`).join(''):'<p class="empty">Savat hozircha bo‘sh 😋</p>'}
document.getElementById('cartItems').addEventListener('click',e=>{const id=+(e.target.dataset.plus||e.target.dataset.minus||e.target.dataset.remove);if(!id)return;const item=cart.find(x=>x.id===id);if(e.target.dataset.plus)item.qty++;else if(e.target.dataset.minus)item.qty--;else item.qty=0;cart=cart.filter(x=>x.qty>0);updateCart()});
const drawer=document.getElementById('cartDrawer'),backdrop=document.getElementById('backdrop');function openCart(){drawer.classList.add('open');backdrop.classList.add('show')}function closeCart(){drawer.classList.remove('open');backdrop.classList.remove('show')}
document.getElementById('cartOpen').onclick=openCart;document.getElementById('cartClose').onclick=closeCart;backdrop.onclick=closeCart;
const modal=document.getElementById('orderModal');document.getElementById('checkoutBtn').onclick=()=>{if(!cart.length){showToast('Avval taom tanlang 🙂');return}closeCart();modal.classList.add('show')};document.getElementById('modalClose').onclick=()=>modal.classList.remove('show');
document.getElementById('placeOrder').onclick=()=>{const n=document.getElementById('customerName').value.trim(),p=document.getElementById('customerPhone').value.trim(),a=document.getElementById('customerAddress').value.trim();const msg=document.getElementById('orderMessage');if(!n||!p||!a){msg.textContent='Iltimos, barcha maydonlarni to‘ldiring.';return}msg.textContent=`Rahmat, ${n}! Demo buyurtmangiz tayyorlandi. Taxminiy yetkazish: 30–45 daqiqa. Bu loyiha namoyishi — haqiqiy buyurtma yuborilmadi.`;cart=[];updateCart()};
document.getElementById('mobileMenu').onclick=()=>document.getElementById('navlinks').classList.toggle('show');
document.querySelectorAll('#navlinks a').forEach(a=>a.onclick=()=>document.getElementById('navlinks').classList.remove('show'));
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus()}if(e.key==='Escape'){closeCart();modal.classList.remove('show')}});
render();updateCart();
