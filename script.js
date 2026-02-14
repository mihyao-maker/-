// 图片点击放大交互
function setupImageZoom(selector) {
  const overlay = document.getElementById('img-zoom-overlay');
  const preview = document.getElementById('img-zoom-preview');
  let closing = false;
  if (!overlay || !preview) return;

  // 绑定所有目标图片
  document.querySelectorAll(selector).forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', e => {
      if (closing) return;
      preview.src = img.src;
      overlay.style.display = 'flex';
      // 强制reflow以触发动画
      void overlay.offsetWidth;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // 关闭逻辑
  function closeZoom() {
    if (closing) return;
    closing = true;
    overlay.classList.remove('active');
    overlay.classList.add('closing');
    setTimeout(() => {
      overlay.classList.remove('closing');
      overlay.style.display = 'none';
      preview.src = '';
      document.body.style.overflow = '';
      closing = false;
    }, 450);
  }
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target === preview) closeZoom();
  });
  // ESC关闭
  document.addEventListener('keydown', e => {
    if (overlay.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) closeZoom();
  });
}

// 启用：仅为hobby-back图片和头像添加放大
document.addEventListener('DOMContentLoaded', () => {
  setupImageZoom('.hobby-back img, .avatar');
});
// 交互式爱好卡片
document.addEventListener('DOMContentLoaded', () => {
  const hobbyList = document.getElementById('hobby-list');
  if (hobbyList) {
    hobbyList.addEventListener('click', e => {
      let li = e.target;
      while (li && !li.classList.contains('hobby-item')) li = li.parentElement;
      if (!li) return;
      // 互斥展开
      hobbyList.querySelectorAll('.hobby-item.active').forEach(item => {
        if (item !== li) item.classList.remove('active');
      });
      li.classList.toggle('active');
    });
  }
});
// 页面淡入动画
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');

  // Intersection Observer 渐入
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.main-title, .subtitle, .desc, .glass-card, .avatar-wrap, .cta-btn').forEach(el => {
    el.classList.add('fade-section');
    observer.observe(el);
  });
});

// 头像 hover 效果由 CSS 控制
// CTA 按钮 hover 光晕
const ctaBtn = document.querySelector('.cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('mouseenter', () => {
    ctaBtn.classList.add('cta-glow');
  });
  ctaBtn.addEventListener('mouseleave', () => {
    ctaBtn.classList.remove('cta-glow');
  });
}

// 视差背景效果
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
const body = document.body;
function animateParallax() {
  targetX += (mouseX - targetX) * 0.08;
  targetY += (mouseY - targetY) * 0.08;
  body.style.backgroundPosition = `${50 + targetX * 2}% ${50 + targetY * 2}%`;
  requestAnimationFrame(animateParallax);
}
body.addEventListener('mousemove', e => {
  const w = window.innerWidth, h = window.innerHeight;
  mouseX = (e.clientX / w - 0.5) * 1.2; // -0.6 ~ 0.6
  mouseY = (e.clientY / h - 0.5) * 1.2;
});
animateParallax();
