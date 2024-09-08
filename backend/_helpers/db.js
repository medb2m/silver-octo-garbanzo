import { config } from './config.js';
import mongoose from 'mongoose'



// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || config.connectionString)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Arrêter le processus si la connexion échoue
    });

// Utilisation de Promise globale
mongoose.Promise = global.Promise;


// Fonction pour valider les ObjectId
export function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
