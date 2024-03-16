import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import pkg from 'sequelize';
const { Model } = pkg;

const sequelize = new Sequelize("sqlite::memory:");

const app = express();
app.use(express.json());

const PORT = 3000

class User extends Model {}
User.init({
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: "user" });

class Post extends Model {}
Post.init({
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
}, { sequelize, modelName: "post" });

class Comment extends Model {}
Comment.init({
    content: { type: DataTypes.TEXT, allowNull: false },
}, { sequelize, modelName: "comment" });

User.hasMany(Post);
Post.belongsTo(User);
User.hasMany(Comment);
Post.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Post);

app.post('/posts', async (req, res) => {
    const { title, content, userId } = req.body;
    try {
        const post = await Post.create({ title, content, userId });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
