document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a menu item
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenuToggle.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    });
    
    // Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = this.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdownMenu.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
    
    // DATABASE INTEGRATION PREPARATION
    // This function will be used in the future to load academics from a database
    function loadAcademicsFromDatabase(containerId, template, limit = 0) {
        // In the future, this will make an AJAX request to the server
        // For now, we'll simulate with a dummy response
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Example API endpoint that would be used
        // const apiUrl = '/api/academics?limit=' + limit;
        
        // Simulated data that would come from the database
        const dummyAcademics = [
            {
                id: 'ahmet-yilmaz',
                name: 'Prof. Dr. Ahmet Yılmaz',
                department: 'Bilgisayar Mühendisliği',
                rating: 5.0,
                appointmentDuration: '30dk',
                image: 'img/academic1.jpg'
            },
            {
                id: 'ayse-kaya',
                name: 'Doç. Dr. Ayşe Kaya',
                department: 'İşletme',
                rating: 4.8,
                appointmentDuration: '45dk',
                image: 'img/academic2.jpg'
            }
            // More academics would be loaded from the database
        ];
        
        // For future implementation:
        // fetch(apiUrl)
        //     .then(response => response.json())
        //     .then(academics => {
        //         renderAcademics(container, academics, template);
        //     })
        //     .catch(error => {
        //         console.error('Error loading academics:', error);
        //     });
        
        // For now, we'll just use the dummy data directly
        // This would be replaced with the data from the API
        if (limit > 0 && dummyAcademics.length > limit) {
            renderAcademics(container, dummyAcademics.slice(0, limit), template);
        } else {
            renderAcademics(container, dummyAcademics, template);
        }
    }
    
    // Helper function to render academics in a container
    function renderAcademics(container, academics, template) {
        if (!container) return;
        
        academics.forEach(academic => {
            // Clone the template for each academic
            const academicElement = template.cloneNode(true);
            
            // Set the academic data in the cloned template
            academicElement.querySelector('h4').textContent = academic.name;
            academicElement.querySelector(template.classList.contains('academic-list-card') ? 'p' : '.department').textContent = academic.department;
            
            // Set the rating if it exists
            const ratingElement = academicElement.querySelector('.rating span, .academic-rating span');
            if (ratingElement) {
                ratingElement.textContent = academic.rating.toFixed(1);
            }
            
            // Set the appointment duration if it exists
            const durationElement = academicElement.querySelector('.appointment-duration, .consult-fee span:last-child');
            if (durationElement) {
                durationElement.textContent = academic.appointmentDuration;
            }
            
            // Set the image with fallback
            const imgElement = academicElement.querySelector('img');
            if (imgElement) {
                imgElement.src = academic.image;
                imgElement.alt = academic.name;
                imgElement.onerror = "this.src='img/default-user.svg'";
            }
            
            // Set the randevu-al link if it exists
            const linkElement = academicElement.querySelector('.btn-primary');
            if (linkElement) {
                linkElement.href = `randevu-al.html?academic=${academic.id}`;
            }
            
            // Add the academic to the container
            container.appendChild(academicElement);
        });
    }
    
    // Booking Steps Navigation
    const nextStepButtons = document.querySelectorAll('.next-step');
    const prevStepButtons = document.querySelectorAll('.prev-step');
    
    nextStepButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.step-content');
            const nextStep = currentStep.nextElementSibling;
            
            if (nextStep) {
                // Hide current step
                currentStep.classList.remove('active');
                
                // Show next step
                nextStep.classList.add('active');
                
                // Update steps indicator
                const currentStepIndex = Array.from(currentStep.parentNode.children).indexOf(currentStep);
                updateStepsIndicator(currentStepIndex + 1);
                
                // If moving to step 3 (date & time), update academic name in step info
                if (currentStepIndex + 1 === 2 && document.querySelector('#step-3 .step-info')) {
                    const selectedAcademic = document.querySelector('.academic-list-card.selected h4');
                    const selectedDepartment = document.querySelector('.academic-list-card.selected p');
                    
                    if (selectedAcademic) {
                        document.querySelector('#step-3 .step-info').textContent = 
                            `${selectedAcademic.textContent} ile görüşmek istediğiniz tarihi ve saati seçin`;
                    }
                }
                
                // If moving to step 4 (summary), update summary information
                if (currentStepIndex + 1 === 3 && document.getElementById('step-4')) {
                    updateSummaryInformation();
                }
            }
        });
    });
    
    prevStepButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.step-content');
            const prevStep = currentStep.previousElementSibling;
            
            if (prevStep) {
                // Hide current step
                currentStep.classList.remove('active');
                
                // Show previous step
                prevStep.classList.add('active');
                
                // Update steps indicator
                const currentStepIndex = Array.from(currentStep.parentNode.children).indexOf(currentStep);
                updateStepsIndicator(currentStepIndex - 1);
            }
        });
    });
    
    function updateStepsIndicator(activeStepIndex) {
        const stepsIndicators = document.querySelectorAll('.booking-steps .booking-step');
        
        if (stepsIndicators.length > 0) {
            stepsIndicators.forEach((step, index) => {
                if (index < activeStepIndex) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else if (index === activeStepIndex) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
        }
    }
    
    // Function to update the appointment summary information in step 4
    function updateSummaryInformation() {
        // Get selected appointment type
        const selectedType = document.querySelector('.appointment-type-card.selected h4')?.textContent || 'Genel Görüşme';
        const selectedDuration = document.querySelector('.appointment-type-card.selected .appointment-duration')?.textContent || 'Süre: 30 dk';
        
        // Get selected academic
        const selectedAcademicName = document.querySelector('.academic-list-card.selected h4')?.textContent || 'Prof. Dr. Ahmet Yılmaz';
        const selectedAcademicDept = document.querySelector('.academic-list-card.selected p')?.textContent || 'Bilgisayar Mühendisliği';
        
        // Get selected date
        const selectedDay = document.querySelector('.calendar-day.selected')?.textContent || '20';
        const calendarTitle = document.querySelector('.calendar-title')?.textContent || 'Mayıs 2023';
        const [month, year] = calendarTitle.split(' ');
        
        // Get selected time slot
        const selectedTime = document.querySelector('.time-slot.selected')?.textContent || '10:30';
        
        // Update summary values
        const typeValue = document.querySelector('.booking-summary .summary-item:nth-child(1) .summary-value');
        const academicValue = document.querySelector('.booking-summary .summary-item:nth-child(2) .summary-value');
        const dateValue = document.querySelector('.booking-summary .summary-item:nth-child(3) .summary-value');
        const timeValue = document.querySelector('.booking-summary .summary-item:nth-child(4) .summary-value');
        
        if (typeValue) typeValue.textContent = `${selectedType} (${selectedDuration.replace('Süre: ', '')})`;
        if (academicValue) academicValue.textContent = `${selectedAcademicName} (${selectedAcademicDept})`;
        if (dateValue) dateValue.textContent = `${selectedDay} ${month} ${year}`;
        if (timeValue) timeValue.textContent = selectedTime;
    }
    
    // Appointment Type Selection
    const appointmentTypeCards = document.querySelectorAll('.appointment-type-card');
    
    appointmentTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            appointmentTypeCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
        });
    });
    
    // Academic Selection
    const academicCards = document.querySelectorAll('.academic-list-card');
    
    academicCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            academicCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
        });
    });
    
    // Calendar Day Selection
    const calendarDays = document.querySelectorAll('.calendar-day:not(.disabled)');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove selected class from all days
            calendarDays.forEach(d => d.classList.remove('selected'));
            
            // Add selected class to clicked day
            this.classList.add('selected');
            
            // Update time slots title
            const timeSlotTitle = document.querySelector('.time-slot-wrapper h4');
            if (timeSlotTitle) {
                const month = document.querySelector('.calendar-title').innerText.split(' ')[0];
                const year = document.querySelector('.calendar-title').innerText.split(' ')[1];
                timeSlotTitle.innerText = `${this.innerText} ${month} ${year} için Uygun Saatler`;
            }
        });
    });
    
    // Time Slot Selection
    const timeSlots = document.querySelectorAll('.time-slot:not(.disabled)');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all slots
            timeSlots.forEach(s => s.classList.remove('selected'));
            
            // Add selected class to clicked slot
            this.classList.add('selected');
        });
    });
    
    // Calendar Navigation
    const calendarPrev = document.querySelector('.calendar-prev');
    const calendarNext = document.querySelector('.calendar-next');
    const calendarTitle = document.querySelector('.calendar-title');
    
    if (calendarPrev && calendarNext && calendarTitle) {
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        let currentDate = new Date();
        
        updateCalendarTitle();
        
        calendarPrev.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendarTitle();
        });
        
        calendarNext.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendarTitle();
        });
        
        function updateCalendarTitle() {
            const month = months[currentDate.getMonth()];
            const year = currentDate.getFullYear();
            calendarTitle.innerText = `${month} ${year}`;
        }
    }
    
    // URL parameter handling for search functionality
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        
        return params;
    }
    
    // Initialize database loading for the home page
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        // Get the featured academics container
        const academicsGrid = document.querySelector('.featured .academic-grid');
        if (academicsGrid && academicsGrid.children.length > 0) {
            // Get the first academic card as a template
            const academicTemplate = academicsGrid.children[0].cloneNode(true);
            
            // Clear the existing cards which will be replaced by dynamic loading
            // For now, we'll leave them as they are, but in the future this would clear the container
            // academicsGrid.innerHTML = '';
            
            // Load academics from the database (limit to 4 for featured section)
            // This is commented out for now until the database is ready
            // loadAcademicsFromDatabase('featured-academics', academicTemplate, 4);
        }
        
        // Handle home page search form
        const searchForm = document.querySelector('.hero .search-box form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const searchInput = this.querySelector('input[name="searchQuery"]').value.trim();
                
                if (searchInput) {
                    window.location.href = `arama-sonuclari.html?q=${encodeURIComponent(searchInput)}`;
                } else {
                    // Optionally, provide feedback if search input is empty
                    alert("Lütfen bir arama terimi girin.");
                }
            });
        }
    }
    
    // Load announcements on the homepage
    if ((window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) && document.getElementById('homepageAnnouncementsGrid')) {
        const announcementsGrid = document.getElementById('homepageAnnouncementsGrid');
        announcementsGrid.innerHTML = '<p>Duyurular yükleniyor...</p>';

        fetch('duyurular.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const announcementCards = Array.from(doc.querySelectorAll('.announcement-card'));
                
                announcementsGrid.innerHTML = ''; // Clear loading message
                const announcementsToShow = announcementCards.slice(0, 6); // Show 6 announcements

                if (announcementsToShow.length === 0) {
                    announcementsGrid.innerHTML = '<p>Gösterilecek duyuru bulunmamaktadır.</p>';
                } else {
                    announcementsToShow.forEach((card, index) => {
                        const titleElement = card.querySelector('.announcement-title');
                        const dateElement = card.querySelector('.announcement-date');
                        const categoryElement = card.querySelector('.announcement-category');
                        // Attempt to get an ID or create a fallback for the link
                        const cardId = card.id || `duyuru-hp-${index + 1}`;

                        const title = titleElement ? titleElement.textContent.trim() : 'Başlık Yok';
                        const date = dateElement ? dateElement.textContent.trim() : '';
                        const category = categoryElement ? categoryElement.textContent.trim() : 'Kategori Yok';

                        const announcementHTML = `
                            <div class="announcement-item-homepage">
                                <span class="date">${date}</span>
                                <h4>${title}</h4>
                                <span class="category">${category}</span>
                                <a href="duyurular.html#${cardId}" class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></a>
                            </div>`;
                        announcementsGrid.innerHTML += announcementHTML;
                    });
                }
            })
            .catch(error => {
                console.error('Duyurular yüklenirken hata oluştu:', error);
                announcementsGrid.innerHTML = '<p>Duyurular yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>';
            });
    }
    
    // Apply search filters if on akademisyenler.html
    if (window.location.pathname.includes('akademisyenler.html')) {
        const params = getUrlParams();
        const searchFiltersDiv = document.querySelector('.search-filters');
        let searchInput, facultySelect, departmentSelect;

        if (searchFiltersDiv) {
            searchInput = searchFiltersDiv.querySelector('input[type="text"]');
            // Corrected selectors scoped to searchFiltersDiv:
            facultySelect = searchFiltersDiv.querySelector('select:nth-of-type(1)'); 
            departmentSelect = searchFiltersDiv.querySelector('select:nth-of-type(2)'); 
        } else {
            console.warn('.search-filters div not found on akademisyenler.html');
            // Early return or avoid using searchInput, facultySelect, departmentSelect if searchFiltersDiv is not found
            return; 
        }
        
        // Get the academics grid for database integration preparation
        const academicsGrid = document.querySelector('.academic-grid');
        if (academicsGrid && academicsGrid.children.length > 0) {
            // Get the first academic card as a template
            const academicTemplate = academicsGrid.children[0].cloneNode(true);
            
            // In the future, this would clear the grid and load from database
            // academicsGrid.innerHTML = '';
            // loadAcademicsFromDatabase('academics-grid', academicTemplate);
        }
        
        // Apply URL parameters to search form
        if (params.q && searchInput) {
            searchInput.value = params.q;
        }
        
        if (params.faculty && facultySelect) {
            facultySelect.value = params.faculty;
        }
        
        // Handle department pre-selection from URL
        if (params.department && departmentSelect) {
            // Decode the department name from the URL parameter
            const departmentName = decodeURIComponent(params.department);
            departmentSelect.value = departmentName;

            // Attempt to find the option and select it more robustly
            // This is useful if the value attribute doesn't exactly match the text or needs case-insensitive matching
            let foundOption = false;
            for (let i = 0; i < departmentSelect.options.length; i++) {
                if (departmentSelect.options[i].value.toLowerCase() === departmentName.toLowerCase() || 
                    departmentSelect.options[i].text.toLowerCase() === departmentName.toLowerCase()) {
                    departmentSelect.selectedIndex = i;
                    foundOption = true;
                    break;
                }
            }
            if(!foundOption) {
                console.warn(`Department "${departmentName}" not found in select options.`);
            }
        }
        
        // Perform search if parameters exist
        if (params.q || params.faculty || params.department) {
            filterAcademicians();
        }
        
        // Add search event listeners
        if (searchInput) {
            searchInput.addEventListener('input', debounce(filterAcademicians, 300));
        }
        
        if (facultySelect) {
            facultySelect.addEventListener('change', filterAcademicians);
        }
        
        if (departmentSelect) {
            departmentSelect.addEventListener('change', filterAcademicians);
        }
        
        // Handle "Randevu Al" button clicks in akademisyenler.html
        const appointmentButtons = document.querySelectorAll('.academic-card .btn-primary');
        appointmentButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Get academic info
                const academicCard = this.closest('.academic-card');
                const academicName = academicCard.querySelector('h4').innerText;
                const academicDepartment = academicCard.querySelector('.department').innerText;
                const academicId = this.href.split('=')[1]; // Get the academic ID from the URL
                
                // Store in sessionStorage for randevu-al.html to use
                sessionStorage.setItem('selectedAcademic', JSON.stringify({
                    name: academicName,
                    department: academicDepartment,
                    id: academicId,
                    skipStep2: true // Flag to skip academic selection step
                }));
            });
        });
    }
    
    // Apply search filters if on duyurular.html page
    if (window.location.pathname.includes('duyurular.html')) {
        const searchInput = document.querySelector('.search-filters input[type="text"]');
        const categorySelect = document.querySelector('.search-filters select:nth-child(1)');
        const departmentSelect = document.querySelector('.search-filters select:nth-child(2)');
        
        // Add search event listeners
        if (searchInput) {
            searchInput.addEventListener('input', debounce(filterDuyurular, 300));
        }
        
        if (categorySelect) {
            categorySelect.addEventListener('change', filterDuyurular);
        }
        
        if (departmentSelect) {
            departmentSelect.addEventListener('change', filterDuyurular);
        }
    }
    
    // Handle academic pre-selection in randevu-al.html
    if (window.location.pathname.includes('randevu-al.html')) {
        const params = getUrlParams();
        
        // Set up search and filtering functionality
        const searchInput = document.querySelector('.search-filters input[type="text"]');
        const facultySelect = document.querySelector('.search-filters select:nth-child(1)');
        const departmentSelect = document.querySelector('.search-filters select:nth-child(2)');
        
        // Prepare for database integration
        const academicsList = document.querySelector('.academics-list');
        if (academicsList && academicsList.children.length > 0) {
            // Get the first academic card as a template
            const academicTemplate = academicsList.children[0].cloneNode(true);
            
            // In the future, this would clear the list and load from database
            // academicsList.innerHTML = '';
            // loadAcademicsFromDatabase('academics-list', academicTemplate);
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(filterAcademicians, 300));
        }
        
        if (facultySelect) {
            facultySelect.addEventListener('change', filterAcademicians);
        }
        
        if (departmentSelect) {
            departmentSelect.addEventListener('change', filterAcademicians);
        }
        
        // Variables for academisyen pre-selection
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        const step3 = document.getElementById('step-3');
        let preSelectedAcademic = null;
        
        // Check if data was passed via sessionStorage
        const selectedAcademicJSON = sessionStorage.getItem('selectedAcademic');
        if (selectedAcademicJSON) {
            preSelectedAcademic = JSON.parse(selectedAcademicJSON);
            selectAppropriateAcademic(preSelectedAcademic);
            // Do not clear sessionStorage yet, we'll use it when next button is clicked
        }
        // Or check if coming via URL parameter
        else if (params.academic) {
            preSelectedAcademic = { 
                id: params.academic,
                skipStep2: true
            };
            selectAppropriateAcademic(preSelectedAcademic);
        }
        
        // Helper function to select the appropriate academic
        function selectAppropriateAcademic(academicData) {
            if (!step2) return;
            
            // Find and select the academic card
            const academicCards = document.querySelectorAll('.academic-list-card');
            let found = false;
            
            academicCards.forEach(card => {
                // Try to match by name if available, otherwise by ID
                let matches = false;
                if (academicData.name) {
                    const academicName = card.querySelector('h4').innerText;
                    matches = academicName === academicData.name;
                } else if (academicData.id) {
                    // Convert ID format (e.g., ahmet-yilmaz) to compare with name
                    const academicIDFormatted = academicData.id.replace(/-/g, ' ');
                    const academicName = card.querySelector('h4').innerText.toLowerCase();
                    matches = academicName.includes(academicIDFormatted);
                }
                
                if (matches) {
                    // Select this academic
                    card.classList.add('selected');
                    found = true;
                } else {
                    card.classList.remove('selected');
                }
            });
            
            // Update the selected academic info for later use
            if (found) {
                const selectedName = document.querySelector('.academic-list-card.selected h4').innerText;
                const selectedDept = document.querySelector('.academic-list-card.selected p').innerText;
                
                // Update step 3 info with correct academic name
                if (step3 && step3.querySelector('.step-info')) {
                    step3.querySelector('.step-info').textContent = 
                        `${selectedName} ile görüşmek istediğiniz tarihi ve saati seçin`;
                }
            }
        }
        
        // Modify next button behavior for step 1 when academic is pre-selected
        if (step1) {
            const nextButton = step1.querySelector('.next-step');
            if (nextButton && preSelectedAcademic && preSelectedAcademic.skipStep2) {
                // Override click listener for this specific button
                nextButton.addEventListener('click', function(e) {
                    e.stopImmediatePropagation(); // Stop other listeners
                    
                    // Skip directly to step 3 (date & time)
                    step1.classList.remove('active');
                    step2.classList.remove('active');
                    step3.classList.add('active');
                    
                    // Update steps indicator to step 3
                    updateStepsIndicator(2);
                    
                    // Clear session storage now that we've used it
                    sessionStorage.removeItem('selectedAcademic');
                }, { capture: true });
            }
        }
        
        // Set up the submit button to pass all data to onay.html
        const submitButton = document.querySelector('.step-content:last-child .btn-primary');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                // Check if an appointment type is selected
                const selectedType = document.querySelector('.appointment-type-card.selected');
                if (!selectedType) {
                    alert('Lütfen bir randevu türü seçiniz.');
                    isValid = false;
                }
                
                // Check if an academic is selected
                const selectedAcademic = document.querySelector('.academic-list-card.selected');
                if (!selectedAcademic) {
                    alert('Lütfen bir akademisyen seçiniz.');
                    isValid = false;
                }
                
                // Check if a date is selected
                const selectedDate = document.querySelector('.calendar-day.selected');
                if (!selectedDate) {
                    alert('Lütfen bir tarih seçiniz.');
                    isValid = false;
                }
                
                // Check if a time slot is selected
                const selectedTime = document.querySelector('.time-slot.selected');
                if (!selectedTime) {
                    alert('Lütfen bir saat seçiniz.');
                    isValid = false;
                }
                
                if (isValid) {
                    // Gather all the appointment information
                    const appointmentType = document.querySelector('.appointment-type-card.selected h4')?.textContent || 'Genel Görüşme';
                    const appointmentDuration = document.querySelector('.appointment-type-card.selected .appointment-duration')?.textContent || '30 dk';
                    const academicName = document.querySelector('.academic-list-card.selected h4')?.textContent || 'Prof. Dr. Ahmet Yılmaz';
                    const academicDepartment = document.querySelector('.academic-list-card.selected p')?.textContent || 'Bilgisayar Mühendisliği';
                    const selectedDay = document.querySelector('.calendar-day.selected')?.textContent || '20';
                    const month = document.querySelector('.calendar-title')?.textContent.split(' ')[0] || 'Mayıs';
                    const year = document.querySelector('.calendar-title')?.textContent.split(' ')[1] || '2023';
                    const selectedTime = document.querySelector('.time-slot.selected')?.textContent || '10:30';
                    const notes = document.getElementById('appointment-notes')?.value || '';
                    
                    // Create the URL with all parameters
                    let redirectUrl = 'onay.html?';
                    redirectUrl += `type=${encodeURIComponent(`${appointmentType} (${appointmentDuration})`)}`;
                    redirectUrl += `&academic=${encodeURIComponent(`${academicName} (${academicDepartment})`)}`;
                    redirectUrl += `&date=${encodeURIComponent(`${selectedDay} ${month} ${year}`)}`;
                    redirectUrl += `&time=${encodeURIComponent(selectedTime)}`;
                    if (notes) {
                        redirectUrl += `&notes=${encodeURIComponent(notes)}`;
                    }
                    
                    // Generate a random appointment ID
                    const now = new Date();
                    const idYear = now.getFullYear();
                    const idMonth = String(now.getMonth() + 1).padStart(2, '0');
                    const idDay = String(now.getDate()).padStart(2, '0');
                    const randomNum = Math.floor(1000 + Math.random() * 9000);
                    redirectUrl += `&id=RND-${idYear}${idMonth}${idDay}-${randomNum}`;
                    
                    // Redirect to the confirmation page
                    window.location.href = redirectUrl;
                }
            });
        }
    }
    
    // Handle confirmation page details on onay.html
    if (window.location.pathname.includes('onay.html')) {
        const params = getUrlParams();
        
        // Populate appointment details from URL parameters
        const idElement = document.getElementById('appointment-id');
        const typeElement = document.getElementById('appointment-type');
        const academicElement = document.getElementById('academic-name');
        const dateElement = document.getElementById('appointment-date');
        const timeElement = document.getElementById('appointment-time');
        
        if (idElement && params.id) {
            idElement.textContent = params.id;
        }
        
        if (typeElement && params.type) {
            typeElement.textContent = decodeURIComponent(params.type);
        }
        
        if (academicElement && params.academic) {
            academicElement.textContent = decodeURIComponent(params.academic);
        }
        
        if (dateElement && params.date) {
            dateElement.textContent = decodeURIComponent(params.date);
        }
        
        if (timeElement && params.time) {
            timeElement.textContent = decodeURIComponent(params.time);
        }
        
        // Save the appointment data to localStorage
        if (params.id) {
            // Create appointment object
            const appointmentData = {
                id: params.id,
                type: params.type ? decodeURIComponent(params.type) : 'Genel Görüşme (30 dk)',
                academic: params.academic ? decodeURIComponent(params.academic) : 'Prof. Dr. Ahmet Yılmaz (Bilgisayar Mühendisliği)',
                academicName: (params.academic ? decodeURIComponent(params.academic) : 'Prof. Dr. Ahmet Yılmaz (Bilgisayar Mühendisliği)').split(' (')[0],
                academicDepartment: (params.academic ? decodeURIComponent(params.academic) : 'Prof. Dr. Ahmet Yılmaz (Bilgisayar Mühendisliği)').split(' (')[1]?.replace(')', ''),
                date: params.date ? decodeURIComponent(params.date) : '20 Mayıs 2023',
                time: params.time ? decodeURIComponent(params.time) : '10:30',
                notes: params.notes ? decodeURIComponent(params.notes) : '',
                status: 'pending', // Initial status is "pending"
                student: 'Ayşe Yılmaz', // Default student, would come from authentication in a real app
                studentDepartment: 'Bilgisayar Mühendisliği',
                createdAt: new Date().toISOString()
            };
            
            // Get existing appointments or initialize empty array
            let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            
            // Add new appointment
            appointments.push(appointmentData);
            
            // Save back to localStorage
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            // Add confirmation message
            const confirmationMessage = document.querySelector('.confirmation-message');
            if (confirmationMessage) {
                confirmationMessage.innerHTML += `<p class="text-success">Randevunuz kaydedildi. <a href="ogrenci-dashboard.html">Dashboard</a> sayfasından randevularınızı görüntüleyebilirsiniz.</p>`;
            }
        }
    }
    
    // Handle appointment list page for students
    if (window.location.pathname.includes('randevu-listesi.html')) {
        // Get appointments from localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Get the appointment table body
        const tableBody = document.getElementById('appointment-table-body');
        
        // Get filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        let currentFilter = 'all';
        
        // Add event listeners to filter tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Update current filter
                currentFilter = this.dataset.status;
                
                // Reload appointments with new filter
                loadAppointments();
            });
        });
        
        function loadAppointments() {
            if (tableBody) {
                // Clear existing rows
                tableBody.innerHTML = '';
                
                // Filter appointments based on current filter
                const filteredAppointments = currentFilter === 'all' ?
                    appointments :
                    appointments.filter(appointment => appointment.status === currentFilter);
                
                if (filteredAppointments.length === 0) {
                    // No appointments found
                    tableBody.innerHTML = `
                        <tr class="no-appointments-row">
                            <td colspan="7" class="text-center">
                                ${currentFilter === 'all' ? 
                                    'Henüz randevu bulunmamaktadır. <a href="randevu-al.html">Yeni randevu oluştur</a>.' : 
                                    `${getStatusText(currentFilter)} durumunda randevu bulunmamaktadır.`}
                            </td>
                        </tr>
                    `;
                } else {
                    // Sort appointments by date (newest first)
                    filteredAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    // Create rows for each appointment
                    filteredAppointments.forEach(appointment => {
                        let appointmentTargetName = '';
                        let appointmentTargetDepartment = '';
                        let isUnitAppointment = false;
                        
                        // Check if it's a unit appointment or academic appointment
                        if (appointment.id && appointment.id.startsWith('BRM-')) {
                            // This is a unit appointment
                            isUnitAppointment = true;
                            appointmentTargetName = appointment.birim || 'İdari Birim';
                            appointmentTargetDepartment = 'İdari Birim';
                        } else {
                            // This is an academic appointment
                            const academicNameParts = appointment.academic ? appointment.academic.split(' (') : ['Akademisyen', ''];
                            appointmentTargetName = academicNameParts[0];
                            appointmentTargetDepartment = academicNameParts[1] ? academicNameParts[1].replace(')', '') : '';
                        }
                        
                        let statusBadgeClass = '';
                        let statusText = '';
                        
                        switch (appointment.status) {
                            case 'pending':
                                statusBadgeClass = 'status-pending';
                                statusText = 'Beklemede';
                                break;
                            case 'confirmed':
                                statusBadgeClass = 'status-confirmed';
                                statusText = 'Onaylandı';
                                break;
                            case 'cancelled':
                                statusBadgeClass = 'status-cancelled';
                                statusText = 'İptal Edildi';
                                break;
                            case 'completed':
                                statusBadgeClass = 'status-completed';
                                statusText = 'Tamamlandı';
                                break;
                        }
                        
                        const row = document.createElement('tr');
                        row.dataset.id = appointment.id;
                        row.dataset.status = appointment.status;
                        
                        row.innerHTML = `
                            <td>
                                <div class="academic-info-sm">
                                    <img src="${isUnitAppointment ? 'img/department.svg' : 'img/academic1.jpg'}" alt="${appointmentTargetName}" onerror="this.src='img/default-user.svg'">
                                    <div>
                                        <h4>${appointmentTargetName}</h4>
                                        <p>${appointmentTargetDepartment}</p>
                                    </div>
                                </div>
                            </td>
                            <td>${appointmentTargetDepartment}</td>
                            <td>${appointment.type}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
                            <td>
                                <a href="#" class="action-btn btn-secondary view-details" data-id="${appointment.id}">Detaylar</a>
                                ${appointment.status === 'pending' || appointment.status === 'confirmed' ? 
                                    `<a href="#" class="action-btn btn-outline cancel-appointment" data-id="${appointment.id}">İptal Et</a>` : ''}
                            </td>
                        `;
                        
                        tableBody.appendChild(row);
                    });
                    
                    // Add event listeners to buttons
                    addEventListenersToButtons();
                }
            }
        }
        
        function addEventListenersToButtons() {
            // View details buttons
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const appointmentId = this.dataset.id;
                    const appointment = appointments.find(a => a.id === appointmentId);
                    
                    if (appointment) {
                        // Check if it's a unit appointment or academic appointment
                        const isUnitAppointment = appointment.id && appointment.id.startsWith('BRM-');
                        
                        if (isUnitAppointment) {
                            alert(`Randevu Detayları:
                                \nBirim: ${appointment.birim || 'İdari Birim'}
                                \nRandevu Türü: ${appointment.type}
                                \nTarih: ${appointment.date}
                                \nSaat: ${appointment.time}
                                \nDurum: ${getStatusText(appointment.status)}
                                ${appointment.notes ? '\nNotlar: ' + appointment.notes : ''}`);
                        } else {
                            alert(`Randevu Detayları:
                                \nAkademisyen: ${appointment.academic}
                                \nRandevu Türü: ${appointment.type}
                                \nTarih: ${appointment.date}
                                \nSaat: ${appointment.time}
                                \nDurum: ${getStatusText(appointment.status)}
                                ${appointment.notes ? '\nNotlar: ' + appointment.notes : ''}`);
                        }
                    }
                });
            });
            
            // Cancel appointment buttons
            document.querySelectorAll('.cancel-appointment').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    if (confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) {
                        const appointmentId = this.dataset.id;
                        
                        // Update appointment status in localStorage
                        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                        const updatedAppointments = appointments.map(appointment => {
                            if (appointment.id === appointmentId) {
                                appointment.status = 'cancelled';
                            }
                            return appointment;
                        });
                        
                        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                        
                        // Reload appointments
                        loadAppointments();
                    }
                });
            });
        }
        
        // Helper function to get status text
        function getStatusText(status) {
            switch (status) {
                case 'pending': return 'Beklemede';
                case 'confirmed': return 'Onaylandı';
                case 'cancelled': return 'İptal Edildi';
                case 'completed': return 'Tamamlandı';
                default: return status;
            }
        }
        
        // Load appointments when the page loads
        loadAppointments();
    }

    // Handle appointment list page for academics
    if (window.location.pathname.includes('randevu-listesi-akademisyen.html')) {
        // Get appointments from localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Get the appointment table body
        const tableBody = document.getElementById('appointment-table-body-academic');
        const pendingTableBody = document.getElementById('pending-appointments-table');
        
        // Get filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        let currentFilter = 'all';
        
        // Add event listeners to filter tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Update current filter
                currentFilter = this.dataset.status;
                
                // Reload appointments with new filter
                loadAppointments();
            });
        });
        
        function loadAppointments() {
            if (tableBody) {
                // Clear existing rows
                tableBody.innerHTML = '';
                
                // Filter appointments based on current filter
                const filteredAppointments = currentFilter === 'all' ?
                    appointments :
                    appointments.filter(appointment => appointment.status === currentFilter);
                
                if (filteredAppointments.length === 0) {
                    // No appointments found
                    tableBody.innerHTML = `
                        <tr class="no-appointments-row">
                            <td colspan="7" class="text-center">
                                ${currentFilter === 'all' ? 
                                    'Henüz randevu bulunmamaktadır.' : 
                                    `${getStatusText(currentFilter)} durumunda randevu bulunmamaktadır.`}
                            </td>
                        </tr>
                    `;
                } else {
                    // Sort appointments by date (newest first)
                    filteredAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    // Create rows for each appointment
                    filteredAppointments.forEach(appointment => {
                        let statusBadgeClass = '';
                        let statusText = '';
                        
                        switch (appointment.status) {
                            case 'pending':
                                statusBadgeClass = 'status-pending';
                                statusText = 'Beklemede';
                                break;
                            case 'confirmed':
                                statusBadgeClass = 'status-confirmed';
                                statusText = 'Onaylandı';
                                break;
                            case 'cancelled':
                                statusBadgeClass = 'status-cancelled';
                                statusText = 'İptal Edildi';
                                break;
                            case 'completed':
                                statusBadgeClass = 'status-completed';
                                statusText = 'Tamamlandı';
                                break;
                        }
                        
                        const row = document.createElement('tr');
                        row.dataset.id = appointment.id;
                        row.dataset.status = appointment.status;
                        
                        row.innerHTML = `
                            <td>
                                <div class="academic-info-sm">
                                    <img src="img/academic1.jpg" alt="${appointment.student}" onerror="this.src='img/default-user.svg'">
                                    <div>
                                        <h4>${appointment.student}</h4>
                                        <p>${appointment.studentDepartment}</p>
                                    </div>
                                </div>
                            </td>
                            <td>${appointment.studentDepartment}</td>
                            <td>${appointment.type}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
                            <td>
                                <a href="#" class="action-btn btn-secondary view-details" data-id="${appointment.id}">Detaylar</a>
                                ${appointment.status === 'pending' ? 
                                    `<a href="#" class="action-btn btn-primary approve-appointment" data-id="${appointment.id}">Onayla</a>
                                    <a href="#" class="action-btn btn-outline reject-appointment" data-id="${appointment.id}">Reddet</a>` :
                                    appointment.status === 'confirmed' ?
                                    `<a href="#" class="action-btn btn-outline cancel-appointment" data-id="${appointment.id}">İptal Et</a>` : ''}
                            </td>
                        `;
                        
                        tableBody.appendChild(row);
                    });
                    
                    // Add event listeners to buttons
                    addEventListenersToButtons(tableBody);
                }
            }
            
            // Load pending appointments separately
            if (pendingTableBody) {
                // Clear existing rows
                pendingTableBody.innerHTML = '';
                
                // Filter only pending appointments
                const pendingAppointments = appointments.filter(appointment => appointment.status === 'pending');
                
                if (pendingAppointments.length === 0) {
                    // No pending appointments found
                    pendingTableBody.innerHTML = `
                        <tr class="no-appointments-row">
                            <td colspan="6" class="text-center">Onay bekleyen randevu bulunmamaktadır.</td>
                        </tr>
                    `;
                } else {
                    // Sort pending appointments by date (newest first)
                    pendingAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    // Create rows for each pending appointment
                    pendingAppointments.forEach(appointment => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>
                                <div class="academic-info-sm">
                                    <img src="img/academic1.jpg" alt="${appointment.student}" onerror="this.src='img/default-user.svg'">
                                    <div>
                                        <h4>${appointment.student}</h4>
                                        <p>${appointment.studentDepartment}</p>
                                    </div>
                                </div>
                            </td>
                            <td>${appointment.studentDepartment}</td>
                            <td>${appointment.type}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td>
                                <a href="#" class="action-btn btn-primary approve-appointment" data-id="${appointment.id}">Onayla</a>
                                <a href="#" class="action-btn btn-outline reject-appointment" data-id="${appointment.id}">Reddet</a>
                            </td>
                        `;
                        
                        pendingTableBody.appendChild(row);
                    });
                    
                    // Add event listeners to buttons
                    addEventListenersToButtons(pendingTableBody);
                }
            }
        }
        
        function addEventListenersToButtons(container) {
            // View details buttons
            container.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const appointmentId = this.dataset.id;
                    const appointment = appointments.find(a => a.id === appointmentId);
                    
                    if (appointment) {
                        alert(`Randevu Detayları:
                            \nÖğrenci: ${appointment.student} (${appointment.studentDepartment})
                            \nRandevu Türü: ${appointment.type}
                            \nTarih: ${appointment.date}
                            \nSaat: ${appointment.time}
                            \nDurum: ${getStatusText(appointment.status)}
                            ${appointment.notes ? '\nNotlar: ' + appointment.notes : ''}`);
                    }
                });
            });
            
            // Approve appointment buttons
            container.querySelectorAll('.approve-appointment').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const appointmentId = this.dataset.id;
                    
                    // Update appointment status in localStorage
                    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                    const updatedAppointments = appointments.map(appointment => {
                        if (appointment.id === appointmentId) {
                            appointment.status = 'confirmed';
                        }
                        return appointment;
                    });
                    
                    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                    
                    // Show confirmation
                    alert('Randevu başarıyla onaylandı.');
                    
                    // Reload appointments
                    loadAppointments();
                });
            });
            
            // Reject appointment buttons
            container.querySelectorAll('.reject-appointment').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    if (confirm('Bu randevuyu reddetmek istediğinizden emin misiniz?')) {
                        const appointmentId = this.dataset.id;
                        
                        // Update appointment status in localStorage
                        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                        const updatedAppointments = appointments.map(appointment => {
                            if (appointment.id === appointmentId) {
                                appointment.status = 'cancelled';
                            }
                            return appointment;
                        });
                        
                        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                        
                        // Show confirmation
                        alert('Randevu reddedildi.');
                        
                        // Reload appointments
                        loadAppointments();
                    }
                });
            });
            
            // Cancel appointment buttons
            container.querySelectorAll('.cancel-appointment').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    if (confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) {
                        const appointmentId = this.dataset.id;
                        
                        // Update appointment status in localStorage
                        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                        const updatedAppointments = appointments.map(appointment => {
                            if (appointment.id === appointmentId) {
                                appointment.status = 'cancelled';
                            }
                            return appointment;
                        });
                        
                        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                        
                        // Reload appointments
                        loadAppointments();
                    }
                });
            });
        }
        
        // Helper function to get status text
        function getStatusText(status) {
            switch (status) {
                case 'pending': return 'Beklemede';
                case 'confirmed': return 'Onaylandı';
                case 'cancelled': return 'İptal Edildi';
                case 'completed': return 'Tamamlandı';
                default: return status;
            }
        }
        
        // Load appointments when the page loads
        loadAppointments();
    }

    // Display appointments in student dashboard
    if (window.location.pathname.includes('ogrenci-dashboard.html')) {
        // Get appointments from localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Get the appointment table body
        const tableBody = document.querySelector('.appointment-table tbody');
        
        if (tableBody && appointments.length > 0) {
            // Clear existing rows
            tableBody.innerHTML = '';
            
            // Sort by date (newest first)
            appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Limit to 3 most recent appointments
            const recentAppointments = appointments.slice(0, 3);
            
            // Create rows for each appointment
            recentAppointments.forEach(appointment => {
                const academicNameParts = appointment.academic.split(' (');
                const academicName = academicNameParts[0];
                const academicDepartment = academicNameParts[1] ? academicNameParts[1].replace(')', '') : '';
                
                let statusBadgeClass = '';
                let statusText = '';
                
                switch (appointment.status) {
                    case 'pending':
                        statusBadgeClass = 'status-pending';
                        statusText = 'Beklemede';
                        break;
                    case 'confirmed':
                        statusBadgeClass = 'status-confirmed';
                        statusText = 'Onaylandı';
                        break;
                    case 'cancelled':
                        statusBadgeClass = 'status-cancelled';
                        statusText = 'İptal Edildi';
                        break;
                    case 'completed':
                        statusBadgeClass = 'status-completed';
                        statusText = 'Tamamlandı';
                        break;
                }
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="academic-info-sm">
                            <img src="img/academic1.jpg" alt="${academicName}" onerror="this.src='img/default-user.svg'">
                            <div>
                                <h4>${academicName}</h4>
                                <p>${academicDepartment}</p>
                            </div>
                        </div>
                    </td>
                    <td>${academicDepartment}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
                    <td>
                        <a href="#" class="action-btn btn-secondary view-details" data-id="${appointment.id}">Detaylar</a>
                        ${appointment.status === 'pending' || appointment.status === 'confirmed' ? 
                            `<a href="#" class="action-btn btn-outline cancel-appointment" data-id="${appointment.id}">İptal Et</a>` : ''}
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Update dashboard statistics
            const totalAppointments = appointments.length;
            const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
            
            const totalAppointmentsElement = document.querySelector('.stat-card:nth-child(1) .stat-details h3');
            const pendingAppointmentsElement = document.querySelector('.stat-card:nth-child(2) .stat-details h3');
            
            if (totalAppointmentsElement) {
                totalAppointmentsElement.textContent = totalAppointments;
            }
            
            if (pendingAppointmentsElement) {
                pendingAppointmentsElement.textContent = pendingAppointments;
            }
            
            // Add event listeners
            tableBody.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const appointmentId = this.dataset.id;
                    const appointment = appointments.find(a => a.id === appointmentId);
                    
                    if (appointment) {
                        alert(`Randevu Detayları:
                            \nAkademisyen: ${appointment.academic}
                            \nRandevu Türü: ${appointment.type}
                            \nTarih: ${appointment.date}
                            \nSaat: ${appointment.time}
                            \nDurum: ${appointment.status === 'pending' ? 'Beklemede' : 
                                       appointment.status === 'confirmed' ? 'Onaylandı' : 
                                       appointment.status === 'cancelled' ? 'İptal Edildi' : 'Tamamlandı'}
                            ${appointment.notes ? '\nNotlar: ' + appointment.notes : ''}`);
                    }
                });
            });
            
            tableBody.querySelectorAll('.cancel-appointment').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    if (confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) {
                        const appointmentId = this.dataset.id;
                        
                        // Update appointment status in localStorage
                        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                        const updatedAppointments = appointments.map(appointment => {
                            if (appointment.id === appointmentId) {
                                appointment.status = 'cancelled';
                            }
                            return appointment;
                        });
                        
                        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                        
                        // Reload page
                        window.location.reload();
                    }
                });
            });
        }
    }

    // Display appointments in academic dashboard
    if (window.location.pathname.includes('akademisyen-dashboard.html')) {
        // Get appointments from localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Get table bodies
        const todayAppointmentsTable = document.querySelector('.dashboard-card:nth-child(2) .appointment-table tbody');
        const pendingAppointmentsTable = document.querySelector('.dashboard-card:nth-child(3) .appointment-table tbody');
        
        if (appointments.length > 0) {
            // Update dashboard statistics
            const totalAppointments = appointments.length;
            const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
            
            const totalAppointmentsElement = document.querySelector('.stat-card:nth-child(1) .stat-details h3');
            const todayAppointmentsElement = document.querySelector('.stat-card:nth-child(2) .stat-details h3');
            const pendingMessagesElement = document.querySelector('.stat-card:nth-child(3) .stat-details h3');
            
            if (totalAppointmentsElement) {
                totalAppointmentsElement.textContent = totalAppointments;
            }
            
            if (todayAppointmentsElement) {
                // Calculate today's appointments
                const today = new Date();
                const todayStr = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                const todayAppointments = appointments.filter(a => 
                    a.date.includes(today.getDate().toString()) && 
                    a.status === 'confirmed'
                ).length;
                
                todayAppointmentsElement.textContent = todayAppointments;
            }
            
            // Display pending appointments
            if (pendingAppointmentsTable) {
                // Filter pending appointments
                const pendingAppointments = appointments.filter(a => a.status === 'pending');
                
                if (pendingAppointments.length > 0) {
                    // Clear existing rows
                    pendingAppointmentsTable.innerHTML = '';
                    
                    // Sort by date (newest first)
                    pendingAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    // Limit to 3 most recent pending appointments
                    const recentPendingAppointments = pendingAppointments.slice(0, 3);
                    
                    // Create rows for each pending appointment
                    recentPendingAppointments.forEach(appointment => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>
                                <div class="academic-info-sm">
                                    <img src="img/academic1.jpg" alt="${appointment.student}" onerror="this.src='img/default-user.svg'">
                                    <div>
                                        <h4>${appointment.student}</h4>
                                        <p>${appointment.studentDepartment}</p>
                                    </div>
                                </div>
                            </td>
                            <td>${appointment.studentDepartment}</td>
                            <td>${appointment.type}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td>
                                <a href="#" class="action-btn btn-primary approve-appointment" data-id="${appointment.id}">Onayla</a>
                                <a href="#" class="action-btn btn-outline reject-appointment" data-id="${appointment.id}">Reddet</a>
                            </td>
                        `;
                        
                        pendingAppointmentsTable.appendChild(row);
                    });
                    
                    // Add event listeners
                    pendingAppointmentsTable.querySelectorAll('.approve-appointment').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            
                            const appointmentId = this.dataset.id;
                            
                            // Update appointment status in localStorage
                            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                            const updatedAppointments = appointments.map(appointment => {
                                if (appointment.id === appointmentId) {
                                    appointment.status = 'confirmed';
                                }
                                return appointment;
                            });
                            
                            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                            
                            // Show confirmation
                            alert('Randevu başarıyla onaylandı.');
                            
                            // Reload page
                            window.location.reload();
                        });
                    });
                    
                    pendingAppointmentsTable.querySelectorAll('.reject-appointment').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            
                            if (confirm('Bu randevuyu reddetmek istediğinizden emin misiniz?')) {
                                const appointmentId = this.dataset.id;
                                
                                // Update appointment status in localStorage
                                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                                const updatedAppointments = appointments.map(appointment => {
                                    if (appointment.id === appointmentId) {
                                        appointment.status = 'cancelled';
                                    }
                                    return appointment;
                                });
                                
                                localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                                
                                // Show confirmation
                                alert('Randevu reddedildi.');
                                
                                // Reload page
                                window.location.reload();
                            }
                        });
                    });
                }
            }

            // Display today's appointments
            if (todayAppointmentsTable) {
                // Get today's date
                const today = new Date();
                const todayStr = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                
                // Filter today's confirmed appointments
                const todayAppointments = appointments.filter(a => 
                    a.date.includes(today.getDate().toString()) && 
                    a.status === 'confirmed'
                );
                
                if (todayAppointments.length > 0) {
                    // Clear existing rows
                    todayAppointmentsTable.innerHTML = '';
                    
                    // Sort by time
                    todayAppointments.sort((a, b) => {
                        const timeA = parseInt(a.time.split(':').join(''));
                        const timeB = parseInt(b.time.split(':').join(''));
                        return timeA - timeB;
                    });
                    
                    // Create rows for each today's appointment
                    todayAppointments.forEach(appointment => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>
                                <div class="academic-info-sm">
                                    <img src="img/academic1.jpg" alt="${appointment.student}" onerror="this.src='img/default-user.svg'">
                                    <div>
                                        <h4>${appointment.student}</h4>
                                        <p>${appointment.studentDepartment}</p>
                                    </div>
                                </div>
                            </td>
                            <td>${appointment.type.split(' (')[0]}</td>
                            <td>${appointment.time}</td>
                            <td><span class="status-badge status-confirmed">Onaylandı</span></td>
                            <td>
                                <a href="#" class="action-btn btn-secondary view-details" data-id="${appointment.id}">Detaylar</a>
                                <a href="#" class="action-btn btn-outline cancel-appointment" data-id="${appointment.id}">İptal Et</a>
                            </td>
                        `;
                        
                        todayAppointmentsTable.appendChild(row);
                    });
                    
                    // Add event listeners
                    todayAppointmentsTable.querySelectorAll('.view-details').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            
                            const appointmentId = this.dataset.id;
                            const appointment = appointments.find(a => a.id === appointmentId);
                            
                            if (appointment) {
                                alert(`Randevu Detayları:
                                    \nÖğrenci: ${appointment.student} (${appointment.studentDepartment})
                                    \nRandevu Türü: ${appointment.type}
                                    \nTarih: ${appointment.date}
                                    \nSaat: ${appointment.time}
                                    \nDurum: Onaylandı
                                    ${appointment.notes ? '\nNotlar: ' + appointment.notes : ''}`);
                            }
                        });
                    });
                    
                    todayAppointmentsTable.querySelectorAll('.cancel-appointment').forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            
                            if (confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) {
                                const appointmentId = this.dataset.id;
                                
                                // Update appointment status in localStorage
                                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                                const updatedAppointments = appointments.map(appointment => {
                                    if (appointment.id === appointmentId) {
                                        appointment.status = 'cancelled';
                                    }
                                    return appointment;
                                });
                                
                                localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
                                
                                // Reload page
                                window.location.reload();
                            }
                        });
                    });
                }
            }
        }
    }

    // Function to filter academicians based on search criteria
    function filterAcademicians() {
        console.log('[filterAcademicians] Function called'); // Log when function starts
        try {
            const searchFilters = document.querySelector('.search-filters');
            if (!searchFilters) {
                console.error('[filterAcademicians] .search-filters element not found');
                return;
            }
            
            const searchInput = searchFilters.querySelector('input[type="text"]');
            const facultySelect = searchFilters.querySelector('select:nth-of-type(1)'); 
            const departmentSelect = searchFilters.querySelector('select:nth-of-type(2)');
            
            if (!searchInput || !facultySelect || !departmentSelect) {
                console.error('[filterAcademicians] One or more filter input elements not found.', { searchInput, facultySelect, departmentSelect });
                return;
            }
            
            const searchValue = searchInput.value.toLowerCase().trim();
            const facultyValue = facultySelect.value.toLowerCase().trim();
            const selectedFacultyText = facultySelect.options[facultySelect.selectedIndex].text.toLowerCase();
            const departmentValue = departmentSelect.value.toLowerCase().trim();
            const selectedDepartmentText = departmentSelect.options[departmentSelect.selectedIndex].text.toLowerCase();

            console.log('[filterAcademicians] Filtering with criteria:', { searchValue, facultyValue, selectedFacultyText, departmentValue, selectedDepartmentText });
            
            const academicCards = document.querySelectorAll('.academic-card, .academic-list-card');
            
            if (academicCards.length === 0) {
                console.warn('[filterAcademicians] No academic cards found to filter');
                return;
            }
            
            console.log(`[filterAcademicians] Found ${academicCards.length} academic cards to filter.`);
            let visibleCount = 0;
            
            academicCards.forEach((card, index) => {
                const nameElement = card.querySelector('h4');
                if (!nameElement) {
                    console.warn(`[filterAcademicians] Card ${index} missing h4 element.`);
                    return;
                }
                
                const name = nameElement.innerText.toLowerCase();
                let cardDepartmentText = '';
                
                const departmentElement = card.querySelector('.department') || card.querySelector('p');
                if (departmentElement) {
                    cardDepartmentText = departmentElement.innerText.toLowerCase();
                } else {
                    console.warn(`[filterAcademicians] Card ${index} ('${name}') missing department element.`);
                }
                
                console.log(`[filterAcademicians] Card ${index} ('${name}') - Department on card: '${cardDepartmentText}'`);

                const matchesSearch = !searchValue || 
                                     name.includes(searchValue) || 
                                     cardDepartmentText.includes(searchValue);
                                     
                let matchesFaculty = !facultyValue;
                if (facultyValue) {
                    if (facultyValue === "muhendislik" && cardDepartmentText.includes("mühendisli")) matchesFaculty = true; // broader match for mühendisliği, mühendislik etc.
                    else if (facultyValue === "isletme" && cardDepartmentText.includes("işletme")) matchesFaculty = true;
                    else if (facultyValue === "fen-edebiyat" && (cardDepartmentText.includes("fen edebiyat") || cardDepartmentText.includes("psikoloji") || cardDepartmentText.includes("kimya") || cardDepartmentText.includes("biyoloji") || cardDepartmentText.includes("matematik") || cardDepartmentText.includes("türk dili"))) matchesFaculty = true;
                    else if (facultyValue === "egitim" && cardDepartmentText.includes("eğitim")) matchesFaculty = true;
                }

                const matchesDepartment = !departmentValue || 
                                          selectedDepartmentText === "tüm bölümler" || // Handle "Tüm Bölümler"
                                          cardDepartmentText.includes(selectedDepartmentText.split(' (')[0]);

                console.log(`[filterAcademicians] Card ${index} ('${name}') - Matches: Search=${matchesSearch}, Faculty=${matchesFaculty}, Department=${matchesDepartment}`);

                if (matchesSearch && matchesFaculty && matchesDepartment) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            console.log(`[filterAcademicians] Filtering complete. ${visibleCount} cards visible.`);

            // Check if we have any visible cards and show/hide no-results message
            let noResultsMsg = document.querySelector('.no-results-message');
            const container = document.querySelector('.academics-grid, .academics-list, .academic-grid');

            if (visibleCount === 0) {
                if (!noResultsMsg && container) {
                    const message = document.createElement('div');
                    message.className = 'no-results-message';
                    message.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i>
                            <p>Aramanıza uygun sonuç bulunamadı. Lütfen farklı arama kriterleri deneyiniz.</p>
                        </div>
                    `;
                    // Insert after the search filters, or at the top of the container
                    searchFilters.parentNode.insertBefore(message, searchFilters.nextSibling);
                    console.log('[filterAcademicians] No results message displayed.');
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
                console.log('[filterAcademicians] No results message removed.');
            }
        } catch (error) {
            console.error('[filterAcademicians] Error during filtering:', error);
        }
    }
    
    // Function to filter announcements (duyurular) 
    function filterDuyurular() {
        try {
            const searchFilters = document.querySelector('.search-filters');
            if (!searchFilters) return;
            
            const searchInput = searchFilters.querySelector('input[type="text"]');
            const selects = searchFilters.querySelectorAll('select');
            
            if (!searchInput || selects.length < 2) return;
            
            const searchValue = searchInput.value.toLowerCase().trim() || '';
            const categoryValue = selects[0].value.toLowerCase().trim() || '';
            const departmentValue = selects[1].value.toLowerCase().trim() || '';
            
            console.log('Filtering duyurular with criteria:', { searchValue, categoryValue, departmentValue });
            
            // Target announcement cards
            const announcementCards = document.querySelectorAll('.announcement-card');
            
            if (announcementCards.length === 0) {
                console.log('No announcement cards found to filter');
                return;
            }
            
            console.log(`Found ${announcementCards.length} announcement cards to filter`);
            
            announcementCards.forEach(card => {
                const title = card.querySelector('.announcement-title')?.innerText.toLowerCase() || '';
                const content = card.querySelector('.announcement-content')?.innerText.toLowerCase() || '';
                const category = card.querySelector('.announcement-category')?.innerText.toLowerCase() || '';
                const department = card.querySelector('.announcement-footer span')?.innerText.toLowerCase() || '';
                
                // Check if the card matches all criteria
                const matchesSearch = searchValue === '' || 
                                     title.includes(searchValue) || 
                                     content.includes(searchValue);
                                     
                const matchesCategory = categoryValue === '' || 
                                       category.toLowerCase().includes(categoryValue);
                                      
                const matchesDepartment = departmentValue === '' || 
                                         department.toLowerCase().includes(departmentValue);
                
                // Show or hide based on all criteria
                if (matchesSearch && matchesCategory && matchesDepartment) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Check if we have any visible cards
            const visibleCards = document.querySelectorAll('.announcement-card:not([style*="display: none"])');
            let noResultsMsg = document.querySelector('.no-results-message');
            
            if (visibleCards.length === 0) {
                // No results found, show message
                if (!noResultsMsg) {
                    const container = document.querySelector('.announcements-list');
                    if (container) {
                        const message = document.createElement('div');
                        message.className = 'no-results-message';
                        message.innerHTML = `
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i>
                                <p>Aramanıza uygun duyuru bulunamadı. Lütfen farklı arama kriterleri deneyiniz.</p>
                            </div>
                        `;
                        container.appendChild(message);
                    }
                }
            } else if (noResultsMsg) {
                // Results found, remove no results message
                noResultsMsg.remove();
            }
            
            console.log(`Filter complete. Found ${visibleCards.length} matching results.`);
        } catch (error) {
            console.error('Error in filterDuyurular:', error);
        }
    }
    
    // Helper function to map faculties to their departments
    function mapFacultyToDepartment(faculty, department) {
        const mapping = {
            'muhendislik': ['bilgisayar', 'elektrik', 'makine', 'inşaat'],
            'isletme': ['işletme', 'ekonomi', 'muhasebe', 'pazarlama'],
            'fen-edebiyat': ['kimya', 'biyoloji', 'matematik', 'türk dili'],
            'egitim': ['eğitim', 'ingilizce', 'matematik öğretmenliği', 'okul öncesi']
        };
        
        if (mapping[faculty]) {
            return mapping[faculty].some(dept => department.includes(dept));
        }
        
        return false;
    }
    
    // Debounce function to limit how often a function gets called
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            let isValid = true;

            if (!name) {
                showError(document.getElementById('name'), 'Lütfen adınızı girin.');
                isValid = false;
            }

            if (!email) {
                showError(document.getElementById('email'), 'Lütfen e-posta adresinizi girin.');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(document.getElementById('email'), 'Lütfen geçerli bir e-posta adresi girin.');
                isValid = false;
            }

            if (!subject) {
                showError(document.getElementById('subject'), 'Lütfen konu girin.');
                isValid = false;
            }

            if (!message) {
                showError(document.getElementById('message'), 'Lütfen mesajınızı girin.');
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Dummy contact form submission
            console.log('Contact form submitted:', { name, email, subject, message });
            alert('Mesajınız gönderildi! Teşekkür ederiz.');
            contactForm.reset(); 
        });
    }
    
    // Helper function to show error messages
    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.closest('.form-check');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
        
        // Add error styling
        if (input.type !== 'checkbox') {
            input.style.borderColor = 'red';
            
            // Reset styling on input
            input.addEventListener('input', function() {
                input.style.borderColor = '';
                const error = formGroup.querySelector('.error-message');
                if (error) {
                    error.remove();
                }
            });
        }
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Basic validation
            let isValid = true;
            if (!email) {
                showError(document.getElementById('email'), 'Lütfen e-posta adresinizi girin.');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(document.getElementById('email'), 'Lütfen geçerli bir e-posta adresi girin.');
                isValid = false;
            }

            if (!password) {
                showError(document.getElementById('password'), 'Lütfen şifrenizi girin.');
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Dummy login logic (replace with actual API call)
            console.log('Login attempt:', { email, password });
            // Simulate successful login for demo
            if (email === "student@example.com" && password === "password") {
                alert('Öğrenci girişi başarılı!');
                window.location.href = 'ogrenci-dashboard.html'; 
            } else if (email === "academic@example.com" && password === "password") {
                alert('Akademisyen girişi başarılı!');
                window.location.href = 'akademisyen-dashboard.html';
            } else if (email === "admin@example.com" && password === "password") {
                alert('Birim Yetkilisi girişi başarılı!');
                window.location.href = 'birim-dashboard.html';
            } else {
                showError(document.getElementById('password'), 'E-posta veya şifre hatalı.');
            }
        });
    }
    
    // Register form validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const userType = document.getElementById('userType').value;
            const terms = document.getElementById('terms').checked;

            let isValid = true;

            if (!fullName) {
                showError(document.getElementById('fullName'), 'Lütfen adınızı ve soyadınızı girin.');
                isValid = false;
            }

            if (!email) {
                showError(document.getElementById('email'), 'Lütfen e-posta adresinizi girin.');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(document.getElementById('email'), 'Lütfen geçerli bir e-posta adresi girin.');
                isValid = false;
            }

            if (!password) {
                showError(document.getElementById('password'), 'Lütfen bir şifre oluşturun.');
                isValid = false;
            } else if (password.length < 6) {
                showError(document.getElementById('password'), 'Şifre en az 6 karakter olmalıdır.');
                isValid = false;
            }

            if (!confirmPassword) {
                showError(document.getElementById('confirmPassword'), 'Lütfen şifrenizi tekrar girin.');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError(document.getElementById('confirmPassword'), 'Şifreler eşleşmiyor.');
                isValid = false;
            }

            if (!userType) {
                showError(document.getElementById('userType'), 'Lütfen kullanıcı türünü seçin.');
                isValid = false;
            }

            if (!terms) {
                showError(document.getElementById('terms').parentElement, 'Kullanım koşullarını kabul etmelisiniz.');
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Dummy registration logic
            console.log('Register attempt:', { fullName, email, password, userType, terms });
            alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
            window.location.href = 'onay.html'; 
        });
    }

    // localStorage helper functions with better error handling
    function getFromLocalStorage(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return defaultValue;
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error retrieving data from localStorage for key: ${key}`, error);
            return defaultValue;
        }
    }
    
    function saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving data to localStorage for key: ${key}`, error);
            alert('Veriler kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
            return false;
        }
    }
    
    function updateLocalStorageItem(key, id, updateFunction) {
        try {
            const items = getFromLocalStorage(key);
            const updatedItems = items.map(item => {
                if (item.id === id) {
                    return updateFunction(item);
                }
                return item;
            });
            return saveToLocalStorage(key, updatedItems);
        } catch (error) {
            console.error(`Error updating item in localStorage for key: ${key}, id: ${id}`, error);
            alert('Veri güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.');
            return false;
        }
    }

    // Handle search results page
    if (window.location.pathname.includes('arama-sonuclari.html')) {
        const params = getUrlParams();
        const searchTerm = params.q ? decodeURIComponent(params.q) : '';
        const searchTermElement = document.getElementById('searchTerm');
        if (searchTermElement) {
            searchTermElement.textContent = searchTerm;
        }
        console.log('[Arama Sonuçları] Search Term:', searchTerm);

        // --- Simulate fetching and displaying results ---
        // Academicians
        const academiciansContainer = document.getElementById('academiciansResultsContainer');
        if (academiciansContainer) {
            const dummyAcademics = [
                { name: 'Prof. Dr. Ahmet Yılmaz', department: 'Bilgisayar Mühendisliği', image: 'img/academic1.jpg', id: 'ahmet-yilmaz' },
                { name: 'Doç. Dr. Ayşe Kaya', department: 'İşletme', image: 'img/academic2.jpg', id: 'ayse-kaya' },
                { name: 'Dr. Öğr. Üyesi Mehmet Demir', department: 'Psikoloji', image: 'img/academic3.jpg', id: 'mehmet-demir' },
                { name: 'Prof. Dr. Zeynep Arslan', department: 'Elektrik-Elektronik Mühendisliği', image: 'img/academic4.jpg', id: 'zeynep-arslan'}
            ];
            const filteredAcademics = dummyAcademics.filter(academic => 
                academic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                academic.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderSearchResults(academiciansContainer, filteredAcademics, 'academic');
        }

        // Units (Birimler)
        const unitsContainer = document.getElementById('unitsResultsContainer');
        console.log('[Arama Sonuçları] unitsContainer element:', unitsContainer);
        if (unitsContainer) {
            const dummyUnits = [
                { name: 'Öğrenci İşleri Daire Başkanlığı', description: 'Öğrenci kayıt, kabul ve diğer işlemler.' },
                { name: 'Kütüphane ve Dokümantasyon Daire Başkanlığı', description: 'Akademik kaynaklar ve kütüphane hizmetleri.' },
                { name: 'Bilgi İşlem Daire Başkanlığı', description: 'Teknik destek ve bilişim altyapısı.' },
                { name: 'Sağlık, Kültür ve Spor Daire Başkanlığı', description: 'Öğrenci sağlık, kültür ve spor faaliyetleri.' }
            ];
            const filteredUnits = dummyUnits.filter(unit => 
                unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                unit.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            console.log('[Arama Sonuçları] Filtered Units:', filteredUnits);
            renderSearchResults(unitsContainer, filteredUnits, 'unit');
        }

        // Departments (Bölümler)
        const departmentsContainer = document.getElementById('departmentsResultsContainer');
        if (departmentsContainer) {
            const dummyDepartments = [
                { name: 'Bilgisayar Mühendisliği', faculty: 'Mühendislik Fakültesi' },
                { name: 'İşletme', faculty: 'İşletme Fakültesi' },
                { name: 'Psikoloji', faculty: 'Fen Edebiyat Fakültesi' },
                { name: 'Makine Mühendisliği', faculty: 'Mühendislik Fakültesi' }
            ];
            const filteredDepartments = dummyDepartments.filter(dept => 
                dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                dept.faculty.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderSearchResults(departmentsContainer, filteredDepartments, 'department');
        }

        // Announcements (Duyurular)
        const announcementsContainer = document.getElementById('announcementsResultsContainer');
        if (announcementsContainer) {
            const dummyAnnouncements = [
                { title: 'Yeni Ders Programı Yayınlandı', date: '10 Mayıs 2023', category: 'Akademik' },
                { title: 'Bahar Şenlikleri Başlıyor', date: '12 Mayıs 2023', category: 'Etkinlik' },
                { title: 'Kütüphane Çalışma Saatleri Güncellendi', date: '08 Mayıs 2023', category: 'Genel' }
            ];
            const filteredAnnouncements = dummyAnnouncements.filter(ann => 
                ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                ann.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderSearchResults(announcementsContainer, filteredAnnouncements, 'announcement');
        }
    }

    function renderSearchResults(container, items, type) {
        container.innerHTML = ''; // Clear loading message
        if (items.length === 0) {
            container.innerHTML = '<p>Bu kategoride sonuç bulunamadı.</p>';
            return;
        }

        items.forEach(item => {
            let itemHTML = '';
            if (type === 'academic') {
                itemHTML = `
                    <div class="academic-card">
                        <div class="academic-img">
                            <img src="${item.image || 'img/default-user.svg'}" alt="${item.name}" onerror="this.src='img/default-user.svg'">
                        </div>
                        <div class="academic-info">
                            <span class="department">${item.department}</span>
                            <h4 class="academic-available">${item.name}</h4>
                            <a href="randevu-al.html?academic=${item.id}" class="btn btn-primary btn-block">Randevu Al</a>
                        </div>
                    </div>`;
            } else if (type === 'unit') {
                console.log('[Arama Sonuçları] Rendering unit:', item);
                itemHTML = `
                    <div class="service-card">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <a href="#" class="btn btn-outline">Detaylar</a>
                    </div>`;
            } else if (type === 'department') {
                itemHTML = `
                    <div class="service-card">
                        <h4>${item.name}</h4>
                        <p>Fakülte: ${item.faculty}</p>
                        <a href="bolumler.html#${item.name.toLowerCase().replace(/ /g, '-')}" class="btn btn-outline">Bölüme Git</a>
                    </div>`;
            } else if (type === 'announcement') {
                itemHTML = `
                    <div class="announcement-card" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #e6e6e6;">
                        <h4 style="margin-bottom: 5px;">${item.title}</h4>
                        <p style="font-size: 0.9em; color: #757575;">Kategori: ${item.category} - Tarih: ${item.date}</p>
                        <a href="#" class="btn btn-sm btn-outline" style="margin-top: 10px;">Oku</a>
                    </div>`;
            }
            container.innerHTML += itemHTML;
        });
    }
}); 