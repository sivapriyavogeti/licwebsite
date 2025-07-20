// --- GLOBAL VARIABLES ---
let isEnglish = true;
const ALL_PLANS_DATA = {};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    initializeAllPlansData(); // Populate plan data
    
    // Set up event listeners
    setupEventListeners();

    // Initialize UI components
    populateComparisonSelectors();
    updateComparisonTableWithDefaults();
    updateTermOptions();
});

function setupEventListeners() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainMenu = document.getElementById('mainMenu');
    const languageToggle = document.getElementById('languageToggle');
    const enquiryForm = document.getElementById('enquiryForm');

    // Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        mainMenu.classList.toggle('show');
        mobileMenuBtn.innerHTML = mainMenu.classList.contains('show') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (mainMenu.classList.contains('show')) {
                    mainMenu.classList.remove('show');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Language Toggle
    languageToggle.addEventListener('click', toggleLanguage);

    // Enquiry Form Submission Handler
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', handleEnquiryFormSubmit);
    }
}

// --- LANGUAGE TOGGLE LOGIC ---
function toggleLanguage() {
    isEnglish = !isEnglish;
    
    updateAllText();
    initializeAllPlansData(); 
    
    populateComparisonSelectors(); 
    updateComparisonTable();
    updateTermOptions();
}

function updateAllText() {
    const currentLanguageSpan = document.getElementById('currentLanguage');
    currentLanguageSpan.textContent = isEnglish ? 'English' : 'తెలుగు';
    document.body.classList.toggle('telugu', !isEnglish);

    document.querySelectorAll('[data-en], [data-te]').forEach(el => {
        const targetLang = isEnglish ? 'en' : 'te';
        const content = el.dataset[targetLang];
        if (content !== undefined) {
             if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                const placeholderKey = isEnglish ? 'en-placeholder' : 'te-placeholder';
                 el.placeholder = el.dataset[placeholderKey] || content;
             } else {
                 el.innerHTML = content;
             }
        }
    });

    document.querySelectorAll('option[data-en][data-te]').forEach(option => {
        option.textContent = isEnglish ? option.getAttribute('data-en') : option.getAttribute('data-te');
    });

    document.querySelector('title').textContent = isEnglish 
        ? 'LIC Agent | Vogeti Bhuvaneswari Devi | Tadepalligudem' 
        : 'LIC ఏజెంట్ | వోగేటి భువనేశ్వరి దేవి | తాడేపల్లిగుడెం';
}

// --- CONTACT FORM LOGIC ---
async function handleEnquiryFormSubmit(event) {
    event.preventDefault(); // Prevent default page reload

    const form = event.target;
    const formData = new FormData(form);
    const confirmationDiv = document.getElementById('formConfirmation');
    const submitButton = form.querySelector('button[type="submit"]');

    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = isEnglish ? 'Submitting...' : 'సమర్పిస్తోంది...';

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            form.style.display = 'none'; // Hide the form
            confirmationDiv.classList.add('show'); // Show success message
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert(isEnglish ? 'Submission failed. Please try again or contact me directly.' : 'సమర్పణ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా నన్ను నేరుగా సంప్రదించండి.');
        // Re-enable the button if submission fails
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// --- DATA HANDLING ---
function initializeAllPlansData() {
    const planIds = ['jeevan-ushav', 'jeevan-umang', 'jeevan-labh', 'amrut-bal', 'money-back', 'jeevan-anand'];
    planIds.forEach(id => {
        ALL_PLANS_DATA[id] = getPlanDetails(id);
    });
}

function getPlanDetails(planId) {
    const plansData = {
        'jeevan-ushav': {
            name_en: 'Jeevan Ushav', name_te: 'జీవన ఉషవ్',
            badge_en: 'Term Plan', badge_te: 'టర్మ్ ప్లాన్',
            image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            features_en: [ 'Affordable term insurance', 'High risk coverage (₹5L-₹50L)', 'Tax benefits under 80C', '5-25 year terms' ],
            features_te: [ 'అందుబాటులో ఉన్న టర్మ్ ఇన్సూరెన్స్', 'అధిక రిస్క్ కవరేజీ (₹5L-₹50L)', '80C కింద పన్ను ప్రయోజనాలు', '5-25 సంవత్సరాల పరిమితులు' ],
            eligibility: { age: '90 days - 55 years', term: '5-25 years', minSum: '₹5,00,000' },
            comparison_en: { target_audience: 'Individuals seeking pure life cover', term: '5 to 25 Years', payment_term: 'Same as Policy Term', maturity_benefits: 'Return of Premium (Optional)', bonus_availability: 'No', min_sum_assured: '₹5,00,000', max_entry_age: '55 Years' },
            comparison_te: { target_audience: 'స్వచ్మైన జీవిత కవర్‌ను కోరుకునే వ్యక్తులు', term: '5 నుండి 25 సంవత్సరాలు', payment_term: 'పాలసీ పరిమితి వలెనే', maturity_benefits: 'ప్రీమియం తిరిగి చెల్లింపు (ఐచ్ఛికం)', bonus_availability: 'లేదు', min_sum_assured: '₹5,00,000', max_entry_age: '55 సంవత్సరాలు' }
        },
        'jeevan-umang': {
            name_en: 'Jeevan Umang', name_te: 'జీవన ఉమంగ్',
            badge_en: 'Income Plan', badge_te: 'ఆదాయ ప్రణాళిక',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%D%3D&auto=format&fit=crop&w=800&q=80',
            features_en: [ '8% annual income benefit', 'Whole life coverage', 'Bonus additions', 'Loan facility' ],
            features_te: [ '8% వార్షిక ఆదాయ ప్రయోజనం', 'మొత్తం జీవిత కవరేజీ', 'బోనస్ జోడింపులు', 'లోన్ సదుపాయం' ],
            eligibility: { age: '90 days - 55 years', term: 'Whole Life', minSum: '₹2,00,000' },
            comparison_en: { target_audience: 'Retirement & Regular Income Seekers', term: 'Whole Life (Till age 100)', payment_term: '15, 20, 25, 30 Years', maturity_benefits: 'Sum Assured + Bonus at age 100', bonus_availability: 'Yes', min_sum_assured: '₹2,00,000', max_entry_age: '55 Years' },
            comparison_te: { target_audience: 'పదవీ విరమణ & సాధారణ ఆదాయం కోరుకునేవారు', term: 'మొత్తం జీవితం (100 సంవత్సరాల వరకు)', payment_term: '15, 20, 25, 30 సంవత్సరాలు', maturity_benefits: '100 సంవత్సరాల వయస్సులో హామీ మొత్తం + బోనస్', bonus_availability: 'అవును', min_sum_assured: '₹2,00,000', max_entry_age: '55 సంవత్సరాలు' }
        },
        'jeevan-labh': {
            name_en: 'Jeevan Labh', name_te: 'జీవన లాభ్',
            badge_en: 'Limited Pay', badge_te: 'పరిమిత చెల్లింపు',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            features_en: [ 'Pay for 10, 15, or 16 years only', 'High bonus accumulation', 'Coverage till maturity', 'Tax benefits under 80C & 10(10D)' ],
            features_te: [ '10, 15, లేదా 16 సంవత్సరాలకు మాత్రమే చెల్లించండి', 'అధిక బోనస్ సంచయం', 'మెచ్యూరిటీ వరకు కవరేజీ', '80C & 10(10D) కింద పన్ను ప్రయోజనాలు' ],
            eligibility: { age: '90 days - 60 years', term: '16, 21, 25 years', minSum: '₹2,00,000' },
            comparison_en: { target_audience: 'Individuals seeking high returns with limited premium payment', term: '16, 21, 25 Years', payment_term: '10, 15, 16 Years', maturity_benefits: 'Sum Assured + Bonus', bonus_availability: 'Yes', min_sum_assured: '₹2,00,000', max_entry_age: '60 Years' },
            comparison_te: { target_audience: 'పరిమిత ప్రీమియం చెల్లింపుతో అధిక రాబడిని కోరుకునే వ్యక్తులు', term: '16, 21, 25 సంవత్సరాలు', payment_term: '10, 15, 16 సంవత్సరాలు', maturity_benefits: 'హామీ మొత్తం + బోనస్', bonus_availability: 'అవును', min_sum_assured: '₹2,00,000', max_entry_age: '60 సంవత్సరాలు' }
        },
        'amrut-bal': {
            name_en: 'Amrut Bal', name_te: 'అమృత్ బాల్',
            badge_en: 'Child Plan', badge_te: 'పిల్లల ప్రణాళిక',
            image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            features_en: [ 'Only 8 year payment term', 'Secure child\'s future for education/marriage', 'Waiver of premium benefit available', 'Guaranteed Additions throughout the policy term' ],
            features_te: [ '8 సంవత్సరాల చెల్లింపు పరిమితి మాత్రమే', 'పిల్లల భవిష్యత్తును విద్య/వివాహం కోసం సురక్షితం చేయండి', 'ప్రీమియం మినహాయింపు ప్రయోజనం అందుబాటులో ఉంది', 'పాలసీ వ్యవధి అంతటా హామీ ఉన్న అదనపు లాభాలు' ],
            eligibility: { age: '90 days - 55 years', term: '8 years', minSum: '₹2,00,000' },
            comparison_en: { target_audience: 'Parents planning for child\'s future (education/marriage)', term: '18-25 Years (selected at inception)', payment_term: '8 Years', maturity_benefits: 'Guaranteed Additions + Sum Assured', bonus_availability: 'No (Guaranteed Additions)', min_sum_assured: '₹2,00,000', max_entry_age: '55 Years (child\'s age at maturity up to 25)' },
            comparison_te: { target_audience: 'పిల్లల భవిష్యత్తు కోసం ప్రణాళిక చేస్తున్న తల్లిదండ్రులు (విద్య/వివాహం)', term: '18-25 సంవత్సరాలు (ప్రారంభంలో ఎంపిక చేయబడింది)', payment_term: '8 సంవత్సరాలు', maturity_benefits: 'హామీ ఉన్న అదనపు లాభాలు + హామీ మొత్తం', bonus_availability: 'లేదు (హామీ ఉన్న అదనపు లాభాలు)', min_sum_assured: '₹2,00,000', max_entry_age: '55 సంవత్సరాలు (పిల్లల వయస్సు మెచ్యూరిటీ వద్ద 25 వరకు)' }
        },
        'money-back': {
            name_en: 'Money Back', name_te: 'మనీ బ్యాక్',
            badge_en: 'Periodic Payouts', badge_te: 'ఆవర్తన చెల్లింపులు',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            features_en: [ '20% of Sum Assured every 5 years', 'Final maturity benefit with bonus', 'Loan facility available', 'Liquidity for short-term needs' ],
            features_te: [ 'ప్రతి 5 సంవత్సరాలకు హామీ మొత్తంలో 20%', 'బోనస్‌తో చివరి మెచ్యూరిటీ ప్రయోజనం', 'లోన్ సదుపాయం అందుబాటులో ఉంది', 'స్వల్పకాలిక అవసరాలకు ద్రవ్యత' ],
            eligibility: { age: '13 - 50 years', term: '20 or 25 years', minSum: '₹1,00,000' },
            comparison_en: { target_audience: 'Individuals needing periodic income with life cover', term: '20 or 25 Years', payment_term: '15 or 20 Years', maturity_benefits: 'Remaining Sum Assured + Bonus + Final Additional Bonus', bonus_availability: 'Yes', min_sum_assured: '₹1,00,000', max_entry_age: '50 Years' },
            comparison_te: { target_audience: 'జీవిత కవర్‌తో ఆవర్తన ఆదాయం అవసరమైన వ్యక్తులు', term: '20 లేదా 25 సంవత్సరాలు', payment_term: '15 లేదా 20 సంవత్సరాలు', maturity_benefits: 'మిగిలిన హామీ మొత్తం + బోనస్ + చివరి అదనపు బోనస్', bonus_availability: 'అవును', min_sum_assured: '₹1,00,000', max_entry_age: '50 సంవత్సరాలు' }
        },
        'jeevan-anand': {
            name_en: 'Jeevan Anand', name_te: 'జీవన ఆనంద్',
            badge_en: 'Lifetime Cover', badge_te: 'జీవితకాల కవర్',
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            features_en: [ 'Life coverage for whole life even after maturity', 'Lump sum maturity benefits + bonus', 'Loan facility available', 'Double benefit: maturity + death cover always' ],
            features_te: [ 'మెచ్యూరిటీ తర్వాత కూడా మొత్తం జీవితానికి కవరేజీ', 'లక్ష మెచ్యూరిటీ ప్రయోజనాలు + బోనస్', 'లోన్ సదుపాయం అందుబాటులో ఉంది', 'ద్వంద్వ ప్రయోజనం: మెచ్యూరిటీ + మరణ కవరేజ్ ఎల్లప్పుడూ' ],
            eligibility: { age: '18 - 50 years', term: '15-35 years', minSum: '₹1,00,000' },
            comparison_en: { target_audience: 'Individuals seeking long-term savings with lifetime risk cover', term: '15 to 35 Years (Maturity), then whole life cover', payment_term: 'Same as Policy Term', maturity_benefits: 'Sum Assured + Bonus + Final Additional Bonus (at maturity)', bonus_availability: 'Yes', min_sum_assured: '₹1,00,000', max_entry_age: '50 Years' },
            comparison_te: { target_audience: 'జీవిత కవర్‌తో దీర్ఘకాలిక పొదుపులను కోరుకునే వ్యక్తులు', term: '15 నుండి 35 సంవత్సరాలు (మెచ్యూరిటీ), తరువాత మొత్తం జీవిత కవరేజ్', payment_term: 'పాలసీ పరిమితి వలెనే', maturity_benefits: 'హామీ మొత్తం + బోనస్ + చివరి అదనపు బోనస్ (మెచ్యూరిటీ వద్ద)', bonus_availability: 'అవును', min_sum_assured: '₹1,00,000', max_entry_age: '50 సంవత్సరాలు' }
        }
    };
    
    const planData = plansData[planId] || {};
    const plan = { ...planData }; // Create a shallow copy

    plan.name = isEnglish ? planData.name_en : planData.name_te;
    plan.badge = isEnglish ? planData.badge_en : planData.badge_te;
    plan.features = isEnglish ? planData.features_en : planData.features_te;
    plan.comparison = isEnglish ? planData.comparison_en : planData.comparison_te;
    
    return plan;
}

function recommendPlan() {
    const age = parseInt(document.getElementById("age").value);
    const goal = document.getElementById("goal").value;
    const budget = parseInt(document.getElementById("budget").value);
    const resultBox = document.getElementById("resultBox");
    const recommendationText = document.getElementById("recommendationText");

    if (!age || !goal || !budget) {
        recommendationText.innerHTML = isEnglish ? 
            "❗ Please fill in all fields to get a recommendation." : 
            "❗ సిఫార్సు పొందడానికి అన్ని ఫీల్డ్లను పూరించండి.";
        resultBox.style.display = "block";
        return;
    }

    let planId = "";
    if (goal === "child" && age <= 45 && budget >= 1000) { planId = "amrut-bal"; } 
    else if (goal === "retirement" && age >= 35 && budget >= 1500) { planId = "jeevan-umang"; } 
    else if (goal === "savings" && budget >= 800) { planId = "jeevan-labh"; } 
    else if (goal === "term" && age <= 55 && budget >= 500) { planId = "jeevan-ushav"; }

    let suggestion = "";
    let featuresHtml = "";

    if (planId) {
        const planDetails = getPlanDetails(planId);
        suggestion = (isEnglish ? "Based on your inputs, we recommend: " : "మీ ఇన్పుట్ల ఆధారంగా, మేము సిఫార్సు చేస్తున్నాము: ") + `<strong>${planDetails.name}</strong>`;
        featuresHtml = `<div class="recommender-features"><ul style="list-style-type: none; padding-left: 0;">${planDetails.features.map(f => `<li style="position: relative; padding-left: 20px; margin-bottom: 8px;"><span style="color: var(--accent-gold); font-weight: bold; position: absolute; left: 0;">✓</span> ${f}</li>`).join('')}</ul></div>`;
        resultBox.dataset.planId = planId; // Store planId for the PDF function
    } else {
        suggestion = isEnglish ? 
            "No suitable plan found. Please contact me for personalized advice." : 
            "తగిన ప్రణాళిక కనుగొనబడలేదు. దయచేసి వ్యక్తిగతీకరించిన సలహా కోసం నన్ను సంప్రదించండి.";
        resultBox.removeAttribute('data-plan-id');
    }

    recommendationText.innerHTML = suggestion + featuresHtml;
    resultBox.style.display = "block";
}

function showPlanDetails(planId) {
    const modal = document.getElementById('planDetailsModal');
    const content = document.getElementById('planDetailsContent');
    const planDetails = getPlanDetails(planId);
    
    content.innerHTML = `
        <div id="pdfPlanDetails" data-plan-id="${planId}">
            <h2>${planDetails.name} <span class="plan-badge">${planDetails.badge}</span></h2>
            <div class="plan-details-grid">
                <div class="plan-details-image"><img src="${planDetails.image}" alt="${planDetails.name}"></div>
                <div class="plan-details-content">
                    <h3>${isEnglish ? "Key Benefits:" : "ప్రధాన ప్రయోజనాలు:"}</h3>
                    <ul>${planDetails.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
                    <div class="eligibility-badge">
                        <h4>${isEnglish ? "Eligibility:" : "అర్హత:"}</h4>
                        <p><i class="fas fa-user"></i> <strong>${isEnglish ? "Age:" : "వయస్సు:"}</strong> ${planDetails.eligibility.age}</p>
                        <p><i class="fas fa-calendar-alt"></i> <strong>${isEnglish ? "Term:" : "పరిమితి:"}</strong> ${planDetails.eligibility.term}</p>
                        <p><i class="fas fa-rupee-sign"></i> <strong>${isEnglish ? "Minimum Sum:" : "కనీస మొత్తం:"}</strong> ${planDetails.eligibility.minSum}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="plan-actions">
            <button class="btn" onclick="downloadPlanAsPDF('pdfPlanDetails')">${isEnglish ? "Download as PDF" : "PDF గా డౌన్‌లోడ్ చేయండి"}</button>
            <button class="btn btn-blue" onclick="showCalculator('${planId}')">${isEnglish ? "Calculate Premium" : "ప్రీమియం లెక్కించండి"}</button>
        </div>
    `;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePlanDetails() {
    document.getElementById('planDetailsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showCalculator(planId) {
    const modal = document.getElementById('calculatorModal');
    const planTypeSelect = document.getElementById('planType');
    closePlanDetails();
    resetCalculator();
    planTypeSelect.value = planId;
    updateTermOptions();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-content').scrollTop = 0;
}

function closeCalculator() {
    document.getElementById('calculatorModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateTermOptions() {
    const planType = document.getElementById('planType').value;
    const policyTerm = document.getElementById('policyTerm');
    policyTerm.innerHTML = isEnglish ? '<option value="">-- Select Term --</option>' : '<option value="">-- పరిమితిని ఎంచుకోండి --</option>';
    if(!planType) return;

    // Special handling for Jeevan Umang for its premium payment terms
    if (planType === 'jeevan-umang') {
        const umangTerms = [15, 20, 25]; // As requested
        umangTerms.forEach(term => {
            const option = document.createElement('option');
            option.value = term;
            option.textContent = isEnglish ? `${term} Years` : `${term} సంవత్సరాలు`;
            policyTerm.appendChild(option);
        });
        return; // Exit after populating
    }
    
    const planDetails = getPlanDetails(planType);
    const termRangeText = planDetails.eligibility.term;

    if (termRangeText.toLowerCase().includes('whole life')) {
        const option = document.createElement('option');
        option.value = 100;
        option.textContent = isEnglish ? 'Whole Life' : 'మొత్తం జీవితం';
        policyTerm.appendChild(option);
        return;
    }

    const terms = termRangeText.match(/\d+/g);
    if (!terms) return;

    if (terms.length === 1) {
        const option = document.createElement('option');
        option.value = terms[0];
        option.textContent = isEnglish ? `${terms[0]} Years` : `${terms[0]} సంవత్సరాలు`;
        policyTerm.appendChild(option);
    } else if (terms.length > 1) {
        // Handles comma-separated values like "20 or 25 years" or ranges like "5-25 years"
        if (termRangeText.includes('or') || termRangeText.includes(',')) {
            terms.forEach(term => {
                const option = document.createElement('option');
                option.value = term;
                option.textContent = isEnglish ? `${term} Years` : `${term} సంవత్సరాలు`;
                policyTerm.appendChild(option);
            });
        } else {
             const [minTerm, maxTerm] = terms.map(Number);
            for(let i = minTerm; i <= maxTerm; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = isEnglish ? `${i} Years` : `${i} సంవత్సరాలు`;
                policyTerm.appendChild(option);
            }
        }
    }
}

// Placeholder functions for the calculator - implement their logic here!
function validateAge() { 
    const ageInput = document.getElementById('calcAge');
    const age = parseInt(ageInput.value);
    if (age < 1 || age > 70 || isNaN(age)) {
        ageInput.setCustomValidity(isEnglish ? 'Please enter a valid age between 1 and 70.' : 'దయచేసి 1 నుండి 70 మధ్య వయస్సును నమోదు చేయండి.');
    } else {
        ageInput.setCustomValidity('');
    }
    ageInput.reportValidity();
}

function validateSumAssured() { 
    const sumAssuredInput = document.getElementById('sumAssured');
    const sumAssuredRange = document.getElementById('sumAssuredRange');
    const value = parseInt(sumAssuredInput.value);
    const min = parseInt(sumAssuredInput.min);
    const max = parseInt(sumAssuredInput.max);

    if (value < min || value > max || isNaN(value)) {
        sumAssuredInput.setCustomValidity(isEnglish ? `Please enter a sum assured between ₹${min.toLocaleString('en-IN')} and ₹${max.toLocaleString('en-IN')}.` : `దయచేసి ₹${min.toLocaleString('en-IN')} మరియు ₹${max.toLocaleString('en-IN')} మధ్య హామీ మొత్తాన్ని నమోదు చేయండి.`);
    } else {
        sumAssuredInput.setCustomValidity('');
        sumAssuredRange.value = value; // Sync range input
    }
    sumAssuredInput.reportValidity();
}

function updateSumAssured() { 
    const sumAssuredRange = document.getElementById('sumAssuredRange');
    const sumAssuredInput = document.getElementById('sumAssured');
    sumAssuredInput.value = sumAssuredRange.value;
    validateSumAssured(); // Validate after update
}

function calculatePremium() { 
    const form = document.getElementById('premiumForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const planType = document.getElementById('planType').value;
    const age = parseInt(document.getElementById('calcAge').value);
    const gender = document.getElementById('gender').value;
    const sumAssured = parseInt(document.getElementById('sumAssured').value);
    const policyTerm = parseInt(document.getElementById('policyTerm').value);
    const paymentMode = document.getElementById('paymentMode').value;
    const calculatorResult = document.getElementById('calculatorResult');
    const premiumAmountSpan = document.getElementById('premiumAmount');
    const premiumModeSpan = document.getElementById('premiumMode');
    const resultSumAssuredSpan = document.getElementById('resultSumAssured');
    const resultTermSpan = document.getElementById('resultTerm');
    const totalPremiumSpan = document.getElementById('totalPremium');

    // Simple placeholder premium calculation logic (replace with actual LIC actuarial data if available)
    let basePremium = 0;
    
    // Base premium by plan and sum assured (simplified example)
    switch(planType) {
        case 'jeevan-ushav': basePremium = (sumAssured / 100000) * 300; break;
        case 'jeevan-umang': basePremium = (sumAssured / 100000) * 450; break;
        case 'jeevan-labh': basePremium = (sumAssured / 100000) * 380; break;
        case 'amrut-bal': basePremium = (sumAssured / 100000) * 250; break;
        case 'money-back': basePremium = (sumAssured / 100000) * 400; break;
        case 'jeevan-anand': basePremium = (sumAssured / 100000) * 320; break;
        default: basePremium = 0;
    }

    // Adjust for age (simplified: higher age, higher premium)
    basePremium *= (1 + (age - 20) * 0.005); 

    // Adjust for gender (simplified: females slightly lower?)
    if (gender === 'female') {
        basePremium *= 0.98; 
    }

    // Adjust for term (simplified: longer term, slightly higher total premium spread out)
    // Note: Actual term impacts base premium significantly based on mortality tables
    basePremium *= (1 + (policyTerm - 15) * 0.002);

    let monthlyPremium = basePremium;
    let totalPremiumForTerm = basePremium * policyTerm; // Very simplified
    let modeText = '';

    switch(paymentMode) {
        case 'yearly': 
            monthlyPremium = basePremium * 12 * 0.95 / 12; // Discount for yearly
            modeText = isEnglish ? 'per year' : 'సంవత్సరానికి';
            break;
        case 'half-yearly': 
            monthlyPremium = basePremium * 6 * 0.97 / 12; // Discount for half-yearly
            modeText = isEnglish ? 'per half-year' : 'సగం సంవత్సరానికి';
            break;
        case 'monthly': 
            monthlyPremium = basePremium;
            modeText = isEnglish ? 'per month' : 'నెలకు';
            break;
    }

    // Final monthly premium display needs to be multiplied if showing for other modes
    let displayPremium;
    if (paymentMode === 'yearly') displayPremium = monthlyPremium * 12;
    else if (paymentMode === 'half-yearly') displayPremium = monthlyPremium * 6;
    else displayPremium = monthlyPremium;

    premiumAmountSpan.textContent = `₹${Math.round(displayPremium).toLocaleString('en-IN')}`;
    premiumModeSpan.textContent = modeText;
    resultSumAssuredSpan.textContent = `₹${sumAssured.toLocaleString('en-IN')}`;
    resultTermSpan.textContent = policyTerm;
    totalPremiumSpan.textContent = `₹${Math.round(totalPremiumForTerm).toLocaleString('en-IN')}`; // This total is simplistic, needs to be based on actual total payments

    calculatorResult.style.display = 'block';
    calculatorResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetCalculator() { 
    document.getElementById('premiumForm').reset();
    document.getElementById('calculatorResult').style.display = 'none';
    document.getElementById('premiumAmount').textContent = '₹0';
    document.getElementById('premiumMode').textContent = isEnglish ? 'per month' : 'నెలకు';
    document.getElementById('resultSumAssured').textContent = '₹0';
    document.getElementById('resultTerm').textContent = '0';
    document.getElementById('totalPremium').textContent = '₹0';
    updateTermOptions(); // Reset term options
}


function populateComparisonSelectors() {
    const comparisonSelectors = ['comparePlan1', 'comparePlan2', 'comparePlan3'];
    const planOptions = Object.keys(ALL_PLANS_DATA).map(planId => {
        const plan = ALL_PLANS_DATA[planId];
        return `<option value="${planId}">${plan.name}</option>`;
    }).join('');

    comparisonSelectors.forEach(id => {
        const selector = document.getElementById(id);
        const currentValue = selector.value;
        selector.innerHTML = `<option value="">-- ${isEnglish ? 'Select Plan' : 'ప్లాన్‌ని ఎంచుకోండి'} --</option>` + planOptions;
        if (ALL_PLANS_DATA[currentValue]) {
            selector.value = currentValue;
        }
    });
}

function updateComparisonTable() {
    const comparisonSelectors = ['comparePlan1', 'comparePlan2', 'comparePlan3'];
    const selectedPlans = comparisonSelectors.map(id => document.getElementById(id).value).filter(Boolean);
    const tableHead = document.getElementById('comparisonTable').querySelector('thead');
    const tableBody = document.getElementById('comparisonTable').querySelector('tbody');

    if (selectedPlans.length === 0) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        return;
    }

    let headerHtml = `<tr><th>${isEnglish ? 'Feature' : 'ఫీచర్'}</th>`;
    selectedPlans.forEach(planId => { headerHtml += `<th>${ALL_PLANS_DATA[planId].name}</th>`; });
    headerHtml += '</tr>';
    tableHead.innerHTML = headerHtml;

    const features = ['target_audience', 'term', 'payment_term', 'maturity_benefits', 'bonus_availability', 'min_sum_assured', 'max_entry_age'];
    const featureNames = {
        target_audience: isEnglish ? 'Target Audience' : 'లక్ష్య ప్రేక్షకులు', term: isEnglish ? 'Policy Term' : 'పాలసీ పరిమితి',
        payment_term: isEnglish ? 'Premium Payment Term' : 'ప్రీమియం చెల్లింపు టర్మ్', maturity_benefits: isEnglish ? 'Maturity Benefits' : 'మెచ్యూరిటీ ప్రయోజనాలు',
        bonus_availability: isEnglish ? 'Bonus Availability' : 'బోనస్ లభ్యత', min_sum_assured: isEnglish ? 'Min Sum Assured' : 'కనీస హామీ మొత్తం',
        max_entry_age: isEnglish ? 'Max Entry Age' : 'గరిష్ట ప్రవేశ వయస్సు'
    };

    let bodyHtml = '';
    features.forEach(feature => {
        bodyHtml += `<tr><td><strong>${featureNames[feature]}</strong></td>`;
        selectedPlans.forEach(planId => {
            const featureValue = ALL_PLANS_DATA[planId].comparison[feature] || (isEnglish ? 'N/A' : 'వర్తించదు');
            bodyHtml += `<td>${featureValue}</td>`;
        });
        bodyHtml += '</tr>';
    });
    tableBody.innerHTML = bodyHtml;
}

function updateComparisonTableWithDefaults() {
    document.getElementById('comparePlan1').value = 'jeevan-labh';
    document.getElementById('comparePlan2').value = 'jeevan-umang';
    document.getElementById('comparePlan1').addEventListener('change', updateComparisonTable);
    document.getElementById('comparePlan2').addEventListener('change', updateComparisonTable);
    document.getElementById('comparePlan3').addEventListener('change', updateComparisonTable);
    updateComparisonTable();
}

function downloadPlanAsPDF(elementId) {
    const customerName = prompt(isEnglish ? "Please enter your name for the PDF:" : "దయచేసి PDF కోసం మీ పేరును నమోదు చేయండి:", "");
    if (!customerName || customerName.trim() === "") {
        return; // User cancelled or entered empty name
    }

    const sourceElement = document.getElementById(elementId);
    if (!sourceElement) {
        console.error("PDF source element not found:", elementId);
        return;
    }
    
    const planId = sourceElement.dataset.planId;
    if (!planId) {
        alert(isEnglish ? "Could not find plan details to generate PDF." : "PDFని రూపొందించడానికి ప్లాన్ వివరాలు కనుగొనబడలేదు.");
        return;
    }
    
    const planDetails = getPlanDetails(planId);

    const contentToPrint = sourceElement.cloneNode(true);
    const actions = contentToPrint.querySelector('.recommender-actions') || contentToPrint.querySelector('.plan-actions');
    if (actions) actions.remove();

    const printContainer = document.createElement('div');
    printContainer.style.position = 'fixed';
    printContainer.style.opacity = '0';
    printContainer.style.zIndex = '-9999';
    printContainer.style.top = '0';
    printContainer.style.left = '0';

    printContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #ddd; color: #333; width: 8.5in; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <img src="lic-logo.png" style="height: 50px; margin-right: 15px;">
                <div style="text-align: right;">
                    <h3 style="margin: 0; color: #002D62;">Vogeti Bhuvaneswari Devi</h3>
                    <p style="margin: 0; font-size: 0.9em;">LIC Certified Agent | Code: 03900682</p>
                </div>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="margin-bottom: 15px;"><strong>${isEnglish ? 'Prepared for' : 'కోసం తయారు చేయబడింది'}:</strong> ${customerName}</p>
            <hr style="border: 0; border-top: 1px dashed #ddd; margin: 20px 0;">
            ${contentToPrint.innerHTML}
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
            <div style="text-align: center; margin-top: 20px; font-size: 0.9em; color: #555;">
                <p><strong>${isEnglish ? 'Contact for more details' : 'మరిన్ని వివరాలకు సంప్రదించండి'}:</strong></p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> 7013564949 | <strong>WhatsApp:</strong> 9441902214</p>
                <p style="margin: 5px 0;"><strong>Office:</strong> 2-19-3, Vogeti vari street, near railway station, Tadepalligudem - 534101</p>
            </div>
        </div>`;
    
    document.body.appendChild(printContainer);

    const opt = {
        margin: 0,
        filename: `${planDetails.name_en.replace(/\s/g, '_')}_${customerName.replace(/\s/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(printContainer).set(opt).save().finally(() => {
        document.body.removeChild(printContainer);
    });
}