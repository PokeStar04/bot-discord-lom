const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');

const app = express();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const User = require('../models/users')(sequelize, Sequelize);

app.use(cors());
app.use(express.json()); // Middleware pour parser le corps des requêtes en tant qu'objet JSON

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/updateUsers', async (req, res) => {
    const updatedUsers = req.body; // Utilisateurs mis à jour envoyés depuis votre site internet

    try {
        // Vérifiez que les données envoyées sont sous forme de tableau
        if (!Array.isArray(updatedUsers)) {
            throw new Error('Invalid format: expected an array of objects');
        }

        // Boucle sur chaque utilisateur mis à jour
        for (const updatedUser of updatedUsers) {
            const userId = updatedUser.id; // Utiliser id plutôt que userId

            // Créez un objet pour stocker les données de mise à jour
            const updateData = {};

            // Vérifiez quels champs sont présents dans l'objet utilisateur mis à jour
            if (updatedUser.ordreTour !== undefined) updateData.ordreTour = updatedUser.ordreTour;
            if (updatedUser.power !== undefined) updateData.power = updatedUser.power;
            if (updatedUser.positionTour !== undefined) updateData.positionTour = updatedUser.positionTour;

            // Effectuer les mises à jour dans la base de données pour chaque utilisateur
            const user = await User.findByPk(userId);
            if (user) {
                await user.update(updateData);
            } else {
                console.error(`User with ID ${userId} not found`);
            }
        }

        res.status(200).json({ message: 'Users updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://51.254.96.184:${port}`);
});
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VisAVis({ clanId }) {
    const [clanMembers, setClanMembers] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [duelsH, setDuelsH] = useState([]);
    const [duelsM, setDuelsM] = useState([]);
    const [duelsB, setDuelsB] = useState([]);
    const [maxDuelIsPossibleTowerH, setMaxDuelIsPossibleTowerH] = useState(0);
    const [maxDuelIsPossibleTowerM, setMaxDuelIsPossibleTowerM] = useState(0);
    const [maxDuelIsPossibleTowerB, setMaxDuelIsPossibleTowerB] = useState(0);
    const [unopposedMembers, setUnopposedMembers] = useState({
        H: [],
        M: [],
        B: [],
    });
    const [unopposedEnemies, setUnopposedEnemies] = useState({
        H: [],
        M: [],
        B: [],
    });

    useEffect(() => {
        const fetchClanMembers = async () => {
            try {
                const response = await axios.get('http://51.254.96.184:3000/users');
                setClanMembers(response.data);

                // Variables pour les membres par position
                const membersH = response.data.filter(
                    (member) => member.positionTour === 'H',
                );
                const membersM = response.data.filter(
                    (member) => member.positionTour === 'M',
                );
                const membersB = response.data.filter(
                    (member) => member.positionTour === 'B',
                );

                // Calcul du nombre maximum de duels possibles pour chaque position
                let maxDuelsH =
                    membersH.length +
                    enemies.filter((enemy) => enemy.positionTour === 'H').length;
                let maxDuelsM =
                    membersM.length +
                    enemies.filter((enemy) => enemy.positionTour === 'M').length;
                let maxDuelsB =
                    membersB.length +
                    enemies.filter((enemy) => enemy.positionTour === 'B').length;

                // Mise à jour des valeurs pour tenir compte des ennemis
                setMaxDuelIsPossibleTowerH(maxDuelsH);
                setMaxDuelIsPossibleTowerM(maxDuelsM);
                setMaxDuelIsPossibleTowerB(maxDuelsB);
            } catch (error) {
                console.error('Error fetching clan members:', error);
            }
        };

        const fetchEnemies = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/member/getClanMembers/${clanId}`,
                );
                setEnemies(response.data);
            } catch (error) {
                console.error('Error fetching enemies:', error);
            }
        };

        fetchClanMembers();
        fetchEnemies();
    }, [clanId]);

    useEffect(() => {
        const generateDuels = () => {
            const newDuelsH = [];
            const newDuelsM = [];
            const newDuelsB = [];

            const filterMembersByPosition = (position) =>
                clanMembers.filter((member) => member.positionTour === position);

            const filterEnemiesByPosition = (position) =>
                enemies.filter((enemy) => enemy.positionTour === position);

            const generateDuelsForPosition = (position, targetList) => {
                const members = filterMembersByPosition(position);
                const enemies = filterEnemiesByPosition(position);
                const totalDuels = Math.min(members.length, enemies.length);

                for (let i = 0; i < totalDuels; i++) {
                    targetList.push({
                        member: members[i],
                        enemy: enemies[i],
                        isDead: false,
                    });
                }

                // Générer des membres restants
                for (let j = totalDuels; j < members.length; j++) {
                    targetList.push({ member: members[j], enemy: null, isDead: false });
                }

                // Générer des ennemis restants sans opposition
                const unopposedEnemiesForPosition = enemies.slice(totalDuels);
                setUnopposedEnemies((prevUnopposedEnemies) => ({
                    ...prevUnopposedEnemies,
                    [position]: unopposedEnemiesForPosition.map((e) => e.ordreTour),
                }));

                // Générer des membres restants sans opposition
                const unopposedMembersForPosition = members.slice(totalDuels);
                setUnopposedMembers((prevUnopposedMembers) => ({
                    ...prevUnopposedMembers,
                    [position]: unopposedMembersForPosition.map((m) => m.ordreTour),
                }));
            };

            generateDuelsForPosition('H', newDuelsH);
            generateDuelsForPosition('M', newDuelsM);
            generateDuelsForPosition('B', newDuelsB);

            setDuelsH(newDuelsH);
            setDuelsM(newDuelsM);
            setDuelsB(newDuelsB);
        };

        generateDuels();
    }, [clanMembers, enemies]);

    const handleMemberDeath = (positionTour, index) => {
        switch (positionTour) {
            case 'H':
                setDuelsH((prevDuels) =>
                    prevDuels.map((duel, i) =>
                        i === index ? { ...duel, isDead: true } : duel,
                    ),
                );
                break;
            case 'M':
                setDuelsM((prevDuels) =>
                    prevDuels.map((duel, i) =>
                        i === index ? { ...duel, isDead: true } : duel,
                    ),
                );
                break;
            case 'B':
                setDuelsB((prevDuels) =>
                    prevDuels.map((duel, i) =>
                        i === index ? { ...duel, isDead: true } : duel,
                    ),
                );
                break;
            default:
                break;
        }
    };

    const moveEnemyToNextOpponent = (positionTour, index, selectedEnemy) => {
        const targetList =
            positionTour === 'H'
                ? duelsH
                : positionTour === 'M'
                    ? duelsM
                    : positionTour === 'B'
                        ? duelsB
                        : [];

        const currentDuel = targetList[index];
        console.log('Enemy from checked duel:', currentDuel.enemy);

        console.log('Current duel:', currentDuel);

        // Mettre à jour le duel avec les données de l'ennemi sélectionné
        currentDuel.enemy = selectedEnemy;
        console.log('Enemy from checked duel:', selectedEnemy);

        // Chercher le prochain membre disponible dans unopposedMembers
        const nextAvailableMember = unopposedMembers[positionTour].reduce(
            (prevMember, currMember) =>
                prevMember.ordreTour < currMember.ordreTour ? prevMember : currMember,
            unopposedMembers[positionTour][0], // initial value
        );

        console.log('Next available member:', nextAvailableMember);

        // Mettre à jour le duel avec le prochain membre disponible
        currentDuel.member = nextAvailableMember;

        switch (positionTour) {
            case 'H':
                setDuelsH(targetList);
                break;
            case 'M':
                setDuelsM(targetList);
                break;
            case 'B':
                setDuelsB(targetList);
                break;
            default:
                break;
        }
    };

    const sortedDuelsH = duelsH.sort(
        (a, b) => a.member.ordreTour - b.member.ordreTour,
    );

    return (
        <div>
            <h2>Vis-à-vis des membres du clan et des ennemis</h2>
            <div>
                <h3>Tour Position H</h3>
                <p>
                    Nombre maximum de duels possibles pour la tour H:{' '}
                    {maxDuelIsPossibleTowerH}
                </p>
                <ol>
                    {Array.from({ length: maxDuelIsPossibleTowerH }, (_, index) => {
                        const duel = sortedDuelsH[index];
                        return (
                            <li key={index}>
                                {duel && duel.member ? (
                                    <span>
                                        Membre: {duel.member.pseudo} (Puissance: {duel.member.power}
                                        )
                                        {duel.enemy ? (
                                            <span>
                                                {' '}
                                                Ennemi: {duel.enemy.pseudo} (Puissance:{' '}
                                                {duel.enemy.power})
                                            </span>
                                        ) : (
                                            <span> Ennemi: Aucun ennemi pour le moment</span>
                                        )}
                                    </span>
                                ) : (
                                    <span>Aucun membre disponible</span>
                                )}
                                {!duel || !duel.isDead ? (
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            handleMemberDeath('H', index);
                                            moveEnemyToNextOpponent('H', index);
                                        }}
                                    />
                                ) : null}
                            </li>
                        );
                    })}
                </ol>
                {maxDuelIsPossibleTowerH === 0 && (
                    <p>Aucun membre disponible pour cette tour</p>
                )}
            </div>
            {/* Les autres tours (M et B) suivent un modèle similaire */}
        </div>
    );
}

export default VisAVis;
