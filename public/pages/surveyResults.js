document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('filterForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new URLSearchParams(new FormData(event.target)); // Encode form data
        console.log('Form data:', formData);

        try {
            const response = await fetch('/filterSurveyResults', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Set the correct Content-Type
                }
            });

            if (response.ok) {
                const updatedTableRowsHTML = await response.text();
                document.getElementById('surveyTableBody').innerHTML = updatedTableRowsHTML; // Update only the table rows
            } else {
                console.error('Server error:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/filterSurveyResults', {
            method: 'POST',
            body: '',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Set the correct Content-Type
            }
        }); // Add a new route for unfiltered data
        if (response.ok) {
            const initialTableRowsHTML = await response.text();
            document.getElementById('surveyTableBody').innerHTML = initialTableRowsHTML;
        } else {
            console.error('Server error:', response.status);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
});
