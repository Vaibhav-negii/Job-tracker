const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/application', async(req,res) =>{
    const statusFilter = req.query.status;
    const applications = await prisma.application.findMany({
           where : statusFilter ? {status :statusFilter} :{}
    })
    res.json(applications);
})
app.get('/api/application/:id',async (req,res)=>{
    try{
    const id = Number(req.params.id);
    if(!Number.isInteger(id)|| id<=0){
       return res.status(400).json({error: "Application id is invalid"});
    }
    
    const oneApplication = await prisma.application.findUnique(
        {
            where:{id}
        }
    )
    if(!oneApplication){
      return  res.status(404).json({error : "Application not found"});
    }
    return res.json(oneApplication);
}catch(error){
    console.error("Error while fetching Application",error);
    return res.status(500).json({error:"Something went wrong while fetching Application"});


}
})

app.post('/api/application', async (req, res) => {
    const newApplication = await prisma.application.create({
        data: {
            company: req.body.company,
            role: req.body.role,
            jobLink: req.body.jobLink,
            location: req.body.location,
            source: req.body.source
        }
    })
    res.json(newApplication);
})

app.patch('/api/application/:id', async (req, res) => {
    const id = Number(req.params.id);
    const notes = req.body.notes;
    const status = req.body.status;
    const updatedApplication = await prisma.application.update({
        where:{id},
        data:{status, notes}
    })
    res.json(updatedApplication);
});

app.delete('/api/application/:id', async (req, res) => {
    const id = Number(req.params.id);
    await prisma.application.delete({
        where: { id: id }
    })
    res.json({ message: "Application deleted" });
})

app.listen(5000, () => {
    console.log("running on http://localhost:5000");
})