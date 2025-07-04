require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');
const errorHandler = require('./middlewares/errorHandler')


const app = express()

app.use(express.json())
app.use(cookieParser())



app.get('/', (req, res) => {
    res.send('okay!')
})

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/comments', commentRoutes)


app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});


app.use(errorHandler);



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch(err => console.error(err));