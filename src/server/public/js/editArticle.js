let article;
const articleId = localStorage.getItem('articleId');


const checkArticleId = async () => {

    await isValidLogin();
    
    // Is Article Id Valid?
    if(!articleId){
        localStorage.removeItem('articleId');
        window.location.href = '../articles.html';
    }

    const checkTargetEndpoint = `${window.env.BASE_URL}/api/articles/${articleId}`;

    const checkResult = await fetch(checkTargetEndpoint, {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${accessToken}`,
        }
    })

    const checkData = await checkResult.json();

    if(!checkResult.ok){
        localStorage.removeItem('articleId');
        window.location.href = '../articles.html';
    }

    article = checkData.data.article;

}

document.addEventListener('DOMContentLoaded', async () => {

    await checkArticleId();

    // Load Article
    const title_em = document.getElementById('input-title');
    const content_em = document.getElementById('input-content');
    const prev_image_em = document.getElementById('prev-image');
    
    title_em.value = article.title;
    content_em.textContent = article.content;
    prev_image_em.setAttribute('src', article.image_url);

    const form = document.getElementById('edit-article-form');
    const submitButton = document.getElementById('input-submit');
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const targetEndpoint = `${window.env.BASE_URL}/api/articles/${articleId}`;

        const formData = new FormData(form);

        const result = await fetch(targetEndpoint, {
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${accessToken}`,
            },
            body: formData,
        })

        const data = await result.json();

        if(result.ok){
            alert(data.message);
            window.location.href = '../articles.html';
        }else{
            alert(data.message);
        }

    })

    // LOGOUT BUTTON
    const logoutButton = document.getElementById('log-out-button');
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();

        await logout();
    })

})