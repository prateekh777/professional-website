#!/bin/bash
# This script tests the SendGrid API with a direct curl request
# to verify that the API key has proper permissions
# Load environment variables from .env file
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
else
  echo "No .env.local file found. Make sure SENDGRID_API_KEY is set in your environment."
  exit 1
fi

# Check if API key is set
if [ -z "$SENDGRID_API_KEY" ]; then
  echo "SENDGRID_API_KEY is not set. Please check your .env.local file."
  exit 1
fi

# Get the API key prefix for logging (first 10 chars)
API_KEY_PREFIX=${SENDGRID_API_KEY:0:10}

# Default to verified sender or use a fallback
SENDER=${SENDGRID_VERIFIED_SENDER:-"prateek@edoflip.com"}

echo "Testing SendGrid API with exact curl format..."
echo "API Key starts with: $API_KEY_PREFIX..."
echo "Sender email: $SENDER"

# Create a temporary JSON file for the request body
cat > /tmp/sendgrid_test.json << EOF
{
  "personalizations": [
    {
      "to": [{"email": "prateek@edoflip.com"}],
      "subject": "SendGrid API Test"
    }
  ],
  "from": {"email": "$SENDER"},
  "content": [
    {
      "type": "text/plain",
      "value": "This is a test email sent directly via curl to verify SendGrid API key permissions."
    }
  ]
}
EOF

# Send the request
curl -s \
  --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data-binary @/tmp/sendgrid_test.json

# Clean up
rm /tmp/sendgrid_test.json

echo ""
echo "If you didn't see any error response above, the email was sent successfully." 