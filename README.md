# Medisto — Deployment Guide (Phone Only, No Coding)

Follow these steps in order. Sab kuch phone ke browser se ho sakta hai.

## Step 1 — GitHub account
1. Browser mein jao: github.com
2. "Sign up" karo (free)

## Step 2 — Naya repository banao
1. Login karne ke baad, "+" icon > "New repository"
2. Naam do: `medisto-app`
3. "Public" select karo, "Create repository" dabao

## Step 3 — Files upload karo
1. Naye repo page par "uploading an existing file" link dabao
2. Is zip ke andar ki SAARI files aur folders (package.json, index.html, vite.config.js, tailwind.config.js, postcss.config.js, README.md, aur `src` folder ki 3 files) drag-drop ya select karke upload karo
   - Agar phone browser folder drag-drop support nahi karta, toh zip ko pehle apne phone ke File Manager app se "Extract/Unzip" kar lo, phir GitHub upload screen par un extracted files ko select karo
3. Neeche "Commit changes" dabao

## Step 4 — Vercel se connect karo
1. Browser mein jao: vercel.com
2. "Sign up" > "Continue with GitHub" (same account se login)
3. Dashboard mein "Add New" > "Project"
4. Apna `medisto-app` repository select karo > "Import"
5. Sab settings default hi rehne do, "Deploy" dabao
6. 1-2 minute mein ek **live link** milega (jaise medisto-app.vercel.app) — yeh tumhara real, live web app hai!

## Step 5 — Android APK banao
1. Browser mein jao: pwabuilder.com
2. Apna Vercel wala live link paste karo, "Start" dabao
3. "Android" tab select karo, "Generate Package" dabao
4. APK download ho jayega — yeh install karke koi bhi Android phone par chalega

## Step 6 — Real SMS OTP (baad mein, jab basic app live ho jaaye)
Abhi login "demo mode" mein hai (koi bhi 6-digit OTP chalega). Real SMS OTP ke liye:
1. console.firebase.google.com par free account banao
2. Naya project > Build > Authentication > Sign-in method > "Phone" enable karo
3. Iske baad Claude se bolo "Firebase OTP wire kar do" — woh exact code de dega jo tumhe `src/App.jsx` mein add karna hoga (GitHub ki web editor se hi, "Edit" pencil icon dabake, seedha phone se)

## Apna WhatsApp number check karo
`src/App.jsx` file mein line ~55 par:
```
const WHATSAPP_NUMBER = "919219494578";
```
Yeh already tumhara number hai. Agar badalna ho, GitHub par file open karke pencil (Edit) icon se seedha badal sakte ho.
