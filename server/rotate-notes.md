Security & credential rotation notes
=================================

This project previously contained secrets committed to `server/.env`. Follow these steps immediately:

1. Rotate credentials in the services:
   - MongoDB: create a new DB user/password via Atlas or your Mongo provider and update `MONGODB_URI`.
   - Braintree: generate new API keys in the Braintree dashboard and replace the old ones.
   - Any other keys (Stripe, SendGrid): rotate as needed.

2. Remove the old secrets from the repo history if you want to permanently purge them. You can use BFG Repo Cleaner or git filter-repo. Example with BFG (run locally):

   bfg --delete-files server/.env

   Then follow BFG cleanup steps to rewrite history and push force.

3. Add secrets to your host's secret manager (Render, Railway, Heroku, GitHub Actions secrets) instead of committing.

4. Verify webhooks after rotating keys (update webhook keys/URLs in Braintree dashboard).
