
let generateImageForm = document.getElementById("generate-image-form");

let formInput = document.getElementById("input-valur");

let imageContainerText = document.getElementById("imageContainerText");

let imageGenerated = document.getElementById("generated-image");

let imageContainer = document.getElementById("images-visible");


async function fetchImages(category) {

    try {

        imageContainer.style.display = "block";

        imageContainerText.innerText = "Generating your image...";

        imageGenerated.style.display = "none";

        let response = await fetch("/generate-image", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                category: category
            })

        });

        let responseText = await response.text();

        console.log("Server response:", responseText);
        console.log("Status code:", response.status);

        let result;

        try {
            result = JSON.parse(responseText);
        }

        catch (error) {

            throw new Error(
                `Backend returned an invalid response: ${responseText}`
            );

        }
        if (!response.ok) {

            throw new Error(
                result.error || "Image generation failed"
            );

        }

        imageGenerated.src =
            `data:${result.mimeType};base64,${result.image}`;

        imageGenerated.onload = () => {

            imageGenerated.style.display = "block";

            imageContainerText.innerText =
                "Below is your generated image:";

        };

        imageGenerated.onerror = () => {

            imageContainerText.innerText =
                "Unable to display the generated image.";

        };

    }

    catch (error) {

        console.error("Image generation error:", error);

        imageContainerText.innerText =
            "Error: " + error.message;

    }

}


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
