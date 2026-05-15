import supabase from '../backend/config/supabaseClient.js';
import bcrypt from 'bcryptjs';

async function resetPassword() {
    const email = 'jangilisurendra25@gmail.com';
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { data, error } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('email', email)
        .select('id, email');

    if (error) {
        console.error('Error resetting password:', error);
    } else if (data && data.length > 0) {
        console.log('✅ Password successfully reset for:', data[0].email);
        console.log('New Password: password123');
    } else {
        console.log('User not found.');
    }
}

resetPassword();
