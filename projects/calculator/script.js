const display=document.getElementById("display");

function append(value){

display.value+=value;

}

function clearDisplay(){

display.value="";

}

function deleteLast(){

display.value=display.value.slice(0,-1);

}

let lastResult = "";

function calculate(){

    try{

        lastResult = eval(display.value);
        display.value = lastResult;

    }

    catch{

        display.value = "Error";

    }

}

function sqrt(){

display.value=Math.sqrt(eval(display.value));

}

function square(){

display.value=Math.pow(eval(display.value),2);

}

function power(){

display.value+="**";

}

function percentage(){

display.value=eval(display.value)/100;

}

function sin(){

display.value=Math.sin(eval(display.value)*Math.PI/180);

}

function cos(){

display.value=Math.cos(eval(display.value)*Math.PI/180);

}

function tan(){

display.value=Math.tan(eval(display.value)*Math.PI/180);

}

function log(){

display.value=Math.log10(eval(display.value));

}
function getCurrentCalculation(){
    return display.value;
}
