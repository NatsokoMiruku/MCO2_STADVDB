import axios from 'axios';

(async () => {
    try {
        const response = await axios.post('http://localhost:3000/transactions/perform', {
            node: 'central',
            action: 'insert',
            data: { AppID: 101, Name: 'Test Game' },
        });
        console.log('Concurrency Test:', response.data);
    } catch (error) {
        console.error('Concurrency Test Failed:', error.message);
    }
})();
