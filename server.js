const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://ghosttea:cataphractus>@firstcluster.za0wx.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('fail to connect'));

    const Item = mongoose.model('Item', new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String }
    }));
    

//create item (post)
app.post('/items', async (req, res) => {
    const { name, description } = req.body;
    try {
        const newItem = new Item({ name, description });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: 'failed to create item' });
    }
});

//get all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'failed to get items' });
    }
});

//update item (put)
app.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ error: 'item not found' });
        }
        item.name = name;
        item.description = description;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'failed to update item' });
    }
});

//delete item (delete)
app.delete('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'item not found' });
        }
        res.json(deletedItem);
    } catch (err) {
        res.status(500).json({ error: 'failed to delete item' });
    }
});

//start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
