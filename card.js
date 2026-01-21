const STAFF = {
  "ahamed-sijil": {
    name: "Mr. Ahamed Sijil",
    role: "Chief Executive Officer (CEO)",
    company: "Emarath Global Pvt Ltd",
    email: "ceo@emarathglobal.com",
    phone: "+91 81578 97198",
    photo: "ahamed.jpg",
    photoPos: "50% 18%",
    whatsappText: "Hello Ahamed, I scanned your Emarath contact card."
  },
  "jansiya-s": {
    name: "Ms. Jansiya S",
    role: "Financial Manager",
    company: "Emarath Global Pvt Ltd",
    email: "financialmanager@emarathglobal.com",
    phone: "+91 81298 65032",
    photo: "jansiya.jpg",
    photoPos: "50% 18%",
    whatsappText: "Hello Jansiya, I scanned your Emarath contact card."
  },
  "shahabas-ali": {
    name: "Mr. Shahabas Ali",
    role: "Business Development Manager",
    company: "Emarath Global Pvt Ltd",
    email: "bdm@emarathglobal.com",
    phone: "+91 73064 94305",
    photo: "shahabas.jpg",
    photoPos: "50% 18%",
    whatsappText: "Hello Shahabas, I scanned your Emarath contact card."
  },
  "arya-krishna": {
    name: "Ms. Arya Krishna",
    role: "HR Executive",
    company: "Emarath Global Pvt Ltd",
    email: "hr@emarathglobal.com",
    phone: "+91 85474 70653",
    photo: "arya.jpg",
    photoPos: "50% 18%",
    whatsappText: "Hello Arya, I scanned your Emarath contact card."
  },
  "jaseed": {
    name: "Mr. Jaseed",
    role: "Vice President",
    company: "Emarath Global Pvt Ltd",
    email: "vp@emarathglobal.com",
    phone: "+91 70121 55575",
    photo: "jaseed.jpg",
    photoPos: "50% 18%",
    whatsappText: "Hello Jaseed, I scanned your Emarath contact card."
  },
  "hasna-h": {
    name: "Ms. Hasna H",
    role: "Cross Functional Manager (CFM)",
    company: "Emarath Global Pvt Ltd",
    email: "cfm@emarathglobal.com",
    phone: "+91 75107 67713",
    photo: "hasna.jpg",
    photoPos: "50% 18%",
    whatsappText: "Hello Hasna, I scanned your Emarath contact card."
  },
  "saife": {
    name: "Mr. Saife",
    role: "Consultant",
    company: "Emarath Global Pvt Ltd",
    email: "",
    phone: "+91 97454 44800",
    photo: "saife.jpg",
    photoPos: "50% 18%",
    whatsappText: "Hello Saife, I scanned your Emarath contact card."
  }
};

function getParam(key){
  return new URLSearchParams(location.search).get(key);
}

function normalizePhone(phone){
  return (phone || "").replace(/[^\d+]/g, "");
}

function buildVCard(person){
  const tel = normalizePhone(person.phone);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${person.name}`,
    person.role ? `TITLE:${person.role}` : "",
    person.company ? `ORG:${person.company}` : "",
    tel ? `TEL;TYPE=CELL:${tel}` : "",
    person.email ? `EMAIL;TYPE=INTERNET:${person.email}` : "",
    "END:VCARD"
  ].filter(Boolean);
  return lines.join("\n");
}

function downloadVCard(person){
  const blob = new Blob([buildVCard(person)], {type:"text/vcard;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${person.name.replace(/\s+/g,"-").toLowerCase()}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value || "";
}

function setRow(id, label, value, href){
  const row = document.getElementById(id);
  if(!row) return;

  row.querySelector(".label").textContent = label;
  row.querySelector(".value").textContent = value || "";

  if(href && value){
    row.href = href;
    row.style.display = "";
  }else{
    row.style.display = "none";
  }
}

function init(){
  const id = getParam("id") || "ahamed-sijil";
  const person = STAFF[id] || STAFF["ahamed-sijil"];

  setText("name", person.name);
  setText("role", person.role);
  setText("company", person.company);

  const img = document.getElementById("photo");
  const hero = document.querySelector(".hero");

  // ✅ Use your photo folder + file names
  const imgPath = `assets/photos/${person.photo || "default.jpg"}`;

  if(img){
    img.src = imgPath;
    img.alt = `${person.name} photo`;
    img.style.objectPosition = person.photoPos || "50% 18%";

    img.onerror = () => {
      img.src = "assets/photos/default.jpg";
      img.style.objectPosition = "50% 18%";
    };
  }

  const tel = normalizePhone(person.phone);
  const waText = encodeURIComponent(person.whatsappText || "Hello");
  const wa = tel ? `https://wa.me/${tel.replace("+","")}?text=${waText}` : "";

  setRow("rowEmail", "Email", person.email, person.email ? `mailto:${person.email}` : "");
  setRow("rowPhone", "Phone", person.phone, tel ? `tel:${tel}` : "");
  setRow("rowWA", "WhatsApp", "Message on WhatsApp", wa);

  document.getElementById("btnSave").onclick = () => downloadVCard(person);

  document.getElementById("btnShare").onclick = async () => {
    const shareUrl = location.href;
    try{
      if(navigator.share){
        await navigator.share({ title: person.name, text: `${person.name} — ${person.company}`, url: shareUrl });
      }else{
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied.");
      }
    }catch(e){}
  };
}

document.addEventListener("DOMContentLoaded", init);
