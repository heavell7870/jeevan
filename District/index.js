const express = require('express');
const authenticateToken = require('../middleware/authenticate');
const DistrictSchema = require('./model');


const districtApp = express.Router();

districtApp.use(express.json());


// districtApp.post('/edit/:district', authenticateToken, async (req, res) => {


//     const district = req.params?.district;

//     const { district_name, state } = req.body;

//     if (!district) {
//         return res.json({ status: 'failed', msg: 'District not present.' });
//     }

//     const size = Object.keys(req.body).length;

//     if (size == 0) {
//         return res.json({ status: 'failed', msg: 'Nothing to update' });
//     }


//     try {

//         await DistrictSchema.updateOne({ district, state }, { district:district_name, state });

//     } catch (e) {
//         console.log(e)
//         return res.json({ status: "failed", msg: "Server error" })
//     }

//     return res.json({ status: "ok", msg: "Successfully updated" })

// });


districtApp.post('/add', authenticateToken, async (req, res) => {


    const { district, state } = req.body;

    if (!state) {
        return res.json({ status: 'failed', msg: 'State not present.' });
    }

    try {

        await DistrictSchema.create({ district, state });

    } catch (e) {
        console.log(e)
        return res.json({ status: "failed", msg: "Server error" })
    }

    return res.json({ status: "ok", msg: "Successfully added" })

});

districtApp.post('/delete', authenticateToken, async (req, res) => {


    const { district, state } = req.body;

    if (!state) {
        return res.json({ status: 'failed', msg: 'State not present.' });
    }

    try {

        await DistrictSchema.deleteOne({ district, state });

    } catch (e) {
        console.log(e)
        return res.json({ status: "failed", msg: "Server error" })
    }

    return res.json({ status: "ok", msg: "Successfully deleted" })

});



districtApp.get('/all', authenticateToken, async (req, res) => {

    const val = await DistrictSchema.find({})

    if (!val) {
        return res.json({ status: "failed", msg: "No district present" })
    }

    return res.json({ status: "ok", data: val })
});



module.exports = districtApp;
