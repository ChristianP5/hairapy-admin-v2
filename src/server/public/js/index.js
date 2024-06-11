document.addEventListener('DOMContentLoaded', () => {
    console.log('HTML Document Loaded!');

    //select all with the nav-option class and store it in navOptions
    const navOptions = document.querySelectorAll('.nav-option');

    // Retrieve the active option from localStorage
    const activeOptionId = localStorage.getItem('activeOptionId');

    // Apply the active state to the stored option
    if (activeOptionId) {
        const activeOption = document.querySelector(`#${activeOptionId}`);
        if (activeOption) {
            setActiveState(activeOption);
        }
    }

    navOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Save the clicked option's ID to localStorage
            localStorage.setItem('activeOptionId', this.id);
            
            // Set the active state
            setActiveState(this);
        });
    });

    function setActiveState(element) {
        // Remove 'active' class from all nav options and reset icons
        navOptions.forEach(opt => {
            opt.classList.remove('active');
            const icon = opt.querySelector('.nav-icon img');
            if (icon) {
                const inactiveSrc = icon.src.replace('_white', '_brown');
                icon.src = inactiveSrc;
            }
        });

        // Add 'active' class to clicked nav option
        element.classList.add('active');

        // Change icon image source based on active state
        const icon = element.querySelector('.nav-icon img');
        if (icon) {
            const activeSrc = icon.src.replace('_brown', '_white');
            icon.src = activeSrc;
        }

        // Add 'active' class to parent <li> element
        const liElement = element.closest('li');
        if (liElement) {
            liElement.classList.add('active');
        }
    }
});
