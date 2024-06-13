let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

// If already Logged In
const checkRefreshToken = async() => {
if(refreshToken){
    const targetEndpoint = `${window.env.BASE_URL}/api/token`
    const body = JSON.stringify({
        refreshToken: refreshToken
    })

    const result = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${accessToken}`,
            'Content-Type' : 'application/json'
        },
        body: body,
    })

    if(result.ok){
        // Valid refreshToken
        window.location.href = 'index.html';
    }else{
        // Invalid refreshToken
        localStorage.clear();
        window.location.href = 'login.html';
    }
}
};

checkRefreshToken();

document.addEventListener("DOMContentLoaded", async () => {
    const submitButton = document.getElementById('input-submit');
    

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Make Submit Button Unclickable
        submitButton.value = 'Checking';
        submitButton.setAttribute('class', 'login-box login-pressed');
        submitButton.toggleAttribute('disabled');

        const targetEndpoint = `${window.env.BASE_URL}/api/login`;
        
        const username = document.getElementById('input-username').value;
        const password = document.getElementById('input-password').value;

        console.log(username);
        console.log(password);

        const body = JSON.stringify({
            username: username,
            password: password,
        })

        const result = await fetch(targetEndpoint, {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${accessToken}`,
                'Content-Type' : 'application/json',
            },
            body: body
        });

        const data = await result.json();

        // Validate reCaptcha on Client-side
        const captchaResponse = grecaptcha.getResponse();
        
        if(!captchaResponse.length > 0){
            alert('Please Fill in the Captcha');
            window.location.href = '../login.html';
            throw new Error('Captcha not done!');
        }

        // Validate reCaptcha on Server-side
        const captchaTargetEndpoint = '/captcha';
        const captchaBody = JSON.stringify({
            response: captchaResponse,
        });

        const captchaResult = await fetch(captchaTargetEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: captchaBody
        })

        const captchaData = await captchaResult.json();

        if(!captchaResult.ok){
            console.log(captchaData);
            window.location.href = '../login.html';
            throw new Error();
        }

        if(captchaData.status !== 'success'){
            alert('Invalid reCaptcha');
            window.location.href = '../login.html';
            throw new Error('Captcha not done!');
        }
        
        if(result.ok){
            accessToken = data.data.accessToken;
            let refreshToken = data.data.refreshToken;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            window.location.href = '../index.html';
        }else{
            alert(data.message);
            window.location.href = '../login.html';
        }
    })
// For HAIRAPY Text
const hairapy = document.getElementById('hairapy-admin-title');

    /*
    const upsizeInterval = setInterval(() => {
        hairapy.style.transform = "scale(1.05)";
        hairapy.style.transition = "transform 2s ease-in-out";
      
        setTimeout(() => {
          hairapy.style.transform = "scale(1)";
          hairapy.style.transition = "transform 2s ease-in-out";
        }, 2000);
      }, 4000);
    */

const targetText = ['hairapy.dev', 'HAIRAPY', 'Are you the Admin?'];

let i = 0;
let x;
const max_time = 500;
let velocity = max_time/targetText[i].length;
let increment;

let typeTimeout;
let eraseInterval;
let typeInterval;

let mainInterval = setInterval(() => {
    x = 0
    increment = 1;

 typeInterval = setInterval(() => {
    x += increment;
    hairapy.textContent = targetText[i].substring(0, x);

    if (x === targetText[i].length) {
      clearInterval(typeInterval); // Stop typing interval
      increment = -1;

    typeTimeout = setTimeout(() => { // Delay before starting to erase
         eraseInterval = setInterval(() => {
          x += increment;
          hairapy.textContent = targetText[i].substring(0, x);

          if (x <= 0) { // When the text is fully erased
            x = 0;
            clearInterval(eraseInterval); // Stop erasing interval
            i = (i + 1) % targetText.length; // Move to the next text
            velocity = max_time/targetText[i].length;
          }
        }, velocity);
      }, 2000); // Delay of 1 second before starting to erase
    }
  }, velocity);
}, 3200); // Adjust this interval if needed to synchronize with typing/erasing


document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        clearInterval(mainInterval);
        clearTimeout(typeTimeout);
        clearInterval(eraseInterval);
        clearInterval(typeInterval);


    } else if (document.visibilityState === 'visible') {
        // For HAIRAPY Text
        const hairapy = document.getElementById('hairapy-admin-title');

        /*
        const upsizeInterval = setInterval(() => {
            hairapy.style.transform = "scale(1.05)";
            hairapy.style.transition = "transform 2s ease-in-out";
        
            setTimeout(() => {
            hairapy.style.transform = "scale(1)";
            hairapy.style.transition = "transform 2s ease-in-out";
            }, 2000);
        }, 4000);
        */

        mainInterval = setInterval(() => {
            x = x
            increment = 1;

            console.log('working...');

            typeInterval = setInterval(() => {
                x += increment;
                hairapy.textContent = targetText[i].substring(0, x);

                if (x >= targetText[i].length) {
                    x = targetText[i].length;
                    clearInterval(typeInterval); // Stop typing interval
                    increment = -1;

                    typeTimeout = setTimeout(() => { // Delay before starting to erase
                        eraseInterval = setInterval(() => {
                            x += increment;
                            hairapy.textContent = targetText[i].substring(0, x);

                            if (x <= 0) { // When the text is fully erased
                                x = 0;
                                clearInterval(eraseInterval); // Stop erasing interval
                                i = (i + 1) % targetText.length; // Move to the next text
                                velocity = max_time/targetText[i].length;
                            }
                        }, velocity);
                    }, 2000); // Delay of 1 second before starting to erase
                }
            }, velocity);
        }, 3200); // Adjust this interval if needed to synchronize with typing/erasing

    }
  });


})