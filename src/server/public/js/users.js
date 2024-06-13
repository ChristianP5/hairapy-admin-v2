document.addEventListener('DOMContentLoaded', async () => {
    
    await isValidLogin();
    
    const targetEndpoint = `${window.env.BASE_URL}/api/users`;
    const result = await fetch(targetEndpoint, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${accessToken}`,
        }
    })

    const data = await result.json();

    // Is Token Expired?
    if(!result.ok){
        alert(data.message);
        localStorage.clear();
        window.location.href = '../login.html';
    }

    let users = data.data.users;
    users = users.filter(user => user.id);

    const users_table_em = document.getElementById('users-table-list');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('class', 'text-center');

        let date = user.createdAt;
        date = date.replace("T", " ").replace("Z", " ");

        row.innerHTML = 
        `
            <td>${user.username}</td>
            <td>${date}</td>
        `;

        users_table_em.appendChild(row);
        users_table_em.style.opacity = 1;
        users_table_em.style.transform = "translateY(0px)";
    })

    // LOGOUT BUTTON
    const logoutButton = document.getElementById('log-out-button');
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();

        await logout();
    })

})