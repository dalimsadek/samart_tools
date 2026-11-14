"use strict";

/* ════════════════════════════════════════════════════════════
   SAM'ART — Configuration centrale
   ════════════════════════════════════════════════════════════ */
const SAM = {

  business: {
    name:    "SAM'ART",
    tagline: "INTERIOR DESIGN",
    owner:   "Samar Msadek",
    address: "12 avenue du plateau",
    city:    "88200 Saint Étienne les Remiremont",
    country: "France",
    siren:   "943 458 497",
    email:   "Contact@samart-interior.fr",
    thanks:  "Merci pour votre confiance !",
    tva:     "TVA non applicable – art. 293 B du CGI",
  },

  docs: {
    validite:    "2 mois",
    delai:       "1 mois à compter de la réception de l'acompte",
    acompte_pct: 30,
  },

  banks: {
    DT: {
      titulaire: "NESRINE MSADEK",
      banque:    "ATTIJARI BANK",
      iban:      "04603049003144654575",
    },
    EUR: {
      titulaire: "SAMAR MSADEK",
      iban:      "FR76300004033760000248580687",
      bic:       "BNPAFRPPXXX",
    },
  },
};


/* ════════════════════════════════════════════════════════════
   UTILITAIRES
   ════════════════════════════════════════════════════════════ */

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(n, cur) {
  if (!Number.isFinite(n)) return "—";
  return cur === "EUR" ? n.toFixed(0) + " €" : n.toFixed(0) + " DT";
}

function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function nextDocNumber(storageKey) {
  const d  = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  let seq  = 1;
  try { seq = (parseInt(localStorage.getItem(storageKey) || "0") + 1); } catch {}
  return String(seq).padStart(2, "0") + mm + yy;
}

function bumpDocNumber(storageKey) {
  try {
    const cur = parseInt(localStorage.getItem(storageKey) || "0");
    localStorage.setItem(storageKey, cur + 1);
  } catch {}
}


/* ════════════════════════════════════════════════════════════
   PIED DE PAGE DOCUMENT
   Logo grand + SAM'ART à gauche · colonnes contact à droite
   ════════════════════════════════════════════════════════════ */
function buildFooter() {
  const b = SAM.business;
  return `
    <div class="d-footer">
      <p class="d-footer-thanks">${b.thanks}</p>
      <div class="d-footer-inner">
        <div class="d-footer-brand-row">
          <img src="samar-interiot_logo.png" class="d-footer-logo" alt="${b.name}">
          <div class="d-footer-brand-info">
            <span class="d-footer-name">${b.name}</span>
            <span class="d-footer-tagline">${b.tagline}</span>
          </div>
        </div>
        <div class="d-footer-cols">
          <div class="d-footer-col">
            <div>${b.owner}</div>
            <div>${b.address}</div>
            <div>${b.city}</div>
            <div>${b.country}</div>
          </div>
          <div class="d-footer-sep"></div>
          <div class="d-footer-col">
            <div>${b.email}</div>
            <div>SIREN : ${b.siren}</div>
          </div>
        </div>
      </div>
      <p class="d-footer-legal">${b.tva}</p>
    </div>`;
}


/* ════════════════════════════════════════════════════════════
   EXPORT IMAGE  (PNG / JPG)
   ════════════════════════════════════════════════════════════ */
async function exportImage(previewId, filename, format) {
  if (typeof html2canvas === "undefined") {
    alert("html2canvas non disponible.\nVérifiez votre connexion Internet.");
    return;
  }
  const page = document.getElementById(previewId);
  if (!page) return;

  const prevShadow = page.style.boxShadow;
  page.style.boxShadow = "none";

  try {
    const canvas = await html2canvas(page, {
      scale:           2,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: "#f6f1e9",
      logging:         false,
    });
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const a    = document.createElement("a");
    a.download = `${filename}.${format}`;
    a.href     = canvas.toDataURL(mime, 0.95);
    a.click();
  } catch (err) {
    alert("Export échoué : " + err.message);
  } finally {
    page.style.boxShadow = prevShadow;
  }
}
