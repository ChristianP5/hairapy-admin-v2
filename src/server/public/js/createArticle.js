document.addEventListener('DOMContentLoaded', async () => {
    
    await isValidLogin();
    
    const submitButton = document.getElementById('input-submit');
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        /*
            1) Get Form Data
            2) Send Create Article Request
        */
        // 1) 
        const form = document.getElementById('create-article-form');
        const formData = new FormData(form);

        // 2)
        const targetEndpoint = `${window.env.BASE_URL}/api/articles`;

        const result = await fetch(targetEndpoint, {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${accessToken}`,
            },
            body: formData,
        })

        const data = await result.json();

        // Is Token Expired?
        if(!result.ok){
            alert(data.message);
            localStorage.clear();
            window.location.href = '../login.html';
        }

        if(data.status === 'success'){
            alert(data.message);
            window.location.href = '../articles.html';
        }

    })

    // LOGOUT BUTTON
    const logoutButton = document.getElementById('log-out-button');
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();

        await logout();
    })

})