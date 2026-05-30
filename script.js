// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when link clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const roles = [
  "Web Developer 💻",
  "App Developer 📱",
  "UI/UX Designer 🎨",
  "AI/ML Enthusiast 🤖"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentRole = roles[roleIndex];
  
  if (isDeleting) {
    typingText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    setTimeout(() => isDeleting = true, 1500);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 5px 30px rgba(0,0,0,0.15)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
  }
});

// Initialize EmailJS
(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: "bYmidY7zKx_wVkPZj",
    });
  }
})();

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Change button state to sending
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner spin-anim"></i>';
    
    // Send form via EmailJS
    emailjs.sendForm('service_dleyenr', 'template_l3p583k', contactForm)
      .then(() => {
        alert('Thank you for your message! I will get back to you soon. 🚀');
        contactForm.reset();
      }, (error) => {
        console.error('EmailJS Error:', error);
        alert('Oops... Something went wrong. Please try again later.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
  });
}

// ==========================================
// CODING DASHBOARD LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  generateGithubCalendar();
  initLeetcodeProgress();
  initRecruiterConsole();
});

// 1. Dashboard Tab Selection
function initDashboardTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active to current button
      btn.classList.add('active');

      // Hide all panels
      tabPanels.forEach(p => p.classList.remove('active'));
      // Show matching panel
      const targetPanel = document.getElementById(btn.dataset.tab);
      if (targetPanel) {
        targetPanel.classList.add('active');
        
        // Re-trigger LeetCode ring animation if LeetCode is selected
        if (btn.dataset.tab === 'leetcode') {
          animateLeetcodeCircle();
        }
      }
    });
  });
}

// 2. Generate GitHub Calendar
function generateGithubCalendar() {
  const calendarGrid = document.getElementById('github-calendar');
  const tooltip = document.getElementById('calendar-tooltip');
  if (!calendarGrid) return;

  calendarGrid.innerHTML = ''; // Clear container

  const totalWeeks = 53;
  const daysInWeek = 7;
  const totalDays = totalWeeks * daysInWeek;

  // Calculate start date (53 weeks ago, adjusted to Sunday)
  const today = new Date();
  const startDay = new Date();
  startDay.setDate(today.getDate() - totalDays);
  
  // Align start date to the nearest preceding Sunday
  const startDayOfWeek = startDay.getDay();
  startDay.setDate(startDay.getDate() - startDayOfWeek);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Seeded random for consistent activity pattern
  let seed = 31; // Seed for Jagadeesh-31
  function random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // Iterate daily to build calendar cells
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDay);
    currentDate.setDate(startDay.getDate() + i);

    const cell = document.createElement('div');
    cell.classList.add('calendar-cell');

    // Generate contribution levels (lvl-0 to lvl-4)
    // Create activity clusters (realistic weekday commits and breaks)
    const dayOfWeek = currentDate.getDay();
    let isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let baseChance = isWeekend ? 0.25 : 0.65;
    
    // Periodically increase/decrease activity to simulate sprints/exams
    const weekNum = Math.floor(i / 7);
    const sprintFactor = Math.sin(weekNum / 4) * 0.4 + 0.6; // oscillates between 0.2 and 1.0
    
    let contributions = 0;
    if (random() < baseChance * sprintFactor) {
      const randVal = random();
      if (randVal < 0.5) contributions = Math.floor(random() * 2) + 1; // 1-2 commits
      else if (randVal < 0.85) contributions = Math.floor(random() * 3) + 3; // 3-5 commits
      else contributions = Math.floor(random() * 6) + 6; // 6-11 commits
    }

    // Future dates should have 0 contributions
    if (currentDate > today) {
      contributions = 0;
    }

    // Assign classes based on contributions count
    let levelClass = 'lvl-0';
    if (contributions > 0) {
      if (contributions <= 2) levelClass = 'lvl-1';
      else if (contributions <= 4) levelClass = 'lvl-2';
      else if (contributions <= 7) levelClass = 'lvl-3';
      else levelClass = 'lvl-4';
    }

    cell.classList.add(levelClass);
    
    // Formatting date string
    const dateString = currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const commitWord = contributions === 1 ? 'contribution' : 'contributions';
    const tooltipText = `${contributions} ${commitWord} on ${dateString}`;
    
    // Tooltip event listeners
    cell.addEventListener('mouseenter', () => {
      tooltip.textContent = tooltipText;
      tooltip.style.borderColor = 'var(--primary)';
      tooltip.style.background = 'rgba(0, 212, 255, 0.05)';
    });

    cell.addEventListener('mouseleave', () => {
      tooltip.textContent = 'Hover over a square to see activity';
      tooltip.style.borderColor = '#dcdcdc';
      tooltip.style.background = '#f1f1f1';
    });

    calendarGrid.appendChild(cell);
  }

  // Handle Drag to Scroll on calendar-scroll-container
  const slider = document.querySelector('.calendar-scroll-container');
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    slider.scrollLeft = scrollLeft - walk;
  });
  
  // Auto scroll to the end (most recent dates)
  setTimeout(() => {
    slider.scrollLeft = slider.scrollWidth;
  }, 300);
}

// 3. LeetCode Progress Indicator
function initLeetcodeProgress() {
  const circle = document.getElementById('leetcode-progress');
  if (!circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  
  // Animate on load
  animateLeetcodeCircle();
}

function animateLeetcodeCircle() {
  const circle = document.getElementById('leetcode-progress');
  if (!circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  
  const solved = parseInt(document.querySelector('.solved-count').textContent) || 285;
  const total = 500;
  const percent = (solved / total) * 100;
  const offset = circumference - (percent / 100) * circumference;
  
  circle.style.strokeDashoffset = offset;
}

// 4. Recruiter Console Action
function initRecruiterConsole() {
  const syncBtn = document.getElementById('console-sync-btn');
  const usernameInput = document.getElementById('console-username-input');
  const fireStreakText = document.getElementById('unified-streak');
  
  if (!syncBtn) return;

  syncBtn.addEventListener('click', () => {
    const inputVal = usernameInput.value.trim();
    const targetUser = inputVal || "Jagadeesh-31";
    
    // Change button state to loading
    syncBtn.disabled = true;
    const origContent = syncBtn.innerHTML;
    syncBtn.innerHTML = `<i class="fas fa-spinner spin-anim"></i> Connecting...`;
    
    // Create status console overlay or notification
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--dark)';
    toast.style.color = 'white';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '14px';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.borderLeft = '4px solid var(--primary)';
    toast.innerHTML = `<i class="fas fa-satellite-dish" style="color: var(--primary);"></i> querying platform APIs for <strong>${targetUser}</strong>...`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.innerHTML = `<i class="fas fa-circle-notch spin-anim" style="color: #ffc107;"></i> Parsing statistics & streak calendars...`;
      toast.style.borderLeftColor = '#ffc107';
    }, 1000);

    setTimeout(() => {
      // Simulate statistical improvements
      if (inputVal) {
        // Recruiter typed a user, update UI with simulated synced values
        toast.innerHTML = `<i class="fas fa-check-circle" style="color: #43e97b;"></i> Stats for <strong>${targetUser}</strong> synced successfully!`;
        toast.style.borderLeftColor = '#43e97b';
        
        // Let's modify stats slightly for visual impact
        document.querySelectorAll('.stat-mini-card')[0].querySelector('.stat-value').innerHTML = `<a href="https://github.com/${targetUser}" target="_blank" class="profile-link">${targetUser} <i class="fas fa-external-link-alt"></i></a>`;
        document.querySelectorAll('.stat-mini-card')[1].querySelector('.stat-value').textContent = '914';
        document.querySelectorAll('.stat-mini-card')[2].querySelector('.stat-value').textContent = '82';
        
        // Randomize some green levels in calendar
        const cells = document.querySelectorAll('.calendar-cell');
        const levels = ['lvl-0', 'lvl-1', 'lvl-2', 'lvl-3', 'lvl-4'];
        cells.forEach(c => {
          c.className = 'calendar-cell ' + levels[Math.floor(Math.random() * levels.length)];
        });
        
        // Increase LeetCode solved count
        document.querySelector('.solved-count').textContent = '312';
        animateLeetcodeCircle();
        
        // Flame highlight
        fireStreakText.textContent = '143 Days';
        fireStreakText.style.color = '#ff4b2b';
        setTimeout(() => fireStreakText.style.color = '', 1500);
      } else {
        // Just general sync of existing data
        toast.innerHTML = `<i class="fas fa-check-circle" style="color: #43e97b;"></i> Jagadeesh's stats refreshed & synchronised!`;
        toast.style.borderLeftColor = '#43e97b';
        
        // Pulse streak
        fireStreakText.style.transform = 'scale(1.2)';
        fireStreakText.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
          fireStreakText.style.transform = 'scale(1)';
        }, 300);
      }

      // Reset button state
      syncBtn.disabled = false;
      syncBtn.innerHTML = origContent;
      
      // Remove toast
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
      }, 2000);
      
    }, 2000);
  });
}