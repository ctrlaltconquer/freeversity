document.addEventListener("DOMContentLoaded", function() {
    const dropButtonIcon = document.querySelector('.drop-button-icon');
    const search = document.querySelector('.search');
    const items = document.querySelector('.items');
    let isSearchVisible = false;
    let isItemsVisible = false;

    dropButtonIcon.addEventListener('click', function() {
        if (window.innerWidth <= 800) {
            isSearchVisible = !isSearchVisible;
            if (isSearchVisible) {
                search.style.display = 'flex';
                search.style.animation = 'searchVisible 0.5s ease forwards';
            } else {
                search.style.display = 'flex';
                search.style.animation = 'searchInVisible 0.5s ease forwards';
            }
        }

        if (window.innerWidth <= 550) {
            isItemsVisible = !isItemsVisible;
            var content = document.querySelector(".content");
            if (isItemsVisible) {
                items.style.display = 'flex';
                items.style.animation = 'searchVisible 0.5s ease forwards';
                content.style.animation = 'sectionMargin 0.5s ease forwards';
            } else {
                items.style.display = 'flex';
                items.style.animation = 'searchInVisible 0.5s ease forwards';
                content.style.animation = 'sectionMarginBack 0.5s ease forwards';
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.formgemini').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting traditionally
        
        const inputValue = document.getElementById("gemini").value;

        fetch('/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify({ something: inputValue }) // Convert to JSON string
        })
        .then(response => response.text())
        .then(data => {
            // Clear existing content
            document.getElementById('geminiDataContainer').innerHTML = '';

            // Format and display the Gemini data with typing effect
            typeWithIndentation(data);
        })
        .catch(error => console.error('Error:', error));
    });

    // Function to display text with typing effect and indentation
    function typeWithIndentation(text) {
        const container = document.getElementById('geminiDataContainer');
        let index = 0;
        const intervalId = setInterval(function() {
            // Check if the index is within the text length
            if (index < text.length) {
                // Add indentation for code display
                if (text[index] === '\n') {
                    container.innerHTML += '<br/>' + '&nbsp;'.repeat(7);
                } else {
                    container.innerHTML += text[index];
                }
                index++;
            } else {
                clearInterval(intervalId); // Stop the typing animation when done
            }
        }, 20); // Adjust the typing speed as needed
    }
});


document.getElementById('copyButton').addEventListener('click', function() {
    var geminiDataContainer = document.getElementById('geminiDataContainer');
    var range = document.createRange();
    range.selectNode(geminiDataContainer);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'Copied to clipboard' : 'Unable to copy';
        console.log(msg);
    } catch (err) {
        console.error('Failed to copy:', err);
    }

    window.getSelection().removeAllRanges();
});