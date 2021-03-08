const express = require("express");



const router = express.Router();

const Sites = require("../models/geodata");
const User = require("../models/users_new");
const validate = require("../validators");

const auth = require("../middlewares/auth");

router.post("/users", async (req, res) => {
    const {error} = validate.UserRegister(req.body)
    if (error) return res.status(400).send(error.message);
    const {username, password} = req.body;

    try {
        let user = new User({username, password})
        user = await user.save();
        const token = user.generateAuthToken();
        res.send(token)
    } catch (ex) {
        console.log(ex)
        res.status(400).send(`${username} already registered`)
    }

})

router.post("/login", async (req, res) => {
    const {error} = validate.UserRegister(req.body)
    if (error) return res.status(400).send(error.message);
    const {username, password} = req.body;
   const user = await User.findOne({username});
   if (!user) return res.status(400).send(`Username "${username}" does not exist`);
   user.comparePassword(password, function (error, isMatch) {
       if (isMatch) {
           const token = user.generateAuthToken();
           res.send(token)
       }else {
           res.status(400).send(`Password is not valid`);
       }


   })


})

router.get("/sites",auth,async (req, res) => {
    await getData(res)

})

router.post("/sites", auth,async (req, res) => {
    try {
        const {error} = validate.validateRequest(req.body);
        if (error) return res.status(400).send(error.message);

        const {site_id, site_status,site_name, lat, long } = req.body

        let site = new Sites({
            name:site_name,
            site_id,
            status:site_status,
            location:{
                coordinates:[parseFloat(long), parseFloat(lat)],
                type:"Point"
            }
        });

        await site.save();
        await getData(res)

    }catch (error){
        console.log(error);
        res.status(400).send("Site ID must be unique")
    }


})

router.put("/sites/:site_id", auth,async (req, res) =>{

    console.log(req.headers)


    try {
        console.log(req.body)
        const {error} = validate.validateRequest(req.body);
        if (error) return res.status(400).send(error.message);
        const {site_id, site_status,site_name, lat, long } = req.body


        let db_site = await Sites.findOne({site_id});
        if (db_site){
            db_site.name = site_name;
            db_site.site_id=site_id;
            db_site.status=site_status;
            db_site.location.coordinates=[parseFloat(long), parseFloat(lat)];
            await db_site.save();

        }else {
            return  res.status(400).send(`Invalid Site ID: ${site_id}`)
        }

        await getData(res)

    }catch (error){
        console.log(error);
        res.status(500).send("System Error in saving site details: Please contact sysAdmin")
    }

})

router.delete("/sites/:site_id", auth,async (req, res) =>{
    const {error} = validate.validateDelete({site_id:req.params.site_id});
    if (error) return res.status(400).send(error.message);

    const site_id = req.params.site_id;
    try {
        await Sites.deleteOne({site_id});
        await getData(res)

    }catch (error){
        console.log(error);
        res.status(400).send("Invalid site id "+site_id)
    }
})


async function getData(res) {
    const db_result = await Sites.find({},["site_id", "name","status","location"]);
    const final_result =[];
    for (const data of db_result) {
        let temp={};
        temp.site_id = data.site_id;
        temp.site_name=data.name;
        temp.status=data.status;
        temp.loc_latitude = data.location. coordinates[1];
        temp.loc_longitude=data.location.coordinates[0];
        final_result.push(temp);
    }
    return res.json(final_result)

}

module.exports  = router;
