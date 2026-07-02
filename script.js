const track = document.getElementById('track');
let maxX = () => Math.max(0, track.scrollWidth - window.innerWidth);
let x = 0, target = 0;
let dragging = false, startX = 0, startTarget = 0;

function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }
function update(){
  x += (target - x) * 0.12;
  track.style.transform = `translate3d(${-x}px,0,0)`;
  requestAnimationFrame(update);
}
update();

window.addEventListener('wheel', e => {
  e.preventDefault();
  target = clamp(target + e.deltaY + e.deltaX, 0, maxX());
}, {passive:false});

window.addEventListener('pointerdown', e => {
  if (e.target.closest && (e.target.closest('.video-wrap') || e.target.closest('.sequence-hit') || e.target.closest('.sequence6-hit') || e.target.closest('.sequence7-hit'))) return;
  dragging = true;
  document.body.classList.add('dragging');
  startX = e.clientX;
  startTarget = target;
});
window.addEventListener('pointermove', e => {
  if(!dragging) return;
  target = clamp(startTarget - (e.clientX - startX), 0, maxX());
});
window.addEventListener('pointerup', () => {
  dragging = false;
  document.body.classList.remove('dragging');
  const snap = Math.round(target / window.innerWidth) * window.innerWidth;
  target = clamp(snap, 0, maxX());
});
window.addEventListener('resize', () => { target = clamp(target, 0, maxX()); });


// 3페이지: 가방에 마우스 오버했을 때만 굿즈가 팡 하고 등장
const giftPanel = document.getElementById('giftPanel');
const bag = giftPanel?.querySelector('.bag');
if (giftPanel && bag) {
  bag.addEventListener('pointerenter', () => giftPanel.classList.add('bag-active'));
  bag.addEventListener('pointerleave', () => giftPanel.classList.remove('bag-active'));
}


// 추가 SVG 페이지: 텍스트 영역 클릭 시 5-1 → 5-2 → 5-3 → 5-1 순환 전환
const sequenceImage = document.getElementById('sequenceImage');
const sequenceHit = document.getElementById('sequenceHit');
const sequenceSources = ['assets/click-1.svg', 'assets/click-2.svg', 'assets/click-3.svg'];
let sequenceIndex = 0;
if (sequenceImage && sequenceHit) {
  sequenceHit.addEventListener('click', (e) => {
    e.stopPropagation();
    sequenceIndex = (sequenceIndex + 1) % sequenceSources.length;
    sequenceImage.classList.remove('is-changing');
    void sequenceImage.offsetWidth;
    sequenceImage.src = sequenceSources[sequenceIndex];
    sequenceImage.classList.add('is-changing');
  });
}




// 두 번째 추가 SVG 페이지: 텍스트 영역 클릭 시 6-1 → 6-2 → 6-3 → 6-4 → 6-1 순환 전환
const sequence6Image = document.getElementById('sequence6Image');
const sequence6Hit = document.getElementById('sequence6Hit');
const sequence6Sources = ['assets/step6-1.svg', 'assets/step6-2.svg', 'assets/step6-3.svg', 'assets/step6-4.svg'];
let sequence6Index = 0;
if (sequence6Image && sequence6Hit) {
  sequence6Hit.addEventListener('click', (e) => {
    e.stopPropagation();
    sequence6Index = (sequence6Index + 1) % sequence6Sources.length;
    sequence6Image.classList.remove('is-changing');
    void sequence6Image.offsetWidth;
    sequence6Image.src = sequence6Sources[sequence6Index];
    sequence6Image.classList.add('is-changing');
  });
}


// 세 번째 추가 SVG 페이지: 텍스트 영역 클릭 시 7-1 → 7-2 → 7-3 → 7-1 순환 전환
const sequence7Image = document.getElementById('sequence7Image');
const sequence7Hit = document.getElementById('sequence7Hit');
const sequence7Sources = ['assets/step7-1.svg', 'assets/step7-2.svg', 'assets/step7-3.svg'];
let sequence7Index = 0;
if (sequence7Image && sequence7Hit) {
  sequence7Hit.addEventListener('click', (e) => {
    e.stopPropagation();
    sequence7Index = (sequence7Index + 1) % sequence7Sources.length;
    sequence7Image.classList.remove('is-changing');
    void sequence7Image.offsetWidth;
    sequence7Image.src = sequence7Sources[sequence7Index];
    sequence7Image.classList.add('is-changing');
  });
}

// 8페이지: 재생 버튼 클릭 시 영상 재생
const videoWrap = document.querySelector('.video-wrap');
const finalVideo = document.querySelector('.final-video');
const playButton = document.querySelector('.play-button');
if (videoWrap && finalVideo && playButton) {
  playButton.addEventListener('click', (e) => {
    e.stopPropagation();
    finalVideo.setAttribute('controls', 'controls');
    finalVideo.play();
  });
  finalVideo.addEventListener('play', () => videoWrap.classList.add('is-playing'));
  finalVideo.addEventListener('pause', () => videoWrap.classList.remove('is-playing'));
  finalVideo.addEventListener('ended', () => videoWrap.classList.remove('is-playing'));
}

// 캐릭터 소개 페이지에서만 마우스 옆에 얼굴 이미지가 따라다님
const characterPanel = document.querySelector('.character-panel');
if (characterPanel) {
  const cursorFace = document.createElement('img');
  cursorFace.src = 'assets/mouse.png';
  cursorFace.alt = '';
  cursorFace.className = 'cursor-face-follower';
  cursorFace.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursorFace);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let faceX = mouseX;
  let faceY = mouseY;
  let hasMouse = false;

  const isCharacterPageActive = () => {
    const panelIndex = Array.from(track.children).indexOf(characterPanel);
    if (panelIndex < 0) return false;
    const currentIndex = Math.round(x / window.innerWidth);
    return currentIndex === panelIndex;
  };

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX + 24;
    mouseY = e.clientY + 24;
    hasMouse = true;
  });

  window.addEventListener('pointerleave', () => {
    hasMouse = false;
    cursorFace.classList.remove('is-visible');
  });

  function animateCursorFace() {
    const visible = hasMouse && isCharacterPageActive();
    cursorFace.classList.toggle('is-visible', visible);

    faceX += (mouseX - faceX) * 0.16;
    faceY += (mouseY - faceY) * 0.16;
    cursorFace.style.transform = `translate3d(${faceX}px, ${faceY}px, 0)`;

    requestAnimationFrame(animateCursorFace);
  }
  animateCursorFace();
}
