// Check if Valid Log In or Not
let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');
const isValidLogin = async () => {

if(!refreshToken || !accessToken){
    localStorage.clear();
    window.location.href = '../login.html';
}


const validateTargetEndpoint = `${window.env.BASE_URL}/api/token`
const validateBody = JSON.stringify({
    refreshToken: refreshToken,
})

const validateResult = fetch(validateTargetEndpoint, {
    method: 'POST',
    headers: {
        'Authorization' : `Bearer ${accessToken}`,
        'Content-Type' : 'application/json',
    },
    body: validateBody
})

validateResult.then(data => {
    if(!data.ok){
        // Invalid RefreshToken
        localStorage.clear();
        window.location.href = '../login.html';
    }
    return data.json();
}).then((data)=>{
    console.log(accessToken)
    accessToken = data.data.accessToken;
    console.log(accessToken)
    localStorage.setItem('accessToken', accessToken);
})
}
