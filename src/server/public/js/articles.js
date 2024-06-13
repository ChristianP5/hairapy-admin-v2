localStorage.removeItem('articleId');
document.addEventListener('DOMContentLoaded', async () => {
    
    await isValidLogin();
    
    const targetEndpoint = `${window.env.BASE_URL}/api/articles`;
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

    let articles = data.data.articles;
    articles = articles.filter(article => article.id);

    const articles_list_em = document.getElementById('articles-list');

    articles.forEach(article => {
        const item = document.createElement('div');
        item.setAttribute('class', 'articles-box');

        let date = article.createdAt;
        date = date.replace("T", " ").replace("Z", " ");


        let title = article.title;
        const title_limit = 20;
        if(title.length > title_limit){
            title = title.substring(0, title_limit);
            title = title + ' ...';
        }

        let content = article.content;
        const content_limit = 50;
        if(content.length > content_limit){
            content = content.substring(0, content_limit);
            content = content + ' ...';
        }

        item.innerHTML = 
        `
              <div class ="image-box"> 
                <img class = "article-img" src = "${article.image_url}"> 
              </div>
                  <div class ="article-details">
                    <p class = "article-title">${title}</p>
                    <p class = "article-content">${content}</p>
                    <p class = "article-date"><br>Date: ${date}</p>
                </div>
                <div class="article-buttons">
                  <a href="${article.id}" class = "edit-button">
                      Edit
                  </a>
                  <a href="${article.id}" class = "delete-button">
                    Delete
                  </a>
                </div>
        `;

        articles_list_em.appendChild(item);
        articles_list_em.style.opacity = 1;
        articles_list_em.style.transform = "translateY(0px)";
    })

    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', async (event) => {
            event.preventDefault();

            const articleId = editButton.getAttribute('href');
            
            localStorage.setItem('articleId', articleId);
            window.location.href = '../editArticle.html';
            
        })
    })

    // DELETE BUTTONS
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();

            const articleId = deleteButton.getAttribute('href');

            const targetEndpoint = `${window.env.BASE_URL}/api/articles/${articleId}`;
            const result = await fetch(targetEndpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${accessToken}`,
                }
            })

            const data = await result.json();

            alert(data.message);
            if(result.ok){
                window.location.href = '../articles.html';
            }
        })
    })

    // LOGOUT BUTTON
    const logoutButton = document.getElementById('log-out-button');
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();

        await logout();
    })

})