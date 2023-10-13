document.addEventListener("mousemove", function (event) {
  const existingDots = document.querySelectorAll(".dot");
  
  
  if (existingDots.length >= 8) {
    const oldDot = existingDots[0];
    oldDot.parentNode.removeChild(oldDot);
  }

  const dot = document.createElement("div");
  dot.className = "dot";
  dot.style.left = (event.pageX - 4) + "px";
  dot.style.top = (event.pageY - 4) + "px";
  document.body.appendChild(dot);
});
