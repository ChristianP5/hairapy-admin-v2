document.addEventListener('DOMContentLoaded', async () =>  {
    const result = await fetch('/services', {
        method: 'GET',
    })

    const data = await result.json();

    console.log(data);

    let baseService = '';
    let authService = '';

    try{
        baseService = data.data.servicesStatus.baseService;
        authService = data.data.servicesStatus.authService;
    }catch(error){
        console.error(data.message);
    }
    

    const uptimeIcons = document.querySelectorAll('.uptime-icon>div');
    
    if(baseService){
        uptimeIcons[0].style.backgroundColor = "rgb(0, 255, 0)";
    }else{
        uptimeIcons[0].style.backgroundColor = "red";
    }

    if(authService){
        uptimeIcons[1].style.backgroundColor = "rgb(0, 255, 0)";
    }else{
        uptimeIcons[1].style.backgroundColor = "red";
    }

})