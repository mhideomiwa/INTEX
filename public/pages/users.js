function deleteUser(username) {
    if (confirm(`Are you sure you want to delete the user '${username}'?`)) {
        fetch(`/deleteUser/${username}`, {
            method: 'DELETE'
        }).then(() => {
            window.location.reload(); // Reload the page after successful deletion
        }).catch(error => {
            console.error('Error deleting user:', error);
            // Handle error, show a message, etc.
        });
    }
}
