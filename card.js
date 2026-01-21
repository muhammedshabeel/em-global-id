/* card.js — Emarath Staff Card renderer (GitHub Pages friendly) */
(() => {
  // ---- 1) Staff data (slug = URL id) ----
  const STAFF = {
    "ahamed-sijil": {
      name: "Mr. Ahamed Sijil",
      role: "Chief Executive Officer (CEO)",
      company: "Emarath Global Pvt Ltd",
      email: "ceo@emarathglobal.com",
      phone: "+91 81578 97198",
      waText: "Message on WhatsApp",
      photo: "assets/photos/ahamed.jpg",
    },
    "jansiya-s": {
      name: "Ms. Jansiya S",
      role: "Financial Manager",
      company: "Emarath Global Pvt Ltd",
      email: "financialmanager@emarathglobal.com",
      phone: "+91 81298 65032",
      waText: "Message on WhatsApp",
      photo: "assets/photos/jansiya.jpg",
    },
    "shahabas-ali": {
      name: "Mr. Shahabas Ali",
      role: "Business Development Manager",
      company: "Emarath Global Pvt Ltd",
      email: "bdm@emarathglobal.com",
      phone: "+91 73064 94305",
      waText: "Message on WhatsApp",
      photo: "assets/photos/shahabas.jpg",
    },
    "arya-krishna": {
      name: "Ms. Arya Krishna",
      role: "HR Executive",
      company: "Emarath Global Pvt Ltd",
      email: "hr@emarathglobal.com",
      phone: "+91 85474 70653",
      waText: "Message on WhatsApp",
      photo: "assets/photos/arya.jpg",
    },
    "jaseed": {
      name: "Mr. Jaseed",
      role: "Vice President",
      company: "Emarath Global Pvt Ltd",
      email: "vp@emarathglobal.com",
      phone: "+91 70121 55575",
      waText: "Message on WhatsApp",
      photo: "assets/photos/jaseed.jpg",
    },
    "hasna-h": {
      name: "Ms. Hasna H",
      role: "Cross Functional Manager (CFM)",
      company: "Emarath Global Pvt Ltd",
      email: "cfm@emarathglobal.com",
      phone: "+91 75107 67713",
      waText: "Message on WhatsApp",
      photo: "assets/photos/hasna.jpg",
    },
    "saife": {
      name: "Mr. Saife",
      role: "Consultant",
      company: "Emarath Global Pvt Ltd",
      email: "",
      phone: "+91 97454 44800",
      waText: "Message on WhatsApp",
      photo: "assets/photos/saife.jpg",
    },
  };

  const DEFAULT_PHOTO = "assets/photos/default.jpg";

  // ---- 2) Helpers ----
  const $ = (id) => document.getElementById(id);

  function getSlug() {
    // Prefer ?id=...
    const url = new URL(window.location.href);
    const id = (url.searchParams.get("id") || "").trim();
    if (id) return id;

    // Fallback: /staff/<slug>/
    const parts = window.location.pathname.split("/").filter(Boolean);
    const staffIndex = parts.indexOf("staff");
    if (staffIndex >= 0 && parts[staffIndex + 1]) return parts[staffIndex + 1];

    return "";
  }

  function digitsOnly(phone) {
    return (phone || "").replace(/[^\d]/g, "");
  }

  function safeText(el, value, fallback = "—") {
    if (!el) return;
    el.textContent = value && String(value).trim() ? value : fallback;
  }

  function showRow(rowEl, show) {
    if (!rowEl) return;
    rowEl.style.display = show ? "" : "none";
  }

  function setHref(aEl, href) {
    if (!aEl) return;
    aEl.setAttribute("href", href);
  }

  function makeVCard(person) {
    // Very simple vCard 3.0
    const n = (person.name || "").replace(/\s+/g, " ").trim();
    const org = (person.company || "").trim();
    const title = (person.role || "").trim();
    const email = (person.email || "").trim();
    const tel = (person.phone || "").trim();

    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${n}`,
      org ? `ORG:${org}` : "",
      title ? `TITLE:${title}` : "",
      email ? `EMAIL;TYPE=INTERNET:${email}` : "",
      tel ? `TEL;TYPE=CELL:${tel}` : "",
      "END:VCARD",
    ].filter(Boolean);

    return lines.join("\n");
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  // ---- 3) Render ----
  function render() {
    const slug = getSlug();
    const person = STAFF[slug];

    // Elements (must match card.html IDs)
    const profilePhoto = $("profilePhoto");
    const fullName = $("fullName");
    const role = $("role");
    const company = $("company");

    const saveBtn = $("saveBtn");
    const shareBtn = $("shareBtn");

    const emailRow = $("emailRow");
    const emailText = $("emailText");

    const phoneRow = $("phoneRow");
    const phoneText = $("phoneText");

    const waRow = $("waRow");
    const waText = $("waText");

    // If slug not found, show a hard truth fallback
    if (!person) {
      safeText(fullName, "Not found");
      safeText(role, "Invalid staff id");
      safeText(company, "Emarath Global Pvt Ltd");
      if (profilePhoto) profilePhoto.src = DEFAULT_PHOTO;

      showRow(emailRow, false);
      showRow(phoneRow, false);
      showRow(waRow, false);

      if (saveBtn) saveBtn.disabled = true;
      return;
    }

    // Text
    safeText(fullName, person.name);
    safeText(role, person.role);
    safeText(company, person.company);

    // Photo (force correct image + face crop)
    if (profilePhoto) {
      profilePhoto.src = person.photo || DEFAULT_PHOTO;

      // If image fails, fallback to default
      profilePhoto.onerror = () => {
        profilePhoto.onerror = null;
        profilePhoto.src = DEFAULT_PHOTO;
      };
    }

    // Email row
    const hasEmail = !!(person.email && person.email.trim());
    showRow(emailRow, hasEmail);
    if (hasEmail) {
      safeText(emailText, person.email);
      setHref(emailRow, `mailto:${person.email}`);
    }

    // Phone row
    const hasPhone = !!(person.phone && person.phone.trim());
    showRow(phoneRow, hasPhone);
    if (hasPhone) {
      safeText(phoneText, person.phone);
      setHref(phoneRow, `tel:${digitsOnly(person.phone)}`);
    }

    // WhatsApp row
    showRow(waRow, hasPhone);
    if (hasPhone) {
      safeText(waText, person.waText || "Message on WhatsApp");
      const waNumber = digitsOnly(person.phone);
      setHref(waRow, `https://wa.me/${waNumber}`);
    }

    // Save Contact button
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.onclick = () => {
        const vcf = makeVCard(person);
        const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}.vcf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 500);
      };
    }

    // Share button
    if (shareBtn) {
      shareBtn.onclick = async () => {
        const shareUrl = window.location.href;

        if (navigator.share) {
          try {
            await navigator.share({
              title: person.name,
              text: `${person.name} — ${person.role}`,
              url: shareUrl,
            });
            return;
          } catch {
            // fall through to clipboard
          }
        }

        const ok = await copyToClipboard(shareUrl);
        shareBtn.textContent = ok ? "✓ Copied" : "Copy failed";
        setTimeout(() => (shareBtn.textContent = "↗ Share"), 1200);
      };
    }
  }

  // ---- 4) Boot ----
  // Ensure DOM is ready even if script is not deferred
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
