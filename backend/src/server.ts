import app from './app';
import dotenv from 'dotenv';
import { verifyEmailConnection } from './services/email.service';
dotenv.config();
verifyEmailConnection().catch((error) => {
  console.log('⚠️ Email service is disabled for now');
  console.log('You can still use the app without email functionality');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
