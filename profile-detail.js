document.addEventListener('DOMContentLoaded', () => {
    // Get profile ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    if (!profileId) {
        window.location.href = 'profiles.html';
        return;
    }

    // Find profile from sampleProfiles array
    const profile = sampleProfiles.find(p => p.id === parseInt(profileId));

    if (!profile) {
        window.location.href = 'profiles.html';
        return;
    }

    // Get shortlisted profiles from localStorage
    const shortlistedProfiles = JSON.parse(localStorage.getItem('shortlistedProfiles')) || [];
    const isShortlisted = shortlistedProfiles.includes(parseInt(profileId));

    // Update profile information
    document.getElementById('profileImage').src = profile.image;
    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileAge').textContent = `${profile.age} years`;
    document.getElementById('profileLocation').textContent = profile.location;
    document.getElementById('profileReligion').textContent = profile.religion;
    document.getElementById('profileZodiac').textContent = profile.zodiac ? 
        profile.zodiac.charAt(0).toUpperCase() + profile.zodiac.slice(1) : 
        'Not specified';
    document.getElementById('profileBio').textContent = profile.bio || 'No bio available';

    // Update detailed information
    document.getElementById('detailAge').textContent = profile.age;
    document.getElementById('detailHeight').textContent = profile.height || 'Not specified';
    document.getElementById('detailMaritalStatus').textContent = profile.maritalStatus || 'Not specified';
    document.getElementById('detailMotherTongue').textContent = profile.motherTongue || 'Not specified';
    document.getElementById('detailEducation').textContent = profile.education;
    document.getElementById('detailOccupation').textContent = profile.occupation;
    document.getElementById('detailIncome').textContent = profile.income || 'Not specified';
    document.getElementById('detailWorkLocation').textContent = profile.workLocation || profile.location;
    document.getElementById('detailFamilyType').textContent = profile.familyType || 'Not specified';
    document.getElementById('detailFamilyStatus').textContent = profile.familyStatus || 'Not specified';
    document.getElementById('detailFatherOccupation').textContent = profile.fatherOccupation || 'Not specified';
    document.getElementById('detailMotherOccupation').textContent = profile.motherOccupation || 'Not specified';

    // Add gallery images if available
    if (profile.gallery && profile.gallery.length > 0) {
        const galleryPreview = document.querySelector('.gallery-preview');
        profile.gallery.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Gallery Image';
            img.addEventListener('click', () => {
                document.getElementById('profileImage').src = imageUrl;
            });
            galleryPreview.appendChild(img);
        });
    }

    // Add partner preferences if available
    if (profile.partnerPreferences && profile.partnerPreferences.length > 0) {
        const preferencesContainer = document.getElementById('partnerPreferences');
        profile.partnerPreferences.forEach(preference => {
            const preferenceItem = document.createElement('div');
            preferenceItem.className = 'preference-item';
            preferenceItem.textContent = preference;
            preferencesContainer.appendChild(preferenceItem);
        });
    }

    // Handle action buttons
    document.querySelector('.send-interest').addEventListener('click', (e) => {
        showToast('Interest sent successfully!', 'success');
        createFloatingHearts(e.clientX, e.clientY);
    });

    document.querySelector('.message').addEventListener('click', () => {
        alert('Message feature coming soon!');
    });

    const shortlistButton = document.querySelector('.shortlist');
    const heartIcon = shortlistButton.querySelector('.heart-icon');
    
    // Set initial shortlist state
    if (isShortlisted) {
        heartIcon.textContent = '♥';
    }

    shortlistButton.addEventListener('click', () => {
        const profileId = parseInt(profile.id);
        const shortlistedProfiles = JSON.parse(localStorage.getItem('shortlistedProfiles')) || [];
        const index = shortlistedProfiles.indexOf(profileId);

        if (index === -1) {
            // Add to shortlist
            shortlistedProfiles.push(profileId);
            heartIcon.textContent = '♥';
            showToast('Profile added to shortlist!', 'success');
        } else {
            // Remove from shortlist
            shortlistedProfiles.splice(index, 1);
            heartIcon.textContent = '♡';
            showToast('Profile removed from shortlist!', 'info');
        }

        localStorage.setItem('shortlistedProfiles', JSON.stringify(shortlistedProfiles));
    });

    // Premium check for astrological details
    const isPremium = localStorage.getItem('isPremium') === 'true';
    const astroSection = document.getElementById('astroSection');
    const astroPrompt = document.getElementById('astroPremiumPrompt');
    if (!isPremium) {
        astroSection.style.display = 'none';
        astroPrompt.style.display = 'block';
        astroPrompt.innerHTML = `
            <h3>Astrological Details</h3>
            <div style="margin:1.5rem 0; font-size:1.1rem; color:#b00;">Unlock Premium to view astrological details for this profile.</div>
            <a href="premium.html" class="btn btn-primary">Unlock Premium</a>
        `;
    } else {
        astroSection.style.display = 'block';
        astroPrompt.style.display = 'none';
    }
}); 
