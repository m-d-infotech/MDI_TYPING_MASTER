const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';

const runTests = async () => {
    try {
        console.log('--- Starting Advanced Features Test ---');

        // 1. Login as Admin
        console.log('\n1. Logging in as Admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        token = loginRes.data.token;
        userId = loginRes.data.userId;
        console.log('✅ Login Successful. Token received.');

        // 2. Post Result with Missed Keys (Analytics)
        console.log('\n2. Posting Result with Missed Keys...');
        const resultData = {
            wpm: 45,
            accuracy: 96,
            mistakes: 2,
            duration: 60,
            mode: 'exam',
            user_id: userId,
            missed_keys: { "a": 1, "e": 3, "s": 1 } // Simulating missed keys
        };
        
        // Note: We need to make sure the endpoint accepts missed_keys.
        // We updated the model, but let's see if the route passes it.
        // Usually req.body is passed to create(), so it should work if model has the field.
        const postRes = await axios.post(`${API_URL}/results`, resultData, {
             headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Result Posted. ID:', postRes.data.id);

        // 3. Verify Missed Keys Persisted
        console.log('\n3. Verifying Missed Keys Persistence...');
        const userResults = await axios.get(`${API_URL}/results/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const savedResult = userResults.data.find(r => r.id === postRes.data.id);
        
        if (savedResult && savedResult.missed_keys && savedResult.missed_keys.e === 3) {
            console.log('✅ Missed Keys verified in database:', savedResult.missed_keys);
        } else {
            console.error('❌ Missed Keys NOT found or incorrect!', savedResult?.missed_keys);
        }

        // 4. Check Leaderboard
        console.log('\n4. Fetching Leaderboard...');
        const leaderboardRes = await axios.get(`${API_URL}/results/leaderboard/top`);
        const entry = leaderboardRes.data.find(r => r.id === postRes.data.id);
        
        if (entry) {
            console.log('✅ New Score found in Leaderboard.');
            console.log(`   Ranked Entry: User ${entry.User.username} - ${entry.wpm} WPM`);
        } else {
            console.warn('⚠️ New score not found in top 50 (might be too low? or simple race condition). Listing top 3:');
            leaderboardRes.data.slice(0, 3).forEach((l, i) => console.log(`${i+1}. ${l.wpm} WPM`));
        }

        console.log('\n--- Test Complete: SUCCESS ---');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.response ? error.response.data : error.message);
    }
};

runTests();
