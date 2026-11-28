# Recueil « La Source du Matin » (livre)

Livre A5 qui rassemble les versets publiés sur La Source du Matin (avel-lumiere.github.io/la-source-du-matin/ et /parole-et-lumiere/) et sur Ma course spirituelle (avel-lumiere.github.io/ma-course-spirituelle/), avec leur méditation, leur pensée du jour et leur prière.

- `recueil.json` : le contenu du livre. Chaque jour contient `date` (date de publication), `app` (`src` = La Source du Matin, `course` = Ma course spirituelle), `title`, `ref`, `verse`, `med` (liste de paragraphes), `pensee`, `priere` et `chrono`, et parfois `encadre` ({titre, lignes}) : un encadré sous le verset ; `encadre_fin` (même forme) : un encadré en bas du jour, après la prière (ex. Jean 1:1-5 : « il y eut un soir, et il y eut un matin ») ; ajouté à la demande de Maguy (ex. jour de 1 Corinthiens 15:3 : « Qu’est-ce que le péché ? »).
- `build.py` : refait le PDF (`python3 recueil/build.py`, avec ReportLab et les polices DejaVu Serif).
- `La_Source_du_Matin_recueil.pdf` : le livre.

## Ordre des jours : par thèmes (depuis le 26 nov. 2026)

Le livre est organisé en chapitres thématiques (décision de Maguy, 26 nov. 2026). La liste des thèmes (18 depuis le 26 nov. : ajout de « La foi », « La solitude », « Le repos de Dieu » et « Les fruits de l’Esprit »), avec leur titre et leur introduction, est dans `recueil.json` → `themes` ; chaque jour a un champ `theme`. Un chapitre sans méditation n'apparaît pas. À l'intérieur d'un chapitre, les jours restent dans l'ordre de l'histoire biblique (`chrono`, voir les repères ci-dessous), puis la date de publication. Les numéros « Jour 1, 2… » (`n`) se recalculent à chaque ajout (trier par ordre du thème, `chrono`, `date`, `order`).

Le calendrier des thèmes du matin est dans `calendrier-themes.md`.

### Repères `chrono` (ordre biblique à l'intérieur d'un thème)

| chrono | Période |
|---|---|
| 100–199 | Création (Genèse 1–2) |
| 200–299 | Chute, Caïn, Noé, Babel (Genèse 3–11) |
| 300–399 | Patriarches : Abraham, Isaac, Jacob, Joseph (Genèse 12–50 ; Job) |
| 400–599 | Moïse, l'Exode et le désert (Exode à Nombres) |
| 600–649 | Deutéronome, dernières paroles de Moïse |
| 650–799 | Josué, les Juges, Ruth |
| 800–999 | Samuel et Saül |
| 1000–1099 | David (ses psaumes, 1–2 Samuel) |
| 1100–1199 | Salomon (Proverbes, Ecclésiaste, Cantique, 1 Rois 1–11) |
| 1200–1399 | Royaumes divisés : Élie, Élisée, Ézéchias ; psaumes de Koré et d'Asaph ; Osée, Amos, Michée |
| 1400–1449 | Ésaïe |
| 1450–1549 | Jérémie, chute de Jérusalem, Lamentations, Ézékiel |
| 1550–1599 | Exil : Daniel, Esther |
| 1600–1699 | Retour d'exil : Esdras, Néhémie, Aggée, Zacharie, Malachie ; psaumes de louange du Temple (Ps 118…) |
| 2000–2099 | Le Verbe et la naissance de Jésus (Jean 1, Matthieu 1–2, Luc 1–2) |
| 2100–2199 | Baptême et tentation de Jésus |
| 2200–2499 | Ministère en Galilée : enseignements, Sermon sur la montagne, miracles, appels |
| 2500–2749 | Montée vers Jérusalem : paraboles de Luc, Zachée, Lazare |
| 2750–2849 | Dernière semaine, dernier repas (Jean 13–17), Gethsémané |
| 2850–2899 | Crucifixion |
| 2900–2949 | Mort pour nos péchés (1 Corinthiens 15:3) |
| 2950–2999 | Résurrection et apparitions, ascension |
| 3000–3049 | Pentecôte : venue du Saint-Esprit (Actes 2) |
| 3050–3099 | L'Église naissante (Actes) |
| 3100–3799 | La mission continue : lettres des apôtres, dans l'ordre où elles ont été écrites (1 Thessaloniciens ~3100, Galates, 1–2 Corinthiens, Romains ~3200, Éphésiens/Colossiens ~3300, Philippiens ~3400, 1 Timothée/Tite, 2 Timothée ~3600, Hébreux, Jacques, Pierre, Jean, Jude ~3700) |
| 3800–3899 | Apocalypse |

Un psaume va à l'époque de son auteur ou de son titre (David → 1000 ; Psaume 3 = fuite devant Absalom ; Koré → 1300 ; sans titre → selon son contenu). Un livre de sagesse va à l'époque de son auteur.

## Règles

- Méditations et pensées du jour au **« vous »** (décision de Maguy, 26 nov. 2026) ; prières au « je », en tutoyant Dieu ; les textes de Maguy écrits au « nous » restent au « nous ».

- Pas de doublons : un même verset n'apparaît qu'une fois dans le livre (on garde la méditation la plus riche). Les doublons retirés le 26 nov. 2026 sont conservés dans `recueil.json` → `doublons_retires` (non imprimés).

- Versets toujours en Louis Segond 1910 (texte dans `../lsg1910.json`) : convertir quand le site a une autre version (BFC, Semeur…).
- Méditation, pensée et prière reprises mot pour mot depuis les sites. Seules exceptions : les emoji sont retirés et la ponctuation est mise à la française.
- Quand un verset publié n'a pas de titre, Claude en propose un et le signale à Maguy.
