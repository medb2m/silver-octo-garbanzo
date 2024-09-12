import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import errorHandler from './_middleware/error-handler.js'

import User from './models/user.model.js';
import jwt from 'jsonwebtoken';
import { config } from './_helpers/config.js';

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Chat imports
import { createServer } from 'http';
import { Server } from 'socket.io';



//  Routes Imports
import userRoutes from './routes/user.routes.js'
import PlacesRouter from './routes/places.routes.js'
import entityRouter from './routes/entity.routes.js'
import ReportRouter from './routes/report.routes.js'
import NotificationRouter from './routes/notification.routes.js'
import SocialRouter from './routes/social.routes.js'

const { secret } = config;

const __dirname = dirname(fileURLToPath(import.meta.url));

// Express Init
const app = express();
// HTTP Server
const httpServer = createServer(app)
// Init Socket.io with the HTTP Server
const io = new Server(httpServer, {
    cors: {
        /* origin: ['http://localhost:4200'], */
        origin: ['*'],
        methods: ['GET', 'POST']
    }
});

// Socket Event Management
io.on('connection', (socket) => {
  console.log('a user connected ');

  socket.on('message', async (token,message,time,pdp) => {
      const decoded = jwt.verify(token, secret);
          const user = await User.findById(decoded.id);
          if (!user) {
              console.error('Authentication error: User not found');
              return next(new Error('User not found'));
          }else {
              socket.user = user;
              pdp = user.image
          }
    console.log('token222');
    io.emit('message', message ,pdp, time, socket.user.username );
    console.log('token333');
  }); 

  
  socket.on('disconnection', () => {
    console.log('a user disconnected!')
  })

})




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"))
// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));




// Images Routes
app.use('/img', express.static(path.join(__dirname, 'public', 'images')))
// Videos Routes
app.use('/vid', express.static(path.join(__dirname, 'public', 'videos')))
// Pdfs Routes
app.use('/pdf', express.static(path.join(__dirname, 'public', 'pdf')))


// auth routes
app.use('/api/accounts', userRoutes);

// Entity Router
app.use('/api/entity', entityRouter)

// Places Router
app.use('/api/places', PlacesRouter)

// Report Router
app.use('/api/report', ReportRouter)

// Notification Router
app.use('/api/notification', NotificationRouter)

// Social Router
app.use('/api/social', SocialRouter)



// global error handler
app.use(errorHandler);

// start server
const port = 4000;
httpServer.listen(port,   () => {
    console.log('Server listening on port ' + port);
})