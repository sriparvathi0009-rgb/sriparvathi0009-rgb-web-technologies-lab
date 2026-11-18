const API_KEY = "";

document.getElementById("askAI").addEventListener("click", askAI);

async function askAI() {

    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if(question===""){
        answer.innerHTML="Please enter a question.";
        return;
    }

    answer.innerHTML="Thinking...";

    try{

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                contents:[
                    {
                        parts:[
                            {
                                text:question
                            }
                        ]
                    }
                ]

            })

        });

        const data = await response.json();

        if(data.candidates){

            answer.innerHTML =
            data.candidates[0].content.parts[0].text;

        }
        else{

            answer.innerHTML="No response.";

        }

    }

    catch(error){

        answer.innerHTML="Error connecting to AI.";

        console.log(error);

    }

}