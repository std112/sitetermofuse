// Replace with your Imgur Client ID
const CLIENT_ID = '1c5a3e547a4b0c8';  // Replace this with your actual Imgur Client ID

// Get elements
const checkbox = document.getElementById('termsCheckbox');
const agreeButton = document.getElementById('agreeButton');
const submitButton = document.getElementById('submitButton');
const steamProfileInput = document.getElementById('steamProfile');
const messageInput = document.getElementById('userMessage');
const attachmentInput = document.getElementById('attachment');

// Enable the agree button when the checkbox is checked
checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
        agreeButton.disabled = false;
        agreeButton.classList.add('enabled'); // Make the button appear clickable
    } else {
        agreeButton.disabled = true;
        agreeButton.classList.remove('enabled');
    }
});

// Show the form after agreeing to terms
function showForm() {
    document.querySelector('h1').style.display = 'none';
    document.querySelector('p').style.display = 'none';
    document.querySelector('.checkbox-container').style.display = 'none';
    agreeButton.style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
}

// Enable submit button when all fields are filled (attachment is not required)
[steamProfileInput, messageInput].forEach(field => {
    field.addEventListener('input', checkSubmitButton);
});

function checkSubmitButton() {
    if (steamProfileInput.value && messageInput.value) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Submit the form and send data to Discord webhook
async function submitForm() {
    const steamProfile = steamProfileInput.value;
    const message = messageInput.value;
    const attachment = attachmentInput.files[0];
    
    // Show loading spinner
    document.getElementById('loading').style.display = 'flex';

    let attachmentUrl = '';

    if (attachment) {
        attachmentUrl = await uploadToImgur(attachment);
    }

    // Prepare data to send to Discord webhook
    const data = {
        content: `**Steam Profile Link:** ${steamProfile}\n**Message:** ${message}\n**Attachment:** ${attachmentUrl ? attachmentUrl : 'No attachment'}`
    };

    // Send the data to the Discord webhook
    fetch('https://discord.com/api/webhooks/1355139657972715520/tmJHPjgDe-S1XORoAS3meDfxFr9FnneFZp7xGj07IbeRJDhovKxUVAifRzBhISr4sTzJ', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        // Hide the loading spinner once submission is done
        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            // After submission, replace content with the new message
            document.querySelector('h1').style.display = 'none';
            document.querySelector('p').style.display = 'none';
            document.querySelector('.checkbox-container').style.display = 'none';
            document.querySelector('.agree-button').style.display = 'none';
            document.querySelector('.form-section').style.display = 'none';
            
            // Create a new element to display the success message
            const successMessage = document.createElement('h2');
            successMessage.innerText = "WAIT FOR THE SUPPORT TO ADD YOU THRU STEAM";
            successMessage.style.color = "#f74843"; // You can change the color if needed
            document.querySelector('.container').appendChild(successMessage);
        } else {
            alert('Failed to submit the form.');
        }
    }).catch(error => {
        // Hide the loading spinner in case of error
        document.getElementById('loading').style.display = 'none';
        alert('An error occurred. Please try again.');
    });
}

// Function to upload image to Imgur
async function uploadToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': `Client-ID ${CLIENT_ID}`
        },
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        return data.data.link; // This is the image URL you need
    } else {
        alert('Failed to upload image to Imgur');
        return '';
    }
}
