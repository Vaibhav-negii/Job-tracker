const express = require('express');
const cors = require('cors');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/application',async(req,res)=>{
    const applications = await prisma.application.findMany();
     res.json(applications); 
})
app.post('/api/application',async(req,res)=>{
    try {
        const newApplication = await prisma.application.create({
            data :{
                company : req.body.company,
                role : req.body.role,
                jobLink : req.body.jobLink,
                location :req.body.location,
                source :req.body.source
            }
        })
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})
app.delete('/api/application/:id',async(req,res)=>{
    const id = Number(req.params.id);
    await prisma.application.delete({
        where: { id:id }
    })
     res.json({message: "Application deleted"});

})
app.listen(5000,()=>{
    console.log("running on http://localhost:5000");
})

