const logout = async () => {
    
    const refreshToken = localStorage.getItem('refreshToken');

    const targetEndpoint = `${window.env.BASE_URL}/api/logout`;
    const body = JSON.stringify({
        refreshToken: refreshToken,
    })

    const result = await fetch(targetEndpoint, {
        method: 'DELETE',
        headers: {
            'Authorization' : `Bearer ${accessToken}`,
            'Content-Type' : 'application/json',
        },
        body: body
    })

    const data = await result.json();
    
    alert(data.message);

    if(result.ok){
        localStorage.clear();
        window.location.href = '../login.html';
    }
    
} 