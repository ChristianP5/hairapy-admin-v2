document.addEventListener('DOMContentLoaded', async () => {
    
    await isValidLogin();
    
    const targetEndpoint = `${window.env.BASE_URL}/api/predicts`;
    const result = await fetch(targetEndpoint, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${accessToken}`,
        }
    })

    const data = await result.json();

    // Is token Expired?
    if(!result.ok){
        alert(data.message);
        localStorage.clear();
        window.location.href = '../login.html';
    }

    let predictions = data.data.predictions;
    predictions = predictions.filter(pred => pred.id);
    predictions = predictions.filter(pred => pred.confidenceScore);

    const predictions_list_em = document.getElementById('predictions-list');
    
    let preds_array = [];
    predictions.forEach(pred => {
        const item = document.createElement('div');
        let date = pred.createdAt;
        date = date.replace("T", " ");
        date = date.replace("Z", " ");
        item.setAttribute('class', 'predictions-box');

        // Date values
        const [year, month, day] = date.split(" ")[0].split('-');
        let [hour, minute, second] = date.split(" ")[1].split(':');

        second = Math.floor(second);

        const score = 
        second
        + (minute * 60)
        + (hour * 60 * 60)
        + (day * 60 * 60 * 24)
        + (month * 60 * 60 * 24 * 31)
        + (year * 60 * 60 * 24 * 31 * 12);


        let confidenceScore = pred.confidenceScore;
        confidenceScore = Math.floor(confidenceScore);
        item.innerHTML = 
        `<div class="image-box">
            <img class="prediction-img" src="${pred.image}" />
        </div>
        <div class="prediction-details">
            <p class="prediction-result">Prediction: ${pred.result}</p>
            <p class="prediction-level">Confidence level: ${confidenceScore}%</p>
            <p class="prediction-date"><br />Date: ${date}</p>
        </div>`;

        // predictions_list_em.appendChild(item);
        preds_array.push({
            item : item,
            score : score,
        })

        predictions_list_em.style.opacity = 1;
        predictions_list_em.style.transform = "translateY(0px)";
    })


    // LOAD THE PREDICTIONS
    for(let i = 0; i < preds_array.length; i++){
        for(let x = i+1; x < preds_array.length; x++){
            if(preds_array[i].score < preds_array[x].score){
                let temp = preds_array[i];
                preds_array[i] = preds_array[x];
                preds_array[x] = temp;
            }
        }
    }

    preds_array.forEach(item => {
        predictions_list_em.append(item.item);
    })

    // LOGOUT BUTTON
    const logoutButton = document.getElementById('log-out-button');
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();

        await logout();
    })
    
})