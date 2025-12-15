// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display user info
    const userData = JSON.parse(currentUser);
    document.getElementById('user-avatar').textContent = userData.name.charAt(0).toUpperCase();
    document.getElementById('user-name').textContent = userData.name;
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Tab switching functionality for recommendations
    const recTabs = document.querySelectorAll('.rec-tab');
    const recContents = document.querySelectorAll('.tab-content');
    
    recTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            recTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            recContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Resume Analyzer Functionality
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileName = document.getElementById('fileName');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const analysisResults = document.getElementById('analysisResults');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const overallScore = document.getElementById('overallScore');
    const scoreFeedback = document.getElementById('scoreFeedback');
    const jobLocationFilter = document.getElementById('jobLocationFilter');
    const jobCount = document.getElementById('jobCount');
    const filteredJobCount = document.getElementById('filteredJobCount');
    
    // Store resume content
    let resumeContent = '';
    let currentDesignation = '';
    
    // Initially hide analysis results and recommendations
    analysisResults.style.display = 'none';
    recommendationsSection.style.display = 'none';
    
    // Enhanced designation-specific keyword requirements
    const designationKeywords = {
        'frontend': {
            primary: ['JavaScript', 'React', 'HTML5', 'CSS3', 'TypeScript', 'Redux', 'Webpack', 'HTML', 'CSS'],
            secondary: ['Vue.js', 'Angular', 'SASS', 'Bootstrap', 'Responsive Design', 'Cross-browser', 'jQuery'],
            tools: ['Git', 'npm', 'Webpack', 'Babel', 'Jest', 'Cypress']
        },
        'backend': {
            primary: ['Java', 'Spring Boot', 'Python', 'Node.js', 'SQL', 'REST API', 'Microservices'],
            secondary: ['Docker', 'Kubernetes', 'AWS', 'MongoDB', 'PostgreSQL', 'Redis'],
            tools: ['Maven', 'Gradle', 'Docker', 'Jenkins', 'Postman', 'Swagger']
        },
        'fullstack': {
            primary: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'REST API', 'HTML/CSS', 'HTML', 'CSS'],
            secondary: ['MongoDB', 'Express.js', 'AWS', 'Docker', 'TypeScript', 'Redux'],
            tools: ['Git', 'Docker', 'Webpack', 'npm', 'Postman', 'Jest']
        },
        'mobile': {
            primary: ['React Native', 'Flutter', 'iOS', 'Android', 'JavaScript', 'Dart', 'Swift'],
            secondary: ['Kotlin', 'Java', 'Xcode', 'Android Studio', 'Firebase', 'REST API'],
            tools: ['Xcode', 'Android Studio', 'Firebase', 'Git', 'npm', 'CocoaPods']
        },
        'devops': {
            primary: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Linux', 'Terraform'],
            secondary: ['Azure', 'GCP', 'Ansible', 'Prometheus', 'Grafana', 'Helm', 'Shell Scripting'],
            tools: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Git', 'AWS CLI']
        },
        'data-science': {
            primary: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL'],
            secondary: ['Data Analysis', 'Statistics', 'Deep Learning', 'Scikit-learn', 'Jupyter', 'Matplotlib'],
            tools: ['Jupyter', 'TensorFlow', 'PyTorch', 'Git', 'Docker', 'AWS SageMaker']
        },
        'data-engineer': {
            primary: ['Python', 'SQL', 'Spark', 'ETL', 'Data Warehousing', 'Airflow', 'Hadoop'],
            secondary: ['Kafka', 'Snowflake', 'dbt', 'AWS Redshift', 'BigQuery', 'Data Pipeline'],
            tools: ['Apache Spark', 'Airflow', 'Kafka', 'Docker', 'Git', 'AWS']
        },
        'ml-engineer': {
            primary: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'MLOps', 'Docker', 'Kubernetes'],
            secondary: ['Deep Learning', 'NLP', 'Computer Vision', 'AWS SageMaker', 'CI/CD', 'Model Deployment'],
            tools: ['TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'MLflow', 'Git']
        },
        'cloud-architect': {
            primary: ['AWS', 'Azure', 'Cloud Architecture', 'Terraform', 'Kubernetes', 'Docker', 'CI/CD'],
            secondary: ['GCP', 'Microservices', 'Serverless', 'Security', 'Networking', 'Infrastructure'],
            tools: ['Terraform', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git']
        },
        'ui-ux': {
            primary: ['Figma', 'User Research', 'Prototyping', 'UI Design', 'Wireframing', 'Adobe XD', 'Sketch'],
            secondary: ['User Testing', 'Design Systems', 'Interaction Design', 'Accessibility', 'Responsive Design'],
            tools: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Zeplin', 'Miro']
        },
        'qa-engineer': {
            primary: ['Selenium', 'Test Automation', 'Java', 'Python', 'JUnit', 'TestNG', 'API Testing'],
            secondary: ['Cypress', 'Playwright', 'Performance Testing', 'Security Testing', 'CI/CD', 'Agile'],
            tools: ['Selenium', 'JUnit', 'Postman', 'Jenkins', 'Git', 'JIRA']
        },
        'cybersecurity': {
            primary: ['Network Security', 'SIEM', 'Incident Response', 'Firewalls', 'VPN', 'Penetration Testing'],
            secondary: ['SOC', 'Threat Intelligence', 'Vulnerability Assessment', 'Security Audits', 'Compliance'],
            tools: ['Wireshark', 'Nessus', 'Metasploit', 'SIEM', 'Firewall', 'Kali Linux']
        },
        'blockchain': {
            primary: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'Blockchain', 'Cryptography'],
            secondary: ['DeFi', 'NFT', 'Tokenomics', 'Consensus Algorithms', 'DApps', 'Truffle'],
            tools: ['Truffle', 'Ganache', 'Web3.js', 'Hardhat', 'Git', 'MetaMask']
        },
        'ai-engineer': {
            primary: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
            secondary: ['AI Algorithms', 'Neural Networks', 'Reinforcement Learning', 'Model Optimization', 'MLOps'],
            tools: ['TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'Git', 'Jupyter']
        },
        'embedded': {
            primary: ['C', 'C++', 'Embedded Systems', 'Microcontrollers', 'RTOS', 'ARM', 'IoT'],
            secondary: ['Python', 'Linux', 'Device Drivers', 'Firmware', 'PCB Design', 'Communication Protocols'],
            tools: ['Keil', 'Eclipse', 'GCC', 'Git', 'Oscilloscope', 'Logic Analyzer']
        },
        'game-dev': {
            primary: ['C++', 'Unity', 'Unreal Engine', '3D Modeling', 'Game Physics', 'AI', 'Multiplayer'],
            secondary: ['C#', 'Blender', 'Maya', 'Shader Programming', 'VR/AR', 'Game Design'],
            tools: ['Unity', 'Unreal Engine', 'Blender', 'Git', 'Visual Studio', 'Maya']
        },
        'technical-lead': {
            primary: ['Team Leadership', 'Project Management', 'Architecture', 'Agile', 'Scrum', 'Code Review'],
            secondary: ['Mentoring', 'Technical Strategy', 'Stakeholder Management', 'Risk Assessment', 'Budgeting'],
            tools: ['JIRA', 'Confluence', 'Git', 'CI/CD', 'Monitoring Tools', 'Documentation']
        },
        'system-admin': {
            primary: ['Linux', 'Windows Server', 'Networking', 'DNS', 'Active Directory', 'Virtualization'],
            secondary: ['Backup Solutions', 'Disaster Recovery', 'Security', 'Monitoring', 'Shell Scripting'],
            tools: ['Linux', 'Windows Server', 'VMware', 'Docker', 'Git', 'Monitoring Tools']
        },
        'database-admin': {
            primary: ['SQL', 'MySQL', 'PostgreSQL', 'Oracle', 'Database Design', 'Performance Tuning'],
            secondary: ['NoSQL', 'MongoDB', 'Backup/Recovery', 'Security', 'Replication', 'Indexing'],
            tools: ['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Git', 'Monitoring Tools']
        },
        'network-engineer': {
            primary: ['Cisco', 'Routing', 'Switching', 'Firewalls', 'VPN', 'Network Security', 'TCP/IP'],
            secondary: ['Wireless', 'VoIP', 'SD-WAN', 'Load Balancing', 'Network Monitoring', 'BGP'],
            tools: ['Cisco IOS', 'Wireshark', 'Ping', 'Traceroute', 'Git', 'Monitoring Tools']
        },
        'business-analyst': {
            primary: ['Requirements Gathering', 'UML', 'BPMN', 'SQL', 'Data Analysis', 'Stakeholder Management'],
            secondary: ['Agile', 'Scrum', 'User Stories', 'Process Modeling', 'Documentation', 'Testing'],
            tools: ['JIRA', 'Confluence', 'SQL', 'Excel', 'Visio', 'PowerPoint']
        }
    };

    // Comprehensive job database
    const jobDatabase = {
        'frontend': [
            {
                title: 'Junior Frontend Developer',
                company: 'TechStart Solutions',
                location: 'bangalore',
                match: 85,
                salary: '₹4L - ₹8L',
                description: 'Entry-level position for freshers with basic knowledge of HTML, CSS, and JavaScript. Great learning opportunity.',
                skills: ['HTML', 'CSS', 'JavaScript', 'React'],
                missing: ['TypeScript', 'Redux'],
                source: 'Naukri',
                experience: '0-2 years',
                level: 'entry'
            },
            {
                title: 'Frontend Developer',
                company: 'WebCraft India',
                location: 'pune',
                match: 78,
                salary: '₹6L - ₹12L',
                description: 'Develop responsive web applications using modern JavaScript frameworks. Mid-level position.',
                skills: ['JavaScript', 'React', 'CSS3', 'Git'],
                missing: ['TypeScript', 'Testing'],
                source: 'Indeed',
                experience: '2-4 years',
                level: 'mid'
            }
        ],
        'backend': [
            {
                title: 'Junior Backend Developer',
                company: 'ServerSide Tech',
                location: 'pune',
                match: 82,
                salary: '₹4L - ₹7L',
                description: 'Entry-level backend development position. Great for computer science graduates.',
                skills: ['Java', 'SQL', 'Spring', 'REST API'],
                missing: ['Microservices', 'Cloud'],
                source: 'Naukri',
                experience: '0-2 years',
                level: 'entry'
            },
            {
                title: 'Backend Engineer',
                company: 'API Masters',
                location: 'hyderabad',
                match: 87,
                salary: '₹8L - ₹15L',
                description: 'Develop scalable backend services and RESTful APIs. Mid-level position.',
                skills: ['Java', 'Spring Boot', 'MySQL', 'REST', 'Git'],
                missing: ['Docker', 'Kubernetes'],
                source: 'Indeed',
                experience: '2-5 years',
                level: 'mid'
            }
        ],
        'blockchain': [
            {
                title: 'Blockchain Developer',
                company: 'Crypto Innovations',
                location: 'bangalore',
                match: 85,
                salary: '₹12L - ₹20L',
                description: 'Develop smart contracts and decentralized applications using blockchain technology.',
                skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js'],
                missing: ['DeFi', 'NFT'],
                source: 'LinkedIn',
                experience: '2-5 years',
                level: 'mid'
            }
        ],
        'data-science': [
            {
                title: 'Junior Data Scientist',
                company: 'Analytics StartUp',
                location: 'bangalore',
                match: 78,
                salary: '₹6L - ₹12L',
                description: 'Entry-level data science role for statistics/math graduates.',
                skills: ['Python', 'Pandas', 'Statistics', 'SQL'],
                missing: ['Machine Learning', 'Deep Learning'],
                source: 'Naukri',
                experience: '0-2 years',
                level: 'entry'
            }
        ]
    };

    // Function to extract text from file
    function extractTextFromFile(file) {
        return new Promise((resolve, reject) => {
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = reject;
                reader.readAsText(file);
            } else {
                // For PDF and DOC files, we'll use a simple text extraction simulation
                // In a real application, you would use libraries like pdf.js or mammoth
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Simulate extracting some text content
                    // This is a simplified version - real implementation would parse the file properly
                    let content = "Extracted resume content: ";
                    
                    // Add some generic skills to simulate content extraction
                    const genericSkills = [
                        "JavaScript", "HTML", "CSS", "React", "Python", "Java", 
                        "SQL", "Git", "Node.js", "REST API", "Problem Solving"
                    ];
                    
                    // Add random skills to simulate resume content
                    const randomSkills = genericSkills.sort(() => 0.5 - Math.random()).slice(0, 5);
                    content += randomSkills.join(", ") + ". ";
                    content += "Experienced developer with strong technical skills and project experience.";
                    
                    resolve(content);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            }
        });
    }

    // Enhanced ATS Score calculation based on actual resume content
    function calculateATSScore(resumeText, designation) {
        const requirements = designationKeywords[designation];
        if (!requirements) return { score: 65, matchedKeywords: [], missingKeywords: [] };
        
        let score = 0;
        let matchedKeywords = [];
        let missingKeywords = [];
        
        // Convert resume text to lowercase for case-insensitive matching
        const resumeLower = resumeText.toLowerCase();
        
        console.log(`Analyzing resume for ${designation}:`, resumeText);
        
        // Check primary keywords
        requirements.primary.forEach(keyword => {
            const keywordLower = keyword.toLowerCase();
            // More flexible matching - check for word boundaries
            const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
            if (regex.test(resumeText)) {
                matchedKeywords.push(keyword);
                score += 3;
                console.log(`Matched primary keyword: ${keyword}`);
            } else {
                missingKeywords.push(keyword);
            }
        });
        
        // Check secondary keywords
        requirements.secondary.forEach(keyword => {
            const keywordLower = keyword.toLowerCase();
            const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
            if (regex.test(resumeText)) {
                matchedKeywords.push(keyword);
                score += 2;
                console.log(`Matched secondary keyword: ${keyword}`);
            } else {
                missingKeywords.push(keyword);
            }
        });
        
        // Check tools
        requirements.tools.forEach(tool => {
            const toolLower = tool.toLowerCase();
            const regex = new RegExp(`\\b${toolLower}\\b`, 'i');
            if (regex.test(resumeText)) {
                matchedKeywords.push(tool);
                score += 1;
                console.log(`Matched tool: ${tool}`);
            } else {
                missingKeywords.push(tool);
            }
        });
        
        // Calculate base score
        const maxScore = (requirements.primary.length * 3) + 
                        (requirements.secondary.length * 2) + 
                        requirements.tools.length;
        
        let baseScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
        
        console.log(`Raw score: ${score}/${maxScore}, Base score: ${baseScore}%`);
        
        // Ensure minimum score if some keywords are matched
        if (matchedKeywords.length > 0 && baseScore < 40) {
            baseScore = 40 + Math.floor(Math.random() * 20); // 40-60% if some matches
        }
        
        // If no relevant keywords but resume has content, give minimal score
        if (matchedKeywords.length === 0 && resumeText.length > 50) {
            baseScore = 20 + Math.floor(Math.random() * 20); // 20-40% for irrelevant content
        }
        
        const finalScore = Math.min(100, Math.max(0, baseScore));
        
        console.log(`Final ATS Score for ${designation}: ${finalScore}%`);
        console.log(`Matched keywords: ${matchedKeywords.join(', ')}`);
        console.log(`Missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
        
        return {
            score: finalScore,
            matchedKeywords: matchedKeywords,
            missingKeywords: missingKeywords
        };
    }

    // Generate feedback based on actual resume analysis
    function generateFeedback(atsScore, matchedKeywords, missingKeywords, designation, resumeText) {
        let feedback = '';
        let suggestions = [];
        
        // Basic resume quality checks
        const hasContactInfo = /(email|phone|contact|@|\.com|\.in)/i.test(resumeText);
        const hasEducation = /(education|degree|university|college|b\.?tech|b\.?e|m\.?tech|m\.?e)/i.test(resumeText);
        const hasExperience = /(experience|worked|project|internship)/i.test(resumeText);
        const hasSkills = /(skills|technical|programming)/i.test(resumeText);
        
        if (!hasContactInfo) {
            suggestions.push('Add contact information (email, phone number)');
        }
        if (!hasEducation) {
            suggestions.push('Include education background and qualifications');
        }
        if (!hasExperience) {
            suggestions.push('Add work experience or project details');
        }
        if (!hasSkills) {
            suggestions.push('Create a dedicated skills section');
        }
        
        // Designation-specific feedback
        if (matchedKeywords.length === 0) {
            feedback = `Your resume doesn't contain specific keywords for ${designation} roles. `;
            if (resumeText.length < 100) {
                feedback += 'The resume content appears to be very limited.';
                suggestions.push('Add more detailed content about your skills and experience');
            } else {
                feedback += 'Consider adding relevant technical skills.';
            }
            suggestions.push(`Focus on adding ${designation}-specific skills: ${missingKeywords.slice(0, 5).join(', ')}`);
        } else if (atsScore >= 90) {
            feedback = `Excellent! Your resume is well-optimized for ${designation} roles.`;
            suggestions.push('Maintain your current skill set and continue learning');
        } else if (atsScore >= 80) {
            feedback = `Strong resume with good alignment to ${designation} requirements.`;
            suggestions.push('Add more quantifiable achievements');
        } else if (atsScore >= 70) {
            feedback = `Good foundation for ${designation} roles with some areas for improvement.`;
            if (missingKeywords.length > 0) {
                suggestions.push(`Focus on adding: ${missingKeywords.slice(0, 3).join(', ')}`);
            }
        } else if (atsScore >= 60) {
            feedback = `Your resume needs improvements for ${designation} roles.`;
            if (missingKeywords.length > 0) {
                suggestions.push(`Learn missing skills: ${missingKeywords.slice(0, 5).join(', ')}`);
            }
        } else if (atsScore >= 40) {
            feedback = `Limited alignment with ${designation} requirements.`;
            suggestions.push(`Add core ${designation} skills: ${missingKeywords.slice(0, 5).join(', ')}`);
        } else {
            feedback = `Very limited relevance to ${designation} roles.`;
            suggestions.push('Consider relevant training and projects');
        }
        
        // Add quantifiable achievements suggestion
        if (!/(\d+|\$|₹|rs\.|lakh|lpa|%|percent)/i.test(resumeText)) {
            suggestions.push('Add quantifiable achievements with numbers and metrics');
        }
        
        return { feedback, suggestions };
    }

    // Update dashboard with ATS results
    function updateDashboardWithATSResults(atsResult, feedback, designation) {
        // Update overall score and feedback
        overallScore.textContent = atsResult.score;
        scoreFeedback.textContent = feedback.feedback;
        
        // Update category scores based on actual analysis
        const contentScore = Math.min(10, Math.round(atsResult.score / 10));
        const formattingScore = 6 + Math.round(atsResult.score / 20); // Based on ATS score
        const keywordScore = Math.min(10, Math.round((atsResult.matchedKeywords.length / (atsResult.matchedKeywords.length + atsResult.missingKeywords.length)) * 10));
        
        document.querySelector('.category:nth-child(1) .category-score').textContent = `${contentScore}/10`;
        document.querySelector('.category:nth-child(1) .progress').style.width = `${contentScore * 10}%`;
        
        document.querySelector('.category:nth-child(2) .category-score').textContent = `${formattingScore}/10`;
        document.querySelector('.category:nth-child(2) .progress').style.width = `${formattingScore * 10}%`;
        
        document.querySelector('.category:nth-child(3) .category-score').textContent = `${keywordScore}/10`;
        document.querySelector('.category:nth-child(3) .progress').style.width = `${keywordScore * 10}%`;
        
        // Update feedback items
        const positiveItems = document.querySelectorAll('.feedback-item.positive');
        const negativeItems = document.querySelectorAll('.feedback-item.negative');
        
        // Clear existing feedback
        positiveItems.forEach(item => item.querySelector('span').textContent = '');
        negativeItems.forEach(item => item.querySelector('span').textContent = '');
        
        // Add matched keywords as positive feedback
        atsResult.matchedKeywords.slice(0, 3).forEach((keyword, index) => {
            if (positiveItems[index]) {
                positiveItems[index].querySelector('span').textContent = 
                    `Strong skills in ${keyword} - matches ${designation} requirements`;
            }
        });
        
        // Add missing keywords as areas for improvement
        atsResult.missingKeywords.slice(0, 3).forEach((keyword, index) => {
            if (negativeItems[index]) {
                negativeItems[index].querySelector('span').textContent = 
                    `Missing ${keyword} skills - important for ${designation} roles`;
            }
        });
        
        // Fill remaining feedback slots with generic suggestions if needed
        if (atsResult.matchedKeywords.length === 0) {
            positiveItems[0].querySelector('span').textContent = 'Good resume structure and formatting';
            positiveItems[1].querySelector('span').textContent = 'Clear section organization';
        }
        
        // Update recommended keywords
        const keywordsContainer = document.querySelector('.keywords');
        keywordsContainer.innerHTML = '';
        
        atsResult.matchedKeywords.slice(0, 8).forEach(keyword => {
            const keywordElement = document.createElement('span');
            keywordElement.className = 'keyword';
            keywordElement.textContent = keyword;
            keywordsContainer.appendChild(keywordElement);
        });
        
        atsResult.missingKeywords.slice(0, 8).forEach(keyword => {
            const keywordElement = document.createElement('span');
            keywordElement.className = 'keyword missing';
            keywordElement.textContent = keyword;
            keywordsContainer.appendChild(keywordElement);
        });
        
        // Update suggestions
        const suggestionList = document.querySelector('.suggestion-list');
        suggestionList.innerHTML = '';
        
        feedback.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionList.appendChild(li);
        });
        
        // Update recommendations based on designation
        updateRecommendations(designation, atsResult.score);
    }

    // Update recommendations based on designation and score
    function updateRecommendations(designation, score) {
        currentDesignation = designation;
        
        // Update certificate courses
        updateCertifications(designation, score);
        
        // Update projects
        updateProjects(designation, score);
        
        // Update jobs
        updateJobs(designation, score);
    }

    function updateCertifications(designation, score) {
        const certificatesContainer = document.getElementById('certifications-tab');
        certificatesContainer.innerHTML = '';
        
        const certificates = getCertificatesForDesignation(designation, score);
        
        certificates.forEach(cert => {
            const certCard = createCertificateCard(cert);
            certificatesContainer.appendChild(certCard);
        });
    }

    function updateProjects(designation, score) {
        const projectsContainer = document.getElementById('projects-tab');
        projectsContainer.innerHTML = '';
        
        const projects = getProjectsForDesignation(designation, score);
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsContainer.appendChild(projectCard);
        });
    }

    function updateJobs(designation, score) {
        const jobsContainer = document.getElementById('jobs-tab');
        jobsContainer.innerHTML = '';
        
        const jobs = jobDatabase[designation] || [];
        const filteredJobs = filterJobsByExperienceLevel(jobs, score);
        
        filteredJobs.forEach(job => {
            const adjustedMatch = calculateAdjustedMatch(job, score);
            job.match = adjustedMatch;
            
            const jobCard = createJobCard(job);
            jobsContainer.appendChild(jobCard);
        });
        
        // Update job counts
        applyFilters();
    }

    function getCertificatesForDesignation(designation, score) {
        const certificateMap = {
            'frontend': [
                {
                    title: 'Advanced React and Redux',
                    provider: 'Udemy',
                    level: score > 70 ? 'intermediate' : 'beginner',
                    duration: '~40 hours',
                    description: 'Master advanced React patterns, state management with Redux, and performance optimization techniques.'
                },
                {
                    title: 'Frontend Web Development',
                    provider: 'freeCodeCamp',
                    level: 'beginner',
                    duration: '~300 hours',
                    description: 'Comprehensive frontend development curriculum covering HTML, CSS, JavaScript, and modern frameworks.'
                },
                {
                    title: 'JavaScript Modern ES6+',
                    provider: 'Coursera',
                    level: 'intermediate',
                    duration: '~30 hours',
                    description: 'Learn modern JavaScript features including ES6+ syntax, async/await, and functional programming.'
                }
            ],
            'backend': [
                {
                    title: 'Spring Framework 6',
                    provider: 'Spring Academy',
                    level: score > 70 ? 'intermediate' : 'beginner',
                    duration: '~50 hours',
                    description: 'Master Spring Framework including Spring Boot, Spring Security, and Spring Data.'
                },
                {
                    title: 'Node.js Masterclass',
                    provider: 'Coursera',
                    level: 'intermediate',
                    duration: '~60 hours',
                    description: 'Complete Node.js development course covering Express, MongoDB, and REST APIs.'
                }
            ],
            'blockchain': [
                {
                    title: 'Blockchain Developer Nanodegree',
                    provider: 'Udacity',
                    level: 'intermediate',
                    duration: '~80 hours',
                    description: 'Learn to build decentralized applications and smart contracts on Ethereum blockchain.'
                }
            ],
            'data-science': [
                {
                    title: 'Machine Learning Specialization',
                    provider: 'Coursera',
                    level: 'intermediate',
                    duration: '~120 hours',
                    description: 'Comprehensive machine learning course covering algorithms, model evaluation, and deployment.'
                }
            ]
        };
        
        return certificateMap[designation] || certificateMap['frontend'];
    }

    function getProjectsForDesignation(designation, score) {
        const projectMap = {
            'frontend': [
                {
                    title: 'E-commerce Dashboard',
                    level: score > 70 ? 'intermediate' : 'beginner',
                    duration: '4-6 weeks',
                    description: 'Build a responsive e-commerce dashboard with real-time analytics and customer management features.',
                    skills: ['React', 'Chart.js', 'CSS3', 'REST API']
                },
                {
                    title: 'Portfolio Website',
                    level: 'beginner',
                    duration: '2-3 weeks',
                    description: 'Create a responsive portfolio website showcasing your projects and skills.',
                    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']
                }
            ],
            'backend': [
                {
                    title: 'REST API Development',
                    level: score > 75 ? 'intermediate' : 'beginner',
                    duration: '3-5 weeks',
                    description: 'Build a complete RESTful API with authentication, database integration, and documentation.',
                    skills: ['Node.js', 'Express', 'MongoDB', 'JWT']
                }
            ],
            'blockchain': [
                {
                    title: 'Smart Contract Development',
                    level: 'intermediate',
                    duration: '4-6 weeks',
                    description: 'Create and deploy smart contracts on Ethereum blockchain for a decentralized application.',
                    skills: ['Solidity', 'Ethereum', 'Web3.js']
                }
            ],
            'data-science': [
                {
                    title: 'Predictive Analytics',
                    level: 'intermediate',
                    duration: '5-7 weeks',
                    description: 'Build machine learning models for predictive analysis and data visualization.',
                    skills: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib']
                }
            ]
        };
        
        return projectMap[designation] || projectMap['frontend'];
    }

    function filterJobsByExperienceLevel(jobs, atsScore) {
        return jobs.filter(job => {
            if (atsScore >= 85) return true;
            if (atsScore >= 70) return !['architect', 'lead'].includes(job.level);
            if (atsScore >= 60) return ['entry', 'mid'].includes(job.level);
            return job.level === 'entry';
        });
    }

    function calculateAdjustedMatch(job, atsScore) {
        let baseMatch = atsScore;
        const levelModifiers = {
            'entry': 10,
            'mid': 0,
            'senior': -5,
            'lead': -10,
            'architect': -15
        };
        
        const modifier = levelModifiers[job.level] || 0;
        return Math.max(60, Math.min(95, baseMatch + modifier));
    }

    function createCertificateCard(cert) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${cert.title}</div>
                <div class="card-level ${cert.level}">${cert.level.charAt(0).toUpperCase() + cert.level.slice(1)}</div>
            </div>
            <div class="card-provider">${cert.provider}</div>
            <div class="card-description">${cert.description}</div>
            <div class="card-footer">
                <div class="card-duration">${cert.duration}</div>
                <a href="#" class="card-link">View Course <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        return card;
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        const skillsHTML = project.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${project.title}</div>
                <div class="card-level ${project.level}">${project.level.charAt(0).toUpperCase() + project.level.slice(1)}</div>
            </div>
            <div class="card-description">${project.description}</div>
            <div class="project-skills">${skillsHTML}</div>
            <div class="card-footer">
                <div class="card-duration">${project.duration}</div>
                <a href="#" class="card-link">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        return card;
    }

    function createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.setAttribute('data-location', job.location);
        
        const skillsHTML = job.skills.map(skill => 
            `<span class="job-skill">${skill}</span>`
        ).join('');
        
        const missingSkillsHTML = job.missing.map(skill => 
            `<span class="job-skill missing">${skill}</span>`
        ).join('');
        
        const levelBadge = job.level ? `<span class="experience-badge">${job.level.toUpperCase()}</span>` : '';
        const sourceBadge = job.source ? `<span class="urgent-badge" style="background: #0077b5;">${job.source}</span>` : '';
        
        card.innerHTML = `
            <div class="job-header">
                <div class="job-title">${job.title} ${levelBadge} ${sourceBadge}</div>
                <div class="job-match">${job.match}% Match</div>
            </div>
            <div class="job-company">${job.company}</div>
            <div class="job-location">
                <i class="fas fa-map-marker-alt"></i> ${getLocationName(job.location)}
                ${job.experience ? `<span style="margin-left: 15px; color: var(--gray);"><i class="fas fa-briefcase"></i> ${job.experience}</span>` : ''}
            </div>
            <div class="job-description">${job.description}</div>
            <div class="job-skills">
                ${skillsHTML}
                ${missingSkillsHTML}
            </div>
            <div class="job-footer">
                <div class="job-salary">${job.salary}</div>
                <div class="job-actions">
                    <button class="job-action job-save">Save</button>
                    <button class="job-action job-apply">Apply Now</button>
                </div>
            </div>
        `;
        return card;
    }

    function getLocationName(locationCode) {
        const locations = {
            'remote': 'Remote',
            'bangalore': 'Bangalore, KA',
            'hyderabad': 'Hyderabad, TS',
            'pune': 'Pune, MH',
            'chennai': 'Chennai, TN',
            'delhi': 'Delhi NCR',
            'mumbai': 'Mumbai, MH'
        };
        return locations[locationCode] || locationCode;
    }

    // Filter functionality
    function applyFilters() {
        const locationValue = jobLocationFilter.value;
        const jobCards = document.querySelectorAll('.job-card');
        let visibleCount = 0;
        
        jobCards.forEach(card => {
            const cardLocation = card.getAttribute('data-location');
            const locationMatch = locationValue === 'all' || cardLocation === locationValue;
            
            if (locationMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        jobCount.textContent = visibleCount;
        filteredJobCount.textContent = `Showing ${visibleCount} of ${jobCards.length} jobs`;
    }
    
    // Event listeners
    jobLocationFilter.addEventListener('change', applyFilters);
    
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
        uploadArea.style.borderColor = 'var(--secondary)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.backgroundColor = '';
        uploadArea.style.borderColor = 'var(--primary)';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.backgroundColor = '';
        uploadArea.style.borderColor = 'var(--primary)';
        
        if (e.dataTransfer.files.length) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length) {
            handleFileSelection(fileInput.files[0]);
        }
    });
    
    async function handleFileSelection(file) {
        const validTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                           'text/plain'];
        
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF, DOC, DOCX, or TXT file.');
            return;
        }
        
        fileName.textContent = file.name;
        
        try {
            loadingIndicator.style.display = 'block';
            resumeContent = await extractTextFromFile(file);
            console.log('Resume content extracted:', resumeContent);
            loadingIndicator.style.display = 'none';
        } catch (error) {
            console.error('Error extracting text from file:', error);
            resumeContent = 'Software Developer with experience in web technologies.';
            loadingIndicator.style.display = 'none';
        }
    }

    // Analyze resume and update content
    function analyzeResumeAndUpdateContent(designation) {
        if (!designation) {
            alert('Please select your target job role before analyzing.');
            return;
        }
        
        document.getElementById('designation-section').style.display = 'none';
        
        const atsResult = calculateATSScore(resumeContent, designation);
        const feedback = generateFeedback(atsResult.score, atsResult.matchedKeywords, atsResult.missingKeywords, designation, resumeContent);
        
        updateDashboardWithATSResults(atsResult, feedback, designation);
    }

    // Analyze button click
    analyzeBtn.addEventListener('click', function() {
        if (fileName.textContent === 'No file selected') {
            alert('Please select a resume file to analyze.');
            return;
        }
        
        const designation = document.getElementById('designation').value;
        if (!designation) {
            document.getElementById('designation-error').style.display = 'block';
            document.getElementById('designation').classList.add('error');
            return;
        }
        
        loadingIndicator.style.display = 'block';
        analysisResults.style.display = 'none';
        recommendationsSection.style.display = 'none';
        
        setTimeout(function() {
            loadingIndicator.style.display = 'none';
            analysisResults.style.display = 'block';
            recommendationsSection.style.display = 'block';
            
            analyzeResumeAndUpdateContent(designation);
            applyFilters();
            analysisResults.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    });
    
    // Add error handling for designation
    document.getElementById('designation').addEventListener('change', function() {
        if (this.value) {
            document.getElementById('designation-error').style.display = 'none';
            this.classList.remove('error');
        }
    });
    
    // Job action buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('job-save')) {
            const jobTitle = e.target.closest('.job-card').querySelector('.job-title').textContent;
            alert(`Saved job: ${jobTitle}`);
            e.target.textContent = 'Saved';
            e.target.disabled = true;
        }
        
        if (e.target.classList.contains('job-apply')) {
            const jobTitle = e.target.closest('.job-card').querySelector('.job-title').textContent;
            const company = e.target.closest('.job-card').querySelector('.job-company').textContent;
            alert(`Applying to: ${jobTitle} at ${company}\n\nIn a real application, this would redirect to the job application page.`);
        }
    });
    
    // Apply initial filters
    applyFilters();
});