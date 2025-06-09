document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Dropdowns ---
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        // Optional: Show dropdown on hover (CSS handles this, but JS can add more control)
        // dropbtn.addEventListener('mouseenter', () => {
        //     dropdownContent.style.display = 'block';
        // });
        // dropdown.addEventListener('mouseleave', () => {
        //     dropdownContent.style.display = 'none';
        // });

        // For mobile accessibility (click to toggle)
        dropbtn.addEventListener('click', (event) => {
            if (window.innerWidth <= 768) { // Only for smaller screens where hover might not work
                event.preventDefault(); // Prevent default link behavior
                dropdownContent.classList.toggle('show');
            }
        });
    });

    // Close dropdowns if user clicks outside
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn')) {
            dropdowns.forEach(dropdown => {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                if (dropdownContent && dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            });
        }
    });

    // --- CRUD Form Toggling (Example for Talent Page) ---
    const showAddTalentFormBtn = document.getElementById('showAddTalentFormBtn');
    const talentFormContainer = document.getElementById('talentFormContainer');
    const cancelTalentFormBtn = document.getElementById('cancelTalentFormBtn');
    const talentForm = document.getElementById('talentForm');
    const formTitle = document.getElementById('formTitle');
    const formMode = document.getElementById('formMode');
    const currentProfilePic = document.getElementById('currentProfilePic');

    if (showAddTalentFormBtn) {
        showAddTalentFormBtn.addEventListener('click', () => {
            talentFormContainer.classList.remove('hidden');
            formTitle.textContent = 'Add New';
            formMode.value = 'add';
            talentForm.reset(); // Clear form fields
            currentProfilePic.style.display = 'none'; // Hide current pic on add
        });
    }

    if (cancelTalentFormBtn) {
        cancelTalentFormBtn.addEventListener('click', () => {
            talentFormContainer.classList.add('hidden');
        });
    }

    // Event Delegation for Edit/Delete Buttons (since they're loaded dynamically by PHP)
    const talentDisplayArea = document.querySelector('.talent-display #talentGrid');
    if (talentDisplayArea) {
        talentDisplayArea.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-btn')) {
                const talentId = event.target.dataset.id;
                // PHP Integration Suggestion:
                // 1. You would make an AJAX call here (e.g., fetch('/php/get_talent.php?id=' + talentId))
                //    to get the talent's data from the database.
                // 2. Populate the form fields with the retrieved data.
                // 3. Change formMode.value = 'edit';
                // 4. Update formTitle.textContent = 'Edit';
                // 5. Show talentFormContainer.classList.remove('hidden');
                console.log('Edit talent with ID:', talentId);
                alert('Edit functionality not yet implemented via PHP. ID: ' + talentId);
                // Simulate form population for demo
                talentFormContainer.classList.remove('hidden');
                formTitle.textContent = 'Edit';
                formMode.value = 'edit';
                talentForm.elements['talent_id'].value = talentId;
                talentForm.elements['full_name'].value = 'Simulated Name ' + talentId;
                talentForm.elements['stage_name'].value = 'Stage ' + talentId;
                currentProfilePic.src = 'images/artist_placeholder.jpg'; // Simulate existing pic
                currentProfilePic.style.display = 'block';

            } else if (event.target.classList.contains('delete-btn')) {
                const talentId = event.target.dataset.id;
                if (confirm('Are you sure you want to delete this talent?')) {
                    // PHP Integration Suggestion:
                    // Make an AJAX call here (e.g., fetch('/php/delete_talent.php', {method: 'POST', body: JSON.stringify({id: talentId})}))
                    // or redirect to a PHP script: window.location.href = 'php/delete_talent.php?id=' + talentId;
                    // On success, remove the card from the DOM or reload the list.
                    console.log('Delete talent with ID:', talentId);
                    alert('Delete functionality not yet implemented via PHP. ID: ' + talentId);
                    // Simulate removal for demo
                    event.target.closest('.talent-card').remove();
                }
            }
        });
    }

    // --- Search/Filter Logic (Client-side UI handling) ---
    const talentSearchInput = document.getElementById('talentSearchInput');
    const talentFilterType = document.getElementById('talentFilterType');
    const talentFilterGroup = document.getElementById('talentFilterGroup');
    const talentGrid = document.getElementById('talentGrid');
    const noTalentFound = document.getElementById('noTalentFound');

    // This part is *client-side only* for UI filtering.
    // For actual data filtering from DB, you'd send these values to PHP via form submit or AJAX.
    function applyTalentFilters() {
        const searchText = talentSearchInput ? talentSearchInput.value.toLowerCase() : '';
        const filterType = talentFilterType ? talentFilterType.value : 'all';
        const filterGroup = talentFilterGroup ? talentFilterGroup.value : 'all';

        // PHP Integration Suggestion:
        // Instead of filtering existing DOM elements, you'd make an AJAX call to a PHP script:
        // fetch('/php/get_filtered_talent.php?search=' + searchText + '&type=' + filterType + '&group=' + filterGroup)
        // and then update the talentGrid.innerHTML with the PHP-generated HTML.

        console.log(`Filtering: Search="${searchText}", Type="${filterType}", Group="${filterGroup}"`);
        // Simulate filtering (in a real app, PHP would return filtered data)
        const talentCards = talentGrid ? talentGrid.querySelectorAll('.talent-card') : [];
        let foundCount = 0;

        talentCards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const role = card.querySelector('.talent-role') ? card.querySelector('.talent-role').textContent.toLowerCase() : '';
            const group = card.querySelector('.talent-group') ? card.querySelector('.talent-group').textContent.toLowerCase() : ''; // Will need actual group ID/name
            let display = true;

            if (searchText && !name.includes(searchText)) {
                display = false;
            }

            if (filterType !== 'all') {
                if (filterType === 'artists' && !role.includes('artist')) display = false;
                if (filterType === 'actors' && !role.includes('actor')) display = false;
                if (filterType === 'soloists' && !role.includes('soloist')) display = false;
                if (filterType === 'group_members' && !group.includes('group')) display = false; // This is a rough check
            }

            if (filterGroup !== 'all' && !group.includes(filterGroup)) { // This assumes group ID/name is in card
                display = false;
            }

            if (display) {
                card.style.display = 'block';
                foundCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noTalentFound) {
            noTalentFound.classList.toggle('hidden', foundCount > 0);
        }
    }

    // Attach event listeners for search and filters
    if (talentSearchInput) talentSearchInput.addEventListener('keyup', applyTalentFilters);
    if (talentFilterType) talentFilterType.addEventListener('change', applyTalentFilters);
    if (talentFilterGroup) talentFilterGroup.addEventListener('change', applyTalentFilters);

    // Call once on load if there's existing data to filter
    applyTalentFilters();

    // --- General Form Submission Handling (Preventing Default) ---
    // If you plan to use AJAX for form submissions instead of full page reloads.
    // Example: talentForm.addEventListener('submit', async (event) => { event.preventDefault(); /* AJAX logic here */ });
    // For now, HTML forms will submit to PHP directly as per PHP choice.
});