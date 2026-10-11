// Petit serveur statique pour tester l'app en local (sans dépendance npm) : sert les
// fichiers du dossier passé en premier argument sur le port passé en second argument.
// Usage : node serveur-statique.js <dossier> <port>
const http = require('http');
const fs = require('fs');
const path = require('path');

const racine = path.resolve(process.argv[2] || '.');
const port = parseInt(process.argv[3], 10) || 8080;

const typesMime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.png': 'image/png'
};

http.createServer((req, res) => {
    let chemin;
    try {
        chemin = decodeURIComponent(req.url.split('?')[0]);
    } catch (e) {
        // Adresse mal formée (« %E0 » seul, par exemple) : on refuse
        // poliment au lieu de laisser le serveur s'arrêter net.
        res.writeHead(400);
        res.end('Adresse invalide');
        return;
    }
    if (chemin === '/') chemin = '/index.html';
    const fichier = path.join(racine, chemin);

    // Sécurité : une adresse du genre « /../../mes-documents » ne doit
    // jamais permettre de lire un fichier en dehors du dossier servi.
    if (fichier !== racine && !fichier.startsWith(racine + path.sep)) {
        res.writeHead(403);
        res.end('Accès refusé');
        return;
    }

    fs.readFile(fichier, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const ext = path.extname(fichier);
        res.writeHead(200, { 'Content-Type': typesMime[ext] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(port, () => console.log(`Serveur sur http://localhost:${port}`));
