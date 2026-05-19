# Housewarming & Puja Celebration - RSVP Webpage

A beautiful, Apple-inspired RSVP webpage for your housewarming and Puja celebration at 5443 Brinson Ln, Kalamazoo, MI 49009.

**Event Details:**
- **Date:** Saturday, July 18, 2026
- **Time:** 3:30 PM
- **Hosted by:** Pinky & Rakesh
- **RSVP Deadline:** Friday, June 18, 2026

## 🎨 Features

✨ **Apple-Inspired Design**
- Minimalist, clean interface
- Smooth animations and transitions
- Responsive design for all devices
- Beautiful gradient backgrounds

📱 **Dynamic RSVP Form**
- Name, phone, email collection
- Attendance confirmation (Yes/No/Maybe)
- Guest count selector (1-7+ guests)
- Special dietary preferences and requests
- Real-time form validation with error messages

⏰ **Live Countdown Timer**
- Shows days, hours, minutes until June 18th deadline
- Updates every second
- Automatic deadline detection

🔔 **Notifications**
- Email notifications to dhwanirpatel@gmail.com
- SMS notifications to +16572387812
- HTML-formatted notification emails
- Twilio integration for SMS

💾 **Data Storage**
- Google Sheets integration
- LocalStorage fallback
- Automatic data persistence

## 🚀 Quick Start

### Option 1: GitHub Pages (FREE)
1. Repository is already on GitHub
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your site will be live in seconds!

URL: `https://vatsalkpatel.github.io/housewarming-rsvp/`

### Option 2: Vercel (FREE)
```bash
npm install -g vercel
vercel
```

### Option 3: Netlify (FREE)
Drag and drop the folder to https://app.netlify.com

## 🔧 Backend Setup

### Google Apps Script (Recommended for Beginners)

**Step 1: Create a Google Sheet**
- Go to https://sheets.google.com
- Create a new spreadsheet
- Copy the Sheet ID from the URL (format: `1ABC...XYZ`)

**Step 2: Set up Google Apps Script**
- Go to https://script.google.com
- Create a new project
- Copy code from `backend/google-apps-script.js` into the editor
- Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID

**Step 3: Add Twilio Credentials**
- Sign up at https://www.twilio.com (free trial account)
- Get your Account SID and Auth Token
- Get a Twilio phone number
- Add these to the Google Apps Script:
  ```javascript
  const TWILIO_ACCOUNT_SID = 'your_sid';
  const TWILIO_AUTH_TOKEN = 'your_token';
  const TWILIO_PHONE = '+1XXX...';
  ```

**Step 4: Deploy as Web App**
- Click "Deploy" → "New Deployment"
- Select type: "Web app"
- Execute as: "Me" (your email)
- Who has access: "Anyone"
- Copy the deployment URL

**Step 5: Update Frontend Configuration**
- Open `script.js`
- Find: `CONFIG.BACKEND_URL`
- Replace with your deployment URL
- Commit and push changes

## 📋 File Structure

```
housewarming-rsvp/
├── index.html                 # Main webpage
├── styles.css                 # Apple-inspired styling
├── script.js                  # Form logic & countdown
├── backend/
│   ├── google-apps-script.js  # Google Apps Script backend
│   └── .env.example           # Environment variables template
├── README.md                  # This file
└── .gitignore                 # Git configuration
```

## 🎯 How It Works

1. **User fills out RSVP form:**
   - Enters name, phone, email
   - Confirms attendance
   - Selects number of guests
   - Adds special requests

2. **Form is validated:**
   - All required fields checked
   - Phone number validated (10+ digits)
   - Email format validated
   - Real-time error messages shown

3. **Data is submitted:**
   - Sent to Google Apps Script backend
   - Saved to Google Sheet

4. **Notifications are sent:**
   - Email with complete RSVP details
   - SMS confirmation message

5. **User gets confirmation:**
   - Success message displayed
   - Form resets for next user

## 📊 What Information is Collected

✅ Guest name (required)
✅ Phone number (required)
✅ Email (optional)
✅ Attendance confirmation (Yes/No/Maybe)
✅ Number of guests
✅ Dietary preferences/special requests
✅ Submission timestamp

## 🔐 Privacy & Security

- Data stored in your Google Sheet (encrypted by Google)
- Phone numbers used only for notifications
- All form inputs validated and sanitized
- No data sold or shared
- Compliant with GDPR

## 🎨 Customization

### Change Event Details
Edit in `index.html`:
```html
<p>5443 Brinson Ln</p>           <!-- Location -->
<p>Saturday, July 18, 2026</p>   <!-- Date -->
<p>3:30 PM</p>                   <!-- Time -->
<p>Pinky & Rakesh</p>            <!-- Hosts -->
```

### Change Notification Recipients
Edit in `backend/google-apps-script.js`:
```javascript
const NOTIFICATION_EMAILS = ['your-email@gmail.com'];
const NOTIFICATION_PHONE = '+1XXXXXXXXXX';
```

### Customize Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --accent: #0071e3;           /* Blue accent color */
    --text-primary: #1d1d1d;     /* Main text color */
    --error: #ff3b30;            /* Error message color */
}
```

## 🆘 Troubleshooting

### Form submissions not working
- Check that backend URL is correct in `script.js`
- Verify Google Apps Script is deployed
- Check browser console for errors (F12)
- Ensure CORS is enabled on backend

### Emails not received
- Verify email address in backend configuration
- Check spam/junk folder
- Ensure Gmail has "Less secure apps" enabled (if using Gmail)
- Check Google Apps Script logs

### SMS not received
- Verify Twilio credentials are correct
- Confirm Twilio account has active trial/credits
- Verify phone number format (+1 for US numbers)
- Check Twilio console for SMS logs

### Countdown timer not updating
- Clear browser cache (Ctrl+Shift+Delete)
- Verify system time is correct
- Check browser console for JavaScript errors

## 📱 Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Sharing

**Share the link with guests:**
```
https://vatsalkpatel.github.io/housewarming-rsvp/
```

**QR Code:** You can generate a QR code at https://qr-code-generator.com/

**Social Media:**
- Share the link in Facebook events
- Email the link to guests
- WhatsApp the link
- Include in text invitations

## ❓ FAQ

**Q: Can I see the RSVPs in real-time?**
A: Yes! They're saved to your Google Sheet. Open it anytime to see new responses.

**Q: Can guests change their RSVP?**
A: Currently, each submission is a new entry. To update, guests would resubmit (you can manually update in the sheet).

**Q: Is there a guest list limit?**
A: No! The form supports 1-99+ guests per person.

**Q: Can I customize the form fields?**
A: Yes! Edit `index.html` to add/remove fields, then update `script.js` and the Google Apps Script accordingly.

**Q: What if I don't want email/SMS notifications?**
A: You can remove those functions from the Google Apps Script, or just check the Google Sheet manually.

## 📞 Support

For issues:
1. Check the Troubleshooting section above
2. Review Google Apps Script execution logs
3. Check browser console for errors (F12)
4. Verify all configuration values are correct

## 📄 License

Free to use and customize for personal events.

---

**Made with ❤️ for your special celebration!**

Enjoy your housewarming and Puja! 🏡✨🙏
