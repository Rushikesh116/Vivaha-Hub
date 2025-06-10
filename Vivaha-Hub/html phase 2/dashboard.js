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