import React, { useEffect, useState } from "react";
import playSvg from './assets/PlayIcon.svg';
import tagSvg from './assets/TagNavigator.svg'
const WheelComponent = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor,
  contrastColor,
  buttonText,
  isOnlyOnce,
  textColor
}) => {
  let currentSegment = "";
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  const size = 290;
  let canvasContext = null;
  let maxSpeed = Math.PI / `${segments.length}`;
  const upTime = segments.length * 100;
  const downTime = segments.length * 1000;
  let spinStart = 0;
  let frames = 0;
  const centerX = 350;
  const centerY = 350;
  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);
  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById("canvas");
    if (navigator.appVersion.indexOf("MSIE") !== -1) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", 1000);
      canvas.setAttribute("height", 600);
      canvas.setAttribute("id", "canvas");
      document.getElementById("wheel").appendChild(canvas);
    }
    canvas.addEventListener("click", spin, false);
    canvasContext = canvas.getContext("2d");
  };
  const spin = () => {
    isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      // maxSpeed = Math.PI / ((segments.length * 2) + Math.random())
      maxSpeed = Math.PI / segments.length;
      frames = 0;
      timerHandle = setInterval(onTimerTick, timerDelay);
    }
  };
  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta =
          maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }
    console.log("angleDelta: " + angleDelta)
    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key, lastAngle, angle) => {
    const ctx = canvasContext;
    const value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();

    // Create a linear gradient
    const gradient = ctx.createLinearGradient(centerX - size, centerY, centerX + size, centerY);
    gradient.addColorStop(0, segColors[key][0]); // Start color of the gradient
    gradient.addColorStop(1, segColors[key][1]); // End color of the gradient

    // Assign the gradient as fill style
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = segColors[key][0] === '#FFFFFF' ? 'black' : "white";
    ctx.font = "bold 16px Montserrat";
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor || "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "1em proxima-nova";
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = "#4459CC";
    // ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fill();

    //center circle text
    // ctx.font = "bold 1em Montserrat";
    // ctx.fillStyle = contrastColor || "white";
    // ctx.textAlign = "center";
    // ctx.fillText(buttonText || "Spin", centerX, centerY + 3);

    //center circle img
    // ctx.stroke();
    // const image = new Image();
    // image.src = playSvg;
    // image.onload = () => {
    //   ctx.drawImage(image, centerX - 42, centerY - 35, 80, 80);
    // };

    // Draw Semi outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = "#FDC350";
    ctx.stroke();

    //Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size + 15, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = 20;
    ctx.strokeStyle = "#1028A4";
    ctx.stroke();

  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    const change = angleCurrent + Math.PI;
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;
    if (i < 0) i = i + segments.length;
    currentSegment = segments[i];

    isFinished &&
      ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };

  const clear = () => {
    const ctx = canvasContext;
    ctx.clearRect(0, 0, 1000, 500);
  };
  return (
    <div style={{ position: 'relative' }}>
      <img
        src={tagSvg}
        alt="Tag"
        style={{
          position: 'absolute',
          left: -48,
          top: '48.5%',
          transform: 'translateY(-50%)'
        }}
      />
      <img
        src={playSvg}
        alt="Tag"
        style={{
          position: 'absolute',
          left: '45.5%',
          top: '50.5%',
          transform: 'translateY(-50%)'
        }}
      />
      <canvas
        id="canvas"
        width="700"
        height="700"
        style={{
          pointerEvents: isFinished && !isOnlyOnce ? "none" : "auto",

        }}
      />
    </div>
  );
};
export default WheelComponent;
