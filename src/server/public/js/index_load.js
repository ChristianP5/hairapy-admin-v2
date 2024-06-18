
document.addEventListener('DOMContentLoaded', async () => {
    
    await isValidLogin();

    const getAllPredictions = async () => {
        /*
            1) Get All Predictions
            2) Display Number of Predictions on Document
        */
        
        // 1)
        const predsEndpoint = `${window.env.BASE_URL}/api/predicts`;
        const predsResult = await fetch(predsEndpoint, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${accessToken}`,
            }
        })

        const predsData = await predsResult.json();

        // Did token Expire?
        if(!predsResult.ok){
            alert(predsData.message);
            localStorage.clear();
            window.location.href = '../login.html';
        }
        

        let preds = predsData.data.predictions;

        /* 
            Filter the Predictions
            Because only the Newer Predictions has ID
        */
        preds = preds.filter(pred => pred.id); 

        // 2)
        const predsCount = preds.length;

        const preds_count_em = document.getElementById('predictions-num');
        preds_count_em.textContent = predsCount;
    }

    getAllPredictions();
    

    const getAllArticles = async () => {
        /*
            1) Get All Articles
            2) Display Number of Articles on Document
        */

        // 1)
        const articlesTargetEndpoint = `${window.env.BASE_URL}/api/articles`;
        const articlesResult = await fetch(articlesTargetEndpoint, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${accessToken}`,
            }
        })

        const articlesData = await articlesResult.json();

        // Did token Expire?
        
        if(!articlesResult.ok){
            alert(articlesData.message);
            localStorage.clear();
            window.location.href = '../login.html';
        }
        

        let articles = articlesData.data.articles;
        articles = articles.filter(article => article.id);

        // 2)
        const articlesCount = articles.length;
        const articles_count_em = document.getElementById('articles-num');
        articles_count_em.textContent = articlesCount;
    }

    getAllArticles();

    const getAllUsers = async () => {
        /*
            1) Get All Articles
            2) Display Number of Articles on Document
        */

       // 1)
        const usersTargetEnpoint = `${window.env.BASE_URL}/api/users`;
        const usersResult = await fetch(usersTargetEnpoint, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${accessToken}`,
            }
        })

        const usersData = await usersResult.json();

        console.log(usersData);

        // Did token Expire?
        if(!usersResult.ok){
            alert(usersData.message);
            localStorage.clear();
            window.location.href = '../login.html';
        }

        let users = usersData.data.users;
        users = users.filter(user => user.id);
        // 2)

        const usersCount = users.length;
        

        const users_count_em = document.getElementById('users-num');
        users_count_em.textContent = usersCount;

        const dashboard_boxes_em = document.querySelector('.boxes');
        dashboard_boxes_em.style.opacity = 1;
        dashboard_boxes_em.style.transform = "translateY(0px)";

    }
    getAllUsers();
    
    // LOGOUT BUTTON
    const logoutButton = document.getElementById('log-out-button');
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();

        await logout();
    })

    const loadCronLogs = async () => {

        const svgWidth = 700;
        const svgHeight = 250;
        const margin = { top: 20, left: 30, bottom: 40, right: 40};

        const svg = d3.select('#cron-deletion-graph')
        .append('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const logsResult = await fetch("/logs", {
            method: 'GET',
        })

        const logsData = await logsResult.json();

        
        const logs = logsData.data.logs;

        /*
            logs = [
                {
                    date: "2024-06-15T17:00:05.168Z",
                    value: {integer}
                }
            ]
        */

        // Parse the Dates and Values to acceptable format
        const parseDate = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
        
        logs.forEach(log => {
            log.date = parseDate(log.date);
            log.value = +log.value;
        })

        const x = d3.scaleUtc()
        .domain(d3.extent(logs, log => log.date))
        .range([0, svgWidth - margin.left - margin.right]);

        svg.append("g")
        .attr("transform", `translate(0, ${svgHeight - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
        .domain([0, d3.max(logs, log => log.value)])
        .nice()
        .range([svgHeight - margin.bottom - margin.top, 0]);

        svg.append("g")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(y));

        svg.append("path")
        .datum(logs)
        .attr("class", "line")
        .attr("d", d3.line().x( log => x(log.date) ).y( log => y(log.value) ));

        const logs_em = document.getElementById('logs-section');
        logs_em.style.opacity = 1;
        logs_em.style.transform = "translateY(0)";
        
    }
    loadCronLogs();

})