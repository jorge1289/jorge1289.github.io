function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // Hide the content
    }

    // Remove "active" class from all tab links
    tablinks = document.querySelectorAll(".nav-tabs a");
    tablinks.forEach(function(link) {
        link.classList.remove("active"); // Remove active class
    });

    // Show the current tab, and add "active" class to the button that opened it
    document.getElementById(tabName).style.display = "block"; // Show the current tab
    evt.currentTarget.classList.add("active"); // Add active class to the clicked tab
}