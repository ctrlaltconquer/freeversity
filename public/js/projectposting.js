document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('image-upload');
    const sampleImage = document.getElementById('sample-image');

    input.addEventListener('change', function (e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                sampleImage.style.backgroundImage = `url('${reader.result}')`;
                document.getElementById("custom-upload-button").innerHTML="";
            };
            reader.readAsDataURL(file);
        } else {
                sampleImage.style.backgroundImage = "none";
                document.getElementById("custom-upload-button").innerHTML="Choose Image";
        }
    });
});

// Trigger file input when custom button is clicked
document.getElementById('custom-upload-button').addEventListener('click', function() {
    document.getElementById('image-upload').click();
  });





  document.addEventListener('DOMContentLoaded', function() {
    // Select all step image upload inputs and their respective containers for displaying the image preview
    var stepImageInputs = document.querySelectorAll('.image-upload-step');
    var imagePreviewContainers = document.querySelectorAll('.sample-image-step');
    
    // Add event listener to each step image upload input
    stepImageInputs.forEach(function(stepImageInput, index) {
        stepImageInput.addEventListener('change', function() {
            // Debugging: Check if file input field is correctly selected and file is being selected
            console.log("File selected:", stepImageInput.files[0]);
            
            // Get the selected file
            var file = stepImageInput.files[0];
            
            // Get the corresponding image preview container for this input
            var imagePreviewContainer = imagePreviewContainers[index];
            
            // Check if a file is selected
            if (file) {
                // Debugging: Check if FileReader object is created
                console.log("FileReader object created.");
                
                // Create a FileReader object
                var reader = new FileReader();
                
                // Set up the FileReader onload event handler
                reader.onload = function() {
                    // Debugging: Check if Data URL is correctly generated
                    console.log("Data URL:", reader.result);
                    
                    // Set the background of the image preview container to the selected image
                    imagePreviewContainer.style.backgroundImage = "url('" + reader.result + "')";
                };
                
                // Read the selected file as a Data URL
                reader.readAsDataURL(file);
            } else {
                // If no file is selected, clear the background of the image preview container
                imagePreviewContainer.style.backgroundImage = "none";
            }
        });
    });

    // Debugging: Check if event listener is added correctly
    console.log("Event listener added to step image upload inputs.");

    // Debugging: Check if image preview containers are selected correctly
    console.log("Image preview containers selected:", imagePreviewContainers);
});



  


    // add steps container
    document.addEventListener('DOMContentLoaded', function() {
        var addButton = document.querySelector('.add-steps');
        var projectSteps = document.getElementById('project-steps');
        var stepCount = 0; // Initialize step count
    
        addButton.addEventListener('click', function() {
            stepCount++; // Increment step count
            var newStep = document.createElement('div');
            newStep.className = 'steps';

            var htmlCode = `
    <h3>Step ${stepCount}</h3>
    <textarea class="myTextarea" placeholder="Code or text" name="step${stepCount}" cols="50"></textarea>

    <div class="sample-image-step">
        <input type="file" class="image-upload-step" name="imageofstep${stepCount}" accept="image/*">
        <a class="custom-step-button">Choose Image</a>
    </div>
`;


            newStep.innerHTML = htmlCode;
            projectSteps.appendChild(newStep);


            // Attach event listener for the new step's image upload input
            var stepImageInput = newStep.querySelector('.image-upload-step');
            var customStepUploadButton = newStep.querySelector('.custom-step-button');

            customStepUploadButton.addEventListener('click', function() {
                stepImageInput.click();
            });

            stepImageInput.addEventListener('change', function() {
                var file = stepImageInput.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function() {
                        var sampleImageStep = newStep.querySelector('.sample-image-step');
                        sampleImageStep.style.backgroundImage = `url(${reader.result})`;
                        var customStepButtons= document.getElementsByClassName("custom-step-button");
                        for (var i = 0; i < customStepButtons.length; i++) {
                            customStepButtons[i].innerHTML = "";
                        }
                    };
                    reader.readAsDataURL(file);
                }
            
        });
    });
})