document.addEventListener("DOMContentLoaded", () => {
  const professionalUpdateKeywords = [
    "new role",
    "new position",
    "excited to announce",
    "thrilled to join",
    "landed a role",
    "starting at",
    "accepted a position",
    "I’ll be joining",
    "have been selected",
    "starting a new position",
    "will be joining",
    "I’ve accepted a",
    "accepted an offer",
    "be joining",
  ];

  const savedTextList = document.getElementById("savedTextList");

  // Create the toggle container div
  const toggleContainer = document.createElement("div");
  toggleContainer.className = "toggle-container";

  // Create toggle button description
  const description = document.createElement("span");
  description.textContent = "Remove Job Posts";

  // Create toggle switch
  const toggleSwitchContainer = document.createElement("label");
  toggleSwitchContainer.className = "switch";

  const toggleSwitch = document.createElement("input");
  toggleSwitch.type = "checkbox";
  toggleSwitch.className = "toggle-checkbox";

  const toggleSlider = document.createElement("span");
  toggleSlider.className = "slider";

  toggleSwitchContainer.appendChild(toggleSwitch);
  toggleSwitchContainer.appendChild(toggleSlider);

  toggleContainer.appendChild(toggleSwitchContainer);
  toggleContainer.appendChild(description);

  document.body.insertBefore(toggleContainer, savedTextList);

  // Function to render saved texts
  function renderSavedTexts(savedTexts) {
    savedTextList.innerHTML = "";

    if (savedTexts.length > 0) {
      savedTexts.forEach((text, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "10px";
        deleteButton.style.backgroundColor = "#f44336";
        deleteButton.style.color = "#fff";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "3px 8px";
        deleteButton.style.borderRadius = "3px";
        deleteButton.style.cursor = "pointer";

        deleteButton.addEventListener("click", () => {
          savedTexts.splice(index, 1); // Remove text from array
          chrome.storage.local.set({ savedTexts }, () => {
            renderSavedTexts(savedTexts); // Re-render the list
          });
        });

        listItem.appendChild(deleteButton);
        savedTextList.appendChild(listItem);
      });
    } else {
      savedTextList.textContent = "No saved text found.";
    }
  }

  // Function to save professional update keywords to local storage
  function saveProfessionalUpdateKeywords() {
    chrome.storage.local.get("savedTexts", (result) => {
      const savedTexts = result.savedTexts || []; // Retrieve existing texts or default to an empty array

      // Add professional update keywords to savedTexts
      professionalUpdateKeywords.forEach((keyword) => {
        // Only add if not already present to avoid duplicates
        if (!savedTexts.includes(keyword)) {
          savedTexts.push(keyword);
        }
      });

      // Save the updated list back to local storage
      chrome.storage.local.set({ savedTexts }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error saving text to local storage:",
            chrome.runtime.lastError
          );
        } else {
          console.log(
            "Professional update keywords saved to local storage:",
            savedTexts
          );
        }
      });
    });
  }

  // Function to remove professional update keywords from local storage
  function removeProfessionalUpdateKeywords() {
    chrome.storage.local.get("savedTexts", (result) => {
      const savedTexts = result.savedTexts || []; // Retrieve existing texts or default to an empty array

      // Filter out the professional update keywords from savedTexts
      const updatedSavedTexts = savedTexts.filter(
        (text) =>
          !professionalUpdateKeywords.some((keyword) => text === keyword)
      );

      // Save the updated list back to local storage
      chrome.storage.local.set({ savedTexts: updatedSavedTexts }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error saving text to local storage:",
            chrome.runtime.lastError
          );
        } else {
          console.log(
            "Professional update keywords removed from local storage."
          );
        }
      });
    });
  }

  // Function to check and apply the toggle state on page load
  function checkAndApplyToggleState() {
    chrome.storage.local.get("toggleState", (result) => {
      const toggleState = result.toggleState ?? false; // Default to 'off' if not set
      toggleSwitch.checked = toggleState;

      if (toggleState) {
        // If toggle is on, save the professional update keywords
        saveProfessionalUpdateKeywords();
      } else {
        // If toggle is off, remove the professional update keywords
        removeProfessionalUpdateKeywords();
      }

      // Retrieve and render saved texts after toggle state check
      chrome.storage.local.get("savedTexts", (result) => {
        const savedTexts = result.savedTexts || [];
        renderSavedTexts(savedTexts); // Render saved texts when popup loads
      });
    });
  }

  // Event listener for toggle switch change
  toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
      saveProfessionalUpdateKeywords();
    } else {
      removeProfessionalUpdateKeywords();
    }

    // Update the saved texts in the popup after the toggle action
    chrome.storage.local.get("savedTexts", (result) => {
      const savedTexts = result.savedTexts || [];
      renderSavedTexts(savedTexts); // Re-render saved texts
    });

    // Store the toggle state
    chrome.storage.local.set({ toggleState: toggleSwitch.checked }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving toggle state:", chrome.runtime.lastError);
      }
    });
  });

  // Call the function to check and apply the toggle state on page load
  checkAndApplyToggleState();
});
