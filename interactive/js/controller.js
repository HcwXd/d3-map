let isShowing = false;
let isMousedown = false;

const controller_btn = document.querySelector('.controller_btn');
const controller_wrap = document.querySelector('.controller_wrap');
const time_slider = document.querySelector('.time_slider');

controller_btn.addEventListener('click', () => {
  if (isShowing) {
    controller_btn.style.opacity = 1;
    controller_wrap.style.opacity = 0;
    controller_wrap.style.transform = 'translateY(0%)';
  } else {
    controller_wrap.style.opacity = 1;
    controller_wrap.style.transform = 'translateY(calc( -100% - 15px )';
  }
  isShowing = !isShowing;
});

document.querySelector('.reset_wrap').addEventListener('click', () => {
  scaleFactor = 250;
  redraw();
});
document.querySelector('.stop_wrap').addEventListener('click', () => {
  isRepeat = false;
  redraw();
});
document.querySelector('.projection_wrap').addEventListener('click', () => {
  projectionType = projectionType === 'equirectangular' ? 'orthographic' : 'equirectangular';
  redraw();
});

time_slider.addEventListener('change', updateMapBySlider);
time_slider.addEventListener('mousemove', updateMapBySlider);
time_slider.addEventListener('mousedown', () => (isMousedown = true));
time_slider.addEventListener('mouseup', () => (isMousedown = false));

function updateMapBySlider() {
  if (isMousedown) {
    generateDataset();
    redraw();
  }
}
