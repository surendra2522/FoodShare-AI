import supabase from '../backend/config/supabaseClient.js';

async function checkUser() {
    const email = 'jangilisurendra25@gmail.com';
    const { data, error } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('email', email)
        .maybeSingle();

    if (error) {
        console.error('Error fetching user:', error);
    } else if (data) {
        console.log('User found:', data);
    } else {
        console.log('User NOT found. You might need to register.');
    }
}

checkUser();
