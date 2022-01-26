import React from 'react';
import '../components/NewDiv.css';

let beginX = 0;
let beginY = 0;
let endX = 0;
let endY = 0;

function mouseDown(e) {
  beginX = e.pageX;
  beginY = e.pageY;
}

function mouseUp(e) {
  document.querySelector(".div-selected").classList.remove("selected");
  endX = e.pageX;
  endY = e.pageY;
  var x = document.createElement("div");
  let width = endX - beginX;
  let height = endY - beginY;
  x.style.top = beginY + "px"; 
  x.style.left = beginX + "px";
  x.style.position = 'absolute';
  x.style.width = width + "px";
  x.style.height = height + "px";
  x.style.border = "1px solid black";
  document.body.appendChild(x);
}

function NewDiv() {
  return (
    <div className="NewDiv">
      <header className="App-header">
        <p>
          Div для рисования divов
        </p>
      </header>
      <div className="div-selected" onMouseDown={mouseDown} onMouseUp={mouseUp}></div>
    </div>
  );
}

export default NewDiv;
