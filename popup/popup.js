const saveButton = document.getElementById('save-tab');
const clearButton = document.getElementById('clear-tabs');
const tabList = document.getElementById('tab-list');

document.addEventListener('DOMContentLoaded', () => {
  loadTabs();
});

saveButton.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    chrome.storage.local.get('savedTabs', (data) => {
      const tabs = data.savedTabs || [];
      tabs.push(tab.url);
      chrome.storage.local.set({ savedTabs: tabs }, () => {
        loadTabs();
      });
    });
  }
});

clearButton.addEventListener('click', () => {
  chrome.storage.local.remove('savedTabs', () => {
    loadTabs();
  });
});

function loadTabs() {
  chrome.storage.local.get('savedTabs', (data) => {
    tabList.innerHTML = '';

    if (data.savedTabs && data.savedTabs.length > 0) {
      data.savedTabs.forEach((url, index) => {
        const li = document.createElement('li');

        const a = document.createElement('a');
        a.href = url;
        a.textContent = url;
        a.target = '_blank';

        const delBtn = document.createElement('button');
        delBtn.textContent = '✖';
        delBtn.className = 'delete-btn';
        delBtn.addEventListener('click', () => {
          removeTab(index);
        });

        li.appendChild(a);
        li.appendChild(delBtn);
        tabList.appendChild(li);
      });
    }
  });
}

function removeTab(index) {
  chrome.storage.local.get('savedTabs', (data) => {
    const tabs = data.savedTabs || [];
    tabs.splice(index, 1);
    chrome.storage.local.set({ savedTabs: tabs }, () => {
      loadTabs();
    });
  });
}
