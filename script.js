
/* =========================================
   TOOLVIA - MAIN JAVASCRIPT
   Complete stable version
========================================= */

"use strict";

/* 1. TOOLS DATABASE */

const tools = [
  {
    id: "age",
    cat: "time",
    icon: "🎂",
    name: "حاسبة العمر",
    desc: "احسب عمرك بالسنوات والأشهر والأيام"
  },
  {
    id: "bmi",
    cat: "calc",
    icon: "⚖️",
    name: "حاسبة BMI",
    desc: "احسب مؤشر كتلة الجسم"
  },
  {
    id: "discount",
    cat: "calc",
    icon: "🏷️",
    name: "حاسبة الخصم",
    desc: "اعرف السعر بعد الخصم وقيمة التوفير"
  },
  {
    id: "percent",
    cat: "calc",
    icon: "%",
    name: "حاسبة النسبة المئوية",
    desc: "احسب نسبة رقم من رقم آخر"
  },
  {
    id: "loan",
    cat: "calc",
    icon: "💳",
    name: "حاسبة القرض",
    desc: "احسب القسط الشهري بشكل تقريبي"
  },
  {
    id: "length",
    cat: "convert",
    icon: "📏",
    name: "تحويل الطول",
    desc: "متر، سنتيمتر، قدم، بوصة"
  },
  {
    id: "weight",
    cat: "convert",
    icon: "⚖️",
    name: "تحويل الوزن",
    desc: "كيلوجرام، جرام، رطل"
  },
  {
    id: "temp",
    cat: "convert",
    icon: "🌡️",
    name: "تحويل الحرارة",
    desc: "مئوية، فهرنهايت، كلفن"
  },
  {
    id: "words",
    cat: "text",
    icon: "📝",
    name: "عداد الكلمات",
    desc: "احسب الكلمات والحروف والأسطر"
  },
  {
    id: "textcase",
    cat: "text",
    icon: "🔤",
    name: "تنسيق النص",
    desc: "تحويل وتنظيف النصوص"
  },
  {
    id: "date",
    cat: "time",
    icon: "📅",
    name: "حساب فرق التاريخ",
    desc: "اعرف الفرق بين تاريخين"
  },
  {
    id: "timer",
    cat: "time",
    icon: "⏱️",
    name: "مؤقت بسيط",
    desc: "عد تنازلي بالدقائق والثواني"
  }
];


/* 2. GLOBAL VARIABLES */

const grid = document.querySelector("#toolsGrid");
const search = document.querySelector("#searchInput");
const count = document.querySelector("#resultCount");

let active = "all";
let interval = null;


/* 3. DISPLAY TOOLS */

function render() {

  if (!grid || !search || !count) return;

  const q = search.value.trim().toLowerCase();

  const list = tools.filter(tool => {

    const matchesCategory =
      active === "all" || tool.cat === active;

    const text =
      `${tool.name} ${tool.desc}`.toLowerCase();

    return matchesCategory && text.includes(q);

  });

  count.textContent = `${list.length} أداة متاحة`;

  if (list.length === 0) {

    grid.innerHTML = `
      <div class="empty">
        لا توجد أداة مطابقة للبحث.
      </div>
    `;

    return;
  }

  grid.innerHTML = list.map(tool => `

    <article class="tool-card" data-id="${tool.id}">

      <div class="tool-icon">${tool.icon}</div>

      <h3>${tool.name}</h3>

      <p>${tool.desc}</p>

      <span class="tool-tag">
        فتح الأداة ←
      </span>

    </article>

  `).join("");

}


/* 4. TOOL CARD CLICK */

if (grid) {

  grid.addEventListener("click", event => {

    const card = event.target.closest(".tool-card");

    if (!card) return;

    const id = card.dataset.id;

    if (id === "discount") {
      window.location.href = "discount.html";
      return;
    }

    openTool(id);

  });

}


/* 5. SEARCH */

if (search) {
  search.addEventListener("input", render);
}


/* 6. FILTERS */

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    active = button.dataset.filter;

    render();

  });

});


/* 7. CREATE TOOL WINDOW */

function createModal() {

  if (document.querySelector("#toolModal")) return;

  document.body.insertAdjacentHTML("beforeend", `

    <div class="modal" id="toolModal">

      <div class="modal-box">

        <button
          class="modal-close"
          id="closeModal"
          aria-label="إغلاق">
          ×
        </button>

        <div id="toolContent"></div>

      </div>

    </div>

  `);

  const modal = document.querySelector("#toolModal");

  document.querySelector("#closeModal")
    .addEventListener("click", closeModal);

  modal.addEventListener("click", event => {

    if (event.target === modal) {
      closeModal();
    }

  });

}


/* 8. CLOSE TOOL */

function closeModal() {

  const modal = document.querySelector("#toolModal");

  if (modal) {
    modal.classList.remove("show");
  }

  if (interval) {
    clearInterval(interval);
    interval = null;
  }

}


/* 9. OPEN TOOL */

function openTool(id) {

  const tool = tools.find(item => item.id === id);

  if (!tool) return;

  createModal();

  document.querySelector("#toolContent").innerHTML =
    toolHTML(id, tool.name);

  document.querySelector("#toolModal").classList.add("show");

  bindTool(id);

}


/* 10. TOOL FORMS */

function toolHTML(id, name) {

  const forms = {

    age: `
      <label>تاريخ الميلاد</label>
      <input id="birth" type="date">

      <button class="primary-btn" id="go">
        احسب العمر
      </button>

      <div class="result" id="result">
        أدخل تاريخ الميلاد
      </div>
    `,

    bmi: `
      <label>الطول بالسنتيمتر</label>
      <input id="h" type="number" placeholder="مثال: 180">

      <label>الوزن بالكيلوجرام</label>
      <input id="w" type="number" placeholder="مثال: 90">

      <button class="primary-btn" id="go">
        احسب BMI
      </button>

      <div class="result" id="result">
        أدخل البيانات
      </div>
    `,

    discount: `
      <label>السعر الأصلي</label>
      <input id="price" type="number" placeholder="مثال: 1000">

      <label>نسبة الخصم %</label>
      <input id="rate" type="number" placeholder="مثال: 20">

      <button class="primary-btn" id="go">
        احسب
      </button>

      <div class="result" id="result">
        أدخل البيانات
      </div>
    `,

    percent: `
      <label>الرقم الأول</label>
      <input id="a" type="number">

      <label>الرقم الكلي</label>
      <input id="b" type="number">

      <button class="primary-btn" id="go">
        احسب النسبة
      </button>

      <div class="result" id="result">
        أدخل البيانات
      </div>
    `,

    loan: `
      <label>مبلغ القرض</label>
      <input id="p" type="number" placeholder="مثال: 100000">

      <label>الفائدة السنوية %</label>
      <input id="r" type="number" step="0.01" placeholder="مثال: 15">

      <label>عدد الشهور</label>
      <input id="m" type="number" placeholder="مثال: 36">

      <button class="primary-btn" id="go">
        احسب القسط
      </button>

      <div class="result" id="result">
        نتيجة تقريبية
      </div>
    `,

    length: `
      <label>القيمة بالمتر</label>
      <input id="v" type="number" placeholder="مثال: 1.5">

      <button class="primary-btn" id="go">
        حوّل
      </button>

      <div class="result" id="result">
        أدخل قيمة
      </div>
    `,

    weight: `
      <label>القيمة بالكيلوجرام</label>
      <input id="v" type="number" placeholder="مثال: 5">

      <button class="primary-btn" id="go">
        حوّل
      </button>

      <div class="result" id="result">
        أدخل قيمة
      </div>
    `,

    temp: `
      <label>الدرجة المئوية</label>
      <input id="v" type="number" placeholder="مثال: 25">

      <button class="primary-btn" id="go">
        حوّل
      </button>

      <div class="result" id="result">
        أدخل درجة
      </div>
    `,

    words: `
      <label>اكتب أو الصق النص</label>

      <textarea id="txt" placeholder="اكتب هنا..."></textarea>

      <button class="primary-btn" id="go">
        احسب
      </button>

      <div class="result" id="result">
        0 كلمة
      </div>
    `,

    textcase: `
      <label>اكتب النص</label>

      <textarea id="txt" placeholder="اكتب النص هنا..."></textarea>

      <div class="copy-row">

        <button class="primary-btn" id="upper">
          UPPERCASE
        </button>

        <button class="secondary-btn" id="clean">
          إزالة المسافات الزائدة
        </button>

      </div>

      <div class="result" id="result">
        النتيجة ستظهر هنا
      </div>
    `,

    date: `
      <label>التاريخ الأول</label>
      <input id="d1" type="date">

      <label>التاريخ الثاني</label>
      <input id="d2" type="date">

      <button class="primary-btn" id="go">
        احسب الفرق
      </button>

      <div class="result" id="result">
        اختر تاريخين
      </div>
    `,

    timer: `
      <label>الدقائق</label>
      <input id="min" type="number" value="1" min="0">

      <label>الثواني</label>
      <input id="sec" type="number" value="0" min="0" max="59">

      <div class="copy-row">

        <button class="primary-btn" id="go">
          ابدأ
        </button>

        <button class="secondary-btn" id="stop">
          إيقاف
        </button>

      </div>

      <div class="result" id="result">
        01:00
      </div>
    `

  };

  return `
    <h2>${name}</h2>

    <div class="tool-form">
      ${forms[id] || ""}
    </div>
  `;

}


/* 11. TOOL FUNCTIONS */

function bindTool(id) {

  const output = document.querySelector("#result");

  const get = selector =>
    document.querySelector(selector);

  const number = selector =>
    Number(get(selector).value);

  const button = get("#go");

  if (!output) return;


  /* AGE */

  if (id === "age") {

    button.addEventListener("click", () => {

      const value = get("#birth").value;

      if (!value) {
        output.textContent = "من فضلك اختر تاريخ الميلاد.";
        return;
      }

      const birth = new Date(value + "T00:00:00");
      const now = new Date();

      if (birth > now) {
        output.textContent = "تاريخ الميلاد غير صحيح.";
        return;
      }

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months--;

        days += new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        ).getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      output.textContent =
        `${years} سنة و ${months} شهر و ${days} يوم`;

    });

  }


  /* BMI */

  if (id === "bmi") {

    button.addEventListener("click", () => {

      const h = number("#h") / 100;
      const w = number("#w");

      if (h <= 0 || w <= 0) {
        output.textContent = "من فضلك أدخل الطول والوزن.";
        return;
      }

      const bmi = w / (h * h);

      let status;

      if (bmi < 18.5) status = "نحافة";
      else if (bmi < 25) status = "وزن طبيعي";
      else if (bmi < 30) status = "زيادة وزن";
      else status = "سمنة";

      output.textContent =
        `BMI = ${bmi.toFixed(1)} — ${status}`;

    });

  }


  /* DISCOUNT */

  if (id === "discount") {

    button.addEventListener("click", () => {

      const price = number("#price");
      const rate = number("#rate");

      if (
        get("#price").value === "" ||
        get("#rate").value === "" ||
        price < 0 ||
        rate < 0 ||
        rate > 100
      ) {
        output.textContent = "أدخل السعر ونسبة الخصم بشكل صحيح.";
        return;
      }

      const saving = price * rate / 100;
      const finalPrice = price - saving;

      output.textContent =
        `السعر بعد الخصم: ${finalPrice.toFixed(2)} | التوفير: ${saving.toFixed(2)}`;

    });

  }


  /* PERCENT */

  if (id === "percent") {

    button.addEventListener("click", () => {

      const a = number("#a");
      const b = number("#b");

      if (get("#a").value === "" || get("#b").value === "" || b === 0) {
        output.textContent = "أدخل رقمين صحيحين، والرقم الكلي لا يساوي صفرًا.";
        return;
      }

      output.textContent =
        `${((a / b) * 100).toFixed(2)}%`;

    });

  }


  /* LOAN */

  if (id === "loan") {

    button.addEventListener("click", () => {

      const p = number("#p");
      const r = number("#r");
      const m = number("#m");

      if (
        p <= 0 ||
        r < 0 ||
        m <= 0 ||
        get("#p").value === "" ||
        get("#r").value === "" ||
        get("#m").value === ""
      ) {
        output.textContent = "أدخل بيانات القرض بشكل صحيح.";
        return;
      }

      const monthlyRate = r / 100 / 12;

      let payment;

      if (monthlyRate === 0) {
        payment = p / m;
      } else {
        payment =
          p * monthlyRate *
          Math.pow(1 + monthlyRate, m) /
          (Math.pow(1 + monthlyRate, m) - 1);
      }

      output.textContent =
        `القسط الشهري التقريبي: ${payment.toFixed(2)}`;

    });

  }


  /* LENGTH */

  if (id === "length") {

    button.addEventListener("click", () => {

      const v = number("#v");

      if (get("#v").value === "" || v < 0) {
        output.textContent = "أدخل قيمة صحيحة.";
        return;
      }

      output.innerHTML = `
        ${v * 100} سم
        <br>
        ${(v * 3.28084).toFixed(3)} قدم
        <br>
        ${(v * 39.3701).toFixed(2)} بوصة
      `;

    });

  }


  /* WEIGHT */

  if (id === "weight") {

    button.addEventListener("click", () => {

      const v = number("#v");

      if (get("#v").value === "" || v < 0) {
        output.textContent = "أدخل قيمة صحيحة.";
        return;
      }

      output.innerHTML = `
        ${v * 1000} جرام
        <br>
        ${(v * 2.20462).toFixed(3)} رطل
      `;

    });

  }


  /* TEMPERATURE */

  if (id === "temp") {

    button.addEventListener("click", () => {

      const v = number("#v");

      if (get("#v").value === "") {
        output.textContent = "أدخل درجة الحرارة.";
        return;
      }

      output.innerHTML = `
        ${(v * 9 / 5 + 32).toFixed(2)} °F
        <br>
        ${(v + 273.15).toFixed(2)} K
      `;

    });

  }


  /* WORD COUNTER */

  if (id === "words") {

    button.addEventListener("click", () => {

      const text = get("#txt").value;
      const trimmed = text.trim();

      const words = trimmed
        ? trimmed.split(/\s+/).length
        : 0;

      const characters = text.length;

      const lines = trimmed
        ? trimmed.split(/\n/).length
        : 0;

      output.innerHTML = `
        ${words} كلمة
        <br>
        ${characters} حرف
        <br>
        ${lines} سطر
      `;

    });

  }


  /* TEXT FORMAT */

  if (id === "textcase") {

    get("#upper").addEventListener("click", () => {

      output.textContent =
        get("#txt").value.toUpperCase();

    });

    get("#clean").addEventListener("click", () => {

      output.textContent =
        get("#txt").value.replace(/\s+/g, " ").trim();

    });

  }


  /* DATE DIFFERENCE */

  if (id === "date") {

    button.addEventListener("click", () => {

      const first = get("#d1").value;
      const second = get("#d2").value;

      if (!first || !second) {
        output.textContent = "من فضلك اختر التاريخين.";
        return;
      }

      const date1 = new Date(first + "T00:00:00");
      const date2 = new Date(second + "T00:00:00");

      const difference = Math.abs(date2 - date1);

      const days = Math.round(
        difference / (1000 * 60 * 60 * 24)
      );

      output.textContent = `${days} يوم`;

    });

  }


  /* TIMER */

  if (id === "timer") {

    const minInput = get("#min");
    const secInput = get("#sec");

    const stopButton = get("#stop");

    function updateDisplay(total) {

      const minutes = Math.floor(total / 60);
      const seconds = total % 60;

      output.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    }

    updateDisplay(
      Number(minInput.value) * 60 +
      Number(secInput.value)
    );

    button.addEventListener("click", () => {

      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      let total =
        Number(minInput.value) * 60 +
        Number(secInput.value);

      if (
        total <= 0 ||
        Number(secInput.value) > 59 ||
        Number(minInput.value) < 0
      ) {
        output.textContent = "أدخل وقتًا صحيحًا أكبر من صفر.";
        return;
      }

      updateDisplay(total);

      interval = setInterval(() => {

        total--;

        updateDisplay(total);

        if (total <= 0) {

          clearInterval(interval);
          interval = null;

          toast("انتهى الوقت ⏰");

        }

      }, 1000);

    });

    stopButton.addEventListener("click", () => {

      if (interval) {
        clearInterval(interval);
        interval = null;
      }

    });

  }

}


/* 12. NOTIFICATION */

function toast(message) {

  let element = document.querySelector("#toast");

  if (!element) {

    element = document.createElement("div");

    element.id = "toast";
    element.className = "toast";

    document.body.appendChild(element);

  }

  element.textContent = message;

  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 2600);

}


/* 13. DARK MODE */

const themeButton = document.querySelector("#themeBtn");

if (themeButton) {

  themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    themeButton.textContent =
      document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";

  });

}


/* 14. MOBILE MENU */

const menuButton = document.querySelector("#menuBtn");
const navLinks = document.querySelector("#navLinks");

if (menuButton && navLinks) {

  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

}


/* 15. RANDOM TOOL */

const randomButton = document.querySelector("#randomTool");

if (randomButton) {

  randomButton.addEventListener("click", () => {

    const random =
      tools[Math.floor(Math.random() * tools.length)];

    if (random.id === "discount") {
      window.location.href = "discount.html";
      return;
    }

    openTool(random.id);

  });

}


/* 16. CONTACT FORM - WEB3FORMS */

const contactForm = document.querySelector("#contactForm");

if (contactForm) {

  contactForm.addEventListener("submit", async event => {

    event.preventDefault();

    const form = event.target;

    const submitButton =
      form.querySelector('button[type="submit"]');

    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "جارٍ الإرسال...";

    try {

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: new FormData(form)
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {

        toast("تم إرسال رسالتك بنجاح. شكرًا لتواصلك معنا!");

        form.reset();

      } else {

        toast("تعذر إرسال الرسالة. حاول مرة أخرى.");

      }

    } catch (error) {

      toast("حدث خطأ في الاتصال. تحقق من الإنترنت وحاول مرة أخرى.");

    } finally {

      submitButton.disabled = false;
      submitButton.textContent = originalText;

    }

  });

}


/* 17. START WEBSITE */

render();
