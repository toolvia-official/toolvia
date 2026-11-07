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

const grid = document.querySelector("#toolsGrid");
const search = document.querySelector("#searchInput");
const count = document.querySelector("#resultCount");

let active = "all";
let interval = null;

function render() {
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
      <span class="tool-tag">فتح الأداة ←</span>
    </article>
  `).join("");

  document.querySelectorAll(".tool-card").forEach(card => {
    card.addEventListener("click", () => {
      openTool(card.dataset.id);
    });
  });
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    const current = document.querySelector(".filter.active");

    if (current) {
      current.classList.remove("active");
    }

    button.classList.add("active");
    active = button.dataset.filter;

    render();
  });
});

search.addEventListener("input", render);

function createModal() {
  if (document.querySelector("#toolModal")) {
    return;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal" id="toolModal">
      <div class="modal-box">
        <button class="modal-close" id="closeModal" aria-label="إغلاق">
          ×
        </button>

        <div id="toolContent"></div>
      </div>
    </div>
  `);

  const modal = document.querySelector("#toolModal");
  const close = document.querySelector("#closeModal");

  close.addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

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

function openTool(id) {
  createModal();

  const tool = tools.find(item => item.id === id);

  if (!tool) {
    return;
  }

  const content = document.querySelector("#toolContent");

  content.innerHTML = toolHTML(id, tool.name);

  document.querySelector("#toolModal").classList.add("show");

  bindTool(id);
}

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

      <textarea
        id="txt"
        placeholder="اكتب هنا..."
      ></textarea>

      <button class="primary-btn" id="go">
        احسب
      </button>

      <div class="result" id="result">
        0 كلمة
      </div>
    `,

    textcase: `
      <label>اكتب النص</label>

      <textarea
        id="txt"
        placeholder="اكتب النص هنا..."
      ></textarea>

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
      <input id="sec" type="number" value="0" min="0">

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
      ${forms[id]}
    </div>
  `;
}

function bindTool(id) {
  const output = document.querySelector("#result");

  if (id === "age") {
    document.querySelector("#go").addEventListener("click", () => {
      const value = document.querySelector("#birth").value;

      if (!value) {
        output.textContent = "من فضلك اختر تاريخ الميلاد.";
        return;
      }

      const birth = new Date(value);
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

        const previousMonthDays =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            0
          ).getDate();

        days += previousMonthDays;
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      output.textContent =
        `${years} سنة و ${months} شهر و ${days} يوم`;
    });
  }

  if (id === "bmi") {
    document.querySelector("#go").addEventListener("click", () => {
      const h =
        Number(document.querySelector("#h").value) / 100;

      const w =
        Number(document.querySelector("#w").value);

      if (h <= 0 || w <= 0) {
        output.textContent = "من فضلك أدخل الطول والوزن.";
        return;
      }

      const bmi = w / (h * h);

      let status;

      if (bmi < 18.5) {
        status = "نحافة";
      } else if (bmi < 25) {
        status = "طبيعي";
      } else if (bmi < 30) {
        status = "زيادة وزن";
      } else {
        status = "سمنة";
      }

      output.textContent =
        `BMI = ${bmi.toFixed(1)} — ${status}`;
    });
  }

  if (id === "discount") {
    document.querySelector("#go").addEventListener("click", () => {
      const price =
        Number(document.querySelector("#price").value);

      const rate =
        Number(document.querySelector("#rate").value);

      if (price < 0 || rate < 0 || rate > 100) {
        output.textContent =
          "من فضلك أدخل سعرًا ونسبة خصم صحيحة.";
        return;
      }

      const saving = price * rate / 100;
      const finalPrice = price - saving;

      output.innerHTML = `
        السعر بعد الخصم: ${finalPrice.toFixed(2)}
        <br>
        قيمة التوفير: ${saving.toFixed(2)}
      `;
    });
  }

  if (id === "percent") {
    document.querySelector("#go").addEventListener("click", () => {
      const a =
        Number(document.querySelector("#a").value);

      const b =
        Number(document.querySelector("#b").value);

      if (b === 0) {
        output.textContent =
          "لا يمكن القسمة على صفر.";
        return;
      }

      output.textContent =
        `${((a / b) * 100).toFixed(2)}%`;
    });
  }

  if (id === "loan") {
    document.querySelector("#go").addEventListener("click", () => {
      const principal =
        Number(document.querySelector("#p").value);

      const annualRate =
        Number(document.querySelector("#r").value);

      const months =
        Number(document.querySelector("#m").value);

      if (
        principal <= 0 ||
        annualRate < 0 ||
        months <= 0
      ) {
        output.textContent =
          "من فضلك أدخل بيانات القرض بشكل صحيح.";
        return;
      }

      const monthlyRate =
        annualRate / 100 / 12;

      let payment;

      if (monthlyRate === 0) {
        payment = principal / months;
      } else {
        payment =
          principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months) /
          (Math.pow(1 + monthlyRate, months) - 1);
      }

      output.textContent =
        `القسط الشهري التقريبي: ${payment.toFixed(2)}`;
    });
  }

  if (id === "length") {
    document.querySelector("#go").addEventListener("click", () => {
      const value =
        Number(document.querySelector("#v").value);

      if (value < 0) {
        output.textContent = "أدخل قيمة صحيحة.";
        return;
      }

      output.innerHTML = `
        ${value * 100} سم
        <br>
        ${(value * 3.28084).toFixed(3)} قدم
        <br>
        ${(value * 39.3701).toFixed(2)} بوصة
      `;
    });
  }

  if (id === "weight") {
    document.querySelector("#go").addEventListener("click", () => {
      const value =
        Number(document.querySelector("#v").value);

      if (value < 0) {
        output.textContent = "أدخل قيمة صحيحة.";
        return;
      }

      output.innerHTML = `
        ${value * 1000} جرام
        <br>
        ${(value * 2.20462).toFixed(3)} رطل
      `;
    });
  }

  if (id === "temp") {
    document.querySelector("#go").addEventListener("click", () => {
      const value =
        Number(document.querySelector("#v").value);

      const fahrenheit =
        (value * 9 / 5) + 32;

      const kelvin =
        value + 273.15;

      output.innerHTML = `
        ${fahrenheit.toFixed(2)} °F
        <br>
        ${kelvin.toFixed(2)} K
      `;
    });
  }

  if (id === "words") {
    document.querySelector("#go").addEventListener("click", () => {
      const text =
        document.querySelector("#txt").value;

      const trimmed =
        text.trim();

      const words =
        trimmed
          ? trimmed.split(/\s+/).length
          : 0;

      const characters =
        text.length;

      const lines =
        trimmed
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

  if (id === "textcase") {
    document.querySelector("#upper").addEventListener("click", () => {
      const text =
        document.querySelector("#txt").value;

      output.textContent =
        text.toUpperCase();
    });

    document.querySelector("#clean").addEventListener("click", () => {
      const text =
        document.querySelector("#txt").value;

      output.textContent =
        text.replace(/\s+/g, " ").trim();
    });
  }

  if (id === "date") {
    document.querySelector("#go").addEventListener("click", () => {
      const first =
        document.querySelector("#d1").value;

      const second =
        document.querySelector("#d2").value;

      if (!first || !second) {
        output.textContent =
          "من فضلك اختر التاريخين.";
        return;
      }

      const date1 = new Date(first);
      const date2 = new Date(second);

      const difference =
        Math.abs(date2 - date1);

      const days =
        Math.round(
          difference / (1000 * 60 * 60 * 24)
        );

      output.textContent =
        `${days} يوم`;
    });
  }

  if (id === "timer") {
    const minInput =
      document.querySelector("#min");

    const secInput =
      document.querySelector("#sec");

    const startButton =
      document.querySelector("#go");

    const stopButton =
      document.querySelector("#stop");

    function updateDisplay(totalSeconds) {
      const minutes =
        Math.floor(totalSeconds / 60);

      const seconds =
        totalSeconds % 60;

      output.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    updateDisplay(
      Number(minInput.value) * 60 +
      Number(secInput.value)
    );

    startButton.addEventListener("click", () => {
      if (interval) {
        clearInterval(interval);
      }

      let totalSeconds =
        Number(minInput.value) * 60 +
        Number(secInput.value);

      if (totalSeconds <= 0) {
        output.textContent =
          "أدخل وقتًا أكبر من صفر.";
        return;
      }

      updateDisplay(totalSeconds);

      interval = setInterval(() => {
        totalSeconds--;

        updateDisplay(totalSeconds);

        if (totalSeconds <= 0) {
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

document.querySelector("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const button =
    document.querySelector("#themeBtn");

  button.textContent =
    document.body.classList.contains("dark")
      ? "☀️"
      : "🌙";
});

document.querySelector("#menuBtn").addEventListener("click", () => {
  document.querySelector("#navLinks").classList.toggle("show");
});

document.querySelector("#randomTool").addEventListener("click", () => {
  const random =
    tools[Math.floor(Math.random() * tools.length)];

  openTool(random.id);
});

document.querySelector("#contactForm").addEventListener("submit", event => {
  event.preventDefault();

  toast("تم استلام رسالتك محليًا. شكرًا لك!");

  event.target.reset();
});

render();