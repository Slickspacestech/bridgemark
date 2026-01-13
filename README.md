# Bridgemark Development Website

Static landing page for Bridgemark Development with Netlify Functions for contact form handling.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

#### For Local Development (Optional)
Create a `.env` file in the root directory:
```bash
SMTP2GO_API_KEY=your_smtp2go_api_key_here
```

#### For Netlify Deployment (Required)
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variable:
   - **Key**: `SMTP2GO_API_KEY`
   - **Value**: Your SMTP2GO API key

### 3. Get Your SMTP2GO API Key

1. Log in to your SMTP2GO account at https://app.smtp2go.com
2. Navigate to **Settings** → **API Keys**
3. Create a new API key or copy an existing one
4. Add it to your Netlify environment variables

### 4. Deploy to Netlify

#### Option A: Deploy via Git
1. Push this repository to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Netlify will automatically detect the `netlify.toml` configuration
4. Add your environment variables in Netlify dashboard
5. Deploy!

#### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 5. Testing the Contact Form

Once deployed, test the contact form by:
1. Visiting your site
2. Filling out the contact form
3. Submitting it
4. Check info@bridgemarkdevelopment.com for the email

## Contact Form Email Format

The contact form sends a beautifully formatted HTML email with:
- Professional table layout
- All form fields (name, email, phone, subject, message)
- Newsletter signup status
- Timestamp
- Responsive design

## Files Structure

```
bridgemark/
├── netlify/
│   └── functions/
│       └── contact-form.js      # Netlify function for handling contact form
├── assets/
│   └── js/
│       └── custom.js            # Updated to use Netlify function
├── index.html                    # Updated with form ID
├── netlify.toml                  # Netlify configuration
├── package.json                  # Dependencies
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore file
└── README.md                     # This file
```

## How It Works

1. User fills out the contact form on the website
2. JavaScript in `custom.js` captures the form submission
3. Form data is sent to `/.netlify/functions/contact-form`
4. The Netlify function validates the data
5. Email is formatted as an HTML table
6. Email is sent via SMTP2GO API to info@bridgemarkdevelopment.com
7. User receives confirmation message

## Troubleshooting

### Email not sending?
- Check that your SMTP2GO API key is correctly set in Netlify environment variables
- Check Netlify function logs: **Site dashboard** → **Functions** → **contact-form**
- Verify your SMTP2GO account has credits/is active

### Form not submitting?
- Open browser console (F12) to check for JavaScript errors
- Verify the form fields have the correct IDs matching `custom.js`

## Support

For issues or questions about the website, contact the development team.
