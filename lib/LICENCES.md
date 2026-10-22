# Licences des bibliothèques du dossier `lib/`

Ce dossier contient des copies figées de bibliothèques écrites par d'autres
auteurs. Elles gardent leur propre licence, et non celle de Suivi Calorique
(décrite dans le fichier `LICENSE` à la racine du dépôt).

Les textes de licence sont copiés sans aucune modification depuis les paquets
officiels (registre npm et dépôt officiel du modèle de français). Chaque
fichier de `lib/` a été comparé, octet par octet, à celui du paquet officiel :
ils sont identiques.

| Fichier(s) | Bibliothèque | Version | Licence | Texte de la licence |
|---|---|---|---|---|
| `html5-qrcode.min.js` | [html5-qrcode](https://github.com/mebjas/html5-qrcode) | 2.3.8 | Apache 2.0 | `LICENSE-html5-qrcode.txt` |
| inclus dans `html5-qrcode.min.js` | [ZXing](https://github.com/zxing-js/library) (Copyright 2008 ZXing authors) | — | Apache 2.0 | même texte : `LICENSE-html5-qrcode.txt` |
| `tesseract/tesseract.min.js`, `tesseract/worker.min.js` | [Tesseract.js](https://github.com/naptha/tesseract.js) | 6.0.1 | Apache 2.0 | `tesseract/LICENSE-tesseract.js.txt` |
| inclus dans ces deux fichiers | petites bibliothèques regroupées par Tesseract.js (regenerator-runtime, buffer, ieee754, zlib.js) | — | MIT ou BSD-3-Clause | `tesseract/tesseract.min.js.LICENSE.txt` et `tesseract/worker.min.js.LICENSE.txt` |
| `tesseract/tesseract-core-lstm.wasm.js` | [tesseract.js-core](https://github.com/naptha/tesseract.js-core) (le moteur Tesseract préparé pour le navigateur) | 6.0.0 | Apache 2.0 | `tesseract/LICENSE-tesseract.js-core.txt` |
| `tesseract/lang-data/fra.traineddata.gz` | Modèle de français de [Tesseract](https://github.com/tesseract-ocr/tessdata_best), variante « best_int » du paquet `@tesseract.js-data/fra` 1.0.0 | — | Apache 2.0 | `tesseract/lang-data/LICENSE-tessdata_best.txt` |

Les deux fichiers `*.min.js.LICENSE.txt` portent exactement le nom indiqué
dans la première ligne de `tesseract.min.js` et de `worker.min.js` (« For
license information please see … ») : ne pas les renommer.

Ces textes ne servent pas au fonctionnement de l'application : ils ne sont pas
dans la liste `FICHIERS` de `sw.js` (pas besoin hors ligne).

**Mettre à jour une bibliothèque** : remplacer aussi son texte de licence par
celui de la nouvelle version, et corriger le tableau ci-dessus.
