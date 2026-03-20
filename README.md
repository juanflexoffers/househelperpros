# HouseHelperPros

Lead-gen landing site (Next.js on Vercel).

## Dev

`ash
npm install
npm run dev
`
"@
System.Collections.Hashtable['app/globals.css']=@"
:root{
  --bg: #0b1220;
  --card: rgba(255,255,255,0.06);
  --text: #e8edf7;
  --muted: rgba(232,237,247,0.72);
  --accent: #5eead4;
  --accent2: #60a5fa;
}
*{box-sizing:border-box}
html,body{padding:0;margin:0}
body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\";
  background: radial-gradient(1200px 700px at 10% 0%, rgba(96,165,250,0.18), transparent 55%),
              radial-gradient(900px 600px at 90% 10%, rgba(94,234,212,0.16), transparent 60%),
              var(--bg);
  color: var(--text);
}
a{color:inherit;text-decoration:none}
.container{max-width:1100px;margin:0 auto;padding:0 20px}
.badge{display:inline-flex;gap:8px;align-items:center;padding:6px 10px;border:1px solid rgba(255,255,255,0.12);border-radius:999px;background:rgba(255,255,255,0.04);font-size:12px;color:var(--muted)}
.h1{font-size:48px;line-height:1.05;margin:16px 0}
.p{color:var(--muted);font-size:18px;line-height:1.6}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.06);cursor:pointer}
.btn.primary{background:linear-gradient(90deg, rgba(94,234,212,0.22), rgba(96,165,250,0.22));border-color:rgba(94,234,212,0.35)}
.input{width:100%;max-width:420px;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.14);background:rgba(10,18,32,0.55);color:var(--text)}
.grid{display:grid;gap:16px}
.grid.cols4{grid-template-columns:repeat(4,minmax(0,1fr))}
@media (max-width: 980px){.grid.cols4{grid-template-columns:repeat(2,minmax(0,1fr))}.h1{font-size:38px}}
@media (max-width: 560px){.grid.cols4{grid-template-columns:1fr}.h1{font-size:34px}}
.card{padding:18px;border-radius:16px;background:var(--card);border:1px solid rgba(255,255,255,0.10)}
.section{padding:56px 0}
.hr{height:1px;background:rgba(255,255,255,0.10);border:0;margin:0}
footer{padding:28px 0;color:var(--muted);font-size:13px}