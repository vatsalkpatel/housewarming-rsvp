// Google Apps Script - Deploy as Web App
// Instructions:
// 1. Go to https://script.google.com
// 2. Create a new project
// 3. Copy this entire code into the editor
// 4. Create a Google Sheet and get its ID
// 5. Add Twilio credentials
// 6. Deploy as Web App (Execute as: Me, Who has access: Anyone)
// 7. Update the WEBHOOK_URL in script.js with the deployment URL

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const TWILIO_ACCOUNT_SID = 'YOUR_TWILIO_SID_HERE';
const TWILIO_AUTH_TOKEN = 'YOUR_TWILIO_AUTH_TOKEN_HERE';
const TWILIO_PHONE = '+1XXXXXXXXXX'; // Your Twilio number
const NOTIFICATION_EMAILS = ['dhwanirpatel@gmail.com'];
const NOTIFICATION_PHONE = '+16572387812';

// Main POST handler
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        
        // Save to Google Sheet
        saveToSheet(data);
        
        // Send notifications
        setTimeout(() => sendEmailNotification(data), 1000);
        setTimeout(() => sendSMSNotification(data), 2000);
        
        return ContentService
            .createTextOutput(JSON.stringify({
                success: true,
                message: 'RSVP received successfully'
            }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        console.error('Error:', error);
        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: error.message
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Save data to Google Sheet
function saveToSheet(data) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
        
        // Add header row if sheet is empty
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                'Timestamp',
                'Name',
                'Phone',
                'Email',
                'Number of Guests',
                'Attending',
                'Special Requests'
            ]);
        }
        
        // Append RSVP data
        sheet.appendRow([
            data.formattedDate,
            data.name,
            data.phone,
            data.email || 'Not provided',
            data.guests,
            data.attending,
            data.requests || 'None'
        ]);
        
        console.log('Data saved to sheet:', data.name);
    } catch (error) {
        console.error('Error saving to sheet:', error);
        throw error;
    }
}

// Send email notification
function sendEmailNotification(data) {
    try {
        const subject = `New RSVP Submission: ${data.name}`;
        const htmlBody = `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #0071e3;">✨ New RSVP Received ✨</h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f5f5f7;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.name)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.phone)}</td>
                        </tr>
                        <tr style="background-color: #f5f5f7;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.email) || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Attending</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.attending)}</td>
                        </tr>
                        <tr style="background-color: #f5f5f7;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Number of Guests</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${data.guests}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Special Requests</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.requests) || 'None'}</td>
                        </tr>
                        <tr style="background-color: #f5f5f7;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Submitted</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(data.formattedDate)}</td>
                        </tr>
                    </table>
                    
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated email from the RSVP system. Please do not reply to this email.</p>
                </body>
            </html>
        `;
        
        // Send to all notification emails
        NOTIFICATION_EMAILS.forEach(email => {
            GmailApp.sendEmail(email, subject, '', {
                htmlBody: htmlBody,
                from: Session.getActiveUser().getEmail()
            });
            console.log('Email sent to:', email);
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Send SMS notification using Twilio
function sendSMSNotification(data) {
    try {
        const message = `New RSVP: ${data.name} (${data.guests} guests, ${data.attending})`;
        
        const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
        const payload = {
            'From': TWILIO_PHONE,
            'To': NOTIFICATION_PHONE,
            'Body': message
        };
        
        const options = {
            'method': 'post',
            'headers': {
                'Authorization': 'Basic ' + Utilities.base64Encode(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
            },
            'payload': payload,
            'muteHttpExceptions': true
        };
        
        const response = UrlFetchApp.fetch(url, options);
        const result = JSON.parse(response.getContentText());
        
        if (response.getResponseCode() === 201) {
            console.log('SMS sent successfully:', result.sid);
        } else {
            console.error('SMS error:', result.message);
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Test function to verify setup
function testSetup() {
    const testData = {
        name: 'Test User',
        phone: '+1234567890',
        email: 'test@example.com',
        guests: 2,
        attending: 'Yes',
        requests: 'Test submission',
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    try {
        saveToSheet(testData);
        sendEmailNotification(testData);
        // sendSMSNotification(testData); // Uncomment after Twilio setup
        Logger.log('Test completed successfully');
    } catch (error) {
        Logger.log('Test error:', error);
    }
}
