const PEOPLE = {
  "ahamed-sijil": {
    name: "Mr. Ahamed Sijil",
    role: "Chief Executive Officer (CEO)",
    company: "Emarath Global Pvt Ltd",
    email: "ceo@emarathglobal.com",
    phone: "+91 81578 97198",
    photo: "assets/photos/ahamed-sijil.jpg",
  },
  "jansiya-s": {
    name: "Ms. Jansiya S",
    role: "Financial Manager",
    company: "Emarath Global Pvt Ltd",
    email: "financialmanager@emarathglobal.com",
    phone: "+91 81298 65032",
    photo: "assets/photos/jansiya-s.jpg",
  },
  "shahabas-ali": {
    name: "Mr. Shahabas Ali",
    role: "Business Development Manager",
    company: "Emarath Global Pvt Ltd",
    email: "bdm@emarathglobal.com",
    phone: "+91 73064 94305",
    photo: "assets/photos/shahabas-ali.jpg",
  },
  "arya-krishna": {
    name: "Ms. Arya Krishna",
    role: "HR Executive",
    company: "Emarath Global Pvt Ltd",
    email: "hr@emarathglobal.com",
    phone: "+91 85474 70653",
    photo: "assets/photos/arya-krishna.jpg",
  },
  "jaseed": {
    name: "Mr. Jaseed",
    role: "Vice President",
    company: "Emarath Global Pvt Ltd",
    email: "vp@emarathglobal.com",
    phone: "+91 70121 55575",
    photo: "assets/photos/jaseed.jpg",
  },
  "hasna-h": {
    name: "Ms. Hasna H",
    role: "Cross Functional Manager (CFM)",
    company: "Emarath Global Pvt Ltd",
    email: "cfm@emarathglobal.com",
    phone: "+91 75107 67713",
    photo: "assets/photos/hasna-h.jpg",
  },
  "saife": {
    name: "Mr. Saife",
    role: "Consultant",
    company: "Emarath Global Pvt Ltd",
    email: "",
    phone: "+91 97454 44800",
    photo: "assets/photos/saife.jpg",
  },
};

function getId() {
  const id = new URLSearchParams(location.search).get("id");
  return (id || "ahamed-sijil").toLowerCase();
}

function digitsOnlyPhone(p) {
  return (p || "").replace(/\D/g, "");
}

function vcard(p) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${p.name}`,
    `ORG:${p.company}`,
    p.role ? `TITLE:${p.role}` : "",
    p.phone ? `TEL;TYPE=CELL:${p.phone}` : "",
    p.email ? `EMAIL:${p.email}` : "",
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\n");
}

function download(filename, text) {
  const blob = new Blob([text], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function init() {
  const id = getId();
  const p = PEOPLE[id];

  if (!p) {
    document.body.innerHTML = `<div style="padding:22px;font-family:system-ui">
      Invalid id: <b>${id}</b><br><br>
      Example: <code>card.html?id=ahamed-sijil</code>
    </div>`;
    return;
  }

  // Text
  document.getElementById("name").textContent = p.name;
  document.getElementById("role").textContent = p.role;
  document.getElementById("company").textContent = p.company;
  document.getElementById("footerCompany").textContent = p.company;

  // Photo
  const img = document.getElementById("photo");
  img.src = p.photo;
  img.onerror = () => (img.src = "assets/photos/ahamed-sijil.jpg");

  // Email
  const emailLink = document.getElementById("emailLink");
  const emailText = document.getElementById("emailText");
  if (p.email) {
    emailText.textContent = p.email;
    emailLink.href = `mailto:${p.email}`;
  } else {
    emailText.textContent = "Not available";
    emailLink.style.opacity = "0.6";
    emailLink.style.pointerEvents = "none";
  }

  // Phone
  const phoneLink = document.getElementById("phoneLink");
  const phoneText = document.getElementById("phoneText");
  phoneText.textContent = p.phone || "-";
  phoneLink.href = p.phone ? `tel:${p.phone.replace(/\s+/g, "")}` : "#";

  // WhatsApp
  const waLink = document.getElementById("waLink");
  const waText = document.getElementById("waText");
  const wa = digitsOnlyPhone(p.phone);
  waText.textContent = "Message on WhatsApp";
  waLink.href = wa ? `https://wa.me/${wa}?text=${encodeURIComponent("Hi " + p.name + ",")}` : "#";

  // Save contact
  document.getElementById("saveBtn").addEventListener("click", () => {
    const safe = id.replace(/[^\w-]+/g, "_");
    download(`${safe}.vcf`, vcard(p));
  });

  // Share
  document.getElementById("shareBtn").addEventListener("click", async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: p.name, text: `${p.name} — ${p.role}`, url: location.href });
      } else {
        await navigator.clipboard.writeText(location.href);
        alert("Link copied");
      }
    } catch (e) {}
  });
}

init();
