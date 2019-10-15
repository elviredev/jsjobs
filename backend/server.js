const express = require('express');
const app = express(); // création de notre petite application
const bodyParser = require('body-parser');
let data = require('./jobs'); //récupère le tableau de jobs depuis jobs.js
// console.log('jobs :', data.jobs);
let initialJobs = data.jobs;
let addedJobs = [];

let users = [
    { id:1, email: 'sm@test.fr', nickname: 'Toto', password: 'aze', role: 'admin' },
    { id:2, email: 'sm2@test.fr', nickname: 'Toto2', password: 'qsd', role: 'user' }
];
// const fakeUser = {id:1, email: 'sm@test.fr', nickname: 'Toto', password: 'aze'};
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';
const jwt = require('jsonwebtoken');

const getAllJobs = () => {
    return [...addedJobs, ...initialJobs];
}

app.use(bodyParser.json());

//middelware autorisant l'accès de notre api à tous les clients même si ports différents (4201 et 4200)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // pour un get
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // pour un post et pour le Header Authorization
    next();
});

// Routers api
const api = express.Router();
const auth = express.Router();

// post /login
auth.post('/login', (req, res) => {
    console.log('req.body ', req.body);
    if(req.body) {
        const email = req.body.email.toLowerCase().trim();
        const password = req.body.password.toLowerCase().trim();
        const index = users.findIndex(user => user.email === email);

        if(index > -1 && users[index].password === password) {
            let user = users[index];
            let token = '';
            if(user.email === 'sm@test.fr') {
                token = jwt.sign({ iss: 'http://localhost:4201', role: 'admin', email: req.body.email, nickname: user.nickname }, secret);
            } else {
                token = jwt.sign({ iss: 'http://localhost:4201', role: 'user', email: req.body.email, nickname: user.nickname }, secret);
            }
           
            res.json({ success: true, token: token });

        } else {
            res.status(401).json({ success: false, message: 'identifiants incorrects' });
        }
    } else {
        res.status(500).json({ success: false, message: 'données manquantes '});
    }
});

// post /register
auth.post('/register', (req, res) => {
    console.log('req.body', req.body);
    if(req.body){
        // récupération email + mdp
        const email = req.body.email.toLowerCase().trim();
        const password = req.body.password.toLowerCase().trim();
        const nickname = req.body.nickname.trim();
        // création nouvel user qu'on place avant tableau users préexistant
        users = [{id: Date.now(), email: email, password: password, nickname: nickname},...users];
        res.json({ success: true, users: users });
    } else {
        res.json({ success: false, message: 'la création a échoué'});
    }
});

// get /jobs
api.get('/jobs', (req, res) => {
    res.json(getAllJobs());
});

// get /jobs/:email //*\ si on place ce get après /jobs/:id la page detail de l'offre sera visible mais plus celle-ci
api.get('/jobs/email/:email', (req, res) => {
    const email = req.params.email;
    const jobs = getAllJobs().filter(job => job.email === email);
    res.json({ success: true, jobs });
});

// middleware Header Authorization
const checkUserToken = (req, res, next) => {
    // Authorization: Bearer azeazeazeazeazeazeazeazeaze123azrett55frhHGF45eerty
    if(!req.header('authorization')) {
        return res.status(401).json({ success: false, message: "Header d'authentification manquant" });
    }

    const authorizationHeaderParts = req.header('authorization').split(' ');
    // récupération du token
    let token = authorizationHeaderParts[1];
    // vérification du token récupéré
    jwt.verify(token, secret, (err, decodedToken) => {
        if(err){
            console.log(err);
            return res.status(401).json({ success: false, message: 'Token non valide' });
        } else {
            console.log('decodedToken', decodedToken);
            next();
        }
    });
   
};

// post /jobs
api.post('/jobs', checkUserToken, (req, res) => {
    console.log('************************');
    const job = req.body;
    console.log('received job on POST to /jobs', job);
    addedJobs = [job, ...addedJobs];
    console.log('total nb of jobs', getAllJobs().length);
    res.json(job);
});

// get /search
api.get('/search/:term/:place?', (req, res) => {
    const term = req.params.term.toLowerCase().trim();
    let place = req.params.place;
    let jobs = getAllJobs().filter(j => (j.description.toLowerCase().includes(term) || j.title.toLowerCase().includes(term) ));

    if(place){
        // on nettoie place
        place = place.toLowerCase().trim();
        // on filtre sur la place
        jobs = jobs.filter(j => (j.city.toLowerCase().includes(place) ));
    }
    res.json({ success: true, jobs });
});

// get by id /jobs
api.get('/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const job = getAllJobs().filter(j => j.id === id);
    if(job.length === 1){
        res.json({success: true, job: job[0]});
    } else {
        res.json({success: false, message: `pas de job ayant pour id ${id}`});
    }
});


app.use('/api', api);
app.use('/auth', auth);

const port = 4201;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
