document.addEventListener('DOMContentLoaded', function() {
    // Protect dashboard, profiles, and search pages
    const protectedPages = ['dashboard.html', 'profiles.html', 'search.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'login.html';
            return;
        }
    }

    // Navigation active state
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Logout button logic
    const nav = document.querySelector('nav');
    if (nav && !document.getElementById('logoutBtn') && currentPage === 'dashboard.html') {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.className = 'btn btn-primary';
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.marginLeft = '1rem';
        logoutBtn.onclick = function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        };
        nav.appendChild(logoutBtn);
    }

    // Hide logout button if not logged in or not on dashboard
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && (!localStorage.getItem('isLoggedIn') || currentPage !== 'dashboard.html')) {
        logoutBtn.style.display = 'none';
    }

    // Registration form handler
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);

            // Validation logic
            let isValid = true;
            const errors = [];

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email || '')) {
                errors.push('Please enter a valid email address');
                isValid = false;
            }

            // Password validation
            if ((data.password || '').length < 8) {
                errors.push('Password must be at least 8 characters long');
                isValid = false;
            }

            // Confirm password
            if (data.password !== data['confirm-password']) {
                errors.push('Passwords do not match');
                isValid = false;
            }

            // Terms and conditions
            if (!data.terms) {
                errors.push('You must agree to the Terms and Conditions');
                isValid = false;
            }

            if (isValid) {
                // Save new user to localStorage
                const newUser = {
                    email: data.email,
                    password: data.password
                };
                const users = JSON.parse(localStorage.getItem('users')) || [];
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                showToast('Registration successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                errors.forEach(error => showToast(error, 'error'));
            }
        });
    }

    // Login form handler
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            handleLogin(email, password);
        });
    }

    // Profile photo preview
    const imageInput = document.getElementById('profile-photo');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.querySelector('.image-preview').src = e.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Dynamic profiles rendering
    if (document.getElementById('profilesGrid')) {
        renderProfiles(sampleProfiles, {});
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                const age = document.getElementById('ageFilter').value;
                const location = document.getElementById('locationFilter').value;
                const education = document.getElementById('educationFilter').value;
                renderProfiles(sampleProfiles, { age, location, education });
            });
        }
    }

    // Search functionality
    if (document.querySelector('.search-btn')) {
        document.querySelector('.search-btn').addEventListener('click', function(e) {
            e.preventDefault();
            const minAge = document.querySelector('input[placeholder="Min Age"]').value;
            const maxAge = document.querySelector('input[placeholder="Max Age"]').value;
            const religion = document.querySelector('select[name="religion"]')?.value || '';
            const zodiac = document.querySelector('select[name="zodiac"]')?.value || '';
            const education = document.querySelector('select[name="education"]')?.value || '';
            const location = document.querySelector('input[placeholder="Enter city"]').value;
            const maritalStatus = document.querySelector('select[name="marital-status"]')?.value || '';
            renderProfiles(sampleProfiles, {
                minAge, maxAge, religion, zodiac, education, location, maritalStatus
            }, 'searchResults');
        });
    }

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to handle scroll animations
    function handleScrollAnimations() {
        const features = document.querySelector('.features');
        const testimonials = document.querySelector('.testimonials');

        if (features && isInViewport(features)) {
            features.classList.add('active');
        }

        if (testimonials && isInViewport(testimonials)) {
            testimonials.classList.add('active');
        }
    }

    // Initial check
    handleScrollAnimations();

    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);
});

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Authentication logic
const validCredentials = [
    { email: "user1@example.com", password: "password123" },
    { email: "user2@example.com", password: "password123" },
    { email: "admin@vivahahub.com", password: "admin123" }
];

function handleLogin(email, password) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const allUsers = [...validCredentials, ...storedUsers]; // Merge arrays
    const user = allUsers.find(cred =>
        cred.email === email && cred.password === password
    );

    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        showToast('Login successful!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } else {
        showToast('Invalid email or password', 'error');
    }
}

// Sample profile data
const sampleProfiles = [
    {
        id: 1,
        name: "Sarah Johnson",
        age: 28,
        occupation: "Software Engineer",
        location: "Mumbai, India",
        education: "B.Tech",
        religion: "Hindu",
        image: "images/mannsi.jpg",
        bio: "Hi! I'm a passionate software engineer who loves to code and create innovative solutions. In my free time, I enjoy reading, traveling, and learning new technologies. Looking for someone who shares my enthusiasm for life and technology.",
        height: "5'6\"",
        maritalStatus: "Never Married",
        motherTongue: "Hindi",
        workLocation: "Mumbai, India",
        income: "15-20 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 27-32 years",
            "Minimum Bachelor's degree",
            "Professional background",
            "Family-oriented values",
            "Based in Mumbai or willing to relocate"
        ],
        gallery: [
            "images/mannsi.jpg",
        ],
        zodiac: "Leo"
    },
    {
        id: 2,
        name: "Michael Chen",
        age: 32,
        occupation: "Doctor",
        location: "Delhi, India",
        education: "MBBS",
        religion: "Christian",
        image: "images/sree.jpg",
        bio: "Dedicated medical professional with a passion for helping others. I believe in maintaining a healthy work-life balance. Looking for a life partner who values compassion, integrity, and has a good sense of humor.",
        height: "5'10\"",
        maritalStatus: "Never Married",
        motherTongue: "English",
        workLocation: "Delhi, India",
        income: "25-30 LPA",
        familyType: "Joint",
        familyStatus: "Upper Middle Class",
        fatherOccupation: "Business Owner",
        motherOccupation: "Teacher",
        partnerPreferences: [
            "Age between 26-31 years",
            "Well-educated",
            "Understanding of medical profession's demands",
            "Kind and compassionate nature",
            "Family values"
        ],
        gallery: [
            "images/sree.jpg",
        ],
        zodiac: "Virgo"
    },
    {
        id: 12,
        name: "Kevin Paul",
        age: 35,
        occupation: "Neurosurgeon",
        location: "Chennai, India",
        education: "MBBS",
        religion: "Christian",
        image: "images/yaswanth.jpg",
        bio: "Neurosurgeon with a passion for brain health. I enjoy playing cricket and reading books. Looking for a life partner who values health and fitness.",
        height: "5'11\"",
        maritalStatus: "Never Married",
        motherTongue: "Tamil",
        workLocation: "Chennai, India",
        income: "25-30 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 33-38 years",
            "Minimum Bachelor's degree",
            "Medical background",
            "Family-oriented values",
            "Based in Chennai or willing to relocate"
        ],
        gallery: [
            "images/yaswanth.jpg",
        ],
        zodiac: "Gemini"
    },
    {
        id: 4,
        name: "Rahul Verma",
        age: 30,
        occupation: "Investment Banker",
        location: "Mumbai, India",
        education: "B.Tech",
        religion: "Hindu",
        image:"images/lokesh.jpg",
        bio: "Experienced investment banker with a passion for finance and technology. I enjoy traveling and exploring different cultures. Looking for a life partner who values growth and adventure.",
        height: "5'8\"",
        maritalStatus: "Never Married",
        motherTongue: "Hindi",
        workLocation: "Mumbai, India",
        income: "18-25 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 28-33 years",
            "Minimum Bachelor's degree",
            "Finance or economics background",
            "Family-oriented values",
            "Based in Mumbai or willing to relocate"
        ],
        gallery: [
            "images/lokesh.jpg",
        ],
        zodiac: "Virgo"
    },
    {
        id: 5,
        name: "Aisha Khan",
        age: 26,
        occupation: "Marketing Manager",
        location: "Delhi, India",
        education: "B.Tech",
        religion: "Muslim",
        image: "images/hasini.jpg",
        bio: "Marketing manager with a creative mind and a passion for branding. I love exploring new cultures and experiencing different cuisines. Looking for a life partner who shares my enthusiasm for life and culture.",
        height: "5'5\"",
        maritalStatus: "Never Married",
        motherTongue: "Urdu",
        workLocation: "Delhi, India",
        income: "12-18 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 25-30 years",
            "Minimum Bachelor's degree",
            "Marketing or advertising background",
            "Family-oriented values",
            "Based in Delhi or willing to relocate"
        ],
        gallery: [
            "images/hasini.jpg",
        ],
        zodiac: "Gemini"
    },
    {
        id: 6,
        name: "Raj Malhotra",
        age: 34,
        occupation: "Cardiologist",
        location: "Chennai, India",
        education: "MBBS",
        religion: "Hindu",
        image: "images/sooraj.jpg",
        bio: "Cardiologist with a passion for heart health. I enjoy playing cricket and reading books. Looking for a life partner who values health and fitness.",
        height: "5'10\"",
        maritalStatus: "Never Married",
        motherTongue: "Tamil",
        workLocation: "Chennai, India",
        income: "20-25 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 32-37 years",
            "Minimum Bachelor's degree",
            "Medical background",
            "Family-oriented values",
            "Based in Chennai or willing to relocate"
        ],
        gallery: [
            "images/sooraj.jpg",
        ],
        zodiac: "Taurus"
    },
    {
        id: 7,
        name: "Maya Patel",
        age: 29,
        occupation: "Architect",
        location: "Bangalore, India",
        education: "B.Tech",
        religion: "Hindu",
        image: "images/rupti.jpg",
        bio: "Architect with a passion for design and creativity. I love exploring new cultures and experiencing different cuisines. Looking for a life partner who shares my enthusiasm for life and culture.",
        height: "5'7\"",
        maritalStatus: "Never Married",
        motherTongue: "Kannada",
        workLocation: "Bangalore, India",
        income: "15-20 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 28-33 years",
            "Minimum Bachelor's degree",
            "Architecture or design background",
            "Family-oriented values",
            "Based in Bangalore or willing to relocate"
        ],
        gallery: [
            "images/rupti.jpg",
        ],
        zodiac: "Libra"
    },
    {
        id: 8,
        name: "Thomas George",
        age: 31,
        occupation: "Professor",
        location: "Chennai, India",
        education: "M.Tech",
        religion: "Christian",
        image: "images/vinayak.jpg",
        bio: "Professor with a passion for teaching and research. I enjoy playing cricket and reading books. Looking for a life partner who values growth and adventure.",
        height: "5'9\"",
        maritalStatus: "Never Married",
        motherTongue: "Tamil",
        workLocation: "Chennai, India",
        income: "18-25 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 29-34 years",
            "Minimum Bachelor's degree",
            "Education background",
            "Family-oriented values",
            "Based in Chennai or willing to relocate"
        ],
        gallery: [
            "images/vinayak.jpg",
        ],
        zodiac: "Taurus"
    },
    {
        id: 9,
        name: "Zara Ahmed",
        age: 28,
        occupation: "Fashion Designer",
        location: "Mumbai, India",
        education: "B.Tech",
        religion: "Muslim",
        image: "images/ram.jpg",
        bio: "Fashion designer with a passion for fashion and creativity. I love exploring new cultures and experiencing different cuisines. Looking for a life partner who shares my enthusiasm for life and culture.",
        height: "5'6\"",
        maritalStatus: "Never Married",
        motherTongue: "Urdu",
        workLocation: "Mumbai, India",
        income: "15-20 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 27-32 years",
            "Minimum Bachelor's degree",
            "Fashion or design background",
            "Family-oriented values",
            "Based in Mumbai or willing to relocate"
        ],
        gallery: [
            "images/ram.jpg",
        ],
        zodiac: "Libra"
    },
    {
        id: 10,
        name: "Arjun Reddy",
        age: 33,
        occupation: "Entrepreneur",
        location: "Bangalore, India",
        education: "M.Tech",
        religion: "Hindu",
        image: "images/mohith.jpg",
        bio: "Entrepreneur with a passion for technology and innovation. I enjoy playing cricket and reading books. Looking for a life partner who values growth and adventure.",
        height: "5'10\"",
        maritalStatus: "Never Married",
        motherTongue: "Telugu",
        workLocation: "Bangalore, India",
        income: "18-25 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 31-36 years",
            "Minimum Bachelor's degree",
            "Entrepreneurial background",
            "Family-oriented values",
            "Based in Bangalore or willing to relocate"
        ],
        gallery: [
            "images/mohith.jpg",
        ],
        zodiac: "Taurus"
    },
    {
        id: 11,
        name: "Ananya Desai",
        age: 25,
        occupation: "Product Manager",
        location: "Delhi, India",
        education: "B.Tech",
        religion: "Hindu",
        image: "images/nan.jpg",
        bio: "Product manager with a passion for technology and innovation. I love exploring new cultures and experiencing different cuisines. Looking for a life partner who shares my enthusiasm for life and culture.",
        height: "5'5\"",
        maritalStatus: "Never Married",
        motherTongue: "Hindi",
        workLocation: "Delhi, India",
        income: "12-18 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 24-29 years",
            "Minimum Bachelor's degree",
            "Product management background",
            "Family-oriented values",
            "Based in Delhi or willing to relocate"
        ],
        gallery: [
            "images/nan.jpg",
        ],
        zodiac: "Gemini"
    },
    {
        id: 3,
        name: "Priya Sharma",
        age: 27,
        occupation: "Data Scientist",
        location: "Bangalore, India",
        education: "M.Tech",
        religion: "Hindu",
        image: "images/vamsika.jpg",
        bio: "Data scientist with a knack for solving complex problems. I love exploring new technologies and applying them to real-world problems. Looking for someone who shares my passion for data and innovation.",
        height: "5'4\"",
        maritalStatus: "Never Married",
        motherTongue: "Kannada",
        workLocation: "Bangalore, India",
        income: "12-18 LPA",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
        fatherOccupation: "Retired Government Officer",
        motherOccupation: "Homemaker",
        partnerPreferences: [
            "Age between 26-31 years",
            "Minimum Master's degree",
            "Data-oriented background",
            "Family-oriented values",
            "Based in Bangalore or willing to relocate"
        ],
        gallery: [
            "images/vamsika.jpg",
        ],
        zodiac: "Libra"
    }
];

function renderProfiles(profiles, filters = {}, gridId = 'profilesGrid') {
    let filtered = profiles;

    // Filtering logic
    if (filters.age) {
        const [min, max] = filters.age.split('-').map(Number);
        filtered = filtered.filter(p => p.age >= min && p.age <= max);
    }
    if (filters.location) {
        filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.education) {
        filtered = filtered.filter(p => p.education === filters.education);
    }
    if (filters.minAge) {
        filtered = filtered.filter(p => p.age >= Number(filters.minAge));
    }
    if (filters.maxAge) {
        filtered = filtered.filter(p => p.age <= Number(filters.maxAge));
    }
    if (filters.religion) {
        filtered = filtered.filter(p => p.religion.toLowerCase() === filters.religion.toLowerCase());
    }
    if (filters.zodiac && filters.zodiac !== '') {
        filtered = filtered.filter(p => p.zodiac && p.zodiac.toLowerCase() === filters.zodiac.toLowerCase());
    }
    if (filters.maritalStatus) {
        // Add marital status to sampleProfiles and filter here if needed
    }

    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    if (filtered.length === 0) {
        grid.innerHTML = '<p>No profiles found.</p>';
        return;
    }
    filtered.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}" class="profile-image">
            <div class="profile-info">
                <h3>${profile.name}</h3>
                <p>${profile.age} years | ${profile.occupation}</p>
                <p>${profile.location}</p>
                <p>Education: ${profile.education} | Religion: ${profile.religion}</p>
                <p>Zodiac: ${profile.zodiac || 'Not specified'}</p>
                <a href="profile-detail.html?id=${profile.id}" target="_blank" class="btn btn-primary view-profile">View Profile</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Success Stories Data
const successStories = {
    1: {
        title: "Priya & Rahul",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80",
        story: "Our journey began when we matched on Vivaha Hub in January 2023. From our first conversation, we knew there was something special. We shared similar values, interests, and life goals. After months of getting to know each other through messages and video calls, we finally met in person. It was even better than we imagined! Our families met soon after, and everything fell into place perfectly. We're grateful to Vivaha Hub for bringing us together and helping us find our perfect match.",
        metDate: "January 15, 2023",
        marriageDate: "November 25, 2023"
    },
    2: {
        title: "Anjali & Vikram",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        story: "We connected on Vivaha Hub in March 2023. What started as casual conversations quickly turned into deep, meaningful discussions about life, family, and our dreams for the future. We both knew we had found someone special. Our first meeting was at a coffee shop, and we talked for hours! Our families were thrilled when they met, and everything progressed smoothly. We're now happily married and building our life together. Thank you, Vivaha Hub, for this beautiful journey!",
        metDate: "March 8, 2023",
        marriageDate: "December 12, 2023"
    }
};

// Popup functionality
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('storyPopup');
    const closeBtn = document.querySelector('.close-popup');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    // Open popup with story content
    function openPopup(storyId) {
        const story = successStories[storyId];
        document.getElementById('popupImage').src = story.image;
        document.getElementById('popupTitle').textContent = story.title;
        document.getElementById('popupStory').textContent = story.story;
        document.getElementById('popupMetDate').textContent = story.metDate;
        document.getElementById('popupMarriageDate').textContent = story.marriageDate;
        popup.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }

    // Close popup
    function closePopup() {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Event listeners
    testimonialCards.forEach(card => {
        card.addEventListener('click', () => {
            const storyId = card.getAttribute('data-story');
            openPopup(storyId);
        });
    });

    closeBtn.addEventListener('click', closePopup);

    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.style.display === 'block') {
            closePopup();
        }
    });
});

// Create floating hearts animation
function createFloatingHearts(x, y) {
    const hearts = ['❤', '💖', '💝', '💗', '💓'];
    const container = document.body;

    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Set initial position
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        
        // Set random movement
        const tx = (Math.random() - 0.5) * 100; // Random X translation
        const r = (Math.random() - 0.5) * 60; // Random rotation
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--r', `${r}deg`);
        
        container.appendChild(heart);
        
        // Remove heart after animation
        heart.addEventListener('animationend', () => heart.remove());
    }
}

// Function to display profile details
function displayProfileDetails(profile) {
    // Basic info
    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileImage').src = profile.image;
    document.getElementById('profileAge').textContent = `${profile.age} years`;
    document.getElementById('profileLocation').textContent = profile.location;
    document.getElementById('profileReligion').textContent = profile.religion;
    document.getElementById('profileZodiac').textContent = profile.zodiac;

    // Gallery
    const galleryPreview = document.querySelector('.gallery-preview');
    if (galleryPreview && profile.gallery) {
        galleryPreview.innerHTML = '';
        profile.gallery.forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = 'Gallery Image';
            imgElement.addEventListener('click', () => {
                document.getElementById('profileImage').src = img;
            });
            galleryPreview.appendChild(imgElement);
        });
    }

    // Partner Preferences
    const preferencesContainer = document.getElementById('partnerPreferences');
    if (preferencesContainer && profile.partnerPreferences) {
        preferencesContainer.innerHTML = `
            <ul class="preferences-list">
                ${profile.partnerPreferences.map(pref => `<li>${pref}</li>`).join('')}
            </ul>
        `;
    }

    // Other details...
    if (document.getElementById('detailAge')) document.getElementById('detailAge').textContent = `${profile.age} years`;
    if (document.getElementById('detailHeight')) document.getElementById('detailHeight').textContent = profile.height || 'Not specified';
    if (document.getElementById('detailMaritalStatus')) document.getElementById('detailMaritalStatus').textContent = profile.maritalStatus || 'Not specified';
    if (document.getElementById('detailMotherTongue')) document.getElementById('detailMotherTongue').textContent = profile.motherTongue || 'Not specified';
    if (document.getElementById('detailEducation')) document.getElementById('detailEducation').textContent = profile.education;
    if (document.getElementById('detailOccupation')) document.getElementById('detailOccupation').textContent = profile.occupation;
    if (document.getElementById('detailIncome')) document.getElementById('detailIncome').textContent = profile.income || 'Not specified';
    if (document.getElementById('detailWorkLocation')) document.getElementById('detailWorkLocation').textContent = profile.workLocation || profile.location;
    if (document.getElementById('detailFamilyType')) document.getElementById('detailFamilyType').textContent = profile.familyType || 'Not specified';
    if (document.getElementById('detailFamilyStatus')) document.getElementById('detailFamilyStatus').textContent = profile.familyStatus || 'Not specified';
    if (document.getElementById('detailFatherOccupation')) document.getElementById('detailFatherOccupation').textContent = profile.fatherOccupation || 'Not specified';
    if (document.getElementById('detailMotherOccupation')) document.getElementById('detailMotherOccupation').textContent = profile.motherOccupation || 'Not specified';
    if (document.getElementById('detailZodiac')) document.getElementById('detailZodiac').textContent = profile.zodiac || 'Not specified';
}
