const people = {
  jansiya: {
    name: "Ms. Jansiya S",
    role: "Financial Manager",
    company: "Emarath Global Pvt Ltd",
    email: "financialmanager@emarathglobal.com",
    phone: "+918129865032",
    photo: "assets/people/jansiya.jpg",
  },
  shahabas: {
    name: "Mr. Shahabas Ali",
    role: "Business Development Manager",
    company: "Emarath Global Pvt Ltd",
    email: "bdm@emarathglobal.com",
    phone: "+917306494305",
    photo: "assets/people/shahabas.jpg",
  },
  arya: {
    name: "Ms. Arya Krishna",
    role: "HR Executive",
    company: "Emarath Global Pvt Ltd",
    email: "hr@emarathglobal.com",
    phone: "+918547470653",
    photo: "assets/people/arya.jpg",
  },
  jaseed: {
    name: "Mr. Jaseed",
    role: "Vice President",
    company: "Emarath Global Pvt Ltd",
    email: "vp@emarathglobal.com",
    phone: "+917012155575",
    photo: "assets/people/jaseed.jpg",
  },
  ahamed: {
    name: "Mr. Ahamed Sijil",
    role: "Chief Executive Officer (CEO)",
    company: "Emarath Global Pvt Ltd",
    email: "ceo@emarathglobal.com",
    phone: "+918157897198",
    photo: "assets/people/ahamed.jpg",
  },
  hasna: {
    name: "Ms. Hasna H",
    role: "Cross Functional Manager (CFM)",
    company: "Emarath Global Pvt Ltd",
    email: "cfm@emarathglobal.com",
    phone: "+917510767713",
    photo: "assets/people/hasna.jpg",
  },
  saife: {
    name: "Mr. Saife",
    role: "Consultant",
    company: "Emarath Global Pvt Ltd",
    email: "",
    phone: "+919745444800",
    photo: "assets/people/saife.jpg",
  },
};

function prettyPhone(p) {
  if (!p) return "—";
  // show +91 12345 67890 style
  const m = p.replace(/\s/g, "");
  if (m.startsWith("+91") && m.length === 13) {
    return `+91 ${m.slice(3, 8)} ${m.slice(8)}`;
  }
  return p;
}

const qs = new URLSearchParams(location.search);
const id = (qs.get("id") || "ahamed").toLowerCase();
const p = people[id] || people.ahamed;

// Fill text
document.getElementById("name").textContent = p.name;
document.getElementById("role").textContent = p.role;
document.getElementById("company").textContent = p.company;
document.getElementById("footerCompany").textContent = p.company;

// Photo
const photo = document.getElementById("photo");
photo.src = p.photo || "assets/people/default.jpg";
photo.onerror = () => (photo.src = "assets/people/default.jpg");

// Email
const emailLink = document.getElementById("emailLink");
const emailEl = document.getElementById("email");
if (p.email) {
  emailEl.textContent = p.email;
  emailLink.href = `mailto:${p.email}`;
} else {
  emailLink.style.display = "none";
}

// Phone
const phoneLink = document.getElementById("phoneLink");
document.getElementById("phone").textContent = prettyPhone(p.phone);
if (p.phone) phoneLink.href = `tel:${p.phone}`;

// WhatsApp
const waLink = document.getElementById("waLink");
const waText = document.getElementById("waText");
if (p.phone) {
  const waNumber = p.phone.replace("+", "");
  waLink.href = `https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(p.name)}`;
  waText.textContent = `Message on WhatsApp`;
} else {
  waLink.style.display = "none";
}

// Share
document.getElementById("shareBtn").onclick = async () => {
  const url = location.href;
  if (navigator.share) return navigator.share({ title: p.name, url });
  await navigator.clipboard.writeText(url);
  alert("Link copied");
};

// vCard download
document.getElementById("saveBtn").onclick = () => {
  const v = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${p.name}`,
    `ORG:${p.company}`,
    p.role ? `TITLE:${p.role}` : "",
    p.phone ? `TEL;TYPE=CELL:${p.phone}` : "",
    p.email ? `EMAIL:${p.email}` : "",
    "END:VCARD",
  ].filter(Boolean).join("\n");

  const blob = new Blob([v], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${id}.vcf`;
  a.click();
};
