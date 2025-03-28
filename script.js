const CLIENT_ID = '1c5a3e547a4b0c8';

const checkbox = document.getElementById('termsCheckbox');
const agreeButton = document.getElementById('agreeButton');
const submitButton = document.getElementById('submitButton');
const steamProfileInput = document.getElementById('steamProfile');
const messageInput = document.getElementById('userMessage');
const attachmentInput = document.getElementById('attachment');

checkbox.addEventListener('change', function() {
    agreeButton.disabled = !checkbox.checked;
    agreeButton.classList.toggle('enabled', checkbox.checked);
});

function showForm() {
    document.querySelector('h1').style.display = 'none';
    document.querySelector('p').style.display = 'none';
    document.querySelector('.checkbox-container').style.display = 'none';
    agreeButton.style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
}

[steamProfileInput, messageInput].forEach(field => {
    field.addEventListener('input', checkSubmitButton);
});

function checkSubmitButton() {
    submitButton.disabled = !(steamProfileInput.value && messageInput.value);
}

async function submitForm() {
    const steamProfile = steamProfileInput.value;
    const message = messageInput.value;
    const attachment = attachmentInput.files[0];

    document.getElementById('loading').style.display = 'flex';

    let attachmentUrl = '';
    if (attachment) {
        attachmentUrl = await uploadToImgur(attachment);
    }

    const data = {
        content: `**Steam Profile Link:** ${steamProfile}\n**Message:** ${message}\n**Attachment:** ${attachmentUrl || 'No attachment'}`
    };

    fetch('YOUR_DISCORD_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        document.getElementById('loading').style.display = 'none';
        alert('Submitted successfully');
    }).catch(() => {
        document.getElementById('loading').style.display = 'none';
        alert('Submission failed');
    });
}

async function uploadToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: { 'Authorization': `Client-ID ${CLIENT_ID}` },
        body: formData
    });

    const data = await response.json();
    return data.success ? data.data.link : '';
}
