const http = require('http');
const fs = require('fs');
require('dotenv').config();

const PORT = process.env.PORT || 5002;
let BASE_URL = `http://127.0.0.1:${PORT}/api/v1`;

async function checkConnection() {
    const addresses = [`http://localhost:${PORT}/api/v1`, `http://127.0.0.1:${PORT}/api/v1`];
    for (const addr of addresses) {
        try {
            await new Promise((resolve, reject) => {
                const req = http.get(`${addr}/health`, { timeout: 1000 }, (res) => resolve(res));
                req.on('error', reject);
                req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
            });
            BASE_URL = addr;
            return true;
        } catch (e) { }
    }
    return false;
}

let studentToken = '';
let professorToken = '';
let classroomId = '';
let exerciseId = '';
let sessionId = '';
let videoId = '';

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m"
};

async function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}${path}`;
        console.log(`${colors.yellow}   -> ${method} ${url}${colors.reset}`);

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                let json = {};
                try {
                    json = JSON.parse(data);
                } catch (e) {
                    json = { raw: data };
                }
                resolve({ status: res.statusCode, data: json });
            });
        });

        req.on('error', (err) => {
            console.error(`${colors.red}      Error: ${err.message}${colors.reset}`);
            reject(err);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log(`${colors.cyan}=== Backend Endpoint Testing Started ===${colors.reset}\n`);

    const connected = await checkConnection();
    if (!connected) {
        console.error(`${colors.red}[ERROR] Impossible de se connecter au serveur sur le port ${PORT}.${colors.reset}`);
        console.error(`${colors.yellow}Assurez-vous que 'node server.js' tourne bien dans un autre terminal.${colors.reset}`);
        return;
    }
    console.log(`${colors.green}ℹ️ Connecté à ${BASE_URL}${colors.reset}\n`);

    try {
        // --- 1. HEALTH CHECK ---
        console.log(`${colors.magenta}[1/7] Health Check${colors.reset}`);
        const health = await request('GET', '/health');
        if (health.status === 200) {
            console.log(`${colors.green}[OK] Health check passed${colors.reset}`);
        } else {
            console.log(`${colors.red}[FAIL] Health check failed: ${health.status}${colors.reset}`);
        }

        // --- 2. AUTHENTICATION ---
        console.log(`\n${colors.magenta}[2/7] Authentication${colors.reset}`);

        // Register Student
        const studentReg = await request('POST', '/auth/register/student', {
            firstName: "Test",
            lastName: "Student",
            email: `student_${Date.now()}@test.com`,
            password: "password123",
            studyYear: "Licence 3",
            studentId: "ST12345",
            majors: ["Informatique"]
        });
        if (studentReg.status === 201) {
            studentToken = studentReg.data.token;
            console.log(`${colors.green}[OK] Student registration successful${colors.reset}`);
        } else {
            console.log(`${colors.red}[FAIL] Student registration failed: ${studentReg.status} - ${studentReg.data.message}${colors.reset}`);
        }

        // Register Professor
        const profReg = await request('POST', '/auth/register/professor', {
            firstName: "Test",
            lastName: "Professor",
            email: `prof_${Date.now()}@test.com`,
            password: "password123",
            expertiseField: "Mathématiques"
        });
        if (profReg.status === 201) {
            professorToken = profReg.data.token;
            console.log(`${colors.green}[OK] Professor registration successful${colors.reset}`);
        } else {
            console.log(`${colors.red}[FAIL] Professor registration failed: ${profReg.status} - ${profReg.data.message}${colors.reset}`);
        }

        // --- 3. CLASSROOMS ---
        console.log(`\n${colors.magenta}[3/7] Classrooms${colors.reset}`);

        const createClass = await request('POST', '/classrooms', {
            name: "Test Classroom",
            subject: "Software Testing",
            description: "Testing endpoints"
        }, professorToken);

        if (createClass.status === 201) {
            classroomId = createClass.data.data._id;
            console.log(`${colors.green}[OK] Classroom creation successful (ID: ${classroomId})${colors.reset}`);
        } else {
            console.log(`${colors.red}[FAIL] Classroom creation failed: ${createClass.status} - ${createClass.data.message}${colors.reset}`);
        }

        const getMyClasses = await request('GET', '/classrooms/mine', null, professorToken);
        if (getMyClasses.status === 200) {
            console.log(`${colors.green}[OK] Get my classrooms (Professor) successful${colors.reset}`);
        } else {
            console.log(`${colors.red}[FAIL] Get my classrooms failed: ${getMyClasses.status}${colors.reset}`);
        }

        // --- 4. BOT MƐSI ---
        console.log(`\n${colors.magenta}[4/7] Bot Mɛsi${colors.reset}`);
        const askBot = await request('POST', '/bot/ask', {
            question: "Qu'est-ce qu'un test unitaire ?"
        }, studentToken);
        if (askBot.status === 200) {
            console.log(`${colors.green}[OK] Bot response received${colors.reset}`);
        } else {
            console.log(`${colors.red}[FAIL] Bot request failed: ${askBot.status} - ${askBot.data.message}${colors.reset}`);
        }

        // --- 5. COURSES ---
        console.log(`\n${colors.magenta}[5/7] Courses${colors.reset}`);
        if (!classroomId) {
            console.log(`${colors.yellow}⚠️ Skipping courses because classroomId is missing${colors.reset}`);
        } else {
            const createCourse = await request('POST', `/classrooms/${classroomId}/courses`, {
                title: "Intro to Testing",
                type: "TEXT",
                textContent: "This is a test course content."
            }, professorToken);
            if (createCourse.status === 201) {
                console.log(`${colors.green}[OK] Course creation successful${colors.reset}`);
            } else {
                console.log(`${colors.red}[FAIL] Course creation failed: ${createCourse.status} - ${createCourse.data.message}${colors.reset}`);
            }
        }

        // --- 6. EXERCISES ---
        console.log(`\n${colors.magenta}[6/7] Exercises${colors.reset}`);
        if (!classroomId) {
            console.log(`${colors.yellow}⚠️ Skipping exercises because classroomId is missing${colors.reset}`);
        } else {
            const createEx = await request('POST', `/classrooms/${classroomId}/exercises`, {
                title: "Test Exercise",
                instructions: "Write some tests",
                type: "EXERCISE",
                dueDate: new Date(Date.now() + 86400000).toISOString()
            }, professorToken);
            if (createEx.status === 201) {
                exerciseId = createEx.data.data._id;
                console.log(`${colors.green}[OK] Exercise creation successful${colors.reset}`);
            } else {
                console.log(`${colors.red}[FAIL] Exercise creation failed: ${createEx.status} - ${createEx.data.message}${colors.reset}`);
            }
        }

        // --- 7. SESSIONS ---
        console.log(`\n${colors.magenta}[7/7] Sessions${colors.reset}`);
        if (!classroomId) {
            console.log(`${colors.yellow}⚠️ Skipping sessions because classroomId is missing${colors.reset}`);
        } else {
            const createSession = await request('POST', `/classrooms/${classroomId}/sessions`, {
                title: "Live Testing Session",
                scheduledStart: new Date().toISOString(),
                scheduledEnd: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
                description: "Live demo of endpoints"
            }, professorToken);
            if (createSession.status === 201) {
                sessionId = createSession.data.data._id;
                console.log(`${colors.green}[OK] Session creation successful${colors.reset}`);
            } else {
                console.log(`${colors.red}[FAIL] Session creation failed: ${createSession.status} - ${createSession.data.message}${colors.reset}`);
            }
        }

        console.log(`\n${colors.cyan}=== Backend Endpoint Testing Completed ===${colors.reset}`);

    } catch (err) {
        console.error(`\n${colors.red}[ERROR] Unexpected error during testing:${colors.reset}`);
        console.error(err);
    }
}

runTests();
