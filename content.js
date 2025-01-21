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

// Track the state of text selection
let hasSelection = false;

// mouseup is when user releases the mouse button after selecting text
document.addEventListener("mouseup", function () {
  const selection = window.getSelection();
  hasSelection = !selection.isCollapsed; // Update selection state

  if (hasSelection) {
    // User has selected some text
    const selectedText = selection.toString();

    // Get the bounding rectangle of the selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Check if the button already exists
    const existingButton = document.getElementById("save_text_button");

    if (!existingButton) {
      // Create a button element only if it doesn't exist
      const save_text_button = document.createElement("button");
      save_text_button.id = "save_text_button";
      save_text_button.textContent = "Save Text";
      save_text_button.style.position = "absolute";
      save_text_button.style.left = `${rect.left + window.scrollX}px`; // Position it relative to the page
      save_text_button.style.top = `${rect.bottom + window.scrollY + 5}px`; // Slightly below the selection
      save_text_button.style.backgroundColor = "#4CAF50"; // Green button
      save_text_button.style.color = "#fff";
      save_text_button.style.border = "none";
      save_text_button.style.padding = "5px 10px";
      save_text_button.style.cursor = "pointer";
      save_text_button.style.borderRadius = "5px";
      save_text_button.style.zIndex = 1000; // Ensure the button appears above other content

      // Append the button to the body
      document.body.appendChild(save_text_button);

      // Add event listener for the button click
      save_text_button.addEventListener("click", function (event) {
        event.stopPropagation();
        saveSelection(selectedText);
      });
    } else {
      // If the button exists, directly add the click event listener
      existingButton.addEventListener("click", function (event) {
        event.stopPropagation();
        saveSelection(selectedText);
      });
    }
  } else {
    // No selection, remove the button if it exists
    const button = document.getElementById("save_text_button");
    if (button) {
      button.remove();
    }
  }
});

function saveSelection(selectedText) {
  if (selectedText) {
    chrome.storage.local.get("savedTexts", (result) => {
      const savedTexts = result.savedTexts || []; // Retrieve existing texts or default to an empty array
      savedTexts.push(selectedText); // Add the new text to the array

      chrome.storage.local.set({ savedTexts }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error saving text to local storage:",
            chrome.runtime.lastError
          );
        } else {
          console.log("Text saved to local storage:", selectedText);

          // Remove the button after successful saving
          const button = document.getElementById("save_text_button");
          if (button) {
            button.remove();
          }
        }
      });
    });
  }
}

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

function removeProfessionalUpdateKeywords() {
  chrome.storage.local.get("savedTexts", (result) => {
    const savedTexts = result.savedTexts || []; // Retrieve existing texts or default to an empty array

    // Filter out the professional update keywords from savedTexts
    const updatedSavedTexts = savedTexts.filter(
      (text) => !professionalUpdateKeywords.includes(text)
    );

    // Save the updated list back to local storage
    chrome.storage.local.set({ savedTexts: updatedSavedTexts }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error saving text to local storage:",
          chrome.runtime.lastError
        );
      } else {
        console.log("Professional update keywords removed from local storage.");
      }
    });
  });
}
