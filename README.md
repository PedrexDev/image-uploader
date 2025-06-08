<div align="center">
  <img src="https://i.imgur.com/NAyZHc3.png" alt="Uploader Logo" width="120" />

  # 📸 Image Uploader App

  <p>
    A simple, clean, and powerful image uploader platform<br>
    with full admin control, user-based access, and charts.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-Express-green?style=flat-square" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-success?style=flat-square" />
    <img src="https://img.shields.io/badge/Frontend-EJS+Bootstrap-lightblue?style=flat-square" />
  </p>
</div>

---

## ✨ What is this?

This app lets selected users upload and manage images. There's a clean admin panel where the owner can:

- Add or remove uploaders
- See all uploaded images
- Delete any image
- Track uploads with daily charts

---

## 🖼️ Features

- 🔐 **User Access Control** — Only approved users can upload
- 🖼️ **Image Uploading** — With title, description, and preview
- 🛠️ **Admin Dashboard** — Manage users and uploads easily
- 📊 **Statistics** — Uploads per day shown in a simple chart
- 🧼 **Minimal Design** — Clean interface with Bootstrap 5.3

---

## 🚀 How to Start (for Beginners)

### 📦 Step 1: Download It

```bash
git clone https://github.com/PedrexDev/image-uploader.git
cd image-uploader
```

### 💻 Step 2: Need to create .env file
Below is a sample you can use to create your `.env` file.
```bash
MONGODB_URI=<your mongodb uri>
OWNER_ID=<your discord userId>
DISCORD_CLIENT_ID=<discord client id>
DISCORD_CLIENT_SECRET=<discord client secret>
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
SESSION_SECRET=<your session secret>
PORT=3000
```
In this template, just replace the dummy information given here with your information.

### 💡 Step 3: Let's get this thing going!
If you've completed all these steps, now there's nothing left to do but launch the app! It's not complicated, just enter this command in your console:
```bash
node app.js
```
You should see this in the console after a while:
```bash
Server running on http://localhost:3000
Connected to MongoDB
```
This means that the application has successfully connected to MongoDB and is available at <a href="https://localhost:3000/">https://localhost:3000/</a>.

---

## 📑 License
[MIT](https://choosealicense.com/licenses/mit/)