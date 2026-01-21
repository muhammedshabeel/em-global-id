(() => {
  const $ = (id) => document.getElementById(id);

  const staff = {
    "ahamed-sijil": {
      name: "Mr. Ahamed Sijil",
      role: "Chief Executive Officer (CEO)",
      company: "Emarath Global Pvt Ltd",
      email: "ceo@emarathglobal.com",
      phone: "+91 81578 97198",
      waText: "Message Ahamed",
      photo: "assets/photos/ahamed.jpg",
    },
    "jansiya-s": {
      name: "Ms. Jansiya S",
      role: "Financial Manager",
      company: "Emarath Global Pvt Ltd",
      email: "financialmanager@emarathglobal.com",
      phone: "+91 81298 65032",
      waText: "Message Jansiya",
      photo: "assets/photos/jansiya.jpg",
    },
    "shahabas-ali": {
      name: "Mr. Shahabas Ali",
      role: "Business Development Manager",
      company: "Emarath Global Pvt Ltd",
      email: "bdm@emarathglobal.com",
      phone: "+91 73064 94305",
      waText: "Message Shahabas",
      photo: "assets/photos/shahabas.jpg",
    },
    "arya-krishna": {
      name: "Ms. Arya Krishna",
      role: "HR Executive",
      company: "Emarath Global Pvt Ltd",
      email: "hr@emarathglobal.com",
      phone: "+91 85474 70653",
      waText: "Message Arya",
      photo: "assets/photos/arya.jpg",
    },
    "jaseed": {
      name: "Mr. Jaseed",
      role: "Vice President",
      company: "Emarath Global Pvt Ltd",
      email: "vp@emarathglobal.com",
      phone: "+91 70121 55575",
      waText: "Message Jaseed",
      photo: "assets/photos/jaseed.jpg",
    },
    "hasna-h": {
      name: "Ms. Hasna H",
      role: "Cross Functional Manager (CFM)",
      company: "Emarath Global Pvt Ltd",
      email: "cfm@emarathglobal.com",
      phone: "+91 75107 67713",
      waText: "Message Hasna",
      photo: "assets/photos/hasna.jpg",
    },
    "saife": {
      name: "Mr. Saife",
      role: "Consultant",
      company: "Emarath Global Pvt Ltd",
      email: "",
      phone: "+91 97454 44800",
      waText: "Message Saife",
      photo: "assets/photos/saife.jpg",
    },
  };

  function getId() {
    const p = new URLSearchParams(window.location.search);
    return (p.get("id") || "").trim().toLowerCase();
  }

  function digitsOnly(phone) {
    return phone.replace(/[^\d]/g, "");
  }

  function setLinkOrDisable(anchorEl, href, valueEl, valueText) {
    if (!href) {
      anchorEl.href = "javascript:void(0)";
      anchorEl.style.opacity = "0.55";
      anchorEl.style.pointerEvents = "none";
      if (valueEl) valueEl.textContent = valueText || "—";
      return;
    }
    anchorEl.href = href;
    anchorEl.style.opacity = "1";
    anchorEl.style.pointerEvents = "auto";
    if (valueEl) valueEl.textContent = valueText || "";
  }

  function buildVCard(person) {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${person.name}`,
      `ORG:${person.company}`,
      `TITLE:${person.role}`,
    ];

    if (person.email) lines.push(`EMAIL;TYPE=INTERNET:${person.email}`);
    if (person.phone) lines.push(`TEL;TYPE=CELL:${person.phone}`);

    // IMPORTANT: vCard must end properly
    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  function downloadVCard(person) {
    const vcard = buildVCard(person);
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${person.name.replace(/\s+/g, "-").toLowerCase()}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function shareCard(person) {
    const url = window.location.href;
    const text = `${person.name} — ${person.role}\n${url}`;

    if (navigator.share) {
      navigator.share({ title: person.name, text, url }).catch(() => {});
      return;
    }

    // fallback copy
    navigator.clipboard?.writeText(url).then(() => {
      alert("Link copied!");
    }).catch(() => {
      prompt("Copy this link:", url);
    });
  }

  function boot() {
    const id = getId();
    const person = staff[id];

    // fallback
    if (!person) {
      $("name").textContent = "Not found";
      $("role").textContent = "—";
      $("company").textContent = "Emarath Global Pvt Ltd";
      $("profileImg").src = "assets/photos/default.jpg";
      $("footerText").textContent = "EMARATH GLOBAL PRIVATE LIMITED";
      return;
    }

    // Set text
    $("name").textContent = person.name;
    $("role").textContent = person.role;
    $("company").textContent = person.company || "Emarath Global Pvt Ltd";
    $("footerText").textContent = "EMARATH GLOBAL PRIVATE LIMITED";

    // Profile image (show face properly via CSS object-position)
    const img = $("profileImg");
    img.src = person.photo || "assets/photos/default.jpg";
    img.onerror = () => { img.src = "assets/photos/default.jpg"; };

    // Email
    const emailHref = person.email ? `mailto:${person.email}` : "";
    setLinkOrDisable($("emailRow"), emailHref, $("emailVal"), person.email || "—");

    // Phone
    const phoneHref = person.phone ? `tel:${digitsOnly(person.phone)}` : "";
    setLinkOrDisable($("phoneRow"), phoneHref, $("phoneVal"), person.phone || "—");

    // WhatsApp
    const phoneDigits = person.phone ? digitsOnly(person.phone) : "";
    const waMessage = encodeURIComponent(`Hi ${person.name},`);
    const waHref = phoneDigits ? `https://wa.me/${phoneDigits}?text=${waMessage}` : "";
    $("waVal").textContent = person.waText || "Message on WhatsApp";
    setLinkOrDisable($("waRow"), waHref, null, null);

    // Buttons
    $("saveBtn").onclick = () => downloadVCard(person);
    $("shareBtn").onclick = () => shareCard(person);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
