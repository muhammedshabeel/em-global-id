const PEOPLE = {
  jansiya: {
    name: "Ms. Jansiya S",
    role: "Financial Manager",
    company: "Emarath Global Pvt Ltd",
    email: "financialmanager@emarathglobal.com",
    phone: "+91 81298 65032",
    waName: "Jansiya",
    photo: "./assets/photos/jansiya.jpg",
  },
  shahabas: {
    name: "Mr. Shahabas Ali",
    role: "Business Development Manager",
    company: "Emarath Global Pvt Ltd",
    email: "bdm@emarathglobal.com",
    phone: "+91 73064 94305",
    waName: "Shahabas",
    photo: "./assets/photos/shahabas.jpg",
  },
  arya: {
    name: "Ms. Arya Krishna",
    role: "HR Executive",
    company: "Emarath Global Pvt Ltd",
    email: "hr@emarathglobal.com",
    phone: "+91 85474 70653",
    waName: "Arya",
    photo: "./assets/photos/arya.jpg",
  },
  jaseed: {
    name: "Mr. Jaseed",
    role: "Vice President",
    company: "Emarath Global Pvt Ltd",
    email: "vp@emarathglobal.com",
    phone: "+91 70121 55575",
    waName: "Jaseed",
    photo: "./assets/photos/jaseed.jpg",
  },
  ahamed: {
    name: "Mr. Ahamed Sijil",
    role: "Chief Executive Officer (CEO)",
    company: "Emarath Global Pvt Ltd",
    email: "ceo@emarathglobal.com",
    phone: "+91 81578 97198",
    waName: "Ahamed",
    photo: "./assets/photos/ahamed.jpg",
  },
  hasna: {
    name: "Ms. Hasna H",
    role: "Cross Functional Manager (CFM)",
    company: "Emarath Global Pvt Ltd",
    email: "cfm@emarathglobal.com",
    phone: "+91 75107 67713",
    waName: "Hasna",
    photo: "./assets/photos/hasna.jpg",
  },
  saife: {
    name: "Mr. Saife",
    role: "Consultant",
    company: "Emarath Global Pvt Ltd",
    email: "", // not provided
    phone: "+91 97454 44800",
    waName: "Saife",
    photo: "./assets/photos/saife.jpg",
  },
};

function qs(key){
  return new URLSearchParams(location.search).get(key);
}

function cleanPhone(p){
  return (p || "").replace(/[^\d+]/g, "");
}

function makeVcf(person){
  // Minimal vCard 3.0, works on phones
  const n = person.name || "";
  const org = person.company || "";
  const title = person.role || "";
  const tel = cleanPhone(person.phone || "");
  const email = person.email || "";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${n}`,
    `ORG:${org}`,
    title ? `TITLE:${title}` : null,
    tel ? `TEL;TYPE=CELL:${tel}` : null,
    email ? `EMAIL:${email}` : null,
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\n");
}

function downloadText(filename, text){
  const blob = new Blob([text], {type:"text/vcard;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function init(){
  const id = (qs("id") || "").toLowerCase();
  const person = PEOPLE[id];

  if(!person){
    document.body.innerHTML = `
      <div style="max-width:720px;margin:40px auto;padding:18px;font-family:system-ui">
        <h2>Card not found</h2>
        <p>Use: <code>card.html?id=ahamed</code></p>
        <p><a href="./index.html">Go back</a></p>
      </div>
    `;
    return;
  }

  // Fill UI
  document.getElementById("name").textContent = person.name;
  document.getElementById("role").textContent = person.role;
  document.getElementById("company").textContent = person.company;
  document.getElementById("footerCompany").textContent = person.company;

  const img = document.getElementById("profileImage");
  img.src = person.photo;
  img.onerror = () => {
    img.src = "./assets/photos/ahamed.jpg"; // fallback
  };

  // Email
  const emailEl = document.getElementById("email");
  const emailLink = document.getElementById("emailLink");
  if(person.email){
    emailEl.textContent = person.email;
    emailLink.href = `mailto:${person.email}`;
  } else {
    emailEl.textContent = "Not available";
    emailLink.href = "#";
    emailLink.style.opacity = "0.6";
    emailLink.style.pointerEvents = "none";
  }

  // Phone
  const phoneEl = document.getElementById("phone");
  const phoneLink = document.getElementById("phoneLink");
  phoneEl.textContent = person.phone || "-";
  phoneLink.href = person.phone ? `tel:${cleanPhone(person.phone)}` : "#";

  // WhatsApp
  const waLink = document.getElementById("waLink");
  const waText = document.getElementById("waText");
  const waNumber = cleanPhone(person.phone || "").replace("+", "");
  waText.textContent = `Message ${person.waName || ""}`.trim();
  waLink.href = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent("Hi " + (person.waName || "") + ", I got your contact from Emarath Digital Card.")}`
    : "#";

  // Save contact
  document.getElementById("saveBtn").addEventListener("click", () => {
    const vcf = makeVcf(person);
    const safeName = (person.name || "contact").replace(/[^\w]+/g, "_");
    downloadText(`${safeName}.vcf`, vcf);
  });

  // Share
  document.getElementById("shareBtn").addEventListener("click", async () => {
    try{
      if(navigator.share){
        await navigator.share({
          title: person.name,
          text: `${person.name} — ${person.role}`,
          url: location.href
        });
      } else {
        await navigator.clipboard.writeText(location.href);
        alert("Link copied!");
      }
    } catch(e){
      // user canceled - ignore
    }
  });
}

init();
