document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Show the first tab content by default
    tabContents[0].classList.add('active');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');

            tabLinks.forEach(link => link.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Remove this line as it's causing an error
            // document.getElementById('tab-content').scrollIntoView({behavior: 'smooth'});
        });
    });

    // This part is not necessary for the tab functionality
    // const toggleButton = document.getElementById('toggle');
    // const nav = document.getElementById('nav');

    // toggleButton.addEventListener('click', function() {
    //     nav.classList.toggle('active');
    // });
});