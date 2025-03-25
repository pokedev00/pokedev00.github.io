// Function to generate random Player ID
function generatePlayerID() {
    let id = "";
    for (let i = 0; i < 4; i++) {
        id += Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
        if (i < 3) id += "-"; // Add hyphen between sections
    }
    return id;
}

// Set the Player ID when the page loads
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("player-id").textContent = generatePlayerID();
});