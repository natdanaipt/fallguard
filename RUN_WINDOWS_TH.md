# วิธีเปิด Fall Guard บน Windows / Expo Go / สร้าง APK

## 1. แก้พื้นที่เต็มก่อน
ภาพ error `ENOSPC: no space left on device` หมายถึงพื้นที่สำหรับติดตั้งหรือแคชไม่พอ
การแก้โค้ดอย่างเดียวแก้พื้นที่เต็มไม่ได้ ให้เคลียร์พื้นที่ไดรฟ์ C: หรือย้ายโปรเจกต์และแคชไปไดรฟ์อื่น
แนะนำเผื่อพื้นที่หลาย GB (เช่น 5–10 GB สำหรับการติดตั้งและแคช ไม่ใช่ขั้นต่ำตายตัว)
ใช้ Windows Settings > System > Storage ตรวจไฟล์ชั่วคราวก่อนลบ อย่าลบไฟล์งานที่ยังต้องใช้

แตก ZIP ใหม่นี้ลงโฟลเดอร์ใหม่ ห้ามรันจากใน ZIP และไม่ต้องคัดลอก node_modules เก่ามา
ไฟล์นี้ไม่ได้รวม node_modules เพื่อให้ดาวน์โหลดเล็กและติดตั้งใหม่ได้สะอาด

ถ้าใช้ไดรฟ์ D: ให้เปิด Command Prompt (CMD) แล้วทำตามตัวอย่าง
(แก้ path ให้ตรงโฟลเดอร์จริง และใช้ไดรฟ์ที่มีอยู่ในเครื่อง):

```bat
mkdir D:\npm-cache
mkdir D:\npm-temp
set "npm_config_cache=D:\npm-cache"
set "TEMP=D:\npm-temp"
set "TMP=D:\npm-temp"
cd /d D:\fall-guard-main
```

ตัวแปรข้างต้นมีผลเฉพาะหน้าต่าง CMD นี้ ย้ายเฉพาะโปรเจกต์แต่แคชยังอยู่ C: อาจเจอปัญหาเดิม
หากใช้ C: ต่อ ให้เคลียร์พื้นที่ก่อน แล้ว cd ไปโฟลเดอร์ที่แตก ZIP ใหม่

## 2. Node.js และติดตั้ง
ใช้ Node.js 24 LTS (อย่างน้อย 24.3.0) ตรวจด้วย `node -v` และ `npm -v`
ชุด Expo เดิมเป็น SDK 58 และแพ็กเกจหลักตรวจแล้วตรงกัน จึงไม่ได้ดาวน์เกรด SDK

รันในโฟลเดอร์ที่มี package.json:

```bat
npm ci
npm run start:clear
```

ถ้า npm ci ยัง error ให้แก้ error นั้นก่อน อย่ารันคำสั่งถัดไป
เก็บ package-lock.json ไว้ เพราะระบุชุดเวอร์ชันที่ตรวจแล้ว

## 3. เปิดผ่าน Expo Go
- ใช้ Expo Go ที่รองรับ SDK 58 (อัปเดตจากร้านแอปก่อน)
- คอมพิวเตอร์และมือถือเชื่อม Wi-Fi เดียวกัน
- Android สแกน QR ผ่าน Expo Go / iPhone ใช้กล้องสแกน QR แล้วเปิด Expo Go
- อนุญาต Node.js ผ่าน Windows Firewall เฉพาะเครือข่ายส่วนตัว ไม่ต้องปิด Firewall ทั้งหมด
- ถ้า LAN ถูกบล็อก เช่น Wi-Fi มหาวิทยาลัย ให้หยุดด้วย Ctrl+C แล้วรัน:

```bat
npm run start:tunnel
```

ถ้าถามติดตั้ง @expo/ngrok ให้ตอบ y ต้องมีอินเทอร์เน็ตและเครือข่ายที่อนุญาต tunnel
หากข้อความแจ้ง SDK ไม่รองรับ ให้ตรวจ SDK ใน Expo Go หรือใช้ Android APK ตามขั้นตอนถัดไป
อย่าเปลี่ยนเฉพาะเลขเวอร์ชัน expo โดยไม่ปรับแพ็กเกจคู่กัน

## 4. สร้าง APK ติดตั้ง Android โดยไม่ต้องเปิดคอมค้าง
ติดตั้ง Git for Windows หากเครื่องยังไม่มี แล้วเปิด CMD ใหม่
ใช้บัญชี Expo ของตนเอง:

```bat
npx eas-cli@latest login
npx eas-cli@latest build:configure
npm run build:android
```

- เมื่อถามสร้าง/เชื่อม EAS project ให้ใช้โปรเจกต์ของตนเอง
- ถ้าถามตั้ง Git repository ให้ยืนยันสำหรับโฟลเดอร์ใหม่นี้
- เลือก Android และถ้ายังไม่มี keystore ให้ EAS สร้างใหม่
- โปรไฟล์ preview ใน eas.json ตั้ง buildType เป็น apk แล้ว
- รอ build เสร็จ เปิดลิงก์ผลลัพธ์จาก EAS บน Android ดาวน์โหลด APK และอนุญาตติดตั้งจากแหล่งนั้น
- APK นี้เป็นแอป standalone ไม่ต้องเปิด Metro หรือ Expo Go
- production ใช้สำหรับชุดเผยแพร่ store; AAB ไม่ใช่ไฟล์ที่กดติดตั้งบนมือถือได้โดยตรง

ตั้ง application ID เริ่มต้นเป็น com.natdanaipt.fallguard
ถ้าเคยเผยแพร่แอปเดิมแล้ว ให้ใช้ package/bundleIdentifier และ signing เดิมก่อน build

iPhone ใช้ Expo Go สำหรับทดสอบได้ ส่วน build ติดตั้งจริงต้องตั้งค่า Apple signing/distribution
และโดยทั่วไปต้องมี Apple Developer Program; APK ใช้บน iPhone ไม่ได้
มีคำสั่ง `npm run build:ios` สำหรับ production แต่ต้องตั้งค่าบัญชีและ signing ด้วยตนเอง

## 5. สิ่งที่แก้
- เพิ่ม expo-asset ที่ expo-audio ต้องใช้โดยตรง (expo-doctor ตรวจพบว่าขาด)
- แก้ StyleSheet.absoluteFillObject ที่ไม่มีใน React Native 0.88 เป็น absoluteFill
- แก้ ThemePicker ที่ import ตัวแปรและฟังก์ชันซึ่งไม่มีใน theme.ts ให้สอดคล้องธีม ocean เดิม
- แก้ refs/animation/countdown ให้ผ่าน lint พร้อมเปิดใช้ ESLint config
- จัดการ error ตอนเริ่ม accelerometer แทนปล่อย unhandled rejection
- เพิ่ม EAS profile สำหรับ APK และ application identifiers
- ตั้งค่า permission messages ของ sensors/location และปิดสิทธิ์อัดเสียงที่แอปไม่ได้ใช้
- เพิ่มคำสั่งเริ่ม Expo Go, ล้าง Metro cache, tunnel, typecheck และ build
- ลบคำสั่ง reset-project ที่อ้างไฟล์ scripts/reset-project.js ซึ่งไม่มีใน ZIP เดิม
- แก้เอกสารนับถอยหลังเป็น 10 วินาทีให้ตรงโค้ด

## 6. ทดสอบบนมือถือหลังเปิดได้
1. หน้าแรกแสดงค่า accelerometer และขยับเมื่อขยับมือถือเบา ๆ
2. กด Simulate a fall แล้วกดยกเลิกก่อนหมด 10 วินาที
3. เพิ่ม bot token/chat ID ของตนเองแล้วใช้ Send test กับผู้รับที่กด Start ใน Telegram bot แล้ว
4. เปิด Include my location และอนุญาตตำแหน่ง
5. ทดลอง countdown จนครบ ตรวจเสียงไซเรน ข้อความ และการหยุดเสียง

แอปนี้ตรวจจับใน foreground ต้องเปิดหน้าจอแอปไว้ ไม่ใช่ระบบตรวจจับเบื้องหลังตลอดเวลา
ไม่ต้องทำโทรศัพท์ตกจริงเพื่อทดสอบ; ใช้ปุ่มจำลอง

## ผลตรวจในสภาพแวดล้อมผู้แก้ไข
ดู VALIDATION.md; การ export bundle / prebuild ไม่ใช่การ compile APK หรือทดสอบบนมือถือจริง

เอกสารอ้างอิง:
- https://docs.expo.dev/versions/v58.0.0/
- https://docs.expo.dev/build-reference/apk/
- https://reactnative.dev/docs/stylesheet
