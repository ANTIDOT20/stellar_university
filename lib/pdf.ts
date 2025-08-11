// Server-side certificate and transcript PDF generation
// Uses a simple HTML template rendered to PDF via puppeteer in production.
// In the current environment, this module exports the HTML template string
// so callers can use their own rendering pipeline.

export interface CertificateData {
  studentName:  string;
  matric:       string;
  department:   string;
  faculty:      string;
  degree:       string;
  session:      string;
  degreeClass:  string;
  gpa:          number;
  credentialId: string;
  issuedDate:   string;
}

export function buildCertificateHtml(data: CertificateData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
    body { font-family: 'Inter', sans-serif; background: #0A0E1A; color: white; margin: 0; padding: 40px; }
    .border { border: 6px double #FFB800; padding: 40px; min-height: 700px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
    h1 { font-family: 'Playfair Display', serif; font-size: 48px; color: #FFB800; text-align: center; margin: 0; }
    .sub { font-size: 14px; color: #94A3B8; text-transform: uppercase; letter-spacing: 4px; text-align: center; }
    .name { font-size: 36px; font-weight: 600; text-align: center; margin: 8px 0; }
    .dept { font-size: 18px; color: #94A3B8; text-align: center; }
    .meta { display: flex; gap: 40px; justify-content: center; font-size: 13px; }
    .meta div { text-align: center; }
    .meta span { display: block; color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .cred { font-family: monospace; font-size: 11px; color: #94A3B8; text-align: center; margin-top: 16px; }
    .seal { font-size: 48px; }
  </style>
</head>
<body>
  <div class="border">
    <div class="sub">StellarU Protocol · Certificate of Award</div>
    <div class="seal">🎓</div>
    <h1>${data.degree}</h1>
    <p class="sub">This certifies that</p>
    <p class="name">${data.studentName}</p>
    <p class="dept">${data.department} · ${data.faculty}</p>
    <div class="meta">
      <div><strong>${data.degreeClass.replace(/_/g, " ")}</strong><span>Degree Class</span></div>
      <div><strong>${data.gpa.toFixed(2)}</strong><span>Final GPA</span></div>
      <div><strong>${data.session}</strong><span>Session</span></div>
      <div><strong>${data.issuedDate}</strong><span>Date Issued</span></div>
    </div>
    <p class="cred">Credential ID: ${data.credentialId}</p>
    <p class="cred" style="font-size:10px;margin-top:4px;">
      Verify at: https://stellaru.xyz/verify · Issued on Stellar Blockchain
    </p>
  </div>
</body>
</html>`;
}

export interface TranscriptData {
  student:  { name: string; matric: string; department: string };
  sessions: Array<{
    label:   string;
    gpa:     number;
    courses: Array<{ code: string; title: string; cu: number; score: number; grade: string }>;
  }>;
  cumGpa: number;
}

export function buildTranscriptHtml(data: TranscriptData): string {
  const rows = data.sessions.flatMap((s) =>
    s.courses.map((c) =>
      `<tr><td>${c.code}</td><td>${c.title}</td><td>${c.cu}</td><td>${c.score}</td><td>${c.grade}</td></tr>`
    ).concat([`<tr class="gpa-row"><td colspan="4" style="text-align:right">GPA — ${s.label}</td><td><b>${s.gpa.toFixed(2)}</b></td></tr>`])
  ).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; padding: 30px; color: #111; }
  h1 { font-size: 22px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; }
  .gpa-row td { background: #f9f9f9; font-style: italic; }
</style>
</head><body>
<h1>Academic Transcript</h1>
<p><b>Name:</b> ${data.student.name} &nbsp;|&nbsp; <b>Matric:</b> ${data.student.matric} &nbsp;|&nbsp; <b>Dept:</b> ${data.student.department}</p>
<table>
  <thead><tr><th>Code</th><th>Course</th><th>CU</th><th>Score</th><th>Grade</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<p style="margin-top:16px"><b>Cumulative GPA: ${data.cumGpa.toFixed(2)}</b></p>
<p style="font-size:10px;color:#666">Issued by StellarU Protocol. Verify at https://stellaru.xyz/verify</p>
</body></html>`;
}
