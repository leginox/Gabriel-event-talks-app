
const fs = require('fs');
const path = require('path');

const TALK_DATA = [
    {
        title: "Introduction to Web Components",
        speakers: ["Alice Johnson"],
        category: ["Frontend", "Web Standards"],
        duration: 60,
        description: "A deep dive into building reusable components for the web."
    },
    {
        title: "Scaling Node.js Applications",
        speakers: ["Bob Smith", "Carol White"],
        category: ["Backend", "Node.js", "Performance"],
        duration: 60,
        description: "Best practices and common pitfalls when scaling your Node.js services."
    },
    {
        title: "CSS Grid Layout Masterclass",
        speakers: ["David Green"],
        category: ["Frontend", "CSS"],
        duration: 60,
        description: "Unlock the power of CSS Grid for responsive and complex layouts."
    },
    {
        title: "Database Design for Microservices",
        speakers: ["Eve Black"],
        category: ["Backend", "Databases", "Microservices"],
        "duration": 60,
        "description": "Strategies for designing databases in a microservice architecture."
    },
    {
        "title": "JavaScript ES2026 Features",
        "speakers": ["Frank Blue"],
        "category": ["Frontend", "JavaScript"],
        "duration": 60,
        "description": "A look at the exciting new features coming in the next ECMAScript standard."
    },
    {
        "title": "Security Best Practices in Web Development",
        "speakers": ["Grace Red"],
        "category": ["Security", "Web Development"],
        "duration": 60,
        "description": "Essential security measures every web developer should know."
    }
];

const EVENT_START_HOUR = 10; // 10:00 AM
const EVENT_START_MINUTE = 0;
const LUNCH_BREAK_DURATION_MINS = 60;
const TRANSITION_DURATION_MINS = 10;

function generateSchedule(talks) {
    let currentHour = EVENT_START_HOUR;
    let currentMinute = EVENT_START_MINUTE;
    const schedule = [];
    
    function addMinutes(hour, minute, minutesToAdd) {
        minute += minutesToAdd;
        hour += Math.floor(minute / 60);
        minute %= 60;
        return { hour, minute };
    }

    function formatTime(hour, minute) {
        const h = String(hour).padStart(2, '0');
        const m = String(minute).padStart(2, '0');
        return `${h}:${m}`;
    }

    for (let i = 0; i < talks.length; i++) {
        // Add transition before talk, except for the very first talk
        if (i > 0) {
            ({ hour: currentHour, minute: currentMinute } = addMinutes(currentHour, currentMinute, TRANSITION_DURATION_MINS));
        }

        // Add talk
        const talk = talks[i];
        const talkStartTime = formatTime(currentHour, currentMinute);
        
        ({ hour: currentHour, minute: currentMinute } = addMinutes(currentHour, currentMinute, talk.duration));
        
        const talkEndTime = formatTime(currentHour, currentMinute);
        schedule.push({
            type: 'talk',
            ...talk,
            startTime: talkStartTime,
            endTime: talkEndTime
        });

        // Check for lunch break after the 3rd talk (index 2)
        if (i === 2) { 
            ({ hour: currentHour, minute: currentMinute } = addMinutes(currentHour, currentMinute, TRANSITION_DURATION_MINS)); // Transition before lunch

            const lunchStartTime = formatTime(currentHour, currentMinute);
            
            ({ hour: currentHour, minute: currentMinute } = addMinutes(currentHour, currentMinute, LUNCH_BREAK_DURATION_MINS));
            
            const lunchEndTime = formatTime(currentHour, currentMinute);
            schedule.push({
                type: 'break',
                title: 'Lunch Break',
                duration: LUNCH_BREAK_DURATION_MINS,
                startTime: lunchStartTime,
                endTime: lunchEndTime
            });
        }
    }
    return schedule;
}

const GENERATED_SCHEDULE = generateSchedule(TALK_DATA);

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Talks Event</title>
    <style>
        /* INJECT_CSS_HERE */
    </style>
</head>
<body>
    <header>
        <h1>Tech Talks Day</h1>
        <p>A full day of insightful technical talks.</p>
    </header>
    <main>
        <section class="controls">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., Frontend, Backend)">
        </section>
        <section id="schedule">
            <!-- Schedule will be rendered here by JavaScript -->
        </section>
    </main>
    <footer>
        <p>&copy; 2026 Tech Talks Event</p>
    </footer>
    <script>
        /* INJECT_JS_HERE */
    </script>
</body>
</html>
`;

const CSS_CONTENT = `
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f7f6;
    color: #333;
    line-height: 1.6;
}

header {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 2rem 1rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
}

header p {
    font-size: 1.1rem;
}

main {
    max-width: 1000px;
    margin: 20px auto;
    padding: 0 1rem;
}

.controls {
    margin-bottom: 20px;
    text-align: center;
}

#categorySearch {
    padding: 10px 15px;
    width: 100%;
    max-width: 400px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

#schedule {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

.talk-card, .break-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 20px;
    transition: transform 0.2s ease-in-out;
}

.talk-card:hover {
    transform: translateY(-5px);
}

.talk-card h2 {
    color: #3498db;
    margin-top: 0;
    font-size: 1.5rem;
}

.talk-card .time {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-bottom: 10px;
    display: block;
}

.talk-card .speakers {
    font-style: italic;
    color: #555;
    margin-bottom: 10px;
}

.talk-card .category {
    font-size: 0.85rem;
    background-color: #ecf0f1;
    padding: 5px 8px;
    border-radius: 3px;
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 10px;
}

.talk-card .description {
    font-size: 0.95rem;
    color: #444;
}

.break-card {
    background-color: #dbe4e4;
    text-align: center;
    padding: 30px 20px;
    color: #2c3e50;
    font-size: 1.2rem;
    font-weight: bold;
}

.break-card .time {
    font-size: 1rem;
    color: #555;
    margin-top: 5px;
}

.hidden {
    display: none;
}

footer {
    text-align: center;
    padding: 20px;
    margin-top: 40px;
    background-color: #2c3e50;
    color: #ecf0f1;
    font-size: 0.9rem;
}
`;

const JS_CONTENT = `
const scheduleData = /* INJECT_SCHEDULE_DATA_HERE */;
const scheduleContainer = document.getElementById('schedule');
const categorySearchInput = document.getElementById('categorySearch');

function renderSchedule(data) {
    scheduleContainer.innerHTML = ''; // Clear previous content
    data.forEach(item => {
        const card = document.createElement('div');
        if (item.type === 'talk') {
            card.className = 'talk-card';
            card.innerHTML = \`
                <span class="time">\${item.startTime} - \${item.endTime}</span>
                <h2>\${item.title}</h2>
                <p class="speakers">Speakers: \${item.speakers.join(', ')}</p>
                <div class="categories">
                    \${item.category.map(cat => \`<span class="category">\${cat}</span>\`).join('')}
                </div>
                <p class="description">\${item.description}</p>
            \`;
            // Add categories as a data attribute for easier searching
            card.dataset.categories = item.category.map(c => c.toLowerCase()).join(' ');
        } else if (item.type === 'break') {
            card.className = 'break-card';
            card.innerHTML = \`
                <span class="time">\${item.startTime} - \${item.endTime}</span>
                <p>\${item.title}</p>
            \`;
        }
        scheduleContainer.appendChild(card);
    });
}

function filterSchedule() {
    const searchTerm = categorySearchInput.value.toLowerCase().trim();
    const talkCards = scheduleContainer.querySelectorAll('.talk-card');

    talkCards.forEach(card => {
        const categories = card.dataset.categories || '';
        if (searchTerm === '' || categories.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    // For breaks, always show them.
    scheduleContainer.querySelectorAll('.break-card').forEach(card => {
        card.classList.remove('hidden'); // Ensure breaks are always visible
    });
}

// Initial render
renderSchedule(scheduleData);

// Event listener for search input
categorySearchInput.addEventListener('input', filterSchedule);
`;

// Inject actual schedule data into the JavaScript content
const finalJsContent = JS_CONTENT.replace(
    '/* INJECT_SCHEDULE_DATA_HERE */',
    JSON.stringify(GENERATED_SCHEDULE, null, 4) // Pretty print for readability
);

// Combine all parts into the final HTML
const finalHtmlContent = HTML_TEMPLATE
    .replace('/* INJECT_CSS_HERE */', CSS_CONTENT)
    .replace('/* INJECT_JS_HERE */', finalJsContent);

// Write the file
const outputPath = path.join(process.cwd(), 'index.html');
fs.writeFileSync(outputPath, finalHtmlContent, 'utf8');

console.log(`Successfully generated index.html at ${outputPath}`);
