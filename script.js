const API_URL = "https://script.google.com/macros/s/AKfycbwAH5IqsozCDfluJu7yTXX82V0NVVWiQHHwdbuA_UxmgsTP3LBLHhxSrVlczRvtkv6j/exec";

let skins = [];
let isAdmin = false;

// جلب السكينات من Google Sheets وعرضها
function fetchSkins() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      skins = data;
      displaySkins();
      if (isAdmin) buildOrderControls(); // ترتيب السكينات
    })
    .catch(err => {
      console.error("خطأ في جلب السكينات:", err);
    });
}

// عرض السكينات على الصفحة
function displaySkins() {
  const container = document.getElementById('skinsContainer');
  container.innerHTML = '';

  skins.forEach((skin, index) => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card p-3 h-100">
          <img src="${skin.image}" alt="${skin.name}" class="img-fluid rounded mb-3" />
          <h4>${skin.name}</h4>
          <p>${skin.desc || ''}</p>
          <p><strong>Price:</strong> ${skin.price}</p>
          <a href="https://discord.gg/9URtB2rF" target="_blank" class="btn btn-discord">Purchase</a>
          ${isAdmin ? `
            <div class="mt-3 d-flex justify-content-between">
              <button onclick="moveUp(${index})" class="btn btn-sm btn-primary">⬆️</button>
              <button onclick="moveDown(${index})" class="btn btn-sm btn-primary">⬇️</button>
              <button onclick="deleteSkin(${index})" class="btn btn-sm btn-danger">🗑️</button>
            </div>
          ` : ''}
        </div>
      </div>`;
  });
}

// إضافة سكين جديد
function addSkin() {
  const name = document.getElementById('skinName').value.trim();
  const image = document.getElementById('skinImage').value.trim();
  const price = document.getElementById('skinPrice').value.trim();
  const desc = document.getElementById('skinDesc').value.trim();

  if (!name || !image || !price) {
    alert('Please fill in the required fields');
    return;
  }

  const newSkin = { name, image, price, desc };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(newSkin),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.text())
    .then(() => {
      alert("تمت إضافة السكين بنجاح!");
      document.getElementById("skinName").value = "";
      document.getElementById("skinImage").value = "";
      document.getElementById("skinPrice").value = "";
      document.getElementById("skinDesc").value = "";
      fetchSkins(); // تحديث العرض بعد الإضافة
    })
    .catch(err => {
      console.error("خطأ في الإضافة:", err);
      alert("حدث خطأ أثناء الإضافة.");
    });
}

// التحقق من كلمة المرور وعرض لوحة التحكم
function togglePassword() {
  const prompt = document.getElementById('passwordPrompt');
  prompt.style.display = (prompt.style.display === 'none') ? 'block' : 'none';
}

function checkPassword() {
  const pass = document.getElementById('adminPassword').value;
  if (pass === '99') {
    isAdmin = true;
    document.getElementById('addSkinForm').style.display = 'block';
    document.getElementById('passwordPrompt').style.display = 'none';
    displaySkins();
    buildOrderControls();
  } else {
    alert('Wrong password');
  }
}

// ترتيب السكينات (محلي فقط — غير محفوظ دائمًا)
function moveUp(index) {
  if (index === 0) return;
  [skins[index - 1], skins[index]] = [skins[index], skins[index - 1]];
  displaySkins();
  buildOrderControls();
}

function moveDown(index) {
  if (index === skins.length - 1) return;
  [skins[index + 1], skins[index]] = [skins[index], skins[index + 1]];
  displaySkins();
  buildOrderControls();
}

function deleteSkin(index) {
  alert("خاصية الحذف غير مفعلة حالياً (Google Sheets لا يدعم الحذف عبر API بسهولة)");
}

// ترتيب السكينات في الواجهة
function buildOrderControls() {
  const container = document.getElementById('orderControls');
  container.innerHTML = '';
  skins.forEach((skin, index) => {
    container.innerHTML += `
      <div class="d-flex align-items-center mb-2">
        <span class="flex-grow-1">${skin.name}</span>
        <button onclick="moveUp(${index})">⬆️</button>
        <button onclick="moveDown(${index})">⬇️</button>
        <button onclick="deleteSkin(${index})">🗑️</button>
      </div>
    `;
  });
}

// خلفية الجزيئات
tsParticles.load("particles-js", {
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
    },
  },
  particles: {
    color: { value: ["#6c00ff", "#00d4ff"] },
    links: { color: "#6c00ff", distance: 150, enable: true, opacity: 0.4, width: 1 },
    collisions: { enable: false },
    move: { directions: "none", enable: true, outModes: { default: "bounce" }, speed: 2 },
    number: { density: { enable: true, area: 800 }, value: 60 },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 2, max: 4 } },
  },
  detectRetina: true,
});

window.onload = fetchSkins;
