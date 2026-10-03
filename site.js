// Wspólne skrypty strony: motyw, rok w stopce, kopiowanie e-maila.

// Rok w stopce
(function(){
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Przełącznik motywu: jasny / ciemny (domyślnie ciemny)
(function(){
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var buttons = document.querySelectorAll('[data-theme-set]');
  function sync(){
    var c = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    buttons.forEach(function(b){ b.setAttribute('aria-pressed', String(b.dataset.themeSet === c)); });
    if (meta) meta.setAttribute('content', c === 'light' ? '#F4F5F7' : '#1A1C1F');
  }
  buttons.forEach(function(b){
    b.addEventListener('click', function(){
      if (b.dataset.themeSet === 'light') { root.setAttribute('data-theme', 'light'); try { localStorage.setItem('theme', 'light'); } catch(e){} }
      else { root.removeAttribute('data-theme'); try { localStorage.removeItem('theme'); } catch(e){} }
      sync();
    });
  });
  sync();
})();

// Kopiowanie adresu e-mail
(function(){
  var btn = document.getElementById('copy');
  var hint = document.getElementById('copy-hint');
  var email = document.getElementById('email');
  if (!btn || !hint || !email) return;
  var addr = email.textContent.trim();
  btn.addEventListener('click', function(){
    function done(){ btn.textContent = 'Skopiowano'; hint.textContent = 'Adres e-mail skopiowany do schowka.'; setTimeout(function(){ btn.textContent = 'Kopiuj adres'; hint.textContent = ''; }, 2200); }
    function fail(){ hint.textContent = 'Nie udało się skopiować. Zaznacz adres i skopiuj go ręcznie.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(done, fail);
    } else { fail(); }
  });
})();
