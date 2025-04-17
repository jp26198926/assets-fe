
const express = require('express');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');
const trailLogger = require('../middleware/trailLogger');

const router = express.Router();

// Create a new item
router.post('/', auth, trailLogger('item'), async (req, res) => {
  try {
    const { typeId, itemName, brand, serialNo, otherDetails } = req.body;
    
    const item = new Item({
      typeId,
      itemName,
      brand,
      serialNo,
      otherDetails,
      createdBy: req.user._id
    });
    
    await item.save();
    
    res.status(201).send(item);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all items
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ status: { $ne: 'deleted' } })
      .populate('typeId')
      .sort({ createdAt: -1 });
    
    res.send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a specific item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({ 
      _id: req.params.id,
      status: { $ne: 'deleted' }
    }).populate('typeId');
    
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
    
    res.send(item);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update an item
router.put('/:id', auth, trailLogger('item'), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['typeId', 'itemName', 'brand', 'serialNo', 'otherDetails', 'status'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates' });
    }
    
    const item = await Item.findOne({
      _id: req.params.id,
      status: { $ne: 'deleted' }
    });
    
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
    
    updates.forEach(update => item[update] = req.body[update]);
    item.updatedAt = new Date();
    item.updatedBy = req.user._id;
    
    await item.save();
    
    res.send(item);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete an item (soft delete)
router.delete('/:id', auth, trailLogger('item'), async (req, res) => {
  try {
    const { reason } = req.body;
    
    const item = await Item.findOne({
      _id: req.params.id,
      status: { $ne: 'deleted' }
    });
    
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
    
    item.status = 'deleted';
    item.deletedAt = new Date();
    item.deletedBy = req.user._id;
    item.deletedReason = reason;
    
    await item.save();
    
    res.send({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get item history (assignments and repairs)
router.get('/:id/history', auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Get the item details
    const item = await Item.findOne({ 
      _id: itemId,
      status: { $ne: 'deleted' }
    }).populate('typeId');
    
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
    
    // Get assignment history
    const assignments = await Assign.find({ itemId })
      .populate('roomId')
      .populate('assignedBy', 'firstname lastname')
      .sort({ date: -1 });
      
    // Get repair history  
    const repairs = await Repair.find({ itemId })
      .populate('reportBy', 'firstname lastname')
      .populate('checkedBy', 'firstname lastname')
      .sort({ date: -1 });
      
    res.send({
      item,
      assignments,
      repairs
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
