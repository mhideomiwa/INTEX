// Styles for the dropdown menu
const navbarStyles = `
<style>
    /* Dropdown styles */
    .dropdown {
        position: relative;
        display: inline-block;
        z-index: 999; /* Adjust the value as needed */
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 120px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content a:hover {
        background-color: #f1f1f1;
    }
</style>`;

// Navigation bar for guest users
const guestnavbar = `
<header>
    <div>
        <a href="/"><h1>Provo SMU MH</h1></a>
    </div>
    <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/survey">Survey</a>
        <a href="/resources">Resources</a>
        <div class="login">
            <a class="login-button" href="login">Login</a>
        </div>
    </nav>
</header>`;

// Navigation bar for admin users
const adminnavbar = `
${navbarStyles}
<header>
    <div>
        <a href="/"><h1>Provo SMU MH</h1></a>
    </div>
    <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/survey">Survey</a>
        <a href="/resources">Resources</a> 
        <a href="/surveyResults">Survey Results</a>
        <a href="/users">Users</a>
        <div class="dropdown">
            <a href="#" class="login-button">My Profile</a>
            <div class="dropdown-content">
                <a href="/logout">Logout</a>
                <a href="/viewProfile">View Profile</a>
            </div>
        </div>
    </nav>
</header>`;

// Navigation bar for employee users
const employeenavbar = `
${navbarStyles}
<header>
    <div>
        <a href="/"><h1>Provo SMU MH</h1></a>
    </div>
    <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/survey">Survey</a>
        <a href="/resources">Resources</a> 
        <a href="/surveyResults">Survey Results</a>
        <div class="dropdown">
            <a href="#" class="login-button">My Profile</a>
            <div class="dropdown-content">
                <a href="/logout">Logout</a>
                <a href="/viewProfile">View Profile</a>
            </div>
        </div>
    </nav>
</header>`;

// Navigation bar for user users
const usernavbar = `
${navbarStyles}
<header>
    <div>
        <a href="/"><h1>Provo SMU MH</h1></a>
    </div>
    <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/survey">Survey</a>
        <a href="/resources">Resources</a> 
        <div class="dropdown">
            <a href="#" class="login-button">My Profile</a>
            <div class="dropdown-content">
                <a href="/logout">Logout</a>
                <a href="/viewProfile">View Profile</a>
            </div>
        </div>
    </nav>
</header>`;

// Exporting all navigation bars
module.exports = { guestnavbar, usernavbar, adminnavbar, employeenavbar };
