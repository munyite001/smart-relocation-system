const axios = require('axios');

const submit = document.querySelector('.submit');

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const first_name = document.querySelector('#first_name').value;
    const last_name = document.querySelector('#last_name').value;
    const phone = document.querySelector('#phone').value;

    //  Send a POST request to the server
    try {
        const response = await axios.post('http://localhost:3000/app/client/signup', {
            email,
            password,
            first_name,
            last_name,
            phone
        });

        console.log(response.data);

        // Redirect to another page upon successful sign up
        if (response.status === 200) {
            window.location.href = '/client-login.html';
        }
    } catch (error) {
        console.error(error);
        // Handle error (e.g., show a message to the user)
    }
});