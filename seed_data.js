
const BASE_URL = 'https://the-owners-hackbyifri-2026.onrender.com/api/v1';

async function seed() {
    console.log('--- Starting Seeding ---');

    try {
        // 1. Register Professor
        console.log('Registering Professor...');
        const profReg = await fetch(`${BASE_URL}/auth/register/professor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'prof.test@kplon-nu.bj',
                password: 'Password123!',
                expertiseField: 'Informatique'
            })
        });
        const profRegData = await profReg.json();
        console.log('Prof Register status:', profReg.status, profRegData.message || '');

        // 2. Register Student
        console.log('Registering Student...');
        const studReg = await fetch(`${BASE_URL}/auth/register/student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Alice',
                lastName: 'Sidi',
                email: 'student.test@kplon-nu.bj',
                password: 'Password123!',
                studyYear: 2,
                studentId: 'UAC/2026/0123',
                majors: ['Génie Logiciel']
            })
        });
        const studRegData = await studReg.json();
        console.log('Student Register status:', studReg.status, studRegData.message || '');

        // 3. Login Professor
        console.log('Logging in Professor...');
        const profLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'prof.test@kplon-nu.bj', password: 'Password123!' })
        });
        const profAuth = await profLogin.json();
        const profToken = profAuth.token || profAuth.data?.token;
        console.log('Prof Login status:', profLogin.status);

        if (!profToken) throw new Error('Failed to get Prof Token');

        // 4. Create Classroom
        console.log('Creating Classroom...');
        const classRes = await fetch(`${BASE_URL}/classrooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${profToken}`
            },
            body: JSON.stringify({
                name: 'Algorithmique & Structures de Données',
                subject: 'Informatique',
                description: 'Cours fondamental sur les algorithmes de tri et les structures complexes.'
            })
        });
        const classData = await classRes.json();
        const inviteCode = classData.data?.inviteCode;
        console.log('Classroom created:', inviteCode);

        // 5. Login Student
        console.log('Logging in Student...');
        const studLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'student.test@kplon-nu.bj', password: 'Password123!' })
        });
        const studAuth = await studLogin.json();
        const studToken = studAuth.token || studAuth.data?.token;
        console.log('Student Login status:', studLogin.status);

        if (!studToken) throw new Error('Failed to get Student Token');

        // 6. Join Classroom
        if (inviteCode) {
            console.log('Student joining classroom...');
            const joinRes = await fetch(`${BASE_URL}/classrooms/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${studToken}`
                },
                body: JSON.stringify({ inviteCode })
            });
            console.log('Join status:', joinRes.status);
        }

        console.log('--- Seeding Completed Successfully ---');
        console.log('Prof: prof.test@kplon-nu.bj / Password123!');
        console.log('Student: student.test@kplon-nu.bj / Password123!');
        console.log('Invite Code:', inviteCode);

    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

seed();
