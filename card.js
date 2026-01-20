const PEOPLE = {
  jansiya: {
    name: "Ms. Jansiya S",
    role: "Financial Manager",
    company: "Emarath Global Pvt Ltd",
    email: "financialmanager@emarathglobal.com",
    phone: "+91 81298 65032",
    photo: "assets/photos/jansiya.jpg",
  },
  shahabas: {
    name: "Mr. Shahabas Ali",
    role: "Business Development Manager",
    company: "Emarath Global Pvt Ltd",
    email: "bdm@emarathglobal.com",
    phone: "+91 73064 94305",
    photo: "assets/photos/shahabas.jpg",
  },
  arya: {
    name: "Ms. Arya Krishna",
    role: "HR Executive",
    company: "Emarath Global Pvt Ltd",
    email: "hr@emarathglobal.com",
    phone: "+91 85474 70653",
    photo: "assets/photos/arya.jpg",
  },
  jaseed: {
    name: "Mr. Jaseed",
    role: "Vice President",
    company: "Emarath Global Pvt Ltd",
    email: "vp@emarathglobal.com",
    phone: "+91 70121 55575",
    photo: "assets/photos/jaseed.jpg",
  },
  ahamed: {
    name: "Mr. Ahamed Sijil",
    role: "Chief Executive Officer (CEO)",
    company: "Emarath Global Pvt Ltd",
    email: "ceo@emarathglobal.com",
    phone: "+91 81578 97198",
    photo: "assets/photos/ahamed.jpg",
  },
  hasna: {
    name: "Ms. Hasna H",
    role: "Cross Functional Manager (CFM)",
    company: "Emarath Global Pvt Ltd",
    email: "cfm@emarathglobal.com",
    phone: "+91 75107 67713",
    photo: "assets/photos/hasna.jpg",
  }
};

function qp(name) {
  return new URLSearchParams(location.search).get(name);
}

function idFromUrl() {
  return (qp("id") || "ahamed").toLowerCase();
}

function makeVCard(p) {
  const v =
`BEGIN:VCARD
VERSION:3.0
FN:${p.name}
ORG:${p.company}
TITLE:${p.role}
TEL;TYPE=CELL:${p.phone}
EMAIL:${p.email}
END:VCARD`;
  return new Blob([v], { type: "text/vcard;charset=utf-8" });
}

const id = idFromUrl();
const p = PEOPLE[id];

if (!p) {
  document.body.innerHTML = `<div style="padding:24px;font-family:system-ui">Invalid id: ${id}</div>`;
} else {
  // Fill text
  document.getElementById("name").textContent = p.name;
  document.getElementById("role").textContent = p.role;
  document.getElementById("company").textContent = p.company;

  document.getElementById("emailText").textContent = p.email;
  document.getElementById("phoneText").textContent = p.phone;

  // Links
  document.getElementById("emailLink").href = `mailto:${p.email}`;
  document.getElementById("phoneLink").href = `tel:${p.phone.replace(/\s+/g, "")}`;

  const phoneDigits = p.phone.replace(/[^\d+]/g, "");
  document.getElementById("waLink").href = `https://wa.me/${phoneDigits.replace("+","")}?text=Hi%20${encodeURIComponent(p.name)}%2C%20`;
  document.getElementById("waText").textContent = `Message ${p.name.split(" ")[1] || "on WhatsApp"}`;

  // Photo
  const img = document.getElementById("photo");
  img.src = p.photo;
  img.onerror = () => {
    // fallback if photo missing
    img.src = "assets/photos/default.jpg";
  };

  // vCard download
  const blob = makeVCard(p);
  const url = URL.createObjectURL(blob);
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.href = url;
  saveBtn.download = `${id}.vcf`;

  // Share button
  const shareBtn = document.getElementById("shareBtn");
  shareBtn.addEventListener("click", async () => {
    const shareUrl = `${location.origin}${location.pathname}?id=${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: p.name, text: `${p.name} - ${p.role}`, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        shareBtn.textContent = "✓ Copied link";
        setTimeout(() => shareBtn.textContent = "↗ Share", 1400);
      }
    } catch (e) {}
  });
}
