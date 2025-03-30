let search = document.getElementById("Search");
let input = document.getElementById("input");
let img1 = document.getElementById("picture1");
let img2 = document.getElementById("picture2");
let img3 = document.getElementById("picture3");
let img4 = document.getElementById("picture4");
let img5 = document.getElementById("picture5");
let token = "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";
const a = [img1, img2, img3, img4, img5];

document.addEventListener("DOMContentLoaded", () => {
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    async function load() {
        let userinput = input.value.trim();
        if (!userinput) {
            alert("Please enter a place to visit");
            return;
        } else {
            a.forEach((e) => {
                e.innerHTML = `<div class="loader"></div>`;
            });

            try {
                const prompts = [
                    `Famous tourist attractions in ${userinput}.`,
                    `Beautiful travel photos of ${userinput}.`,
                    `Scenic views and landmarks in ${userinput}.`,
                    `Top places to visit in ${userinput}.`,
                    `Stunning landscapes and cityscapes of ${userinput}.`,
                ];

                const imagePromises = prompts.map(async (prompt, index) => {
                    const response = await fetch(
                        "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            method: "POST",
                            body: JSON.stringify({ inputs: prompt }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }

                    const data = await response.blob();
                    const imgURL = URL.createObjectURL(data);
                    return { imgURL, index };
                });

                const images = await Promise.all(imagePromises);

                images.forEach(({ imgURL, index }) => {
                    a[index].innerHTML = `<img src="${imgURL}" width="200px" alt="Generated Image" style="margin: 5px; padding:3px;" >`;
                });
            } catch (error) {
                console.error("Error fetching images:", error);
                a.forEach((e) => {
                    e.innerHTML = `<p style="color: red; text-align: center; font-size: 10px; font-weight: 400;">Failed to fetch images.</p>`;
                });
            }
        }
    }

    search.addEventListener("click", debounce(load, 200));

    let style = document.createElement("style");
    style.innerHTML = `
        .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
