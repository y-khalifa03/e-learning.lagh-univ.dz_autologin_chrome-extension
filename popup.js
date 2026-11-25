document.addEventListener('DOMContentLoaded', function() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved credentials when popup opens
  chrome.storage.local.get(['username', 'password'], function(result) {
    if (result.username) usernameInput.value = result.username;
    if (result.password) passwordInput.value = result.password;
  });

  // Save credentials when button is clicked
  saveBtn.addEventListener('click', function() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      statusDiv.style.color = '#dc3545';
      statusDiv.textContent = 'Please fill in both fields.';
      return;
    }

    chrome.storage.local.set({ username: username, password: password }, function() {
      statusDiv.style.color = '#28a745';
      statusDiv.textContent = 'Credentials saved successfully!';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 2500);
    });
  });
});
