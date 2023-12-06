const guestnavbar = `<header>
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
    </header>`


const adminnavbar = `
<style>
        /* Dropdown styles */
        .dropdown {
            position: relative;
            display: inline-block;
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
    </style>

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
        <!-- dropdown that -->
        <div class="dropdown">
            <a href="#" class="login-button">My Profile</a>
            <div class="dropdown-content">
                <a href="/logout">Logout</a>
                <a href="/viewProfile">View Profile</a>
            </div>
        </div>
    </nav>
    </header>`

const employeenavbar = `
<style>
        /* Dropdown styles */
        .dropdown {
            position: relative;
            display: inline-block;
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
    </style>

<header>
    <div>
        <a href="/"><h1>Provo SMU MH</h1></a>
    </div>
    <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/survey">Survey</a>
        <a href="/resources">Resources</a> 
        <!--            dropdown that -->
        <div class="dropdown">
            <a href="#" class="login-button">My Profile</a>
            <div class="dropdown-content">
                <a href="/logout">Logout</a>
                <a href="/viewProfile">View Profile</a>
            </div>
        </div>
    </nav>
</header>`

const usernavbar = `
<style>
        /* Dropdown styles */
        .dropdown {
            position: relative;
            display: inline-block;
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
    </style>

<header>
    <div>
        <a href="/"><h1>Provo SMU MH</h1></a>
    </div>
    <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/survey">Survey</a>
        <a href="/resources">Resources</a> 
        <!--            dropdown that -->
        <div class="dropdown">
            <a href="#" class="login-button">My Profile</a>
            <div class="dropdown-content">
                <a href="/logout">Logout</a>
                <a href="/viewProfile">View Profile</a>
            </div>
        </div>
    </nav>
    </header>`

module.exports = {guestnavbar, usernavbar, adminnavbar, employeenavbar}