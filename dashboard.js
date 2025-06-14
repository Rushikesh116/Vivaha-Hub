document.addEventListener('DOMContentLoaded', () => {
    // Get shortlisted profiles from localStorage
    const shortlistedProfiles = JSON.parse(localStorage.getItem('shortlistedProfiles')) || [];
    
    // Render shortlisted profiles
    renderShortlistedProfiles();

    // Add event listeners for send interest buttons
    document.querySelectorAll('.send-interest').forEach(button => {
        button.addEventListener('click', (e) => {
            showToast('Interest sent successfully!', 'success');
            createFloatingHearts(e.clientX, e.clientY);
        });
    });

    function renderShortlistedProfiles() {
        const shortlistGrid = document.getElementById('shortlistGrid');
        if (!shortlistGrid) return;

        if (shortlistedProfiles.length === 0) {
            shortlistGrid.innerHTML = '<p>No profiles shortlisted yet.</p>';
            return;
        }

        shortlistGrid.innerHTML = '';
        shortlistedProfiles.forEach(profileId => {
            const profile = sampleProfiles.find(p => p.id === profileId);
            if (!profile) return;

            const card = document.createElement('div');
            card.className = 'shortlist-card';
            card.innerHTML = `
                <img src="${profile.image}" alt="${profile.name}" class="shortlist-image">
                <div class="shortlist-info">
                    <h4>${profile.name}</h4>
                    <p>${profile.age} years | ${profile.occupation}</p>
                    <p>${profile.location}</p>
                    <div class="shortlist-actions">
                        <button class="view-btn" onclick="window.open('profile-detail.html?id=${profile.id}', '_blank')">View Profile</button>
                        <button class="remove-btn" data-id="${profile.id}">Remove</button>
                    </div>
                </div>
            `;
            shortlistGrid.appendChild(card);
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const profileId = parseInt(e.target.dataset.id);
                removeFromShortlist(profileId);
            });
        });
    }

    function removeFromShortlist(profileId) {
        const index = shortlistedProfiles.indexOf(profileId);
        if (index > -1) {
            shortlistedProfiles.splice(index, 1);
            localStorage.setItem('shortlistedProfiles', JSON.stringify(shortlistedProfiles));
            renderShortlistedProfiles();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData) {
        // Update profile picture
        const profilePicture = document.querySelector('.profile-picture');
        if (profilePicture) {
            profilePicture.src = userData.profilePhoto;
        }

        // Update user info
        const userInfo = document.querySelector('.user-info h2');
        if (userInfo) {
            userInfo.textContent = `Welcome, ${userData.fullname}`;
        }

        // Update profile ID (you can generate a unique ID based on email or other data)
        const profileId = document.querySelector('.user-info p');
        if (profileId) {
            const id = 'VH' + Math.random().toString(36).substr(2, 6).toUpperCase();
            profileId.textContent = `Profile ID: ${id}`;
        }

        // Update member since date
        const memberSince = document.querySelectorAll('.user-info p')[1];
        if (memberSince) {
            const date = new Date();
            const month = date.toLocaleString('default', { month: 'long' });
            memberSince.textContent = `Member Since: ${month} ${date.getFullYear()}`;
        }

        // Calculate profile completion percentage
        const requiredFields = ['fullname', 'gender', 'dob', 'religion', 'education', 'occupation', 'location', 'about'];
        const completedFields = requiredFields.filter(field => userData[field] && userData[field].trim() !== '');
        const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

        // Update profile completion
        const progressBar = document.querySelector('.progress');
        const completionText = document.querySelector('.profile-completion p');
        if (progressBar && completionText) {
            progressBar.style.width = `${completionPercentage}%`;
            completionText.textContent = `${completionPercentage}% Complete`;
        }
    }
}); 
