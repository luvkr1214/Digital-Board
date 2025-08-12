document.addEventListener("DOMContentLoaded", () => {
  const sendMessageButton = document.querySelector('.send-message-box .chat-btn');
  const messageInput = document.getElementById('tutor-message');
  const messageDisplay = document.getElementById('student-messages');
  const scrollToLastBtn = document.getElementById('scroll-to-latest');

  let pinnedMessage = null;
  let pinnedMessageId = null;

  // Create chat message
  function createMessageElement(content, sender) {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.dataset.msgId = messageId;
    messageElement.innerHTML = `
      <strong>${sender}:</strong> ${content}
      <button class="pin-btn" title="Pin Message"><i class="fa-solid fa-thumbtack"></i></button>
    `;

    const pinButton = messageElement.querySelector('.pin-btn');
    pinButton.addEventListener('click', () => pinMessage(messageElement, content, sender, messageId));

    return messageElement;
  }

  // Handle send button click
  sendMessageButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
      const messageElement = createMessageElement(messageText, 'Tutor'); // Replace 'Tutor' with actual name if needed
      messageDisplay.insertBefore(messageElement, scrollToLastBtn);
      messageInput.value = '';
      scrollToBottom();
    }
  });

  // Send on Enter key
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageButton.click();
    }
  });

  // Pin or unpin message
  function pinMessage(messageElement, content, sender, messageId) {
    if (pinnedMessageId === messageId) {
      pinnedMessage?.remove();
      pinnedMessage = null;
      pinnedMessageId = null;
      return;
    }

    if (pinnedMessage) {
      pinnedMessage.remove();
    }

    pinnedMessage = document.createElement('div');
    pinnedMessage.classList.add('pinned-message');
    pinnedMessage.innerHTML = `
      <strong>${sender}:</strong> ${content}
      <button class="unpin-btn" title="Unpin Message"><i class="fa-solid fa-thumbtack-slash"></i></button>
    `;

    const unpinButton = pinnedMessage.querySelector('.unpin-btn');
    unpinButton.addEventListener('click', () => {
      pinnedMessage.remove();
      pinnedMessage = null;
      pinnedMessageId = null;
    });

    messageDisplay.prepend(pinnedMessage);
    pinnedMessageId = messageId;
  }

  // Auto scroll
  function scrollToBottom() {
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
  }

  // Show scroll-to-latest button when scrolled up
  messageDisplay.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = messageDisplay;
    scrollToLastBtn.style.display = scrollHeight - scrollTop > clientHeight + 30 ? 'block' : 'none';
  });

  scrollToLastBtn.addEventListener('click', () => {
    messageDisplay.scrollTo({
      top: messageDisplay.scrollHeight,
      behavior: 'smooth'
    });
  });
});


