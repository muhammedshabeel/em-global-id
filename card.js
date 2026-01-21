/* =========================================================
   Emarath Staff Card - card.js
   Works with:
   - card.html?id=ahamed-sijil
   - /staff/ahamed-sijil/ (if you use staff pages)
   Folder structure:
   /assets/photos/ahamed.jpg
   /assets/brand/logo.jpg
   ========================================================= */

// ✅ Staff database (your details)
const STAFF = {
  "ahamed-sijil": {
    name: "Mr. Ahamed Sijil",
    role: "Chief Executive Officer (CEO)",
    company: "Emarath Global Pvt Ltd",
    email: "ceo@emarathglobal.com",
    phone: "+91 81578 97198",
    whatsappText: "Message Ahamed",
    photo: "assets/photos/ahamed.jpg",
  },

  "jansiya-s": {
    name: "Ms. Jansiya S",
    role: "Financial Manager",
    company: "Emarath Global Pvt Ltd",
    email: "financialmanager@emarathglobal.com",
    phone: "+91 81298 65032",
    whatsappText: "Message Jansiya",
    photo: "assets/photos/jansiya.jpg",
  },

  "shahabas-ali": {
    name: "Mr. Shahabas Ali",
    role: "Business Development Manager",
    company: "Emarath Global Pvt Ltd",
    email: "bdm@emarathglobal.com",
    phone: "+91 73064 94305",
    whatsappText: "Message Shahabas",
    photo: "assets/photos/shahabas.jpg",
  },

  "arya-krishna": {
    name: "Ms. Arya Krishna",
    role: "HR Executive",
    company: "Emarath Global Pvt Ltd",
    email: "hr@emarathglobal.com",
    phone: "+91 85474 70653",
    whatsappText: "Message Arya",
    photo: "assets/photos/arya.jpg",
  },

  "jaseed": {
    name: "Mr. Jaseed",
    role: "Vice President",
    company: "Emarath Global Pvt Ltd",
    email: "vp@emarathglobal.com",
    phone: "+91 70121 55575",
    whatsappText: "Message Jaseed",
    photo: "assets/photos/jaseed.jpg",
  },

  "hasna-h": {
    name: "Ms. Hasna H",
    role: "Cross Functional Manager (CFM)",
    company: "Emarath Global Pvt Ltd",
    email: "cfm@emarathglobal.com",
    phone: "+91 75107 67713",
    whatsappText: "Message Hasna",
    photo: "assets/photos/hasna.jpg",
  },

  "saife": {
    name: "Mr. Saife",
    role: "Consultant",
    company: "Emarath Global Pvt Ltd",
    email: "",
    phone: "+91 97454 44800",
    whatsappText: "Message Saife",
    photo: "assets/photos/saife.jpg",
  },
};

// ✅ Default fallback (if wrong ID typed)
const DEFAULT_CARD = {
  name: "Emarath Staff",
  role: "Digital ID",
  company: "Emarath Global Pvt Ltd",
  email: "info@emarathglobal.com",
  phone: "",
  whatsappText: "Message on WhatsApp",
  photo: "assets/photos/default.jpg",
};

// ✅ Get staff ID from URL
function getStaffId() {
  const urlParams = new URLSearchParams(window.location.search);

  // ✅ Supports: card.html?id=ahamed-sijil
  const idFromQuery = urlParams.get("id");
  if (idFromQuery) return idFromQuery.trim().toLowerCase();

  // ✅ Supports: /staff/ahamed-sijil/
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const staffIndex = pathParts.indexOf("staff");
  if (staffIndex !== -1 && pathParts[staffIndex + 1]) {
    return pathParts[staffIndex + 1].trim().toLowerCase();
  }

  return "";
}

// ✅ Safe element selector
function el(id) {
  return document.getElementById(id);
}

// ✅ Build WhatsApp link
function buildWhatsAppLink(phone, name) {
  const cleanPhone = (phone || "").replace(/[^\d+]/g, "");
  const msg = encodeURIComponent(`Hi ${name},`);
  if (!cleanPhone) return "#";
  return `https://wa.me/${cleanPhone.replace("+", "")}?text=${msg}`;
}

// ✅ Create vCard file content (Download Contact)
function buildVCard(data) {
  const cleanPhone = (data.phone || "").replace(/\s+/g, "");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.name || ""}`,
    `ORG:${data.company || ""}`,
    `TITLE:${data.role || ""}`,
    data.email ? `EMAIL;TYPE=INTERNET:${data.email}` : "",
    cleanPhone ? `TEL;TYPE=CELL:${cleanPhone}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

// ✅ Download vCard
function downloadVCard(data) {
  const vcardText = buildVCard(data);
  const blob = new Blob([vcardText], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  const safeName = (data.name || "contact")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  a.download = `${safeName}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// ✅ Main render function
function renderCard() {
  const staffId = getStaffId();
  const data = STAFF[staffId] || DEFAULT_CARD;

  // ✅ Elements from card.html
  const profilePhoto = el("profilePhoto");
  const fullName = el("fullName");
  const role = el("role");
  const company = el("company");

  const emailRow = el("emailRow");
  const emailText = el("emailText");

  const phoneRow = el("phoneRow");
  const phoneText = el("phoneText");

  const waRow = el("waRow");
  const waText = el("waText");

  const saveBtn = el("saveBtn");
  const shareBtn = el("shareBtn");

  // ✅ Prevent blank screen if HTML IDs missing
  if (!profilePhoto || !fullName || !role || !company) {
    console.error("❌ card.html missing required IDs (profilePhoto/fullName/role/company)");
    return;
  }

  // ✅ Fill data
  fullName.textContent = data.name || "";
  role.textContent = data.role || "";
  company.textContent = data.company || "";

  // ✅ Photo load (fixes broken image)
  profilePhoto.src = data.photo || DEFAULT_CARD.photo;

  // ✅ If photo missing show default
  profilePhoto.onerror = () => {
    profilePhoto.src = DEFAULT_CARD.photo;
  };

  // ✅ Email
  if (data.email) {
    emailText.textContent = data.email;
    emailRow.href = `mailto:${data.email}`;
    emailRow.style.display = "flex";
  } else {
    emailRow.style.display = "none";
  }

  // ✅ Phone
  if (data.phone) {
    phoneText.textContent = data.phone;
    phoneRow.href = `tel:${data.phone.replace(/\s+/g, "")}`;
    phoneRow.style.display = "flex";
  } else {
    phoneRow.style.display = "none";
  }

  // ✅ WhatsApp
  if (data.phone) {
    waText.textContent = data.whatsappText || "Message on WhatsApp";
    waRow.href = buildWhatsAppLink(data.phone, data.name);
    waRow.style.display = "flex";
  } else {
    waRow.style.display = "none";
  }

  // ✅ Save Contact button
  if (saveBtn) {
    saveBtn.addEventListener("click", () => downloadVCard(data));
  }

  // ✅ Share button
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareUrl = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({
            title: data.name,
            text: `${data.name} - ${data.role}`,
            url: shareUrl,
          });
        } catch (e) {
          console.log("Share cancelled");
        }
      } else {
        // fallback copy
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert("✅ Link copied!");
        } catch (err) {
          alert("❌ Copy failed. Please copy manually:\n" + shareUrl);
        }
      }
    });
  }
}

// ✅ Run after page loads
document.addEventListener("DOMContentLoaded", renderCard);

// ✅ Optional: make callable from console
window.downloadVCard = () => {
  const staffId = getStaffId();
  const data = STAFF[staffId] || DEFAULT_CARD;
  downloadVCard(data);
};
