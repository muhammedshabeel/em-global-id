function qp(name){ return new URLSearchParams(location.search).get(name) || ""; }

function initials(fullName){
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if(parts.length === 0) return "EG";
  const first = parts[0][0] || "";
  const last = parts.length > 1 ? parts[parts.length-1][0] : "";
  return (first + last).toUpperCase();
}

function digitsOnlyPhone(phone){
  // Keep + and digits only, then remove spaces
  return phone.replace(/[^\d+]/g, "");
}

function waLink(phone){
  // WhatsApp expects countrycode+number, no +, no spaces
  const p = digitsOnlyPhone(phone).replace("+","");
  return `https://wa.me/${p}`;
}

function vcfText({name, role, company, email, phone}){
  // Basic vCard
  const safe = (s)=> (s||"").replace(/\n/g," ").trim();
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${safe(name)}`,
    `ORG:${safe(company)}`,
    role ? `TITLE:${safe(role)}` : "",
    phone ? `TEL;TYPE=CELL:${digitsOnlyPhone(phone)}` : "",
    email ? `EMAIL;TYPE=INTERNET:${safe(email)}` : "",
    "END:VCARD"
  ].filter(Boolean).join("\n");
}

function downloadVCard(data){
  const blob = new Blob([vcfText(data)], {type:"text/vcard"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.name || "contact"}.vcf`.replace(/[^\w\s.-]/g,"").replace(/\s+/g,"_");
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

const data = {
  name: qp("name"),
  role: qp("role"),
  company: qp("company") || "Emarath Global Pvt Ltd",
  email: qp("email"),
  phone: qp("phone"),
};

document.getElementById("name").textContent = data.name || "Emarath Contact";
document.getElementById("role").textContent = data.role || "";
document.getElementById("company").textContent = data.company;
document.getElementById("avatar").textContent = initials(data.name);

const tel = digitsOnlyPhone(data.phone);
document.getElementById("call").href = tel ? `tel:${tel}` : "#";
document.getElementById("wa").href = tel ? waLink(tel) : "#";
document.getElementById("email").href = data.email ? `mailto:${data.email}` : "#";

document.getElementById("save").addEventListener("click", (e)=>{
  e.preventDefault();
  downloadVCard(data);
});

// Disable buttons if missing
["call","wa","email"].forEach(id=>{
  const el = document.getElementById(id);
  if(el.getAttribute("href") === "#"){
    el.style.opacity = "0.45";
    el.style.pointerEvents = "none";
  }
});