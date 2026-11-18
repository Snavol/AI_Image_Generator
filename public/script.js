
let generateImageForm = document.getElementById("generate-image-form");

let formInput = document.getElementById("input-valur");

let imageContainerText = document.getElementById("imageContainerText");

let imageGenerated = document.getElementById("generated-image");

let imageContainer = document.getElementById("images-visible");


// Function to generate image
async function fetchImages(category) {

    try {

        imageContainer.style.display = "block";

        imageContainerText.innerText = "Generating your image...";

        imageGenerated.style.display = "none";

        // Send request to backend
        let response = await fetch("/generate-image", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                category: category
            })

        });

        let result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        // Set generated image
        imageGenerated.src =
            `data:${result.mimeType};base64,${result.image}`;

        imageGenerated.onload = () => {

            imageGenerated.style.display = "block";

            imageContainerText.innerText =
                "Below is your generated image:";

        };

    }

    catch (error) {

        console.log(error);

        imageContainerText.innerText =
            "Error: " + error.message;

    }

}


// Handle form submission
generateImageForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let enteredText = formInput.value.trim();

    if (enteredText !== "") {

        fetchImages(enteredText);

    }

    else {

        imageContainerText.innerText =
            "Input field cannot be empty!";

    }

});
