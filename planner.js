let API_KEY = "AIzaSyDSDahGazX-5HIeE7bhnr22_bLelmeOjsY";
const MODEL_NAME = "gemini-2.0-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
let btn = document.querySelector(".button");

let response = document.querySelector(".response");
let action = document.querySelector(".immediate_action");

async function planTrip(){
    action.innerText = "Generating a travel plan..."

    let destination = document.querySelector(".destination").value;
    let startDate = document.querySelector(".StartDate").value;
    let endDate = document.querySelector(".EndDate").value;

    const data = {
        contents: [{
          parts: [{
            text: `Generate a structured travel itinerary for ${destination} from ${startDate} to ${endDate}. Do not ask any questions—just 
                    provide a day-by-day breakdown.
                    Format the response strictly as a list. Put the br tags and new line tag as well:
                    
                    <br/>Day 01 (${startDate}): <br/>
                    Morning: [Activity] <br/>
                    Early Afternoon: [Activity]<br/>
                    Late Afternoon: [Activity]<br/>
                    Evening: [Activity]<br/>
                    Night: [Activity]<br/>
                    Continue this format for each day until ${endDate}. Use <strong> for day headings and time slots to make them stand out. 
                    Keep it concise and well-structured for display in a webpage paragraph using document.querySelector(".response").innerHTML. 
                    Do not add extra text—only return the formatted itinerary in list format. Do not start by writing html`,
          }],
        }],
      };

    try{
        let response = await fetch (url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data),
        })

        let result = await response.json();

        if (result.candidates && result.candidates.length >0){
            console.log(result.candidates[0].content.parts[0].text);
            let responseParagraph = document.querySelector('.response'); 
            if (responseParagraph) {
            responseParagraph.innerHTML = result.candidates[0].content.parts[0].text; 
            console.log(result.candidates[0].content.parts[0].text);
            } else {
            console.error("Paragraph element with class 'response' not found.");
            }
            console.log("Finished reponse");
        }
        else{
            response.innerText = "Could not generate a travel plan at the moment. Please try again!";
        }
    }

    catch(error){
        console.log(error);
        response.innerText = "Error fetching travel plan. Check your internet connection.";
    }

    action.innerText = ""

}

btn.addEventListener("click",planTrip); 



