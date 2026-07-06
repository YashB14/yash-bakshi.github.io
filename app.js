/* ----------------------------------------------------
   IT Engineering Portfolio Behavior Engine
   Designed & Coded by Yash Vardhan
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme
    initTheme();

    // Mobile Navbar Navigation Handler
    initMobileNav();

    // Dynamic Navigation Intersection Highlighter
    initScrollObserver();

    // Particle Canvas System
    initParticleCanvas();

    // Typewriter Subtitle
    initTypewriter();

    // Interactive Terminal Simulator
    initTerminal();

    // Projects Grid Filter Manager
    initProjectFilter();

    // Contact Form Controller
    initContactForm();
});

/* --- Theme Management (Dark/Light Switcher) --- */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('portfolio-theme');
    
    // Default to dark theme unless user selected light
    if (storedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            document.body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark');
        }
        // Force refresh canvas style properties if any
        window.dispatchEvent(new Event('theme-changed'));
    });
}

/* --- Mobile Nav Drawer --- */
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active');
        
        // Animated bars rotation
        const bars = mobileToggle.querySelectorAll('.bar');
        if (mobileToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
                const bars = mobileToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });
}

/* --- Navigation Active Link Observer --- */
function initScrollObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Highlights as it approaches active window center
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* --- HTML5 Canvas Interactive Particle System --- */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let animationFrameId;
    let numberOfParticles = 80;
    
    // Mouse tracking coordinate point
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Adjust sizes dynamically
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Scale particle density with screen sizes
        if (window.innerWidth < 768) {
            numberOfParticles = 35;
        } else {
            numberOfParticles = 85;
        }
        createParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('theme-changed', createParticles); // Refresh matching particle colors on theme switch

    // Define particle specifications
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            // Screen boundaries check
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Mouse collision logic
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 2;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 2;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 2;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 2;
                }
            }
            
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function createParticles() {
        particlesArray = [];
        const isDark = document.body.classList.contains('dark-theme');
        
        // Define color palettes based on active visual theme
        const particleColors = isDark 
            ? ['rgba(0, 242, 254, 0.4)', 'rgba(79, 172, 254, 0.3)', 'rgba(209, 61, 250, 0.25)'] 
            : ['rgba(79, 172, 254, 0.5)', 'rgba(15, 18, 36, 0.1)', 'rgba(209, 61, 250, 0.3)'];

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2.5) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = particleColors[Math.floor(Math.random() * particleColors.length)];
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect overlapping particles with soft lines
    function connect() {
        let opacityValue = 1;
        const isDark = document.body.classList.contains('dark-theme');
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    const lineColor = isDark 
                        ? `rgba(0, 242, 254, ${opacityValue * 0.15})` 
                        : `rgba(79, 172, 254, ${opacityValue * 0.2})`;
                        
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        animationFrameId = requestAnimationFrame(animate);
    }

    // Begin Rendering
    resizeCanvas();
    animate();
}

/* --- Hero Section Typing Animation --- */
function initTypewriter() {
    const textElement = document.getElementById('typewriter-text');
    const words = [
        "Full-Stack Software Systems Builder.",
        "Cloud Solutions & DevOps Architect Aspirant.",
        "Passionate Information Technology Innovator."
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30; // Faster deleting speed
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70; // Standard typing speed
        }

        // End of word written
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at full word
            isDeleting = true;
        } 
        // Finished deleting word
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Small pause before typing next
        }

        setTimeout(type, typingSpeed);
    }

    // Begin Typing Loop
    type();
}

/* --- Interactive Shell Terminal Engine --- */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const outputHistory = document.getElementById('terminal-history');
    const terminalBody = document.getElementById('terminal-output-container');
    const resetButton = document.getElementById('terminal-reset');
    const timeDisplay = document.getElementById('terminal-time');
    
    // Set static dates properly in local format
    const dateObj = new Date();
    timeDisplay.textContent = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;

    // Array tracking terminal inputs for command history navigation (Up/Down arrows)
    let commandHistory = [];
    let historyIndex = -1;

    // Terminal Commands Dataset
    const commands = {
        help: () => {
            return `
Available commands in database:
  <span class="cmd-highlight">about</span>       Show structural B.Tech background & goals
  <span class="cmd-highlight">skills</span>      Show list of framework/infrastructure stacks
  <span class="cmd-highlight">projects</span>    Queries highlights from my software collection
  <span class="cmd-highlight">contact</span>     Fetches operational communication details
  <span class="cmd-highlight">clear</span>       Flushes terminal history logs
  <span class="cmd-highlight">matrix</span>      Initiates binary visual interface layout
  <span class="cmd-highlight">sudo</span>        Executes administrative operation
`;
        },
        about: () => {
            return `
<span class="accent-text">--- Academic Credentials Packet ---</span>
Degree:     Bachelor of Technology (B.Tech)
Major:      Information Technology Engineering
Duration:   2022 - 2026 (Final Year Graduating Candidate)
GPA Score:  9.42 / 10.0 (Top 5% Tier)

Mission Statement:
  Synthesizing dynamic software architectures to automate legacy networks. 
  Extremely excited to join advanced technology groups to build resilient software packages.
`;
        },
        skills: () => {
            return `
<span class="accent-text">--- Proficiencies Matrix ---</span>
<div class="terminal-grid">
  <div class="terminal-grid-item"><strong>Languages:</strong><br>Python, TypeScript, JavaScript, SQL, Java, C++</div>
  <div class="terminal-grid-item"><strong>Frontend:</strong><br>React, Next.js, HTML5/CSS3, TailwindCSS, SCSS</div>
  <div class="terminal-grid-item"><strong>Backend/Data:</strong><br>Node.js, Express, PostgreSQL, MongoDB, Redis</div>
  <div class="terminal-grid-item"><strong>DevOps/Cloud:</strong><br>AWS (EC2/S3), Docker, Git, Github Actions, Linux Shell</div>
</div>
`;
        },
        projects: () => {
            return `
<span class="accent-text">--- Engineering Project Directory Query ---</span>
[1] <span class="cmd-highlight">Cloud-Native DevOps Pipeline</span>
    Stack: AWS, Docker, Terraform, CI/CD
    Detail: Microservice system load balancing & automated VM deployments.

[2] <span class="cmd-highlight">Intelligent Log Stream Analyzer</span>
    Stack: Python, FastAPI, TF-IDF, Elasticsearch
    Detail: High-volume streaming server logs analytics and security analysis.

[3] <span class="cmd-highlight">Co-Code: Collaborative Editor</span>
    Stack: Socket.io, React.js, Express, WebRTC
    Detail: Sync coding text engine with sandbox compilation runs.

[4] <span class="cmd-highlight">Distributed Key-Value Engine</span>
    Stack: C++, Raft Consensus Protocol, gRPC
    Detail: Multi-node database synced transaction replica loops.

Type the index name (e.g. 'project 1') for full description.
`;
        },
        'project 1': () => {
            return `
<span class="accent-text">SYSTEM INQUIRY: Cloud-Native DevOps Pipeline</span>
- Objective: Design zero-downtime microservice deployments automatically.
- Architecture: Employs Terraform scripting, manages AWS VPC subnets, scales ECS containers automatically.
- Outcome: Reduced production rollout delays from hours to seconds under high testing suites.
`;
        },
        'project 2': () => {
            return `
<span class="accent-text">SYSTEM INQUIRY: Intelligent Log Stream Analyzer</span>
- Objective: Real-time telemetry log sorting and error matching.
- Architecture: Formulates dynamic token filters and vectors inside TF-IDF databases, parses log lines instantly.
- Outcome: Successfully flags critical system vulnerability errors with high precision.
`;
        },
        'project 3': () => {
            return `
<span class="accent-text">SYSTEM INQUIRY: Co-Code: Collaborative Editor</span>
- Objective: Remote developers shared code session without compilation lag.
- Architecture: Manages atomic delta updates with operational transformations via WebSockets.
- Outcome: Supports active parallel code writing and live code outputs securely.
`;
        },
        'project 4': () => {
            return `
<span class="accent-text">SYSTEM INQUIRY: Distributed Key-Value Engine</span>
- Objective: Fail-safe transaction storing without central node failure.
- Architecture: Encodes leader election logic, heartbeat loops, and consensus logs inside C++ servers.
- Outcome: 100% data preservation even under sudden simulated networking splits.
`;
        },
        contact: () => {
            return `
<span class="accent-text">--- Connection Ports Available ---</span>
Email Address:     <a href="mailto:yash.vardhan.it@gmail.com" class="accent-text">yash.vardhan.it@gmail.com</a>
Location Gateway:  Mumbai, India (Open to relocation packets)
GitHub Node:       github.com/yash-vardhan
LinkedIn Node:     linkedin.com/in/yash-vardhan
`;
        },
        clear: () => {
            outputHistory.innerHTML = '';
            return '';
        },
        matrix: () => {
            triggerMatrixRain();
            return 'Visual System Override: Initiating terminal binary visual overlay...';
        },
        sudo: () => {
            return `<span class="terminal-line output-error">Permission Denied: User "yash" is not in the sudoers file. This incident has been logged in root.</span>`;
        },
        'sudo rm -rf /': () => {
            return `
<span class="terminal-line output-error">WARNING: Administrative deletion command blocked by Security Protocol.</span>
Detecting vulnerability payload...
Defenses enabled. Counter-offensive initiated.
We tracked your IP. Be careful, commander! ;)
`;
        }
    };

    // Trigger matrix-style aesthetic lines inside terminal
    function triggerMatrixRain() {
        let linesCount = 0;
        const matrixInterval = setInterval(() => {
            const matrixLine = document.createElement('div');
            matrixLine.className = 'terminal-line output-success';
            matrixLine.innerHTML = Array(35).fill(0).map(() => Math.floor(Math.random() * 2)).join(' ');
            outputHistory.appendChild(matrixLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            linesCount++;
            
            if (linesCount > 15) {
                clearInterval(matrixInterval);
                const completeLine = document.createElement('div');
                completeLine.className = 'terminal-line';
                completeLine.innerHTML = '<span class="accent-text">Matrix sweep completed. System fully functional.</span><br>';
                outputHistory.appendChild(completeLine);
            }
        }, 100);
    }

    // Input handlers
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = input.value.trim();
            const lowerVal = rawVal.toLowerCase();
            input.value = '';

            if (rawVal === '') return;

            // Output command prompt entered
            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-line';
            cmdLine.innerHTML = `<span class="prompt"><span class="user">yash</span><span class="at">@</span><span class="host">portfolio</span><span class="colon">:</span><span class="path">~</span><span class="char">$</span></span> <span style="color: #fff">${rawVal}</span>`;
            outputHistory.appendChild(cmdLine);

            // Record History
            commandHistory.push(rawVal);
            historyIndex = commandHistory.length;

            // Parser
            let outputText = '';
            if (commands[lowerVal]) {
                outputText = commands[lowerVal]();
            } else if (lowerVal.startsWith('project ')) {
                // Check if specific project was searched
                if (commands[lowerVal]) {
                    outputText = commands[lowerVal]();
                } else {
                    outputText = `<span class="terminal-line output-error">Query Error: Project index out of range or undefined. Check 'projects' structure.</span>`;
                }
            } else {
                outputText = `<span class="terminal-line output-warning">Shell Command "${rawVal}" not cataloged in profile databases. Type "help" to retrieve manual options.</span>`;
            }

            if (lowerVal !== 'clear' && outputText !== '') {
                const resultLine = document.createElement('div');
                resultLine.className = 'terminal-line';
                resultLine.innerHTML = outputText;
                outputHistory.appendChild(resultLine);
            }

            // Scroll down
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        // Navigate History using Arrow Keys
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });

    // Reset Console button
    resetButton.addEventListener('click', () => {
        outputHistory.innerHTML = '';
        const resetMsg = document.createElement('div');
        resetMsg.className = 'terminal-line output-success';
        resetMsg.textContent = 'Connection system successfully reset. Terminal ready.';
        outputHistory.appendChild(resetMsg);
        input.value = '';
        input.focus();
    });

    // Auto-focus terminal on body click inside the wrapper
    document.querySelector('.terminal-wrapper').addEventListener('click', () => {
        input.focus();
    });
}

/* --- Projects Dynamic Filters --- */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active states
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const itemCategory = card.getAttribute('data-category');
                
                // Set transition timings nicely
                card.style.opacity = '0';
                card.style.transform = 'scale(0.85)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

/* --- Contact Form Handler --- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Perform basic audits
        if (!name || !email || !subject || !message) {
            showFeedback('Packet rejected. Ensure all fields are properly structured.', 'error');
            return;
        }

        // Show transmitting loader
        const submitBtn = form.querySelector('button[type="submit"]');
        const submitBtnText = submitBtn.querySelector('span');
        const submitBtnIcon = submitBtn.querySelector('i');
        
        submitBtn.disabled = true;
        submitBtnText.textContent = 'Transmitting...';
        submitBtnIcon.className = 'fa-solid fa-spinner animate-pulse';

        // Simulate secure API network response delays
        setTimeout(() => {
            // Success response mock
            showFeedback(`Transmission Confirmed! Thank you, ${name}. Your packet was dispatched to Yash's primary inbox successfully.`, 'success');
            
            // Clean up inputs
            form.reset();
            
            // Reset Button states
            submitBtn.disabled = false;
            submitBtnText.textContent = 'Transmit Packet';
            submitBtnIcon.className = 'fa-solid fa-paper-plane';
        }, 1500);
    });

    function showFeedback(text, statusClass) {
        feedback.textContent = text;
        feedback.className = `form-feedback ${statusClass}`;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto fadeout feedback notice
        setTimeout(() => {
            feedback.className = 'form-feedback hidden';
        }, 6000);
    }
}
